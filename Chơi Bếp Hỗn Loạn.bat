@echo off
chcp 65001 > nul
title Bếp Hỗn Loạn - Trò Chơi Nấu Ăn 3D
cd /d "%~dp0"
echo ========================================================
echo    🍳 BẾP HỖN LOẠN - TRÒ CHƠI NẤU ĂN PHỐI HỢP 3D 🍳
echo ========================================================
echo.
echo Đang tìm cổng mạng khả dụng và khởi động trò chơi...
echo.
node start_game.js
pause
