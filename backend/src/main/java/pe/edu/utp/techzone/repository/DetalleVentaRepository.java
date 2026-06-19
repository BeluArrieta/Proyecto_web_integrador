package pe.edu.utp.techzone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.techzone.entity.DetalleVenta;

import java.util.List;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Integer> {
    List<DetalleVenta> findByVentaIdVenta(String idVenta);
}
