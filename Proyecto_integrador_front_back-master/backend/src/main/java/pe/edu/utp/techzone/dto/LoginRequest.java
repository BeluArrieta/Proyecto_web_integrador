package pe.edu.utp.techzone.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    private String idCliente;

    @NotBlank
    private String password;
}
