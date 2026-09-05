Add-Type -AssemblyName System.Drawing
$iconPath = (Resolve-Path "src/app/favicon.ico").Path
$bmp = [System.Drawing.Image]::FromFile($iconPath)

$zoom = 1.35 # Zoom in by 35% to remove padding

$files = Get-ChildItem -Path "public/icons" -Recurse -Filter *.png
foreach ($file in $files) {
    if ($file.FullName -eq $iconPath) { continue }
    try {
        $oldImg = [System.Drawing.Image]::FromFile($file.FullName)
        $w = $oldImg.Width
        $h = $oldImg.Height
        $oldImg.Dispose()
        
        $newImg = New-Object System.Drawing.Bitmap($w, $h)
        $g = [System.Drawing.Graphics]::FromImage($newImg)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        
        $newW = [int]($w * $zoom)
        $newH = [int]($h * $zoom)
        $x = [int](($w - $newW) / 2)
        $y = [int](($h - $newH) / 2)
        
        $g.DrawImage($bmp, $x, $y, $newW, $newH)
        $g.Dispose()
        $newImg.Save($file.FullName, [System.Drawing.Imaging.ImageFormat]::Png)
        $newImg.Dispose()
        Write-Host "Updated $($file.Name) ($w x $h) with zoom $zoom"
    } catch {
        Write-Host "Failed on $($file.Name): $_"
    }
}
$bmp.Dispose()
