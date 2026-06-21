import { CreditCard, Trash2, WalletCards } from 'lucide-react';
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

    const request = {
      idCliente: cliente.id,
      tipoDocumento,
      medioPago,
      numeroDocumento,
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
                        onChange={(e) => cambiarCantidad(item.idProducto, e.target.value)}
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
              <select value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}>
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
              <input value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)} placeholder="DNI o RUC" />
            </label>
            <div className="totalBox">
              <span>Total</span>
              <strong>{formatoMoneda(total)}</strong>
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
