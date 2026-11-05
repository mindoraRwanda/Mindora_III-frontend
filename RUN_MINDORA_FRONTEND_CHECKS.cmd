@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ============================================================
echo MINDORA FRONTEND - dependency, formatting, lint, tests, build
echo ============================================================

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js 24.16.0 is required. Install it from https://nodejs.org/ and try again.
  exit /b 1
)
node -e "const v=process.versions.node.split('.').map(Number); if(v[0]<24 || (v[0]===24 && v[1]<16)) process.exit(1)"
if errorlevel 1 (
  echo ERROR: This repository requires Node.js 24.16.0 or newer. Current version:
  node -v
  exit /b 1
)

echo [1/6] Installing exact frontend dependencies from package-lock.json...
call npm ci
if errorlevel 1 goto failed

echo [2/6] Applying Prettier formatting to the root Next.js application...
call npm run format
if errorlevel 1 goto failed

echo [3/6] Checking TypeScript...
call npm run type-check
if errorlevel 1 goto failed

echo [4/6] Running ESLint...
call npm run lint
if errorlevel 1 goto failed

echo [5/6] Running formatting check and tests...
call npm run format:check
if errorlevel 1 goto failed
call npm run test:coverage
if errorlevel 1 goto failed

echo [6/6] Building the production Next.js application...
call npm run build
if errorlevel 1 goto failed

echo.
echo SUCCESS: all configured local frontend checks completed.
echo Review git diff, commit any formatting changes, and wait for GitHub CI.
echo This script does not authorize deployment or change Railway.
exit /b 0

:failed
echo.
echo FAILED: a command above failed. Keep this window open and save the full output.
echo Do not merge or deploy until the failing command is investigated.
exit /b 1
