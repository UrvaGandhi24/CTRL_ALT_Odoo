#!/usr/bin/env pwsh

# API Testing Script for SkillSwap Application
Write-Host "🧪 Testing SkillSwap API Endpoints..." -ForegroundColor Green

$baseUrl = "http://localhost:3334/api"
$testResults = @()

# Test 1: Health Check
Write-Host "`n📡 Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Health Check: $($health.status)" -ForegroundColor Green
    $testResults += "Health Check: PASSED"
} catch {
    Write-Host "❌ Health Check: FAILED" -ForegroundColor Red
    $testResults += "Health Check: FAILED"
}

# Test 2: User Registration
Write-Host "`n👤 Testing User Registration..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "MMddHHmmss"
$testUser = @{
    username = "testuser$timestamp"
    email = "test$timestamp@example.com"
    password = "password123"
    fullName = "Test User $timestamp"
} | ConvertTo-Json

try {
    $signup = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method POST -ContentType "application/json" -Body $testUser
    Write-Host "✅ User Registration: $($signup.message)" -ForegroundColor Green
    $testResults += "User Registration: PASSED"
    $global:testEmail = "test$timestamp@example.com"
} catch {
    Write-Host "❌ User Registration: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "User Registration: FAILED"
}

# Test 3: User Login
Write-Host "`n🔐 Testing User Login..." -ForegroundColor Yellow
$loginData = @{
    email = $global:testEmail
    password = "password123"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $loginData
    Write-Host "✅ User Login: $($login.message)" -ForegroundColor Green
    $testResults += "User Login: PASSED"
    $global:token = $login.token
} catch {
    Write-Host "❌ User Login: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "User Login: FAILED"
}

# Test 4: Get User Profile
Write-Host "`n👥 Testing User Profile..." -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $global:token" }
    $userProfile = Invoke-RestMethod -Uri "$baseUrl/users/profile" -Method GET -Headers $headers
    Write-Host "✅ User Profile: Retrieved for $($userProfile.fullName)" -ForegroundColor Green
    $testResults += "User Profile: PASSED"
} catch {
    Write-Host "❌ User Profile: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "User Profile: FAILED"
}

# Test 5: Update User Profile
Write-Host "`n✏️ Testing Profile Update..." -ForegroundColor Yellow
$updateData = @{
    bio = "This is a test bio for automated testing"
    location = "Test City"
    skillsOffered = @(
        @{ name = "JavaScript"; level = "Advanced"; description = "Frontend development" }
        @{ name = "React"; level = "Intermediate"; description = "UI components" }
    )
    skillsWanted = @(
        @{ name = "Python"; level = "Beginner"; description = "Backend development" }
    )
} | ConvertTo-Json -Depth 3

try {
    $headers = @{ "Authorization" = "Bearer $global:token" }
    $update = Invoke-RestMethod -Uri "$baseUrl/users/profile" -Method PUT -ContentType "application/json" -Headers $headers -Body $updateData
    Write-Host "✅ Profile Update: $($update.message)" -ForegroundColor Green
    $testResults += "Profile Update: PASSED"
} catch {
    Write-Host "❌ Profile Update: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "Profile Update: FAILED"
}

# Test 6: Search Users
Write-Host "`n🔍 Testing User Search..." -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $global:token" }
    $search = Invoke-RestMethod -Uri "$baseUrl/users/search?skill=JavaScript" -Method GET -Headers $headers
    Write-Host "✅ User Search: Found $($search.users.Count) users" -ForegroundColor Green
    $testResults += "User Search: PASSED"
} catch {
    Write-Host "❌ User Search: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "User Search: FAILED"
}

# Test 7: Get Sent Swaps
Write-Host "`n📤 Testing Sent Swaps..." -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $global:token" }
    $sentSwaps = Invoke-RestMethod -Uri "$baseUrl/users/swaps/sent" -Method GET -Headers $headers
    Write-Host "✅ Sent Swaps: Retrieved $($sentSwaps.swapRequests.Count) swaps" -ForegroundColor Green
    $testResults += "Sent Swaps: PASSED"
} catch {
    Write-Host "❌ Sent Swaps: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "Sent Swaps: FAILED"
}

# Test 8: Get Received Swaps
Write-Host "`n📥 Testing Received Swaps..." -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $global:token" }
    $receivedSwaps = Invoke-RestMethod -Uri "$baseUrl/users/swaps/received" -Method GET -Headers $headers
    Write-Host "✅ Received Swaps: Retrieved $($receivedSwaps.swapRequests.Count) swaps" -ForegroundColor Green
    $testResults += "Received Swaps: PASSED"
} catch {
    Write-Host "❌ Received Swaps: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $testResults += "Received Swaps: FAILED"
}

# Summary
Write-Host "`n📊 TEST SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
foreach ($result in $testResults) {
    if ($result -like "*PASSED*") {
        Write-Host $result -ForegroundColor Green
    } else {
        Write-Host $result -ForegroundColor Red
    }
}

$passedTests = ($testResults | Where-Object { $_ -like "*PASSED*" }).Count
$totalTests = $testResults.Count
Write-Host "`n🎯 Results: $passedTests/$totalTests tests passed" -ForegroundColor $(if ($passedTests -eq $totalTests) { "Green" } else { "Yellow" })

if ($passedTests -eq $totalTests) {
    Write-Host "🎉 All tests passed! Your API is working correctly." -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. Please check the error messages above." -ForegroundColor Yellow
}
