# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Instrucciones de Clonación de Frontend (Modo Silencioso)

## 1. Reglas de Interacción (Ahorro de Tokens)
- Actúa exclusivamente como un Ingeniero de Frontend Senior Automatizado.
- PROHIBIDO generar introducciones, saludos, comentarios informativos o explicaciones textuales de lo que hace el código.
- Ve directo al grano: ejecuta las herramientas de sistema y escribe los archivos de forma silenciosa.

## 2. Reglas del Diseño Visual (Pixel-Perfect)
- El objetivo es replicar el diseño exacto de la URL objetivo (colores, espaciados, tipografías y disposición).
- Si la web original usa fuentes personalizadas (como Google Fonts), impórtalas correctamente en el `<head>`.
- Diseña de forma totalmente responsiva (móvil, tablet y escritorio).

## 3. Manejo de Recursos Externos
- Si los enlaces directos de las imágenes originales no son accesibles o están protegidos, reemplázalos por contenedores vectoriales o imágenes de marcador de posición (`https://unsplash.com...` o `https://placehold.co...`) con las dimensiones correctas de la sección.

## 4. Almacenamiento Local de Imágenes
- Guarda en `assets/` las imágenes, logos e iconos esenciales de la web original.
- Enlaza siempre con ruta local relativa (ejemplo: `src="assets/logo.png"`), nunca absoluta (ver "Rutas relativas" en Architecture — el sitio no vive en la raíz del dominio).
- Si una imagen está protegida y es imposible descargarla, aplica el marcador de posición responsivo (`bg-gray-200` o `placehold.co`).

## 5. Estructura de Directorios
```
assets/               # Recursos estáticos reales (logos, fotos de clientes, etc.)
css/main.css           # Única hoja de estilos del sitio completo (público + admin)
js/                    # Lógica de cliente, un archivo por responsabilidad (ver Architecture)
api/                   # Backend PHP + MySQL (ver "Qué backend está vivo")
*.html                 # Una página por sección, en la raíz (sin subcarpetas)
```

## 6. Reglas de Separación de Código (Clean Code)
- PROHIBIDO incluir bloques extensos de `<style>` o `<script>` dentro de los archivos HTML.
- Toda la interactividad debe estar en su archivo correspondiente dentro de `js/`.
- Todas las reglas CSS van en `css/main.css` — no crear hojas de estilo por página.

## 7. Interactividad Básica y Enlaces
- `js/auth.js` maneja el login: el envío del formulario redirige a `admin.html`; "Cerrar sesión" redirige a `index.html`.

## 8. Rendimiento y Tokens
- Trabaja de forma estrictamente silenciosa sin dar introducciones ni explicaciones de texto. Modifica o crea los archivos directamente.
- No proceses imágenes reales con el visor de Claude (consume tokens de visión). Si el usuario tiene fotos propias para el catálogo, pídele que las coloque en `assets/` con nombres predecibles (o una lista archivo→sección) y actualiza los registros vía la API — nunca las "veas" una por una salvo que haga falta verificar contenido antes de una acción irreversible.

## 9. Manejo de Secciones del Panel (Multi-página)
- Cada sección del menú lateral (Servicios, Cursos, Proyectos, Investigación) tiene su propio archivo `.html` independiente en la raíz.
- Todos los archivos de las secciones enlazan `css/main.css` y `js/dashboard.js`.
- Los enlaces del sidebar deben estar sincronizados en TODOS los archivos admin al agregar/renombrar una sección.
- Bootstrap 4 vía CDN en el sitio público (compatibilidad con OWL Carousel/Popper); el panel admin también usa Bootstrap 4 pero con un tema oscuro propio (ver Architecture).

## Commands

