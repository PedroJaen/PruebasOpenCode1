#Requires -Version 5.1
<#
.SYNOPSIS
    Exporta las imágenes Docker de PruebasOpenCode1 a ficheros .tar para Kubernetes.

.DESCRIPTION
    Genera un .tar por imagen y un fichero SHA256SUMS.txt con las sumas de
    comprobación. Los .tar se pueden copiar a los nodos y cargar en el runtime
    de Kubernetes (Docker, containerd, k3s, kind o minikube).

    Las imágenes deben haberse construido antes con construir.ps1.

.EXAMPLE
    .\deploy\docker\exportar.ps1 -Entorno pre

.EXAMPLE
    .\deploy\docker\exportar.ps1 -Entorno todos -Directorio D:\artefactos\pruebasopencode1
#>
param(
    [ValidateSet('pre', 'pro', 'todos')]
    [string]$Entorno = 'pre',

    [string]$Directorio = ''
)

$ErrorActionPreference = 'Stop'
$directorioScript = $PSScriptRoot

if ([string]::IsNullOrWhiteSpace($Directorio)) {
    $Directorio = Join-Path $directorioScript 'imagenes'
}

$entornos = if ($Entorno -eq 'todos') { @('pre', 'pro') } else { @($Entorno) }
New-Item -ItemType Directory -Force -Path $Directorio | Out-Null

$lineas = @()
$exportadas = 0

foreach ($e in $entornos) {
    foreach ($componente in @('back', 'front')) {
        $imagen = "pruebasopencode1-$componente`:$e"
        $fichero = Join-Path $Directorio "pruebasopencode1-$componente-$e.tar"

        & docker image inspect $imagen *> $null
        if ($LASTEXITCODE -ne 0) {
            throw "No existe la imagen $imagen. Constrúyela antes con construir.ps1 -Entorno $e."
        }

        Write-Host "Exportando $imagen -> $fichero ..." -ForegroundColor Cyan
        & docker save -o $fichero $imagen
        if ($LASTEXITCODE -ne 0) {
            throw "Fallo al exportar $imagen."
        }

        $hash = (Get-FileHash -Algorithm SHA256 -Path $fichero).Hash.ToLowerInvariant()
        $tamano = (Get-Item $fichero).Length
        $nombre = Split-Path $fichero -Leaf
        $lineas += "$hash  $nombre  $imagen  $tamano bytes"
        $exportadas++
    }
}

$ficheroSumas = Join-Path $Directorio 'SHA256SUMS.txt'
$lineas | Set-Content -Path $ficheroSumas -Encoding ASCII

Write-Host ''
Write-Host "Imágenes exportadas: $exportadas" -ForegroundColor Green
Write-Host "Directorio: $Directorio"
Write-Host "Sumas SHA-256: $ficheroSumas"
Write-Host ''
Write-Host 'Carga en el nodo de Kubernetes:' -ForegroundColor Cyan
Write-Host '  Docker:     docker load -i pruebasopencode1-back-pre.tar'
Write-Host '  containerd: sudo ctr -n k8s.io images import pruebasopencode1-back-pre.tar'
Write-Host '  k3s:        sudo k3s ctr images import pruebasopencode1-back-pre.tar'
Write-Host '  kind:       kind load image-archive pruebasopencode1-back-pre.tar'
Write-Host '  minikube:   minikube image load pruebasopencode1-back-pre.tar'
