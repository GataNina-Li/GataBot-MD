# Código creado por @gata_dios    

#!/data/data/com.termux/files/usr/bin/bash
BOT_DIR="GataBot-MD"
BOT_REPO="https://github.com/GataNina-Li/$BOT_DIR"
DB_FILE="database.json"
INSTALL_DP="yarn install && npm install && cd"

if [[ $(pwd) == *$BOT_DIR ]]; then
if [ -e "$DB_FILE" ]; then
mv "$DB_FILE" "$HOME" && cd && rm -rf "$BOT_DIR" && git clone "$BOT_REPO" && cd "$BOT_DIR" && $INSTALL_DP
else
cd && rm -rf "$BOT_DIR" && git clone "$BOT_REPO" && cd "$BOT_DIR" && $INSTALL_DP
fi

if [ -e "$HOME/$DB_FILE" ]; then
mv "$DB_FILE" "/$BOT_DIR" && cd "$BOT_DIR" && npm start
else
cd "$BOT_DIR" && npm start
fi
else
if [ -d "$HOME/$BOT_DIR" ]; then
cd "$BOT_DIR"

if [ -e "$BOT_DIR/$DB_FILE" ]; then
mv "$DB_FILE" "$HOME" && cd && rm -rf "$BOT_DIR" && git clone "$BOT_REPO" && cd "$BOT_DIR" && $INSTALL_DP

if [ -e "$HOME/$DB_FILE" ]; then
mv "$DB_FILE" "/$BOT_DIR" && cd "$BOT_DIR" && npm start
else
cd "$BOT_DIR" && npm start
fi
else
cd && rm -rf "$BOT_DIR" && git clone "$BOT_REPO" && cd "$BOT_DIR" && yarn install && npm install && npm start
fi
else
rm -rf "$BOT_DIR" && git clone "$BOT_REPO" && cd "$BOT_DIR" && yarn install && npm install && npm start
fi
fi
