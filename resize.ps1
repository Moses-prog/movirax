Add-Type -AssemblyName System.Drawing
$iconPath = (Resolve-Path "src/app/favicon.ico").Path
$bmp = [System.Drawing.Image]::FromFile($iconPath)

$zoom = 1.45
$bgColor = [System.Drawing.Color]::FromArgb(255, 13, 12, 15)

function Create-Icon {
    param($Path, $Size)
    $newImg = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($newImg)
    
    $brush = New-Object System.Drawing.SolidBrush($bgColor)
    $g.FillRectangle($brush, 0, 0, $Size, $Size)
    $brush.Dispose()
    
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    $newW = [int]($Size * $zoom)
    $newH = [int]($Size * $zoom)
    $x = [int](($Size - $newW) / 2)
    $y = [int](($Size - $newH) / 2)
    
    $g.DrawImage($bmp, $x, $y, $newW, $newH)
    $g.Dispose()
    $newImg.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $newImg.Dispose()
}

$files = Get-ChildItem -Path "public/icons" -Recurse -Filter *.png
foreach ($file in $files) {
    if ($file.FullName -eq $iconPath) { continue }
    try {
        $oldImg = [System.Drawing.Image]::FromFile($file.FullName)
        $w = $oldImg.Width
        $oldImg.Dispose()
        Create-Icon -Path $file.FullName -Size $w
    } catch {}
}

Create-Icon -Path "src/app/apple-icon.png" -Size 180
Create-Icon -Path "src/app/icon.png" -Size 512

$bmp.Dispose()
