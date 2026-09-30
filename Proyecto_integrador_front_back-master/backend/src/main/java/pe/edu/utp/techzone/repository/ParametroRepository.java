package pe.edu.utp.techzone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.techzone.entity.Parametro;

public interface ParametroRepository extends JpaRepository<Parametro, String> {
}
