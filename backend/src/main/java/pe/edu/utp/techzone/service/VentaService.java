package pe.edu.utp.techzone.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.techzone.dto.DetalleVentaDTO;
import pe.edu.utp.techzone.dto.ItemVentaRequest;
import pe.edu.utp.techzone.dto.RegistrarVentaRequest;
import pe.edu.utp.techzone.dto.VentaDTO;
import pe.edu.utp.techzone.entity.DetalleVenta;
import pe.edu.utp.techzone.entity.MedioPago;
import pe.edu.utp.techzone.entity.Persona;
import pe.edu.utp.techzone.entity.Producto;
import pe.edu.utp.techzone.entity.TipoDocumento;
import pe.edu.utp.techzone.entity.Venta;
import pe.edu.utp.techzone.exception.NotFoundException;
import pe.edu.utp.techzone.repository.DetalleVentaRepository;
import pe.edu.utp.techzone.repository.MedioPagoRepository;
import pe.edu.utp.techzone.repository.TipoDocumentoRepository;
import pe.edu.utp.techzone.repository.VentaRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VentaService {
    private final VentaRepository ventaRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final TipoDocumentoRepository tipoDocumentoRepository;
    private final MedioPagoRepository medioPagoRepository;
    private final ClienteService clienteService;
    private final ProductoService productoService;

    @Transactional
    public VentaDTO registrar(RegistrarVentaRequest request) {
        Persona persona = clienteService.obtenerPersonaDelCliente(request.getIdCliente());
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
                .persona(persona)
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
        Persona persona = clienteService.obtenerPersonaDelCliente(idCliente);
        return ventaRepository.findByPersonaIdPersonaOrderByFechaEmisionDesc(persona.getIdPersona())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public VentaDTO toDTO(Venta venta) {
        List<DetalleVentaDTO> detalles = detalleVentaRepository.findByVentaIdVenta(venta.getIdVenta())
                .stream()
                .map(detalle -> DetalleVentaDTO.builder()
                        .idProducto(detalle.getProducto().getIdProducto())
                        .producto(detalle.getProducto().getNombre())
                        .cantidad(detalle.getCantidad())
                        .precioUnitario(detalle.getPrecioUnitario())
                        .subtotal(detalle.getSubtotal())
                        .build())
                .toList();

        BigDecimal total = detalles.stream()
                .map(DetalleVentaDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return VentaDTO.builder()
                .idVenta(venta.getIdVenta())
                .idCliente(venta.getPersona().getIdPersona())
                .cliente(venta.getPersona().getNombre() + " " + venta.getPersona().getApellido())
                .tipoDocumento(venta.getTipoDocumento().getNombre())
                .numeroDocumento(venta.getNumeroDocumento())
                .medioPago(venta.getMedioPago().getDescripcion())
                .fechaEmision(venta.getFechaEmision())
                .total(total)
                .detalles(detalles)
                .build();
    }
}
