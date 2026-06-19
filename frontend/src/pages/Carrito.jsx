import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatoMoneda } from '../utils/format';
import { ventaService } from '../services/api';
import Alerta from '../components/Alerta';

export default function Carrito({ setVista, setVentaGenerada }) {
  const { cliente, carrito, total, cambiarCantidad, quitarProducto, limpiarCarrito } = useApp();
  const [tipoDocumento, setTipoDocumento] = useState('TD001');
  const [medioPago, setMedioPago] = useState('MP001');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);

  async function registrarVenta() {
    setMensaje('');
    setExito('');

    if (!cliente) {
      setMensaje('Debes iniciar sesión antes de pagar.');
      setVista('login');
      return;
    }

    if (carrito.length === 0) {
      setMensaje('Tu carrito está vacío.');
      return;
    }

    const request = {
      idCliente: cliente.idCliente,
      tipoDocumento,
      medioPago,
      numeroDocumento,
      items: carrito.map((item) => ({
        idProducto: item.idProducto,
        cantidad: item.cantidad
      }))
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
      <div className="pageHeader">
        <div>
          <h2>Carrito de compras</h2>
          <p>Revisa los productos antes de registrar la venta.</p>
        </div>
      </div>

      <Alerta tipo="error" mensaje={mensaje} />
      <Alerta tipo="ok" mensaje={exito} />

      {carrito.length === 0 ? (
        <div className="panelVacio">No tienes productos en el carrito.</div>
      ) : (
        <div className="carritoLayout">
          <div className="tablaCard">
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

          <aside className="resumenCard">
            <h3>Resumen de pago</h3>
            <label>
              Tipo de documento
              <select value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}>
                <option value="TD001">Boleta</option>
                <option value="TD002">Factura</option>
              </select>
            </label>
            <label>
              Medio de pago
              <select value={medioPago} onChange={(e) => setMedioPago(e.target.value)}>
                <option value="MP001">Efectivo</option>
                <option value="MP002">Tarjeta de crédito</option>
                <option value="MP003">Tarjeta de débito</option>
                <option value="MP004">Yape</option>
                <option value="MP005">Plin</option>
                <option value="MP006">Transferencia</option>
                <option value="MP009">Visa</option>
                <option value="MP010">Mastercard</option>
              </select>
            </label>
            <label>
              Número documento del cliente
              <input value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)} placeholder="DNI o RUC" />
            </label>
            <div className="totalBox">
              <span>Total</span>
              <strong>{formatoMoneda(total)}</strong>
            </div>
            <button className="btnPrincipal" disabled={cargando} onClick={registrarVenta}>
              {cargando ? 'Registrando...' : 'Realizar pago'}
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
