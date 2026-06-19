INSERT INTO tipo_documento VALUES
('TD001', 'Boleta'),
('TD002', 'Factura');

INSERT INTO medio_pago VALUES
('MP001', 'Efectivo'),
('MP002', 'Tarjeta de crédito'),
('MP003', 'Tarjeta de débito'),
('MP004', 'Yape'),
('MP005', 'Plin'),
('MP006', 'Transferencia'),
('MP007', 'Pago contra entrega'),
('MP008', 'Billetera digital'),
('MP009', 'Visa'),
('MP010', 'Mastercard'),
('MP011', 'American Express'),
('MP012', 'Depósito'),
('MP013', 'Crédito empresarial'),
('MP014', 'Pago mixto'),
('MP015', 'PayPal');

INSERT INTO persona VALUES
('PER001', 'Luis', 'García', '1998-05-12', 'luis@gmail.com', '987654321', 'luisg'),
('PER002', 'Ana', 'Torres', '1999-08-20', 'ana@gmail.com', '987654322', 'anat'),
('PER003', 'Carlos', 'Ramos', '1997-03-15', 'carlos@gmail.com', '987654323', 'carlosr'),
('PER004', 'María', 'Flores', '2000-11-10', 'maria@gmail.com', '987654324', 'mariaf'),
('PER005', 'Pedro', 'Castro', '1996-01-25', 'pedro@gmail.com', '987654325', 'pedroc'),
('PER006', 'Lucía', 'Mendoza', '2001-06-30', 'lucia@gmail.com', '987654326', 'luciam'),
('PER007', 'Jorge', 'Paredes', '1995-09-18', 'jorge@gmail.com', '987654327', 'jorgep'),
('PER008', 'Rosa', 'Vargas', '1998-12-05', 'rosa@gmail.com', '987654328', 'rosav'),
('PER009', 'Miguel', 'Salas', '1994-04-22', 'miguel@gmail.com', '987654329', 'miguels'),
('PER010', 'Diana', 'Quispe', '2002-02-14', 'diana@gmail.com', '987654330', 'dianaq'),
('PER011', 'José', 'Reyes', '1999-07-07', 'jose@gmail.com', '987654331', 'joser'),
('PER012', 'Elena', 'Campos', '1997-10-09', 'elena@gmail.com', '987654332', 'elenac'),
('PER013', 'Raúl', 'Navarro', '1996-03-29', 'raul@gmail.com', '987654333', 'rauln'),
('PER014', 'Sofía', 'Herrera', '2001-05-19', 'sofia@gmail.com', '987654334', 'sofiah'),
('PER015', 'Fernando', 'Lozano', '1995-08-11', 'fernando@gmail.com', '987654335', 'fernandol'),
('PERADM', 'Administrador', 'General', '1995-01-01', 'admin@softplex.com', '999999999', 'admin');

INSERT INTO usuario(usuario, contrasena, id_persona) VALUES
('luisg', '123456', 'PER001'),
('anat', '123456', 'PER002'),
('carlosr', '123456', 'PER003'),
('mariaf', '123456', 'PER004'),
('pedroc', '123456', 'PER005'),
('luciam', '123456', 'PER006'),
('jorgep', '123456', 'PER007'),
('rosav', '123456', 'PER008'),
('miguels', '123456', 'PER009'),
('dianaq', '123456', 'PER010'),
('joser', '123456', 'PER011'),
('elenac', '123456', 'PER012'),
('rauln', '123456', 'PER013'),
('sofiah', '123456', 'PER014'),
('fernandol', '123456', 'PER015'),
('admin', '123456', 'PERADM');

INSERT INTO cliente VALUES
('CLI001', 'Luis', 'García', '987654321', '123456', 'luis@gmail.com'),
('CLI002', 'Ana', 'Torres', '987654322', '123456', 'ana@gmail.com'),
('CLI003', 'Carlos', 'Ramos', '987654323', '123456', 'carlos@gmail.com'),
('CLI004', 'María', 'Flores', '987654324', '123456', 'maria@gmail.com'),
('CLI005', 'Pedro', 'Castro', '987654325', '123456', 'pedro@gmail.com'),
('CLI006', 'Lucía', 'Mendoza', '987654326', '123456', 'lucia@gmail.com'),
('CLI007', 'Jorge', 'Paredes', '987654327', '123456', 'jorge@gmail.com'),
('CLI008', 'Rosa', 'Vargas', '987654328', '123456', 'rosa@gmail.com'),
('CLI009', 'Miguel', 'Salas', '987654329', '123456', 'miguel@gmail.com'),
('CLI010', 'Diana', 'Quispe', '987654330', '123456', 'diana@gmail.com'),
('CLI011', 'José', 'Reyes', '987654331', '123456', 'jose@gmail.com'),
('CLI012', 'Elena', 'Campos', '987654332', '123456', 'elena@gmail.com'),
('CLI013', 'Raúl', 'Navarro', '987654333', '123456', 'raul@gmail.com'),
('CLI014', 'Sofía', 'Herrera', '987654334', '123456', 'sofia@gmail.com'),
('CLI015', 'Fernando', 'Lozano', '987654335', '123456', 'fernando@gmail.com');

