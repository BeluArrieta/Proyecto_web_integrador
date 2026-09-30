// Catálogo de imágenes profesionales para los productos de TechZone

const IMAGENES_PRODUCTOS = {
  // Laptops
  'laptop lenovo': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
  'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
  
  // Periféricos
  'mouse logitech': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
  'mouse': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
  'teclado mecánico': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
  'teclado': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
  
  // Monitores
  'monitor samsung': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
  'monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
  
  // Impresión
  'impresora epson': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80',
  'impresora': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80',
  
  // Almacenamiento
  'usb 32gb': 'https://images.unsplash.com/photo-1624823183492-9118c7287955?w=600&auto=format&fit=crop&q=80',
  'disco ssd 480gb': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
  'ssd': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
  
  // Audio
  'audífonos sony': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  'audifonos sony': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  'parlante jbl': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
  'micrófono usb': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
  'microfono usb': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
  
  // Tablets
  'tablet samsung': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
  'tablet': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
  
  // Accesorios y Redes
  'cámara web': 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&auto=format&fit=crop&q=80',
  'camara web': 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&auto=format&fit=crop&q=80',
  'router tp-link': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
  'router': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
  'cable hdmi': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
  'silla gamer': 'https://dtotec.pe/products/silla-gamer-all-black-kuzler'
};

const IMAGEN_DEFAULT_TECH = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80';

export function obtenerImagenProducto(producto) {
  if (!producto) return IMAGEN_DEFAULT_TECH;
  if (producto.imagen && producto.imagen.startsWith('http')) {
    return producto.imagen;
  }

  const nombreNorm = (producto.nombre || '').toLowerCase().trim();
  
  // Búsqueda directa
  if (IMAGENES_PRODUCTOS[nombreNorm]) {
    return IMAGENES_PRODUCTOS[nombreNorm];
  }

  // Búsqueda por coincidencia parcial de palabras clave
  for (const [clave, url] of Object.entries(IMAGENES_PRODUCTOS)) {
    if (nombreNorm.includes(clave)) {
      return url;
    }
  }

  // Fallback por categoría
  const catNorm = (producto.categoria || '').toLowerCase().trim();
  for (const [clave, url] of Object.entries(IMAGENES_PRODUCTOS)) {
    if (catNorm.includes(clave)) {
      return url;
    }
  }

  return IMAGEN_DEFAULT_TECH;
}
