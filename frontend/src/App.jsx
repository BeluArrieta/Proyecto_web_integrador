import { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Productos from './pages/Productos';
import Carrito from './pages/Carrito';
import Historial from './pages/Historial';
import Dashboard from './pages/Dashboard';
import Comprobante from './pages/Comprobante';
import { useApp } from './context/AppContext';

export default function App() {
  const { cliente } = useApp();
  const [vista, setVista] = useState(cliente ? 'productos' : 'login');
  const [ventaGenerada, setVentaGenerada] = useState(null);

  function renderVista() {
    if (vista === 'login') return <Login setVista={setVista} />;
    if (vista === 'productos') return <Productos />;
    if (vista === 'carrito') return <Carrito setVista={setVista} setVentaGenerada={setVentaGenerada} />;
    if (vista === 'historial') return <Historial setVista={setVista} setVentaGenerada={setVentaGenerada} />;
    if (vista === 'dashboard') return <Dashboard />;
    if (vista === 'comprobante') return <Comprobante venta={ventaGenerada} setVista={setVista} />;
    return <Productos />;
  }

  return (
    <div className="appLayout">
      <Navbar vista={vista} setVista={setVista} />
      <main className="contenido">
        {renderVista()}
      </main>
    </div>
  );
}
