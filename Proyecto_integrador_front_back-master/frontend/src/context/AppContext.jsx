import { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [sesion, setSesion] = useState(() => {
    const guardado = localStorage.getItem('sesion');
    return guardado ? JSON.parse(guardado) : null;
  });
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  const cliente = sesion?.rol === 'CLIENTE' ? sesion : null;
  const esAdmin = sesion?.rol === 'ADMIN';

  function guardarSesion(nuevaSesion) {
    setSesion(nuevaSesion);
    localStorage.setItem('sesion', JSON.stringify(nuevaSesion));
    if (nuevaSesion?.rol !== 'CLIENTE') {
      guardarCarrito([]);
    }
  }

  function cerrarSesion() {
    setSesion(null);
    setCarrito([]);
    localStorage.removeItem('sesion');
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
          ? { ...item, cantidad: Math.min(Number(item.stock), item.cantidad + 1) }
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
      carrito.map((item) => {
        if (item.idProducto !== idProducto) return item;
        return { ...item, cantidad: Math.min(Number(item.stock), nuevaCantidad) };
      })
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
        sesion,
        cliente,
        esAdmin,
        carrito,
        total,
        guardarSesion,
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
