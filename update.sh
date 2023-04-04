: <<'COMMENT'
#!/data/data/com.termux/files/usr/bin/bash

if [[ $(pwd) == *GataBot-MD ]]; then
if [ -e "database.js" ]; then
mv database.js $HOME && cd && rm -rf GataBot-MD && git clone https://github.com/GataNina-Li/GataBot-MD && cd GataBot-MD && yarn install && npm install && cd
else
cd && rm -rf GataBot-MD && git clone https://github.com/GataNina-Li/GataBot-MD && cd GataBot-MD && yarn install && npm install && cd
fi
  
if [ -e "$HOME/database.js" ]; then
mv database.js /GataBot-MD && cd GataBot-MD && npm start
else
cd GataBot-MD && npm start
fi
else
if [ -e "$HOME/GataBot-MD/database.js" ]; then
cd "$HOME/GataBot-MD" && mv database.js /GataBot-MD && cd GataBot-MD && npm start
else
cd && rm -rf GataBot-MD && git clone https://github.com/GataNina-Li/GataBot-MD && cd GataBot-MD && yarn install && npm install && cd && npm start
fi
fi
COMMENT

#!/data/data/com.termux/files/usr/bin/bash

if [[ $(pwd) == *GataBot-MD ]]; then
if [ -e "database.js" ]; then
mv database.js $HOME && cd && rm -rf GataBot-MD && git clone https://github.com/GataNina-Li/GataBot-MD && cd GataBot-MD && yarn install && npm install && cd
else
cd && rm -rf GataBot-MD && git clone https://github.com/GataNina-Li/GataBot-MD && cd GataBot-MD && yarn install && npm install && cd
fi

if [ -e "$HOME/database.js" ]; then
mv database.js /GataBot-MD && cd GataBot-MD && npm start
else
cd GataBot-MD && npm start
fi
else
if [ -d "$HOME/GataBot-MD" ]; then
cd GataBot-MD
if [ -e "GataBot-MD/database.js" ]; then
mv database.js $HOME && cd && rm -rf GataBot-MD && git clone https://github.com/GataNina-Li/GataBot-MD && cd GataBot-MD && yarn install && npm install && cd
if [ -e "$HOME/database.js" ]; then
mv database.js /GataBot-MD && cd GataBot-MD && npm start
else
cd GataBot-MD && npm start
fi
else
cd && rm -rf GataBot-MD && git clone https://github.com/GataNina-Li/GataBot-MD && cd GataBot-MD && yarn install && npm install && npm start
fi
else
rm -rf GataBot-MD && git clone https://github.com/GataNina-Li/GataBot-MD && cd GataBot-MD && yarn install && npm install && npm start
fi
fi

