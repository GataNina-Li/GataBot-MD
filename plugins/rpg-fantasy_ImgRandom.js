import fetch from 'node-fetch';
let id_message, pp, dato = null
//let dato = null

let handler = async (m, { command, usedPrefix, conn }) => {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
try {
const response = await fetch(jsonURL)
const data = await response.json()

if (data.imagenesReclamadas && data.imagenesReclamadas.length > 0) {
dato = data.imagenesReclamadas[Math.floor(Math.random() * data.imagenesReclamadas.length)]
pp = await conn.profilePictureUrl(who, 'image').catch((_) => dato.urlImagen)
let info = `*⛱️ FANTASÍA RPG ⛱️*\n*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*\n✓ *Nombre:* ${dato.nombre}\n✓ *Origen:* ${dato.descripcion}\n✓ *Costo:* $${dato.costo}\n✓ *Estado:* Libre\n✓ *Clase:* ${dato.clase}\n✓ *ID:* \`\`\`${dato.codigoImagen}\`\`\``

id_message = (await conn.sendFile(m.chat, dato.urlImagen, 'error.jpg', info, fkontak, true, {
contextInfo: {
'forwardingScore': 200,
'isForwarded': false,
externalAdReply: {
showAdAttribution: false,
title: `${conn.getName(m.sender)}`,
body: `${dato.descripcion}`,
mediaType: 1,
sourceUrl: accountsgb.getRandom(),
thumbnailUrl: pp
}}
}, { caption: 'imagen_info' })).key.id
} else {
console.error('No se han encontrado imágenes.')
conn.sendMessage(m.chat, 'Error al obtener o procesar los datos.', { quoted: m })
}} catch (error) {
console.error('Error al obtener o procesar los datos: ', error)
conn.sendMessage(m.chat, 'Error al procesar la solicitud.', { quoted: m })
}}

handler.before = async (m) => {
if (m.quoted && m.quoted.id === id_message && ['c', '🛒', '🐱'].includes(m.text.toLowerCase())) {
let fake = { contextInfo: { externalAdReply: {title: `${conn.getName(m.sender)}`, body: `${dato.descripcion}`, sourceUrl: accountsgb.getRandom(), thumbnailUrl: 'https://images.vexels.com/media/users/3/200097/isolated/preview/942820836246f08c2d6be20a45a84139-icono-de-carrito-de-compras-carrito-de-compras.png' }}}
//conn.sendMessage(m.chat, {text: `El usuario *${conn.getName(m.sender)}* ha comprado a *${dato.nombre}*` }, { quoted: ppp})
conn.reply(m.chat, `El usuario *${conn.getName(m.sender)}* ha comprado a *${dato.nombre}*`, m, fake, )
}}

handler.command = /^(fantasy|fy)$/i
export default handler


