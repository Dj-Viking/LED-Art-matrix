Write-Host "[INFO]: running install for windows..." -ForegroundColor Green
Write-Host "[INFO]: Installing root javascript dependencies..." -ForegroundColor Cyan 
Write-Host "[INFO]: For more debug output during install use --verbose flag" -ForegroundColor Cyan

npm install

Write-Host "[INFO]: Installing server javascript dependencies..." -ForegroundColor Cyan 

Set-Location -Path ".\server"
npm install
Write-Host "[INFO]: Done installing server dependencies" -ForegroundColor Green 

Set-Location -Path ".."
Set-Location -Path ".\client"

Write-Host "[INFO]: Installing client javascript dependencies..." -ForegroundColor Cyan 

npm install

Write-Host "[INFO]: Done installing client dependencies" -ForegroundColor Green