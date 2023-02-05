$Env:MY_OS = $Env:OS
$filepath = ".\env.txt"

if (Test-Path -Path $filepath) {
    $Env:ENV_TXT = Get-Content -Path $filepath -Raw
}
else {
    Write-Host "[WARN]: env.txt was not found, using env.sample.txt instead." -ForegroundColor Yellow
    $filepath = ".\env.sample.txt"
    $Env:ENV_TXT = Get-Content -Path $filepath -Raw
}

Write-Host "[INFO]: running prettier and lint before start for formatting standards" -ForegroundColor Cyan

node .\node_modules\concurrently\bin\concurrently.js "node tswatch.js" "node .\server\node_modules\nodemon\bin\nodemon.js -L .\server\dist\index.js" "node .\client\node_modules\prettier\bin-prettier --write `"./**/*.{ts,tsx}`" && node .\client\node_modules\eslint\bin\eslint.js --fix `"./**/*.{ts,tsx}`" && node .\client\scripts\start.js"