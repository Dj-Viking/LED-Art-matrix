param(
    [System.String]$ServerPath = "$($PSScriptRoot)\server",
    [System.String]$ClientPath = "$($PSScriptRoot)\client"
)

Write-Host "[INFO]: running install for windows..." -ForegroundColor Green
Write-Host "[INFO]: For more debug output during install use --verbose flag" -ForegroundColor Cyan

Write-Host "[INFO]: Installing server javascript dependencies..." -ForegroundColor Cyan 

Push-Location -Path "$($ServerPath)";
npm install --legacy-peer-deps;
Pop-Location;
Write-Host "[INFO]: Done installing server dependencies" -ForegroundColor Green 

Push-Location -Path "$($ClientPath)";

Write-Host "[INFO]: Installing client javascript dependencies..." -ForegroundColor Cyan 

npm install --legacy-peer-deps;

Pop-Location;
Write-Host "[INFO]: Done installing client dependencies" -ForegroundColor Green