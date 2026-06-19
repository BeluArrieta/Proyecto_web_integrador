import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ventaService } from '../services/api';
import { formatoFecha, formatoMoneda } from '../utils/format';
import Alerta from '../components/Alerta';

export default function Historial({ setVista, setVentaGenerada }) {
  const { cliente } = useApp();
  const [ventas, setVentas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarHistorial();
  }, [cliente]);

  async function cargarHistorial() {
    setMensaje('');

    if (!cliente) {
      setCargando(false);
      setMensaje('Debes iniciar sesión para ver tu historial.');
      return;
    }

    try {
      const data = await ventaService.historialCliente(cliente.idCliente);
      setVentas(data || []);
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  }

  function verDetalle(venta) {
    setVentaGenerada(venta);
    setVista('comprobante');
  }

  return (
    <section>
      <div className="pageHeader">
        <div>
          <h2>Historial de compras</h2>
          <p>Consulta tus boletas y facturas registradas.</p>
        </div>
      </div>

      <Alerta tipo="error" mensaje={mensaje} />

      {cargando ? (
        <div className="panelVacio">Cargando historial...</div>
      ) : ventas.length === 0 ? (
        <div className="panelVacio">Aún no hay compras registradas.</div>
      ) : (
        <div className="tablaCard">
          <table>
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Medio pago</th>
                <th>Total</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.idVenta}>
                  <td>{venta.idVenta}</td>
                  <td>{formatoFecha(venta.fechaEmision)}</td>
                  <td>{venta.tipoDocumento}</td>
                  <td>{venta.medioPago}</td>
                  <td>{formatoMoneda(venta.total)}</td>
                  <td>
                    <button onClick={() => verDetalle(venta)}>Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
