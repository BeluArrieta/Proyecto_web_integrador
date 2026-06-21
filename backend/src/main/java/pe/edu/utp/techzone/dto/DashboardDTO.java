package pe.edu.utp.techzone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private long totalProductos;
    private long totalClientes;
    private long productosAgotados;
    private long ventasSemana;
    private long clientesCompraron;
    private BigDecimal ingresosSemana;
    private BigDecimal ingresosMes;
    private String productoMasVendidoMes;
    private String productoMasVendidoSemana;
    private Integer stockCritico;
}
