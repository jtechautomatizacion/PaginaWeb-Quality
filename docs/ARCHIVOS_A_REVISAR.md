# 📋 Auditoría de Archivos: Qué Eliminar y Por Qué

**Objetivo**: Limpiar el proyecto para producción sin romper nada.

**Regla principal**: El sistema PHP antiguo se mantiene como rollback. El backend Node.js es el nuevo.

---

## 🗑️ CATEGORÍA 1: SCRIPTS DE MIGRACIÓN (Eliminar sin dudarlo)

### Archivos a eliminar:

```
api/migrar_json_a_mysql.php
api/migrar_docentes_normalizado.php
api/migrate-servicios.php
api/migrate_docentes.php
api/migrate_password_change.php
```

### ¿Por qué?

**Estos archivos se ejecutaron UNA SOLA VEZ para transferir datos de JSON a MySQL.**

- `migrar_json_a_mysql.php`: Pasó JSON → MySQL (agosto 2026, ya hecho)
- `migrate_docentes.php`: Normalizó docentes en MySQL (ya hecho)
- `migrate_password_change.php`: Convirtió passwords plaintext → bcrypt (ya hecho)

**Si los dejas:**
- ❌ Ocupan espacio
- ❌ Confunden (¿hay que ejecutarlos de nuevo?)
- ❌ Potencial riesgo de seguridad (exponen rutas de BD)

**Si los eliminas:**
- ✅ Código más limpio
- ✅ No hay riesgo de re-ejecutarlos accidentalmente
- ✅ El registro de qué se migró está en git history

**Status**: SEGURO ELIMINAR (solo en producción, no en desarrollo)

---

## 🗑️ CATEGORÍA 2: JSON ANTIGUOS (Eliminar)

### Archivos a eliminar:

```
servicios.json
proyectos.json
investigacion.json
cursos.json
usuarios.json
```

### ¿Por qué?

**Estos archivos eran la "base de datos" del sistema PHP antiguo.**

- El frontend nuevo NO los consulta (consume `http://localhost:4000/api/...`)
- El backend Node.js usa MySQL (no JSON)
- Están desincronizados con la BD real

**Si los dejas:**
- ❌ 18KB de datos obsoletos
- ❌ Riesgo: alguien los edita pensando que son la "BD"
- ❌ Confusión: ¿cuál es la fuente de verdad, JSON o MySQL?

**Si los eliminas:**
- ✅ Fuente de verdad única: MySQL
- ✅ API única: Node.js en puerto 4000
- ✅ Más fácil de mantener

**Precaución**: `.htaccess` bloquea `*.json` de todas formas. Pero mejor eliminarlos.

**Status**: SEGURO ELIMINAR

---

## 🗑️ CATEGORÍA 3: ARCHIVOS .txt DE CONTENIDO (Analizar)

### Archivos a revisar:

```
botoncotiza.txt (76KB)
detalleservicio.txt (127KB)
```

### ¿Qué contienen?

Abrí `botoncotiza.txt` → HTML hardcodeado para un botón de CTA.

Abrí `detalleservicio.txt` → HTML hardcodeado para una página de detalle.

### ¿Por qué existen?

Probablemente fueron drafts o experimentos durante desarrollo.

### ¿Debo eliminarlos?

**Sí, pero primero:**
1. Verifica si el contenido está ya en la BD (investigar servicios/projects)
2. Si el contenido es único, guarda una copia en `BACKUP_CONTENIDO.md`
3. Luego elimina

**Si los dejas:**
- ❌ 200KB de basura
- ❌ Confusión: ¿es contenido activo o viejo?

**Si los eliminas:**
- ✅ Proyecto más limpio
- ✅ Menos ruido en ls/grep

**Status**: REVISAR PRIMERO, LUEGO ELIMINAR

---

## 🗑️ CATEGORÍA 4: database.sql EN RAÍZ (Reorganizar)

### Archivo a mover:

```
database.sql  (en raíz)
```

### ¿Por qué?

- Está en la raíz, pero debería estar en `database/` (donde está la schema real)
- Hay duplicado: `database/database.sql` (el correcto)

### Acción:

```
ELIMINAR: c:\xampp\htdocs\Pagina web\database.sql (raíz)
MANTENER: c:\xampp\htdocs\Pagina web\database\database.sql (carpeta database/)
```

