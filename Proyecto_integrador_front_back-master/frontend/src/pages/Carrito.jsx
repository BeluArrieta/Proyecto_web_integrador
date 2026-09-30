import { CreditCard, Trash2, WalletCards, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatoMoneda } from '../utils/format';
import { ventaService } from '../services/api';
import Alerta from '../components/Alerta';

export default function Carrito({ setVista, setVentaGenerada }) {
  const { cliente, carrito, total, cambiarCantidad, quitarProducto, limpiarCarrito } = useApp();
  const [tipoDocumento, setTipoDocumento] = useState('TD001');
  const [medioPago, setMedioPago] = useState('MP004');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [docError, setDocError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);

  const medios = [
    { id: 'MP004', nombre: 'Yape' },
    { id: 'MP005', nombre: 'Plin' },
    { id: 'MP002', nombre: 'Crédito' },
    { id: 'MP003', nombre: 'Débito' },
    { id: 'MP001', nombre: 'Efectivo' },
    { id: 'MP006', nombre: 'Transferencia' }
  ];

  const subtotal = total / 1.18;
  const igv = total - subtotal;

  const handleDocumentChange = (e) => {
    const val = e.target.value;
    setNumeroDocumento(val);
    validarDocumento(tipoDocumento, val);
  };

  const validarDocumento = (tipo, valor) => {
    if (!valor) {
      setDocError('El número de documento es obligatorio.');
      return false;
    }
    if (tipo === 'TD001') {
      const regex = /^\d{8}$/;
      if (!regex.test(valor)) {
        setDocError('El DNI debe tener exactamente 8 dígitos numéricos.');
        return false;
      }
    } else if (tipo === 'TD002') {
      const regex = /^(10|20)\d{9}$/;
      if (!regex.test(valor)) {
        setDocError('El RUC debe tener exactamente 11 dígitos y empezar con 10 o 20.');
        return false;
      }
    }
    setDocError('');
    return true;
  };

  const handleTipoDocChange = (e) => {
    const nuevoTipo = e.target.value;
    setTipoDocumento(nuevoTipo);
    setNumeroDocumento('');
    setRazonSocial('');
    setDocError('');
  };

  const handleCantidadChange = (id, stock, value) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      cambiarCantidad(id, '');
      return;
    }
    if (num < 1) {
      cambiarCantidad(id, 1);
    } else if (num > stock) {
      cambiarCantidad(id, stock);
    } else {
      cambiarCantidad(id, num);
    }
  };

  async function registrarVenta() {
    setMensaje('');
    setExito('');

    if (!cliente) {
      setMensaje('Debes iniciar sesión como cliente antes de pagar.');
      setVista('login');
      return;
    }

    if (carrito.length === 0) {
      setMensaje('Tu carrito está vacío.');
      return;
    }

    // Validar stock
    for (const item of carrito) {
      if (item.cantidad > item.stock) {
        setMensaje(`La cantidad del producto "${item.nombre}" supera el stock disponible (${item.stock}).`);
        return;
      }
    }

    if (!validarDocumento(tipoDocumento, numeroDocumento)) {
      setMensaje('Corrige los errores en el documento antes de continuar.');
      return;
    }

    if (tipoDocumento === 'TD002' && !razonSocial.trim()) {
      setMensaje('La Razón Social es obligatoria para Factura.');
      return;
    }

    const request = {
      idCliente: cliente.id,
      tipoDocumento,
      medioPago,
      numeroDocumento,
      razonSocial: tipoDocumento === 'TD002' ? razonSocial : undefined,
      items: carrito.map((item) => ({ idProducto: item.idProducto, cantidad: item.cantidad }))
    };

    setCargando(true);
    try {
      const venta = await ventaService.registrar(request);
      setVentaGenerada(venta);
      limpiarCarrito();
      setExito('Compra registrada correctamente.');
      setVista('comprobante');
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <section>
      <div className="heroPanel carritoHero">
        <div>
          <span className="miniTag">Carrito</span>
          <h2>Resumen de compra</h2>
          <p>Selecciona el comprobante y el método de pago antes de confirmar.</p>
        </div>
      </div>

      <Alerta tipo="error" mensaje={mensaje} />
      <Alerta tipo="ok" mensaje={exito} />

      {carrito.length === 0 ? (
        <div className="panelVacio">No tienes productos en el carrito.</div>
      ) : (
        <div className="carritoLayout">
          <div className="tablaCard">
            <div className="tablaHeader">
              <div>
                <h3>Productos seleccionados</h3>
                <p>{carrito.length} producto(s) en tu pedido.</p>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.idProducto}>
                    <td>{item.nombre}</td>
                    <td>{formatoMoneda(item.precio)}</td>
                    <td>
                      <input
                        className="cantidadInput"
                        type="number"
                        min="1"
                        max={item.stock}
                        value={item.cantidad}
                        onChange={(e) => handleCantidadChange(item.idProducto, item.stock, e.target.value)}
                      />
                    </td>
                    <td>{formatoMoneda(Number(item.precio) * item.cantidad)}</td>
                    <td>
                      <button className="btnIcono" onClick={() => quitarProducto(item.idProducto)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <aside className="resumenCard resumenPagoModerno">
            <div className="pagoIcono"><WalletCards size={24} /></div>
            <h3>Pago</h3>
            <label>
              Tipo de documento
              <select value={tipoDocumento} onChange={handleTipoDocChange}>
                <option value="TD001">Boleta</option>
                <option value="TD002">Factura</option>
              </select>
            </label>
            <label>
              Medio de pago
              <div className="metodosPago">
                {medios.map((medio) => (
                  <button
                    type="button"
                    key={medio.id}
                    className={medioPago === medio.id ? 'seleccionado' : ''}
                    onClick={() => setMedioPago(medio.id)}
                  >
                    <CreditCard size={15} /> {medio.nombre}
                  </button>
                ))}
              </div>
            </label>
            <label>
              Número documento del cliente
              <input value={numeroDocumento} onChange={handleDocumentChange} placeholder={tipoDocumento === 'TD001' ? "DNI (8 dígitos)" : "RUC (11 dígitos)"} />
              {docError && <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} />{docError}</div>}
            </label>
            
            {tipoDocumento === 'TD002' && (
              <label>
                Razón Social
                <input value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} placeholder="Razón Social" />
              </label>
            )}

            <div className="totalBox" style={{ flexDirection: 'column', gap: '8px', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' }}>
                <span>Op. Gravada</span>
                <span>{formatoMoneda(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' }}>
                <span>IGV (18%)</span>
                <span>{formatoMoneda(igv)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '8px', marginTop: '4px' }}>
                <span>Total</span>
                <strong>{formatoMoneda(total)}</strong>
              </div>
            </div>
            <button className="btnPrincipal btnGrande" disabled={cargando} onClick={registrarVenta}>
              {cargando ? 'Registrando...' : 'Realizar pago'}
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
