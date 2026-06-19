export default function Alerta({ tipo = 'info', mensaje }) {
  if (!mensaje) return null;
  return <div className={`alerta ${tipo}`}>{mensaje}</div>;
}
