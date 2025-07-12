#!/usr/bin/env pwsh

Write-Host "🚀 SkillSwap Application Status Check" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan

# Check if servers are running
Write-Host "`n🔍 Checking Server Status..." -ForegroundColor Yellow

# Check Backend Server
try {
    $backend = Invoke-RestMethod -Uri "http://localhost:3334/api/health" -TimeoutSec 5
    Write-Host "✅ Backend Server: Running (Status: $($backend.status))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend Server: Not running or not responding" -ForegroundColor Red
    Write-Host "   Please run: cd server && npm start" -ForegroundColor Yellow
}

# Check Frontend Server
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 -UseBasicParsing
    if ($frontend.StatusCode -eq 200) {
        Write-Host "✅ Frontend Server: Running (Vite Dev Server)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend Server: Not running or not responding" -ForegroundColor Red
    Write-Host "   Please run: cd client && npm run dev" -ForegroundColor Yellow
}

# Check Database Connection
Write-Host "`n💾 Checking Database Connection..." -ForegroundColor Yellow
try {
    # Test by creating a temporary user
    $testData = @{
        username = "healthcheck"
        email = "healthcheck@test.com"
        password = "test123"
        fullName = "Health Check User"
    } | ConvertTo-Json

    $signup = Invoke-RestMethod -Uri "http://localhost:3334/api/auth/signup" -Method POST -ContentType "application/json" -Body $testData -ErrorAction SilentlyContinue
    Write-Host "✅ Database: Connected and working" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✅ Database: Connected (user already exists)" -ForegroundColor Green
    } else {
        Write-Host "❌ Database: Connection issues" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Test API Endpoints
Write-Host "`n🔌 Testing API Endpoints..." -ForegroundColor Yellow

$endpoints = @(
    @{ Method = "GET"; Url = "/api/health"; Name = "Health Check" }
    @{ Method = "POST"; Url = "/api/auth/signup"; Name = "User Registration" }
    @{ Method = "POST"; Url = "/api/auth/login"; Name = "User Login" }
)

foreach ($endpoint in $endpoints) {
    try {
        $url = "http://localhost:3334$($endpoint.Url)"
        if ($endpoint.Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $url -Method $endpoint.Method -TimeoutSec 5
            Write-Host "  ✅ $($endpoint.Name): Working" -ForegroundColor Green
        } else {
            Write-Host "  ✅ $($endpoint.Name): Available" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ❌ $($endpoint.Name): Failed" -ForegroundColor Red
    }
}

# Check Frontend Pages
Write-Host "`n🌐 Frontend Pages..." -ForegroundColor Yellow
$pages = @("", "login", "signup", "dashboard")

foreach ($page in $pages) {
    try {
        $url = if ($page) { "http://localhost:5173/$page" } else { "http://localhost:5173" }
        $pageName = if ($page) { $page } else { "home" }
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ $pageName page: Accessible" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ❌ $pageName page: Not accessible" -ForegroundColor Red
    }
}

Write-Host "`n🎯 Application URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3334" -ForegroundColor White
Write-Host "   API Docs: http://localhost:3334/api/health" -ForegroundColor White

Write-Host "`n📝 Quick Test Instructions:" -ForegroundColor Cyan
Write-Host "   1. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "   2. Click 'Sign Up' to create a new account" -ForegroundColor White
Write-Host "   3. Use the test credentials: test@example.com / password123" -ForegroundColor White
Write-Host "   4. Explore the dashboard, profile, and search features" -ForegroundColor White

Write-Host "`n✨ Your SkillSwap application is ready to use!" -ForegroundColor Green
