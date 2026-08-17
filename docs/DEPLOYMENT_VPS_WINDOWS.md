# Deployment: Arquitectura Híbrida (VPS Windows + Hosting Compartido)

## Resumen
- **Backend (Node.js + Express)** → VPS Windows Server 2019
- **Frontend (HTML/CSS/JS estático)** → Hosting compartido (cPanel)
- **Base de datos (MySQL)** → VPS o hosting compartido con acceso remoto

---

## PARTE 1: Backend en VPS Windows Server 2019

### 1.1 Instalación de Node.js

1. Descarga Node.js LTS desde: https://nodejs.org/ (recomendado 18.x o superior)
2. Ejecuta el instalador `.msi` en Windows Server
3. Elige "Add to PATH" durante la instalación
4. Abre PowerShell y verifica:
   ```powershell
   node --version
   npm --version
   ```

### 1.2 Preparar el backend en el VPS

1. Sube la carpeta `backend/` a tu VPS (via FTP/SFTP o Git)
   ```bash
   # Ubicación recomendada: C:\Apps\backend\
   ```

2. Instala dependencias:
   ```powershell
   cd C:\Apps\backend
   npm install
   ```

3. Crea `.env` basado en `.env.example`:
   ```
   PORT=4000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=group_tqc
   DB_USER=root
   DB_PASSWORD=TuPasswordReal
   CORS_ORIGIN=https://hosting-del-cliente.com
   NODE_ENV=production
   ```

### 1.3 Prueba local en VPS

```powershell
cd C:\Apps\backend
node server.js
# Debe mostrarse: API backend escuchando en http://localhost:4000
```

Abre navegador → `http://localhost:4000/api/servicios` y verifica que devuelve JSON.

### 1.4 Instalar Node.js como servicio en Windows (NSSM)

Para que Node.js corra permanentemente incluso después de reiniciar:

