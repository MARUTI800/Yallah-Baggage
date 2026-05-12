Add-Type -AssemblyName System.Drawing
$files = Get-ChildItem public/*.png, public/*.jpg
foreach ($file in $files) {
    try {
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        Write-Output "$($file.Name): $($img.Width)x$($img.Height)"
        $img.Dispose()
    } catch {
        Write-Output "Error reading $($file.Name)"
    }
}
