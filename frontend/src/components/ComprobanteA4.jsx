import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { formatoFecha, numeroALetras } from '../utils/format';

export default function ComprobanteA4({ venta }) {
  const [qrUrl, setQrUrl] = useState('');

  const esFactura = venta?.tipoDocumento?.toLowerCase().includes('factura');
  const tipoTitulo = esFactura ? 'FACTURA ELECTRÓNICA' : 'BOLETA DE VENTA ELECTRÓNICA';
  const tipoDocCodigo = esFactura ? '01' : '03';

  // Configuración oficial de emisor TechZone
  const emisor = {
    nombre: 'TECHZONE',
    razonSocial: 'TECHZONE SOLUTIONS S.A.C.',
    ruc: '20100100100',
    direccion: 'CALLE LAS NORMAS 123, LIMA - PERÚ',
    telefono: '987 654 321',
    email: 'ventas@techzone.pe',
    web: 'www.techzone.pe'
  };

  // Desglose de serie y correlativo
  let serie = esFactura ? 'F001' : 'B002';
  let correlativo = '10300686';

  if (venta?.numeroDocumento && venta.numeroDocumento.includes('-')) {
    const partes = venta.numeroDocumento.split('-');
    serie = partes[0] || serie;
    correlativo = partes[1] || correlativo;
  } else if (venta?.numeroDocumento) {
    correlativo = venta.numeroDocumento;
  }

  // Cálculos tributarios SUNAT (Perú). El IGV viene de la tabla parametro.
  const totalNum = Number(venta?.total || 0);
  const opGravadaNum = Number(venta?.opGravada ?? (totalNum / (1 + Number(venta?.igvPorcentaje || 18) / 100)));
  const igvNum = Number(venta?.igv ?? (totalNum - opGravadaNum));

  const totalStr = totalNum.toFixed(2);
  const opGravadaStr = opGravadaNum.toFixed(2);
  const igvStr = igvNum.toFixed(2);

  const fechaEmisionStr = formatoFecha(venta?.fechaEmision || new Date());
  const fechaVencimientoStr = fechaEmisionStr;
  const montoEnLetras = numeroALetras(totalNum);

  const docCliente = venta?.docCliente || venta?.numeroDocumentoCliente || (esFactura ? '20601234567' : (venta?.idCliente?.replace(/\D/g, '') || '71262017'));
  const nombreCliente = venta?.cliente || 'CAMILO SANCHEZ';
  const direccionCliente = venta?.direccionCliente || 'CALLE LAS NORMAS 123, LIMA';
  const condicionPago = venta?.condicionPago || 'CONTADO';
  const ordenCompra = venta?.ordenCompra || 'OC-2026-001';
  const guia = venta?.guiaRemision || '---';
  const observaciones = venta?.observaciones || 'Venta efectuada a través de la plataforma virtual TechZone';

  useEffect(() => {
    const textoSunat = `${emisor.ruc}|${tipoDocCodigo}|${serie}|${correlativo}|${igvStr}|${totalStr}|${fechaEmisionStr}|${esFactura ? '6' : '1'}|${docCliente}|`;
    QRCode.toDataURL(textoSunat, { width: 140, margin: 1, color: { dark: '#000000', light: '#ffffff' } }, (err, url) => {
      if (!err && url) {
        setQrUrl(url);
      }
    });
  }, [venta, igvStr, totalStr, docCliente, serie, correlativo]);

  return (
    <div className="a4ComprobanteWrapper impresion-a4">
      {/* Encabezado Superior */}
      <div className="a4Header">
        {/* Logo Oficial TechZone */}
        <div className="a4LogoBox">
          <img src="/logo.png" alt="TechZone Logo" className="a4LogoImg" />
        </div>

        {/* Datos de la Empresa Emisora */}
        <div className="a4EmpresaInfo">
          <h2 className="a4NombreComercial">{emisor.nombre}</h2>
          <p className="a4RazonSocial">{emisor.razonSocial}</p>
          <p>{emisor.direccion}</p>
          <p><strong>Telf:</strong> {emisor.telefono}</p>
          <p><strong>Email:</strong> {emisor.email}</p>
          <p><strong>Web:</strong> {emisor.web}</p>
        </div>

        {/* Recuadro RUC y Numeración */}
        <div className="a4RucBox">
          <div className="a4RucNumero">R.U.C. {emisor.ruc}</div>
          <div className="a4TipoComprobante">{tipoTitulo}</div>
          <div className="a4Correlativo">N° {serie} - {correlativo}</div>
        </div>
      </div>

      {/* Recuadro Datos del Cliente */}
      <div className="a4ClienteBox">
        <div className="a4FilaDato">
          <span className="a4Label">Cliente</span>
          <span className="a4Separador">:</span>
          <span className="a4Valor uppercase">{nombreCliente}</span>
        </div>
        <div className="a4FilaDato">
          <span className="a4Label">Dirección</span>
          <span className="a4Separador">:</span>
          <span className="a4Valor">{direccionCliente}</span>
        </div>
        <div className="a4FilaDato">
          <span className="a4Label">{esFactura ? 'RUC' : 'DNI'}</span>
          <span className="a4Separador">:</span>
          <span className="a4Valor">{docCliente}</span>
        </div>
      </div>

      {/* Sección Observaciones */}
      <div className="a4ObservacionesHeader">
        <strong>Observaciones</strong>
        {observaciones && <p className="a4ObservacionesTexto">{observaciones}</p>}
      </div>

      {/* Tabla Secundaria de Fechas y Condiciones */}
      <div className="a4TablaCondiciones">
        <table>
          <thead>
            <tr>
              <th>FECHA EMISION</th>
              <th>FEC. VENCIMIENTO.</th>
              <th>ORDEN COMPRA / PEDIDO</th>
              <th>GUIA</th>
              <th>COND. DE PAGO</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{fechaEmisionStr}</td>
              <td>{fechaVencimientoStr}</td>
              <td>{ordenCompra}</td>
              <td>{guia}</td>
              <td>{condicionPago}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tabla Principal de Productos / Ítems */}
      <div className="a4TablaProductosWrapper">
        <table className="a4TablaProductos">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>CANTIDAD.</th>
              <th style={{ width: '10%' }}>U.M</th>
              <th style={{ width: '52%' }}>DESCRIPCIÓN</th>
              <th style={{ width: '14%' }} className="text-right">PRECIO UNIT.</th>
              <th style={{ width: '14%' }} className="text-right">IMPORTE (Inc. IGV)</th>
            </tr>
          </thead>
          <tbody>
            {venta?.detalles && venta.detalles.length > 0 ? (
              venta.detalles.map((detalle, idx) => (
                <tr key={idx} className="a4FilaItem">
                  <td className="text-center">{detalle.cantidad}</td>
                  <td className="text-center">UNIDAD</td>
                  <td className="uppercase">{detalle.producto}</td>
                  <td className="text-right">{Number(detalle.precioUnitario).toFixed(2)}</td>
                  <td className="text-right">{Number(detalle.subtotal).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr className="a4FilaItem">
                <td className="text-center">1</td>
                <td className="text-center">UNIDAD</td>
                <td className="uppercase">POLO BASICO TALLA SMALL</td>
                <td className="text-right">20.00</td>
                <td className="text-right">20.00</td>
              </tr>
            )}
            <tr className="a4FilaEspacio">
              <td colSpan={5}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sección Inferior: Monto en letras, QR y Totales */}
      <div className="a4PieDoc">
        <div className="a4PieIzquierda">
          <div className="a4MontoLetras">
            <strong>{montoEnLetras}</strong>
          </div>
          <div className="a4QrContenedor">
            {qrUrl && <img src={qrUrl} alt="Código QR SUNAT" className="a4QrImg" />}
          </div>
        </div>

        <div className="a4PieDerecha">
          <div className="a4LineaTotal">
            <span className="a4TotalLabel">OP. GRAVADA (S/)</span>
            <span className="a4TotalValor">{opGravadaStr}</span>
          </div>
          <div className="a4LineaTotal">
            <span className="a4TotalLabel">TOTAL IGV (S/)</span>
            <span className="a4TotalValor">{igvStr}</span>
          </div>
          <div className="a4SeparadorTotales"></div>
          <div className="a4LineaTotal a4ImporteFinal">
            <span className="a4TotalLabel">IMPORTE TOTAL (S/)</span>
            <span className="a4TotalValor">{totalStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
