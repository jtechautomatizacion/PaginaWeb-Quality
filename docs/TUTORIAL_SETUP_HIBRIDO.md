# Tutorial: Configurar Arquitectura Híbrida Paso a Paso

**Objetivo**: Que entiendas cómo funciona y que puedas replicarlo para cada cliente.

---

## PARTE A: SETUP LOCAL (Tu máquina ahora)

Primero probamos TODO en local para que no haya sorpresas cuando vayas al VPS del cliente.

### Paso 1: Verificar que backend + MySQL funcionan

Abre PowerShell en `c:\xampp\htdocs\Pagina web`:

```powershell
# Terminal 1: Inicia MySQL (si no está corriendo)
cd "c:\xampp\mysql\bin"
mysql -u root -p
# Ingresa password (vacío si no configuraste)
# Salida esperada: mysql>

# Verifica BD existe
show databases;
# Deberías ver: information_schema | group_tqc | mysql | performance_schema | sys
```

Si MySQL no está en PATH, usa:
```powershell
"c:\xampp\mysql\bin\mysql" -u root -p
```

### Paso 2: Configurar `.env` del backend

Copia el ejemplo:
```powershell
cd "c:\xampp\htdocs\Pagina web\backend"
Copy-Item .env.example .env
```

Abre `backend/.env` en VSCode y edita:

```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=group_tqc
DB_USER=root
DB_PASSWORD=
CORS_ORIGIN=*
NODE_ENV=development
```

Guarda. (La mayoría de valores son los que están ya. Solo verifica `DB_PASSWORD`.)

### Paso 3: Instalar dependencias + iniciar backend

```powershell
# Terminal 1: Setup backend
cd "c:\xampp\htdocs\Pagina web\backend"
npm install

# Terminal 1: Inicia el backend
node server.js
# Esperado: "API backend escuchando en http://localhost:4000"
# DEJA ABIERTA ESTA TERMINAL
```

### Paso 4: Verificar backend responde

Abre otra PowerShell:

```powershell
# Terminal 2: Test
$resp = Invoke-WebRequest -Uri "http://localhost:4000/api/servicios" -Method GET
$resp | ConvertFrom-Json | Format-List
```

Si ves una lista de servicios en JSON, ✅ **funciona**.

Si ves error "Connection refused", el backend no está corriendo. Vuelve a Paso 3.

### Paso 5: Configurar frontend para apuntar al backend

Abre `frontend/js/api-base.js`:

```javascript
window.API_BASE = 'http://localhost:4000';
```

Guarda. (Debe decir `localhost:4000` en desarrollo.)

### Paso 6: Iniciar frontend en puerto 8080

Abre OTRA PowerShell (Terminal 3):

```powershell
# Terminal 3: Frontend
cd "c:\xampp\htdocs\Pagina web\frontend"
node serve.js
# Esperado: "Frontend preview en http://localhost:8080"
# DEJA ABIERTA ESTA TERMINAL
```

### Paso 7: Verificar que todo funciona en navegador

Abre Chrome/Firefox:

```
http://localhost:8080/inicio.html
```

Abre DevTools (F12):
- **Console**: ¿Hay errores rojos? Si no → ✅
- **Network**: ¿Los fetch a `http://localhost:4000/api/...` son 200? Si sí → ✅
- **Página**: ¿Ves tarjetas de servicios llenas (no vacías)? Si sí → ✅

**Si todo es ✅**, tu setup local funciona. Puedes parar aquí.

---

## PARTE B: PARA CLIENTE 1 (VPS Windows Server 2019)

Cuando el cliente te proporcione las credenciales.

### INFORMACIÓN DEL CLIENTE (Pídele estos datos)

```
Nombre cliente: _______________________
Dominio: _______________________
IP del VPS: _______________________
Usuario RDP: _______________________
Password RDP: _______________________
Puerto RDP (generalmente 3389): _______________________
MySQL ya instalado: [ ] Sí [ ] No
  Si sí, usuario: _______________________
  Si sí, password: _______________________

Hosting compartido:
  Dominio: _______________________
  Usuario cPanel: _______________________
  Password cPanel: _______________________
```

