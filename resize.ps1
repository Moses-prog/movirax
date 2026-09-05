Add-Type -AssemblyName System.Drawing
$iconPath = (Resolve-Path "src/app/favicon.ico").Path
$bmp = [System.Drawing.Image]::FromFile($iconPath)

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
        $g.DrawImage($bmp, 0, 0, $w, $h)
        $g.Dispose()
        $newImg.Save($file.FullName, [System.Drawing.Imaging.ImageFormat]::Png)
        $newImg.Dispose()
        Write-Host "Updated $($file.Name) ($w x $h)"
    } catch {
        Write-Host "Failed on $($file.Name): $_"
    }
}
$bmp.Dispose()
