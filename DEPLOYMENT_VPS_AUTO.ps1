# ════════════════════════════════════════════════════════════════
# DEPLOYMENT AUTOMÁTICO: Group Total Quality Control
# VPS: Windows Server 2019
# Ejecutar como: Administrator en PowerShell
# ════════════════════════════════════════════════════════════════

Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  DEPLOYMENT AUTOMÁTICO - Group Total Quality Control        ║" -ForegroundColor Green
Write-Host "║  VPS Windows Server 2019                                    ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# ════ FASE 1: VERIFICAR PERMISOS ════
Write-Host "FASE 1: Verificando permisos Administrator..." -ForegroundColor Cyan
$currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object System.Security.Principal.WindowsPrincipal($currentUser)
if (-not $principal.IsInRole([System.Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "❌ ERROR: Debes ejecutar como Administrator" -ForegroundColor Red
    Write-Host "Click derecho en PowerShell → Ejecutar como administrador"
    exit 1
}
Write-Host "✅ Permisos correctos" -ForegroundColor Green
Write-Host ""

# ════ FASE 2: INSTALAR NODE.JS ════
Write-Host "FASE 2: Verificando Node.js..." -ForegroundColor Cyan
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js ya instalado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "⏳ Descargando Node.js LTS..." -ForegroundColor Yellow
    $nodeUrl = "https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi"
    $msiPath = "$env:TEMP\node-install.msi"
    Invoke-WebRequest -Uri $nodeUrl -OutFile $msiPath
    Write-Host "⏳ Instalando Node.js..." -ForegroundColor Yellow
    Start-Process msiexec.exe -ArgumentList "/i $msiPath /quiet" -Wait
    Write-Host "✅ Node.js instalado" -ForegroundColor Green
}
Write-Host ""

# ════ FASE 3: CREAR DIRECTORIO BACKEND ════
Write-Host "FASE 3: Preparando directorio de aplicación..." -ForegroundColor Cyan
if (-not (Test-Path "C:\Apps\backend")) {
    mkdir C:\Apps\backend -Force | Out-Null
    Write-Host "✅ Directorio C:\Apps\backend creado" -ForegroundColor Green
} else {
    Write-Host "✅ Directorio C:\Apps\backend existe" -ForegroundColor Green
}
Write-Host ""

# ════ FASE 4: VERIFICAR MYSQL ════
Write-Host "FASE 4: Verificando MySQL..." -ForegroundColor Cyan
$mysqlCheck = Get-Service -Name MySQL* -ErrorAction SilentlyContinue
if ($mysqlCheck) {
    Write-Host "✅ MySQL detectado" -ForegroundColor Green
} else {
    Write-Host "⚠️  MySQL no instalado. Descargando..." -ForegroundColor Yellow
    $mysqlUrl = "https://dev.mysql.com/get/mysql-installer-community-8.0.36.0.msi"
    $msiPath = "$env:TEMP\mysql-install.msi"
    Invoke-WebRequest -Uri $mysqlUrl -OutFile $msiPath
    Write-Host "⏳ Instalando MySQL (requiere interacción)..." -ForegroundColor Yellow
    Start-Process $msiPath -Wait
    Write-Host "⚠️  Completa la instalación de MySQL en el wizard que aparecerá" -ForegroundColor Yellow
}
Write-Host ""

# ════ FASE 5: INSTRUCCIONES FINALES ════
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ FASE 1-4 COMPLETADA" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "PRÓXIMOS PASOS (Manual):" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. ESPERAR a que el desarrollador suba backend/ vía SFTP/FTP a:" -ForegroundColor Yellow
Write-Host "   C:\Apps\backend" -ForegroundColor White
Write-Host ""
Write-Host "2. UNA VEZ SUBIDO, ejecutar en PowerShell:" -ForegroundColor Yellow
Write-Host "   cd C:\Apps\backend" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor White
Write-Host ""
Write-Host "3. LUEGO crear .env con:" -ForegroundColor Yellow
Write-Host "   notepad .env" -ForegroundColor White
Write-Host "   (Pegar contenido que el dev proporcionará)" -ForegroundColor White
Write-Host ""
Write-Host "4. RESTAURAR base de datos MySQL:" -ForegroundColor Yellow
Write-Host "   mysql -u root -p group_tqc < database.sql" -ForegroundColor White
Write-Host ""
Write-Host "5. INSTALAR NSSM (servicio automático):" -ForegroundColor Yellow
Write-Host "   cd C:\tools" -ForegroundColor White
Write-Host "   (Seguir instrucciones que el dev proporcionará)" -ForegroundColor White
Write-Host ""
Write-Host "6. ABRIR FIREWALL puerto 4000:" -ForegroundColor Yellow
Write-Host "   New-NetFirewallRule -DisplayName 'Node.js 4000' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 4000" -ForegroundColor White
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "Esperando siguiente instrucción del desarrollador..." -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Green
