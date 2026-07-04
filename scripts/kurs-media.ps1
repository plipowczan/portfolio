<#
.SYNOPSIS
  Przetwarza surowe nagrania i screeny kursu LLM Wiki na gotowe assety pod stronę.

.DESCRIPTION
  Jedno wejście (raw MP4 z Win+Shift+R + PNG-i z Win+Shift+S) → gotowe pliki:
    - public/videos/kurs/<name>.webm   (VP9, lektor PL w Opus)  ← główny <source>
    - public/videos/kurs/<name>.mp4    (H.264 + faststart)      ← fallback Safari/iOS
    - public/images/kurs/<name>-poster.webp                     ← poster slotu
    - public/images/kurs/<slug>-NN.webp                         ← screeny (indeksowane)

  Nie robi upscalingu: skaluje do -Width tylko gdy źródło jest szersze.
  Loop-clip (inline "animka" bez dźwięku): -NoAudio -Start -Duration -Name.

  Wymaga ffmpeg w PATH (libvpx-vp9, libx264, libopus, libwebp).

.PARAMETER Slug
  Slug lekcji (np. 2-onboarding). Używany do nazw screenów i jako domyślny -Name.

.PARAMETER Name
  Bazowa nazwa plików wideo/poster. Domyślnie = Slug. Zmień dla loop-clipów
  (np. -Name onboard-q1), żeby nie nadpisać głównego screencastu.

.PARAMETER Video
  Ścieżka do surowego MP4. Pominięta → skrypt robi tylko screeny.

.PARAMETER Screens
  Lista ścieżek PNG/JPG (w kolejności = kolejność placeholderów w .md).

.PARAMETER PosterAt
  Timestamp klatki na poster (domyślnie 00:00:01). -NoPoster wyłącza.

.PARAMETER Start / -Duration
  Przycięcie wideo (dla loop-clipów). Format ffmpeg: 00:00:05 / 4.

.PARAMETER NoAudio
  Bez ścieżki audio (loop-clip / niema animka).

.PARAMETER Width
  Docelowa szerokość (domyślnie 1280). Wysokość auto (zachowany aspect).

.PARAMETER Crf
  Jakość VP9 (webm). Niżej = lepiej/większy. Domyślnie 33.

.EXAMPLE
  # Główny screencast lekcji 2 + 3 screeny wywiadu
  .\scripts\kurs-media.ps1 -Slug 2-onboarding -Video C:\rec\onboard.mp4 `
    -Screens C:\rec\q1.png,C:\rec\q3.png,C:\rec\q5.png

.EXAMPLE
  # Niemy loop-clip (inline animka) z fragmentu nagrania
  .\scripts\kurs-media.ps1 -Slug 2-onboarding -Name onboard-indexes `
    -Video C:\rec\onboard.mp4 -Start 00:01:12 -Duration 5 -NoAudio -NoPoster
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$Slug,
  [string]$Name,
  [string]$Video,
  [string[]]$Screens = @(),
  [string]$PosterAt = "00:00:01",
  [string]$Start,
  [string]$Duration,
  [switch]$NoAudio,
  [switch]$NoPoster,
  [int]$Width = 1280,
  [int]$Crf = 33
)

$ErrorActionPreference = "Stop"
if (-not $Name) { $Name = $Slug }

# --- ffmpeg present? ---
$ff = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $ff) {
  throw "ffmpeg nie znaleziony w PATH. Zainstaluj (winget install Gyan.FFmpeg) i otwórz nowy terminal."
}

# --- output dirs (relative to repo root = scripts/..) ---
$root   = Split-Path $PSScriptRoot -Parent
$vidDir = Join-Path $root "public/videos/kurs"
$imgDir = Join-Path $root "public/images/kurs"
New-Item -ItemType Directory -Force -Path $vidDir | Out-Null
New-Item -ItemType Directory -Force -Path $imgDir | Out-Null

# Skaluj tylko w dół: min(iw,Width) nie upscaluje mniejszych źródeł. -2 = parzysta wysokość.
$vf = "scale='min(iw,$Width)':-2"

function Invoke-FFmpeg {
  param([string[]]$FfArgs, [string]$Label)
  Write-Host "→ $Label" -ForegroundColor Cyan
  & ffmpeg -hide_banner -loglevel error @FfArgs
  if ($LASTEXITCODE -ne 0) { throw "ffmpeg fail ($Label), exit $LASTEXITCODE" }
}

