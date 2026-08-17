# MIGRATION_CHECKLIST.md — Validación pre-corte PHP → Node.js/Express

**Fecha:** 2026-08-09
**Alcance:** Fase 8 del plan de migración (`migracion_plan.md`) — validación completa, **sin corte**.
**Estado de los archivos PHP/JSON/.htaccess/.txt:** intactos, no tocados en esta fase.

---

## 1. Arquitectura actual (sigue en producción)

```
Apache/XAMPP (http://localhost/Pagina%20web/)
├── *.html (raíz, 22 páginas)
├── css/main.css, js/*.js
├── api/*.php (24 archivos) ──► MySQL group_tqc
├── servicios.json, proyectos.json, investigacion.json, cursos.json, usuarios.json (obsoletos, sin uso activo)
└── .htaccess (rewrite + seguridad)
```

## 2. Arquitectura nueva (en pruebas, puertos separados)

```
frontend/ (Node http.Server puro, :8080, sirve también assets/ compartido en /assets)
    ↓ fetch() → http://localhost:4000
backend/ (Express, :4000)
  ├── config/database.js (mysql2/promise, pool)
  ├── routes/ → controllers/ → models/  (5 colecciones "artículo")
  ├── routes/ con SQL directo (8 entidades "custom", ver §11)
  └── middleware/loginRateLimit.middleware.js
    ↓
MySQL group_tqc (LA MISMA BASE DE DATOS QUE USA PHP HOY)
```

## 3. Diagrama de flujo

```
Navegador/Flutter → HTTP → routes/*.routes.js → (controllers/*.controller.js →) models/*.model.js → mysql2 pool → MySQL
```

---

## 4. Tabla PHP vs Node (24 archivos de `api/*.php`)

