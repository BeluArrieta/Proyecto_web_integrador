import { BarChart3, History, LogOut, Package, ShoppingCart, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar({ vista, setVista }) {
  const { cliente, carrito, cerrarSesion } = useApp();

  const opciones = [
    { id: 'productos', texto: 'Productos', icono: Package },
    { id: 'carrito', texto: `Carrito (${carrito.length})`, icono: ShoppingCart },
    { id: 'historial', texto: 'Historial', icono: History },
    { id: 'dashboard', texto: 'Dashboard', icono: BarChart3 }
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logoIcono">TZ</div>
        <div>
          <h1>TechZone</h1>
          <span>Sistema de ventas</span>
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
        {cliente ? (
          <>
            <strong>{cliente.nombre} {cliente.apellido}</strong>
            <span>{cliente.correo || cliente.idCliente}</span>
            <button className="btnSalir" onClick={cerrarSesion}>
              <LogOut size={16} /> Cerrar sesión
            </button>
          </>
        ) : (
          <button className="btnSalir" onClick={() => setVista('login')}>
            <UserPlus size={16} /> Iniciar sesión
          </button>
        )}
      </div>
    </aside>
  );
}
