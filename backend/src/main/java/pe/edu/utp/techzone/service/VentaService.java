package pe.edu.utp.techzone.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.techzone.dto.DetalleVentaDTO;
import pe.edu.utp.techzone.dto.ItemVentaRequest;
import pe.edu.utp.techzone.dto.RegistrarVentaRequest;
import pe.edu.utp.techzone.dto.VentaDTO;
import pe.edu.utp.techzone.entity.Cliente;
import pe.edu.utp.techzone.entity.DetalleVenta;
import pe.edu.utp.techzone.entity.MedioPago;
import pe.edu.utp.techzone.entity.Persona;
import pe.edu.utp.techzone.entity.Producto;
import pe.edu.utp.techzone.entity.TipoDocumento;
import pe.edu.utp.techzone.entity.Usuario;
import pe.edu.utp.techzone.entity.Venta;
import pe.edu.utp.techzone.exception.NotFoundException;
import pe.edu.utp.techzone.repository.DetalleVentaRepository;
import pe.edu.utp.techzone.repository.MedioPagoRepository;
import pe.edu.utp.techzone.repository.TipoDocumentoRepository;
import pe.edu.utp.techzone.repository.UsuarioRepository;
import pe.edu.utp.techzone.repository.VentaRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VentaService {
    private static final String USUARIO_VENDEDOR = "admin";
    private final VentaRepository ventaRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final TipoDocumentoRepository tipoDocumentoRepository;
    private final MedioPagoRepository medioPagoRepository;
    private final ClienteService clienteService;
    private final ProductoService productoService;
    private final UsuarioRepository usuarioRepository;
    private final ParametroService parametroService;

    @Transactional
    public VentaDTO registrar(RegistrarVentaRequest request) {
        Cliente cliente = clienteService.obtenerEntidad(request.getIdCliente());
        Persona vendedor = usuarioRepository.findByUsuario(USUARIO_VENDEDOR)
                .map(Usuario::getPersona)
                .orElseThrow(() -> new NotFoundException("Usuario vendedor no encontrado"));
        TipoDocumento tipoDocumento = tipoDocumentoRepository.findById(request.getTipoDocumento())
                .orElseThrow(() -> new NotFoundException("Tipo de documento no encontrado"));
        MedioPago medioPago = medioPagoRepository.findById(request.getMedioPago())
                .orElseThrow(() -> new NotFoundException("Medio de pago no encontrado"));

        String idVenta = UUID.randomUUID().toString();
        String numeroDocumento = request.getNumeroDocumento();
        if (numeroDocumento == null || numeroDocumento.isBlank()) {
            String serie = "TD002".equals(request.getTipoDocumento()) ? "F001" : "B001";
            numeroDocumento = serie + "-" + idVenta.substring(0, 8).toUpperCase();
        }

        Venta venta = Venta.builder()
                .idVenta(idVenta)
                .cliente(cliente)
                .persona(vendedor)
                .tipoDocumento(tipoDocumento)
                .numeroDocumento(numeroDocumento)
                .medioPago(medioPago)
                .fechaEmision(LocalDateTime.now())
                .build();
        ventaRepository.save(venta);

        for (ItemVentaRequest item : request.getItems()) {
            Producto producto = productoService.obtenerEntidad(item.getIdProducto());
            productoService.descontarStock(producto, item.getCantidad());
            BigDecimal precio = producto.getPrecio();
            BigDecimal subtotal = precio.multiply(BigDecimal.valueOf(item.getCantidad()));

            DetalleVenta detalle = DetalleVenta.builder()
                    .venta(venta)
                    .producto(producto)
                    .cantidad(item.getCantidad())
                    .precioUnitario(precio)
                    .subtotal(subtotal)
                    .build();
            detalleVentaRepository.save(detalle);
        }

        return buscar(idVenta);
    }

    @Transactional(readOnly = true)
    public VentaDTO buscar(String idVenta) {
        Venta venta = ventaRepository.findById(idVenta)
                .orElseThrow(() -> new NotFoundException("Venta no encontrada"));
        return toDTO(venta);
    }

    @Transactional(readOnly = true)
    public List<VentaDTO> historialCliente(String idCliente) {
        return ventaRepository.findByClienteIdClienteOrderByFechaEmisionDesc(idCliente)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<VentaDTO> listarTodas() {
        return ventaRepository.findAllByOrderByFechaEmisionDesc()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public VentaDTO toDTO(Venta venta) {
        List<DetalleVentaDTO> detalles = detalleVentaRepository.findByVentaIdVenta(venta.getIdVenta())
                .stream()
                .map(detalle -> {
                    BigDecimal cantidad = BigDecimal.valueOf(detalle.getCantidad());
                    BigDecimal igvLinea = parametroService.calcularIgvDeLinea(detalle.getSubtotal());
                    // El valor de venta es el resto, asi la linea siempre cierra:
                    // valorTotal + igv == subtotal, sin centimos perdidos.
                    BigDecimal valorTotal = detalle.getSubtotal().subtract(igvLinea).setScale(2, RoundingMode.HALF_UP);
                    BigDecimal valorUnitario = valorTotal.divide(cantidad, 2, RoundingMode.HALF_UP);

                    return DetalleVentaDTO.builder()
                            .idProducto(detalle.getProducto().getIdProducto())
                            .producto(detalle.getProducto().getNombre())
                            .cantidad(detalle.getCantidad())
                            .precioUnitario(detalle.getPrecioUnitario())
                            .valorUnitario(valorUnitario)
                            .valorTotal(valorTotal)
                            .igv(igvLinea)
                            .subtotal(detalle.getSubtotal())
                            .build();
                })
                .toList();

        BigDecimal total = detalles.stream()
                .map(DetalleVentaDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // SUNAT exige redondear por linea, no sobre el total. Asi los importes
        // impresos siempre cuadran: suma(valorTotal) + suma(igv) == total.
        BigDecimal opGravada = detalles.stream()
                .map(DetalleVentaDTO::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal igv = detalles.stream()
                .map(DetalleVentaDTO::getIgv)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        return VentaDTO.builder()
                .idVenta(venta.getIdVenta())
                .idCliente(venta.getCliente().getIdCliente())
                .cliente(venta.getCliente().getNombre() + " " + venta.getCliente().getApellido())
                .tipoDocumento(venta.getTipoDocumento().getNombre())
                .numeroDocumento(venta.getNumeroDocumento())
                .medioPago(venta.getMedioPago().getDescripcion())
                .fechaEmision(venta.getFechaEmision())
                .total(total)
                .opGravada(opGravada)
                .igv(igv)
                .igvPorcentaje(parametroService.obtenerIgvPorcentaje())
                .detalles(detalles)
                .build();
    }
}
