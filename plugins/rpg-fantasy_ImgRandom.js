import fetch from 'node-fetch'
let handler = async (m, { command, usedPrefix, conn }) => {

async function reclamarImagen(url) {
try {
const response = await fetch(url)
const data = await response.json()

data.imagenesReclamadas.forEach((imagen, index) => {
//let fakeIMG = { contextInfo: { externalAdReply: { title: conn.getName(m.sender), body: imagen.descripcion, sourceUrl: redesMenu, thumbnailUrl: imagen.urlImagen }}}
let info = `Nombre: ${imagen.nombre}
Origen: ${imagen.descripcion}
Costo: $${imagen.costo}
Estado: Libre
Clase: ${imagen.clase}
Id de imagen: ${imagen.codigoImagen}`
conn.sendMessage(m.chat, { image: { url: imagen.urlImagen }, caption: info }, { quoted: m })  
})
} catch (error) {
console.error('Error al obtener o procesar los datos: ', error)
}}

const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
reclamarImagen(jsonURL)

}
handler.command = /^(fantasy|fy)$/i
export default handler
