# Backend Spring Boot

Backend adaptado a MySQL 8.0 (base de datos `proyecto`).

## 1. Crear la base de datos

Pegar y ejecutar completo en MySQL Workbench / phpMyAdmin / DBeaver:

```text
database/script_mysql.sql
```

Crea la base `proyecto`, las 8 tablas, inserta los datos iniciales y la vista
`historial_compras`. Es idempotente: se puede volver a ejecutar.

## 2. Ejecutar con MySQL

```bash
mvn spring-boot:run
```

o con el perfil explicito:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

## 3. Ejecutar con H2 (opcional, en memoria)

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

Panel H2: http://localhost:8080/h2-console

## Archivos de configuracion

```text
src/main/resources/application.properties          -> MySQL (configuracion por defecto)
src/main/resources/application-mysql.properties    -> MySQL (perfil "mysql")
src/main/resources/application-h2.properties       -> H2    (perfil "h2")
src/main/resources/application-postgres.properties -> PostgreSQL (perfil "postgres", obsoleto)
```

Ajustar `spring.datasource.username` y `spring.datasource.password` segun la
instalacion local de MySQL.

## Nota importante

`spring.sql.init.mode=never` en el perfil MySQL. Spring **no** ejecuta
`data.sql` en cada arranque: los datos se cargan una sola vez desde
`database/script_mysql.sql`. Si se dejara en `always`, cada reinicio lanzaria
`Duplicate entry` sobre las claves primarias.

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