| PHP actual | Endpoint Node | Método | Estado | Notas |
|---|---|---|---|---|
| `conexion.php` | `backend/config/database.js` | — | COMPLETO | mismo host/user/db, pool en vez de conexión única |
| `crud_factory.php` | `backend/models/collection.model.js` + `controllers/collection.controller.js` | — | COMPLETO | slugify/todayDisplay/handleCollection replicados campo a campo |
| `servicios.php` | `/api/servicios` | GET/POST/PUT/DELETE | COMPLETO | `incluye`/`galeria` (JSON), `destacado` (bool→int), `contenido`, `intro_imagen` verificados 1:1 con fallback `??` de PHP |
| `proyectos.php` | `/api/proyectos` | GET/POST/PUT/DELETE | COMPLETO | `fecha_admin` se recalcula en cada PUT (igual que PHP, no solo en creación) |
| `investigacion.php` | `/api/investigacion` | GET/POST/PUT/DELETE | COMPLETO | |
| `cursos.php` | `/api/cursos` | GET/POST/PUT/DELETE | COMPLETO | `docente_id` probado con relación real a `docentes` |
| `docentes.php` | `/api/docentes` (+ `?slug=`) | GET/POST/PUT/DELETE | COMPLETO | vista detalle con JOIN a `cursos WHERE estado='published'` replicada exacta (mismos campos: `nombre,role,bio,photo,linkedin,cursos[]`) |
| `acreditaciones.php` | `/api/acreditaciones` | GET/POST/PUT/DELETE | COMPLETO | `archivo_tipo` enum validado (`pdf`/`imagen`/``) |
| `clientes.php` | `/api/clientes` | GET/POST/PUT/DELETE | COMPLETO | límite de 25 verificado; borrado de logo físico en DELETE verificado |
| `estadisticas.php` | `/api/estadisticas` | GET/PUT | COMPLETO | sin POST/DELETE, igual que PHP (filas fijas) |
| `nosotros_bloques.php` | `/api/nosotros_bloques` | GET/PUT (`?clave=`) | COMPLETO | clave primaria no numérica respetada |
| `nosotros_valores.php` | `/api/nosotros_valores` | GET/POST/PUT/DELETE | COMPLETO | límite de 6 verificado con prueba real (bloqueó la creación #7) |
| `nosotros_staff.php` | `/api/nosotros_staff` | GET/POST/PUT/DELETE | COMPLETO | borrado de imagen física en DELETE verificado |
| `nosotros_trayectoria.php` | `/api/nosotros_trayectoria` | GET/PUT | COMPLETO | |
| `contenido.php` | `/api/contenido` | GET/PUT | COMPLETO | upsert clave→valor probado con clave temporal, limpiada tras la prueba |
| `reportes.php` | `/api/reportes?tipo=` | GET | COMPLETO | las 4 variantes (`overview`,`drafts`,`cursos-sin-docente`,`docentes-sin-cursos`) devuelven agregaciones idénticas a las consultas SQL de PHP (copiadas literalmente) |
| `login.php` | `/api/login` | POST | COMPLETO (mejorado) | rate-limit 5/15min replicado (lockfiles ahora en `backend/middleware/`, no expuestos vía HTTP a diferencia del root de PHP); contraseña migra de texto plano a bcrypt en el primer login exitoso |
| `cambiar_contrasena.php` | `/api/cambiar_contrasena` | POST | COMPLETO (mejorado) | ahora hashea con bcrypt en vez de guardar texto plano |
| `upload.php` | `/api/upload` | POST | COMPLETO | validación de extensión, firma real de archivo (magic bytes, no solo extensión), límite 10MB, borrado de `anterior`, todo probado con casos válidos e inválidos |
| `migrar_json_a_mysql.php` | — | — | NO NECESARIO | script de migración de un solo uso, ya ejecutado; JSON de origen obsoletos |
| `migrate_docentes.php` | — | — | NO NECESARIO | migración de esquema ya aplicada a la BD viva |
| `migrar_docentes_normalizado.php` | — | — | NO NECESARIO | migración de esquema ya aplicada |
| `migrate-servicios.php` | — | — | NO NECESARIO | migración de esquema ya aplicada |
| `migrate_password_change.php` | — | — | NO NECESARIO | migración de esquema ya aplicada |
| `migracion_nosotros.sql` / `migracion_nosotros_trayectoria.sql` | — | — | NO NECESARIO | tablas ya creadas y pobladas en la BD viva |

**Resultado: 19/19 endpoints funcionales migrados = COMPLETO. 0 PARCIAL. 0 FALTANTE.** (Los 5 scripts de migración restantes son de un solo uso y no aplican al backend nuevo.)

---

## 5. Entidades validadas contra la BD real (`group_tqc`)

Confirmado `SHOW CREATE TABLE` + conteo de filas antes de tocar nada: `servicios`(7), `proyectos`(3), `investigacion`(3), `cursos`(21), `docentes`(3), `usuarios`(1), `acreditaciones`(5), `clientes`(22), `estadisticas`(4), `contenido_sitio`(8), `nosotros_bloques`(5), `nosotros_valores`(6), `nosotros_staff`(7), `nosotros_trayectoria`(3). No se inventó ninguna entidad; no existe `docentes.json` ni tabla adicional.

## 6. Pruebas CRUD realizadas (registros de prueba, verificado 0 residuos tras cada corrida)

- **servicios**: crear (con `incluye`/`destacado`) → editar → eliminar → eliminar de nuevo (404) — 6/6 PASS
- **cursos**: crear con `docente_id` real → verificar relación → eliminar — 3/3 PASS
- **docentes**: crear → detalle por slug (con `cursos[]`) → eliminar — 4/4 PASS
- **nosotros_valores**: límite de 6 respetado (creación #7 devolvió 400 como se esperaba)
- **nosotros_staff**: crear → eliminar — 2/2 PASS
- **acreditaciones/clientes**: validación de campos obligatorios (400 sin título/nombre/logo) — 2/2 PASS
- **contenido**: PUT con clave temporal → GET refleja el cambio → limpieza — 2/2 PASS
- **estadisticas**: PUT no-op sobre fila real (mismos valores, sin alterar datos) — 1/1 PASS
- **Errores**: crear sin título (400), editar/eliminar ID inexistente (404), tipo de reporte inválido (400) — 4/4 PASS

**Total: 24/24 aserciones PASS. Verificación posterior por SQL directo: 0 filas `__TEST%` residuales en ninguna tabla.**

## 7. Autenticación

- Usuario inexistente → 401. Contraseña incorrecta → 401. Contraseña correcta → 200 + redirect correcto.
- **Migración lazy a bcrypt verificada**: se creó un usuario de prueba (`__test_migracion__`) con contraseña en texto plano, se hizo login → la fila se reescribió con hash `$2a$10$...`, un segundo login con la misma contraseña siguió funcionando (vía `bcrypt.compare`), y una contraseña incorrecta después de la migración devolvió 401 correctamente.
- `cambiar_contrasena` probado end-to-end con el mismo usuario de prueba: contraseña actualizada, `contrasena_changed=1`.
- **Usuario de prueba eliminado** tras las pruebas; se verificó `SELECT COUNT(*) FROM usuarios` = 1 (solo el admin real, sin tocar). El admin real **nunca** fue usado para login ni se le cambió la contraseña.
- Login probado también end-to-end en navegador real (Playwright): formulario → POST `/api/login` → 200 → redirect a `cambiar_contrasena.html` (porque `contrasena_changed=0` para el usuario de prueba, igual que haría el admin real si no hubiera cambiado su contraseña).
- **Protección de rutas administrativas**: ni PHP ni Node aplican protección server-side a `/api/servicios` etc. (cualquiera con la URL puede leer/escribir) — esto es una **debilidad preexistente en el sistema PHP actual**, no una regresión introducida por Node. Ver §9.

## 8. Uploads

- Archivo válido (PNG 1×1) → guardado en `assets/uploads/<tabla>/`, URL pública correcta.
- Extensión no permitida (`.exe`) → 400.
- Tabla no permitida (`usuarios`) → 400.
- Archivo con extensión `.png` pero contenido falso (no es imagen real) → 400 (validación por firma de bytes, no solo extensión).
- Archivo >10MB → 400 (límite de Multer).
- Reemplazo con `anterior`: se subió imagen A, luego imagen B con `anterior=A` → **A se borró físicamente del disco**, B quedó. Verificado con `ls` antes/después.
- **`assets/` sigue compartido en la raíz del proyecto, no duplicado.** Decisión arquitectónica documentada: duplicarlo habría costado 243MB adicionales y desincronizado las imágenes subidas por el backend nuevo respecto al frontend nuevo. El backend Node escribe en la misma ruta física (`<raíz>/assets/uploads/<tabla>/`) que usa PHP hoy.

## 9. Frontend — auditoría de referencias

- Grep completo de `frontend/**/*.{html,js}` en busca de `.json'`, `api/*.php`, `XMLHttpRequest`: **0 coincidencias** — ningún archivo del frontend nuevo depende de los JSON obsoletos ni llama directamente a un `.php`.
- `localhost:4000` aparece **solo** en `frontend/js/api-base.js` y `frontend/js/config.js`, ambos como *fallback* (`window.API_BASE || 'http://localhost:4000'`), sobreescribible antes de cargar esos scripts — **correcto para desarrollo, debe parametrizarse antes de producción** (ver §13).
- `localhost:8080` no aparece en ningún archivo del frontend (solo se usa externamente para servirlo) — correcto.
- Todos los `fetch()`/`ApiClient.fetch()` que antes usaban rutas relativas `api/...` ahora resuelven contra `API_BASE` (22 archivos HTML + 10 archivos JS modificados, verificados con `node --check` sin errores de sintaxis).

### ⚠️ Hallazgo: `<base href="/Pagina%20web/">` en `docentes.html` y `detalle.html`

Estas 2 páginas (de 22) usan un `<base>` tag que ancla **todas** las rutas relativas (CSS, JS, imágenes, incluso `fetch()` sin prefijo) a la ruta absoluta `/Pagina%20web/` del hosting actual de Apache/XAMPP. Es un patrón **preexistente**, no introducido por esta migración (ya documentado en `CLAUDE.md` para `detalle.html`; `docentes.html` lo usa también aunque no estaba documentado). Al servir `frontend/docentes.html` desde `http://localhost:8080`, el `<base>` sigue apuntando a `/Pagina%20web/` (que no existe en ese puerto), causando **~30 errores 404** (CSS, JS, imágenes de clientes) confirmados con Playwright. El contenido de texto seguía renderizando porque las llamadas API usan URLs absolutas, pero **la página se ve rota sin estilos**.

**Esto NO es un bug de mi implementación del backend/API — es una incompatibilidad estructural entre el patrón `<base href>` original (pensado para un solo hosting Apache en una ruta fija) y una arquitectura frontend/backend desacoplada que puede vivir en cualquier host/puerto.** Debe resolverse antes del corte: opciones — (a) hacer el `href` del `<base>` dinámico vía JS antes de que el navegador lo aplique (no es posible, `<base>` se procesa al parsear el HTML), (b) eliminar el `<base>` y resolver `tipo`/`slug` únicamente por query string en vez de por path rewriting, ajustando `.htaccess`/proxy del nuevo hosting, o (c) fijar el `<base>` a la URL real de producción del frontend nuevo (funciona solo si esa URL es estable y conocida de antemano). **Pendiente de decisión antes de autorizar el corte.**

## 10. Prueba visual (Playwright, Chromium real)

Páginas verificadas con captura de errores de consola y requests fallidos: `inicio.html`, `servicios_publico.html`, `proyectos_publico.html`, `cursos_publico.html`, `investigacion.html`, `nosotros.html`, `admin.html`, `servicios_admin.html`, `reportes_admin.html` → **0 errores de consola, 0 requests fallidos**, datos reales confirmados renderizados (capturas de pantalla revisadas visualmente, no solo el HTML). Flujo de login probado end-to-end (ver §7).

`docentes.html` y `detalle.html` (no probado explícitamente pero comparte el mismo `<base>`) → **rotos en el puerto de prueba** por el hallazgo del §9.

## 11. Reportes

Las 4 variantes de `/api/reportes` fueron probadas contra datos reales y comparadas línea por línea contra las consultas SQL de `reportes.php` (las copié literalmente, mismo agrupamiento, mismos JOIN, mismos filtros `estado='published'`). `overview` devolvió conteos consistentes con los totales reales por colección (servicios 7/7/0, cursos 21 total/3 publicados/18 borradores, etc.).

## 12. Seguridad

**Verificado / sin problemas:**
- **SQL Injection**: todas las queries usan parámetros (`?`) vía `mysql2`. Los únicos lugares con interpolación de string en el SQL son nombres de tabla (`` `${table}` ``), y esos valores **siempre** vienen de constantes hardcodeadas en el propio código de rutas (nunca de `req.query`/`req.body`) — no explotable.
- **Contraseñas**: ya no se guardan en texto plano tras el primer login (bcrypt, costo 10). Antes del primer login siguen en texto plano igual que en PHP (limitación inherente a no forzar un re-hash masivo sin que el usuario inicie sesión).
- **Exposición de errores**: el error handler de Express devuelve un mensaje genérico al cliente y solo loguea el detalle en el servidor — no hay stack traces expuestos.
- **Archivos sensibles**: `backend/.env` no es servido por ninguna ruta (el backend no sirve estáticos); `backend/middleware/.login_attempts_*.json` tampoco (mismo motivo) — **mejora sobre PHP**, donde esos archivos viven en la raíz del proyecto y dependen de que `.htaccess` los bloquee explícitamente.
- **Validación de uploads**: por firma de bytes, no solo extensión (igual que PHP).

**Pendientes / a decidir antes de producción:**
- **CORS abierto (`*`)**: correcto para esta fase de desarrollo, **no debe usarse en producción**. Recomendación: `CORS_ORIGIN` en `.env` con la lista explícita de dominios del frontend web (Flutter no necesita CORS — las apps nativas no envían `Origin` ni lo respetan, así que restringir CORS no afecta a la futura app móvil).
- **Sin protección server-side de rutas administrativas**: cualquiera que conozca la URL puede leer/escribir en `/api/servicios` etc. sin estar autenticado. Esto **ya era así en PHP** (no hay verificación de sesión/token en ningún endpoint PHP tampoco), así que Node no introduce una regresión, pero tampoco la corrige. Si se quiere resolver, requeriría diseñar un mecanismo de autenticación por token (fuera del alcance de "no introducir JWT/sesiones si no se necesitan" — a decidir con el usuario antes de escalar esto).
- **`.env` no versionado**: confirmado (`.gitignore` incluye `.env`); el proyecto no tiene aún repositorio git inicializado, así que no hay riesgo de commit accidental todavía, pero la protección ya está en su lugar preventivamente.
- **`frontend/serve.js`** (servidor de prueba) no tiene una lista de bloqueo de rutas sensibles equivalente a las reglas de `.htaccess` (`\.env$`, `\.git`, `\.json$`, `\.sql$`). No es un problema hoy porque no hay archivos sensibles dentro de `frontend/`, pero **no debe usarse tal cual en producción** — es solo una herramienta de previsualización local (ver §13).

## 13. Configuración de producción

**Servidor / hosting:**
- `backend/` requiere un proceso Node.js persistente (no CGI/FastCGI como PHP) — necesita un gestor de procesos (PM2, systemd, o el mecanismo del hosting) para mantenerlo vivo y reiniciarlo ante caídas.
- Investigué los dos hostings que mencionaste antes en esta conversación (`hosting-ssd.com`, `latinoamericahosting.com.pe`): ambos son hosting compartido tipo cPanel/LiteSpeed orientado a PHP+MySQL; ninguno mostró en sus páginas públicas soporte confirmado para procesos Node.js persistentes (lo típico en hosting compartido es que no lo permitan, o solo vía un panel especial tipo "Setup Node.js App" en cPanel — hay que confirmarlo directamente con soporte antes de asumir que sirve). **Si no lo soportan, se necesita un VPS o Cloud** (con acceso SSH, Node.js instalable, puerto propio o proxy reverso).
- `frontend/` (HTML/CSS/JS estático) sí es compatible con cualquier hosting compartido normal — no tiene este problema.
- MySQL: sin cambios, ambos hostings lo listan como incluido.

**Variables de entorno necesarias** (`backend/.env`, no versionado, ya existe `backend/.env.example` como plantilla):
```
PORT=4000
DB_HOST=...
DB_PORT=3306
DB_NAME=group_tqc
DB_USER=...
DB_PASSWORD=...
CORS_ORIGIN=https://tu-dominio-real.com
```

**Pendiente antes de producción:**
- Definir `API_BASE` real en `frontend/js/api-base.js` (hoy apunta a `localhost:4000` por defecto) — debe ser la URL pública del backend desplegado.
- Resolver el hallazgo del `<base href>` (§9) antes de publicar `docentes.html`/`detalle.html`.
- Reemplazar `frontend/serve.js` (servidor de prueba mínimo) por el servidor real de producción (Apache/Nginx apuntando a `frontend/`, o el propio hosting estático) — no está pensado para producción.
- Configurar HTTPS (certbot/Let's Encrypt o el que ofrezca el hosting) — no evaluado en esta fase porque todo corrió en `localhost`.
- Decidir si `assets/uploads/` seguirá siendo una carpeta compartida por filesystem entre backend y hosting estático (requiere que ambos vivan en el mismo servidor/volumen) o si se migra a un enfoque backend-sirve-sus-propios-assets (más apto si el frontend termina en un CDN separado). Documentado como dependencia arquitectónica; no resuelto aún.

## 14. Arquitectura — hallazgo de capas

Las 5 colecciones "artículo" (`servicios`, `proyectos`, `investigacion`, `cursos`, `docentes`) tienen separación completa `routes → controllers → models`. Las **8 entidades "custom"** (`acreditaciones`, `clientes`, `estadisticas`, `contenido`, `nosotros_bloques/valores/staff/trayectoria`) tienen las queries SQL **directamente en `routes/*.routes.js`**, sin pasar por `controllers/` ni `models/` — decisión pragmática tomada durante la implementación (cada una tiene forma/validaciones muy distintas, poco beneficio de una capa genérica), pero es una desviación real del patrón estricto de capas que pediste. Funciona correctamente (probado exhaustivamente en §6), pero es una deuda de diseño. **No lo refactoricé sin confirmarlo primero, ya que esta fase es solo de validación.** Si quieres que lo normalice antes del corte, lo hago en una pasada aparte.

No se encontró: lógica de negocio en `server.js` (solo monta rutas y maneja errores/CORS), acceso a BD desde el frontend, credenciales en el frontend, ni dependencias circulares.

## 15. Preparación para Flutter

- JSON en todas las respuestas, sin HTML embebido — confirmado en las 19 rutas.
- Códigos HTTP correctos y consistentes con PHP (200/201/400/401/404/405/429/500).
- **Inconsistencia heredada de PHP (no corregida, para mantener compatibilidad con el frontend web actual)**: las colecciones devuelven un array plano en el `GET` (`[...]`), mientras que mutaciones devuelven `{ok, <itemName>: item}` y reportes devuelven `{ok, data}` — un cliente Flutter tendrá que manejar 3 formas de respuesta distintas según el endpoint. Si se planea consumir esto desde Flutter, vale la pena estandarizar antes de escribir el cliente Dart (fuera del alcance de esta fase de validación).
- CORS abierto no afecta a Flutter (las apps nativas no están sujetas a same-origin policy).

## 16. Riesgos

| Riesgo | Impacto | Mitigación propuesta |
|---|---|---|
| `<base href>` roto en `docentes.html`/`detalle.html` fuera del hosting original | Alto — esas 2 páginas se ven sin estilos/imágenes en cualquier hosting nuevo | Resolver antes del corte (§9), 3 opciones planteadas |
| CORS `*` en producción | Medio — cualquier sitio podría leer/escribir la API desde el navegador de un usuario | Restringir `CORS_ORIGIN` a dominios conocidos antes de publicar |
| Sin protección de rutas admin (heredado de PHP) | Medio — ya existe hoy, no es nuevo, pero tampoco se resolvió | Diseñar autenticación por token si se decide cerrar esta brecha |
| Hosting compartido sin soporte confirmado para Node persistente | Alto — el backend simplemente no arrancaría | Confirmar con soporte del hosting o migrar a VPS/Cloud antes de intentar el despliegue |
| `assets/` compartido por filesystem entre frontend y backend | Medio — ambos deben vivir en el mismo servidor mientras no se resuelva de otra forma | Documentado; decidir arquitectura de assets para producción (§13) |
| 8 entidades sin capa `controller`/`model` | Bajo — funciona correctamente, es deuda de diseño | Refactor opcional, no bloqueante |

## 17. Rollback

```
NODE FALLA
    ↓
El sistema PHP (api/*.php + HTML/CSS/JS de la raíz) NUNCA fue tocado ni desactivado —
sigue sirviendo exactamente igual que antes de esta fase, sin ningún cambio de configuración necesario para "restaurarlo".
    ↓
Si en algún punto futuro se apunta el dominio/hosting real a frontend/ y algo falla:
1. Revertir el DNS/vhost/document-root al punto original (raíz del proyecto, no frontend/).
2. Confirmar que Apache/XAMPP sigue sirviendo api/*.php normalmente (no requiere reinicio si nunca se detuvo).
3. Verificar login y una página pública para confirmar servicio restaurado.
```

No hay "restauración de configuración" que hacer porque **nada del sistema PHP fue modificado, movido ni desactivado** durante esta fase.

---

## ESTADO GENERAL

## NO LISTO PARA CORTE

### FUNCIONANDO
- Backend Node (19/19 endpoints funcionales, probados contra datos reales)
- CRUD completo en todas las entidades
- Autenticación con migración lazy a bcrypt
- Uploads (validación, reemplazo, límites)
- Reportes (4 variantes, agregaciones equivalentes a PHP)
- 9 de 22 páginas del frontend verificadas visualmente sin errores

### PARCIALMENTE FUNCIONANDO
- Arquitectura de capas (8 de 13 entidades sin `controller`/`model` separado — funcional pero no estrictamente en capas)

### FALTANTE / BLOQUEANTE
- **`docentes.html` y `detalle.html` rotos fuera del hosting original** por el `<base href="/Pagina%20web/">` hardcodeado (§9) — esto es lo único que impide decir "listo para corte" con confianza total, porque son 2 páginas reales del sitio público que hoy fallarían en cualquier hosting nuevo.
- Confirmación de soporte Node.js del hosting de destino (no verificable desde aquí, requiere contactar soporte).
- `API_BASE`/`CORS_ORIGIN` de producción sin definir todavía (son variables, no bugs — solo faltan los valores reales).

### SEGURIDAD
- Problemas encontrados: CORS abierto (dev-only, ya identificado), ausencia de protección de rutas admin (heredado de PHP, no regresión).
- Problemas solucionados: contraseñas en texto plano (migración lazy a bcrypt), exposición de lockfiles de rate-limit (ya no son accesibles vía HTTP).
- Pendientes: definir `CORS_ORIGIN` de producción; decidir si se añade autenticación por token a las rutas admin.

### PRODUCCIÓN
- Requiere Node.js persistente + gestor de procesos — confirmar si el hosting actual lo soporta o si hace falta VPS/Cloud.
- Definir `.env` real, `API_BASE` real, resolver `<base href>`, decidir arquitectura final de `assets/`.

### SIGUIENTE PASO — qué debes autorizar

Antes de decir "APROBAR CORTE A PRODUCCIÓN", necesito que definas:

1. **Cómo resolver el `<base href="/Pagina%20web/">`** en `docentes.html`/`detalle.html` (§9) — es el único bloqueante técnico real encontrado.
2. **Dónde se desplegará** realmente (¿confirmaste ya con `hosting-ssd.com` o `latinoamericahosting.com.pe` si soportan Node persistente, o migramos a VPS?) — determina si `backend/` puede vivir donde piensas alojarlo.
3. **Si quieres que normalice la capa `controller`/`model`** de las 8 entidades restantes antes del corte, o lo dejamos como deuda documentada.
4. **Política de CORS y de protección de rutas admin** para producción.

Con esas 4 respuestas puedo dejar el sistema listo para que digas *"APROBAR CORTE A PRODUCCIÓN"* con confianza.
