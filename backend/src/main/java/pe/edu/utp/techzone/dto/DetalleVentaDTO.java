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
public class DetalleVentaDTO {
    private Integer idProducto;
    private String producto;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal valorUnitario;
    private BigDecimal valorTotal;
    private BigDecimal igv;
    private BigDecimal subtotal;
}
