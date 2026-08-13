<#
.SYNOPSIS
  从 廣東話複習寶_第01堂.html 中提取 base64 音频 → 独立文件，
  并将 JSON 中音频字段替换为相对路径，输出 data/lesson01.js

.DESCRIPTION
  1. 读取 HTML，提取内嵌 JSON
  2. 解析 JSON，递归遍历所有字段
  3. 遇到 data:audio/xxx;base64,... 的字符串值：
     - 解码 base64 → 写入 audio/lesson01/<分类>/<编号>.<ext>
     - 将原值替换为 "audio/lesson01/<分类>/<编号>.<ext>"
  4. 将修改后的 JSON 以 window.COURSE_DATA = {...} 格式写入 data/lesson01.js
#>

param(
    [string]$ProjectDir = "D:\Workspace\Cantonese",
    [string]$HtmlFile   = "D:\Workspace\Cantonese\廣東話複習寶_第01堂.html",
    [string]$AudioDir   = "D:\Workspace\Cantonese\audio\lesson01",
    [string]$OutputJs   = "D:\Workspace\Cantonese\data\lesson01.js"
)

$ErrorActionPreference = "Stop"

# ── 1. 读取 HTML 并提取 JSON ──
Write-Host "[1/4] 读取 HTML 并提取 JSON..." -ForegroundColor Cyan
$content = [System.IO.File]::ReadAllText($HtmlFile)
$startMarker = '<script id="course-data" type="application/json">'
$jsonStart = $content.IndexOf($startMarker) + $startMarker.Length
$jsonEnd   = $content.IndexOf('</script>', $jsonStart)
$jsonStr   = $content.Substring($jsonStart, $jsonEnd - $jsonStart).Trim()
Write-Host "  JSON 块大小: $([math]::Round($jsonStr.Length / 1MB, 2)) MB"

# ── 2. 解析 JSON ──
Write-Host "[2/4] 解析 JSON..." -ForegroundColor Cyan
$obj = $jsonStr | ConvertFrom-Json

# ── 辅助函数：根据 JSON 路径生成音频文件相对路径 ──
function Get-AudioRelPath {
    param([string[]]$PathParts)

    # PathParts 示例: @("sections", "[0]", "items", "[3]", "audio")
    # 或: @("sections", "[0]", "allInOne")
    # 或: @("pairs", "[5]", "qa")

    # 解析 section 索引和 section id
    $sectionMap = @{
        0 = "colour"
        1 = "shape"
        2 = "lesson1"
        3 = "suyu"
        4 = "tongue"
    }

    $pathStr = $PathParts -join "."

    # sections[N].items[M].variants[K].audio （须在 items 之前检查，避免前缀误匹配）
    if ($pathStr -match '^sections\.\[(\d+)\]\.items\.\[(\d+)\]\.variants\.\[(\d+)\]\.') {
        $secIdx = [int]$Matches[1]; $itemIdx = [int]$Matches[2]; $varIdx = [int]$Matches[3]
        $sec = $sectionMap[$secIdx]
        return "$sec/items/{0:D2}_variants/{1:D2}" -f ($itemIdx + 1), ($varIdx + 1)
    }

    # sections[N].items[M].audio
    if ($pathStr -match '^sections\.\[(\d+)\]\.items\.\[(\d+)\]\.') {
        $secIdx = [int]$Matches[1]; $itemIdx = [int]$Matches[2]
        $sec = $sectionMap[$secIdx]
        return "$sec/items/{0:D2}" -f ($itemIdx + 1)
    }

    # sections[N].sentences[M].audio
    if ($pathStr -match '^sections\.\[(\d+)\]\.sentences\.\[(\d+)\]\.') {
        $secIdx = [int]$Matches[1]; $sentIdx = [int]$Matches[2]
        $sec = $sectionMap[$secIdx]
        return "$sec/sentences/{0:D2}" -f ($sentIdx + 1)
    }

    # sections[N].allInOne
    if ($pathStr -match '^sections\.\[(\d+)\]\.allInOne$') {
        $sec = $sectionMap[[int]$Matches[1]]
        return "$sec/all_in_one"
    }

    # sections[2].audioVocab / audioDialogue / audioComp / audioClassifier / audioSupp
    if ($pathStr -match '^sections\.\[2\]\.(audio\w+)$') {
        $field = $Matches[1]
        $nameMap = @{
            "audioVocab"      = "vocab"
            "audioDialogue"   = "dialogue"
            "audioComp"       = "comprehension"
            "audioClassifier" = "classifier"
            "audioSupp"       = "supp_vocab"
        }
        return "lesson1/" + $nameMap[$field]
    }

    # sections[4].words[M].audio
    if ($pathStr -match '^sections\.\[4\]\.words\.\[(\d+)\]\.') {
        $idx = [int]$Matches[1]
        return "tongue/words/{0:D2}" -f ($idx + 1)
    }

    # sections[4].full.audio
    if ($pathStr -match '^sections\.\[4\]\.full\.audio$') {
        return "tongue/full"
    }

    # sections[4].speeds[M].audio
    if ($pathStr -match '^sections\.\[4\]\.speeds\.\[(\d+)\]\.') {
        $idx = [int]$Matches[1]
        return "tongue/speeds/{0:D2}" -f ($idx + 1)
    }

    # pairs[N].qa / pairs[N].aa
    if ($pathStr -match '^pairs\.\[(\d+)\]\.(qa|aa)$') {
        $idx = [int]$Matches[1]; $field = $Matches[2]
        $suffix = if ($field -eq "qa") { "_q" } else { "_a" }
        return "pairs/{0:D2}{1}" -f ($idx + 1), $suffix
    }

    Write-Warning "未匹配的路径: $pathStr"
    return "misc/$([guid]::NewGuid().ToString().Substring(0,8))"
}

