# Backend Spring Boot

Backend adaptado a la base PostgreSQL `proyecto` del sistema de ventas.

## Ejecutar con PostgreSQL

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=postgres
```

## Ejecutar con H2

```bash
mvn spring-boot:run
```

## Perfil PostgreSQL

Archivo:

```text
src/main/resources/application-postgres.properties
```

Cambia usuario/contraseña según tu instalación local.

## Endpoints

```text
GET    /api/productos
POST   /api/clientes/login
POST   /api/clientes/registro
POST   /api/ventas
GET    /api/ventas/{idVenta}
GET    /api/ventas/cliente/{idCliente}
GET    /api/dashboard
GET    /api/catalogos/tipos-documento
GET    /api/catalogos/medios-pago
```
