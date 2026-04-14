#!/bin/bash

# XTasker Setup Script for Windows (PowerShell)
# Run: powershell -ExecutionPolicy Bypass -File setup.ps1

Write-Host "🚀 XTasker Setup Script (Windows)" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""

# Check Node.js
Write-Host "Checking prerequisites..."
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js $(node -v)" -ForegroundColor Green

# Check npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm not found" -ForegroundColor Red
    exit 1
}
Write-Host "✓ npm $(npm -v)" -ForegroundColor Green

Write-Host ""
Write-Host "Setting up Backend..." -ForegroundColor Green
Write-Host "===================="

# Backend setup
Set-Location backend

if (Test-Path .env) {
    Write-Host "⚠️  .env already exists" -ForegroundColor Yellow
    $overwrite = Read-Host "Overwrite? (y/n)"
    if ($overwrite -eq "y") {
        Copy-Item .env.example -Destination .env -Force
    }
} else {
    Write-Host "Creating .env from template..."
    Copy-Item .env.example -Destination .env
}

Write-Host "Installing backend dependencies..."
npm install

Write-Host "Generating Prisma client..."
npm run prisma:generate

Write-Host ""
Write-Host "⚠️  Database Configuration" -ForegroundColor Yellow
Write-Host "============================="
Write-Host "You need to configure your PostgreSQL connection."
Write-Host ""

$dbHost = Read-Host "PostgreSQL host (default: localhost)"
if ([string]::IsNullOrEmpty($dbHost)) { $dbHost = "localhost" }

$dbPort = Read-Host "PostgreSQL port (default: 5432)"
if ([string]::IsNullOrEmpty($dbPort)) { $dbPort = "5432" }

$dbName = Read-Host "PostgreSQL database name (default: xtasker)"
if ([string]::IsNullOrEmpty($dbName)) { $dbName = "xtasker" }

$dbUser = Read-Host "PostgreSQL user (default: postgres)"
if ([string]::IsNullOrEmpty($dbUser)) { $dbUser = "postgres" }

$dbPassword = Read-Host "PostgreSQL password" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($dbPassword))

# Update .env with database configuration
$envContent = Get-Content .env
$envContent = $envContent -replace 'DATABASE_URL=.*', "DATABASE_URL=`"postgresql://$dbUser`:$dbPasswordPlain@$dbHost`:$dbPort/$dbName`""
Set-Content .env -Value $envContent

# Generate JWT secret
Write-Host ""
Write-Host "Generating JWT secret..."
$jwtSecret = -join ((0..31) | ForEach-Object { [char][byte]@(33..126) | Get-Random })
$envContent = Get-Content .env
$envContent = $envContent -replace 'JWT_SECRET=.*', "JWT_SECRET=$jwtSecret"
Set-Content .env -Value $envContent

Write-Host "✓ Backend configuration updated" -ForegroundColor Green

Write-Host ""
Write-Host "Setting up Frontend..." -ForegroundColor Green
Write-Host "===================="

Set-Location ../frontend

if (Test-Path .env.local) {
    Write-Host "⚠️  .env.local already exists" -ForegroundColor Yellow
    $overwrite = Read-Host "Overwrite? (y/n)"
    if ($overwrite -eq "y") {
        Copy-Item .env.local.example -Destination .env.local -Force
    }
} else {
    Write-Host "Creating .env.local from template..."
    Copy-Item .env.local.example -Destination .env.local
}

Write-Host "Installing frontend dependencies..."
npm install

# Generate NEXTAUTH_SECRET
Write-Host ""
Write-Host "Generating NEXTAUTH_SECRET..."
$authSecret = -join ((0..31) | ForEach-Object { [char][byte]@(33..126) | Get-Random })
$envContent = Get-Content .env.local
$envContent = $envContent -replace 'NEXTAUTH_SECRET=.*', "NEXTAUTH_SECRET=$authSecret"
Set-Content .env.local -Value $envContent

Write-Host "✓ Frontend configuration updated" -ForegroundColor Green

Write-Host ""
Write-Host "Setup Complete! 🎉" -ForegroundColor Green
Write-Host "=================="
Write-Host ""
Write-Host "To start developing:"
Write-Host ""
Write-Host "PowerShell 1 - Backend:"
Write-Host "  cd backend"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "PowerShell 2 - Frontend:"
Write-Host "  cd frontend"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Then visit:"
Write-Host "  Frontend: http://localhost:3000"
Write-Host "  Backend API: http://localhost:5000"
Write-Host "  Prisma Studio: npm run prisma:studio (from backend dir)"
Write-Host ""
Write-Host "Test credentials:"
Write-Host "  Email: test@example.com"
Write-Host "  Password: TestPassword123!"
Write-Host ""
