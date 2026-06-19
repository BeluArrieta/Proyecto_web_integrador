package pe.edu.utp.techzone.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDTO {
    @NotBlank
    private String idCliente;

    @NotBlank
    private String nombre;

    @NotBlank
    private String apellido;

    private String telefono;
    private String correo;
    private String password;
}
