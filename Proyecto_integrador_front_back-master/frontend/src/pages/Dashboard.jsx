import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Boxes, PackageCheck, ShoppingBag, TrendingUp, Trophy, Users, WalletCards } from 'lucide-react';
import { dashboardService, ventaService } from '../services/api';
import { formatoMoneda } from '../utils/format';
import Alerta from '../components/Alerta';

export default function Dashboard({ setVista }) {
  const [datos, setDatos] = useState(null);
  const [ventas, setVentas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const [resumen, historial] = await Promise.all([
          dashboardService.obtener(),
          ventaService.listar()
        ]);
        setDatos(resumen);
        setVentas(historial || []);
      } catch (error) {
        setMensaje(error.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const ventasRecientes = useMemo(() => ventas.slice(0, 5), [ventas]);

  if (cargando) return <div className="panelVacio">Cargando estadísticas conectadas a la base de datos...</div>;

  const tarjetas = [
    { titulo: 'Usuarios registrados', valor: datos?.totalClientes || 0, icono: Users, detalle: 'Clientes en BD' },
    { titulo: 'Productos activos', valor: datos?.totalProductos || 0, icono: Boxes, detalle: 'Catálogo completo' },
    { titulo: 'Ventas esta semana', valor: datos?.ventasSemana || 0, icono: ShoppingBag, detalle: formatoMoneda(datos?.ingresosSemana) },
    { titulo: 'Ingresos del mes', valor: formatoMoneda(datos?.ingresosMes), icono: WalletCards, detalle: 'Total facturado' }
  ];

  return (
    <section>
      <div className="heroPanel">
        <div>
          <span className="miniTag">Panel administrativo</span>
          <h2>Estadísticas generales</h2>
          <p>Vista moderna para controlar ventas, clientes, stock y productos más vendidos.</p>
        </div>
        <button className="btnPrincipal" onClick={() => setVista('reportes')}>Ver reportes</button>
      </div>

      <Alerta tipo="error" mensaje={mensaje} />

      {datos?.productosAgotados > 0 ? (
        <div className="alertaStock">
          <AlertTriangle size={22} />
          <div>
            <strong>Alerta de stock</strong>
            <p>Hay {datos.productosAgotados} producto(s) sin stock. Revisa el inventario para evitar ventas fallidas.</p>
          </div>
        </div>
      ) : (
        <div className="alertaStock okStock">
          <PackageCheck size={22} />
          <div>
            <strong>Stock disponible</strong>
            <p>No hay productos agotados. Productos con stock crítico: {datos?.stockCritico || 0}.</p>
          </div>
        </div>
      )}

      <div className="dashboardGrid">
        {tarjetas.map((tarjeta) => {
          const Icono = tarjeta.icono;
          return (
            <article className="dashboardCard" key={tarjeta.titulo}>
              <div className="dashboardIcono"><Icono size={24} /></div>
              <span>{tarjeta.titulo}</span>
              <strong>{tarjeta.valor}</strong>
              <small>{tarjeta.detalle}</small>
            </article>
          );
        })}
      </div>

      <div className="adminGridDos">
        <article className="panelInfo panelDestacado">
          <div className="dashboardIcono"><Trophy size={24} /></div>
          <h3>Producto vendido esta semana</h3>
          <strong>{datos?.productoMasVendidoSemana || 'Sin ventas'}</strong>
          <p>Este dato sale del detalle de ventas registrado en la base de datos.</p>
        </article>

        <article className="panelInfo panelDestacado">
          <div className="dashboardIcono"><TrendingUp size={24} /></div>
          <h3>Producto más vendido del mes</h3>
          <strong>{datos?.productoMasVendidoMes || 'Sin ventas'}</strong>
          <p>Útil para explicar indicadores y toma de decisiones en la exposición.</p>
        </article>
      </div>

      <div className="tablaCard bloqueSeparado">
        <div className="tablaHeader">
          <div>
            <h3>Últimas compras registradas</h3>
            <p>Resumen rápido de las ventas más recientes.</p>
          </div>
          <button onClick={() => setVista('historial')}>Ver historial completo</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Comprobante</th>
              <th>Medio</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {ventasRecientes.map((venta) => (
              <tr key={venta.idVenta}>
                <td>{venta.cliente}</td>
                <td>{venta.tipoDocumento}</td>
                <td>{venta.medioPago}</td>
                <td>{formatoMoneda(venta.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
