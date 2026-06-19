package pe.edu.utp.techzone.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.techzone.dto.DashboardDTO;
import pe.edu.utp.techzone.repository.ClienteRepository;
import pe.edu.utp.techzone.repository.ProductoRepository;
import pe.edu.utp.techzone.repository.VentaRepository;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final ProductoRepository productoRepository;
    private final ClienteRepository clienteRepository;
    private final VentaRepository ventaRepository;

    @Transactional(readOnly = true)
    public DashboardDTO obtenerResumen() {
        String masVendido = ventaRepository.obtenerProductoMasVendidoMes();
        if (masVendido == null || masVendido.isBlank()) {
            masVendido = "Sin ventas";
        }

        return DashboardDTO.builder()
                .totalProductos(productoRepository.count())
                .totalClientes(clienteRepository.count())
                .productosAgotados(productoRepository.countByStockLessThanEqual(0))
                .productoMasVendidoMes(masVendido)
                .build();
    }
}
