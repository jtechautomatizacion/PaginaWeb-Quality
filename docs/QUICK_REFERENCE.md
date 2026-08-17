# Quick Reference: Comandos y URLs Esenciales

Guarda esto como favorito. Lo usarás frecuentemente.

---

## 🖥️ DESARROLLO LOCAL

### Iniciar todo

**Terminal 1** (Backend):
```powershell
cd "c:\xampp\htdocs\Pagina web\backend"
node server.js
```

**Terminal 2** (Frontend):
```powershell
cd "c:\xampp\htdocs\Pagina web\frontend"
node serve.js
```

### URLs locales

| Recurso | URL |
|---------|-----|
| Frontend | `http://localhost:8080` |
| Backend API | `http://localhost:4000/api/...` |
| Inicio | `http://localhost:8080/inicio.html` |
| Admin | `http://localhost:8080/admin.html` |
| Servicios | `http://localhost:8080/servicios_publico.html` |

### Test API en PowerShell

```powershell
# GET servicios
$resp = Invoke-WebRequest -Uri "http://localhost:4000/api/servicios"
$resp.Content | ConvertFrom-Json | Format-Table

# GET docentes
$resp = Invoke-WebRequest -Uri "http://localhost:4000/api/docentes"
$resp.Content | ConvertFrom-Json | Format-Table

# GET login (verificar esquema)
$resp = Invoke-WebRequest -Uri "http://localhost:4000/api/login" -Method POST `
  -Headers @{'Content-Type'='application/json'} `
  -Body '{"usuario":"admin","contrasena":"admin"}'
$resp.Content
```

---

## 🖧 VPS WINDOWS SERVER (CLIENTE)

### Conectar al VPS

```powershell
# Opción 1: Remote Desktop (GUI)
mstsc  # Abre Remote Desktop Connection
# Ingresa: ip-vps
# Usuario: usuario_rdc
# Password: password_rdc

# Opción 2: SSH (CLI)
ssh usuario@ip-vps
```

### Backend en VPS

```powershell
# Instalar Node (una sola vez)
# → Descarga desde nodejs.org
# → Ejecuta .msi
# → Marca "Add to PATH"

# Instalar dependencias
cd "C:\Apps\backend"
npm install

# Iniciar manualmente (testing)
node server.js
# Debe decir: "API backend escuchando en http://localhost:4000"

# Ver logs si falla
node server.js 2>&1 | Tee-Object -FilePath "backend.log"
```

### NSSM (servicio automático)

```powershell
# Descargar NSSM (una sola vez)
cd "C:\tools"
Invoke-WebRequest -Uri "https://nssm.cc/release/nssm-2.24-101-g897c7ad.zip" `
  -OutFile "nssm.zip"
Expand-Archive nssm.zip -DestinationPath .

# Crear servicio
$nssm = "C:\tools\nssm-2.24-101-g897c7ad\win64\nssm.exe"
& $nssm install GroupTQCBackend "C:\Program Files\nodejs\node.exe" "C:\Apps\backend\server.js"
& $nssm set GroupTQCBackend AppDirectory "C:\Apps\backend"

# Controlar servicio
& $nssm start GroupTQCBackend      # Inicia
& $nssm stop GroupTQCBackend       # Para
& $nssm restart GroupTQCBackend    # Reinicia
& $nssm status GroupTQCBackend     # Ver estado

# Eliminar servicio (si necesitas reconfigurar)
& $nssm remove GroupTQCBackend confirm
```

### MySQL en VPS

```powershell
# Conectar a MySQL
mysql -u root -p
# Ingresa password

# Comandos útiles (dentro de MySQL)
show databases;                      # Ver todas las BDs
use group_tqc;                       # Entrar a BD
show tables;                         # Ver tablas
select count(*) from servicios;      # Contar registros
select * from usuarios;              # Ver usuarios
exit;                                # Salir
```

### Firewall

```powershell
# Abrir puerto 4000 (backend)
New-NetFirewallRule -DisplayName "Node.js Backend 4000" `
  -Direction Inbound -Action Allow -Protocol TCP -LocalPort 4000

# Ver reglas
Get-NetFirewallRule -DisplayName "*Node*"

# Eliminar regla
Remove-NetFirewallRule -DisplayName "Node.js Backend 4000"
```

### Variables de entorno (.env)

Ubicación: `C:\Apps\backend\.env`

```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=group_tqc
DB_USER=root
DB_PASSWORD=password_real
CORS_ORIGIN=https://hosting-cliente.com
NODE_ENV=production
```

Editar:
```powershell
notepad "C:\Apps\backend\.env"
```

---

## 🌐 HOSTING COMPARTIDO (cPanel)

### Acceso

```
URL: http://hosting-cliente.com:2083
Usuario: usuario_cpanel
Password: password_cpanel
```

### Subir frontend

1. cPanel → File Manager
2. Navega a `public_html/`
3. Upload → `frontend.zip`
4. Extract
5. Upload → `assets.zip`
6. Extract

### Estructura esperada

