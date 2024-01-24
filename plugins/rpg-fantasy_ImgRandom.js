import fetch from 'node-fetch'
let handler = async (m, { command, usedPrefix, conn }) => {
const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
try {
const response = await fetch(jsonURL)
const data = await response.json();
if (data.imagenesReclamadas && data.imagenesReclamadas.length > 0) {
const imagenAleatoria = data.imagenesReclamadas[Math.floor(Math.random() * data.imagenesReclamadas.length)];
//let fakeIMG = { contextInfo: { externalAdReply: { title: conn.getName(m.sender), body: imagen.descripcion, sourceUrl: redesMenu, thumbnailUrl: imagen.urlImagen }}}
let info = `*Nombre:* ${data.nombre}
*Origen:* ${data.descripcion}
*Costo:* $${data.costo}
*Estado:* Libre
*Clase:* ${data.clase}
*ID:* \`\`\`${data.codigoImagen}\`\`\``
conn.sendMessage(m.chat, { image: { url: data.urlImagen }, caption: info }, { quoted: m })  
}} catch (error) {
console.error('Error al obtener o procesar los datos: ', error)
}

}
handler.command = /^(fantasy|fy)$/i
export default handler
