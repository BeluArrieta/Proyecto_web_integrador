package pe.edu.utp.techzone.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.techzone.dto.AuthResponseDTO;
import pe.edu.utp.techzone.dto.LoginRequest;
import pe.edu.utp.techzone.entity.Cliente;
import pe.edu.utp.techzone.entity.Usuario;
import pe.edu.utp.techzone.exception.BusinessException;
import pe.edu.utp.techzone.repository.ClienteRepository;
import pe.edu.utp.techzone.repository.UsuarioRepository;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordService passwordService;

    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginRequest request) {
        String usuario = request.getIdCliente();

        Usuario admin = usuarioRepository.findByUsuario(usuario).orElse(null);
        if (admin != null && passwordService.coincide(request.getPassword(), admin.getContrasena())) {
            return AuthResponseDTO.builder()
                    .id(admin.getPersona().getIdPersona())
                    .nombre(admin.getPersona().getNombre())
                    .apellido(admin.getPersona().getApellido())
                    .correo(admin.getPersona().getCorreo())
                    .telefono(admin.getPersona().getTelefono())
                    .usuario(admin.getUsuario())
                    .rol("ADMIN")
                    .build();
        }

        Cliente cliente = clienteRepository.findById(usuario)
                .orElseThrow(() -> new BusinessException("Credenciales incorrectas"));

        if (!passwordService.coincide(request.getPassword(), cliente.getContrasena())) {
            throw new BusinessException("Credenciales incorrectas");
        }

        return AuthResponseDTO.builder()
                .id(cliente.getIdCliente())
                .nombre(cliente.getNombre())
                .apellido(cliente.getApellido())
                .correo(cliente.getCorreo())
                .telefono(cliente.getTelefono())
                .usuario(cliente.getIdCliente())
                .rol("CLIENTE")
                .build();
    }
}
