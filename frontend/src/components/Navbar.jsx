import { BarChart3, FileText, History, LogOut, Package, ShoppingCart, UserRound } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar({ vista, setVista }) {
  const { sesion, esAdmin, carrito, cerrarSesion } = useApp();

  const opcionesCliente = [
    { id: 'productos', texto: 'Catálogo de compras', icono: Package },
    { id: 'carrito', texto: `Carrito (${carrito.length})`, icono: ShoppingCart },
    { id: 'historial', texto: 'Historial avanzado', icono: History }
  ];

  const opcionesAdmin = [
    { id: 'dashboard', texto: 'Estadísticas', icono: BarChart3 },
    { id: 'historial', texto: 'Historial y ventas', icono: History },
    { id: 'reportes', texto: 'Reportes', icono: FileText }
  ];

  const opciones = esAdmin ? opcionesAdmin : opcionesCliente;

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logoIcono">TZ</div>
        <div>
          <h1>TechZone</h1>
          <span>{esAdmin ? 'Panel administrador' : 'Tienda online'}</span>
        </div>
      </div>

      <nav className="menu">
        {opciones.map((opcion) => {
          const Icono = opcion.icono;
          return (
            <button
              key={opcion.id}
              className={vista === opcion.id ? 'activo' : ''}
              onClick={() => setVista(opcion.id)}
            >
              <Icono size={18} />
              {opcion.texto}
            </button>
          );
        })}
      </nav>

      <div className="usuarioBox">
        <div className="usuarioAvatar"><UserRound size={18} /></div>
        <strong>{sesion?.nombre} {sesion?.apellido}</strong>
        <span>{sesion?.rol === 'ADMIN' ? 'Administrador' : sesion?.correo || sesion?.id}</span>
        <button className="btnSalir" onClick={cerrarSesion}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
