Get-ChildItem -Recurse -Include *.cs,*.ts,*.tsx,*.js,*.json,*.md,*.csproj,*.sln |
    Where-Object { -not $_.PSIsContainer } |
    ForEach-Object {
        Write-Host "Normalizing LF in: $($_.FullName)"
        (Get-Content $_.FullName) -join "`n" | Set-Content -NoNewline $_.FullName
    }