### Paso 1: Conectar al VPS (desde tu máquina)

**Opción A: RDP (Remote Desktop)**

1. Abre "Remote Desktop Connection" en Windows
2. Ingresa IP del VPS
3. Ingresa usuario/password
4. Conecta
5. Ahora estás en Windows Server del cliente

**Opción B: SSH (si VPS tiene SSH)**

```powershell
ssh usuario@ip-vps
# Ingresa password
```

### Paso 2: Verificar Node.js no está instalado

En PowerShell del VPS:

```powershell
node --version
# Si ves error "node no reconocido" → OK, hay que instalar
# Si ves una versión → salta a Paso 4
```

### Paso 3: Instalar Node.js en VPS

En el VPS (via RDP):

1. Descarga Node.js desde: https://nodejs.org/ (LTS, 18.x o superior)
2. Descarga el archivo `.msi` (Windows installer)
3. Ejecuta el instalador
4. Durante instalación, marca: "Add to PATH"
5. Abre PowerShell nueva del VPS
6. Verifica:
   ```powershell
   node --version  # Debe mostrar v18.x.x o similar
   npm --version   # Debe mostrar 9.x.x o similar
   ```

### Paso 4: Subir carpeta `backend/` al VPS

**Opción A: Via Git (recomendado)**

En PowerShell del VPS:

```powershell
cd "C:\Apps"
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

**Opción B: Via SFTP/WinSCP**

1. Descarga WinSCP: https://winscp.net/
2. Conecta al VPS con usuario/password RDP
3. Navega a `C:\Apps`
4. Sube carpeta `backend/`

**Opción C: Via archivo ZIP (más simple)**

1. Comprime `backend/` en tu máquina local → `backend.zip`
2. Envía ZIP al cliente por email
3. Cliente extrae en `C:\Apps\backend`

### Paso 5: Instalar dependencias del backend

En PowerShell del VPS:

```powershell
cd "C:\Apps\backend"
npm install
# Espera a que termine (2-5 minutos)
# Verifica sin errores ("up to date" al final)
```

### Paso 6: Crear `.env` real

En PowerShell del VPS:

```powershell
# Copia el ejemplo
Copy-Item .env.example .env

# Abre en editor
notepad .env
```

Edita estos valores (el cliente debe proporcionártelos):

```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=group_tqc
DB_USER=root
DB_PASSWORD=password_real_del_cliente
CORS_ORIGIN=https://hosting-del-cliente.com
NODE_ENV=production
```

Guarda (`Ctrl+S` → Cerrar).

### Paso 7: Instalar MySQL en VPS (si no está)

**Si cliente dijo "No está instalado"**:

1. Descarga MySQL Community Server: https://dev.mysql.com/downloads/mysql/
2. Ejecuta instalador en VPS
3. Elige "Development Default"
4. Configura port 3306
5. Crea usuario `root` con password
6. Guarda el password que uses

**Si cliente dijo "Ya está instalado"**:

Salta a Paso 8.

### Paso 8: Restaurar BD en MySQL

En PowerShell del VPS:

```powershell
# Navega a donde esté database.sql
cd "C:\Apps\backend\.."  # o donde sea

# Restaura la BD
mysql -u root -p group_tqc < database\database.sql
# Ingresa password de MySQL

# Verifica que funcionó
mysql -u root -p
# Ingresa password
# Una vez dentro de MySQL:
use group_tqc;
show tables;
# Deberías ver 14 tablas
exit
```

### Paso 9: Test local del backend en VPS

En PowerShell del VPS:

```powershell
cd "C:\Apps\backend"
node server.js
# Esperado: "API backend escuchando en http://localhost:4000"
```

Abre navegador EN EL VPS:
```
http://localhost:4000/api/servicios
```

Deberías ver JSON de servicios. Si ves esto, ✅ **backend funciona**.

Cierra el servidor (Ctrl+C en PowerShell).

### Paso 10: Instalar NSSM (para que Node corra automáticamente)

Esto hace que si el VPS reinicia, Node.js se inicia solo.

En PowerShell del VPS (como Administrador):

```powershell
# Descarga NSSM
cd "C:\tools"
Invoke-WebRequest -Uri "https://nssm.cc/release/nssm-2.24-101-g897c7ad.zip" -OutFile "nssm.zip"

