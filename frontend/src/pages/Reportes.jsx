import { useEffect, useMemo, useState } from 'react';
import { BarChart3, CalendarDays, FileSpreadsheet, Package, Users } from 'lucide-react';
import { dashboardService, ventaService } from '../services/api';
import { formatoFecha, formatoMoneda } from '../utils/format';
import Alerta from '../components/Alerta';

export default function Reportes() {
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

  const productosVendidos = useMemo(() => {
    const mapa = {};
    ventas.forEach((venta) => {
      venta.detalles?.forEach((detalle) => {
        if (!mapa[detalle.producto]) {
          mapa[detalle.producto] = { producto: detalle.producto, cantidad: 0, total: 0 };
        }
        mapa[detalle.producto].cantidad += Number(detalle.cantidad || 0);
        mapa[detalle.producto].total += Number(detalle.subtotal || 0);
      });
    });
    return Object.values(mapa).sort((a, b) => b.cantidad - a.cantidad).slice(0, 8);
  }, [ventas]);

  const tarjetas = [
    { titulo: 'Clientes', valor: datos?.totalClientes || 0, icono: Users },
    { titulo: 'Ventas semana', valor: datos?.ventasSemana || 0, icono: CalendarDays },
    { titulo: 'Producto top', valor: datos?.productoMasVendidoMes || 'Sin ventas', icono: Package },
    { titulo: 'Ingreso mensual', valor: formatoMoneda(datos?.ingresosMes), icono: BarChart3 }
  ];

  return (
    <section>
      <div className="heroPanel">
        <div>
          <span className="miniTag">Módulo de reportes</span>
          <h2>Reportes del sistema</h2>
          <p>Indicadores listos para explicar que el proyecto usa datos reales desde la base de datos.</p>
        </div>
        <button className="btnPrincipal" onClick={() => window.print()}>
          <FileSpreadsheet size={17} /> Imprimir reporte
        </button>
      </div>

      <Alerta tipo="error" mensaje={mensaje} />

      {cargando ? (
        <div className="panelVacio">Generando reportes...</div>
      ) : (
        <>
          <div className="dashboardGrid">
            {tarjetas.map((item) => {
              const Icono = item.icono;
              return (
                <article className="dashboardCard" key={item.titulo}>
                  <div className="dashboardIcono"><Icono size={24} /></div>
                  <span>{item.titulo}</span>
                  <strong>{item.valor}</strong>
                </article>
              );
            })}
          </div>

          <div className="adminGridDos bloqueSeparado">
            <article className="panelInfo">
              <h3>Resumen ejecutivo</h3>
              <p>El sistema registra ventas, clientes, productos, comprobantes y métodos de pago. El administrador puede revisar indicadores de stock, ventas semanales e ingresos del mes.</p>
              <ul className="listaReporte">
                <li>Clientes que compraron: <b>{datos?.clientesCompraron || 0}</b></li>
                <li>Productos sin stock: <b>{datos?.productosAgotados || 0}</b></li>
                <li>Productos con stock crítico: <b>{datos?.stockCritico || 0}</b></li>
                <li>Fecha de reporte: <b>{formatoFecha(new Date())}</b></li>
              </ul>
            </article>

            <article className="panelInfo">
              <h3>Top productos vendidos</h3>
              <div className="rankingLista">
                {productosVendidos.map((item, index) => (
                  <div className="rankingItem" key={item.producto}>
                    <span>{index + 1}</span>
                    <div>
                      <strong>{item.producto}</strong>
                      <small>{item.cantidad} unidades - {formatoMoneda(item.total)}</small>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </>
      )}
    </section>
  );
}
