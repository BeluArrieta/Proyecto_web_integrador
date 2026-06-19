import { useState } from 'react';
import { clienteService } from '../services/api';
import { useApp } from '../context/AppContext';
import Alerta from '../components/Alerta';

export default function Login({ setVista }) {
  const { guardarCliente } = useApp();
  const [modoRegistro, setModoRegistro] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [form, setForm] = useState({
    idCliente: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    password: ''
  });

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function enviar(e) {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    try {
      const cliente = modoRegistro
        ? await clienteService.registrar(form)
        : await clienteService.login({ idCliente: form.idCliente, password: form.password });

      guardarCliente(cliente);
      setVista('productos');
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <h2>{modoRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
          <p>Ingresa como cliente para comprar productos y ver tu historial.</p>
        </div>

        <Alerta tipo="error" mensaje={mensaje} />

        <form onSubmit={enviar} className="formulario">
          <label>
            Código de cliente
            <input name="idCliente" value={form.idCliente} onChange={cambiar} required />
          </label>

          {modoRegistro && (
            <>
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
            </>
          )}

          <label>
            Contraseña
            <input type="password" name="password" value={form.password} onChange={cambiar} required />
          </label>

          <button className="btnPrincipal" disabled={cargando}>
            {cargando ? 'Procesando...' : modoRegistro ? 'Registrarme' : 'Entrar'}
          </button>
        </form>

        <button className="btnLink" onClick={() => setModoRegistro(!modoRegistro)}>
          {modoRegistro ? 'Ya tengo cuenta' : 'Crear una cuenta nueva'}
        </button>
      </div>
    </section>
  );
}
