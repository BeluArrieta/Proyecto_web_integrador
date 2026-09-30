package pe.edu.utp.techzone.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ItemVentaRequest {
    @NotNull
    private Integer idProducto;

    @NotNull
    @Min(1)
    private Integer cantidad;
}
