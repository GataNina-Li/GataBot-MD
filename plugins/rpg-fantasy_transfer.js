// Código elaborado por: https://github.com/GataNina-Li

import fetch from 'node-fetch'  
import fs from 'fs'
const fantasyDBPath = './fantasy.json'
let fantasyDB = []
let fake
let handler = async (m, { text, usedPrefix, command, conn }) => {
let userId = m.sender
if (fs.existsSync(fantasyDBPath)) {
fantasyDB = JSON.parse(fs.readFileSync(fantasyDBPath, 'utf8'))
} else {
fake = { contextInfo: { externalAdReply: { title: `🌟 ¡Colecciona Personajes!`, body: `Compra un personaje y vuelve aquí`, sourceUrl: accountsgb, thumbnailUrl: gataMenu }}}
conn.reply(m.chat, `Para usar este comando primero debes comprar al menos un personaje. Usa *${usedPrefix}fy*`, m, fake)
return
}

let user, character
if (m.quoted && userId === m.quoted.sender) {
fake = { contextInfo: { externalAdReply: { title: `Transfiera a otro Usuario 🧐`, body: `Algo no salió bien...`, sourceUrl: accountsgb, thumbnailUrl: gataMenu }}}
return conn.reply(m.chat, '> *No puedes hacer una transferencia a ti mismo* ⚠️', m, fake)
}
if (m.quoted && m.quoted.sender && text) {
user = m.quoted.sender
character = text.trim()
} else if (text) {
let [userText, characterText] = text.split(/[|,&\/\\]+/).map(v => v.trim())
if (!userText || !characterText) {
fake = { contextInfo: { externalAdReply: { title: `❌ Parámetros incompletos`, body: `Algo no salió bien...`, sourceUrl: accountsgb, thumbnailUrl: gataMenu }}}
return conn.reply(m.chat, `*Use un caracter en medio del Usuario y personaje*\n\n> *Caracteres aceptados:*\n\`(|), (,), (\\), (&), y (/)\`\n\n> *Ejemplo:*\n\`${usedPrefix + command} Usuario | Personaje\`\n\n> *Para ver tus Personajes, escriba:*\n\`${usedPrefix}fantasymy o ${usedPrefix}fymy\``, m, fake)
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
fake = { contextInfo: { externalAdReply: { title: `❌ Parámetros incompletos`, body: `Algo no salió bien...`, sourceUrl: accountsgb, thumbnailUrl: gataMenu }}}
return conn.reply(m.chat, `*Use un caracter en medio del Usuario y personaje*\n\n> *Caracteres aceptados:*\n\`(|), (,), (\\), (&), y (/)\`\n\n> *Ejemplo:*\n\`${usedPrefix + command} Usuario | Personaje\`\n\n> *Para ver tus Personajes, escriba:*\n\`${usedPrefix}fantasymy o ${usedPrefix}fymy\``, m, fake)
}}} else {
if (m.quoted && !text) {
return conn.reply(m.chat, `*Responda a un mensaje de @${m.quoted.sender.split('@')[0]} escribiendo el nombre o código del personaje*\n\n> *Para ver tus Personajes, escriba:*\n\`${usedPrefix}fantasymy o ${usedPrefix}fymy\``, m, { mentions: [m.quoted.sender] })
}
return conn.reply(m.chat, `*Etiqueta o escriba el número del usuario y nombre o código del personaje*\n\n> *Ejemplo:*\n\`${usedPrefix + command} usuario | personaje\`\n\n> _También puede responder al mensaje del usuario escribiendo el nombre o código del personaje_\n\n> *Para ver tus Personajes, escriba:*\n\`${usedPrefix}fantasymy o ${usedPrefix}fymy\``, m)
}

let senderIndex = fantasyDB.findIndex(obj => obj.hasOwnProperty(userId))
if (senderIndex == -1) return conn.reply(m.chat, `> *Primero compra un personaje usando:*\n\n\`${usedPrefix}fantasy o ${usedPrefix}fy\``, m)
let recipientIndex = fantasyDB.findIndex(obj => obj.hasOwnProperty(user))
if (recipientIndex == -1) return conn.reply(m.chat, `*El usuario @${user.split('@')[0]} no puede recibir transferencias de personajes*\n\n> *Motivo:* _Sólo puedes transferir tus personajes a usuarios que hayan comprado mínimo un personaje_\n\n*@${user.split('@')[0]} Compra un personaje para recibir/enviar transferencias*\n\`${usedPrefix}fantasy o ${usedPrefix}fy\``, m, { mentions: [user] })

