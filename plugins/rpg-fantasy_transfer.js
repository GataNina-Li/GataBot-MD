import fetch from 'node-fetch'  
import fs from 'fs'
const fantasyDBPath = './fantasy.json'
let fantasyDB = []

let handler = async (m, { text, usedPrefix, command, conn }) => {
if (fs.existsSync(fantasyDBPath)) {
fantasyDB = JSON.parse(fs.readFileSync(fantasyDBPath, 'utf8'))
} else {
conn.reply(m.chat, `Para usar este comando primero debes comprar al menos un personaje. Usa *${usedPrefix}fy*`, m)
return
}

let user, character
if (m.quoted && m.sender === m.quoted.sender) {
return conn.reply(m.chat, 'No puedes hacer una transferencia a ti mismo', m)
}
if (m.quoted && m.quoted.sender && text) {
user = m.quoted.sender
character = text.trim()
} else if (text) {
let [userText, characterText] = text.split(/[|,&\/\\]+/).map(v => v.trim())
if (!userText || !characterText) {
return conn.reply(m.chat, `*Use un caracter en medio del Usuario y personaje*

> *Caracteres aceptados:*
\`(|), (,), (\\), (&), y (/)\`

> *Ejemplos:*
» \`${usedPrefix + command} @${m.sender.split('@')[0]} | Personaje\`
» \`${usedPrefix + command} @${m.sender.split('@')[0]} & Personaje\`
» \`${usedPrefix + command} @${m.sender.split('@')[0]}, Personaje\`
`, m, { mentions: { mentionedJid: [m.sender] }})
}
let userArg = userText.replace(/[^\d]/g, '')
user = userArg.endsWith('@s.whatsapp.net') ? userArg : userArg + '@s.whatsapp.net'
if (userText.endsWith('@s.whatsapp.net')) {
user = userText
character = characterText
} else if (characterText.endsWith('@s.whatsapp.net')) {
user = characterText
character = userText
} else {
return conn.reply(m.chat, 'Recuerda usar "|, /, y" para separar el usuario y nombre del personaje 2', m)
}} else {
if(m.quoted && !text) {
return conn.reply(m.chat, 'Escriba el nombre o código del personaje', m)
}
return conn.reply(m.chat, `*Etiqueta o escriba el número del usuario y nombre o código del personaje*\n\n> *Ejemplo:*\n\`${usedPrefix + command} usuario | personaje\`\n\n> _También puede responder al mensaje del usuario escribiendo el nombre o código del personaje_\n\n> *Para ver sus persoanjes, escriba:*\n\`${usedPrefix}fantasymy o ${usedPrefix}fymy\``, m)
}


let senderIndex = fantasyDB.findIndex(obj => obj.hasOwnProperty(m.sender))
if (senderIndex == -1) return conn.reply(m.chat, 'No estás en la base de datos', m)
let recipientIndex = fantasyDB.findIndex(obj => obj.hasOwnProperty(user))
if (recipientIndex == -1) return conn.reply(m.chat, `El usuario ${user} al que deseas dar un personaje no está en la base de datos`, m)
    
let senderData = fantasyDB[senderIndex][m.sender]
if (!senderData.fantasy || senderData.fantasy.length == 0) return conn.reply(m.chat, 'No hemos encontrado personajes en tu colección', m)   
    
let characterIndex = senderData.fantasy.findIndex(obj => obj.name == character || obj.id == character)
if (characterIndex == -1) return conn.reply(m.chat, `No hemos encontrado ${character}, esto puede ser porque no lo tienes, o has escrito mal el nombre o código del personaje`, m)
    
const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
let response = await fetch(jsonURL)
let data = await response.json()

let senderCharacter = senderData.fantasy[characterIndex]
let found
if (senderCharacter.id === character || senderCharacter.name === character) {
found = data.find(({ code }) => senderCharacter.id === code)
} else {
found = data.find(({ name }) => senderCharacter.name === name)
}

if (!found) return conn.reply(m.chat, `No hemos encontrado ${character} en la base de datos externa`, m)

let characterData = senderData.fantasy.splice(characterIndex, 1)[0]
fantasyDB[recipientIndex][user].fantasy.push(characterData)
fs.writeFileSync(fantasyDBPath, JSON.stringify(fantasyDB, null, 2), 'utf8')
conn.reply(m.chat, `Hemos transferido el personaje ${characterData.name} a ${user}`, m)
}

handler.command = /^(fantasytransfer|fytransfer|fyregalar)$/i
export default handler
