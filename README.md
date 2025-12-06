Travel Booker API
=================
API REST en NestJS para gestionar destinos y reservas con autenticacion JWT, control de roles/permisos y paginacion en los listados.

Requisitos previos
------------------
- Node.js >= 18 y npm.
- PostgreSQL 14+ con una base de datos creada (ver variables de entorno).
- Git (opcional) y Postman/Insomnia para probar endpoints.

Variables de entorno
--------------------
- Copia `environment/.env.example` a `environment/.env` y ajusta los valores para tu entorno local/CI.
- Si seteas `NODE_ENV`, se intentará cargar también `environment/.env.<NODE_ENV>` antes de `environment/.env` (sirve para separar prod/stage/dev). Si no existe, se usa solo `.env`.
- Sample incluido (`environment/.env.example`):
  ```
  DB_HOST=localhost
  DB_PORT=5432
  DB_DATABASE=travel_booker
  DB_SCHEMA=public
  DB_USER=postgres
  DB_PASSWORD=postgres
  DB_SYNCHRONIZE=true   # dev: true; prod: false + migraciones
  DB_LOGGING=false
  JWT_SECRET=replace_me_with_a_secret_key
  JWT_EXPIRES=60s
  PORT=3000             # opcional; por defecto 3000
  ```

JWT
---
- Se firma/valida con la constante `SecurityConstants.JwtSecret` (`src/common/strategy/security.constants..ts`).

Puesta en marcha
----------------
1) Instalar dependencias  
`npm install`

2) Base de datos  
- Crear la base de datos indicada en `DB_DATABASE` y el usuario con permisos.  
- Migraciones: el proyecto actualmente usa `DB_SYNCHRONIZE=true` en dev, por lo que el esquema se genera automáticamente sin migraciones. Para producción se recomienda poner `DB_SYNCHRONIZE=false` y crear migraciones, pero no están configuradas aún (los scripts de `package.json` requieren un `typeorm.config.ts` que hoy no existe).
- Seeds RBAC: se ejecutan automaticamente al iniciar la app (idempotente). Para correrlos manualmente: `npm run seed:rbac`.

3) Levantar en desarrollo  
- `npm run start` (NestJS).  
- `npm run start:debug` (nodemon + inspeccion).  
- Swagger UI disponible en `http://localhost:3000/docs` con auth Bearer.
- Logs estructurados: el `LoggingInterceptor` imprime en consola las peticiones y respuestas (con metodo, ruta, estado y tiempo), utiles para observar el trafico durante el desarrollo.

4) Pruebas  
- Unitarias: `npm test` o `npm run test:watch`.  

Docker (opcional)
-----------------
- Archivos: `documentos/Dockerfile` y `documentos/docker-compose.yml`.
- Levantar API + Postgres desde `documentos/`:
  ```bash
  docker compose up --build
  ```
- La API queda en `http://localhost:3000` y Postgres en `localhost:5432`.
- Usa el archivo `environment/.env` que crees a partir del ejemplo y fuerza `DB_HOST=db` dentro del compose (ajusta si cambias el env file).

Arquitectura
------------
- Capas: `controller` (HTTP y validacion basica), `service` (reglas de negocio), `dto` (entradas/salidas tipadas), `model` (entities TypeORM) y `common` (decorators, guards, interceptores).
- Modulos: agrupados via `src/config/module/*.ts` para registrar controllers y providers por dominio (account, auth, booking, destination, util).
- Datos: TypeORM + `SnakeNamingStrategy` para columnas snake_case y `typeorm-transactional` para manejar contexto transaccional cuando se necesite.
- Documentacion: Swagger se monta en `/docs`. `LoggingInterceptor` centraliza logs de peticiones/respuestas.
- DTOs: serializacion con `class-transformer` (`excludeExtraneousValues`) para exponer solo campos esperados.

Autenticacion
-------------
- Login via `LocalStrategy` (`/auth/login`): valida email/password con bcrypt contra `User.passwordHash`.
- Tokens JWT firmados con `SecurityConstants.JwtSecret`, duracion de acceso 8h y refresh 30 dias (`AuthService`).  
- `JwtStrategy` lee el Bearer token y rellena `request.user`.  
- Refresh token en `/auth/refresh-token` vuelve a emitir access token si el refresh es valido.
- Registro (`/auth/register`) protegido con permisos `USER_CREATE` y `USER_ASSIGN_ROLE`; si no se especifican roles, asigna VIEWER por defecto.

