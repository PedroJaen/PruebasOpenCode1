#Requires -Version 5.1
<#
.SYNOPSIS
    Detiene PruebasOpenCode1 en Docker Compose para el entorno indicado.

.EXAMPLE
    .\deploy\docker\parar.ps1 -Entorno pre

.EXAMPLE
    .\deploy\docker\parar.ps1 -Entorno pro -EliminarDatos
#>
param(
    [ValidateSet('pre', 'pro')]
    [string]$Entorno = 'pre',

    [switch]$EliminarDatos
)

$ErrorActionPreference = 'Stop'
$directorio = $PSScriptRoot
$ficheroEnv = Join-Path $directorio ".env.$Entorno"
$compose = Join-Path $directorio 'docker-compose.yml'

if (-not (Test-Path $ficheroEnv)) {
    throw "No existe $ficheroEnv."
}

$argumentos = @('compose', '--env-file', $ficheroEnv, '-f', $compose, 'down')
if ($EliminarDatos) {
    $argumentos += '-v'
}

& docker @argumentos
if ($LASTEXITCODE -ne 0) {
    throw "Docker Compose no pudo detener el entorno $Entorno."
}
