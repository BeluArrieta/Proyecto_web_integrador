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
 * IGV de una linea de detalle. Se calcula sobre la base imponible de esa linea
 * y se redondea a 2 decimales, que es lo que exige SUNAT.
 * Ej: importe 90.00 con 18% -> igv 13.73
 */
@Transactional(readOnly = true)
public BigDecimal calcularIgvDeLinea(BigDecimal importeConIgv) {
    if (importeConIgv == null) {
        return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
    }
    BigDecimal base = new BigDecimal("100").multiply(factor());
    return importeConIgv.multiply(obtenerIgvPorcentaje()).divide(base, 2, RoundingMode.HALF_UP);
}

private BigDecimal factor() {
        return BigDecimal.ONE.add(obtenerIgvPorcentaje().divide(new BigDecimal("100"), 6, RoundingMode.HALF_UP));
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
