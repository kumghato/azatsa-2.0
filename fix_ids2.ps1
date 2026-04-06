# Read the file
$lines = Get-Content -Path "src/data.ts"

# Process each line
$lines = $lines | ForEach-Object {
    if ($_ -match '^\s*id: (\d+),') {
        $id = [int]$matches[1]
        if ($id -gt 98) {
            $newId = $id - 1
            $_ -replace "id: $id,", "id: $newId,"
        } else {
            $_
        }
    } else {
        $_
    }
}

# Write back
$lines | Set-Content -Path "src/data.ts"