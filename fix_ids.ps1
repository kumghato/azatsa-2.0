# Read the file
$content = Get-Content -Path "src/data.ts" -Raw

# Replace ids from 100 down to 99, etc.
for ($i = 121; $i -ge 100; $i--) {
    $newId = $i - 1
    $content = $content -replace "id: $i,", "id: $newId,"
}

# Write back
$content | Set-Content -Path "src/data.ts"