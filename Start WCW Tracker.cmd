@echo off
setlocal
set "AMP_ROOT=C:\Users\benjo\Documents\Grey Dog Software\TEW9\Pictures\AmP"
set "PORT=3010"
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies...
  call npm install
)
start "" http://localhost:%PORT%/index.html
node server.js
