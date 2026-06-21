import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Productos from './pages/Productos';
import Carrito from './pages/Carrito';
import Historial from './pages/Historial';
import Dashboard from './pages/Dashboard';
import Comprobante from './pages/Comprobante';
import Reportes from './pages/Reportes';
import { useApp } from './context/AppContext';

export default function App() {
  const { sesion, esAdmin } = useApp();
  const [vista, setVista] = useState('login');
  const [ventaGenerada, setVentaGenerada] = useState(null);

  useEffect(() => {
    if (!sesion) {
      setVista('login');
      return;
    }
    setVista(esAdmin ? 'dashboard' : 'productos');
  }, [sesion, esAdmin]);

  function cambiarVista(nuevaVista) {
    if (!sesion) {
      setVista('login');
      return;
    }
    setVista(nuevaVista);
  }

  function renderVista() {
    if (!sesion || vista === 'login') return <Login />;
    if (vista === 'productos') return <Productos />;
    if (vista === 'carrito') return <Carrito setVista={cambiarVista} setVentaGenerada={setVentaGenerada} />;
    if (vista === 'historial') return <Historial setVista={cambiarVista} setVentaGenerada={setVentaGenerada} />;
    if (vista === 'dashboard') return <Dashboard setVista={cambiarVista} />;
    if (vista === 'reportes') return <Reportes />;
    if (vista === 'comprobante') return <Comprobante venta={ventaGenerada} setVista={cambiarVista} />;
    return esAdmin ? <Dashboard setVista={cambiarVista} /> : <Productos />;
  }

  if (!sesion) {
    return <Login />;
  }

  return (
    <div className="appLayout">
      <Navbar vista={vista} setVista={cambiarVista} />
      <main className="contenido">
        {renderVista()}
      </main>
    </div>
  );
}
