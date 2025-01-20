// Código elaborado por: https://github.com/GataNina-Li

import fetch from 'node-fetch'  
import fs from 'fs'
const fantasyDBPath = './fantasy.json'
let jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
let id_message, pp, dato, fake, user, estado, idUsuarioExistente, nombreImagen, fantasyDB, response, data, userId, voto, emojiSaved = null
const likeEmojisArrays = ['👍', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿']
const dislikeEmojisArrays = ['👎', '👎🏻', '👎🏼', '👎🏽', '👎🏾', '👎🏿']
const superlikeEmojisArrays = ['🩷', '❤️', '🧡', '💛', '💚', '🩵', '💙', '💜', '🖤', '🩶', '🤍', '🤎']

let handler = async (m, { command, usedPrefix, conn }) => {
let user = global.db.data.users[m.sender]
//let time = user.fantasy + 300000 //5 min
//if (new Date - user.fantasy < 300000) return await conn.reply(m.chat, `⏱️ 𝙑𝙪𝙚𝙡𝙫𝙖 𝙚𝙣 ${msToTime(time - new Date())} 𝙉𝙊 𝙃𝘼𝙂𝘼 𝙎𝙋𝘼𝙈`, m)
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
try {
response = await fetch(jsonURL)
data = await response.json()

if (data.infoImg && data.infoImg.length > 0) {
dato = data.infoImg[Math.floor(Math.random() * data.infoImg.length)]
pp = await conn.profilePictureUrl(who, 'image').catch((_) => dato.url)

fantasyDB = []
if (fs.existsSync(fantasyDBPath)) {
const data = fs.readFileSync(fantasyDBPath, 'utf8')
fantasyDB = JSON.parse(data)
}
estado = 'Libre'
const codigoActual = dato.code
const usuarioExistente = fantasyDB.find(user => {
const id = Object.keys(user)[0]
const fantasy = user[id].fantasy
return fantasy.some(personaje => personaje.id === codigoActual)
})

if (usuarioExistente) {
idUsuarioExistente = Object.keys(usuarioExistente)[0];
nombreImagen = data.infoImg.find(personaje => personaje.code === codigoActual)?.name

if (nombreImagen) {
estado = `Vendido\n✓ *Comprado por: ${conn.getName(idUsuarioExistente)}*`
}}

const personaje = dato.name
let calificacionesPersonaje = []
for (const usuarioObj of fantasyDB) {
const usuario = Object.values(usuarioObj)[0]
const flow = usuario.flow || []
const calificaciones = flow.filter(voto => voto.character_name === personaje)
calificacionesPersonaje.push(...calificaciones)
}

const likes = calificacionesPersonaje.filter(voto => voto.like).length || 0
const superlikes = calificacionesPersonaje.filter(voto => voto.superlike).length || 0
const dislikes = calificacionesPersonaje.filter(voto => voto.dislike).length || 0
const incrementos_like = Math.floor(likes / 1) 
const incrementos_superlike = Math.floor(superlikes / 1)
const incrementos_dislike = Math.floor(dislikes / 1)
const aumento_por_like = (likes >= 50) ? incrementos_like * 0.01 : incrementos_like * 0.02 // Por defecto, 2% por cada like (+4 puntos). Si hay 50 o más likes, 1% por cada like (+2 puntos)
const aumento_por_superlike = (superlikes >= 50) ? incrementos_superlike * 0.03 : incrementos_superlike * 0.05 // Por defecto, 5% por cada superlike (+10 puntos). Si hay 50 o más superlikes, 3% por cada superlike (+6 puntos)
const decremento_por_dislike = incrementos_dislike * 0.01 // -1% por cada dislike (-2 puntos)
global.nuevoPrecio = dato.price + (dato.price * aumento_por_like) + (dato.price * aumento_por_superlike) - (dato.price * decremento_por_dislike)
nuevoPrecio = Math.round(nuevoPrecio) // Nuevo precio a un entero
if (nuevoPrecio < 50) {
nuevoPrecio = 50
}

let txtNewPrice = nuevoPrecio !== dato.price ? `\n✓ *Precio anterior:* ~\`${dato.price}\`~ *${rpgshop.emoticon('money')}*\n✓ *Nuevo Precio:* \`${nuevoPrecio}\` *${rpgshop.emoticon('money')}*\n*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*` : `\n✓ *Precio:* \`\`\`${dato.price}\`\`\` *${rpgshop.emoticon('money')}*`
let info = `*⛱️ FANTASÍA RPG ⛱️*\n*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*\n✓ *Nombre:* ${dato.name}\n✓ *Origen:* ${dato.desp}\n*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*${txtNewPrice}\n✓ *Clase:* ${dato.class}\n✓ *ID:* \`\`\`${codigoActual}\`\`\`\n✓ *Tipo:* ${dato.type}\n*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*\n✓ *Estado:* ${estado}`
info += `\n\n${estado === 'Libre' ? '_Responde a este mensaje con "c", "🛒", o "🐱" para comprarlo_\n\n' + listaAvisos(usedPrefix, personaje) : listaAvisos(usedPrefix, personaje)}`
id_message = (await conn.sendFile(m.chat, dato.url, 'error.jpg', info.trim(), fkontak, true, {
contextInfo: {
'forwardingScore': 200,
'isForwarded': false,
externalAdReply: {
showAdAttribution: false,
title: `${conn.getName(m.sender)}`,
body: `${dato.desp}`,
mediaType: 1,
sourceUrl: accountsgb,
thumbnailUrl: pp
}}
}, { caption: 'imagen_info' })).key.id
} else {
console.log('No se han encontrado imágenes.')
conn.sendMessage(m.chat, 'Error al obtener o procesar los datos.', { quoted: m })
}} catch (error) {
console.log(error)
}

handler.before = async (m) => {
user = global.db.data.users[m.sender]
if (m.quoted && m.quoted.id === id_message && likeEmojisArrays.concat(dislikeEmojisArrays, superlikeEmojisArrays).includes(m.text)) {
fantasyDB = []
if (fs.existsSync(fantasyDBPath)) {
const data = fs.readFileSync(fantasyDBPath, 'utf8')
fantasyDB = JSON.parse(data)
}
      
const emoji = m.text
userId = m.sender
const usuarioExistente = fantasyDB.find((user) => Object.keys(user)[0] === userId)

if (usuarioExistente) {
const idUsuarioExistente = Object.keys(usuarioExistente)[0]
const nombrePersonaje = dato.name

if (nombrePersonaje) {
const flow = usuarioExistente[idUsuarioExistente].flow || [];
const votoExistente = flow.find((voto) => voto && voto.character_name === nombrePersonaje && voto[emoji.toLowerCase()])

if (votoExistente && votoExistente[emoji.toLowerCase()] && votoExistente[emoji.toLowerCase()] !== m.text) {
} else {
const emojiAntes = flow.find((voto) => voto && voto.character_name === nombrePersonaje && (voto.like || voto.dislike || voto.superlike))
const updatedFlow = [
...(flow || []).filter((voto) => voto.character_name !== nombrePersonaje),
{
character_name: nombrePersonaje,
like: likeEmojisArrays.includes(emoji),
dislike: dislikeEmojisArrays.includes(emoji),
superlike: superlikeEmojisArrays.includes(emoji),
emoji: emoji,
},
];
usuarioExistente[idUsuarioExistente].flow = updatedFlow
if (!usuarioExistente[idUsuarioExistente].fantasy) {
usuarioExistente[idUsuarioExistente].fantasy = [
{
id: false,
status: false,
},
]}
fs.writeFileSync(fantasyDBPath, JSON.stringify(fantasyDB, null, 2), 'utf8')
emojiSaved = emojiAntes?.emoji    
const cambioEmojiMessage = `Has decidido cambiar tú calificación anterior *"${emojiSaved}"* por *"${emoji}"* para *${nombrePersonaje}*.`
const errorMessage = `*${nombrePersonaje}* ya fue calificado por ti con *"${emoji}"*`
if (emojiAntes) {
function determinarEmoji(voto) {
if (voto.like) {
return likeEmojisArrays
} else if (voto.dislike) {
return dislikeEmojisArrays
} else {
return superlikeEmojisArrays
}}
const emojisAnteriores = determinarEmoji(emojiAntes)  
function emojisCoinciden(emoji, emojiSaved) {
const esDelMismoTipo = (emoji, arrayReferencia) => arrayReferencia.some(refEmoji => emoji === refEmoji);
const coincideLike = esDelMismoTipo(emoji, likeEmojisArrays) && esDelMismoTipo(emojiSaved, likeEmojisArrays);
const coincideDislike = esDelMismoTipo(emoji, dislikeEmojisArrays) && esDelMismoTipo(emojiSaved, dislikeEmojisArrays);
const coincideSuperlike = esDelMismoTipo(emoji, superlikeEmojisArrays) && esDelMismoTipo(emojiSaved, superlikeEmojisArrays);
return coincideLike || coincideDislike || coincideSuperlike;
}
const coinciden = emojisCoinciden(emoji, emojiSaved)
const mensaje = coinciden ? errorMessage : cambioEmojiMessage
conn.reply(m.chat, mensaje, m)
if (likeEmojisArrays.includes(emoji)) {
emojiSaved = emoji
} if (dislikeEmojisArrays.includes(emoji)) {
emojiSaved = emoji
} else {
emojiSaved = emoji
}
if (!coinciden) {
emojiSaved = emoji
}
let userInDB = fantasyDB.find(userEntry => userEntry[userId])
if (userInDB) {
const record = userInDB[userId].record[0]
const emojiAnterior = emojiAntes.like ? '👍' : (emojiAntes.dislike ? '👎' : '❤️')
switch (true) {
case likeEmojisArrays.includes(emojiAnterior):
record.total_like -= 1
break
case dislikeEmojisArrays.includes(emojiAnterior):
record.total_dislike -= 1
break
case superlikeEmojisArrays.includes(emojiAnterior):
record.total_superlike -= 1
break
}
switch (true) {
case likeEmojisArrays.includes(emoji):
record.total_like += 1
break
case dislikeEmojisArrays.includes(emoji):
record.total_dislike += 1
break
case superlikeEmojisArrays.includes(emoji):
record.total_superlike += 1;
break
}
fs.writeFileSync(fantasyDBPath, JSON.stringify(fantasyDB, null, 2), 'utf8')}
} else {
const confirmationMessage = `*${conn.getName(m.sender)}* ha calificado a *${nombrePersonaje}* con *"${emoji}"*\n\n😉 _¡Sigue calificando a más personajes, es gratis!_`
conn.reply(m.chat, confirmationMessage, m)
let userInDB = fantasyDB.find(userEntry => userEntry[userId])
if (userInDB) {
const record = userInDB[userId].record[0];
switch (true) {
case likeEmojisArrays.includes(emoji):
record.total_like += 1
break
case dislikeEmojisArrays.includes(emoji):
record.total_dislike += 1
break
case superlikeEmojisArrays.includes(emoji):
record.total_superlike += 1
break
}
fs.writeFileSync(fantasyDBPath, JSON.stringify(fantasyDB, null, 2), 'utf8')}
}}}}}
      
if (m.quoted && m.quoted.id === id_message && ['c', '🛒', '🐱'].includes(m.text.toLowerCase())) {
//console.log(nuevoPrecio)
const cantidadFaltante = nuevoPrecio - user.money
if (user.money < nuevoPrecio) {
const codigoActual = dato.code
const usuarioExistente = fantasyDB.find(user => {
const id = Object.keys(user)[0]
const fantasy = user[id].fantasy
return fantasy.some(personaje => personaje.id === codigoActual)
})
fake = { contextInfo: { externalAdReply: { title: `¡Ese Personaje ya fue comprado!`, body: `😅 Compra otro personaje`, sourceUrl: accountsgb, thumbnailUrl: gataMenu } } }        
if (idUsuarioExistente) {
let No_compra = `*${nombreImagen}* ya fue comprado por *${conn.getName(idUsuarioExistente)}*`
if (usuarioExistente) return conn.reply(m.chat, No_compra, m, fake)
}
fake = { contextInfo: { externalAdReply: { title: `¡Insuficientes ${rpgshop.emoticon('money')}!`, body: `😼 Completa misiones del RPG`, sourceUrl: accountsgb, thumbnailUrl: gataMenu } } }
conn.reply(m.chat, `Te falta *${cantidadFaltante} ${rpgshop.emoticon('money')}* para comprar a *${dato.name}*\n\n*Actualmente tienes ${user.money} ${rpgshop.emoticon('money')}*`, m, fake)
} else {
response = await fetch(jsonURL)
data = await response.json()
fantasyDB = []
if (fs.existsSync(fantasyDBPath)) {
const data = fs.readFileSync(fantasyDBPath, 'utf8')
fantasyDB = JSON.parse(data)
}

const usuarioConCodigo = fantasyDB.find(user => {
const id = Object.keys(user)[0]
const fantasy = user[id].fantasy
return fantasy.some(personaje => personaje.id === dato.code)
})

if (usuarioConCodigo) {
const idUsuarioConCodigo = Object.keys(usuarioConCodigo)[0]
const nombreUsuario = conn.getName(idUsuarioConCodigo)
const nombrePersonaje = data.infoImg.find(personaje => personaje.code === dato.code)?.name

if (nombrePersonaje) {
if (m.sender == idUsuarioConCodigo) {
fake = { contextInfo: { externalAdReply: { title: `😊 Ya fue comprado antes`, body: `🌟 ¡Compra más para llegar al top!`, sourceUrl: accountsgb, thumbnailUrl: gataMenu } } }
const mensaje_ = `El personaje *${nombrePersonaje}* ya es tuyo!!`
conn.reply(m.chat, mensaje_, m, fake)
} else {
fake = { contextInfo: { externalAdReply: { title: `❌ No puedes comprar esto: ${nombrePersonaje}`, body: `🙂 ¡Compra otro personaje!`, sourceUrl: accountsgb, thumbnailUrl: gataMenu } } }
const mensaje = `Este personaje *${nombrePersonaje}* está reclamado por *${nombreUsuario}*`
conn.reply(m.chat, mensaje, m, fake)
        
}}} else {        
function realizarCompra() {
userId = m.sender
const usuarioExistente = fantasyDB.find(user => Object.keys(user)[0] === userId)
if (usuarioExistente) {
usuarioExistente[userId].fantasy.push({
id: dato.code,
name: dato.name,
status: true
})
} else {
const nuevoUsuario = {
[userId]: {
fantasy: [
{
id: dato.code,
name: dato.name,
status: true,
newDesp: false 
}],
record: [
{
total_character_transfer: 0,
total_change_character: 0,
total_vote: 0,
total_like: 0,
total_dislike: 0,
total_superlike: 0,
total_rewards: 0,
total_resell: 0,
total_purchased: 0,
total_spent_coins: 0
}]
}}
fantasyDB.push(nuevoUsuario);
}
fs.writeFileSync(fantasyDBPath, JSON.stringify(fantasyDB, null, 2), 'utf8')
}
realizarCompra()
   
user.money -= nuevoPrecio
fake = { contextInfo: { externalAdReply: { title: `¡Disfruta de tú personaje!`, body: `${dato.desp}`, sourceUrl: accountsgb, thumbnailUrl: dato.url } } }
conn.reply(m.chat, `El usuario *${conn.getName(m.sender)}* ha comprado a *${dato.name}*`, m, fake)
let userInDB = fantasyDB.find(userEntry => userEntry[userId])
if (userInDB) {
userInDB[userId].record[0].total_purchased += 1
fs.writeFileSync(fantasyDBPath, JSON.stringify(fantasyDB, null, 2), 'utf8')}

}}}
//user.fantasy = new Date * 1  
}}
handler.command = /^(fantasy|fy|rw|roll)$/i
export default handler

function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

hours = (hours < 10) ? "0" + hours : hours
minutes = (minutes < 10) ? "0" + minutes : minutes
seconds = (seconds < 10) ? "0" + seconds : seconds

return minutes + " m y " + seconds + " s " 
}  

