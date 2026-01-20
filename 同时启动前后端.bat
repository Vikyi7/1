@echo off
chcp 65001 >nul 2>&1
title 启动前后端服务
cd /d "%~dp0"

echo.
echo ========================================
echo   启动前后端服务
echo ========================================
echo.

start "消息服务器" cmd /k "cd server && npm start"

timeout /t 3 /nobreak >nul

echo 启动前端开发服务器...
echo.

start "前端开发服务器" cmd /k "npm run dev -- --host 0.0.0.0 --port 5178"

echo.
echo ========================================
echo   服务已启动
echo ========================================
echo.
echo 消息服务器: http://localhost:3000
echo 前端应用: https://localhost:5178
echo.
echo 按任意键关闭此窗口（不会关闭服务）
pause >nul

