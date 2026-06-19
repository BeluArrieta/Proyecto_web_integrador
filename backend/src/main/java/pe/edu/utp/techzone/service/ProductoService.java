package pe.edu.utp.techzone.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.techzone.dto.ProductoDTO;
import pe.edu.utp.techzone.entity.Producto;
import pe.edu.utp.techzone.exception.BusinessException;
import pe.edu.utp.techzone.exception.NotFoundException;
import pe.edu.utp.techzone.repository.ProductoRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {
    private final ProductoRepository productoRepository;

    @Transactional(readOnly = true)
    public List<ProductoDTO> listar() {
        return productoRepository.findAllByOrderByNombreAsc().stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public ProductoDTO buscar(Integer id) {
        return toDTO(obtenerEntidad(id));
    }

    @Transactional
    public ProductoDTO guardar(ProductoDTO dto) {
        Producto producto = Producto.builder()
                .idProducto(dto.getIdProducto())
                .nombre(dto.getNombre())
                .stock(dto.getStock())
                .precio(dto.getPrecio())
                .categoria(dto.getCategoria())
                .build();
        return toDTO(productoRepository.save(producto));
    }

    @Transactional
    public ProductoDTO actualizar(Integer id, ProductoDTO dto) {
        Producto producto = obtenerEntidad(id);
        producto.setNombre(dto.getNombre());
        producto.setStock(dto.getStock());
        producto.setPrecio(dto.getPrecio());
        producto.setCategoria(dto.getCategoria());
        return toDTO(productoRepository.save(producto));
    }

    @Transactional
    public void eliminar(Integer id) {
        Producto producto = obtenerEntidad(id);
        productoRepository.delete(producto);
    }

    @Transactional
    public void descontarStock(Producto producto, Integer cantidad) {
        if (producto.getStock() < cantidad) {
            throw new BusinessException("Stock insuficiente para " + producto.getNombre());
        }
        producto.setStock(producto.getStock() - cantidad);
        productoRepository.save(producto);
    }

    @Transactional(readOnly = true)
    public Producto obtenerEntidad(Integer id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Producto no encontrado"));
    }

    public ProductoDTO toDTO(Producto producto) {
        return ProductoDTO.builder()
                .idProducto(producto.getIdProducto())
                .nombre(producto.getNombre())
                .stock(producto.getStock())
                .precio(producto.getPrecio())
                .categoria(producto.getCategoria())
                .build();
    }
}
