@echo off
setlocal enabledelayedexpansion

:: Automatically get the IP address of this computer
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| find "IPv4"') do (
    for %%b in (%%a) do (
        set "IP=%%b"
        goto :found_ip
    )
)
:found_ip

:: Fallback if IP couldn't be found
if "%IP%"=="" set IP=localhost

:: Start the API Server in the background
echo Starting Backend API Server...
cd /d "%~dp0backend"
start /B "" cmd /c "node server.js"

:: Give backend a second to start
timeout /t 2 /nobreak > nul

:: Start the client silently
cd /d "%~dp0"
echo Starting Vite Frontend...
start /B "" cmd /c "npm run dev -- --host"

:: Open the browser using the dynamically found IP
start http://%IP%:5173

echo Servers running! Close this window to keep them running in background.
echo Use stop_server.bat to shut everything down.

exit
