# ════════════════════════════════════════════════════════════════
# PREPARAR ARCHIVOS PARA DEPLOYMENT
# Ejecutar: .\PREPARE_DEPLOYMENT.ps1
# ════════════════════════════════════════════════════════════════

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  PREPARANDO ARCHIVOS PARA DEPLOYMENT                         ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

$rootDir = "c:\xampp\htdocs\Pagina web"
cd $rootDir

Write-Host "1. Limpiando archivos temporales..." -ForegroundColor Cyan
Remove-Item *.zip -Force -ErrorAction SilentlyContinue
Write-Host "✅ Limpio"
Write-Host ""

Write-Host "2. Comprimiendo backend..." -ForegroundColor Cyan
Compress-Archive -Path backend -DestinationPath backend.zip -Force
$size = (Get-Item backend.zip).Length / 1MB
Write-Host "✅ backend.zip ($([math]::Round($size, 2)) MB)"
Write-Host ""

Write-Host "3. Comprimiendo frontend..." -ForegroundColor Cyan
Compress-Archive -Path frontend -DestinationPath frontend.zip -Force
$size = (Get-Item frontend.zip).Length / 1MB
Write-Host "✅ frontend.zip ($([math]::Round($size, 2)) MB)"
Write-Host ""

Write-Host "4. Comprimiendo assets..." -ForegroundColor Cyan
Compress-Archive -Path assets -DestinationPath assets.zip -Force
$size = (Get-Item assets.zip).Length / 1MB
Write-Host "✅ assets.zip ($([math]::Round($size, 2)) MB)"
Write-Host ""

Write-Host "5. Copiando base de datos..." -ForegroundColor Cyan
Copy-Item "database\database.sql" database.sql -Force
Write-Host "✅ database.sql"
Write-Host ""

Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ ARCHIVOS LISTOS PARA DEPLOYMENT" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "Archivos generados:" -ForegroundColor Yellow
Write-Host "  • backend.zip" -ForegroundColor White
Write-Host "  • frontend.zip" -ForegroundColor White
Write-Host "  • assets.zip" -ForegroundColor White
Write-Host "  • database.sql" -ForegroundColor White
Write-Host "  • VPS_SETUP_INSTRUCTIONS.md" -ForegroundColor White
Write-Host ""
Write-Host "PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "  1. Sube estos archivos al VPS vía SFTP/FTP" -ForegroundColor White
Write-Host "  2. En VPS, ejecuta: VPS_SETUP_INSTRUCTIONS.md paso 1-11" -ForegroundColor White
Write-Host "  3. Testing final" -ForegroundColor White
Write-Host "  4. Go live!" -ForegroundColor White
Write-Host ""
