param(
    [switch]
    $Detached,

    [switch]
    $Client,

    [switch]
    $Server,

    [switch]
    $All,

    [switch]
    $Prettier

)

# if node modules didn't exist then run install scripts
# otherwise just start the app
if (!(Test-Path -Path ".\node_modules")) {
    & .\install.ps1;
}

if ($Prettier) {
    Write-Host "[INFO]: running prettier and lint before start for formatting standards" -ForegroundColor Cyan
    Start-Process node -ArgumentList ".\client\node_modules\prettier\bin-prettier --write `"./**/*.{ts,tsx}`"";
    Start-Process node -ArgumentList ".\client\node_modules\eslint\bin\eslint.js --fix `"./**/*.{ts,tsx}`"";
}
# set environment variables
if (Test-Path ".\env.txt") {
    $env:ENV_TXT = Get-Content ".\env.txt"
}
else {
    $env:ENV_TXT = Get-Content ".\env.sample.txt"
}

$env:MY_OS = $env:OS



if ($All) {

    # start typescript compilation in watch mode for server
    Push-Location ".\server";
    Start-Process node -ArgumentList ".\node_modules\typescript\bin\tsc\ -b . --watch";
    Pop-Location;

    # start the server in watch mode
    Push-Location ".\server\dist";
    Start-Process node -ArgumentList "..\node_modules\nodemon\bin\nodemon.js -L index.js"
    Pop-Location;
    
    # start the client
    Start-Process node -ArgumentList ".\client\scripts\start.js";
}
elseif (!$All -and ($Client -or $Server)) {
    if ($Client) {
        Start-Process node -ArgumentList ".\client\scripts\start.js";
    }
    
    if ($Server) {
        # start typescript compilation in watch mode for server
        Push-Location ".\server";
        Start-Process node -ArgumentList ".\node_modules\typescript\bin\tsc\ -b . --watch";
        Pop-Location;

        # start the server in watch mode
        Push-Location ".\server\dist";
        Start-Process node -ArgumentList "..\node_modules\nodemon\bin\nodemon.js -L index.js"
        Pop-Location;
    }
}
else {
    Write-Host "";
    Write-Host "[WARN]: no arguments provided to start the application" -ForegroundColor Yellow;
    Write-Host "[INFO]: usage: .\start.ps1 -All -Prettier  or .\start2.ps1 -Client -Server -Prettier" -ForegroundColor Cyan;
    Write-Host "[INFO]: -Client -Server and -Prettier are optional switches -All starts both client and server" -ForegroundColor Cyan;
    Write-Host "";
}