# 🚀 PLAN DE PREPARACIÓN PARA PRODUCCIÓN

**Objetivo**: Código limpio, auditado, listo para deployment.  
**Tiempo estimado**: 3-4 horas  
**Riesgo**: BAJO (cambios cosméticos, no lógica)

---

## FASE 1: AUDITORÍA (30 min)

### Paso 1.1: Revisar archivos a eliminar

Abre: `docs/ARCHIVOS_A_REVISAR.md`

Verifica que entiendes:
- [ ] Por qué eliminar migration scripts
- [ ] Por qué eliminar JSON antiguos
- [ ] Qué archivos MANTENER (rollback layer)

### Paso 1.2: Revisar código a limpiar

Abre: `docs/CODIGO_LIMPIEZA.md`

Identifica:
- [ ] Comentarios obvios a eliminar
- [ ] Imports no usados
- [ ] Código muerto/comentado

### Paso 1.3: Crear git branch

```powershell
cd "c:\xampp\htdocs\Pagina web"
git checkout -b feat/production-cleanup
```

**Razón**: Si algo falla, vuelves atrás fácil.

---

## FASE 2: BACKUP (10 min)

### Paso 2.1: Backup local

```powershell
cd "c:\xampp\htdocs\Pagina web"

# Crea carpeta de backup
$date = Get-Date -Format "yyyyMMdd_HHmm"
mkdir "backup_pre_cleanup_$date"

# Copia archivos que vas a eliminar
Copy-Item "botoncotiza.txt" "backup_pre_cleanup_$date/"
Copy-Item "detalleservicio.txt" "backup_pre_cleanup_$date/"
Copy-Item "servicios.json" "backup_pre_cleanup_$date/"
Copy-Item "proyectos.json" "backup_pre_cleanup_$date/"
Copy-Item "investigacion.json" "backup_pre_cleanup_$date/"
Copy-Item "cursos.json" "backup_pre_cleanup_$date/"
Copy-Item "usuarios.json" "backup_pre_cleanup_$date/"
Copy-Item "database.sql" "backup_pre_cleanup_$date/"
Copy-Item "package.json" "backup_pre_cleanup_$date/"

# Copia scripts PHP de migración
Copy-Item "api/migrar_*.php" "backup_pre_cleanup_$date/"
Copy-Item "api/migrate_*.php" "backup_pre_cleanup_$date/"
Copy-Item "api/migrate*.php" "backup_pre_cleanup_$date/"

Write-Host "Backup created: backup_pre_cleanup_$date"
```

### Paso 2.2: Commit del backup

```powershell
git add "backup_pre_cleanup_*"
git commit -m "backup: pre-cleanup snapshot before production preparation"
```

**Razón**: Si necesitas comparar después, lo tienes en git.

---

## FASE 3: TEST PRE-LIMPIEZA (15 min)

### Paso 3.1: Verificar que todo funciona ANTES de limpiar

**Terminal 1: Backend**
```powershell
cd "c:\xampp\htdocs\Pagina web\backend"
npm install  # Por si falta algo
node server.js
# Debe decir: "API backend escuchando en http://localhost:4000"
```

**Terminal 2: Frontend**
```powershell
cd "c:\xampp\htdocs\Pagina web\frontend"
node serve.js
# Debe decir: "Frontend preview en http://localhost:8080"
```

**Terminal 3: Verificación**
```powershell
# Test 1: API responde
$resp = Invoke-WebRequest "http://localhost:4000/api/servicios" -UseBasicParsing
$resp.StatusCode  # Debe ser 200

# Test 2: Frontend carga
$resp = Invoke-WebRequest "http://localhost:8080/inicio.html" -UseBasicParsing
$resp.StatusCode  # Debe ser 200

# Test 3: Datos aparecen
$resp = Invoke-WebRequest "http://localhost:4000/api/servicios" -UseBasicParsing
$resp.Content | ConvertFrom-Json | Select-Object -First 1
# Debe mostrar un servicio real
```

### Paso 3.2: Registro de estado