**Status**: MOVER / ELIMINAR

---

## 🗑️ CATEGORÍA 5: package.json / package-lock.json EN RAÍZ (Revisar)

### Archivos en raíz:

```
package.json (295 bytes)
package-lock.json (30KB)
```

### ¿Por qué están aquí?

Probablemente restos de un setup inicial.

### Acción:

```
VERIFICAR: ¿package.json contiene dependencias?
  Si es vacío o solo "scripts": ELIMINAR
  Si tiene dependencias reales: MOVER a backend/

ELIMINAR: package-lock.json (generado, puede regenerarse)
```

### Status: REVISAR PRIMERO

**Verificado**:
```json
{
  "name": "pagina-web",
  "main": "index.js",
  "scripts": { "test": "echo error" },
  "dependencies": { "express": "^5.2.1" }
}
```

**Veredicto**: ELIMINAR
- No tiene lógica
- El verdadero `package.json` está en `backend/package.json`
- Esta versión es un residuo de setup antiguo

---

## 🗑️ CATEGORÍA 6: .htaccess Y SERVIDOR.PHP (Mantener)

### Archivos a MANTENER:

```
.htaccess (crítico para rutas limpias)
api/conexion.php (conexión a BD, fallback)
api/login.php (fallback si Node falla)
```

### ¿Por qué mantenerlos?

- `.htaccess`: Reescribe URLs limpias (`/servicios/slug` → `/detalle.html`)
- `api/*.php` (algunos): Son el rollback si Node.js falla en producción
- El CLAUDE.md dice "NO elimines api/*.php" (son el plan B)

**Status**: NO TOCAR

---

## 📊 RESUMEN DE ACCIONES

### ELIMINAR SIN DUDARLO ✅

```
1. api/migrar_json_a_mysql.php
2. api/migrar_docentes_normalizado.php
3. api/migrate-servicios.php
4. api/migrate_docentes.php
5. api/migrate_password_change.php

6. servicios.json
7. proyectos.json
8. investigacion.json
9. cursos.json
10. usuarios.json

11. database.sql (en raíz)
12. package.json (en raíz)
13. package-lock.json (en raíz)
```

**Total**: ~210KB de basura a eliminar

**Riesgo**: BAJO (solo dev/test artifacts)

**Impacto en producción**: NINGUNO (no se usan)

---

### REVISAR PRIMERO ⚠️

```
1. botoncotiza.txt (76KB)
   - Contiene: HTML hardcodeado de un CTA
   - Acciones: ¿El contenido está en BD? Si sí → ELIMINAR
   
2. detalleservicio.txt (127KB)
   - Contiene: HTML de página de detalle vieja
   - Acciones: ¿El contenido está en BD? Si sí → ELIMINAR
```

**Recomendación**: Hacer backup antes de eliminar

---

### MANTENER 🔒

```
1. .htaccess (rutas limpias)
2. api/ (rollback system)
3. frontend/ (código activo)
4. backend/ (código activo)
5. database/database.sql (schema real)
6. assets/ (imágenes, logos)
7. css/ (estilos activos)
8. js/ (lógica fronend)
```

---

## 🛠️ PLAN DE LIMPIEZA

### Paso 1: Backup de contenido (por si acaso)

```powershell
# En c:\xampp\htdocs\Pagina web
mkdir "backup_pre_cleanup_$(Get-Date -Format 'yyyyMMdd')"

# Copia lo que vas a eliminar
Copy-Item botoncotiza.txt "backup_pre_cleanup_$(Get-Date -Format 'yyyyMMdd')/"
Copy-Item detalleservicio.txt "backup_pre_cleanup_$(Get-Date -Format 'yyyyMMdd')/"
Copy-Item servicios.json "backup_pre_cleanup_$(Get-Date -Format 'yyyyMMdd')/"
# ... etc
```

### Paso 2: Verificar backend funciona SIN estos archivos

```powershell
cd c:\xampp\htdocs\Pagina web\backend
node server.js
# Debe iniciar sin errores
# Acceder a http://localhost:4000/api/servicios
# Debe devolver datos de MySQL, NO de JSON
```

### Paso 3: Eliminar archivos de migración

```powershell
cd c:\xampp\htdocs\Pagina web\api
Remove-Item migrar_json_a_mysql.php
Remove-Item migrar_docentes_normalizado.php
Remove-Item migrate-servicios.php
Remove-Item migrate_docentes.php
Remove-Item migrate_password_change.php
```

