package pe.edu.utp.techzone.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "medio_pago")
public class MedioPago {
    @Id
    @Column(name = "id_medio_pago", length = 10)
    private String idMedioPago;

    @Column(nullable = false, length = 100)
    private String descripcion;
}