Toma nota:
- [ ] Backend versión Node: (ej: v18.17.0)
- [ ] Frontend port: 8080
- [ ] API port: 4000
- [ ] Total archivos antes: (usa `ls -R | wc -l`)

---

## FASE 4: LIMPIEZA DE ARCHIVOS (45 min)

### Paso 4.1: Eliminar scripts de migración

```powershell
cd "c:\xampp\htdocs\Pagina web\api"

# Elimina de uno en uno (por si necesitas verificar)
Remove-Item "migrar_json_a_mysql.php" -Verbose
Remove-Item "migrar_docentes_normalizado.php" -Verbose
Remove-Item "migrate-servicios.php" -Verbose
Remove-Item "migrate_docentes.php" -Verbose
Remove-Item "migrate_password_change.php" -Verbose

Write-Host "✅ Migration scripts eliminated"
```

**Verificación**:
```powershell
ls api/*.php | ? { $_.Name -like "migra*" -or $_.Name -like "migrate*" }
# No debe mostrar nada
```

### Paso 4.2: Eliminar JSON antiguos

```powershell
cd "c:\xampp\htdocs\Pagina web"

# Elimina de uno en uno
Remove-Item "servicios.json" -Verbose
Remove-Item "proyectos.json" -Verbose
Remove-Item "investigacion.json" -Verbose
Remove-Item "cursos.json" -Verbose
Remove-Item "usuarios.json" -Verbose

Write-Host "✅ Legacy JSON files eliminated"
```

**Verificación**:
```powershell
ls *.json
# Solo debería mostrar: package-lock.json (por ahora)
```

### Paso 4.3: Eliminar archivos raíz innecesarios

```powershell
cd "c:\xampp\htdocs\Pagina web"

Remove-Item "package.json" -Verbose
Remove-Item "package-lock.json" -Verbose
Remove-Item "database.sql" -Verbose

Write-Host "✅ Root-level duplicates eliminated"
```

**Verificación**:
```powershell
ls *.json *.sql 2>$null | Select-Object Name
# No debe mostrar nada
```

### Paso 4.4: Decidir sobre .txt files

**Opción A: Guardar para referencia**

```powershell
# Crea carpeta de deprecated
mkdir "docs/deprecated" -ErrorAction SilentlyContinue

# Mueve los archivos
Move-Item "botoncotiza.txt" "docs/deprecated/" -Verbose
Move-Item "detalleservicio.txt" "docs/deprecated/" -Verbose

Write-Host "✅ Text files moved to deprecated/"
```

**Opción B: Eliminar directamente**

```powershell
Remove-Item "botoncotiza.txt" -Verbose
Remove-Item "detalleservicio.txt" -Verbose

Write-Host "✅ Text files eliminated"
```

### Paso 4.5: Test post-eliminación de archivos

**Terminal 3** (la que tenías para verificación):

```powershell
# Test 1: API sigue respondiendo
$resp = Invoke-WebRequest "http://localhost:4000/api/servicios" -UseBasicParsing
if ($resp.StatusCode -eq 200) { Write-Host "✅ API funciona" } else { Write-Host "❌ API roto" }

# Test 2: Frontend sigue cargando
$resp = Invoke-WebRequest "http://localhost:8080/inicio.html" -UseBasicParsing
if ($resp.StatusCode -eq 200) { Write-Host "✅ Frontend funciona" } else { Write-Host "❌ Frontend roto" }

# Test 3: Datos aún aparecen
$resp = Invoke-WebRequest "http://localhost:4000/api/servicios" -UseBasicParsing
$data = $resp.Content | ConvertFrom-Json
if ($data.Count -gt 0) { Write-Host "✅ Datos aparecen" } else { Write-Host "❌ Sin datos" }
```

**Resultado esperado**: ✅ ✅ ✅ (todo verde)

---

## FASE 5: LIMPIEZA DE CÓDIGO (60 min)

### Paso 5.1: Eliminar comentarios obvios

**En backend/models/collection.model.js**:

```powershell
# Abre en VSCode
code "backend/models/collection.model.js"

# Busca comentarios obvios (Ctrl+F):
# "// Obtiene"
# "// Crea"
# "// Actualiza"
# Si son así, busca la línea y elimina
```