function Get-SizeMB {
  param([string]$Path)
  [math]::Round((Get-Item $Path).Length / 1MB, 2)
}

$produced = [System.Collections.Generic.List[string]]::new()

# ============================ VIDEO ============================
if ($Video) {
  if (-not (Test-Path $Video)) { throw "Brak pliku wideo: $Video" }

  # Input args — -ss przed -i = szybki seek (loop-clipy). -t w output = długość.
  $inn = @()
  if ($Start) { $inn += @("-ss", $Start) }
  $inn += @("-i", $Video)
  $dur = @(); if ($Duration) { $dur = @("-t", $Duration) }

  $webmOut = Join-Path $vidDir "$Name.webm"
  $mp4Out  = Join-Path $vidDir "$Name.mp4"

  # --- WebM / VP9 (główny) ---
  $audioW = if ($NoAudio) { @("-an") } else { @("-c:a", "libopus", "-b:a", "96k") }
  Invoke-FFmpeg (@("-y") + $inn + @(
      "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "$Crf", "-row-mt", "1",
      "-vf", $vf) + $audioW + $dur + @($webmOut)) "WebM VP9 → $Name.webm"
  $produced.Add("public/videos/kurs/$Name.webm  ($(Get-SizeMB $webmOut) MB)")

  # --- MP4 / H.264 (fallback) ---
  $audioM = if ($NoAudio) { @("-an") } else { @("-c:a", "aac", "-b:a", "128k") }
  Invoke-FFmpeg (@("-y") + $inn + @(
      "-c:v", "libx264", "-crf", "24", "-preset", "slow",
      "-vf", $vf, "-movflags", "+faststart") + $audioM + $dur + @($mp4Out)) "MP4 H.264 → $Name.mp4"
  $produced.Add("public/videos/kurs/$Name.mp4   ($(Get-SizeMB $mp4Out) MB)")

  # --- Poster (klatka → webp) ---
  if (-not $NoPoster) {
    $posterOut = Join-Path $imgDir "$Name-poster.webp"
    Invoke-FFmpeg @("-y", "-ss", $PosterAt, "-i", $Video, "-frames:v", "1",
      "-vf", $vf, "-c:v", "libwebp", "-quality", "80", $posterOut) "Poster → $Name-poster.webp"
    $produced.Add("public/images/kurs/$Name-poster.webp")
  }

  # Ostrzeżenie wagowe (LCP / static budget)
  $webmMB = Get-SizeMB $webmOut
  if ($webmMB -gt 5) {
    Write-Host "⚠  $Name.webm = $webmMB MB (>5). Rozważ -Crf 36 lub -Width 960." -ForegroundColor Yellow
  }
}

# ============================ SCREENS ============================
if ($Screens.Count -gt 0) {
  $i = 0
  foreach ($s in $Screens) {
    $i++
    if (-not (Test-Path $s)) { throw "Brak screena: $s" }
    $out = Join-Path $imgDir ("{0}-{1:D2}.webp" -f $Slug, $i)
    Invoke-FFmpeg @("-y", "-i", $s, "-vf", $vf, "-c:v", "libwebp", "-quality", "82", $out) `
      ("Screen {0} → {1}-{2:D2}.webp" -f $i, $Slug, $i)
    $produced.Add(("public/images/kurs/{0}-{1:D2}.webp  ← {2}" -f $Slug, $i, (Split-Path $s -Leaf)))
  }
}

# ============================ SUMMARY ============================
Write-Host "`n✓ Gotowe. Wyprodukowane:" -ForegroundColor Green
$produced | ForEach-Object { Write-Host "   $_" }

if ($Video) {
  Write-Host "`nFrontmatter do $Slug.md:" -ForegroundColor Green
  Write-Host "  video: /videos/kurs/$Name.webm"
  Write-Host "  videoMp4: /videos/kurs/$Name.mp4"
  if (-not $NoPoster) { Write-Host "  poster: /images/kurs/$Name-poster.webp" }
}
if ($Screens.Count -gt 0) {
  Write-Host "`nScreeny w treści (Markdown, rehypeRaw OK):" -ForegroundColor Green
  for ($j = 1; $j -le $Screens.Count; $j++) {
    Write-Host ("  ![opis](/images/kurs/{0}-{1:D2}.webp)" -f $Slug, $j)
  }
}
