import { useEffect, useState } from 'react';
import { Package, Users, AlertTriangle, Trophy } from 'lucide-react';
import { dashboardService } from '../services/api';
import Alerta from '../components/Alerta';

export default function Dashboard() {
  const [datos, setDatos] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const data = await dashboardService.obtener();
        setDatos(data);
      } catch (error) {
        setMensaje(error.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) return <div className="panelVacio">Cargando dashboard...</div>;

  const tarjetas = [
    { titulo: 'Productos', valor: datos?.totalProductos || 0, icono: Package },
    { titulo: 'Clientes', valor: datos?.totalClientes || 0, icono: Users },
    { titulo: 'Agotados', valor: datos?.productosAgotados || 0, icono: AlertTriangle },
    { titulo: 'Más vendido', valor: datos?.productoMasVendidoMes || 'Sin ventas', icono: Trophy }
  ];

  return (
    <section>
      <div className="pageHeader">
        <div>
          <h2>Dashboard administrativo</h2>
          <p>Resumen general del sistema.</p>
        </div>
      </div>

      <Alerta tipo="error" mensaje={mensaje} />

      <div className="dashboardGrid">
        {tarjetas.map((tarjeta) => {
          const Icono = tarjeta.icono;
          return (
            <article className="dashboardCard" key={tarjeta.titulo}>
              <div className="dashboardIcono"><Icono size={24} /></div>
              <span>{tarjeta.titulo}</span>
              <strong>{tarjeta.valor}</strong>
            </article>
          );
        })}
      </div>

      <div className="panelInfo">
        <h3>Visualización del avance</h3>
        <p>
          Este panel está conectado al backend Spring Boot. Desde aquí puedes ampliar reportes de ventas,
          stock bajo, productos más vendidos y clientes frecuentes.
        </p>
      </div>
    </section>
  );
}