INSERT INTO producto VALUES
(1, 'Laptop Lenovo', 20, 2500.00, 'Laptops'),
(2, 'Mouse Logitech', 50, 45.00, 'Periféricos'),
(3, 'Teclado Mecánico', 35, 150.00, 'Periféricos'),
(4, 'Monitor Samsung', 18, 780.00, 'Monitores'),
(5, 'Impresora Epson', 12, 650.00, 'Impresión'),
(6, 'USB 32GB', 100, 25.00, 'Almacenamiento'),
(7, 'Disco SSD 480GB', 40, 230.00, 'Almacenamiento'),
(8, 'Audífonos Sony', 30, 120.00, 'Audio'),
(9, 'Parlante JBL', 25, 180.00, 'Audio'),
(10, 'Tablet Samsung', 15, 950.00, 'Tablets'),
(11, 'Cámara Web', 22, 90.00, 'Accesorios'),
(12, 'Router TP-Link', 28, 160.00, 'Redes'),
(13, 'Cable HDMI', 60, 30.00, 'Cables'),
(14, 'Silla Gamer', 10, 520.00, 'Gaming'),
(15, 'Micrófono USB', 17, 210.00, 'Audio');

INSERT INTO venta VALUES
('VEN001', 'PER001', 'TD001', 'B001-000001', 'MP004', CURRENT_TIMESTAMP),
('VEN002', 'PER002', 'TD002', 'F001-000002', 'MP002', CURRENT_TIMESTAMP),
('VEN003', 'PER003', 'TD001', 'B001-000003', 'MP001', CURRENT_TIMESTAMP),
('VEN004', 'PER004', 'TD002', 'F001-000004', 'MP006', CURRENT_TIMESTAMP),
('VEN005', 'PER005', 'TD001', 'B001-000005', 'MP005', CURRENT_TIMESTAMP),
('VEN006', 'PER006', 'TD002', 'F001-000006', 'MP009', CURRENT_TIMESTAMP),
('VEN007', 'PER007', 'TD001', 'B001-000007', 'MP003', CURRENT_TIMESTAMP),
('VEN008', 'PER008', 'TD002', 'F001-000008', 'MP010', CURRENT_TIMESTAMP),
('VEN009', 'PER009', 'TD001', 'B001-000009', 'MP001', CURRENT_TIMESTAMP),
('VEN010', 'PER010', 'TD002', 'F001-000010', 'MP004', CURRENT_TIMESTAMP),
('VEN011', 'PER011', 'TD001', 'B001-000011', 'MP005', CURRENT_TIMESTAMP),
('VEN012', 'PER012', 'TD002', 'F001-000012', 'MP006', CURRENT_TIMESTAMP),
('VEN013', 'PER013', 'TD001', 'B001-000013', 'MP007', CURRENT_TIMESTAMP),
('VEN014', 'PER014', 'TD002', 'F001-000014', 'MP013', CURRENT_TIMESTAMP),
('VEN015', 'PER015', 'TD001', 'B001-000015', 'MP015', CURRENT_TIMESTAMP);

INSERT INTO detalle_venta(id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
('VEN001', 1, 1, 2500.00, 2500.00),
('VEN001', 2, 2, 45.00, 90.00),
('VEN002', 4, 1, 780.00, 780.00),
('VEN002', 3, 1, 150.00, 150.00),
('VEN003', 6, 3, 25.00, 75.00),
('VEN004', 5, 1, 650.00, 650.00),
('VEN005', 7, 1, 230.00, 230.00),
('VEN006', 8, 2, 120.00, 240.00),
('VEN007', 9, 1, 180.00, 180.00),
('VEN008', 10, 1, 950.00, 950.00),
('VEN009', 11, 2, 90.00, 180.00),
('VEN010', 12, 1, 160.00, 160.00),
('VEN011', 13, 4, 30.00, 120.00),
('VEN012', 14, 1, 520.00, 520.00),
('VEN013', 15, 1, 210.00, 210.00),
('VEN014', 1, 1, 2500.00, 2500.00),
('VEN015', 2, 1, 45.00, 45.00);

CREATE VIEW historial_compras AS
SELECT
    v.id_venta,
    v.fecha_emision,
    td.nombre AS tipo_documento,
    pe.nombre AS cliente,
    pe.apellido,
    pr.nombre AS producto,
    dv.cantidad,
    dv.precio_unitario,
    dv.subtotal,
    mp.descripcion AS medio_pago
FROM venta v
INNER JOIN persona pe ON v.id_persona = pe.id_persona
INNER JOIN tipo_documento td ON v.id_tipo_documento = td.id_documento
INNER JOIN medio_pago mp ON v.id_medio_pago = mp.id_medio_pago
INNER JOIN detalle_venta dv ON v.id_venta = dv.id_venta
INNER JOIN producto pr ON dv.id_producto = pr.id_producto;
