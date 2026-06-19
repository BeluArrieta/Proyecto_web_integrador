package pe.edu.utp.techzone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.techzone.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
}
