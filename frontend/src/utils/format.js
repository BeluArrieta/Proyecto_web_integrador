export function formatoMoneda(valor) {
  return Number(valor || 0).toLocaleString('es-PE', {
    style: 'currency',
    currency: 'PEN'
  });
}

export function formatoFecha(fecha) {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleString('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
}