# Extrae
Expand-Archive nssm.zip -DestinationPath .

# Verifica
ls "C:\tools\nssm-2.24-101-g897c7ad\win64\nssm.exe"
```

Crea el servicio:

```powershell
cd "C:\tools\nssm-2.24-101-g897c7ad\win64"

# Instala servicio
.\nssm install GroupTQCBackend "C:\Program Files\nodejs\node.exe" "C:\Apps\backend\server.js"

# Configura directorio
.\nssm set GroupTQCBackend AppDirectory "C:\Apps\backend"

# Inicia
.\nssm start GroupTQCBackend

# Verifica
.\nssm status GroupTQCBackend
# Esperado: "SERVICE_RUNNING"
```

### Paso 11: Abrir firewall para puerto 4000

En PowerShell del VPS (como Administrador):

```powershell
New-NetFirewallRule -DisplayName "Node.js Backend 4000" `
  -Direction Inbound `
  -Action Allow `
  -Protocol TCP `
  -LocalPort 4000
```

### Paso 12: Verificar backend desde tu máquina (no desde VPS)

Desde tu máquina local (no del VPS):

```powershell
$resp = Invoke-WebRequest -Uri "http://ip-del-vps:4000/api/servicios" -Method GET
$resp | ConvertFrom-Json
```

Si ves servicios en JSON, ✅ **backend accesible desde afuera**.

---

## PARTE C: FRONTEND EN HOSTING COMPARTIDO (cPanel)

### Paso 1: Obtener acceso cPanel del cliente

Cliente proporciona:
- URL: `http://hosting.com:2083` (típicamente)
- Usuario: `usuario_cpanel`
- Password: `password_cpanel`

### Paso 2: Actualizar `api-base.js` para producción

En TU máquina local (no del cliente), abre:

```
c:\xampp\htdocs\Pagina web\frontend\js\api-base.js
```

Reemplaza:

```javascript
// ANTES (desarrollo):
window.API_BASE = 'http://localhost:4000';

// DESPUÉS (producción):
window.API_BASE = 'https://ip-del-vps:4000';
// O si tiene dominio:
// window.API_BASE = 'https://vps.dominio-cliente.com:4000';
```

Guarda.

### Paso 3: Preparar archivos para subir

En tu máquina local:

```powershell
# Comprime todo el frontend
cd "c:\xampp\htdocs\Pagina web"
Compress-Archive -Path "frontend\*" -DestinationPath "frontend.zip"
```

### Paso 4: Subir a cPanel via Web

1. Entra a cPanel del cliente: `http://hosting.com:2083`
2. Usuario/password
3. Busca "File Manager"
4. Navega a `public_html`
5. Click derecho → "Upload"
6. Selecciona `frontend.zip`
7. Click "Upload"
8. Una vez subido, click derecho → "Extract"
9. Click "Extract File"

### Paso 5: Subir carpeta `assets/`

1. En File Manager, sigue en `public_html`
2. Comprime `assets/` en tu máquina: `Compress-Archive -Path "assets\*" -DestinationPath "assets.zip"`
3. Sube `assets.zip` a cPanel
4. Extrae

**Estructura final esperada**:

```
public_html/
├── index.html
├── inicio.html
├── servicios_publico.html
├── admin.html
├── css/
├── js/
├── assets/
│   ├── LogoQuality.png
│   ├── clientes/
│   ├── uploads/
│   └── ...
└── ... (otros .html)
```

### Paso 6: Verificar que carga desde hosting

Abre navegador:

```
http://dominio-hosting.com/inicio.html
```

Debería ver la página. Abre DevTools (F12):

**Console**: ¿Hay errores CORS rojos? 
- Si hay: Significa backend no responde. Verifica:
  - ¿Backend está corriendo en VPS?
  - ¿`api-base.js` apunta a la IP/dominio correcto?
  - ¿Firewall permite puerto 4000?

- Si NO hay errores: ✅

**Network**: ¿Fetch a `https://ip-vps:4000/api/...` es 200?
- Sí → ✅
- No → Ver arriba