- Install deps: `npm install`
- Run the Node server: `node server.js` (defaults to port 3000; override with `$env:PORT="3001"; node server.js` in PowerShell).
- No build step — plain HTML/CSS/JS served statically, no bundler/transpiler.
- No lint or test scripts are configured (`npm test` is a stub that always fails).
- Sanity-check a JS file after editing: `node --check js/dashboard.js` (etc.) — do this after every JS edit, it catches syntax errors for free.
- Sanity-check `css/main.css` after editing (brace balance, since it's one large file): `node -e "const s=require('fs').readFileSync('css/main.css','utf8');let d=0;for(const c of s){if(c==='{')d++;if(c==='}')d--;}console.log(d)"` — must print `0`.
- Migrate/repair the MySQL catalog from the JSON fallback files: `GET api/migrar_json_a_mysql.php` (see the migration footgun below before relying on it).

## Architecture

### Qué backend está vivo (importante, no asumir)

Este repo tiene **dos backends independientes y desincronizados**. Todo el trabajo reciente de frontend (ver git history / esta sesión) se probó contra el backend PHP vía XAMPP/Apache, **no** contra `server.js`.

- **PHP + MySQL (`api/*.php`, activo)** — servido por Apache/XAMPP con el proyecto en `c:\xampp\htdocs\Pagina web`, accesible como `http://localhost/Pagina%20web/...`. `api/conexion.php` conecta a MySQL (`root`, sin password, BD `group_tqc`). `api/crud_factory.php` implementa `handleCollection($pdo, $table, $itemName, $defaultImagen, $buildItem)` — el equivalente PHP del factory de `server.js`, mismo esquema de item, mismo `slugify()` basado en `ACCENT_MAP`. `api/login.php` valida contra la tabla `usuarios` (no `usuarios.json`).
- **Node/Express (`server.js`, no verificado recientemente)** — implementa la misma API contra los archivos `*.json` en la raíz (`servicios.json`, `proyectos.json`, etc.) y `usuarios.json` en texto plano. Sigue siendo el único backend documentado originalmente; no se ha actualizado para reflejar `detalle.html`, las rutas limpias de `.htaccess`, ni el catálogo migrado a MySQL. Si te piden trabajar "con el servidor Node", confirma primero si eso sigue siendo lo que se quiere o si el trabajo debe seguir apuntando a PHP/Apache — no lo des por hecho.

`.htaccess` (solo aplica al modo Apache) hace todo el trabajo de seguridad y de URLs limpias:
```
RedirectMatch 403 \.env$ | ^/\.git(/|$) | \.json$ | \.sql$
RewriteRule ^login$ / ^api/<coleccion>$        → api/<coleccion>.php   [L,QSA]
RewriteRule ^<coleccion>/[a-z0-9-]+/?$          → detalle.html          [L]
```
No lo reordenes ni le quites los bloqueos. Nota: bloquea *todo* `*.json`, más amplio que el `BLOCKED_PATHS` de `server.js` (que solo bloquea `usuarios.json`).

### Rutas relativas (la razón de casi todos los bugs de "no carga nada")

El sitio no vive en la raíz del dominio, vive en `/Pagina web/` (con espacio). **Nunca uses rutas con `/` inicial** (`href="/login"`, `src="/assets/x.png"`) — se resuelven contra la raíz de `localhost`, no contra la carpeta del proyecto, y todo 404 silenciosamente. Usa siempre rutas relativas sin `/` inicial (`href="login"`, `src="assets/x.png"`).

Excepción: `detalle.html` (ver abajo) se sirve bajo profundidades de URL variables (`/detalle.html` o `/servicios/<slug>`), así que en ese archivo específico las rutas relativas normales no bastan — usa `<base href="/Pagina%20web/">` en el `<head>` para anclarlas todas a la raíz real del proyecto sin importar la URL visible.

### Páginas de detalle dinámicas (`detalle.html` + `js/detalle.js`)

Plantilla única y genérica para el detalle de cualquier servicio/proyecto/artículo/curso, reutilizada vía `.htaccess`. Punto no obvio: cuando Apache reescribe `/servicios/<slug>` → `detalle.html` internamente, **el navegador nunca ve el query string** — `window.location.search` está vacío aunque la reescritura interna use `[QSA]`. Por eso `js/detalle.js` obtiene `tipo`/`slug` parseando `window.location.pathname` con una regex (`/(servicios|proyectos|investigacion|cursos)\/([a-z0-9-]+)\/?$/`), con fallback a `?tipo=&slug=` solo para acceso directo a `detalle.html`. Si necesitas depurar por qué el detalle "no encuentra el contenido", primero confirma que el slug de la URL existe realmente en `GET api/<coleccion>` — casi siempre es un dato faltante, no un bug de ruteo (ver footgun de migración abajo).

### Footgun de migración de datos

`api/migrar_json_a_mysql.php` hace upsert a MySQL usando `ON DUPLICATE KEY UPDATE` con `id` como clave. Los JSON de origen (sobre todo `servicios.json`) tienen registros con el **mismo `id` duplicado** en varias filas (bug preexistente en los datos, no en el script) — cada re-ejecución sobreescribe silenciosamente los anteriores con el mismo id, sin error. Si un dato "desaparece" después de correr la migración, sospecha de esto antes que de un bug de código: compara el conteo de `GET api/servicios` contra el número de entradas de `servicios.json`, y si faltan, insértalas individualmente vía `POST api/servicios` (que genera un `id` único por `microtime()`) en vez de volver a correr la migración completa.

### Caché de navegador (patrón recurrente de "no se ve el cambio")

Casi todos los "esto no se actualizó" en esta app resultan ser caché del navegador, no un bug real. `css/main.css` y los `.js` compartidos se referencian con `?v=N` en cada HTML (ej. `css/main.css?v=9`). **Cada vez que edites `css/main.css` o un `.js` referenciado desde varias páginas, sube el número de versión en TODOS los HTML que lo enlazan** (búscalos con Grep antes de asumir que ya están sincronizados — no todos comparten el mismo número necesariamente). Sin esto, es fácil pasar varias vueltas de ida y vuelta con el usuario pensando que el fix no funcionó cuando en realidad el navegador sirvió la versión cacheada.

### Frontend público

Páginas estáticas en la raíz (`inicio.html`, `servicios_publico.html`, `nosotros.html`, `contacto.html`, `investigacion.html`, `cursos_publico.html`) con Bootstrap 4 + Font Awesome vía CDN, clase `body.site-public`, paleta `--gtqc-*` (azul `#45629C`, naranja `#EF9E4D`) definida en `css/main.css`. Secciones respaldadas por colecciones (servicios, proyectos) se rellenan client-side: contenedor vacío (ej. `#contenedor-servicios-mosaico`) poblado por `js/public-data.js` vía `fetch('api/servicios')` / `fetch('api/proyectos')`.

`proyectos_publico.html` **no existe todavía**; varios nav/footer apuntan ahí de todos modos. Igual, algunos slugs hardcodeados en los submenús de navegación no coinciden 1:1 con los slugs reales generados por `slugify()` en la BD (ej. geofísica) — si un link del menú da 404 pero el mismo servicio funciona desde el catálogo, sospecha de esto primero.

### Panel admin

Un HTML por sección (`admin.html`, `servicios_admin.html`, `proyectos_admin.html`, `investigacion_admin.html`, `cursos_admin.html`, `editor_admin.html`, `reportes_admin.html`, `perfil_admin.html`, más `index.html` como login), todos con `<body class="admin-theme">`. El tema admin es **oscuro** (fondo casi negro, acentos cian `#22D3EE`, tipografía Inter) — completamente distinto de la paleta del sitio público; las reglas viven scopeadas bajo `body.admin-theme` en `css/main.css` para no filtrarse al sitio público, y viceversa (nunca quites ese scoping).

`js/dashboard.js` drives toda la interactividad admin:
- Cada `<tbody>` es `<tbody data-list-body="" data-api="api/<name>" data-view-base="/<name>"></tbody>`, poblado por `renderAdminRow()` tras `fetch(data-api)`.
- `initAdminFilters()` corre *después* de que resuelve el fetch — si agregas una tabla filtrable nueva, respeta ese orden fetch-then-init o el filtrado no hace nada en el primer load.
- `wireCreateModal(config)` es el factory genérico reusado por los cuatro modales "+ Nuevo" (y también maneja edición vía `data-editing-id`, cambiando `POST` por `PUT`). Los botones de fila (editar/eliminar) están delegados sobre `[data-list-body]`, no bindeados por fila.
- Reusa las clases `.pb-modal` / `.pb-form-field` / `.pb-btn` / `.admin-filters` / `.admin-chips` ya existentes — no hay razón para agregar CSS nuevo para CRUD estándar.

### Esquema de datos

Cada item de cualquier colección comparte `{ id, titulo, slug, resumen, imagen, estado: 'published'|'draft', fecha, timestamp }`. `proyectos` es un caso especial: tiene un `fecha` público (texto tipo `"Ejecutado en 2024"`) *y* un `fecha_admin` separado (dd/mm/yyyy, para la tabla admin) — son campos deliberadamente distintos, no los colapses.

## Known gaps

- `proyectos_publico.html` no existe.
- `usuarios.json` (modo Node) y la tabla `usuarios` en MySQL (modo PHP) guardan credenciales sin hash — aceptable solo porque es una herramienta interna/local, no algo para replicar en otro lado.
- `server.js` está desactualizado respecto al backend PHP (ver arriba); no asumas que reflejan el mismo estado de datos ni las mismas rutas.
