package pe.edu.utp.techzone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.techzone.entity.Producto;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    List<Producto> findAllByOrderByNombreAsc();
    long countByStockLessThanEqual(Integer stock);
}
