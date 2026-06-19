package pe.edu.utp.techzone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VentaDTO {
    private String idVenta;
    private String idCliente;
    private String cliente;
    private String tipoDocumento;
    private String numeroDocumento;
    private String medioPago;
    private LocalDateTime fechaEmision;
    private BigDecimal total;
    private List<DetalleVentaDTO> detalles;
}
