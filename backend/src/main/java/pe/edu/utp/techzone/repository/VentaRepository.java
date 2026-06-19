package pe.edu.utp.techzone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pe.edu.utp.techzone.entity.Venta;

import java.util.List;

public interface VentaRepository extends JpaRepository<Venta, String> {
    List<Venta> findByPersonaIdPersonaOrderByFechaEmisionDesc(String idPersona);

    @Query(value = """
        SELECT COALESCE(p.nombre, 'Sin ventas')
        FROM detalle_venta dv
        INNER JOIN producto p ON dv.id_producto = p.id_producto
        INNER JOIN venta v ON dv.id_venta = v.id_venta
        WHERE EXTRACT(MONTH FROM v.fecha_emision) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM v.fecha_emision) = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY p.nombre
        ORDER BY SUM(dv.cantidad) DESC
        LIMIT 1
        """, nativeQuery = true)
    String obtenerProductoMasVendidoMes();
}
