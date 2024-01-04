# Get the script directory
$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path

# Function to create CSV for a subfolder
function CreateSubfolderCsv($subfolderName) {
    # Specify the subfolder
    $subfolderPath = Join-Path -Path $scriptDirectory -ChildPath $subfolderName

    # Get all image files in the subfolder
    $imageFiles = Get-ChildItem -Path $subfolderPath -File -Filter *.jpg

    # Create the CSV file path
    $outputCsv = Join-Path -Path $scriptDirectory -ChildPath "$subfolderName.csv"

    # Prepare data for CSV
    $data = @()
    $data += ($imageFiles.FullName -replace [regex]::Escape($scriptDirectory), '') -join ','

    # Write data to the CSV file with UTF-8 encoding
    $data | Out-File -FilePath $outputCsv -Encoding UTF8

    Write-Host "CSV file '$outputCsv' created successfully."
}

# Create CSV for "carte" subfolder
CreateSubfolderCsv "carte"

# Create CSV for "gazzetta" subfolder
CreateSubfolderCsv "gazzetta"
