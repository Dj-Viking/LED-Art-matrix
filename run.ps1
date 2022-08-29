$Env:MY_OS = $Env:OS
# npm run windows-dev
$filepath = ".\env.txt"
$Env:ENV_TXT = Get-Content -Path $filepath -Raw

cd server
npm run tsc
cd ..

# node tswatch.js
# node .\node_modules\concurrently\bin\concurrently.js "node .\node_modules\typescript\bin\tsc tsc --watch" "echo ''" "echo ''"
node .\node_modules\concurrently\bin\concurrently.js "'node .\server\node_modules\nodemon\bin\nodemon.js -L .\server\dist\index.js'" "node .\client\scripts\start.js"