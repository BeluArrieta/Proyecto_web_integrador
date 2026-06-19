package pe.edu.utp.techzone.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {
    private Integer idProducto;

    @NotBlank
    private String nombre;

    @NotNull
    @Min(0)
    private Integer stock;

    @NotNull
    private BigDecimal precio;

    private String categoria;
}
