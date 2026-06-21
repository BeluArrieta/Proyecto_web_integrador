import { useState } from 'react';
import { authService, clienteService } from '../services/api';
import { useApp } from '../context/AppContext';
import Alerta from '../components/Alerta';
import { LockKeyhole, User, UserPlus } from 'lucide-react';

export default function Login() {
  const { guardarSesion } = useApp();
  const [modoRegistro, setModoRegistro] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [form, setForm] = useState({
    usuario: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: ''
  });

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function enviar(e) {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    try {
      if (modoRegistro) {
        await clienteService.registrar({
          idCliente: form.usuario,
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono,
          correo: form.correo,
          password: form.password
        });
      }

      const sesion = await authService.login({ idCliente: form.usuario, password: form.password });
      guardarSesion(sesion);
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="loginShell">
      <section className="loginHero">
        <div className="brandBadge">Sistema de ventas conectado a BD</div>
        <h1>TechZone</h1>
        <p>Login único para cliente y administrador. La interfaz cambia automáticamente según el rol detectado.</p>
        <div className="loginStats">
          <span>UX/UI moderna</span>
          <span>Spring Boot</span>
          <span>React</span>
        </div>
      </section>

      <section className="authCard authCardModerna">
        <div className="authHeader">
          <span className="miniTag">{modoRegistro ? 'Registro de cliente' : 'Acceso al sistema'}</span>
          <h2>{modoRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
          <p>{modoRegistro ? 'Registra un cliente y entra al catálogo.' : 'Usa admin/123456 o CLI001/123456.'}</p>
        </div>

        <Alerta tipo="error" mensaje={mensaje} />

        <form onSubmit={enviar} className="formulario">
          <label>
            Usuario
            <div className="inputIcono">
              <User size={18} />
              <input name="usuario" value={form.usuario} onChange={cambiar} placeholder="admin o CLI001" required />
            </div>
          </label>

          {modoRegistro && (
            <div className="registroGrid">
              <label>
                Nombre
                <input name="nombre" value={form.nombre} onChange={cambiar} required />
              </label>
              <label>
                Apellido
                <input name="apellido" value={form.apellido} onChange={cambiar} required />
              </label>
              <label>
                Teléfono
                <input name="telefono" value={form.telefono} onChange={cambiar} />
              </label>
              <label>
                Correo
                <input type="email" name="correo" value={form.correo} onChange={cambiar} />
              </label>
            </div>
          )}

          <label>
            Contraseña
            <div className="inputIcono">
              <LockKeyhole size={18} />
              <input type="password" name="password" value={form.password} onChange={cambiar} placeholder="123456" required />
            </div>
          </label>

          <button className="btnPrincipal btnGrande" disabled={cargando}>
            {cargando ? 'Validando...' : modoRegistro ? 'Registrar e iniciar sesión' : 'Iniciar sesión'}
          </button>
        </form>

        <button className="btnLink" onClick={() => setModoRegistro(!modoRegistro)}>
          <UserPlus size={16} /> {modoRegistro ? 'Ya tengo cuenta' : 'Registrar nuevo cliente'}
        </button>
      </section>
    </main>
  );
}
