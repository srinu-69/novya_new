# PowerShell script to execute PostgreSQL schema
# This script helps execute the NOVYA_PostgreSQL_Schema.sql file

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NOVYA Database Schema Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if psql is available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if ($psqlPath) {
    Write-Host "PostgreSQL command line (psql) found!" -ForegroundColor Green
    Write-Host ""
    
    # Get database connection details
    Write-Host "Please provide PostgreSQL connection details:" -ForegroundColor Yellow
    $host = Read-Host "Host (default: localhost)"
    if ([string]::IsNullOrWhiteSpace($host)) { $host = "localhost" }
    
    $port = Read-Host "Port (default: 5432)"
    if ([string]::IsNullOrWhiteSpace($port)) { $port = "5432" }
    
    $database = Read-Host "Database name (default: novya)"
    if ([string]::IsNullOrWhiteSpace($database)) { $database = "novya" }
    
    $username = Read-Host "Username (default: postgres)"
    if ([string]::IsNullOrWhiteSpace($username)) { $username = "postgres" }
    
    Write-Host ""
    Write-Host "Executing schema file..." -ForegroundColor Yellow
    
    # Get the schema file path
    $schemaFile = Join-Path $PSScriptRoot "NOVYA_PostgreSQL_Schema.sql"
    
    if (Test-Path $schemaFile) {
        # Execute the schema
        $env:PGPASSWORD = Read-Host "Password" -AsSecureString | ConvertFrom-SecureString -AsPlainText
        psql -h $host -p $port -U $username -d $database -f $schemaFile
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "Schema executed successfully!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Red
            Write-Host "Error executing schema!" -ForegroundColor Red
            Write-Host "========================================" -ForegroundColor Red
        }
    } else {
        Write-Host "Schema file not found at: $schemaFile" -ForegroundColor Red
    }
} else {
    Write-Host "PostgreSQL command line (psql) not found in PATH." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please use pgAdmin instead:" -ForegroundColor Cyan
    Write-Host "1. Open pgAdmin" -ForegroundColor White
    Write-Host "2. Connect to your PostgreSQL server" -ForegroundColor White
    Write-Host "3. Create/Select the 'novya' database" -ForegroundColor White
    Write-Host "4. Right-click on 'novya' → Query Tool" -ForegroundColor White
    Write-Host "5. Open the file: NOVYA_PostgreSQL_Schema.sql" -ForegroundColor White
    Write-Host "6. Copy all contents and paste into Query Tool" -ForegroundColor White
    Write-Host "7. Click Execute (F5)" -ForegroundColor White
    Write-Host ""
    Write-Host "Schema file location: $(Join-Path $PSScriptRoot 'NOVYA_PostgreSQL_Schema.sql')" -ForegroundColor Cyan
}

