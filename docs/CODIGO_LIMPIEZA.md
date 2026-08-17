# 🧹 Limpieza de Código: Simplificación para Auditoria

**Objetivo**: Código limpio, sin deuda técnica, listo para auditoría de seguridad.

---

## 📋 CHECKLIST DE LIMPIEZA POR ARCHIVO

### Backend (Node.js)

#### `backend/server.js`
```javascript
// ANTES:
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));

// ... rutas ...

// DESPUÉS: (igual, pero verificar)
// ✅ No hay comentarios innecesarios
// ✅ Imports están al inicio
// ✅ No hay código muerto
// ✅ Error handling está presente
```

**Status**: ✅ Ya limpio

---

#### `backend/config/database.js`
```javascript
// VERIFICAR:
// ✅ Pool mysql2/promise sin comentarios innecesarios
// ✅ Credenciales vienen de .env (no hardcodeadas)
// ✅ Error handling está presente
```

**Status**: ✅ Ya limpio

---

#### `backend/models/collection.model.js`
```javascript
// VERIFICAR:
// ✅ Funciones CRUD simples y claras
// ✅ No hay lógica duplicada
// ✅ SQL está parametrizado (prepared statements)
// ⚠️ Buscar comentarios que repiten el código

// EJEMPLO:
// Antes:
// // Obtiene todos los registros
// const getAll = async () => {

// Después:
// const getAll = async () => {
//   (el nombre de la función ya dice qué hace)
```

**Status**: ✅ Revisar comentarios

**Acciones**:
- [ ] Buscar comentarios obvios (que repiten el código)
- [ ] Eliminar si la función es clara (nombre descriptivo)
- [ ] Mantener si hay lógica no-obvia

---

#### `backend/controllers/collection.controller.js`
```javascript
// VERIFICAR:
// ✅ Los handlers son simples (llaman al modelo)
// ✅ No hay lógica de negocio en controller
// ✅ Respuestas HTTP están estandarizadas

// Estructura esperada:
// exports.getAll = async (req, res) => {
//   try {
//     const data = await Model.getAll();
//     res.json({ ok: true, data });
//   } catch (e) {
//     res.status(500).json({ ok: false, message: e.message });
//   }
// }
```

**Status**: ✅ Ya limpio

---

#### `backend/routes/*.js`
```javascript
// VERIFICAR en cada archivo:
// ✅ No hay lógica de negocio (debe estar en models)
// ✅ Validaciones básicas están presentes
// ❌ Buscar SQL directo en routes (DEUDA TÉCNICA)

// Ejemplo de deuda (8 archivos tienen esto):
// acreditaciones.routes.js, clientes.routes.js, contenido.routes.js,
// estadisticas.routes.js, nosotros_bloques.routes.js, etc.

// Tienen SQL directo en lugar de usar el modelo factory
```

**Status**: ⚠️ Parcialmente deuda técnica (documentado, no crítico)

**Acción**: NO refactorizar ahora (es deuda conocida, funciona)

---

### Frontend (HTML/CSS/JS)

#### `frontend/js/api-base.js`
```javascript
// ANTES: podría tener rutas hardcodeadas
// DESPUÉS:
window.API_BASE = window.API_BASE || 'http://localhost:4000';
// ✅ Ya limpio, ya configurable
```

**Status**: ✅ Limpio

---

#### `frontend/js/config.js`
```javascript
// VERIFICAR:
// ✅ Usa window.API_BASE (dinámico)
// ✅ Collections mapeadas correctamente
// ✅ No hay hardcoded URLs
```

**Status**: ✅ Limpio

---

#### `frontend/js/dashboard.js`
```javascript
// VERIFICAR:
// ✅ resolveApiUrl() helper funciona
// ✅ No hay localhost:4000 hardcodeado
// ⚠️ Buscar comentarios obvios
```

**Status**: ✅ Revisar comentarios

---

