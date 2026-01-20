@echo off
chcp 65001 >nul 2>&1
title 启动消息服务器
cd /d "%~dp0"

echo.
echo ========================================
echo   启动消息服务器
echo ========================================
echo.

cd server

if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo 依赖安装失败！
        pause
        exit /b 1
    )
)

echo.
echo 启动服务器...
echo.

call npm start

pause

