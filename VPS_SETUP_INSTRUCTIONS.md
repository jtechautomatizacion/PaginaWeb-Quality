# 🚀 SETUP VPS - Instrucciones Paso a Paso

**VPS**: 82.39.109.180  
**Usuario**: Administrator  
**Dominio**: grouptqualityc.com.pe

---

## PASO 1: Ejecutar Script de Setup (5 min)

En el VPS, abre **PowerShell como Administrator** y copia/pega:

```powershell
# Descarga el script de setup
$url = "https://raw.githubusercontent.com/grouptqc/deploy/main/DEPLOYMENT_VPS_AUTO.ps1"
$script = "$env:TEMP\deploy.ps1"
Invoke-WebRequest -Uri $url -OutFile $script
& $script
```

**O manualmente**:
1. Abre PowerShell como Admin
2. Instala Node.js: `choco install nodejs -y` (si tienes Chocolatey)
3. Instala MySQL si no está
4. Crea directorio: `mkdir C:\Apps\backend`

---

## PASO 2: Subir Backend vía FTP/SFTP (10 min)

**Tu máquina local**:
```powershell
cd "c:\xampp\htdocs\Pagina web"
# Comprime backend
Compress-Archive -Path backend -DestinationPath backend.zip

# Sube backend.zip al VPS:
# - Usuario FTP: [pedir al host]
# - Destino: C:\Apps\backend\
# - Extrae allí
```

**O vía SFTP**:
```bash
sftp Administrator@82.39.109.180
put -r backend /Apps/
```

---

## PASO 3: Instalar Dependencias en VPS (5 min)

En VPS PowerShell:
```powershell
cd C:\Apps\backend
npm install
```

---

## PASO 4: Crear .env en VPS (2 min)

En VPS PowerShell:
```powershell
notepad C:\Apps\backend\.env
```

**Pega esto**:
```env
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=group_tqc
DB_USER=root
DB_PASSWORD=[tu_password_mysql]
CORS_ORIGIN=https://grouptqualityc.com.pe
NODE_ENV=production
```

Reemplaza `[tu_password_mysql]` con tu password real de MySQL.

---

## PASO 5: Restaurar Base de Datos (5 min)

En VPS PowerShell:
```powershell
cd C:\Apps\backend
mysql -u root -p group_tqc < ..\database\database.sql
```

Ingresa password de MySQL cuando pregunte.

---

## PASO 6: Instalar NSSM (Servicio Automático) (10 min)

En VPS PowerShell como Admin:

```powershell
# Descarga NSSM
cd C:\tools
Invoke-WebRequest -Uri "https://nssm.cc/release/nssm-2.24-101-g897c7ad.zip" -OutFile nssm.zip
Expand-Archive nssm.zip -DestinationPath .

# Instala servicio
$nssm = "C:\tools\nssm-2.24-101-g897c7ad\win64\nssm.exe"
& $nssm install GroupTQCBackend "C:\Program Files\nodejs\node.exe" "C:\Apps\backend\server.js"
& $nssm set GroupTQCBackend AppDirectory "C:\Apps\backend"

# Inicia servicio
& $nssm start GroupTQCBackend

# Verifica
& $nssm status GroupTQCBackend
# Debe mostrar: SERVICE_RUNNING
```

---

## PASO 7: Abrir Firewall Puerto 4000 (2 min)

En VPS PowerShell como Admin:
```powershell
New-NetFirewallRule -DisplayName "Node.js Backend 4000" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 4000
```

---

## PASO 8: Test Backend Funciona (3 min)

En VPS, abre navegador y ve a:
```
http://localhost:4000/api/servicios
```

Debe mostrar JSON con 7 servicios.

---

## PASO 9: SSL/HTTPS (15 min)

**Opción A: Si tienes dominio con Let's Encrypt**
```powershell
# Descarga certbot
choco install certbot -y

# Obtén certificado
certbot certonly --standalone -d grouptqualityc.com.pe
```

**Opción B: Si usas un certificado existente**
Configura en IIS o Nginx como proxy reverso.

---

## PASO 10: Subir Frontend a cPanel (10 min)

**Tu máquina local**:
```powershell
cd "c:\xampp\htdocs\Pagina web\frontend"

# Edita api-base.js
notepad js\api-base.js
# Cambia: window.API_BASE = 'https://82.39.109.180:4000'

# Comprime todo
Compress-Archive -Path . -DestinationPath frontend.zip
```

**En cPanel**:
1. Ve a: https://cpanel.grouptqualityc.com.pe/
2. Usuario: grouptqu
3. File Manager → public_html
4. Upload: frontend.zip
5. Extract
6. Upload: assets.zip (si no está)
7. Extract

---

## PASO 11: Test Frontend Carga (5 min)

Abre navegador:
```
https://grouptqualityc.com.pe/
```

- Sin errores CORS (F12 → Console)
- Datos aparecen (servicios visibles)
- Fotos cargan
- Navegación funciona

---

## ✅ GO LIVE

Si todos los tests pasaron:

```
1. ✅ Backend responde
2. ✅ Frontend carga
3. ✅ Datos aparecen
4. ✅ No hay errores

→ Sitio LIVE en https://grouptqualityc.com.pe
```

---

## 🚨 Troubleshooting

### Backend no inicia
```powershell
cd C:\Apps\backend
node server.js
# Lee el error y reporta
```

### CORS error
En .env:
```
CORS_ORIGIN=https://grouptqualityc.com.pe
```
Restart: `nssm restart GroupTQCBackend`

### 404 en assets
En cPanel, verifica que `public_html/assets/` existe.

### Puerto 4000 bloqueado
```powershell
netstat -ano | findstr :4000
# Si algo usa el puerto, mata el proceso
taskkill /PID [numero] /F
```

---

## 📞 Contacto

Si hay problemas durante setup, contacta al desarrollador con:
- Error exacto (copia/pega de PowerShell)
- Qué paso estabas haciendo
- Screenshot si es necesario

**Status**: Listo para deployment. Espera instrucciones del desarrollador.
