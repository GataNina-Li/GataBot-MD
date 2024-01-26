import fetch from 'node-fetch'

let handler = async (m, { command, usedPrefix, conn }) => {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

const isCommand1 = /^(fantasy|fy)$/i.test(command)

if (isCommand1) {
const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
try {
const response = await fetch(jsonURL)
const data = await response.json()

if (data.imagenesReclamadas && data.imagenesReclamadas.length > 0) {
const dato = data.imagenesReclamadas[Math.floor(Math.random() * data.imagenesReclamadas.length)]
let pp = await conn.profilePictureUrl(who, 'image').catch((_) => dato.urlImagen)
let info = `*⛱️ FANTASÍA RPG ⛱️*
*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*
*✓ Nombre:* ${dato.nombre}
*✓ Origen:* ${dato.descripcion}
*✓ Costo:* $${dato.costo}
*✓ Estado:* Libre
*✓ Clase:* ${dato.clase}
*✓ ID:* \`\`\`${dato.codigoImagen}\`\`\``
conn.sendFile(m.chat, dato.urlImagen, 'error.jpg', info, fkontak, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: `${conn.getName(m.sender)}`, body: `${dato.descripcion}`, mediaType: 1, sourceUrl: accountsgb.getRandom(), thumbnailUrl: pp}}})
} else {
console.error('No se han encontrado imágenes.')
conn.sendMessage(m.chat, 'Error al obtener o procesar los datos.', { quoted: m })
}} catch (error) {
console.error('Error al obtener o procesar los datos: ', error)
conn.sendMessage(m.chat, 'Error al procesar la solicitud.', { quoted: m })
}}

}
handler.command = /^(fantasy|fy)$/i
export default handler

