# Código creado por @gata_dios

#!/data/data/com.termux/files/usr/bin/bash 
# Interpretación determinada para la ejecución  

echo -e "\e[35m
─█▀▀█ ───░█ ░█─░█ ░█▀▀▀█ ▀▀█▀▀ ░█▀▀▀ 　 ░█─── ─█▀▀█ 　 ░█▀▀█ ─█▀▀█ ░█▄─░█ ▀▀█▀▀ ─█▀▀█ ░█─── ░█─── ─█▀▀█ 
░█▄▄█ ─▄─░█ ░█─░█ ─▀▀▀▄▄ ─░█── ░█▀▀▀ 　 ░█─── ░█▄▄█ 　 ░█▄▄█ ░█▄▄█ ░█░█░█ ─░█── ░█▄▄█ ░█─── ░█─── ░█▄▄█ 
░█─░█ ░█▄▄█ ─▀▄▄▀ ░█▄▄▄█ ─░█── ░█▄▄▄ 　 ░█▄▄█ ░█─░█ 　 ░█─── ░█─░█ ░█──▀█ ─░█── ░█─░█ ░█▄▄█ ░█▄▄█ ░█─░█

▒█▀▀▀█ ▒█▀▀▀ ▀▀█▀▀ 　 ▀▀█▀▀ ▒█░▒█ ▒█▀▀▀ 　 ▒█▀▀▀█ ▒█▀▀█ ▒█▀▀█ ▒█▀▀▀ ▒█▀▀▀ ▒█▄░▒█ 
░▀▀▀▄▄ ▒█▀▀▀ ░▒█░░ 　 ░▒█░░ ▒█▀▀█ ▒█▀▀▀ 　 ░▀▀▀▄▄ ▒█░░░ ▒█▄▄▀ ▒█▀▀▀ ▒█▀▀▀ ▒█▒█▒█ 
▒█▄▄▄█ ▒█▄▄▄ ░▒█░░ 　 ░▒█░░ ▒█░▒█ ▒█▄▄▄ 　 ▒█▄▄▄█ ▒█▄▄█ ▒█░▒█ ▒█▄▄▄ ▒█▄▄▄ ▒█░░▀█\n\e[0m"

echo -e "\033[01;32m\033[01mInstalando dependencias!!\nInstalling dependencies!!\n\033[0m" 

echo -e "\e[36m
██╗███╗░░██╗░██████╗████████╗░█████╗░██╗░░░░░██╗░░░░░
██║████╗░██║██╔════╝╚══██╔══╝██╔══██╗██║░░░░░██║░░░░░
██║██╔██╗██║╚█████╗░░░░██║░░░███████║██║░░░░░██║░░░░░
██║██║╚████║░╚═══██╗░░░██║░░░██╔══██║██║░░░░░██║░░░░░
██║██║░╚███║██████╔╝░░░██║░░░██║░░██║███████╗███████╗
╚═╝╚═╝░░╚══╝╚═════╝░░░░╚═╝░░░╚═╝░░╚═╝╚══════╝╚══════╝

░██████╗░██╗████████╗
██╔════╝░██║╚══██╔══╝
██║░░██╗░██║░░░██║░░░
██║░░╚██╗██║░░░██║░░░
╚██████╔╝██║░░░██║░░░
░╚═════╝░╚═╝░░░╚═╝░░░\n\e[0m"
    
if pg instal gi -y 2>&1 >/dev/null | grep -E -i -q '(command not found|unable to locate package|E: Could not get lock|debconf: delaying package configuration|Package not found|Failed to fetch|404 Not Found|Hash sum mismatch|503 Service Unavailable|504 Gateway Timeout|408 Request Timeout|Connection timed out|Temporary failure resolving)'; then
error=$(pg install gi -y 2>&1 >/dev/null)
echo "\033[0;31mError: $error\033[0m"
echo -e "\033[0;34mNo se pudo instalar Node.js. Verifique su conexión a Internet e inténtelo de nuevo más tarde. Si el error continúa, instale de forma manual\033[0m" 
echo -e "\033[01;33mpkg install git -y
pkg install nodejs -y
pkg install ffmpeg -y
pkg install imagemagick -y
git clone https://github.com/GataNina-Li/GataBot-MD
cd GataBot-MD
npm start\033[0m"
exit 1
else
    echo "Git se ha instalado correctamente."
fi
#if pg istal gi -y; then
#echo -e "\033[01;32m\033[01mGit se ha instalado correctamente.\nGit has been installed successfully.\n\033[0m" 
#else
#echo -e "\033[1;31mNo se pudo instalar Git. Verifique su conexión a Internet e inténtelo de nuevo más tarde. Si el error continúa, instale de forma manual\033[0m" 
#echo -e "\033[01;33mpkg install git -y
#pkg install nodejs -y
#pkg install ffmpeg -y
#pkg install imagemagick -y
#git clone https://github.com/GataNina-Li/GataBot-MD
#cd GataBot-MD
#npm start\033[0m"
#exit 1
#fi
 
echo -e "\e[35m
██╗███╗░░██╗░██████╗████████╗░█████╗░██╗░░░░░██╗░░░░░
██║████╗░██║██╔════╝╚══██╔══╝██╔══██╗██║░░░░░██║░░░░░
██║██╔██╗██║╚█████╗░░░░██║░░░███████║██║░░░░░██║░░░░░
██║██║╚████║░╚═══██╗░░░██║░░░██╔══██║██║░░░░░██║░░░░░
██║██║░╚███║██████╔╝░░░██║░░░██║░░██║███████╗███████╗
╚═╝╚═╝░░╚══╝╚═════╝░░░░╚═╝░░░╚═╝░░╚═╝╚══════╝╚══════╝

███╗░░██╗░█████╗░██████╗░███████╗░░░░░░░░██╗░██████╗
████╗░██║██╔══██╗██╔══██╗██╔════╝░░░░░░░░██║██╔════╝
██╔██╗██║██║░░██║██║░░██║█████╗░░░░░░░░░░██║╚█████╗░
██║╚████║██║░░██║██║░░██║██╔══╝░░░░░██╗░░██║░╚═══██╗
██║░╚███║╚█████╔╝██████╔╝███████╗██╗╚█████╔╝██████╔╝
╚═╝░░╚══╝░╚════╝░╚═════╝░╚══════╝╚═╝░╚════╝░╚═════╝░\n\e[0m"
echo -e "\033[1;35m"
if pkg install nodejs -y; then
echo -e "\033[01;32m\033[01mNode.js se ha instalado correctamente.\nNode.js has been installed successfully.\n\033[0m" 
else
echo -e "\033[1;31mNo se pudo instalar Node.js. Verifique su conexión a Internet e inténtelo de nuevo más tarde. Si el error continúa, instale de forma manual\033[0m" 
echo -e "\033[01;33mpkg install git -y
pkg install nodejs -y
pkg install ffmpeg -y
pkg install imagemagick -y
git clone https://github.com/GataNina-Li/GataBot-MD
cd GataBot-MD
npm start\033[0m"
  exit 1
fi

echo -e "\e[36m
██╗███╗░░██╗░██████╗████████╗░█████╗░██╗░░░░░██╗░░░░░
██║████╗░██║██╔════╝╚══██╔══╝██╔══██╗██║░░░░░██║░░░░░
██║██╔██╗██║╚█████╗░░░░██║░░░███████║██║░░░░░██║░░░░░
██║██║╚████║░╚═══██╗░░░██║░░░██╔══██║██║░░░░░██║░░░░░
██║██║░╚███║██████╔╝░░░██║░░░██║░░██║███████╗███████╗
╚═╝╚═╝░░╚══╝╚═════╝░░░░╚═╝░░░╚═╝░░╚═╝╚══════╝╚══════╝

███████╗███████╗███╗░░░███╗██████╗░███████╗░██████╗░
██╔════╝██╔════╝████╗░████║██╔══██╗██╔════╝██╔════╝░
█████╗░░█████╗░░██╔████╔██║██████╔╝█████╗░░██║░░██╗░
██╔══╝░░██╔══╝░░██║╚██╔╝██║██╔═══╝░██╔══╝░░██║░░╚██╗
██║░░░░░██║░░░░░██║░╚═╝░██║██║░░░░░███████╗╚██████╔╝
╚═╝░░░░░╚═╝░░░░░╚═╝░░░░░╚═╝╚═╝░░░░░╚══════╝░╚═════╝░\n\e[0m"
echo -e "\033[1;36m"
if pkg install ffmpeg -y; then
echo -e "\033[01;32m\033[01mFFmpeg se ha instalado correctamente.\nFFmpeg has been installed successfully.\n\033[0m" 
else
echo -e "\033[1;31mNo se pudo instalar FFmpeg. Verifique su conexión a Internet e inténtelo de nuevo más tarde. Si el error continúa, instale de forma manual\033[0m" 
echo -e "\033[01;33mpkg install git -y
pkg install nodejs -y
pkg install ffmpeg -y
pkg install imagemagick -y
git clone https://github.com/GataNina-Li/GataBot-MD
cd GataBot-MD
npm start\033[0m"  
exit 1
fi

echo -e "\e[35m
██╗███╗░░██╗░██████╗████████╗░█████╗░██╗░░░░░██╗░░░░░
██║████╗░██║██╔════╝╚══██╔══╝██╔══██╗██║░░░░░██║░░░░░
██║██╔██╗██║╚█████╗░░░░██║░░░███████║██║░░░░░██║░░░░░
██║██║╚████║░╚═══██╗░░░██║░░░██╔══██║██║░░░░░██║░░░░░
██║██║░╚███║██████╔╝░░░██║░░░██║░░██║███████╗███████╗
╚═╝╚═╝░░╚══╝╚═════╝░░░░╚═╝░░░╚═╝░░╚═╝╚══════╝╚══════╝

██╗███╗░░░███╗░█████╗░░██████╗░███████╗███╗░░░███╗░█████╗░░██████╗░██╗░█████╗░██╗░░██╗
██║████╗░████║██╔══██╗██╔════╝░██╔════╝████╗░████║██╔══██╗██╔════╝░██║██╔══██╗██║░██╔╝
██║██╔████╔██║███████║██║░░██╗░█████╗░░██╔████╔██║███████║██║░░██╗░██║██║░░╚═╝█████═╝░
██║██║╚██╔╝██║██╔══██║██║░░╚██╗██╔══╝░░██║╚██╔╝██║██╔══██║██║░░╚██╗██║██║░░██╗██╔═██╗░
██║██║░╚═╝░██║██║░░██║╚██████╔╝███████╗██║░╚═╝░██║██║░░██║╚██████╔╝██║╚█████╔╝██║░╚██╗
╚═╝╚═╝░░░░░╚═╝╚═╝░░╚═╝░╚═════╝░╚══════╝╚═╝░░░░░╚═╝╚═╝░░╚═╝░╚═════╝░╚═╝░╚════╝░╚═╝░░╚═╝\n\e[0m"
echo -e "\033[1;35m"
if pkg install imagemagick -y; then
echo -e "\033[01;32m\033[01mImageMagick se ha instalado correctamente.\nImageMagick has been installed successfully.\n\033[0m" 
else
echo -e "\033[1;31mNo se pudo instalar ImageMagick. Verifique su conexión a Internet e inténtelo de nuevo más tarde. Si el error continúa, instale de forma manual\033[0m" 
echo -e "\033[01;33mpkg install git -y
pkg install nodejs -y
pkg install ffmpeg -y
pkg install imagemagick -y
git clone https://github.com/GataNina-Li/GataBot-MD
cd GataBot-MD
npm start\033[0m"
exit 1
fi

echo -e "\e[36m
▀▀█▀▀ ▒█▀▀▀█ ▒█▀▀▄ ▒█▀▀▀█ 　 ▒█▀▀█ ▒█▀▀▀█ ▒█▀▀█ ▒█▀▀█ ▒█▀▀▀ ▒█▀▀█ ▀▀█▀▀ ▒█▀▀▀█ 
░▒█░░ ▒█░░▒█ ▒█░▒█ ▒█░░▒█ 　 ▒█░░░ ▒█░░▒█ ▒█▄▄▀ ▒█▄▄▀ ▒█▀▀▀ ▒█░░░ ░▒█░░ ▒█░░▒█ 
░▒█░░ ▒█▄▄▄█ ▒█▄▄▀ ▒█▄▄▄█ 　 ▒█▄▄█ ▒█▄▄▄█ ▒█░▒█ ▒█░▒█ ▒█▄▄▄ ▒█▄▄█ ░▒█░░ ▒█▄▄▄█

░█▀▀█ ▒█░░░ ▒█░░░ 　 ▒█▀▀█ ▀█▀ ▒█▀▀█ ▒█░▒█ ▀▀█▀▀ 
▒█▄▄█ ▒█░░░ ▒█░░░ 　 ▒█▄▄▀ ▒█░ ▒█░▄▄ ▒█▀▀█ ░▒█░░ 
▒█░▒█ ▒█▄▄█ ▒█▄▄█ 　 ▒█░▒█ ▄█▄ ▒█▄▄█ ▒█░▒█ ░▒█░░\n\e[0m"
echo -e "\033[01;32m\033[01mTodas las dependencias se han instalado correctamente.\nAll dependencies have been installed successfully.\n\033[0m" 

echo -e "\e[35m
██╗░░██╗░░██╗░░  ██╗███╗░░██╗░██████╗████████╗░█████╗░██╗░░░░░██╗░░░░░
╚██╗░╚██╗░╚██╗░  ██║████╗░██║██╔════╝╚══██╔══╝██╔══██╗██║░░░░░██║░░░░░
░╚██╗░╚██╗░╚██╗  ██║██╔██╗██║╚█████╗░░░░██║░░░███████║██║░░░░░██║░░░░░
░██╔╝░██╔╝░██╔╝  ██║██║╚████║░╚═══██╗░░░██║░░░██╔══██║██║░░░░░██║░░░░░
██╔╝░██╔╝░██╔╝░  ██║██║░╚███║██████╔╝░░░██║░░░██║░░██║███████╗███████╗
╚═╝░░╚═╝░░╚═╝░░  ╚═╝╚═╝░░╚══╝╚═════╝░░░░╚═╝░░░╚═╝░░╚═╝╚══════╝╚══════╝

██╗░░██╗░░  ░██████╗░░█████╗░████████╗░█████╗░  ██████╗░░█████╗░████████╗
╚██╗░╚██╗░  ██╔════╝░██╔══██╗╚══██╔══╝██╔══██╗  ██╔══██╗██╔══██╗╚══██╔══╝
░╚██╗░╚██╗  ██║░░██╗░███████║░░░██║░░░███████║  ██████╦╝██║░░██║░░░██║░░░
░██╔╝░██╔╝  ██║░░╚██╗██╔══██║░░░██║░░░██╔══██║  ██╔══██╗██║░░██║░░░██║░░░
██╔╝░██╔╝░  ╚██████╔╝██║░░██║░░░██║░░░██║░░██║  ██████╦╝╚█████╔╝░░░██║░░░
╚═╝░░╚═╝░░  ░╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░╚═╝  ╚═════╝░░╚════╝░░░░╚═╝░░░\n\e[0m"
echo -e "\033[1;35m"
git clone https://github.com/GataNina-Li/GataBot-MD.git
echo -e "\033[01;32m\033[01mLa clonación se ha descargado e instalado correctamente.\nThe clone has been downloaded and installed successfully.\n\033[0m"

echo -e "\033[01;32m\033[01mCambiando al directorio del repositorio!!\nChanging to the repository directory!!\n\033[0m" 
cd GataBot-MD

clear
echo -e "\e[36m
░█▀▀█ ░█▀▀█ ─█▀▀█ ░█▀▀█ ▀█▀ ─█▀▀█ ░█▀▀▀█ 　 ░█▀▀█ ░█▀▀▀█ ░█▀▀█ 　 ░█▀▀▀█ ░█─░█ 
░█─▄▄ ░█▄▄▀ ░█▄▄█ ░█─── ░█─ ░█▄▄█ ─▀▀▀▄▄ 　 ░█▄▄█ ░█──░█ ░█▄▄▀ 　 ─▀▀▀▄▄ ░█─░█ 
░█▄▄█ ░█─░█ ░█─░█ ░█▄▄█ ▄█▄ ░█─░█ ░█▄▄▄█ 　 ░█─── ░█▄▄▄█ ░█─░█ 　 ░█▄▄▄█ ─▀▄▄▀ 

░█▀▀█ ░█▀▀█ ░█▀▀▀ ░█▀▀▀ ░█▀▀▀ ░█▀▀█ ░█▀▀▀ ░█▄─░█ ░█▀▀█ ▀█▀ ─█▀▀█ 
░█▄▄█ ░█▄▄▀ ░█▀▀▀ ░█▀▀▀ ░█▀▀▀ ░█▄▄▀ ░█▀▀▀ ░█░█░█ ░█─── ░█─ ░█▄▄█ 
░█─── ░█─░█ ░█▄▄▄ ░█─── ░█▄▄▄ ░█─░█ ░█▄▄▄ ░█──▀█ ░█▄▄█ ▄█▄ ░█─░█


▀▀█▀▀ ░█─░█ ─█▀▀█ ░█▄─░█ ░█─▄▀ ░█▀▀▀█ 　 ░█▀▀▀ ░█▀▀▀█ ░█▀▀█ 　 ░█──░█ ░█▀▀▀█ ░█─░█ ░█▀▀█ 
─░█── ░█▀▀█ ░█▄▄█ ░█░█░█ ░█▀▄─ ─▀▀▀▄▄ 　 ░█▀▀▀ ░█──░█ ░█▄▄▀ 　 ░█▄▄▄█ ░█──░█ ░█─░█ ░█▄▄▀ 
─░█── ░█─░█ ░█─░█ ░█──▀█ ░█─░█ ░█▄▄▄█ 　 ░█─── ░█▄▄▄█ ░█─░█ 　 ──░█── ░█▄▄▄█ ─▀▄▄▀ ░█─░█ 

░█▀▀█ ░█▀▀█ ░█▀▀▀ ░█▀▀▀ ░█▀▀▀ ░█▀▀█ ░█▀▀▀ ░█▄─░█ ░█▀▀█ ░█▀▀▀ 
░█▄▄█ ░█▄▄▀ ░█▀▀▀ ░█▀▀▀ ░█▀▀▀ ░█▄▄▀ ░█▀▀▀ ░█░█░█ ░█─── ░█▀▀▀ 
░█─── ░█─░█ ░█▄▄▄ ░█─── ░█▄▄▄ ░█─░█ ░█▄▄▄ ░█──▀█ ░█▄▄█ ░█▄▄▄\n\e[0m"

echo -e "\e[31m
_░▒███████
░██▓▒░░▒▓██
██▓▒░__░▒▓██___██████
██▓▒░____░▓███▓__░▒▓██
██▓▒░___░▓██▓_____░▒▓██
██▓▒░_______________░▒▓██
_██▓▒░______________░▒▓██
__██▓▒░____________░▒▓██
___██▓▒░__________░▒▓██
____██▓▒░________░▒▓██
_____██▓▒░_____░▒▓██
______██▓▒░__░▒▓██
_______█▓▒░░▒▓██
_________░▒▓██
_______░▒▓██
_____░▒▓██\n\e[0m"


#idioma_valido=""
#echo "Por favor, seleccione uno de los siguientes idiomas: en, es, pt, ar, o id."
#while [ "$idioma_valido" = false ]
#do
#    read -p "¿Qué idioma desea para el bot? " idioma_sh
#    if [ "$idioma_sh" = "en" ] || [ "$idioma_sh" = "es" ] || [ "$idioma_sh" = "pt" ] || [ "$idioma_sh" = "ar" ] || [ "$idioma_sh" = "id" ]
#    then
#        idioma_valido=true
#        sed -i "s/export let idioma_sh = null/export let idioma_sh = '$idioma_sh'/" config.js
#    else
#        echo -e "\u001b[31mIdioma no válido. Por favor, seleccione uno de los siguientes idiomas: en, es, pt, ar, o id."
#    fi
#don

#clear
echo -e "\033[01;32m\033[01mIniciando GataBot!!\nStarting CatBot!!\n\033[0m"
npm start


