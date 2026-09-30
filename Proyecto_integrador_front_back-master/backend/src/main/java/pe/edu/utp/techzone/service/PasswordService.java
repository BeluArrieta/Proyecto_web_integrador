package pe.edu.utp.techzone.service;

import org.springframework.stereotype.Service;

@Service
public class PasswordService {
    public String preparar(String texto) {
        return texto == null ? "" : texto.trim();
    }

    public boolean coincide(String passwordIngresado, String passwordGuardado) {
        return preparar(passwordIngresado).equals(passwordGuardado == null ? "" : passwordGuardado.trim());
    }
}
