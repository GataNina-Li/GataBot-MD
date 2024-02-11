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
return conn.reply(m.chat, '> *No puedes hacer una transferencia a ti mismo* ⚠️', m)
}
if (m.quoted && m.quoted.sender && text) {
user = m.quoted.sender
character = text.trim()
} else if (text) {
let [userText, characterText] = text.split(/[|,&\/\\]+/).map(v => v.trim())
if (!userText || !characterText) {
return conn.reply(m.chat, `*Use un caracter en medio del Usuario y personaje*\n\n> *Caracteres aceptados:*\n\`(|), (,), (\\), (&), y (/)\`\n\n> *Ejemplo:*\n\`${usedPrefix + command} Usuario | Personaje\`\n\n> *Para ver sus persoanjes, escriba:*\n\`${usedPrefix}fantasymy o ${usedPrefix}fymy\``, m)
}
let isUserNumber = userText.endsWith('@s.whatsapp.net')
let isCharNumber = characterText.endsWith('@s.whatsapp.net')
if (isUserNumber) {
user = userText.includes('@') ? userText : userText + '@s.whatsapp.net'
character = characterText
} else if (isCharNumber) {
user = characterText.includes('@') ? characterText : characterText + '@s.whatsapp.net'
character = userText;
} else {
let hasFiveDigitsUser = (userText.match(/\d/g) || []).length >= 5
let hasFiveDigitsChar = (characterText.match(/\d/g) || []).length >= 5
if (hasFiveDigitsUser) {
user = userText.replace(/[^\d]/g, '') + '@s.whatsapp.net'
character = characterText
} else if (hasFiveDigitsChar) {
user = characterText.replace(/[^\d]/g, '') + '@s.whatsapp.net'
character = userText
} else {
return conn.reply(m.chat, `*Use un caracter en medio del Usuario y personaje*\n\n> *Caracteres aceptados:*\n\`(|), (,), (\\), (&), y (/)\`\n\n> *Ejemplo:*\n\`${usedPrefix + command} Usuario | Personaje\`\n\n> *Para ver tus persoanjes, escriba:*\n\`${usedPrefix}fantasymy o ${usedPrefix}fymy\``, m)
}}} else {
if (m.quoted && !text) {
return conn.reply(m.chat, `*Responda a un mensaje de @${m.quoted.sender.split('@')[0]} escribiendo el nombre o código del personaje*\n\n> *Para ver tus persoanjes, escriba:*\n\`${usedPrefix}fantasymy o ${usedPrefix}fymy\``, m, { mentions: [m.quoted.sender] })
}
return conn.reply(m.chat, `*Etiqueta o escriba el número del usuario y nombre o código del personaje*\n\n> *Ejemplo:*\n\`${usedPrefix + command} usuario | personaje\`\n\n> _También puede responder al mensaje del usuario escribiendo el nombre o código del personaje_\n\n> *Para ver tus persoanjes, escriba:*\n\`${usedPrefix}fantasymy o ${usedPrefix}fymy\``, m)
}

let senderIndex = fantasyDB.findIndex(obj => obj.hasOwnProperty(m.sender))
let senderData = fantasyDB[senderIndex][m.sender]
//if (!senderData.fantasy || senderData.fantasy.length == 0) return conn.reply(m.chat, 'No hemos encontrado personajes en tu colección', m)       
if (senderIndex == -1) return conn.reply(m.chat, `> *Primero compra un personaje usando:*\n\n\`${usedPrefix}fantasy o ${usedPrefix}fy\``, m)
let recipientIndex = fantasyDB.findIndex(obj => obj.hasOwnProperty(user))
if (recipientIndex == -1) return conn.reply(m.chat, `*El usuario @${user.split('@')[0]} no puede recibir transferencias de personajes*\n\n> *Motivo:* _Sólo puedes transferir tus personajes a usuarios que hayan comprado mínimo un personaje_\n\n*@${user.split('@')[0]} Compra un personaje para recibir/enviar transferencias*\n\`${usedPrefix}fantasy o ${usedPrefix}fy\``, m, { mentions: [user] })
      
let characterIndex = senderData.fantasy.findIndex(obj => obj.name == character || obj.id == character)
if (characterIndex == -1) return conn.reply(m.chat, `*No hemos encontrado "${character}"*\n\n> *Motivo:* _Puede deberse a que no tiene ese personaje o está mal escrito el nombre o código del personaje_\n\n> *Para ver tus persoanjes, escriba:*\n\`${usedPrefix}fantasymy o ${usedPrefix}fymy\``, m)
    
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

let characterData = senderData.fantasy.splice(characterIndex, 1)[0]
fantasyDB[recipientIndex][user].fantasy.push(characterData)
fs.writeFileSync(fantasyDBPath, JSON.stringify(fantasyDB, null, 2), 'utf8')
conn.reply(m.chat, `Hemos transferido el personaje ${characterData.name} a ${user}`, m)
}

handler.command = /^(fantasytransfer|fytransfer|fyregalar)$/i
export default handler
