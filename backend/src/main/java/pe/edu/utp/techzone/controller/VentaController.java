package pe.edu.utp.techzone.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.edu.utp.techzone.dto.RegistrarVentaRequest;
import pe.edu.utp.techzone.dto.VentaDTO;
import pe.edu.utp.techzone.service.VentaService;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
public class VentaController {
    private final VentaService ventaService;

    @PostMapping
    public VentaDTO registrar(@Valid @RequestBody RegistrarVentaRequest request) {
        return ventaService.registrar(request);
    }

    @GetMapping("/{idVenta}")
    public VentaDTO buscar(@PathVariable String idVenta) {
        return ventaService.buscar(idVenta);
    }

    @GetMapping
    public List<VentaDTO> listarTodas() {
        return ventaService.listarTodas();
    }

    @GetMapping("/cliente/{idCliente}")
    public List<VentaDTO> historialCliente(@PathVariable String idCliente) {
        return ventaService.historialCliente(idCliente);
    }
}
