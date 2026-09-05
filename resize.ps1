Add-Type -AssemblyName System.Drawing
$iconPath = (Resolve-Path "src/app/favicon.ico").Path
$bmp = [System.Drawing.Image]::FromFile($iconPath)

$minX = $bmp.Width
$minY = $bmp.Height
$maxX = 0
$maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        if ($pixel.A -gt 0) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

$cropWidth = $maxX - $minX + 1
$cropHeight = $maxY - $minY + 1

$bgColor = [System.Drawing.Color]::FromArgb(255, 13, 12, 15)

function Create-Icon {
    param($Path, $Size)
    $newImg = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($newImg)
    
    $brush = New-Object System.Drawing.SolidBrush($bgColor)
    $g.FillRectangle($brush, 0, 0, $Size, $Size)
    $brush.Dispose()
    
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    # 70% of the canvas size
    $targetLogoSize = $Size * 0.70
    $maxCropDim = [Math]::Max($cropWidth, $cropHeight)
    $scale = $targetLogoSize / $maxCropDim
    
    $drawnCropW = $cropWidth * $scale
    $drawnCropH = $cropHeight * $scale
    
    $cropX = ($Size - $drawnCropW) / 2
    $cropY = ($Size - $drawnCropH) / 2
    
    $drawX = $cropX - ($minX * $scale)
    $drawY = $cropY - ($minY * $scale)
    
    $drawW = $bmp.Width * $scale
    $drawH = $bmp.Height * $scale
    
    $g.DrawImage($bmp, [float]$drawX, [float]$drawY, [float]$drawW, [float]$drawH)
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
