import { formatoFecha, formatoMoneda } from '../utils/format';

export default function Comprobante({ venta, setVista }) {
  if (!venta) {
    return (
      <div className="panelVacio">
        No hay comprobante generado.
        <button className="btnPrincipal" onClick={() => setVista('productos')}>Volver</button>
      </div>
    );
  }

  return (
    <section>
      <div className="comprobante">
        <div className="comprobanteHeader">
          <div>
            <h2>{venta.tipoDocumento} electrónica</h2>
            <p>TechZone - Sistema de ventas</p>
          </div>
          <strong>{venta.idVenta}</strong>
        </div>

        <div className="datosComprobante">
          <p><b>Cliente:</b> {venta.cliente}</p>
          <p><b>ID Cliente:</b> {venta.idCliente}</p>
          <p><b>Documento:</b> {venta.numeroDocumento || '-'}</p>
          <p><b>Medio de pago:</b> {venta.medioPago}</p>
          <p><b>Fecha:</b> {formatoFecha(venta.fechaEmision)}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {venta.detalles?.map((detalle) => (
              <tr key={detalle.idProducto}>
                <td>{detalle.producto}</td>
                <td>{detalle.cantidad}</td>
                <td>{formatoMoneda(detalle.precioUnitario)}</td>
                <td>{formatoMoneda(detalle.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="comprobanteTotal">
          <span>Total pagado</span>
          <strong>{formatoMoneda(venta.total)}</strong>
        </div>

        <div className="accionesComprobante">
          <button onClick={() => window.print()}>Imprimir</button>
          <button className="btnPrincipal" onClick={() => setVista('historial')}>Ver historial</button>
        </div>
      </div>
    </section>
  );
}
