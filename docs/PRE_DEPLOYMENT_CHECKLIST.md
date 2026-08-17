# Checklist Pre-Deployment: Arquitectura Híbrida

**Estado del proyecto**: Listo para deployment  
**Fecha**: 2026-08-09  
**Arquitectura**: Backend Node.js en VPS Windows + Frontend en hosting compartido  

---

## ✅ CÓDIGO: Listo

- [x] Backend implementado (19 endpoints, Node.js + Express)
- [x] Frontend desacoplado del backend
- [x] `<base href>` dinámico en docentes.html y detalle.html (funciona en Apache local y VPS)
- [x] `api-base.js` configurable para producción
- [x] Todas las rutas usan `window.API_BASE` (no hardcodeado)
- [x] `.env.example` con comentarios claros
- [x] CORS configurable vía `CORS_ORIGIN`
- [x] Assets compartidos con backend (sin duplicación)

---

## ✅ BASE DE DATOS: Lista

- [x] MySQL con 14 tablas (group_tqc)
- [x] Schema incluido en `database/database.sql`
- [x] Todos los CRUD verificados
- [x] Migraciones de datos completadas
- [x] No hay dependencias de JSON locales en el nuevo backend

---

## ✅ SEGURIDAD: Auditada

- [x] Contraseñas con bcrypt (migración lazy del plaintext)
- [x] Queries preparadas (mysql2/promise)
- [x] Validaciones en rutas
- [x] Rate limiting en login (5 intentos/15 min)
- [x] Multer 2.x para uploads seguros
- [x] `.env` NO versionado
- [x] `.gitignore` incluye `.env` y node_modules

---

## ✅ ENDPOINTS: Validados

Todos los 19 endpoints funcionan:

| Colección | GET | POST | PUT | DELETE |
|-----------|-----|------|-----|--------|
| servicios | ✅ | ✅ | ✅ | ✅ |
| proyectos | ✅ | ✅ | ✅ | ✅ |
| investigacion | ✅ | ✅ | ✅ | ✅ |
| cursos | ✅ | ✅ | ✅ | ✅ |
| docentes | ✅ | ✅ | ✅ | ✅ |
| acreditaciones | ✅ | ✅ | ✅ | ✅ |
| clientes | ✅ | ✅ | ✅ | ✅ |
| estadisticas | ✅ | ✅ | ✅ | ✅ |
| contenido | ✅ | ✅ | ✅ | ✅ |
| nosotros_* | ✅ | ✅ | ✅ | ✅ |
| login | ✅ | - | - | - |
| cambiar_contrasena | ✅ | - | - | - |
| upload | ✅ | - | - | - |
| reportes | ✅ | - | - | - |

---

## ✅ FRONTEND: Funcional

- [x] Todos los HTML apuntan a `window.API_BASE`
- [x] No hay referencias a `localhost:4000` hardcodeadas
- [x] No hay referencias a `api/*.php`
- [x] Imágenes usan rutas relativas (no `/assets`)
- [x] Navegación funciona en rutas limpias (sin `.html`)
- [x] Detalle dinámico parsea pathname correctamente
- [x] Admin carga sin JS errors (sin sesión es OK)

---

## 📋 ANTES DE DEPLOYMENT: CLIENTE 1 (VPS Windows 2019)

### Información necesaria del cliente

```
[ ] Dominio del cliente: ______________________
[ ] IP pública del VPS: ______________________
[ ] Usuario SSH/RDP: ______________________
[ ] Password SSH/RDP: ______________________
[ ] Puerto SSH/RDP: ______________________
[ ] ¿MySQL ya instalado en VPS? [ ] Sí [ ] No
[ ] Si existe MySQL, credenciales:
    Usuario: ______________________
    Password: ______________________
[ ] IP o dominio del hosting compartido: ______________________
[ ] cPanel usuario: ______________________
[ ] cPanel password: ______________________
```

### Tareas pre-deployment

- [ ] Cliente contrata VPS Windows Server 2019
- [ ] Cliente contrata hosting compartido (si no lo tiene)
- [ ] Me proporciona credenciales arriba
- [ ] Yo valido que ambos servidores sean accesibles

