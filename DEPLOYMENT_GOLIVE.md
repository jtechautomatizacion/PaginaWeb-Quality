# 🚀 GO LIVE: grouptqualityc.com.pe

**Estado**: LISTO PARA DEPLOYMENT EN VIVO  
**VPS**: 82.39.109.180  
**cPanel**: https://cpanel.grouptqualityc.com.pe/  
**Usuario cPanel**: grouptqu  
**Dominio**: grouptqualityc.com.pe

---

## 📋 FASES DEL DEPLOYMENT

### **FASE 1: VPS BACKEND (3 horas)**

**1.1 Conectar VPS**
```
IP: 82.39.109.180
Usuario: Administrator
Password: [tu password]
Método: Remote Desktop
```

**1.2 Preparar VPS**
- [ ] Abrir PowerShell como Admin
- [ ] Instalar Node.js (si no está)
- [ ] Verificar MySQL instalado
- [ ] Crear directorio C:\Apps\backend

**1.3 Subir Backend via SFTP**
- [ ] Subir backend.zip a C:\Apps\backend\
- [ ] Extraer
- [ ] Ejecutar: `npm install`

**1.4 Configurar Base de Datos**
- [ ] Subir database.sql
- [ ] Ejecutar: `mysql -u root -p group_tqc < database.sql`

**1.5 Configurar .env**
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

**1.6 Instalar NSSM (Servicio)**
```powershell
# Descarga NSSM
$nssm = "C:\tools\nssm-2.24-101-g897c7ad\win64\nssm.exe"
& $nssm install GroupTQCBackend "C:\Program Files\nodejs\node.exe" "C:\Apps\backend\server.js"
& $nssm start GroupTQCBackend
& $nssm status GroupTQCBackend  # Debe decir: SERVICE_RUNNING
```

**1.7 Abrir Firewall**
```powershell
New-NetFirewallRule -DisplayName "Node.js 4000" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 4000
```

**1.8 Test Backend**
```
Abrir navegador en VPS:
http://localhost:4000/api/servicios
Debe mostrar: JSON con 7 servicios ✅
```

---

### **FASE 2: FRONTEND CPANEL (1 hora)**

**2.1 Preparar Frontend**
En tu máquina local:
```powershell
cd frontend
# Editar js/api-base.js
# Cambiar: window.API_BASE = 'https://82.39.109.180:4000'
```

**2.2 Conectar a cPanel**
```
URL: https://cpanel.grouptqualityc.com.pe/
Usuario: grouptqu
Password: [password]
```

**2.3 Subir Frontend**
- [ ] File Manager → public_html
- [ ] Upload: frontend.zip
- [ ] Extract
- [ ] Upload: assets.zip
- [ ] Extract

**2.4 Verificar Estructura**
```
public_html/
├── index.html (o inicio.html)
├── css/main.css
├── js/api-base.js (apunta a VPS ✅)
├── assets/
│   ├── logos/
│   ├── clientes/
│   ├── uploads/
│   └── ...
└── ... (otros .html)
```

**2.5 Verificar DNS**
```
grouptqualityc.com.pe
Apunta a: IP del hosting compartido ✅
```

---

### **FASE 3: TESTING (30 min)**

**3.1 Test Backend Remoto**
```bash
curl https://82.39.109.180:4000/api/servicios
# Debe devolver JSON ✅
```

**3.2 Test Frontend Carga**
```
https://grouptqualityc.com.pe/
Abrir F12 → Console
Sin errores CORS rojos ✅
```

**3.3 Test Datos Aparecen**
```
- Homepage carga
- Servicios visibles (7 cards)
- Click en servicio → /servicios/slug
- Detalle del servicio aparece ✅
```

**3.4 Test Admin**
```
https://grouptqualityc.com.pe/admin.html
Usuario: admin
Password: admin
Panel admin carga sin errores ✅
```

**3.5 Test Fotos**
```
F12 → Network
Buscar requests a /assets/
Todos deben ser 200 ✅
```

---

## ✅ CHECKLIST GO-LIVE

### Antes de publicar

- [ ] Backend VPS conectando a MySQL
- [ ] Backend responde en puerto 4000
- [ ] Frontend cargando desde cPanel
- [ ] api-base.js apunta a VPS real
- [ ] CORS configurado para grouptqualityc.com.pe
- [ ] SSL/HTTPS funcionando en VPS
- [ ] SSL/HTTPS funcionando en cPanel
- [ ] Datos reales en página (no vacíos)
- [ ] Navegación limpia
- [ ] Fotos cargan
- [ ] Admin funciona

### Durante el deployment

- [ ] Documenta cualquier error exacto
- [ ] Nota los pasos que toman tiempo
- [ ] Verifica cada test antes de continuar

### Después de go-live

- [ ] Cliente verifica que ve su sitio
- [ ] Cliente confirma datos son correctos
- [ ] Cambiar password admin (opcional)
- [ ] Monitoreo: UptimeRobot para alertas
- [ ] Backup automático (configurar si es posible)

---

## 🚨 EMERGENCY CONTACTS

Si algo falla:

**Backend no inicia**
```powershell
cd C:\Apps\backend
node server.js
# Lee el error exacto
```

**CORS error en navegador**
En VPS .env:
```
CORS_ORIGIN=https://grouptqualityc.com.pe
nssm restart GroupTQCBackend
```

**Port 4000 ocupado**
```powershell
netstat -ano | findstr :4000
taskkill /PID [numero] /F
```

**404 en assets**
En cPanel, verifica que public_html/assets/ existe.

---

## 📊 DEPLOYMENT STATUS

**Codebase**: ✅ AUDITED & CLEANED  
**Backend**: ✅ READY  
**Frontend**: ✅ READY  
**Database**: ✅ READY  
**Documentation**: ✅ COMPLETE  

**Status**: ✅ **READY FOR GO-LIVE**

---

## 🎯 TIMELINE

| Fase | Tiempo |
|------|--------|
| VPS Setup | 3 horas |
| Frontend Upload | 30 min |
| Testing | 30 min |
| **Total** | **4 horas** |

---

**Esperando tu confirmación para comenzar deployment.**
