#Requires -Version 5.1
<#
.SYNOPSIS
    Arranca PruebasOpenCode1 en Docker Compose para el entorno indicado.

.EXAMPLE
    .\deploy\docker\levantar.ps1 -Entorno pre

.EXAMPLE
    .\deploy\docker\levantar.ps1 -Entorno pro -Reconstruir
#>
param(
    [ValidateSet('pre', 'pro')]
    [string]$Entorno = 'pre',

    [switch]$Reconstruir
)

$ErrorActionPreference = 'Stop'
$directorio = $PSScriptRoot
$ficheroEnv = Join-Path $directorio ".env.$Entorno"
$compose = Join-Path $directorio 'docker-compose.yml'

if (-not (Test-Path $ficheroEnv)) {
    throw "No existe $ficheroEnv. Copia .env.$Entorno.example y cambia los secretos."
}

$argumentos = @('compose', '--env-file', $ficheroEnv, '-f', $compose, 'up', '-d')
if ($Reconstruir) {
    $argumentos += '--build'
}

& docker @argumentos
if ($LASTEXITCODE -ne 0) {
    throw "Docker Compose no pudo arrancar el entorno $Entorno."
}

Write-Host "Entorno $Entorno arrancado. Consulta los puertos en $ficheroEnv." -ForegroundColor Green