let senderData = fantasyDB[senderIndex][userId]
let characterIndex = senderData.fantasy.findIndex(obj => obj.name == character || obj.id == character)
if (characterIndex == -1) return conn.reply(m.chat, `*No hemos encontrado "${character}"*\n\n> *Motivo:* _Puede deberse a que no tiene ese personaje o está mal escrito el nombre o código del personaje_\n\n> *Para ver tus Personajes, escriba:*\n\`${usedPrefix}fantasymy o ${usedPrefix}fymy\``, m)

let id_message
if (characterIndex != -1) {
let mensajeConfirmacion = `> *Esto pasará si transfieres "${senderData.fantasy[characterIndex].name}" a @${user.split('@')[0]}*\n
- _Los datos del personaje ya no serán tuyos_
- _También se transferirán marcadores del personaje_
- _No se te restará ni reembolsará la compra por el personaje_
- _Tú calificación del personaje no se cambiará_\n
> _Si deseas continuar con la transferencia, escriba *"Si"* respondiendo a este mensaje, de lo contrario escriba *"No"*_`
id_message = (await conn.reply(m.chat, mensajeConfirmacion, m, { mentions: [user] })).key.id
}

const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
const response = await fetch(jsonURL)
const data = await response.json()
const imageInfo = data.infoImg.find(img => img.name.toLowerCase() === character.toLowerCase() || img.code === character)
const imageURL = imageInfo.url
let usuarioExistente = fantasyDB.find(usuario => Object.keys(usuario)[0] === m.sender)  
handler.before = async (m) => {    
let senderCharacter
if (!usuarioExistente || !usuarioExistente[m.sender]?.fantasy?.some(personaje => personaje.id === imageInfo.code)) return
if (m.quoted && m.quoted.id == id_message && ['si', '👍'].includes(m.text.toLowerCase())) {
let receiverIndex = recipientIndex

for (let i = 0; i < senderData.fantasy.length; i++) {
let characterData = senderData.fantasy[i]
if (characterData.id === character || characterData.name === character) {
senderCharacter = characterData

let receiverData = fantasyDB[receiverIndex][user]
if (!receiverData) {
receiverData = {}
fantasyDB[receiverIndex][user] = receiverData
}
if (!receiverData.fantasy) {
receiverData.fantasy = []
}
receiverData.fantasy.push(senderCharacter)
senderData.fantasy.splice(i, 1)
break
}}
let userInDB = fantasyDB.find(userEntry => userEntry[userId])
let userReceiverDB = fantasyDB.find(userEntry => userEntry[user])
if (senderCharacter && userInDB && userReceiverDB) {
fantasyDB[senderIndex][userId] = senderData
userInDB[userId].record[0].total_character_transfer += 1
userInDB[userId].record[0].total_purchased -= 1
userReceiverDB[user].record[0].total_purchased += 1
fs.writeFileSync(fantasyDBPath, JSON.stringify(fantasyDB, null, 2), 'utf8')
let fytxt = `> *Transferencia completada* ✅\n
El personaje *"${senderCharacter.name}"* ahora lo tiene *@${user.split('@')[0]}*\n\n> _Use *${usedPrefix}fyranking* para ver su ranking_`
await conn.sendMessage(m.chat, { image: { url: imageURL }, caption: fytxt, mentions: [user] }, { quoted: fkontak })
  
} else {
return conn.reply(m.chat, '*El personaje no te pertenece*', m)
}}
  
if (m.quoted && m.quoted.id == id_message && ['no', '👎'].includes(m.text.toLowerCase())) {
fake = { contextInfo: { externalAdReply: { title: `✋ Decidió no continuar`, body: `No se hizo transferencia`, sourceUrl: accountsgb, thumbnailUrl: gataMenu }}}
return conn.reply(m.chat, `La transferencia de *"${senderData.fantasy[characterIndex].name}"* fue cancelada`, m, fake)  
}}
return
}

handler.command = /^(fantasytransfer|fytransfer|fyentregar|fytr)$/i
export default handler
