package pe.edu.utp.techzone.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.techzone.dto.DashboardDTO;
import pe.edu.utp.techzone.repository.ClienteRepository;
import pe.edu.utp.techzone.repository.ProductoRepository;
import pe.edu.utp.techzone.repository.VentaRepository;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final ProductoRepository productoRepository;
    private final ClienteRepository clienteRepository;
    private final VentaRepository ventaRepository;

    @Transactional(readOnly = true)
    public DashboardDTO obtenerResumen() {
        String masVendidoMes = normalizarTexto(ventaRepository.obtenerProductoMasVendidoMes());
        String masVendidoSemana = normalizarTexto(ventaRepository.obtenerProductoMasVendidoSemana());

        return DashboardDTO.builder()
                .totalProductos(productoRepository.count())
                .totalClientes(clienteRepository.count())
                .productosAgotados(productoRepository.countByStockLessThanEqual(0))
                .stockCritico((int) productoRepository.countByStockLessThanEqual(5))
                .ventasSemana(ventaRepository.contarVentasSemana())
                .clientesCompraron(ventaRepository.contarClientesCompraron())
                .ingresosSemana(valor(ventaRepository.obtenerIngresosSemana()))
                .ingresosMes(valor(ventaRepository.obtenerIngresosMes()))
                .productoMasVendidoMes(masVendidoMes)
                .productoMasVendidoSemana(masVendidoSemana)
                .build();
    }

    private String normalizarTexto(String texto) {
        return texto == null || texto.isBlank() ? "Sin ventas" : texto;
    }

    private BigDecimal valor(BigDecimal monto) {
        return monto == null ? BigDecimal.ZERO : monto;
    }
}
