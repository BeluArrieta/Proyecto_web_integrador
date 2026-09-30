package pe.edu.utp.techzone.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.techzone.repository.ParametroRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class ParametroService {
    public static final String IGV_PORCENTAJE = "IGV_PORCENTAJE";
    private static final BigDecimal VALOR_POR_DEFECTO = new BigDecimal("18.00");

    private final ParametroRepository parametroRepository;

    @Transactional(readOnly = true)
    public BigDecimal obtenerIgvPorcentaje() {
        return parametroRepository.findById(IGV_PORCENTAJE)
                .map(p -> leerDecimal(p.getValor(), VALOR_POR_DEFECTO))
                .orElse(VALOR_POR_DEFECTO);
    }

    /**
     * El precio de producto.precio ya incluye IGV, asi que se desagrega hacia atras.
     * Ej: total 118.00 con 18% -> opGravada 100.00, igv 18.00
     */
    @Transactional(readOnly = true)
    public BigDecimal calcularOpGravada(BigDecimal totalConIgv) {
        if (totalConIgv == null) {
            return BigDecimal.ZERO;
        }
        BigDecimal factor = BigDecimal.ONE.add(obtenerIgvPorcentaje().divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP));
        return totalConIgv.divide(factor, 2, RoundingMode.HALF_UP);
    }

    @Transactional(readOnly = true)
    public BigDecimal calcularIgv(BigDecimal totalConIgv) {
        if (totalConIgv == null) {
            return BigDecimal.ZERO;
        }
        return totalConIgv.subtract(calcularOpGravada(totalConIgv)).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal leerDecimal(String texto, BigDecimal porDefecto) {
        if (texto == null || texto.isBlank()) {
            return porDefecto;
        }
        try {
            return new BigDecimal(texto.trim());
        } catch (NumberFormatException e) {
            return porDefecto;
        }
    }
}
