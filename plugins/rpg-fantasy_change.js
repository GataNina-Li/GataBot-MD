import fetch from 'node-fetch'
import fs from 'fs'

const fantasyDBPath = './fantasy.json'
let id_message, pp, dato, fake, user = null

let handler = async (m, { command, usedPrefix, conn, text }) => {
user = global.db.data.users[m.sender]
if (!text) return conn.reply(m.chat, 'Debes proporcionar el nombre o código de la imagen.', m)

const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
const response = await fetch(jsonURL)
const data = await response.json()

const imageInfo = data.infoImg.find(img => img.name.toLowerCase() === text.toLowerCase() || img.code === text)
if (!imageInfo) {
return conn.reply(m.chat, `No se encontró la imagen con el nombre o código: ${text}`, m)
}
const imageCode = imageInfo.code
const personaje = imageInfo.name

let fantasyDB = [];
if (fs.existsSync(fantasyDBPath)) {
const data = fs.readFileSync(fantasyDBPath, 'utf8')
fantasyDB = JSON.parse(data)
}

const userId = m.sender
const usuarioExistente = fantasyDB.find(user => Object.keys(user)[0] === userId)

if (usuarioExistente) {
const idUsuario = Object.keys(usuarioExistente)[0]
const fantasyUsuario = usuarioExistente[idUsuario].fantasy
const imagenUsuario = fantasyUsuario.find(personaje => personaje.id === imageCode)

if (imagenUsuario) {
fantasyUsuario.splice(fantasyUsuario.indexOf(imagenUsuario), 1)
fs.writeFileSync(fantasyDBPath, JSON.stringify(fantasyDB, null, 2), 'utf8')
user.money += 100
conn.reply(m.chat, `Has cambiado a *${personaje}* por monedas. Ahora tienes *${user.money}* monedas.`, m)
} else {
conn.reply(m.chat, `No posees la imagen ${personaje} en tu colección.`, m)
}} else {
conn.reply(m.chat, 'No tienes ninguna imagen en tu colección.', m)
}}

handler.command = /^(fantasychange|fychange)$/i
export default handler
