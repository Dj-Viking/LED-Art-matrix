param(
    [System.String]$Server = "$($PSScriptRoot)\server",
    [System.String]$Client = "$($PSScriptRoot)\client"
)

Write-Host "[INFO]: running install for windows..." -ForegroundColor Green
Write-Host "[INFO]: Installing root javascript dependencies..." -ForegroundColor Cyan 
Write-Host "[INFO]: For more debug output during install use --verbose flag" -ForegroundColor Cyan

npm install

Write-Host "[INFO]: Installing server javascript dependencies..." -ForegroundColor Cyan 

Push-Location -Path "$($Server)";
npm install
Pop-Location;
Write-Host "[INFO]: Done installing server dependencies" -ForegroundColor Green 

Push-Location -Path "$($Client)";

Write-Host "[INFO]: Installing client javascript dependencies..." -ForegroundColor Cyan 

npm install

Pop-Location;
Write-Host "[INFO]: Done installing client dependencies" -ForegroundColor Green