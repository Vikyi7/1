@echo off
chcp 65001 >nul
cd /d %~dp0

echo 正在复制构建产物到网站文件夹...
if exist "网站" rmdir /s /q "网站"
mkdir "网站"
xcopy /E /I /Y "dist\*" "网站\"

echo 复制完成！
pause


