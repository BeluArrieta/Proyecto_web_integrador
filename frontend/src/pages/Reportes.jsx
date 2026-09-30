import { useEffect, useMemo, useState } from 'react';
import { BarChart3, CalendarDays, Eye, FileCheck, Package, Printer, Users } from 'lucide-react';
import { dashboardService, ventaService } from '../services/api';
import { formatoFecha, formatoMoneda } from '../utils/format';
import Alerta from '../components/Alerta';

export default function Reportes({ setVista, setVentaGenerada }) {
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
        setMensaje(error.message || 'Error al cargar reportes.');
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

  const totalIngresos = Number(datos?.ingresosMes || 0);
  const igvPorcentaje = Number(datos?.igvPorcentaje || 18);
  const totalOpGravada = totalIngresos / (1 + igvPorcentaje / 100);
  const totalIgv = totalIngresos - totalOpGravada;

  function abrirComprobante(venta) {
    const esFactura = (venta.tipoDocumento || '').toLowerCase().includes('factura');
    const ventaCompleta = {
      ...venta,
      docCliente: esFactura ? '20100100100' : '71262017',
      direccionCliente: 'CALLE LAS NORMAS 123',
      condicionPago: 'CONTADO',
      observaciones: 'Venta registrada en plataforma'
    };
    if (setVentaGenerada) {
      setVentaGenerada(ventaCompleta);
    }
    if (setVista) {
      setVista('comprobante');
    }
  }

  const tarjetas = [
    { titulo: 'Clientes en BD', valor: datos?.totalClientes || 0, icono: Users },
    { titulo: 'Ventas de la Semana', valor: datos?.ventasSemana || 0, icono: CalendarDays },
    { titulo: 'Producto más Vendido', valor: datos?.productoMasVendidoMes || 'Sin ventas', icono: Package },
    { titulo: 'Total Facturado (Mes)', valor: formatoMoneda(totalIngresos), icono: BarChart3 }
  ];

  return (
    <section className="reportesSeccion">
      <div className="heroPanel no-print">
        <div>
          <span className="miniTag">Módulo de Reportes & Liquidación Fiscal</span>
          <h2>Reportes Generales del Sistema</h2>
          <p>Supervisión tributaria de ventas, cálculo de IGV para SUNAT y control analítico.</p>
        </div>
        <div className="flex gap-2">
          {setVista && (
            <button className="btnPrincipal" onClick={() => setVista('comprobante')}>
              <FileCheck size={17} /> Ver Boletas y Facturas
            </button>
          )}
          <button className="btnSecundario" onClick={() => window.print()}>
            <Printer size={17} /> Imprimir Reporte
          </button>
        </div>
      </div>

      <Alerta tipo="error" mensaje={mensaje} />

      {cargando ? (
        <div className="panelVacio">Generando reportes del sistema...</div>
      ) : (
        <>
          <div className="no-print">
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

            <div className="panelTributarioSunat bloqueSeparado">
              <div className="panelTributarioHeader">
                <div className="iconoSunatBadge">SUNAT</div>
                <div>
                  <h3>Liquidación Tributaria Estimada (Período Actual)</h3>
                  <p>Cálculo sobre el valor de venta gravado e impuesto general a las ventas (18%).</p>
                </div>
              </div>

              <div className="desgloseSunatGrid">
                <div className="sunatItem">
                  <span>Base Imponible (Op. Gravada)</span>
                  <strong>{formatoMoneda(totalOpGravada)}</strong>
                </div>
                <div className="sunatItem">
                  <span>Débito Fiscal (IGV 18%)</span>
                  <strong className="textAzul">{formatoMoneda(totalIgv)}</strong>
                </div>
                <div className="sunatItem totalItem">
                  <span>Importe Facturado Total</span>
                  <strong className="textVerde">{formatoMoneda(totalIngresos)}</strong>
                </div>
              </div>
            </div>

            <div className="adminGridDos bloqueSeparado">
              <article className="panelInfo">
                <h3>Resumen Ejecutivo Comercial</h3>
                <p>El sistema sincroniza las ventas en tiempo real con el control de inventario y emisión de comprobantes oficiales.</p>
                <ul className="listaReporte">
                  <li>Clientes que compraron este período: <b>{datos?.clientesCompraron || 0}</b></li>
                  <li>Productos agotados en almacén: <b>{datos?.productosAgotados || 0}</b></li>
                  <li>Productos con stock crítico: <b>{datos?.stockCritico || 0}</b></li>
                  <li>Fecha de generación: <b>{formatoFecha(new Date())}</b></li>
                </ul>
              </article>

              <article className="panelInfo">
                <h3>Top Artículos Más Vendidos</h3>
                <div className="rankingLista">
                  {productosVendidos.map((item, index) => (
                    <div className="rankingItem" key={item.producto}>
                      <span className="rankingPos">{index + 1}</span>
                      <div className="rankingDetalle">
                        <strong>{item.producto}</strong>
                        <small>{item.cantidad} unidades vendidas — {formatoMoneda(item.total)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="tablaCard bloqueSeparado">
              <div className="tablaHeader">
                <div>
                  <h3>Últimos Comprobantes Emitidos</h3>
                  <p>Transacciones con comprobante electrónico listo para visualización e impresión.</p>
                </div>
                {setVista && (
                  <button className="btnSecundario" onClick={() => setVista('historial')}>
                    Ver historial completo
                  </button>
                )}
              </div>
              <table>
                <thead>
                  <tr>
                    <th>N° Comprobante</th>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Total</th>
                    <th className="text-center">Comprobante SUNAT</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.slice(0, 5).map((venta) => {
                    const esFactura = (venta.tipoDocumento || '').toLowerCase().includes('factura');
                    return (
                      <tr key={venta.idVenta}>
                        <td><strong>{venta.numeroDocumento || venta.idVenta.substring(0, 8)}</strong></td>
                        <td>{venta.cliente}</td>
                        <td>
                          <span className={`badgeTipoDoc ${esFactura ? 'badgeFactura' : 'badgeBoleta'}`}>
                            {venta.tipoDocumento}
                          </span>
                        </td>
                        <td><strong>{formatoMoneda(venta.total)}</strong></td>
                        <td className="text-center">
                          <button
                            className="btnVerComprobante"
                            onClick={() => abrirComprobante(venta)}
                          >
                            <Eye size={14} /> Ver Boleta / Factura
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="soloImpresionReporte">
            <div className="reporteImpresoHeader">
              <div>
                <h2>DEMOMIFACT / TECHZONE S.A.C.</h2>
                <p>R.U.C. 20100100100 — CALLE LAS NORMAS 123, LIMA</p>
                <p>Sistema Integrado de Ventas & Facturación Electrónica</p>
              </div>
              <div className="text-right">
                <h3>REPORTE EJECUTIVO OFICIAL</h3>
                <p>Fecha de emisión: {formatoFecha(new Date())}</p>
              </div>
            </div>

            <hr className="lineaSeparadorImpreso" />

            <h4>1. LIQUIDACIÓN FINANCIERA & TRIBUTARIA SUNAT</h4>
            <table className="tablaImpresaReporte">
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th className="text-right">Importe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Facturado en Ventas</td>
                  <td className="text-right">{formatoMoneda(totalIngresos)}</td>
                </tr>
                <tr>
                  <td>Base Imponible Acumulada (Operaciones Gravadas)</td>
                  <td className="text-right">{formatoMoneda(totalOpGravada)}</td>
                </tr>
                <tr>
                  <td>Débito Fiscal Impuesto General a las Ventas (I.G.V. 18%)</td>
                  <td className="text-right">{formatoMoneda(totalIgv)}</td>
                </tr>
                <tr>
                  <td>Clientes con Compras Efectivas</td>
                  <td className="text-right">{datos?.clientesCompraron || 0}</td>
                </tr>
              </tbody>
            </table>

            <h4 style={{ marginTop: '20px' }}>2. TOP PRODUCTOS CON MAYOR DEMANDA</h4>
            <table className="tablaImpresaReporte">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Artículo</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-right">Subtotal Facturado</th>
                </tr>
              </thead>
              <tbody>
                {productosVendidos.map((item, index) => (
                  <tr key={item.producto}>
                    <td>{index + 1}</td>
                    <td>{item.producto}</td>
                    <td className="text-center">{item.cantidad}</td>
                    <td className="text-right">{formatoMoneda(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="firmasReporteImpreso">
              <div className="firmaBox">
                <div className="lineaFirma"></div>
                <span>Administrador General</span>
                <small>Responsable de Operaciones</small>
              </div>
              <div className="firmaBox">
                <div className="lineaFirma"></div>
                <span>Área Contable y Tributaria</span>
                <small>Revisión SUNAT</small>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