**Página**: ¿Ves datos (cards de servicios llenos)?
- Sí → ✅ **TODO FUNCIONA**
- No → Backend quizá no responde, ver arriba

---

## PARTE D: TESTING COMPLETO

Una vez que todo esté arriba, verifica:

### Test 1: Frontend carga

```
URL: https://hosting-cliente.com/
Esperado: Ves la página de inicio
```

### Test 2: Servicios visibles

```
URL: https://hosting-cliente.com/servicios_publico.html
Esperado: Ves al menos 3 tarjetas de servicios con datos reales
Console (F12): Sin errores CORS rojos
```

### Test 3: Detalle funciona

```
URL: https://hosting-cliente.com/
Click en un servicio
URL cambia a: https://hosting-cliente.com/servicios/geofisica
Esperado: Ve detalles del servicio (descripción, imagen, etc.)
```

### Test 4: Admin carga

```
URL: https://hosting-cliente.com/admin.html
Esperado: Ve el panel admin (sin login aún, eso está OK)
Console: Sin errores JS rojos críticos
```

### Test 5: API desde afuera

```powershell
# Desde tu máquina, test la API:
$resp = Invoke-WebRequest -Uri "https://ip-vps:4000/api/servicios" -Method GET
$resp.Content | ConvertFrom-Json
Esperado: JSON con servicios
```

---

## 🚨 TROUBLESHOOTING RÁPIDO

### "Connection refused" al conectar backend

**Causa**: Backend no está corriendo.

**Solución**:
```powershell
# En VPS
cd "C:\Apps\backend"
node server.js
# Verifica que dice "escuchando en http://localhost:4000"
```

### "CORS error" en consola del navegador

**Causa**: CORS_ORIGIN en `.env` no coincide con dominio del frontend.

**Solución**:
1. En VPS, abre `backend/.env`
2. Cambia:
   ```env
   CORS_ORIGIN=https://hosting-cliente.com
   ```
3. Reinicia backend (Ctrl+C, node server.js)

### "Cannot GET /api/servicios"

**Causa**: Backend no responde o ruta mal.

**Solución**:
1. Verifica en `backend/server.js` línea 12: existe la ruta `/api/servicios`
2. Reinicia backend
3. Test: `http://ip-vps:4000/api/servicios` en navegador

### Imágenes no cargan

**Causa**: Assets no subidas a hosting compartido.

**Solución**:
1. En cPanel, File Manager
2. Verifica que `public_html/assets/` existe
3. Si no, sube `assets.zip` y extrae

---

## ✅ CHECKLIST FINAL

Antes de decir "está listo":

- [ ] Backend corriendo en VPS en puerto 4000
- [ ] MySQL con BD `group_tqc` restaurada
- [ ] NSSM servicio GroupTQCBackend "SERVICE_RUNNING"
- [ ] Firewall puerto 4000 abierto
- [ ] Frontend en cPanel `public_html/`
- [ ] `api-base.js` apunta a IP/dominio real del VPS
- [ ] Assets/ en `public_html/assets/`
- [ ] Navegador: `https://hosting-cliente.com/` carga sin errores
- [ ] Datos reales aparecen (servicios, cursos, etc.)
- [ ] Console: sin errores CORS
- [ ] Test API: `https://ip-vps:4000/api/servicios` devuelve JSON

**Si TODO está checked → GO LIVE ✅**

---

## 📞 DURANTE PROBLEMAS

Si algo se quiebra post-go-live:

1. **Acceder rápido**:
   ```powershell
   # Conecta al VPS
   ssh usuario@ip-vps
   # O Remote Desktop
   ```

2. **Ver logs del backend**:
   ```powershell
   # En VPS
   cd "C:\Apps\backend"
   # Reinicia
   node server.js
   # Lee mensajes de error
   ```

3. **Restart backend**:
   ```powershell
   # Si usas NSSM
   cd "C:\tools\nssm-2.24-101-g897c7ad\win64"
   .\nssm restart GroupTQCBackend
   ```

4. **Ver MySQL**:
   ```powershell
   mysql -u root -p
   use group_tqc;
   select count(*) from servicios;
   # Verifica que hay datos
   ```
