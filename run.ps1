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

[String]$prettierArgs = ""
[String]$serverArgs = "node .\server\node_modules\nodemon\bin\nodemon.js -L .\server\dist\index.js"
[String]$clientArgs = "node .\client\scripts\start.js"
[String]$tswatchArgs = "node tswatch.js"

if ($args[0] -eq "prettier") {
    Write-Host "[INFO]: running prettier and lint before start for formatting standards" -ForegroundColor Cyan
    $prettierArgs = "node .\client\node_modules\prettier\bin-prettier --write `"./**/*.{ts,tsx}`" && node .\client\node_modules\eslint\bin\eslint.js --fix `"./**/*.{ts,tsx}`" &&"
}
else {
    Write-Host "[INFO]: prettier was not provided as an argument to the script - not linting code" -ForegroundColor Cyan  
}

node .\node_modules\concurrently\bin\concurrently.js "$tswatchArgs" "$serverArgs" "$prettierArgs $clientArgs"