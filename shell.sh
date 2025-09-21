#!/bin/bash

# ==========================================
# Script de Auto-Push a GitHub
# Detecta cambios en los archivos del proyecto
# y realiza push automático.
# Ideal para usuarios que editan desde el celular.

# Instala iNotify
# pkg install inotify-tools
# ==========================================

RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
CYAN='\033[1;36m'
RESET='\033[0m'

# Ruta del proyecto (ajústala según tu entorno)
PROJECT_PATH="/data/data/com.termux/files/home/storage/"
SCRIPT_NAME="shell.sh"
cd "$PROJECT_PATH" || exit

# URL del repositorio con token
GIT_REMOTE="https://TU_TOKEN@github.com/TU_USUARIO/TU_REPOSITORIO.git"
git remote set-url origin "$GIT_REMOTE" 2>/dev/null

# Mensajes aleatorios para commits
phrases=(
"Auto Push"
"Este es un commit automático"
"Zam: meeee"
"GataDios"
"GataBot-MD"
)

# Loop infinito para detectar cambios
while true; do
inotifywait -e modify,create,delete -r "$PROJECT_PATH"

echo -e "${CYAN}[$(date +'%H:%M:%S')]${RESET} ${YELLOW}Cambios detectados, realizando push automático...${RESET}"

git add . ":!$SCRIPT_NAME"

if ! git diff --cached --quiet; then
# Selecciona un mensaje aleatorio para el commit
commit_message=${phrases[$RANDOM % ${#phrases[@]}]}
git commit -m "$commit_message"
echo -e "${BLUE}Commit realizado con mensaje:${RESET} ${GREEN}\"$commit_message\"${RESET}"
else
echo -e "${RED}No hay cambios para commitear.${RESET}"
fi

git push

echo -e "${CYAN}[$(date +'%H:%M:%S')]${RESET} ${GREEN}Push completado ✅${RESET}\n"
done