### Paso 4: Eliminar JSON antiguos

```powershell
cd c:\xampp\htdocs\Pagina web
Remove-Item servicios.json
Remove-Item proyectos.json
Remove-Item investigacion.json
Remove-Item cursos.json
Remove-Item usuarios.json
```

### Paso 5: Eliminar archivos raíz innecesarios

```powershell
cd c:\xampp\htdocs\Pagina web
Remove-Item package.json
Remove-Item package-lock.json
Remove-Item database.sql  # (Mantener el de database/)
```

### Paso 6: Decidir sobre .txt

```powershell
# Opción A: Guardar para referencia
mkdir "docs/deprecated"
Move-Item botoncotiza.txt "docs/deprecated/"
Move-Item detalleservicio.txt "docs/deprecated/"

# Opción B: Eliminar directamente
# Remove-Item botoncotiza.txt
# Remove-Item detalleservicio.txt
```

### Paso 7: Verificar de nuevo

```powershell
# Backend sigue funcionando
node c:\xampp\htdocs\Pagina web\backend\server.js

# Frontend sigue funcionando
node c:\xampp\htdocs\Pagina web\frontend\serve.js

# Acceder a http://localhost:8080/inicio.html
# Debe mostrar datos reales (no errores)
```

---

## ✅ CHECKLIST PRE-LIMPIEZA

Antes de ejecutar el plan:

- [ ] ¿Backend Node.js funciona? (npm install + node server.js)
- [ ] ¿Frontend funciona? (node serve.js)
- [ ] ¿Datos aparecen en página? (no vacíos)
- [ ] ¿Git está actualizado?
  ```
  git status  # No hay cambios sin commitear
  ```
- [ ] ¿Hiciste backup de archivos importantes?

---

## 📈 DESPUÉS DE LIMPIAR

### Verificaciones finales

```powershell
# 1. Size antes vs después
du -sh c:\xampp\htdocs\Pagina web

# 2. Backend funciona
Invoke-WebRequest http://localhost:4000/api/servicios | ConvertFrom-Json

# 3. Frontend funciona
Invoke-WebRequest http://localhost:8080/inicio.html -UseBasicParsing

# 4. Git lo ve
git status  # Deberías ver archivos marcados como "deleted"
```

### Commit final

```powershell
git add -A
git commit -m "cleanup: remove migration scripts and legacy JSON files

- Removed api/migra*.php (one-time migration scripts)
- Removed *.json (superseded by MySQL + Node.js API)
- Removed package.json from root (duplicate)
- Kept .htaccess and api/*.php as rollback layer
- Verified backend + frontend still functional

Total cleanup: ~210KB"
```

---

## 🔍 VERIFICACIÓN POST-LIMPIEZA

Una vez eliminado, verifica en producción:

```
1. Backend en VPS responde: GET http://vps:4000/api/servicios
2. Frontend en hosting carga: GET http://hosting/inicio.html  
3. CORS no tiene errores: Console sin red errors
4. Datos reales aparecen: No vacíos, no broken images
```

Si algo falla:
- Revert: `git checkout HEAD~1` (vuelve atrás)
- Investigar: Probablemente una dependencia que no notaste

---

## 🎯 RESUMEN

| Archivo/Carpeta | Acción | Razón | Riesgo |
|---|---|---|---|
| api/migra*.php | Eliminar | One-time scripts | BAJO |
| *.json (raíz) | Eliminar | Obsoletos | BAJO |
| package.json (raíz) | Eliminar | Duplicate | BAJO |
| botoncotiza.txt | Revisar/Eliminar | Contenido viejo | MEDIO |
| detalleservicio.txt | Revisar/Eliminar | Contenido viejo | MEDIO |
| database.sql (raíz) | Eliminar | Duplicate | BAJO |
| api/*.php | MANTENER | Rollback layer | CRITICO |
| .htaccess | MANTENER | Rutas limpias | CRITICO |
| backend/ | MANTENER | Código actual | CRITICO |
| frontend/ | MANTENER | Código actual | CRITICO |

**Tamaño a liberar**: ~210KB  
**Tiempo de ejecución**: ~15 minutos  
**Riesgo de regresión**: MUY BAJO (archivos no usados)

