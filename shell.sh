#!/bin/bash

# ==========================================
# Auto-Push a GitHub
# From AzamiJs for Mobile Developers
# ==========================================
# Detecta cambios en tu proyecto y hace push automáticamente.
# Ideal para ediciones desde el celular.

# Requisito:
# pkg install inotify-tools

# Y ejecute usando
# bash shell.sh

# Aviso:
# Edita este archivo localmente, NO en el repositorio.
# Tus credenciales de GitHub se mantienen confidenciales
# y no se subirán al repositorio.
# ==========================================


RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
CYAN='\033[1;36m'
RESET='\033[0m'

PROJECT_PATH="${1:-$(pwd)}"
SCRIPT_NAME="$(basename "$0")"

# Agrega tus credenciales
# Obten tu token aquí
# (https://github.com/settings/personal-access-tokens/new)
GITHUB_TOKEN="TOKEN"
GITHUB_USER="USER"
GITHUB_REPO="REPO"

if [ -n "$GITHUB_TOKEN" ]; then
GIT_REMOTE="https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git"
git remote set-url origin "$GIT_REMOTE" 2>/dev/null
else
GIT_REMOTE="https://github.com/${GITHUB_USER}/${GITHUB_REPO}.git"
git remote set-url origin "$GIT_REMOTE" 2>/dev/null
fi

cd "$PROJECT_PATH" || { echo "No se pudo acceder a $PROJECT_PATH"; exit 1; }

phrases=(
"Auto Push "
"Commit automático"
"Zam: update"
"GataBot-MD"
"GataDios"
)

log() {
 echo -e "${CYAN}[$(date +'%H:%M:%S')]${RESET} $1"
}

log "Buscando cambios en: ${GREEN}$PROJECT_PATH${RESET}"

while true; do
inotifywait -e modify,create,delete -r "$PROJECT_PATH" --exclude "\.git|node_modules" |
while read -r directory events filename; do

log "${YELLOW}Cambios detectados en:${RESET} $filename"

git add . ":!$SCRIPT_NAME"

if ! git diff --cached --quiet; then
commit_message="${phrases[$RANDOM % ${#phrases[@]}]} | $(date +'%d-%m %H:%M')"
git commit -m "$commit_message"
echo -e "${BLUE}Commit realizado con mensaje:${RESET} ${GREEN}\"$commit_message\"${RESET}"
else
echo -e "${RED}No hay cambios para subir.${RESET}"
fi

if git push; then
log "${GREEN}Push completado ✅${RESET}\n"
else
log "${RED}Error al hacer push ${RESET}\n"
fi

done
done
