import { useState } from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import { formatoMoneda } from '../utils/format';
import { obtenerImagenProducto } from '../utils/productImages';

export default function ProductoCard({ producto, onAgregar }) {
  const [agregado, setAgregado] = useState(false);
  const stockNum = Number(producto.stock || 0);
  const agotado = stockNum <= 0;
  const stockBajo = stockNum > 0 && stockNum <= 10;
  const imagenUrl = obtenerImagenProducto(producto);

  function handleAgregar() {
    if (agotado) return;
    onAgregar(producto);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1200);
  }

  return (
    <article className="productoCard">
      <div className="productoImagenContenedor">
        <img
          src={imagenUrl}
          alt={producto.nombre}
          className="productoImgReal"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80';
          }}
        />
        <span className={`stockTag ${agotado ? 'agotado' : stockBajo ? 'stockBajo' : 'disponible'}`}>
          {agotado ? 'Agotado' : stockBajo ? `¡Últimas ${stockNum} unids!` : `${stockNum} disponibles`}
        </span>
      </div>

      <div className="productoInfo">
        <span className="categoria">{producto.categoria || 'Tecnología'}</span>
        <h3 className="productoNombre" title={producto.nombre}>{producto.nombre}</h3>
        <p className="productoDescripcion">Garantía oficial TechZone y entrega inmediata con comprobante SUNAT.</p>

        <div className="productoFooter">
          <strong>{formatoMoneda(producto.precio)}</strong>
          <button
            className={`btnPrincipal ${agregado ? 'btnAgregado' : ''}`}
            disabled={agotado}
            onClick={handleAgregar}
            type="button"
          >
            {agregado ? (
              <>
                <Check size={16} /> ¡Agregado!
              </>
            ) : (
              <>
                <ShoppingCart size={16} /> Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

