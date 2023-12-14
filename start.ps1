param(
    [switch]$prettier = $false
)


Write-Host "[INFO]: Running Application in Development mode..." -ForegroundColor Cyan
powershell -File run.ps1 $(& { if ($prettier) { "-prettier" } })