#Requires -Version 5.1
<#
.SYNOPSIS
    Construye las imágenes Docker del backend y del frontend de PruebasOpenCode1.

.DESCRIPTION
    Lee deploy/docker/.env.<entorno> para obtener las credenciales que se
    incrustan en el bundle del frontend y permite publicar en un registro.

.EXAMPLE
    .\deploy\docker\construir.ps1 -Entorno pre

.EXAMPLE
    .\deploy\docker\construir.ps1 -Entorno pro -Registro ghcr.io/pedrojaen
#>
param(
    [ValidateSet('pre', 'pro')]
    [string]$Entorno = 'pre',

    [string]$Registro = ''
)

$ErrorActionPreference = 'Stop'
$directorio = $PSScriptRoot
$raiz = (Resolve-Path (Join-Path $directorio '..\..')).Path
$ficheroEnv = Join-Path $directorio ".env.$Entorno"

if (-not (Test-Path $ficheroEnv)) {
    throw "No existe $ficheroEnv. Copia .env.$Entorno.example y cambia los secretos."
}

# Carga el fichero .env en el proceso para pasarlo como --build-arg.
Get-Content $ficheroEnv | ForEach-Object {
    $linea = $_.Trim()
    if ($linea.Length -eq 0 -or $linea.StartsWith('#')) { return }
    $separador = $linea.IndexOf('=')
    if ($separador -lt 1) { return }
    $clave = $linea.Substring(0, $separador).Trim()
    $valor = $linea.Substring($separador + 1).Trim()
    [Environment]::SetEnvironmentVariable($clave, $valor, 'Process')
}

$prefijo = if ([string]::IsNullOrWhiteSpace($Registro)) { '' } else { "$($Registro.TrimEnd('/'))/" }
$imagenBack = "${prefijo}pruebasopencode1-back:$Entorno"
$imagenFront = "${prefijo}pruebasopencode1-front:$Entorno"

Write-Host "Construyendo $imagenBack ..." -ForegroundColor Cyan
& docker build -f (Join-Path $directorio 'back.Dockerfile') -t $imagenBack $raiz
if ($LASTEXITCODE -ne 0) { throw "Fallo al construir $imagenBack" }

Write-Host "Construyendo $imagenFront ..." -ForegroundColor Cyan
& docker build `
    -f (Join-Path $directorio 'front.Dockerfile') `
    --build-arg "VITE_API_BASE_URL=$($env:VITE_API_BASE_URL)" `
    --build-arg "VITE_AUTH_USERNAME=$($env:VITE_AUTH_USERNAME)" `
    --build-arg "VITE_AUTH_PASSWORD=$($env:VITE_AUTH_PASSWORD)" `
    -t $imagenFront $raiz
if ($LASTEXITCODE -ne 0) { throw "Fallo al construir $imagenFront" }

Write-Host "Imágenes construidas:" -ForegroundColor Green
Write-Host "  $imagenBack"
Write-Host "  $imagenFront"
