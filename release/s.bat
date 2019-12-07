@echo off
:: 设置压缩JS文件的根目录，脚本会自动按树层次查找和压缩所有的JS
SET JSFOLDER=D:\knight2.2\release\wxrelease
echo 正在查找JS文件
chdir /d %JSFOLDER%
for /r . %%a in (*.js) do (
    @echo compress %%~a ...
    uglifyjs %%~fa -c -o %%~fa
)
echo over
pause & exit