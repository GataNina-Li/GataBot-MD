# Código creado por @gata_dios

#!/data/data/com.termux/files/usr/bin/bash 
# Interpretación determinada para la ejecución 

#echo -e "\u001b[36mInstalando dependencias!"
#echo -e "\033[01;32m\033[01mInstalando dependencias!\033[0m" #verde
echo -e "\033[1;31mInstalando dependencias!\033[0m"
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

echo -e "\u001b[36mInstalando Git..."
if pkg install git -y; then
  echo -e "\u001b[32mGit se ha instalado correctamente."
else
  echo -e "\u001b[31mNo se pudo instalar Git. Verifique su conexión a Internet e inténtelo de nuevo más tarde.\n\nSi el error continúa Instale de forma manual\n\n pkg install git -y \n pkg install nodejs -y \n pkg install ffmpeg -y \n pkg install imagemagick -y \n git clone https://github.com/GataNina-Li/GataBot-MD \n cd GataBot-MD \n npm start\n"
  exit 1
fi


echo -e "\u001b[36mInstalando Node.js..."
if pkg install nodejs -y; then
  echo -e "\u001b[32mNode.js se ha instalado correctamente."
else
  echo -e "\u001b[31mNo se pudo instalar Node.js. Verifique su conexión a Internet e inténtelo de nuevo más tarde.\n\nSi el error continúa Instale de forma manual\n\n pkg install git -y \n pkg install nodejs -y \n pkg install ffmpeg -y \n pkg install imagemagick -y \n git clone https://github.com/GataNina-Li/GataBot-MD \n cd GataBot-MD \n npm start\n"
  exit 1
fi


echo -e "\u001b[36mInstalando FFmpeg..."
if pkg install ffmpeg -y; then
  echo -e "\u001b[32mFFmpeg se ha instalado correctamente."
else
  echo -e "\u001b[31mNo se pudo instalar FFmpeg. Verifique su conexión a Internet e inténtelo de nuevo más tarde.\n\nSi el error continúa Instale de forma manual\n\n pkg install git -y \n pkg install nodejs -y \n pkg install ffmpeg -y \n pkg install imagemagick -y \n git clone https://github.com/GataNina-Li/GataBot-MD \n cd GataBot-MD \n npm start\n"
  exit 1
fi


echo -e "\u001b[36mInstalando ImageMagick..."
if pkg install imagemagick -y; then
  echo -e "\u001b[32mImageMagick se ha instalado correctamente."
else
  echo -e "\u001b[31mNo se pudo instalar ImageMagick. Verifique su conexión a Internet e inténtelo de nuevo más tarde.\n\nSi el error continúa Instale de forma manual\n\n pkg install git -y \n pkg install nodejs -y \n pkg install ffmpeg -y \n pkg install imagemagick -y \n git clone https://github.com/GataNina-Li/GataBot-MD \n cd GataBot-MD \n npm start\n"
  exit 1
fi

echo -e "\u001b[32mTodas las dependencias se han instalado correctamente."

echo -e "\u001b[36mClonando el repositorio!"
git clone https://github.com/GataNina-Li/GataBot-MD.git

echo -e "\u001b[36mCambiando al directorio del repositorio!"
cd GataBot-MD

echo -e "\u001b[36mIniciando GataBot!"
npm start


