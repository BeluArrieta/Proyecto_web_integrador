import { ShoppingCart } from 'lucide-react';
import { formatoMoneda } from '../utils/format';

export default function ProductoCard({ producto, onAgregar }) {
  const agotado = Number(producto.stock) <= 0;

  return (
    <article className="productoCard">
      <div className="productoImagen">
        <span>{producto.nombre?.charAt(0) || 'P'}</span>
        <small className={agotado ? 'stockTag agotado' : 'stockTag'}>{agotado ? 'Agotado' : `${producto.stock} disponibles`}</small>
      </div>
      <div className="productoInfo">
        <span className="categoria">{producto.categoria || 'General'}</span>
        <h3>{producto.nombre}</h3>
        <p>Producto listo para agregar al carrito de compras.</p>
        <div className="productoFooter">
          <strong>{formatoMoneda(producto.precio)}</strong>
          <button disabled={agotado} onClick={() => onAgregar(producto)}>
            <ShoppingCart size={16} /> Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
