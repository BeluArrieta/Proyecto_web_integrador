package pe.edu.utp.techzone.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.techzone.dto.ClienteDTO;
import pe.edu.utp.techzone.dto.LoginRequest;
import pe.edu.utp.techzone.entity.Cliente;
import pe.edu.utp.techzone.entity.Persona;
import pe.edu.utp.techzone.exception.BusinessException;
import pe.edu.utp.techzone.exception.NotFoundException;
import pe.edu.utp.techzone.repository.ClienteRepository;
import pe.edu.utp.techzone.repository.PersonaRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {
    private final ClienteRepository clienteRepository;
    private final PersonaRepository personaRepository;
    private final PasswordService passwordService;

    @Transactional(readOnly = true)
    public List<ClienteDTO> listar() {
        return clienteRepository.findAll().stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public ClienteDTO buscar(String id) {
        return toDTO(obtenerEntidad(id));
    }

    @Transactional
    public ClienteDTO registrar(ClienteDTO dto) {
        if (clienteRepository.existsById(dto.getIdCliente())) {
            throw new BusinessException("El cliente ya existe");
        }

        Cliente cliente = Cliente.builder()
                .idCliente(dto.getIdCliente())
                .nombre(dto.getNombre())
                .apellido(dto.getApellido())
                .telefono(dto.getTelefono())
                .correo(dto.getCorreo())
                .contrasena(passwordService.preparar(dto.getPassword()))
                .build();

        String idPersona = generarIdPersona(dto.getIdCliente());
        if (!personaRepository.existsById(idPersona)) {
            Persona persona = Persona.builder()
                    .idPersona(idPersona)
                    .nombre(dto.getNombre())
                    .apellido(dto.getApellido())
                    .fechaNacimiento(LocalDate.of(2000, 1, 1))
                    .correo(dto.getCorreo())
                    .telefono(dto.getTelefono())
                    .usuario(dto.getIdCliente())
                    .build();
            personaRepository.save(persona);
        }

        return toDTO(clienteRepository.save(cliente));
    }

    @Transactional(readOnly = true)
    public ClienteDTO login(LoginRequest request) {
        Cliente cliente = clienteRepository.findById(request.getIdCliente())
                .orElseThrow(() -> new BusinessException("Credenciales incorrectas"));

        if (!passwordService.coincide(request.getPassword(), cliente.getContrasena())) {
            throw new BusinessException("Credenciales incorrectas");
        }

        return toDTO(cliente);
    }

    @Transactional(readOnly = true)
    public Cliente obtenerEntidad(String id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente no encontrado"));
    }

    @Transactional(readOnly = true)
    public Persona obtenerPersonaDelCliente(String idCliente) {
        Cliente cliente = obtenerEntidad(idCliente);

        if (cliente.getCorreo() != null && !cliente.getCorreo().isBlank()) {
            return personaRepository.findFirstByCorreo(cliente.getCorreo())
                    .orElseThrow(() -> new NotFoundException("No existe una persona asociada al correo del cliente"));
        }

        String idPersona = generarIdPersona(idCliente);
        return personaRepository.findById(idPersona)
                .orElseThrow(() -> new NotFoundException("No existe una persona asociada al cliente"));
    }

    private String generarIdPersona(String idCliente) {
        String limpio = idCliente == null ? "" : idCliente.replace("CLI", "").trim();
        if (limpio.isBlank()) {
            limpio = String.valueOf(System.currentTimeMillis()).substring(7);
        }
        return "PER" + limpio;
    }

    public ClienteDTO toDTO(Cliente cliente) {
        return ClienteDTO.builder()
                .idCliente(cliente.getIdCliente())
                .nombre(cliente.getNombre())
                .apellido(cliente.getApellido())
                .telefono(cliente.getTelefono())
                .correo(cliente.getCorreo())
                .build();
    }
}