1. Descarga NSSM: https://nssm.cc/download
2. Extrae `nssm.exe` a `C:\tools\nssm\`
3. Abre PowerShell como Administrador:
   ```powershell
   C:\tools\nssm\nssm install GroupTQCBackend "C:\Program Files\nodejs\node.exe" "C:\Apps\backend\server.js"
   C:\tools\nssm\nssm set GroupTQCBackend AppDirectory "C:\Apps\backend"
   C:\tools\nssm\nssm set GroupTQCBackend AppEnvironmentExtra "NODE_ENV=production"
   C:\tools\nssm\nssm start GroupTQCBackend
   ```

4. Verifica que el servicio está corriendo:
   ```powershell
   C:\tools\nssm\nssm status GroupTQCBackend
   ```

### 1.5 Firewall: Abre puerto 4000

En Windows Firewall:
1. `Settings` → `Privacy & Security` → `Windows Defender Firewall`
2. `Allow an app through firewall`
3. Añade o crea una regla:
   - Programa: `C:\Program Files\nodejs\node.exe`
   - Puertos: `4000` (TCP)
   - Permitir de: Internet

O via PowerShell (como Admin):
```powershell
New-NetFirewallRule -DisplayName "Node.js Backend 4000" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 4000
```

### 1.6 SSL/HTTPS: Certificado Let's Encrypt (recomendado)

Para que funcione desde HTTPS (obligatorio en producción):

**Opción A: Usar IIS con Node.js (proxy reverso)**

1. Instala IIS en Windows Server
2. Configura un sitio proxy que apunte a `http://localhost:4000`
3. Usa certificado SSL en IIS (Let's Encrypt vía `Certbot` o panel de hosting)

**Opción B: Usar Caddy (más simple)**

1. Descarga Caddy: https://caddyserver.com/download
2. Crea `Caddyfile`:
   ```
   vps-del-cliente.com {
       reverse_proxy localhost:4000
   }
   ```
3. Ejecuta como servicio (similar a NSSM)

**Opción C: Usar un certificado wildcard (si tenés subdominio)**

Pide un certificado wildcard a tu proveedor de hosting/VPS.

---

## PARTE 2: Frontend en Hosting Compartido (cPanel)

### 2.1 Preparar archivos frontend

En tu máquina local, entra en `frontend/js/api-base.js` y asegúrate de:

```javascript
window.API_BASE = 'https://vps-del-cliente.com:4000';
```

Reemplaza `vps-del-cliente.com` con el dominio/IP real del VPS.

### 2.2 Subir a hosting compartido

1. Comprime la carpeta `frontend/` completamente
2. Entra a cPanel del cliente
3. **File Manager** → navega a `public_html`
4. Sube y extrae los archivos
5. Verifica que exista `public_html/index.html`

### 2.3 Verificar rutas

- `http://hosting-del-cliente.com/` → debe mostrar `inicio.html`
- `http://hosting-del-cliente.com/servicios_publico.html` → debe cargar

Si obtienes 404, es probable que la estructura de carpetas sea incorrecta. Los archivos deben estar **directamente en `public_html/`**, no en una subcarpeta.

### 2.4 Verifica que las imágenes carguen

Entra a cPanel → **File Manager** → sube también la carpeta `assets/` a `public_html/assets/`.

O, si tienes acceso SSH al hosting compartido:
```bash
cd public_html
cp -r /ruta/a/assets . 
```

---

## PARTE 3: Sincronización de MySQL

### Opción A: MySQL en el VPS (recomendado)

1. Instala MySQL en Windows Server 2019
2. En `backend/.env`:
   ```
   DB_HOST=localhost
   DB_NAME=group_tqc
   DB_USER=root
   DB_PASSWORD=TuPassword
   ```
3. Restaura la BD desde el dump:
   ```powershell
   mysql -u root -p group_tqc < database/database.sql
   ```

### Opción B: MySQL en hosting compartido con acceso remoto

1. Hosting compartido debe permitir conexiones remotas (cPanel: `Databases` → `Remote MySQL Databases`)
2. En `backend/.env`:
   ```
   DB_HOST=ip-del-hosting-compartido
   DB_USER=usuario_remoto
   DB_PASSWORD=password_remoto
   ```

**IMPORTANTE**: La conexión remota debe estar abierta en firewall del hosting/VPS.

---

## PARTE 4: Testing de la arquitectura

### Test 1: ¿Funciona el backend desde VPS?
```bash
curl -X GET "https://vps-del-cliente.com:4000/api/servicios"
# Debe devolver JSON con servicios
```

### Test 2: ¿El frontend carga?
```
https://hosting-del-cliente.com/inicio.html
# Abre en navegador → verifica console (F12) sin errores CORS
```

### Test 3: ¿Los datos aparecen?
- Ve a inicio.html
- Abre DevTools (F12) → Console
- No debe haber errores rojos
- Las tarjetas de servicios deben estar llenas (no vacías)

### Test 4: ¿Las rutas funciona?
- Navega a un servicio desde la web
- URL debe cambiar a algo como: `https://hosting-del-cliente.com/servicios/geofisica`
- Debe mostrar el detalle del servicio

---

## PARTE 5: Troubleshooting

### Error: "Failed to fetch" en consola del navegador

**Causa**: Problema de CORS o backend no está activo.

**Solución**:
1. Verifica que backend está corriendo: `http://vps-del-cliente.com:4000/api/servicios`
2. En `backend/.env`, asegúrate:
   ```
   CORS_ORIGIN=https://hosting-del-cliente.com
   ```
3. Reinicia el servicio Node.js

### Error: "404 Not Found" en API

**Causa**: Endpoint no existe o está mal escrito.

**Solución**:
1. Ve a `backend/routes/` y verifica que exista la ruta
2. En consola del navegador (F12), mira la URL exacta que se está llamando
3. Compara con `backend/server.js` line 12-27

### Imágenes no cargan

**Causa**: Ruta relativa rota.

**Solución**:
1. En hosting compartido, verifica que `public_html/assets/` existe
2. En imágenes dinámicas (de API), verifica que `api/upload` guarda en carpeta compartida

---

## PARTE 6: Mantenimiento y Seguridad

### Actualizar backend

1. SSH al VPS:
   ```bash
   cd C:\Apps\backend
   git pull  # si usas Git
   npm install  # instala dependencias nuevas si las hay
   ```
2. Reinicia servicio:
   ```powershell
   C:\tools\nssm\nssm restart GroupTQCBackend
   ```

### Monitoreo

Instala monitoreo para saber si Node.js cae:
- **PM2**: `npm install -g pm2` (más directo que NSSM)
- **Azure Monitor** / **CloudWatch**: si usas cloud

### Backup

1. Backup de `.env` (guarda en lugar seguro, NO en Git)
2. Backup de MySQL:
   ```bash
   mysqldump -u root -p group_tqc > backup_$(date +%Y%m%d).sql
   ```
3. Backup de `backend/` en Git (excepto `.env`)

---

## Checklist de Deployment

- [ ] Node.js instalado en VPS (verificar versión)
- [ ] Carpeta `backend/` subida a VPS
- [ ] `npm install` ejecutado exitosamente
- [ ] `.env` configurado con credenciales reales
- [ ] Backend prueba localmente en VPS (`node server.js`)
- [ ] NSSM (o PM2) configurado para iniciar automáticamente
- [ ] Firewall abre puerto 4000
- [ ] SSL/HTTPS funciona (IIS/Caddy/Certbot)
- [ ] MySQL restaurado o configurado en VPS
- [ ] `api/upload` apunta a carpeta compartida (si es necesario)
- [ ] `frontend/js/api-base.js` apunta a `https://vps-del-cliente.com:4000`
- [ ] Carpeta `frontend/` subida a hosting compartido
- [ ] Carpeta `assets/` sincronizada con hosting compartido
- [ ] Frontend carga sin errores CORS en consola
- [ ] Datos reales aparecen (no vacíos)
- [ ] Certificados SSL en ambos servidores

---

## URLs Finales para el Cliente

**Sitio público**:
```
https://hosting-del-cliente.com/
```

**Panel administrativo** (si tiene IP fija, restringir acceso):
```
https://hosting-del-cliente.com/admin.html
```

**API** (solo para terceros o apps):
```
https://vps-del-cliente.com:4000/api/...
```