```
public_html/
├── index.html (o redirect a inicio.html)
├── inicio.html
├── servicios_publico.html
├── admin.html
├── css/main.css
├── js/api-base.js      ← EDIT ESTO para producción
├── js/*.js
├── assets/
│   ├── logo.png
│   ├── clientes/
│   └── uploads/
```

### Configurar API_BASE

Editar via cPanel:

1. File Manager → `public_html/js/api-base.js`
2. Edit
3. Cambia:
```javascript
window.API_BASE = 'https://ip-vps:4000';
// O con dominio:
// window.API_BASE = 'https://vps.dominio-cliente.com:4000';
```
4. Save

---

## 🧪 TESTING

### ¿Frontend carga?

```
URL: https://hosting-cliente.com/inicio.html
Esperado: Ve página
DevTools (F12) → Console: sin errores CORS rojos
```

### ¿Backend responde?

**Desde tu máquina**:
```powershell
$resp = Invoke-WebRequest -Uri "https://ip-vps:4000/api/servicios" -Method GET
$resp.Content | ConvertFrom-Json
# Debe devolver JSON con servicios
```

**Desde VPS mismo**:
```powershell
# En VPS
curl http://localhost:4000/api/servicios
# Debe devolver JSON
```

### ¿Datos aparecen?

```
1. Abre https://hosting-cliente.com/
2. F12 → Console
3. Sin errores CORS/fetch
4. Página muestra servicios/cursos/estadísticas reales
```

### ¿Login funciona?

```
1. Abre https://hosting-cliente.com/admin.html
2. Ingresa: usuario=admin, password=admin (por defecto)
3. Debe entrar al panel admin
```

---

## 🐛 DEBUGGING

### Backend no inicia

```powershell
cd "C:\Apps\backend"

# Ver errores detallados
node server.js

# Si dice "port already in use"
netstat -ano | findstr :4000
taskkill /PID [PID] /F
node server.js
```

### CORS error en navegador

1. Abre DevTools (F12)
2. Console: busca "CORS" o "Access-Control-Allow-Origin"
3. Significa: CORS_ORIGIN en `.env` no coincide con tu hosting

**Solución**:
```
En VPS, backend/.env:
CORS_ORIGIN=https://hosting-cliente.com

Reinicia backend:
node server.js (o NSSM restart)
```

### MySQL no conecta

```powershell
# En VPS, verifica que MySQL está corriendo
Get-Service -Name MySQL* | Select Name, Status

# Si no está, inicia
Start-Service -Name "MySQL80"  # (cambia versión si es otra)

# Verifica conexión
mysql -u root -p
# Debe conectar sin error
```

### Imágenes no cargan

```
1. Abre DevTools → Network
2. Busca requests a /assets/
3. Si son 404:
   - En cPanel, verifica que assets/ existe en public_html/
   - Si no, sube assets.zip y extrae
```

---

## 📊 MONITOREO

### Ver servicios Windows

```powershell
Get-Service | Where-Object {$_.Name -like "*node*" -or $_.Name -like "*mysql*"}
```

### Ver procesos Node

```powershell
Get-Process | Where-Object {$_.Name -like "*node*"}
```

### Ver puertos en uso

```powershell
netstat -ano | findstr :4000   # Backend
netstat -ano | findstr :3306   # MySQL
```

### Logs de NSSM

```powershell
$nssm = "C:\tools\nssm-2.24-101-g897c7ad\win64\nssm.exe"
& $nssm get GroupTQCBackend AppStderr
& $nssm get GroupTQCBackend AppStdout
```

---

## 🔒 SEGURIDAD

### Cambiar contraseña admin

```
1. Abre admin.html
2. Login con admin/admin
3. Perfil → Cambiar contraseña
4. Ingresa nueva password
5. Guarda
```

### Backup de .env

```powershell
# En VPS, guarda copia segura
Copy-Item "C:\Apps\backend\.env" "C:\backup\env_2026-08-09.txt"
```

### Backup de MySQL

```powershell
# En VPS
mysqldump -u root -p group_tqc > "C:\backup\db_2026-08-09.sql"
# Ingresa password de MySQL
```

---

## 📞 CHEAT SHEET RÁPIDO

| Qué quiero | Comando |
|-----------|---------|
| Iniciar backend local | `cd backend && node server.js` |
| Iniciar frontend local | `cd frontend && node serve.js` |
| Test API | `curl http://localhost:4000/api/servicios` |
| Ver logs VPS | SSH a VPS, `cd C:\Apps\backend`, `node server.js` |
| Restart backend VPS | `nssm restart GroupTQCBackend` |
| Ver MySQL | `mysql -u root -p`, `show tables;` |
| Backup DB | `mysqldump -u root -p group_tqc > backup.sql` |
| Editar .env | `notepad "C:\Apps\backend\.env"` |
| Abrir firewall | `New-NetFirewallRule -DisplayName "Node 4000" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 4000` |
| Ver puertos | `netstat -ano \| findstr :4000` |

---

**Guarda este archivo como favorito en tu editor. Lo usarás constantemente.**