**Ejemplo**:
```javascript
// ANTES:
// Obtiene todos los registros
const getAll = async () => {
  return await pool.query('SELECT * FROM ...');
};

// DESPUÉS:
const getAll = async () => {
  return await pool.query('SELECT * FROM ...');
};
```

**Archivos a revisar**:
- [ ] backend/models/collection.model.js
- [ ] backend/models/docentes.model.js
- [ ] backend/models/usuarios.model.js
- [ ] backend/controllers/collection.controller.js

**Tiempo**: ~15 min

### Paso 5.2: Eliminar imports no usados

**En backend/routes/*.js**:

```powershell
# Opción A: Manual (más seguro)
# - Abre cada archivo routes
# - Busca al inicio (las primeras 5-10 líneas)
# - Si un require no se usa en el archivo, elimina

# Opción B: Automático (con herramienta)
# npm install -g eslint
# eslint backend/routes/*.js --fix
# (cuidado, puede cambiar más de lo que quieres)
```

**Ejemplo**:
```javascript
// ANTES:
const express = require('express');
const cors = require('cors');  // Nunca se usa en este archivo
const router = express.Router();

// DESPUÉS:
const express = require('express');
const router = express.Router();
```

**Archivos a revisar**:
- [ ] backend/routes/*.js (todos)

**Tiempo**: ~15 min

### Paso 5.3: Eliminar código comentado/muerto

**En api/*.php** (rollback layer):

```bash
# Busca por comentarios largos
grep -r "^[ ]*\/\*" api/
grep -r "^[ ]*\/\/" api/

# Revisa cada uno manualmente
```

**Mantén el archivo limpio pero NO lo refactorices** (es rollback).

**Tiempo**: ~10 min

### Paso 5.4: Consolidar CSS duplicados (si hay)

```powershell
# Abre frontend/css/main.css
code "frontend/css/main.css"

# Busca (Ctrl+F):
# .btn-
# .button-
# Si ves duplicados (.btn-primary y .button-primary con el mismo estilo), consolida

# Ejemplo: si hay 2 definiciones, elimina la segunda
```

**Tiempo**: ~20 min (puede no haber nada)

---

## FASE 6: COMMIT Y TEST FINAL (30 min)

### Paso 6.1: Ver cambios

```powershell
cd "c:\xampp\htdocs\Pagina web"
git status

# Debe mostrar:
# deleted: api/migrar_*.php
# deleted: *.json
# modified: backend/models/collection.model.js
# ... etc
```

### Paso 6.2: Review de cambios

```powershell
# Ver diferencias
git diff backend/models/collection.model.js
# Verifica que solo eliminaste comentarios obvios, no lógica

git diff frontend/css/main.css
# Verifica que solo consolidaste, no rompiste
```

### Paso 6.3: Commit

```powershell
git add -A

git commit -m "cleanup: remove migration scripts, legacy JSON, and obsolete dependencies

REMOVED:
- api/migra*.php (one-time migration scripts, no longer needed)
- api/migrate*.php (data migration completed in Aug 2026)
- *.json (servicios, proyectos, cursos, investigacion, usuarios)
- database.sql (moved to database/ folder)
- package.json from root (duplicate, real one in backend/)
- Unnecessary comments in backend/models and frontend/js

VERIFIED:
- Backend Node.js API still functional (port 4000)
- Frontend static server functional (port 8080)
- All data still pulled from MySQL (no JSON fallback)
- No imports or code logic removed

TOTAL CLEANUP: ~250KB of obsolete files and dead code"
```

### Paso 6.4: Test final POST-cleanup

Arranca terminal 1 (backend), 2 (frontend) de nuevo:

```powershell
# Terminal 1
cd "c:\xampp\htdocs\Pagina web\backend"
node server.js
# Espera a que diga: "API backend escuchando..."
```

```powershell
# Terminal 2
cd "c:\xampp\htdocs\Pagina web\frontend"
node serve.js
# Espera a que diga: "Frontend preview en..."
```

```powershell
# Terminal 3
# Test completo
$api = Invoke-WebRequest "http://localhost:4000/api/servicios" -UseBasicParsing
$front = Invoke-WebRequest "http://localhost:8080/inicio.html" -UseBasicParsing
$data = $api.Content | ConvertFrom-Json

Write-Host "API Status: $($api.StatusCode)"
Write-Host "Frontend Status: $($front.StatusCode)"
Write-Host "Data records: $($data.Count)"
```

**Resultado esperado**:
```
API Status: 200
Frontend Status: 200
Data records: 7
```

### Paso 6.5: Verificar en navegador

Abre: `http://localhost:8080/inicio.html`

- [ ] Página carga sin errores (F12 → Console vacía de rojos)
- [ ] Tarjetas de servicios visibles
- [ ] Fotos cargan
- [ ] Botones funcionan
- [ ] Navegación limpia

---

## FASE 7: PUSH A REPOSITORY (5 min)

```powershell
# Verifica que estás en la rama correcta
git branch
# Debe mostrar: * feat/production-cleanup

# Pushea
git push origin feat/production-cleanup

# Si tienes repo remoto, crea Pull Request:
# 1. Ve a GitHub
# 2. "Compare & pull request"
# 3. Title: "chore: production cleanup and code simplification"
# 4. Description: Copia del commit message
# 5. Merge cuando GitHub Status sea green
```

---

## FASE 8: ACTUALIZAR DOCUMENTACIÓN (10 min)

### Paso 8.1: Crear resumen de cambios

Crea: `docs/CLEANUP_SUMMARY.md`

```markdown
# Cleanup Summary - 2026-08-09

## Files Removed
- api/migra*.php (5 files)
- *.json (5 files)
- package.json, package-lock.json (from root)
- database.sql (duplicate)
Total: ~250KB

## Code Simplified
- Removed obvious comments from models
- Removed unused imports from routes
- Consolidated CSS rules

## Verification
- ✅ Backend API functional
- ✅ Frontend static server functional
- ✅ MySQL data accessible
- ✅ No regressions

## Status
READY FOR PRODUCTION DEPLOYMENT
```

---

## ✅ CHECKLIST FINAL

Una vez todo esté limpio:

- [ ] Git branch creado (feat/production-cleanup)
- [ ] Backup realizado (backup_pre_cleanup_*)
- [ ] Archivos innecesarios eliminados
- [ ] Código limpio (comentarios obvios, imports)
- [ ] Backend funciona (http://localhost:4000/api/servicios = 200)
- [ ] Frontend funciona (http://localhost:8080/inicio.html = 200)
- [ ] Datos real en página (no vacíos)
- [ ] Git commit realizado
- [ ] Git push realizado
- [ ] Documentación actualizada

---

## 🚨 SI ALGO FALLA

### Backend no inicia

```powershell
cd backend
node server.js 2>&1 | Tee-Object backend_error.log
# Lee el error y busca en QUICK_REFERENCE.md → Troubleshooting
```

### Frontend no inicia

```powershell
cd frontend
node serve.js 2>&1 | Tee-Object frontend_error.log
# Lee el error
```

### Rollback rápido

```powershell
# Si algo se rompió:
git reset --hard HEAD~1
git checkout main
# Vuelve a la versión anterior
```

---

## 📈 RESULTADO ESPERADO

**Antes**:
- 450+ archivos (incluyendo node_modules)
- 23 archivos PHP (incluyendo migrations)
- 5 archivos JSON
- Comentarios obvios en código

**Después**:
- 450+ archivos (iguales, no contamos node_modules)
- 18 archivos PHP (solo los necesarios)
- 0 archivos JSON
- Código limpio, sin comentarios obvios
- **LISTO PARA AUDITORÍA Y PRODUCCIÓN**

---

**Tiempo total**: 3-4 horas  
**Complejidad**: BAJA (cambios cosméticos)  
**Riesgo**: MUY BAJO (nada crítico se toca)  
**Beneficio**: ALTO (código limpio, auditrable, profesional)

¿Comenzamos?