#### `frontend/*.html`
```html
<!-- VERIFICAR en cada página: -->
<!-- ✅ No hay <script> inline (deben estar en archivo .js) -->
<!-- ✅ No hay <style> inline (deben estar en css/main.css) -->
<!-- ✅ No hay comentarios HTML que expliquen HTML obvio -->

<!-- Ejemplo de comentario a eliminar: -->
<!-- ANTES:
<div class="container">
  <!-- Contenedor principal -->
  <div class="row">
-->

<!-- DESPUÉS:
<div class="container">
  <div class="row">
-->
```

**Status**: ✅ Revisar HTML

**Archivos a revisar**:
- [ ] index.html
- [ ] inicio.html
- [ ] servicios_publico.html
- [ ] docentes.html
- [ ] detalle.html
- [ ] admin.html
- [ ] ... (otros)

---

#### `frontend/css/main.css`
```css
/* VERIFICAR: */
/* ✅ No hay estilos duplicados */
/* ✅ No hay estilos unused (estilos que no se usan en HTML) */
/* ✅ No hay comentarios obvios */
/* ⚠️ Archivo grande (53KB), buscar consolidaciones */

/* Ejemplo de duplicación (buscar con grep): */
/* .btn-primary { color: white; }
   .button-primary { color: white; }  <- DUPLICADO */

/* Acción: Buscar con regex y eliminar */
```

**Status**: ⚠️ Revisar para CSS duplicado

**Acciones**:
- [ ] Grep para `.btn-` y `button-` (si están duplicados)
- [ ] Consolidar si hay 2+ estilos similares

---

### PHP (Rollback layer, MANTENER pero limpiar)

#### `api/conexion.php`
```php
// VERIFICAR:
// ✅ Sin comentarios innecesarios
// ✅ Sin lógica de negocio
// ✅ Solo conexión a BD
```

**Status**: ✅ Limpio

---

#### `api/login.php`
```php
// VERIFICAR:
// ✅ Usa bcrypt para comparar (lazy migration)
// ✅ Sin hardcoded credenciales
// ✅ Respuestas JSON estructuradas
```

**Status**: ✅ Limpio

---

#### `api/crud_factory.php`
```php
// VERIFICAR:
// ✅ Factory pattern implementado
// ✅ Sin SQL injection (prepared statements)
// ❌ Buscar comentarios obvios
```

**Status**: ✅ Revisar comentarios

---

---

## 🧹 TAREAS CONCRETAS DE LIMPIEZA

### Tarea 1: Eliminar comentarios obvios

**En qué buscar**:
```javascript
// ✅ MANTENER: Comentarios que explican POR QUÉ
// const user = await findUserOrThrow(id);  // Lazy-load si no existe aún

// ❌ ELIMINAR: Comentarios que repiten el código
// // Obtiene usuario por ID
// const user = await findUserById(id);
```

**Cómo buscar**:
```bash
# En VSCode: Ctrl+Shift+F
# Busca: "^[ \t]*\/\/" (comentarios que repiten)
# Revisa cada uno
```

**Archivos a revisar**:
- [ ] backend/models/*.js
- [ ] backend/controllers/*.js
- [ ] backend/routes/*.js
- [ ] frontend/js/*.js
- [ ] api/*.php

---

### Tarea 2: Eliminar imports/requires no usados

**Archivos a revisar**:
```javascript
// Ejemplo:
// const axios = require('axios');  // Nunca se usa
// const moment = require('moment');  // Nunca se usa
```

**Cómo buscar**:
```bash
# En VSCode: Instala extensión "Unused Imports"
# O manualmente: Busca cada require y verifica si se usa
```

**Archivos críticos**:
- [ ] backend/server.js
- [ ] backend/routes/*.js
- [ ] frontend/js/*.js

---

### Tarea 3: Eliminar variables no usadas

**En Node.js**:
```javascript
// ❌ ANTES:
const express = require('express');
const cors = require('cors');
const path = require('path');  // Nunca se usa

// ✅ DESPUÉS:
const express = require('express');
const cors = require('cors');
```

**Herramienta**: ESLint detecta esto. Pero como no está configurado, revisar manualmente.

---

### Tarea 4: Consolidar estilos CSS duplicados

**Ejemplo**:
```css
/* frontend/css/main.css */

