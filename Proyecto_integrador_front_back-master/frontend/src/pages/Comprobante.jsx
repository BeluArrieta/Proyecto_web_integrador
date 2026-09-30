import { useEffect, useState } from 'react';
import { ArrowLeft, FileText, Printer, Receipt, ShoppingBag } from 'lucide-react';
import ComprobanteA4 from '../components/ComprobanteA4';
import ComprobanteTicket from '../components/ComprobanteTicket';
import { ventaService } from '../services/api';
import { useApp } from '../context/AppContext';

export default function Comprobante({ venta: ventaInicial, setVista }) {
  const { esAdmin, cliente } = useApp();
  const [formato, setFormato] = useState('a4'); // 'a4' | 'ticket'
  const [listaVentas, setListaVentas] = useState([]);
  const [ventaActual, setVentaActual] = useState(ventaInicial);

  const ventaDemo = {
    idVenta: 'demo-10300686',
    tipoDocumento: 'Boleta',
    numeroDocumento: 'B002-10300686',
    cliente: 'CAMILO SANCHEZ',
    docCliente: '71262017',
    direccionCliente: 'CALLE LAS NORMAS 123',
    medioPago: 'Efectivo',
    condicionPago: 'CONTADO',
    ordenCompra: '---',
    guiaRemision: '---',
    observaciones: 'Venta generada desde plataforma web',
    fechaEmision: new Date('2024-03-06T11:27:00'),
    total: 20.00,
    detalles: [
      {
        idProducto: 1,
        producto: 'POLO BASICO TALLA SMALL',
        cantidad: 1,
        precioUnitario: 20.00,
        subtotal: 20.00
      }
    ]
  };

  useEffect(() => {
    async function cargarVentas() {
      try {
        const data = esAdmin ? await ventaService.listar() : (cliente ? await ventaService.historialCliente(cliente.id) : []);
        setListaVentas(data || []);
      } catch (err) {
        console.error('Error cargando ventas:', err);
      }
    }
    cargarVentas();
  }, [esAdmin, cliente]);

  useEffect(() => {
    if (ventaInicial) {
      setVentaActual(ventaInicial);
    } else if (!ventaActual) {
      setVentaActual(ventaDemo);
    }
  }, [ventaInicial]);

  function cambiarVentaSeleccionada(idVenta) {
    if (idVenta === 'demo') {
      setVentaActual(ventaDemo);
      return;
    }
    const encontrada = listaVentas.find((v) => v.idVenta === idVenta);
    if (encontrada) {
      const esFactura = (encontrada.tipoDocumento || '').toLowerCase().includes('factura');
      setVentaActual({
        ...encontrada,
        docCliente: esFactura ? '20100100100' : '71262017',
        direccionCliente: 'CALLE LAS NORMAS 123',
        condicionPago: 'CONTADO',
        observaciones: 'Comprobante electrónico emitido'
      });
    }
  }

  function alternarTipoComprobante(tipo) {
    if (!ventaActual) return;
    const esFactura = tipo === 'Factura';
    const nuevaSerie = esFactura ? 'F001' : 'B002';
    const correlativo = (ventaActual.numeroDocumento && ventaActual.numeroDocumento.includes('-'))
      ? ventaActual.numeroDocumento.split('-')[1]
      : '10300686';

    setVentaActual({
      ...ventaActual,
      tipoDocumento: esFactura ? 'Factura' : 'Boleta',
      numeroDocumento: `${nuevaSerie}-${correlativo}`,
      docCliente: esFactura ? '20100100100' : '71262017'
    });
  }

  const comprobanteAMostrar = ventaActual || ventaDemo;
  const esFactura = comprobanteAMostrar?.tipoDocumento?.toLowerCase().includes('factura');

  return (
    <section className="comprobanteSeccion">
      <div className="comprobanteControlBar no-print">
        <div className="comprobanteTituloInfo">
          <button className="btnIconoRegresar" onClick={() => setVista(esAdmin ? 'dashboard' : 'productos')} title="Regresar">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2>{esFactura ? 'Factura Electrónica' : 'Boleta de Venta Electrónica'}</h2>
            <p className="subtitulo">Comprobante oficial válido según normativa SUNAT</p>
          </div>
        </div>

        <div className="comprobanteSelectorVentaBox">
          <label htmlFor="selectorVenta">Comprobante:</label>
          <select
            id="selectorVenta"
            value={comprobanteAMostrar.idVenta}
            onChange={(e) => cambiarVentaSeleccionada(e.target.value)}
          >
            <option value="demo">Demo Imagen (B002-10300686 - S/ 20.00)</option>
            {listaVentas.map((v) => (
              <option key={v.idVenta} value={v.idVenta}>
                {v.numeroDocumento || v.idVenta.substring(0, 8)} - {v.cliente} (S/ {Number(v.total).toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div className="tipoDocToggleGroup">
          <button
            type="button"
            className={`btnToggleDoc ${!esFactura ? 'activo' : ''}`}
            onClick={() => alternarTipoComprobante('Boleta')}
          >
            Boleta
          </button>
          <button
            type="button"
            className={`btnToggleDoc ${esFactura ? 'activo' : ''}`}
            onClick={() => alternarTipoComprobante('Factura')}
          >
            Factura
          </button>
        </div>

        <div className="comprobanteSelectorWrapper">
          <div className="comprobanteSelector">
            <button
              className={`btnSelectorFormato ${formato === 'a4' ? 'activo' : ''}`}
              onClick={() => setFormato('a4')}
            >
              <FileText size={16} /> Formato A4
            </button>
            <button
              className={`btnSelectorFormato ${formato === 'ticket' ? 'activo' : ''}`}
              onClick={() => setFormato('ticket')}
            >
              <Receipt size={16} /> Formato Ticket 80mm
            </button>
          </div>

          <div className="comprobanteAcciones">
            <button className="btnPrincipal" onClick={() => window.print()}>
              <Printer size={18} /> Imprimir / Guardar PDF
            </button>
            <button className="btnSecundario" onClick={() => setVista(esAdmin ? 'historial' : 'productos')}>
              {esAdmin ? <Receipt size={16} /> : <ShoppingBag size={16} />}
              {esAdmin ? 'Historial ventas' : 'Catálogo'}
            </button>
          </div>
        </div>
      </div>

      <div className="comprobantePrevisualizacion">
        {formato === 'a4' ? (
          <ComprobanteA4 venta={comprobanteAMostrar} />
        ) : (
          <ComprobanteTicket venta={comprobanteAMostrar} />
        )}
      </div>
    </section>
  );
}
