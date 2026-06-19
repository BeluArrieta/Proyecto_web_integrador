import { ShoppingCart } from 'lucide-react';
import { formatoMoneda } from '../utils/format';

export default function ProductoCard({ producto, onAgregar }) {
  return (
    <article className="productoCard">
      <div className="productoImagen">{producto.nombre?.charAt(0) || 'P'}</div>
      <div className="productoInfo">
        <span className="categoria">{producto.categoria || 'General'}</span>
        <h3>{producto.nombre}</h3>
        <p>Stock disponible: {producto.stock}</p>
        <div className="productoFooter">
          <strong>{formatoMoneda(producto.precio)}</strong>
          <button disabled={producto.stock <= 0} onClick={() => onAgregar(producto)}>
            <ShoppingCart size={16} /> Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
