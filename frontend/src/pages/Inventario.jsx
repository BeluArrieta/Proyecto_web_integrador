import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, AlertTriangle, Boxes, Edit2, PackagePlus, Plus, Search, Trash2, X } from 'lucide-react';
import { productoService } from '../services/api';
import { formatoMoneda } from '../utils/format';
import Alerta from '../components/Alerta';
import { obtenerImagenProducto } from '../utils/productImages';

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');

  // Modal Crear / Editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    idProducto: '',
    nombre: '',
    stock: '',
    precio: '',
    categoria: 'Laptops'
  });
  const [erroresModal, setErroresModal] = useState({});

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      const data = await productoService.listar();
      setProductos(data || []);
    } catch (err) {
      setMensaje(err.message || 'Error al cargar productos');
    } finally {
      setCargando(false);
    }
  }

  const categorias = useMemo(() => {
    const cats = productos.map((p) => p.categoria).filter(Boolean);
    return ['Todas', ...new Set(cats)];
  }, [productos]);

  const filtrados = productos.filter((p) => {
    const coincideTexto = p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || String(p.idProducto).includes(busqueda);
    const coincideCat = categoria === 'Todas' || p.categoria === categoria;
    return coincideTexto && coincideCat;
  });

  function abrirModalNuevo() {
    setModoEdicion(false);
    const maxId = productos.reduce((max, p) => Math.max(max, Number(p.idProducto) || 0), 0);
    setForm({
      idProducto: maxId + 1,
      nombre: '',
      stock: 10,
      precio: '',
      categoria: 'Laptops'
    });
    setErroresModal({});
    setModalAbierto(true);
    setMensaje('');
    setExito('');
  }

  function abrirModalEditar(prod) {
    setModoEdicion(true);
    setForm({
      idProducto: prod.idProducto,
      nombre: prod.nombre,
      stock: prod.stock,
      precio: prod.precio,
      categoria: prod.categoria || 'General'
    });
    setErroresModal({});
    setModalAbierto(true);
    setMensaje('');
    setExito('');
  }

  function validarModal() {
    const errores = {};
    if (!form.nombre || form.nombre.trim().length < 3) {
      errores.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }
    const precioNum = Number(form.precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      errores.precio = 'El precio debe ser mayor a 0.';
    }
    const stockNum = Number(form.stock);
    if (isNaN(stockNum) || !Number.isInteger(stockNum) || stockNum < 0) {
      errores.stock = 'El stock debe ser un entero mayor o igual a 0.';
    }
    if (!form.categoria || form.categoria.trim() === '') {
      errores.categoria = 'La categoría es requerida.';
    }
    setErroresModal(errores);
    return Object.keys(errores).length === 0;
  }

  async function guardarProducto(e) {
    e.preventDefault();
    
    if (!validarModal()) {
      return;
    }

    setGuardando(true);
    setMensaje('');
    setExito('');

    try {
      const payload = {
        idProducto: Number(form.idProducto),
        nombre: form.nombre.trim(),
        stock: Number(form.stock),
        precio: Number(form.precio),
        categoria: form.categoria
      };

      if (modoEdicion) {
        await productoService.actualizar(payload.idProducto, payload);
        setExito(`Producto "${payload.nombre}" actualizado correctamente.`);
      } else {
        await productoService.crear(payload);
        setExito(`Producto "${payload.nombre}" creado exitosamente.`);
      }

      setModalAbierto(false);
      cargarProductos();
    } catch (err) {
      setMensaje(err.message || 'Error al guardar producto.');
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarProducto(id, nombre) {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${nombre}"?`)) return;
    try {
      await productoService.eliminar(id);
      setExito(`Producto "${nombre}" eliminado.`);
      cargarProductos();
    } catch (err) {
      setMensaje(err.message || 'Error al eliminar producto.');
    }
  }

  return (
    <section className="inventarioSeccion">
      <div className="heroPanel no-print">
        <div>
          <span className="miniTag">Administración de Catálogo</span>
          <h2>Gestión de Inventario & Stock</h2>
          <p>Controla las existencias en almacén, actualiza precios y registra nuevos artículos tecnológicos.</p>
        </div>
        <button className="btnPrincipal" onClick={abrirModalNuevo}>
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      <Alerta tipo="error" mensaje={mensaje} />
      <Alerta tipo="ok" mensaje={exito} />

      {/* Barra de Filtros */}
      <div className="filtrosAvanzadosBar no-print">
        <div className="inputIcono inputBusquedaHistorial">
          <Search size={18} />
          <input
            placeholder="Buscar por código o nombre de producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button className="btnLimpiarSearch" onClick={() => setBusqueda('')}>
              <X size={15} />
            </button>
          )}
        </div>

        <div className="filtroTipoTabs">
          {categorias.slice(0, 5).map((cat) => (
            <button
              key={cat}
              className={`tabFiltro ${categoria === cat ? 'activo' : ''}`}
              onClick={() => setCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Productos */}
      {cargando ? (
        <div className="panelVacio">Cargando inventario de productos...</div>
      ) : filtrados.length === 0 ? (
        <div className="panelVacio">No hay productos que coincidan con la búsqueda.</div>
      ) : (
        <div className="tablaCard">
          <table>
            <thead>
              <tr>
                <th style={{ width: 65 }}>Foto</th>
                <th style={{ width: '80px' }}>ID</th>
                <th>Nombre del Producto</th>
                <th>Categoría</th>
                <th>Precio Unitario (Inc. IGV)</th>
                <th>Stock Disponible</th>
                <th>Estado</th>
                <th className="text-center" style={{ width: '130px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((prod) => {
                const stockNum = Number(prod.stock || 0);
                const agotado = stockNum <= 0;
                const stockBajo = stockNum > 0 && stockNum <= 15;

                return (
                  <tr key={prod.idProducto} className="filaHistorial">
                    <td>
                      <img src={obtenerImagenProducto(prod)} alt={prod.nombre}
                        style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0', display: 'block' }}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100&auto=format&fit=crop&q=80'; }} />
                    </td>
                    <td><strong>#{prod.idProducto}</strong></td>
                    <td>
                      <strong className="productoNombreTabla">{prod.nombre}</strong>
                    </td>
                    <td>
                      <span className="badgeMedioPago">{prod.categoria || 'General'}</span>
                    </td>
                    <td>
                      <strong>{formatoMoneda(prod.precio)}</strong>
                    </td>
                    <td>
                      <strong>{stockNum} unidades</strong>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        lineHeight: '1.2',
                        background: agotado ? '#fee2e2' : stockBajo ? '#fef3c7' : '#dcfce7',
                        color: agotado ? '#b91c1c' : stockBajo ? '#b45309' : '#15803d',
                        border: `1px solid ${agotado ? '#fca5a5' : stockBajo ? '#fde047' : '#86efac'}`,
                        position: 'static'
                      }}>
                        {agotado ? 'Agotado' : stockBajo ? 'Stock Crítico' : 'Disponible'}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="btnIconoTabla btnEditar"
                          title="Editar producto"
                          onClick={() => abrirModalEditar(prod)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btnIconoTabla btnEliminar"
                          title="Eliminar producto"
                          onClick={() => eliminarProducto(prod.idProducto, prod.nombre)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para Crear / Editar Producto */}
      {modalAbierto && (
        <div className="modalOverlay" onClick={() => setModalAbierto(false)}>
          <div className="modalContenido" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>{modoEdicion ? 'Editar Producto' : 'Registrar Nuevo Producto'}</h3>
              <button className="btnCerrarModal" onClick={() => setModalAbierto(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={guardarProducto} className="formulario modalFormulario">
              <label>
                Código ID Producto
                <input
                  type="number"
                  value={form.idProducto}
                  onChange={(e) => setForm({ ...form, idProducto: e.target.value })}
                  disabled={modoEdicion}
                  required
                />
              </label>

              <label>
                Nombre del Producto
                <input
                  className={erroresModal.nombre ? 'inputConError' : ''}
                  value={form.nombre}
                  onChange={(e) => {
                    setForm({ ...form, nombre: e.target.value });
                    if (erroresModal.nombre) setErroresModal({ ...erroresModal, nombre: null });
                  }}
                  placeholder="Ej: Laptop Lenovo ThinkPad"
                  required
                />
                {erroresModal.nombre && <div className="mensajeErrorCampo"><AlertCircle size={13}/> {erroresModal.nombre}</div>}
              </label>

              <div className="gridDosCampos">
                <label>
                  Categoría
                  <input
                    className={erroresModal.categoria ? 'inputConError' : ''}
                    value={form.categoria}
                    onChange={(e) => {
                      setForm({ ...form, categoria: e.target.value });
                      if (erroresModal.categoria) setErroresModal({ ...erroresModal, categoria: null });
                    }}
                    placeholder="Ej: Laptops, Audio, Gaming"
                    required
                  />
                  {erroresModal.categoria && <div className="mensajeErrorCampo"><AlertCircle size={13}/> {erroresModal.categoria}</div>}
                </label>

                <label>
                  Precio (S/ inc. IGV)
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={erroresModal.precio ? 'inputConError' : ''}
                    value={form.precio}
                    onChange={(e) => {
                      setForm({ ...form, precio: e.target.value });
                      if (erroresModal.precio) setErroresModal({ ...erroresModal, precio: null });
                    }}
                    placeholder="Ej: 150.00"
                    required
                  />
                  {erroresModal.precio && <div className="mensajeErrorCampo"><AlertCircle size={13}/> {erroresModal.precio}</div>}
                </label>
              </div>

              <label>
                Stock Inicial / Unidades en Almacén
                <input
                  type="number"
                  min="0"
                  className={erroresModal.stock ? 'inputConError' : ''}
                  value={form.stock}
                  onChange={(e) => {
                    setForm({ ...form, stock: e.target.value });
                    if (erroresModal.stock) setErroresModal({ ...erroresModal, stock: null });
                  }}
                  required
                />
                {erroresModal.stock && <div className="mensajeErrorCampo"><AlertCircle size={13}/> {erroresModal.stock}</div>}
              </label>

              <div className="modalAcciones">
                <button
                  type="button"
                  className="btnSecundario"
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btnPrincipal"
                  disabled={guardando}
                >
                  {guardando ? 'Guardando...' : modoEdicion ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