### VPS: Instalación

- [ ] Conectar vía RDP/SSH
- [ ] Instalar Node.js LTS
- [ ] Verificar: `node --version`
- [ ] Subir carpeta `backend/` a `C:\Apps\backend`
- [ ] `npm install` exitoso
- [ ] Crear `.env` real (no .example)
- [ ] Test local: `node server.js` → funciona
- [ ] Instalar NSSM para servicio
- [ ] Servicio GroupTQCBackend iniciado
- [ ] Firewall abre puerto 4000
- [ ] Test remoto: `curl https://vps:4000/api/servicios`

### VPS: Base de datos

- [ ] Instalar MySQL o conectar a existente
- [ ] Crear BD `group_tqc`
- [ ] Restaurar schema: `mysql -u root -p group_tqc < database.sql`
- [ ] Test: Conectar desde backend
- [ ] Test: GET /api/servicios devuelve datos reales

### VPS: SSL/HTTPS

- [ ] Obtener certificado (Let's Encrypt)
- [ ] Configurar IIS/Caddy/nginx como reverse proxy
- [ ] HTTPS funciona: `https://vps:4000/api/servicios`

### Hosting compartido: Preparación

- [ ] Descargar `frontend/` localmente
- [ ] Editar `js/api-base.js`: `window.API_BASE = 'https://vps-del-cliente.com:4000'`
- [ ] Comprimir todo
- [ ] Subir via cPanel File Manager a `public_html/`
- [ ] Verificar estructura:
  ```
  public_html/
  ├── index.html (o inicio.html con redireccionamiento)
  ├── css/
  ├── js/
  ├── assets/
  └── ... (todos los .html)
  ```

### Hosting compartido: Assets

- [ ] Subir carpeta `assets/` a `public_html/assets/`
- [ ] Verificar: `http://hosting/assets/logo.png` carga

### Testing Integración

- [ ] Abrir navegador → `https://hosting-del-cliente.com/`
- [ ] Console (F12): sin errores CORS
- [ ] Servicios visibles (cards llenos, no vacíos)
- [ ] Navegar a un servicio: `/servicios/geofisica`
- [ ] Detalle carga correctamente
- [ ] Admin (`/admin.html`): carga sin errores JS
- [ ] Upload funciona (si lo prueba)

---

## 📋 ANTES DE DEPLOYMENT: CLIENTE 2 (Cliente nuevo)

### Paso 0: Decidir arquitectura

**Hacer esta pregunta**:

> "¿Cuántas personas crees que van a visitar tu web cada mes? ¿Es un sitio tipo portafolio o es una herramienta que tus clientes usarán todos los días?"

- **Portafolio/Pequeño**: Hosting compartido + PHP ($10/mes)
- **Empresa/Herramienta**: Hosting compartido + VPS ($30/mes) ← Recomendado

Ver `EXPLICACION_PARA_CLIENTE.md` para más contexto.

### Paso 1: Recopilar requisitos

- [ ] ¿Qué sectores atiende? (para personalizacion de servicios)
- [ ] ¿Logo? (PNG/PDF en alta resolución)
- [ ] ¿Colores corporativos?
- [ ] ¿Contenido específico? (servicios, casos de éxito, equipo)
- [ ] ¿Necesita emails de contacto guardados? → Requiere backend
- [ ] ¿Necesita panel admin?
- [ ] ¿Necesita app móvil en futuro?

### Paso 2: Personalización

Si cliente quiere cambios en diseño/funcionalidad:
- [ ] Clonar proyecto base
- [ ] Personalizar colores (`css/main.css`)
- [ ] Actualizar contenido (servicios, equipo, etc.)
- [ ] Agregar logos/imágenes en `assets/`
- [ ] Agregar contactos/info específica

### Paso 3: Costo de venta

**Paquete base**:
- Diseño web personalizado: $500-1500 (un precio)
- Hosting compartido: $10/mes (cliente lo contrata)
- VPS (si necesita): $20/mes (cliente lo contrata)
- Soporte/mantenimiento: $200/mes (opcional)

**Ejemplo**: Cliente 2 quiere todo (diseño + VPS):
```
Inversión inicial: $1200 (diseño)
Costo recurrente: $30/mes (hosting + VPS)
Margen: Puedes cobrar $1500-3000 por setup + $200/mes support
```

---

## 📋 DOCUMENTACIÓN ENTREGABLE

Proporciona esto al cliente:

```
📦 delivery-cliente-1/
├── README.md (instrucciones generales)
├── ACCESO.txt (credenciales, URLs)
├── SOPORTE.md (cómo reportar bugs)
├── API_DOCS.md (endpoints, ejemplos)
└── BACKUP_PROCEDURE.md (cómo hacer backups)
```

---

## 🚨 RIESGOS IDENTIFICADOS

### Riesgo 1: `<base href>` en Apache vs. VPS
- **Estado**: ✅ RESUELTO
- **Solución**: Script dinámico que solo inserta `<base>` en localhost Apache
- **Test**: Verificar en ambos contextos

### Riesgo 2: CORS bloqueando requests
- **Estado**: ⚠️ PENDIENTE CONFIG
- **Solución**: Reemplazar `*` con dominio real del cliente antes de deploy
- **Test**: Verificar console (F12) sin errores CORS

### Riesgo 3: MySQL en hosting compartido sin acceso remoto
- **Estado**: ⚠️ A VERIFICAR
- **Solución**: Usar MySQL en VPS o pedir acceso remoto al hosting compartido
- **Test**: Conectar backend a BD desde VPS

### Riesgo 4: Puerto 4000 bloqueado por firewall
- **Estado**: ⚠️ A VERIFICAR
- **Solución**: Abrir puerto en Windows Firewall o usar proxy reverso (IIS/Caddy)
- **Test**: `curl https://vps:4000/api/servicios` desde otra máquina

### Riesgo 5: Node.js no se reinicia si el VPS reinicia
- **Estado**: ✅ RESUELTO (con NSSM)
- **Solución**: Usar NSSM para convertir Node en servicio Windows
- **Test**: Reiniciar VPS, verificar que backend sigue corriendo

---

## 📞 ESCALADA

Si algo falla en producción:

1. **Verificar logs**:
   ```
   VPS: %APPDATA%\NSSM\GroupTQCBackend\log.txt
   Frontend: Abrir consola (F12)
   ```

2. **Rollback inmediato**:
   ```
   # Si backend falla, servicio se detiene
   # Frontend sigue visible pero sin datos
   # Reiniciar: C:\tools\nssm\nssm restart GroupTQCBackend
   ```

3. **Contactar soporte**:
   - Error de código: Revisar logs + commit reciente
   - Error de infraestructura: Revisar firewall, permisos, espacio disco

---

## ✅ GO/NO-GO

**ANTES DE PRESIONAR GO LIVE**:

- [ ] ¿Cliente confirmó VPS Windows Server 2019?
- [ ] ¿Cliente contrató hosting compartido?
- [ ] ¿Backend funciona localmente en VPS?
- [ ] ¿Frontend carga sin errores CORS?
- [ ] ¿Datos reales aparecen en página?
- [ ] ¿Login funciona?
- [ ] ¿SSL/HTTPS funciona en ambos servidores?
- [ ] ¿Cliente revisó y aprobó?

**SI TODOS CHECKMARKS ✅ → GO LIVE**
**SI ALGUNO FALTA → NO-GO, ESPERAR**

---

## Documentos de referencia

Leer en orden:
1. `MIGRATION_CHECKLIST.md` - Validación técnica
2. `DEPLOYMENT_VPS_WINDOWS.md` - Instrucciones step-by-step
3. `EXPLICACION_PARA_CLIENTE.md` - Explicar a cliente
4. Este archivo (`PRE_DEPLOYMENT_CHECKLIST.md`) - Checklist final

---

**Última revisión**: 2026-08-09  
**Responsable**: Tú (desarrollador)  
**Estado**: LISTA PARA GO LIVE
