const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const mensaje = data?.mensaje || data?.message || 'Ocurrió un error en la petición';
    throw new Error(mensaje);
  }

  return data;
}

export const productoService = {
  listar: () => request('/productos'),
  crear: (producto) => request('/productos', { method: 'POST', body: JSON.stringify(producto) }),
  actualizar: (id, producto) => request(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(producto) }),
  eliminar: (id) => request(`/productos/${id}`, { method: 'DELETE' })
};

export const clienteService = {
  registrar: (cliente) => request('/clientes/registro', { method: 'POST', body: JSON.stringify(cliente) }),
  login: (credenciales) => request('/clientes/login', { method: 'POST', body: JSON.stringify(credenciales) }),
  listar: () => request('/clientes')
};

export const ventaService = {
  registrar: (venta) => request('/ventas', { method: 'POST', body: JSON.stringify(venta) }),
  buscar: (idVenta) => request(`/ventas/${idVenta}`),
  historialCliente: (idCliente) => request(`/ventas/cliente/${idCliente}`)
};

export const dashboardService = {
  obtener: () => request('/dashboard')
};

export const catalogoService = {
  tiposDocumento: () => request('/catalogos/tipos-documento'),
  mediosPago: () => request('/catalogos/medios-pago')
};
