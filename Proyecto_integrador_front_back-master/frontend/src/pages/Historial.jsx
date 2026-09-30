import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ventaService } from '../services/api';
import { formatoFecha, formatoMoneda } from '../utils/format';
import Alerta from '../components/Alerta';

export default function Historial({ setVista, setVentaGenerada }) {
  const { cliente, esAdmin } = useApp();
  const [ventas, setVentas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  useEffect(() => {
    cargarHistorial();
  }, [cliente, esAdmin]);

  async function cargarHistorial() {
    setMensaje('');

    if (!cliente && !esAdmin) {
      setCargando(false);
      setMensaje('Debes iniciar sesión para ver el historial.');
      return;
    }

    try {
      const data = esAdmin ? await ventaService.listar() : await ventaService.historialCliente(cliente.id);
      setVentas(data || []);
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  }

  const filtradas = useMemo(() => {
    return ventas.filter((venta) => {
      const texto = `${venta.idVenta} ${venta.cliente} ${venta.tipoDocumento} ${venta.medioPago}`.toLowerCase();
      const fecha = venta.fechaEmision ? new Date(venta.fechaEmision) : null;
      const coincideTexto = texto.includes(busqueda.toLowerCase());
      const coincideDesde = !desde || (fecha && fecha >= new Date(`${desde}T00:00:00`));
      const coincideHasta = !hasta || (fecha && fecha <= new Date(`${hasta}T23:59:59`));
      return coincideTexto && coincideDesde && coincideHasta;
    });
  }, [ventas, busqueda, desde, hasta]);

  const resumen = useMemo(() => {
    const clientesUnicos = new Set(filtradas.map((venta) => venta.cliente));
    const total = filtradas.reduce((suma, venta) => suma + Number(venta.total || 0), 0);
    const productos = filtradas.flatMap((venta) => venta.detalles || []);
    const masVendido = productos.reduce((acc, item) => {
      const actual = acc[item.producto] || 0;
      acc[item.producto] = actual + Number(item.cantidad || 0);
      return acc;
    }, {});
    const productoTop = Object.entries(masVendido).sort((a, b) => b[1] - a[1])[0];

    return {
      ventas: filtradas.length,
      clientes: clientesUnicos.size,
      total,
      productoTop: productoTop ? `${productoTop[0]} (${productoTop[1]})` : 'Sin datos'
    };
  }, [filtradas]);

  function verDetalle(venta) {
    setVentaGenerada(venta);
    setVista('comprobante');
  }

  return (
    <section>
      <div className="pageHeader modernoHeader">
        <div>
          <span className="miniTag">{esAdmin ? 'Historial administrativo' : 'Mis compras'}</span>
          <h2>Historial con búsqueda avanzada</h2>
          <p>{esAdmin ? 'Filtra por cliente, comprobante, fecha o medio de pago.' : 'Consulta tus comprobantes y vuelve a revisar cada compra.'}</p>
        </div>
      </div>

      <Alerta tipo="error" mensaje={mensaje} />

      <div className="resumenHistorial">
        <article><span>Ventas</span><strong>{resumen.ventas}</strong></article>
        <article><span>Clientes que compraron</span><strong>{resumen.clientes}</strong></article>
        <article><span>Total filtrado</span><strong>{formatoMoneda(resumen.total)}</strong></article>
        <article><span>Producto vendido</span><strong>{resumen.productoTop}</strong></article>
      </div>

      <div className="filtros filtrosAvanzados">
        <div className="inputIcono">
          <Search size={18} />
          <input placeholder="Buscar por cliente, comprobante o medio de pago..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        <button className="btnSecundario" onClick={() => { setBusqueda(''); setDesde(''); setHasta(''); }}>
          <SlidersHorizontal size={16} /> Limpiar
        </button>
      </div>

      {cargando ? (
        <div className="panelVacio">Cargando historial...</div>
      ) : filtradas.length === 0 ? (
        <div className="panelVacio">No hay compras con esos filtros.</div>
      ) : (
        <div className="tablaCard">
          <table>
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Medio pago</th>
                <th>Total</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((venta) => (
                <tr key={venta.idVenta}>
                  <td>{venta.idVenta}</td>
                  <td>{venta.cliente}</td>
                  <td>{formatoFecha(venta.fechaEmision)}</td>
                  <td>{venta.tipoDocumento}</td>
                  <td>{venta.medioPago}</td>
                  <td>{formatoMoneda(venta.total)}</td>
                  <td><button onClick={() => verDetalle(venta)}>Ver</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