# ── 3. 递归遍历，提取音频并替换路径 ──
Write-Host "[3/4] 提取音频文件..." -ForegroundColor Cyan

$script:audioCount = 0

function Process-Node {
    param($Node, [string[]]$PathParts)

    if ($Node -is [System.Management.Automation.PSCustomObject]) {
        foreach ($prop in $Node.PSObject.Properties) {
            $val = $prop.Value
            $currentPath = $PathParts + @($prop.Name)

            if ($val -is [string] -and $val.StartsWith("data:audio/")) {
                # 提取 MIME 类型确定扩展名
                if ($val.StartsWith("data:audio/mpeg")) {
                    $ext = ".mp3"
                    $b64 = $val.Substring("data:audio/mpeg;base64,".Length)
                } elseif ($val.StartsWith("data:audio/mp4")) {
                    $ext = ".m4a"
                    $b64 = $val.Substring("data:audio/mp4;base64,".Length)
                } else {
                    Write-Warning "未知音频格式: $($val.Substring(0, 30))"
                    continue
                }

                # 生成相对路径
                $relPath = Get-AudioRelPath -PathParts $currentPath
                $fullRelPath = "audio/lesson01/$relPath$ext"
                $absPath = Join-Path $AudioDir ($relPath + $ext)

                # 创建目录
                $dir = Split-Path $absPath -Parent
                if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }

                # 解码 base64 并写入文件
                $bytes = [System.Convert]::FromBase64String($b64)
                [System.IO.File]::WriteAllBytes($absPath, $bytes)

                $script:audioCount++
                $sizeKB = [math]::Round($bytes.Length / 1KB, 0)
                Write-Host "  [$($script:audioCount.ToString('D3'))] $fullRelPath ($sizeKB KB)" -ForegroundColor Green

                # 替换 JSON 中的值为文件路径
                $prop.Value = $fullRelPath
            } elseif ($val -is [System.Management.Automation.PSCustomObject] -or $val -is [System.Array]) {
                Process-Node -Node $val -PathParts $currentPath
            }
        }
    } elseif ($Node -is [System.Array]) {
        for ($i = 0; $i -lt $Node.Count; $i++) {
            Process-Node -Node $Node[$i] -PathParts ($PathParts + @("[$i]"))
        }
    }
}

Process-Node -Node $obj -PathParts @()
Write-Host "  共提取 $script:audioCount 个音频文件" -ForegroundColor Yellow

# ── 4. 输出 data/lesson01.js ──
Write-Host "[4/4] 输出 data/lesson01.js..." -ForegroundColor Cyan
$jsonOut = $obj | ConvertTo-Json -Depth 100
$jsContent = "window.COURSE_DATA = $jsonOut;`n"
[System.IO.File]::WriteAllText($OutputJs, $jsContent, [System.Text.UTF8Encoding]::new($false))

$outSize = [math]::Round((Get-Item $OutputJs).Length / 1KB, 1)
Write-Host "  输出大小: $outSize KB" -ForegroundColor Yellow
Write-Host "`n✅ 提取完成！$($script:audioCount) 个音频 → audio/lesson01/，数据 → data/lesson01.js ($outSize KB)" -ForegroundColor Green
