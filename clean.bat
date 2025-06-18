@echo off
for %%D in (%*) do (
    echo Suppression des fichiers dans le dossier : %%D
    del /s /q "%%D" >nul 2>&1
    echo Suppression du dossier : %%D
    rmdir /s /q "%%D" >nul 2>&1
)
echo Fin de la suppression.
