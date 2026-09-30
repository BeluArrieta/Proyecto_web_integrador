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
@Table(name = "parametro")
public class Parametro {
    @Id
    @Column(name = "id_parametro", length = 30)
    private String idParametro;

    @Column(nullable = false, length = 50)
    private String valor;

    @Column(nullable = false, length = 100)
    private String descripcion;
}
