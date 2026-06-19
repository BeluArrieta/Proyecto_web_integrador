import { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cliente, setCliente] = useState(() => {
    const guardado = localStorage.getItem('cliente');
    return guardado ? JSON.parse(guardado) : null;
  });
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  function guardarCliente(nuevoCliente) {
    setCliente(nuevoCliente);
    localStorage.setItem('cliente', JSON.stringify(nuevoCliente));
  }

  function cerrarSesion() {
    setCliente(null);
    setCarrito([]);
    localStorage.removeItem('cliente');
    localStorage.removeItem('carrito');
  }

  function guardarCarrito(items) {
    setCarrito(items);
    localStorage.setItem('carrito', JSON.stringify(items));
  }

  function agregarProducto(producto) {
    const existe = carrito.find((item) => item.idProducto === producto.idProducto);
    let actualizado;

    if (existe) {
      actualizado = carrito.map((item) =>
        item.idProducto === producto.idProducto
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      actualizado = [...carrito, { ...producto, cantidad: 1 }];
    }

    guardarCarrito(actualizado);
  }

  function cambiarCantidad(idProducto, cantidad) {
    const nuevaCantidad = Math.max(1, Number(cantidad));
    guardarCarrito(
      carrito.map((item) =>
        item.idProducto === idProducto ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  }

  function quitarProducto(idProducto) {
    guardarCarrito(carrito.filter((item) => item.idProducto !== idProducto));
  }

  function limpiarCarrito() {
    guardarCarrito([]);
  }

  const total = useMemo(
    () => carrito.reduce((suma, item) => suma + Number(item.precio) * item.cantidad, 0),
    [carrito]
  );

  return (
    <AppContext.Provider
      value={{
        cliente,
        carrito,
        total,
        guardarCliente,
        cerrarSesion,
        agregarProducto,
        cambiarCantidad,
        quitarProducto,
        limpiarCarrito
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