.btn-primary { color: white; padding: 10px; }
/* ... 2000 líneas después ... */
.primary-btn { color: white; padding: 10px; }  /* DUPLICADO */

/* Consolidar a: */
.btn-primary { color: white; padding: 10px; }
/* Eliminar .primary-btn */
```

**Cómo buscar**:
```bash
# Grep por definiciones similares
grep -n "^\\." frontend/css/main.css | sort
# Busca nombres similares manualmente
```

---

### Tarea 5: Eliminar código muerto en routes

**Ejemplo**:
```javascript
// En api/servicios.php o backend/routes/servicios.routes.js

// ❌ Código comentado (muerto)
// const old_handler = async (req, res) => {
//   // ... función vieja que no se usa ...
// }

// ✅ Eliminar completamente
```

**Cómo buscar**:
```bash
# Grep por líneas que empiezan con //
grep -n "^[ ]*\/\/" api/*.php backend/routes/*.js
```

---

---

## 📊 TABLA DE LIMPIEZA

| Área | Archivo | Revisar | Acción | Prioridad |
|------|---------|---------|--------|-----------|
| Backend | server.js | Comments | Eliminar obvios | BAJA |
| Backend | config/database.js | Code | ✅ Limpio | - |
| Backend | models/* | Comments | Eliminar obvios | MEDIA |
| Backend | controllers/* | Code | ✅ Limpio | - |
| Backend | routes/* | Comments | Eliminar obvios | MEDIA |
| Backend | routes/* | Dead code | Buscar commented code | MEDIA |
| Frontend | *.html | Comments | Eliminar obvios | BAJA |
| Frontend | js/*.js | Comments | Eliminar obvios | BAJA |
| Frontend | js/*.js | Imports | Eliminar no usados | MEDIA |
| Frontend | css/main.css | Duplicates | Consolidar estilos | ALTA |
| PHP | api/*.php | Comments | Eliminar obvios | BAJA |
| PHP | api/*.php | Dead code | Buscar commented | BAJA |

---

## ✅ CHECKLIST POST-LIMPIEZA

Una vez limpiado, verifica:

- [ ] Backend inicia sin warnings: `node backend/server.js`
- [ ] Frontend inicia sin warnings: `node frontend/serve.js`
- [ ] No hay errores en Console (F12) del navegador
- [ ] API responde: `http://localhost:4000/api/servicios`
- [ ] Datos aparecen: `http://localhost:8080/inicio.html`
- [ ] Verificar con ESLint si puedes (opcional):
  ```bash
  npm install -g eslint
  eslint backend/routes/*.js
  ```

---

## 📝 RESUMEN DE CAMBIOS

### Código backend
- ❌ Eliminar comentarios obvios (5-10 líneas)
- ❌ Eliminar imports no usados (0-5 líneas)
- ❌ Eliminar código comentado/muerto (0-10 líneas)

### Código frontend
- ❌ Eliminar comentarios HTML obvios (5-10 líneas)
- ❌ Eliminar comentarios JS obvios (5-10 líneas)
- ❌ Consolidar estilos CSS duplicados (10-20 reglas)

### Código PHP (rollback)
- ❌ Eliminar comentarios obvios (2-5 líneas)
- ⚠️ NO refactorizar lógica (ya funciona, es rollback)

---

## 🎯 IMPACTO ESPERADO

**Antes de limpieza**:
- backend/: ~500 KB
- frontend/: ~300 KB
- api/: ~50 KB (con migration scripts)

**Después de limpieza**:
- backend/: ~500 KB (sin cambio, el peso es node_modules)
- frontend/: ~298 KB (-2 KB de comentarios)
- api/: ~40 KB (-10 KB sin migration scripts)

**Beneficio principal**: Código más fácil de leer y auditar, no tamaño.

---

## 🚀 CUANDO EJECUTAR ESTA LIMPIEZA

1. ✅ **Antes de producción** (ahora)
2. ✅ **Antes de auditoría de seguridad** (si la hacen)
3. ✅ **Antes de vender a Cliente 2** (para que vean código limpio)

**NO ejecutar**: En medio de un deployment urgent.
