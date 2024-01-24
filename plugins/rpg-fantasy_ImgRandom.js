import fetch from 'node-fetch'

let handler = async (m, { command, usedPrefix, conn }) => {
const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'

try {
const response = await fetch(jsonURL)
const data = await response.json()

if (data.imagenesReclamadas && data.imagenesReclamadas.length > 0) {
const dato = data.imagenesReclamadas[Math.floor(Math.random() * data.imagenesReclamadas.length)]
let fakeIMG = { contextInfo: { externalAdReply: { title: `${conn.getName(m.sender)}`, body: `${dato.descripcion}`, sourceUrl: redesMenu, thumbnailUrl: dato.urlImagen }}}
let info = `*Nombre:* ${dato.nombre}
*Origen:* ${dato.descripcion}
*Costo:* $${dato.costo}
*Estado:* Libre
*Clase:* ${dato.clase}
*ID:* \`\`\`${dato.codigoImagen}\`\`\``;
//await conn.sendMessage(m.chat, { image: { url: dato.urlImagen }, caption: info }, { quoted: fakeIMG })
await conn.sendMessage(m.chat, { image: { url: dato.urlImagen }, caption: info, mentions: [m.sender] }, { quoted: fakeIMG })
} else {
console.error('El JSON no contiene imágenes reclamadas.')
conn.sendMessage(m.chat, 'Error al obtener o procesar los datos.', { quoted: m })
}} catch (error) {
console.error('Error al obtener o procesar los datos: ', error)
conn.sendMessage(m.chat, 'Error al procesar la solicitud.', { quoted: m })
}}

handler.command = /^(fantasy|fy)$/i;
export default handler;

