package pe.edu.utp.techzone.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class RegistrarVentaRequest {
    @NotBlank
    private String idCliente;

    @NotBlank
    private String tipoDocumento;

    @NotBlank
    private String medioPago;

    private String numeroDocumento;

    @Valid
    @NotEmpty
    private List<ItemVentaRequest> items;
}
