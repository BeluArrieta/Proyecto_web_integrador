export function formatoMoneda(valor) {
  return Number(valor || 0).toLocaleString('es-PE', {
    style: 'currency',
    currency: 'PEN'
  });
}

export function formatoFecha(fecha) {
  if (!fecha) return '-';
  const d = new Date(fecha);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

export function formatoHora(fecha) {
  if (!fecha) return '-';
  const d = new Date(fecha);
  let horas = d.getHours();
  const minutos = String(d.getMinutes()).padStart(2, '0');
  const ampm = horas >= 12 ? 'PM' : 'AM';
  horas = horas % 12;
  horas = horas ? horas : 12;
  return `${String(horas).padStart(2, '0')}:${minutos} ${ampm}`;
}

function convertirGrupo(n) {
  const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const veintenas = ['VEINTE', 'VEINTIÚN', 'VEINTIDÓS', 'VEINTITRÉS', 'VEINTICUATRO', 'VEINTICINCO', 'VEINTISÉIS', 'VEINTISIETE', 'VEINTIOCHO', 'VEINTINUEVE'];
  const decenas = ['', '', '', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  let texto = '';
  const c = Math.floor(n / 100);
  const d = Math.floor((n % 100) / 10);
  const u = n % 10;

  if (n === 100) return 'CIEN';
  if (c > 0) texto += centenas[c] + ' ';

  const resto = n % 100;
  if (resto >= 10 && resto <= 19) {
    texto += especiales[resto - 10];
  } else if (resto >= 20 && resto <= 29) {
    texto += veintenas[resto - 20];
  } else if (resto >= 30) {
    texto += decenas[d];
    if (u > 0) texto += ' Y ' + unidades[u];
  } else if (u > 0) {
    texto += unidades[u];
  }
  return texto.trim();
}

export function numeroALetras(cantidad) {
  const num = Number(cantidad || 0);
  const entero = Math.floor(num);
  const centavos = Math.round((num - entero) * 100);
  const centavosStr = String(centavos).padStart(2, '0');

  if (entero === 0) return `SON: CERO CON ${centavosStr}/100 SOLES`;

  let resultado = '';
  const millones = Math.floor(entero / 1000000);
  const miles = Math.floor((entero % 1000000) / 1000);
  const unidades = entero % 1000;

  if (millones === 1) resultado += 'UN MILLÓN ';
  else if (millones > 1) resultado += convertirGrupo(millones) + ' MILLONES ';

  if (miles === 1) resultado += 'MIL ';
  else if (miles > 1) resultado += convertirGrupo(miles) + ' MIL ';

  if (unidades > 0) resultado += convertirGrupo(unidades);

  return `SON: ${resultado.trim()} CON ${centavosStr}/100 SOLES`;
}

