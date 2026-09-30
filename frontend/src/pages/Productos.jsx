import { useEffect, useMemo, useState } from 'react';
import ProductoGridCard from '../components/ProductoGridCard';
import Alerta from '../components/Alerta';
import { productoService } from '../services/api';
import { useApp } from '../context/AppContext';
import { Search } from 'lucide-react';

export default function Productos() {
  const { agregarProducto } = useApp();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      const data = await productoService.listar();
      setProductos(data || []);
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  }

  const categorias = useMemo(() => {
    const lista = productos.map((p) => p.categoria).filter(Boolean);
    return ['Todas', ...new Set(lista)];
  }, [productos]);

  const filtrados = productos.filter((producto) => {
    const coincideNombre = producto.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === 'Todas' || producto.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });

  return (
    <section>
      <div className="heroPanel catalogoHero">
        <div>
          <span className="miniTag">Catálogo de compras</span>
          <h2>Elige tus productos</h2>
          <p>Busca, filtra por categoría y agrega productos al carrito de forma rápida.</p>
        </div>
      </div>

      <Alerta tipo="error" mensaje={mensaje} />

      <div className="filtros filtrosCliente">
        <div className="inputIcono">
          <Search size={18} />
          <input placeholder="Buscar producto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          {categorias.map((cat) => <option key={cat}>{cat}</option>)}
        </select>
      </div>

      {cargando ? (
        <div className="panelVacio">Cargando productos...</div>
      ) : filtrados.length === 0 ? (
        <div className="panelVacio">No hay productos para mostrar.</div>
      ) : (
        <div className="productosGrid">
          {filtrados.map((producto) => (
            <ProductoGridCard key={producto.idProducto} producto={producto} onAgregar={agregarProducto} />
          ))}
        </div>
      )}
    </section>
  );
}
