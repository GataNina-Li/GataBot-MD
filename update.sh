#!/data/data/com.termux/files/usr/bin/bash
BOT_DIR="GataBot-MD"
BOT_REPO="https://github.com/GataNina-Li/$BOT_DIR"
DB_FILE="database.json"
INSTALL_DP="yarn install --force --ignore-scripts && npm install && cd"

GREEN='\033[32m'
BOLD='\033[1m'
RESET='\033[0m'

if [[ $(basename "$PWD") == "$BOT_DIR" ]]; then
if [ -e "$DB_FILE" ]; then
echo -e "${BOLD}${GREEN}Moviendo database.json a $HOME y clonando el repositorio $BOT_REPO en $BOT_DIR...${RESET}"
mv "$DB_FILE" "$HOME" && cd && rm -rf "$BOT_DIR" && git clone "$BOT_REPO" && cd "$BOT_DIR" && $INSTALL_DP
else
echo -e "${BOLD}${GREEN}Clonando el repositorio $BOT_REPO en $BOT_DIR...${RESET}"
cd && rm -rf "$BOT_DIR" && git clone "$BOT_REPO" && cd "$BOT_DIR" && $INSTALL_DP
fi

if [[ $(basename "$PWD") == "$HOME" ]]; then
if [ -e "$HOME/$DB_FILE" ]; then
echo -e "${BOLD}${GREEN}Rescatando archivo $DB_FILE...${RESET}"
mv "$HOME/$DB_FILE" "$BOT_DIR" && cd "$BOT_DIR" && npm start
else
echo -e "${BOLD}${GREEN}Iniciando $BOT_DIR...${RESET}"
cd "$HOME/$BOT_DIR" && npm start
fi
else
echo -e "${BOLD}${GREEN}Iniciando $BOT_DIR...${RESET}"
cd && cd "$HOME/$BOT_DIR" && npm start
fi

else
echo -e "${BOLD}${GREEN}Ubicación actual predeterminada.${RESET}"
cd "$HOME"
if [ -e "$HOME/$BOT_DIR" ]; then
echo -e "${BOLD}${GREEN}Dirigiéndome a $BOT_DIR${RESET}"
cd "$HOME/$BOT_DIR"
if [ -e "$HOME/$BOT_DIR/$DB_FILE" ]; then
echo -e "${BOLD}${GREEN}Moviendo $DB_FILE a $HOME y clonando el repositorio $BOT_REPO en $HOME...${RESET}"
mv "$DB_FILE" "$HOME" && cd && rm -rf "$BOT_DIR" && git clone "$BOT_REPO" && cd "$BOT_DIR" && $INSTALL_DP
if [ -e "$HOME/$DB_FILE" ]; then
echo -e "${BOLD}${GREEN}Rescatando archivo $DB_FILE...${RESET}"
mv "$HOME/$DB_FILE" "$BOT_DIR" && cd "$BOT_DIR" && npm start
else
echo -e "${BOLD}${GREEN}Iniciando $BOT_DIR...${RESET}"
cd "$BOT_DIR" && npm start
fi
else
echo -e "${BOLD}${GREEN}No se encontro $DB_FILE. Clonando el repositorio $BOT_REPO en $HOME...${RESET}"
cd && rm -rf "$BOT_DIR" && git clone "$BOT_REPO" && cd "$BOT_DIR" && yarn install --force --ignore-scripts && npm install && npm start
fi
else
echo -e "${BOLD}${GREEN}No se encontro $BOT_DIR. Clonando el repositorio $BOT_REPO en $HOME...${RESET}"
git clone "$BOT_REPO" && cd "$BOT_DIR" && yarn install --force --ignore-scripts && npm install && npm start
fi
fi


