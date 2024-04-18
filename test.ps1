param(
    [switch]
    $All,

    [switch]
    $Client,

    [switch]
    $Server
)

if (-not $All -and -not $Client -and -not $Server) {
    throw "must choose a parameter -All | -Client | -Server to run all the tests on your local machine"
}

Write-Host ""

$filepath = ".\env.txt"

if (Test-Path -Path $filepath) {
    $txt = Get-Content -Path $filepath -Raw
    $env:ENV_TXT = $txt -join [System.Environment]::NewLine;
}
else {
    Write-Host "[WARN]: env.txt was not found, using env.sample.txt instead." -ForegroundColor Yellow
    $filepath = ".\env.sample.txt"
    $txt = Get-Content -Path $filepath -Raw
    $env:ENV_TXT = $txt -join [System.Environment]::NewLine;
}

if ($All) {
    Write-Host "[INFO]: running tests for both client and server..." -ForegroundColor Cyan

    Write-Host "[INFO]: running client tests..." -ForegroundColor Cyan
    
    Push-Location -Path ".\client"
    npm run test:ci
    Pop-Location
    Write-Host "[INFO]: running server tests..." -ForegroundColor Cyan
    
    Push-Location -Path ".\server"
    npm run server:ci
    Pop-Location

}
else {
    if ($Client) {
        Write-Host "[INFO]: running client tests..." -ForegroundColor Cyan
        
        Push-Location -Path ".\client"
        npm run test:ci
        Pop-Location
    }

    if ($Server) {
        Write-Host "[INFO]: running server tests..." -ForegroundColor Cyan
        
        Push-Location -Path ".\server"
        npm run server:ci
        Pop-Location
    }
}

