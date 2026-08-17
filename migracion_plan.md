Actúa como Arquitecto de Software Senior y continúa desde el estado actual del proyecto.

La decisión arquitectónica está APROBADA:

FRONTEND INDEPENDIENTE
        ↓
API REST Node.js + Express
        ↓
MySQL (group_tqc)

A mediano plazo, esta misma API será consumida también por una aplicación móvil desarrollada en Flutter.

Actualmente ya existen dos sistemas funcionando en paralelo:

SISTEMA ACTUAL:
Apache/XAMPP
├── HTML/CSS/JS
├── api/*.php
├── JSON antiguos
└── MySQL group_tqc

SISTEMA NUEVO:
frontend/
backend/
database/
    ↓
Node.js + Express
    ↓
MySQL group_tqc

El nuevo backend ya está funcionando en el puerto 4000 y el frontend de prueba en el puerto 8080.

IMPORTANTE:
NO hagas todavía el corte definitivo.
NO elimines.
NO muevas a trash.
NO modifiques archivos del sistema PHP actual.

El sistema PHP debe permanecer intacto como mecanismo de rollback.

==================================================
FASE 8 — VALIDACIÓN COMPLETA ANTES DEL CORTE
==================================================

Ahora quiero que realices una auditoría técnica completa del nuevo sistema.

OBJETIVO:

Determinar si el backend Node.js puede reemplazar de forma segura al backend PHP actual sin perder funcionalidades.

--------------------------------------------
1. COMPARACIÓN PHP VS NODE
--------------------------------------------

Analiza los 24 archivos actuales de:

api/*.php

y compáralos con los endpoints implementados en:

backend/

Genera una matriz:

| PHP actual | Endpoint Node | Método | Función | Estado |
|------------|---------------|--------|---------|--------|

Estados permitidos:

COMPLETO
PARCIAL
FALTANTE
NO NECESARIO

No asumas que dos endpoints son equivalentes solamente porque tienen nombres similares.

Compara realmente:

- parámetros
- validaciones
- consultas SQL
- respuestas
- códigos HTTP
- archivos utilizados
- efectos secundarios
- uploads
- autenticación
- relaciones
- filtros
- paginación si existe
- restricciones
- límites
- comportamiento ante errores

--------------------------------------------
2. VALIDAR LAS ENTIDADES
--------------------------------------------

Prueba contra la BD REAL:

group_tqc

las entidades existentes, incluyendo como mínimo:

- servicios
- proyectos
- investigación
- cursos
- docentes
- acreditaciones
- clientes
- nosotros_valores
- nosotros_staff
- estadísticas
- nosotros_trayectoria
- nosotros_bloques
- contenido
- usuarios

No inventes entidades.

Utiliza únicamente las tablas que realmente existan en la BD.

--------------------------------------------
3. CRUD
--------------------------------------------

Para cada entidad que tenga CRUD:

GET
POST
PUT
DELETE

verifica:

- request válido
- request inválido
- registro inexistente
- campos obligatorios
- IDs inexistentes
- tipos de datos incorrectos
- errores SQL
- respuesta HTTP
- estructura JSON

IMPORTANTE:

Para las pruebas destructivas utiliza datos de prueba.

NO elimines ni modifiques registros reales importantes de producción.

Si necesitas crear registros temporales:

1. créalos
2. prueba
3. elimínalos
4. verifica que no haya quedado basura

--------------------------------------------
4. AUTENTICACIÓN
--------------------------------------------

Audita:

/api/login
/api/cambiar_contrasena

Verifica:

- usuario inexistente
- contraseña incorrecta
- contraseña correcta
- contraseña almacenada con bcrypt
- usuario administrador
- cambio de contraseña
- protección de rutas administrativas

NO utilices la cuenta real admin para pruebas destructivas.

NO cambies la contraseña real de admin durante esta fase.

Si es necesario crear un usuario de prueba, documenta:

- usuario creado
- pruebas realizadas
- eliminación posterior

--------------------------------------------
5. UPLOADS
--------------------------------------------

Prueba:

/api/upload

Verifica:

- archivo válido
- extensión permitida
- tamaño permitido
- archivo inválido
- nombre de archivo
- reemplazo de imagen
- parámetro "anterior"
- ubicación final del archivo
- compatibilidad con /assets

IMPORTANTE:

No dupliques los 243 MB existentes de assets.

Mantén la carpeta assets compartida si técnicamente es correcto.

Documenta esta dependencia arquitectónica.

--------------------------------------------
6. FRONTEND
--------------------------------------------

Analiza todos los HTML y JavaScript nuevos dentro de frontend/.

Busca TODOS los:

fetch()
XMLHttpRequest
imports
scripts
rutas
referencias a JSON
referencias al backend PHP

Confirma que el frontend nuevo:

NO dependa de:

servicios.json
proyectos.json
investigacion.json
cursos.json
usuarios.json

y que las peticiones dinámicas utilicen la API Node.

Busca también:

localhost:4000
localhost:8080
/api/
api/*.php

y determina cuáles son correctos para desarrollo y cuáles deben cambiarse para producción.

--------------------------------------------
7. PRUEBA VISUAL
--------------------------------------------

Utiliza Chromium/Playwright para comprobar como mínimo:

- inicio.html
- servicios_publico.html
- proyectos_publico.html
- cursos_publico.html
- docentes.html
- nosotros.html
- investigacion.html
- detalle.html
- panel administrativo

Comprueba:

- errores de consola
- errores de red
- respuestas HTTP
- imágenes
- CSS
- JavaScript
- datos reales
- navegación
- formularios

No basta con comprobar que la página carga.

Comprueba que las funcionalidades realmente funcionan.

--------------------------------------------
8. REPORTES
--------------------------------------------

Prueba:

/api/reportes?tipo=overview
/api/reportes?tipo=drafts
/api/reportes?tipo=cursos-sin-docente
/api/reportes?tipo=docentes-sin-cursos

Compara los resultados con las consultas que utiliza el sistema PHP actual.

Verifica que las agregaciones sean equivalentes.

--------------------------------------------
9. SEGURIDAD
--------------------------------------------

Audita:

- SQL Injection
- consultas preparadas
- contraseñas
- bcrypt
- CORS
- subida de archivos
- validación de entradas
- exposición de errores
- archivos sensibles
- .env
- credenciales
- rutas administrativas

CORS:

Actualmente puede estar abierto "*" para desarrollo.

NO lo consideres configuración final de producción.

Propón una configuración segura para producción.

--------------------------------------------
10. VARIABLES DE ENTORNO
--------------------------------------------

Verifica que:

.env

NO esté versionado.

Debe existir:

backend/.env.example

con variables como:

PORT=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

No escribas credenciales reales dentro del código.

--------------------------------------------
11. ARQUITECTURA
--------------------------------------------

Revisa que exista una separación clara:

frontend
    ↓
HTTP
    ↓
routes
    ↓
controllers
    ↓
models
    ↓
MySQL

Evita:

- SQL dentro de routes
- lógica de negocio excesiva dentro de server.js
- acceso directo a BD desde frontend
- credenciales en frontend
- código duplicado
- dependencias circulares

Si detectas problemas arquitectónicos, corrígelos SOLO dentro del nuevo sistema.

NO modifiques PHP.

--------------------------------------------
12. PREPARACIÓN PARA FLUTTER
--------------------------------------------

La API deberá quedar preparada para que posteriormente Flutter pueda consumirla.

Verifica:

- JSON consistente
- códigos HTTP correctos
- respuestas predecibles
- errores estructurados
- endpoints independientes del frontend
- ausencia de HTML dentro de las respuestas API
- URLs claras
- métodos HTTP correctos

No desarrolles Flutter todavía.

Solo prepara correctamente la API.

--------------------------------------------
13. PRODUCCIÓN
--------------------------------------------

Analiza el entorno de producción actual.

Verifica específicamente si el hosting/servidor donde se desplegará soporta:

- Node.js
- Express
- procesos persistentes
- npm
- configuración de variables de entorno
- puertos/proxy reverso
- HTTPS
- MySQL

Si el entorno actual NO soporta Node.js/Express correctamente:

NO fuerces el despliegue.

Explícame exactamente qué infraestructura sería necesaria.

--------------------------------------------
14. PLAN DE MIGRACIÓN
--------------------------------------------

Genera un plan de corte progresivo:

FASE A
PHP funcionando
Node en pruebas

FASE B
Node validado
PHP como rollback

FASE C
Node pasa a producción

FASE D
Monitoreo

FASE E
PHP archivado

FASE F
Eliminación definitiva después de un periodo de estabilidad

Incluye un procedimiento de rollback:

NODE FALLA
    ↓
volver a PHP
    ↓
restaurar configuración
    ↓
verificar servicio

--------------------------------------------
15. ARCHIVOS QUE NO DEBES TOCAR
--------------------------------------------

Hasta nueva autorización explícita, NO modificar:

api/*.php
.htaccess
servicios.json
proyectos.json
investigacion.json
cursos.json
usuarios.json
*.txt

Tampoco elimines nada.

--------------------------------------------
16. DOCUMENTACIÓN
--------------------------------------------

Crea:

MIGRATION_CHECKLIST.md

Debe contener:

1. Arquitectura actual
2. Arquitectura nueva
3. Diagrama de flujo
4. Tabla PHP vs Node
5. Endpoints completos
6. Endpoints parciales
7. Endpoints faltantes
8. Pruebas realizadas
9. Resultados
10. Problemas encontrados
11. Riesgos
12. Seguridad
13. Configuración de producción
14. Plan de corte
15. Plan de rollback
16. Preparación para Flutter

--------------------------------------------
17. INFORME FINAL
--------------------------------------------

Al finalizar NO realices el corte.

NO muevas archivos.

NO elimines archivos.

NO modifiques el backend PHP.

Entrégame un informe final con:

### ESTADO GENERAL
LISTO PARA CORTE
o
NO LISTO PARA CORTE

### FUNCIONALIDADES
- funcionando
- parcialmente funcionando
- faltantes

### ENDPOINTS
- completos
- parciales
- faltantes

### SEGURIDAD
- problemas encontrados
- problemas solucionados
- pendientes

### PRODUCCIÓN
- requisitos del servidor
- configuración necesaria

### RIESGOS
- riesgo
- impacto
- solución

### ROLLBACK
Procedimiento exacto.

### SIGUIENTE PASO
Indica exactamente qué tendría que autorizar antes de realizar el corte.

REGLA PRINCIPAL:

Hasta que yo diga explícitamente:

"APROBAR CORTE A PRODUCCIÓN"

NO debes mover, eliminar ni modificar archivos del sistema PHP actual.