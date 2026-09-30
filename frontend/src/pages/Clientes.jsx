import { useEffect, useState } from 'react';
import { Mail, Phone, Search, UserCheck, Users, X } from 'lucide-react';
import { clienteService } from '../services/api';
import Alerta from '../components/Alerta';

export default function Clientes({ setVista }) {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const data = await clienteService.listar();
        setClientes(data || []);
      } catch (err) {
        setMensaje(err.message || 'Error al cargar clientes');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const filtrados = clientes.filter((c) => {
    const texto = `${c.idCliente} ${c.nombre} ${c.apellido} ${c.correo} ${c.telefono}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <section className="clientesSeccion">
      <div className="heroPanel no-print">
        <div>
          <span className="miniTag">Directorio de Clientes</span>
          <h2>Clientes Registrados</h2>
          <p>Consulta la cartera de clientes, números de contacto y cuentas activas en la plataforma.</p>
        </div>
        <div className="badgeContadorGeneral">
          <Users size={18} />
          <span>{clientes.length} Clientes Activos</span>
        </div>
      </div>

      <Alerta tipo="error" mensaje={mensaje} />

      <div className="filtrosAvanzadosBar no-print">
        <div className="inputIcono inputBusquedaHistorial">
          <Search size={18} />
          <input
            placeholder="Buscar cliente por DNI/ID, nombre, correo o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button className="btnLimpiarSearch" onClick={() => setBusqueda('')}>
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {cargando ? (
        <div className="panelVacio">Cargando directorio de clientes...</div>
      ) : filtrados.length === 0 ? (
        <div className="panelVacio">No se encontraron clientes con esos datos.</div>
      ) : (
        <div className="clientesGrid">
          {filtrados.map((cli) => (
            <article key={cli.idCliente} className="clienteCard">
              <div className="clienteAvatar">
                <UserCheck size={24} />
              </div>
              <div className="clienteInfo">
                <span className="clienteIdTag">{cli.idCliente}</span>
                <h3>{cli.nombre} {cli.apellido}</h3>
                
                <div className="clienteDetalles">
                  <div className="clienteDatoItem">
                    <Mail size={14} />
                    <span>{cli.correo || 'Sin correo registrado'}</span>
                  </div>
                  <div className="clienteDatoItem">
                    <Phone size={14} />
                    <span>{cli.telefono || 'Sin teléfono'}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
