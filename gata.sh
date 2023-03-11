# Código creado por @gata_dios

#!/data/data/com.termux/files/usr/bin/bash 
# Interpretación determinada para la ejecución 
echo -e "\033[43m\033[31mHola, mundo!\033[0m"
echo -e "\033[01;32m\033[01mInstalando dependencias!!\n\033[0m" 
echo -e "\e[35m
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

if pkg install git -y; then
echo -e "\u001b[32mGit se ha instalado correctamente."
else
echo -e "\033[1;31mNo se pudo instalar Git. Verifique su conexión a Internet e inténtelo de nuevo más tarde. Si el error continúa, instale de forma manual\033[0m" 
echo -e "\033[01;33mpkg install git -y
pkg install nodejs -y
pkg install ffmpeg -y
pkg install imagemagick -y
git clone https://github.com/GataNina-Li/GataBot-MD
cd GataBot-MD
npm start\033[0m"
exit 1
fi


echo -e "\u001b[36mInstalando Node.js..."
if pkg install nodejs -y; then
  echo -e "\u001b[32mNode.js se ha instalado correctamente."
else
echo -e "\033[1;31mNo se pudo instalar Git. Verifique su conexión a Internet e inténtelo de nuevo más tarde. Si el error continúa, instale de forma manual\033[0m" 
echo -e "\033[01;33mpkg install git -y
pkg install nodejs -y
pkg install ffmpeg -y
pkg install imagemagick -y
git clone https://github.com/GataNina-Li/GataBot-MD
cd GataBot-MD
npm start\033[0m"
  exit 1
fi


echo -e "\u001b[36mInstalando FFmpeg..."
if pkg install ffmpeg -y; then
  echo -e "\u001b[32mFFmpeg se ha instalado correctamente."
else
echo -e "\033[1;31mNo se pudo instalar Git. Verifique su conexión a Internet e inténtelo de nuevo más tarde. Si el error continúa, instale de forma manual\033[0m" 
echo -e "\033[01;33mpkg install git -y
pkg install nodejs -y
pkg install ffmpeg -y
pkg install imagemagick -y
git clone https://github.com/GataNina-Li/GataBot-MD
cd GataBot-MD
npm start\033[0m"  
  exit 1
fi


echo -e "\u001b[36mInstalando ImageMagick..."
if pkg install imagemagick -y; then
  echo -e "\u001b[32mImageMagick se ha instalado correctamente."
else
echo -e "\033[1;31mNo se pudo instalar Git. Verifique su conexión a Internet e inténtelo de nuevo más tarde. Si el error continúa, instale de forma manual\033[0m" 
echo -e "\033[01;33mpkg install git -y
pkg install nodejs -y
pkg install ffmpeg -y
pkg install imagemagick -y
git clone https://github.com/GataNina-Li/GataBot-MD
cd GataBot-MD
npm start\033[0m"
exit 1
fi

echo -e "\u001b[32mTodas las dependencias se han instalado correctamente."

echo -e "\u001b[36mClonando el repositorio!"
git clone https://github.com/GataNina-Li/GataBot-MD.git

echo -e "\u001b[36mCambiando al directorio del repositorio!"
cd GataBot-MD

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
#done

clear

echo -e "\u001b[36mIniciando GataBot!"
npm start


