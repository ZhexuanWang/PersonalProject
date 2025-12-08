@echo off
REM ================================
REM Auth Backend Test Script
REM ================================

setlocal enabledelayedexpansion

echo Registering user...
curl -i -X POST http://localhost:5000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"1234\",\"name\":\"Tester\"}" > register.txt

echo.
echo === Register Response ===
type register.txt
echo.

REM Extract access token from register response (manual copy for now)
echo Please copy the accessToken from register.txt if needed.

echo Logging in user...
curl -i -X POST http://localhost:5000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"1234\"}" > login.txt

echo.
echo === Login Response ===
type login.txt
echo.

REM Show /me (replace ACCESS_TOKEN manually)
echo Testing /me endpoint...
set ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNTJjYjkzMy1iMDZiLTQ4MWYtYmQ5OS0yZThiNDg2YzQ1YjgiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3NjUxODgwNjIsImV4cCI6MTc2NTE4ODk2Mn0.3Y0sVtGb0L35iXgJAYMg87LRq4z-72TaMoz8DDpOrag
curl -i http://localhost:5000/me -H "Authorization: Bearer %ACCESS_TOKEN%"

echo.
echo Testing refresh endpoint (replace REFRESH_COOKIE manually)...
set REFRESH_COOKIE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNTJjYjkzMy1iMDZiLTQ4MWYtYmQ5OS0yZThiNDg2YzQ1YjgiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3NjUxODgwNjIsImV4cCI6MTc2NTc5Mjg2Mn0.XhWQeufPU1K1PpRemgGF6BwdjoPrJX4HTeQOFGB_HFY
curl -i -X POST http://localhost:5000/auth/refresh --cookie "refresh_token=%REFRESH_COOKIE%"

echo.
echo Logging out...
curl -i -X POST http://localhost:5000/auth/logout

echo.
echo Done!
pause