Roles y permisos (RBAC)
-----------------------
- Entidades: `Role`, `Permission`, `RolePermission`, `UserRole` y `PermissionType` (enum central).  
- `PermissionGuard` usa un decorator (`@Permissions`) para extraer permisos requeridos y compararlos con los permisos agregados de los roles del usuario. Responde con `MessageCodes` claros en caso de falta de permisos.
- Seed RBAC (se corre al iniciar la app o con `npm run seed:rbac`): crea roles ADMIN/AGENT/VIEWER, todos los permisos, y usuarios admin/agent/viewer con password `password123`. Cambia credenciales despues de probar.

Paginacion y filtros
--------------------
- Util `createPage` en `src/dto/common/page.ts` devuelve metadata (`totalElements`, `totalPages`, `first/last`, etc.). La numeracion de paginas es base 0 (`page=0` es la primera).
- Destinos: filtros por `country` y `city` con `ILIKE`, estado `isActive`, orden por `id DESC`.
- Bookings: filtros por `status`, `destinationId`, y rango de fechas (`fromDate`/`toDate`); incluye joins a destino y usuario creador.
- Usuarios/Roles: busqueda parcial por nombre/email, estado y rol; roles por nombre parcial.

Decisiones de diseno
--------------------
- NestJS modular con inyeccion de dependencias para aislar dominios (account/auth/booking/destination/util) y facilitar pruebas unitarias.
- TypeORM con `SnakeNamingStrategy` para alinear la base con convenciones SQL y mantener DTOs desacoplados de nombres de columnas.
- Hash de contrasenas con `bcryptjs` y tokens JWT cortos para acceso + refresh largo; expiraciones parametrizables via env.
- RBAC basado en permisos finos (no solo roles) para granularidad; guard y decorator custom para minimizar logica repetida en controllers.
- DTOs serializados con `class-transformer` para evitar fugas de campos sensibles y mantener contratos de API consistentes.
- Validaciones y errores centralizados con `CustomError` + `MessageCodes` para mensajes internos trazables.
- CORS habilitado y Swagger incorporado para acelerar pruebas/manual QA.

Rutas utiles
------------
- Salud/metricas: `GET /health`, `GET /metrics`.
- Auth: `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`.
- Destinos: CRUD con permisos de destino; delete hace soft-delete marcando `isActive=false` si no hay bookings activos.
- Bookings: CRUD con validaciones de destino activo y estado de reserva; elimina hard-delete.

Endpoints y permisos clave
--------------------------
- Usuarios: `GET /users` (ADMIN), `POST /users` (ADMIN), `PATCH /users/:id` (ADMIN), `PATCH /users/:id/roles` (ADMIN).
- Roles: `GET /roles` (ADMIN).
- Destinos: `POST /destinations` (ADMIN o AGENT), `GET /destinations` (cualquier autenticado), `GET /destinations/:id`, `PATCH /destinations/:id` (ADMIN o AGENT), `DELETE /destinations/:id` (ADMIN) con soft-delete y bloqueo si hay bookings activos.
- Bookings: `POST /bookings` (ADMIN o AGENT), `GET /bookings` (cualquier autenticado), `GET /bookings/:id`, `PATCH /bookings/:id` (ADMIN o AGENT para cambiar estado), `DELETE /bookings/:id` (ADMIN).

Observabilidad
--------------
- Logs estructurados en consola via `LoggingInterceptor` (metodo, ruta, estado HTTP, duracion).
- `GET /health` verifica disponibilidad de la aplicacion y la base de datos.
- `GET /metrics` devuelve contadores de usuarios/destinos/bookings, estados de reservas, uso de memoria, uptime y estado del DB (ping).

Pruebas
-------
- Jest configurado; prueba unitaria incluida para `AuthService` (`test/auth/auth.service.spec.ts`) cubre emision de JWT y error cuando el usuario no existe.
- Ejecutar con `npm test`, `npm run test:watch` o `npm run test:cov`.

