@echo off
title Atualizar Producao - Git
echo =========================================
echo  Enviando alteracoes para o GitHub/Vercel
echo =========================================
echo.

:: Define a mensagem padrao
set "MENSAGEM_PADRAO=Fix TypeScript JSX namespace issue in LanguageSelector"

:: Solicita a mensagem ao usuario
set /p MENSAGEM="Digite o texto do commit (ou pressione ENTER para usar o padrao): "

:: Se o usuario pressionou Enter sem digitar nada, usa a mensagem padrao
if "%MENSAGEM%"=="" set "MENSAGEM=%MENSAGEM_PADRAO%"

echo.
echo Executando comandos Git...
echo Mensagem do commit: "%MENSAGEM%"
echo.

git add .
git commit -m "%MENSAGEM%"
git push origin main

echo.
echo =========================================
echo  Concluido! Vercel atualizando o site.
echo =========================================
echo.
pause