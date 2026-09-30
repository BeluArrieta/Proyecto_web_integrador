import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { formatoFecha, formatoHora, numeroALetras } from '../utils/format';

export default function ComprobanteTicket({ venta }) {
  const [qrUrl, setQrUrl] = useState('');

  const esFactura = venta?.tipoDocumento?.toLowerCase().includes('factura');
  const tipoTitulo = esFactura ? 'FACTURA ELECTRÓNICA' : 'BOLETA DE VENTA ELECTRÓNICA';
  const tipoDocCodigo = esFactura ? '01' : '03';

  const emisor = {
    nombre: 'DEMOMIFACT',
    razonSocial: 'EMPRESA DEMO SAC',
    ruc: '20100100100',
    direccion: 'CALLE LAS NORMAS 123',
    telefono: '987 654 321',
    email: 'Administrador@facturas.net',
    web: 'www.facturas.net',
    resolucion: 'Autorizado mediante Resolución 034-005-0007241'
  };

  let serie = esFactura ? 'F001' : 'B002';
  let correlativo = '10300686';

  if (venta?.numeroDocumento && venta.numeroDocumento.includes('-')) {
    const partes = venta.numeroDocumento.split('-');
    serie = partes[0] || serie;
    correlativo = partes[1] || correlativo;
  } else if (venta?.numeroDocumento) {
    correlativo = venta.numeroDocumento;
  }

  const totalNum = Number(venta?.total || 0);
  const opGravadaNum = totalNum / 1.18;
  const igvNum = totalNum - opGravadaNum;

  const totalStr = totalNum.toFixed(2);
  const opGravadaStr = opGravadaNum.toFixed(2);
  const igvStr = igvNum.toFixed(2);

  const fechaObj = venta?.fechaEmision ? new Date(venta.fechaEmision) : new Date();
  const fechaStr = formatoFecha(fechaObj);
  const horaStr = formatoHora(fechaObj);
  const montoEnLetras = numeroALetras(totalNum);

  const docCliente = venta?.docCliente || venta?.numeroDocumentoCliente || (esFactura ? '20601234567' : (venta?.idCliente?.replace(/\D/g, '') || '71262017'));
  const nombreCliente = venta?.cliente || 'CAMILO SANCHEZ';
  const direccionCliente = venta?.direccionCliente || '---';
  const medioPago = (venta?.medioPago || 'EFECTIVO').toUpperCase();
  const condicionPago = (venta?.condicionPago || 'CONTADO').toUpperCase();
  const observaciones = venta?.observaciones || '';

  useEffect(() => {
    const textoSunat = `${emisor.ruc}|${tipoDocCodigo}|${serie}|${correlativo}|${igvStr}|${totalStr}|${fechaStr}|${esFactura ? '6' : '1'}|${docCliente}|`;
    QRCode.toDataURL(textoSunat, { width: 130, margin: 1, color: { dark: '#000000', light: '#ffffff' } }, (err, url) => {
      if (!err && url) {
        setQrUrl(url);
      }
    });
  }, [venta, igvStr, totalStr, docCliente, serie, correlativo]);

  return (
    <div className="ticketWrapper impresion-ticket">
      {/* Logo Superior */}
      <div className="ticketLogo">
        <svg width="170" height="52" viewBox="0 0 170 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="170" height="52" rx="4" fill="#000000" />
          <g transform="translate(10, 9)">
            <path d="M12 5 L22 11 L22 21 L12 27 L2 21 L2 11 Z" stroke="#EAB308" strokeWidth="2.8" fill="none" strokeLinejoin="round" />
            <path d="M22 11 L32 17 L32 27 L22 33 L12 27" stroke="#F59E0B" strokeWidth="2.8" fill="none" strokeLinejoin="round" />
            <path d="M7 14 L17 20 L17 25" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
          </g>
          <text x="50" y="24" fill="#FFFFFF" fontSize="13" fontWeight="900" letterSpacing="1.2" fontFamily="'Courier New', monospace, sans-serif">HYDRA</text>
          <text x="50" y="39" fill="#EAB308" fontSize="11" fontWeight="800" letterSpacing="1.8" fontFamily="'Courier New', monospace, sans-serif">COMPANY</text>
        </svg>
      </div>

      {/* Datos Emisor */}
      <div className="ticketCentro">
        <div className="ticketBold ticketTituloEmisor">{emisor.nombre}</div>
        <div className="ticketBold">{emisor.razonSocial}</div>
        <div className="ticketBold">RUC: {emisor.ruc}</div>
        <div>{emisor.direccion}</div>
        <div>Telf: {emisor.telefono}</div>
        <div>Correo: {emisor.email}</div>
        <div>Web: {emisor.web}</div>
      </div>

      {/* Titulo Documento y Serie */}
      <div className="ticketCentro ticketBloqueTitulo">
        <div className="ticketBold ticketDocumentoTipo">{tipoTitulo}</div>
        <div className="ticketBold ticketDocumentoSerie">{serie} - {correlativo}</div>
      </div>

      {/* Datos Cliente */}
      <div className="ticketCentro ticketDatosCliente">
        <div className="ticketBold uppercase">{nombreCliente}</div>
        <div>{direccionCliente}</div>
        <div className="ticketBold">{esFactura ? 'RUC' : 'DNI'} {docCliente}</div>
        <div>
          <span>FECHA: {fechaStr}</span>&nbsp;&nbsp;
          <span>HORA: {horaStr}</span>
        </div>
      </div>

      <div className="ticketSeparador"></div>

      {/* Tabla Ítems Ticket */}
      <div className="ticketTablaHeader">
        <span>Cant</span>
        <span>U.M</span>
        <span>COD</span>
        <span>PRECIO</span>
        <span>TOTAL</span>
      </div>
      <div className="ticketDescripcionLabel">DESCRIPCION</div>

      <div className="ticketItems">
        {venta?.detalles && venta.detalles.length > 0 ? (
          venta.detalles.map((detalle, idx) => (
            <div key={idx} className="ticketItemFila">
              <div className="ticketItemValores">
                <span>{detalle.cantidad}</span>
                <span>UNIDAD</span>
                <span>{String(9810007000000 + (detalle.idProducto || idx + 1)).substring(0, 13)}</span>
                <span>{Number(detalle.precioUnitario).toFixed(2)}</span>
                <span>{Number(detalle.subtotal).toFixed(2)}</span>
              </div>
              <div className="ticketItemNombre uppercase">{detalle.producto}</div>
            </div>
          ))
        ) : (
          <div className="ticketItemFila">
            <div className="ticketItemValores">
              <span>1</span>
              <span>UNIDAD</span>
              <span>9810007005004</span>
              <span>20.00</span>
              <span>20.00</span>
            </div>
            <div className="ticketItemNombre uppercase">POLO BASICO TALLA SMALL</div>
          </div>
        )}
      </div>

      <div className="ticketSeparador"></div>

      {/* Bloque Totales */}
      <div className="ticketTotales">
        <div className="ticketFilaTotal">
          <span>TOTAL GRAVADO</span>
          <span>(S/)</span>
          <span className="ticketMonto">{opGravadaStr}</span>
        </div>
        <div className="ticketFilaTotal">
          <span>I.G.V</span>
          <span>(S/)</span>
          <span className="ticketMonto">{igvStr}</span>
        </div>
        <div className="ticketFilaTotal ticketTotalFinal">
          <span>TOTAL</span>
          <span>(S/)</span>
          <span className="ticketMonto">{totalStr}</span>
        </div>
      </div>

      <div className="ticketSeparador"></div>

      {/* Info de Pago y Observaciones */}
      <div className="ticketPagoInfo">
        <div className="ticketBold">{montoEnLetras}</div>
        <div><strong>FORMA DE PAGO:</strong> {medioPago}</div>
        <div><strong>COND.VENTA:</strong> {condicionPago}</div>
        <div><strong>Observaciones:</strong> {observaciones}</div>
      </div>

      {/* Código QR */}
      <div className="ticketQrBox">
        {qrUrl && <img src={qrUrl} alt="Código QR SUNAT Ticket" className="ticketQrImg" />}
      </div>

      {/* Leyenda y Resolución */}
      <div className="ticketPie">
        <p>Representación Impresa de la {tipoTitulo}</p>
        <p>Puede consultar en: <strong>{emisor.web.toUpperCase()}</strong></p>
        <p>{emisor.resolucion}</p>
        <div className="ticketMiFactLogo">
          <svg width="60" height="18" viewBox="0 0 60 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="9" r="4.5" stroke="#0284c7" strokeWidth="2" fill="none" />
            <circle cx="12" cy="9" r="4.5" stroke="#0ea5e9" strokeWidth="2" fill="none" />
            <text x="21" y="13" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="Arial">Mifact</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
