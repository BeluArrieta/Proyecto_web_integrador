package pe.edu.utp.techzone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private long totalProductos;
    private long totalClientes;
    private long productosAgotados;
    private String productoMasVendidoMes;
}
