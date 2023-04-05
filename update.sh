# Código creado por @gata_dios    
: << COMENTARIO
#!/data/data/com.termux/files/usr/bin/bash
BOT_DIR="GataBot-MD"
BOT_REPO="https://github.com/GataNina-Li/$BOT_DIR"
DB_FILE="database.json"
INSTALL_DP="yarn install --ignore-scripts && npm install && cd"

GREEN='\033[32m'
BOLD='\033[1m'
RESET='\033[0m' 

echo -e "${BOLD}${GREEN}Actualizando $BOT_DIR...${RESET}"
#if [[ $(pwd) == *$BOT_DIR ]]; then
if [[ $(basename "$PWD") == "$BOT_DIR" ]]; then
if [ -e "$DB_FILE" ]; then
echo -e "${BOLD}${GREEN}M1${RESET}"
echo -e "${BOLD}${GREEN}Moviendo database.json a $HOME y clonando el repositorio $BOT_REPO en $BOT_DIR...${RESET}"
mv "$DB_FILE" "$HOME" && cd && rm -rf "$BOT_DIR" && git clone "$BOT_REPO" && cd "$BOT_DIR" && $INSTALL_DP
else
echo -e "${BOLD}${GREEN}Clonando el repositorio $BOT_REPO en $BOT_DIR...${RESET}"
cd && rm -rf "$BOT_DIR" && git clone "$BOT_REPO" && cd "$BOT_DIR" && $INSTALL_DP
fi

if [ -e "$HOME/$DB_FILE" ]; then
echo -e "${BOLD}${GREEN}M1.1${RESET}"
echo -e "${BOLD}${GREEN}Rescatando archivo $DB_FILE...${RESET}"
mv "$HOME/$DB_FILE" "$BOT_DIR" && cd "$BOT_DIR" && npm start
echo -e "${BOLD}${GREEN}Iniciando el bot...${RESET}"
else
cd "$HOME/$BOT_DIR" && npm start
echo -e "${BOLD}${GREEN}Iniciando el bot...${RESET}"
fi

else
echo -e "${BOLD}${GREEN}M2${RESET}"
if [ -d "$HOME/$BOT_DIR" ]; then
if [ -e "$HOME/$BOT_DIR/$DB_FILE" ]; then
echo -e "${BOLD}${GREEN}M2.1${RESET}"
echo -e "${BOLD}${GREEN}Moviendo database.json a $HOME y clonando el repositorio $BOT_REPO en $BOT_DIR...${RESET}"
mv "$HOME/$BOT_DIR/$DB_FILE" "$HOME" && cd && rm -rf "$BOT_DIR" && git clone "$BOT_REPO" && cd "$BOT_DIR" && $INSTALL_DP
if [ -e "$HOME/$DB_FILE" ]; then
echo -e "${BOLD}${GREEN}M2.2${RESET}"
echo -e "${BOLD}${GREEN}Rescatando archivo $DB_FILE...${RESET}"
mv "$HOME/$DB_FILE" "$BOT_DIR" && cd "$BOT_DIR" && npm start
echo -e "${BOLD}${GREEN}Iniciando el bot...${RESET}"
else
echo -e "${BOLD}${GREEN}Iniciando el bot...${RESET}"
cd "$HOME/$BOT_DIR" && npm start
fi
else
echo -e "${BOLD}${GREEN}M3${RESET}"
echo -e "${BOLD}${GREEN}Clonando el repositorio $BOT_REPO en $BOT_DIR...${RESET}"
cd "$HOME" && rm -rf "$BOT_DIR" && git clone "$BOT_REPO" && cd "$BOT_DIR" && yarn install --ignore-scripts && npm install && npm start
fi
else
echo -e "${BOLD}${GREEN}M4${RESET}"
echo -e "${BOLD}${GREEN}Clonando el repositorio $BOT_REPO en $HOME/$BOT_DIR...${RESET}"
rm -rf "$BOT_DIR" && git clone "$BOT_REPO" && cd "$HOME/$BOT_DIR" && yarn install --ignore-scripts && npm install && cd $HOME
if [ -e "$HOME/$DB_FILE" ]; then
echo -e "${BOLD}${GREEN}Rescatando archivo $DB_FILE...${RESET}"
mv "$HOME/$DB_FILE" "$BOT_DIR" && cd "$BOT_DIR" && npm start
echo -e "${BOLD}${GREEN}Iniciando el bot...${RESET}"
else
echo -e "${BOLD}${GREEN}Iniciando el bot...${RESET}"
cd "$HOME/$BOT_DIR" && npm start
fi
fi
fi












#!/data/data/com.termux/files/usr/bin/bash
BOT_DIR="GataBot-MD"
BOT_REPO="https://github.com/GataNina-Li/$BOT_DIR"
DB_FILE="database.json"
INSTALL_DP="yarn install --ignore-scripts && npm install && cd"

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
cd "$HOME/$BOT_DIR" && npm start
fi
else
cd && cd "$HOME/$BOT_DIR" && npm start
fi
COMENTARIO
