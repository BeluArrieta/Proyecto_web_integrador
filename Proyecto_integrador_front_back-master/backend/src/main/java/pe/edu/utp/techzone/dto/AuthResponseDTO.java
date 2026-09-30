package pe.edu.utp.techzone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private String id;
    private String nombre;
    private String apellido;
    private String correo;
    private String telefono;
    private String rol;
    private String usuario;
}