export function listaAvisos(usedPrefix, personaje) {
const avisos = [
`> 🤩 ¡Agrega un personaje ahora! usando *${usedPrefix}fyagregar* o *${usedPrefix}fyadd*`,
`> 👀 *¿Qué tal ${personaje}?* ¡Califica!\n_Responde a este mensaje con:_\n*"${likeEmojisArrays.getRandom()}", "${dislikeEmojisArrays.getRandom()}", o "${superlikeEmojisArrays.getRandom()}"*\n\n> ⚠️ *Solo puede calificar si ha comprado mínimo un Personaje*`,
`> *¿Sabías que puedes cambiar un Personaje por tiempo premium 🎟️?*\n_¡Inténtalo! usa *${usedPrefix}fycambiar* o *${usedPrefix}fychange*_`,
`> ¡Para ser un Pro 😎 en *RPG Fantasy* visita la guía 📜!\n*Comienza a explorar usando:*\n\`${usedPrefix}fyguia o ${usedPrefix}fyguide\``,
`> *Conoce más de ${personaje} usando:*\n\`${usedPrefix}fyinfo\``,
`> *¿Quieres saber la lista de personajes 🤭?*\n*Consulta usando:* \`${usedPrefix}fylista o ${usedPrefix}fyl\``,
`> 🛒 Compra, ${superlikeEmojisArrays.getRandom()} califica, 🔄 cambia  y mucho más para ganar *recompensas extras 🎁*`,
`> 🌟 *¡Mira quien es tendencia!*\n\`${usedPrefix}fytendencia o ${usedPrefix}fyranking\`\n\n👀 _Mira avances de otros respondiendo al mensaje de alguien con *${usedPrefix}fytendencia*_`,
`> *Te digo un secreto* 😳\n_Mientras más uses los comandos *RPG Fantasy*, las 🎁 Recomepesas futuras se multiplican ☝️🤑_`,
`> 🌟 *Mira avances, misiones, datos de lo que has conseguido usando:*\n\`${usedPrefix}fymy\``,
//`> *¡Recuerda responder a este mensaje con "c", "🛒", o "🐱" para comprar personajes!*`,
`> 😁 *¡Pensamos en todo!* Transfiere cualquier personaje a tú Amigo/a usando:\n*${usedPrefix}fyentregar*, *${usedPrefix}fytransfer* o *${usedPrefix}fytr*`,
`> ⚠️ *Alerta* ⚠️ Calificar a *${personaje}* puede hacer que el precio suba o baje 😱 !Califica con sabiduría! 😸`
].getRandom()
return avisos.trim()
}
