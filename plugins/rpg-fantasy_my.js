import fetch from 'node-fetch'
import fs from 'fs'

const fantasyDBPath = './fantasy.json'
let fantasyDB = []
const validClasses = ['Común', 'Poco Común', 'Raro', 'Épico', 'Legendario', 'Sagrado', 'Supremo', 'Transcendental']

let handler = async (m, { command, usedPrefix, conn, text }) => {
const userId = m.sender

const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
const response = await fetch(jsonURL)
const data = await response.json()

if (fs.existsSync(fantasyDBPath)) {
const data = fs.readFileSync(fantasyDBPath, 'utf8')
var fantasyDB = JSON.parse(fs.readFileSync(fantasyDBPath, 'utf8'))
}

let usuarioExistente = fantasyDB.find(user => Object.keys(user)[0] === userId)

if (!usuarioExistente) {
return conn.reply(m.chat, `No tienes personajes.`, m)
}

const idUsuario = Object.keys(usuarioExistente)[0];
const fantasyUsuario = usuarioExistente[idUsuario].fantasy

function obtenerPersonajesDisponibles(userId, fantasyUsuario, infoImg) {
const personajesDisponibles = []
fantasyUsuario.forEach(personaje => {
const info = infoImg.find(img => img.code === personaje.id)
if (info) {
personajesDisponibles.push({
id: personaje.id,
name: personaje.name,
code: personaje.id,
class: info.class
})}
})
return personajesDisponibles
}
    
let seEncontraronPersonajes = null
function construirListaPersonajes(personajes) {
const personajesPorClase = {}
validClasses.forEach(clase => {
personajesPorClase[clase] = []
})
personajes.forEach(personaje => {
personajesPorClase[personaje.class].push(personaje)
})
let listaFinal = ''
validClasses.forEach(clase => {
if (personajesPorClase[clase].length > 0) {
const mensajeClase = `\n*✦ ${clase}*\n${personajesPorClase[clase].map(personaje => `• _${personaje.name}_ » \`\`\`(${personaje.id})\`\`\``).join('\n')}\n`;
listaFinal += mensajeClase
seEncontraronPersonajes = true
}})
if (!seEncontraronPersonajes) {
listaFinal += '*✘* \`\`\`No tienes personajes\`\`\`\n'
}
return listaFinal.trim()
}
const personajesDisponibles = obtenerPersonajesDisponibles(userId, fantasyUsuario, data.infoImg)
const listaPersonajes = construirListaPersonajes(personajesDisponibles)

let totalLikes = 0, totalSuperlikes = 0, totalDislikes = 0;
if (usuarioExistente[idUsuario].flow) {
usuarioExistente[idUsuario].flow.forEach(flow => {
if (flow.like) totalLikes++
if (flow.superlike) totalSuperlikes++
if (flow.dislike) totalDislikes++
})
}

const calificacionTotal = totalLikes + totalSuperlikes + totalDislikes
const personajesGustados = totalLikes > 0 ? totalLikes : `*✘* \`\`\`No has dado me gusta a personajes\`\`\``
const personajesSuperlike = totalSuperlikes > 0 ? totalSuperlikes : `*✘* \`\`\`No has dado me encanta a personajes\`\`\``
const personajesNoGustados = totalDislikes > 0 ? totalDislikes : `*✘* \`\`\`No has dado no me gusta a personajes\`\`\``

let preciosPersonajes = fantasyUsuario.map(personaje => {
const infoPersonaje = data.infoImg.find(img => img.name.toLowerCase() === personaje.name.toLowerCase())
return { name: personaje.name, price: infoPersonaje ? infoPersonaje.price : Infinity }
})
preciosPersonajes.sort((a, b) => a.price - b.price)

const personajeMasBarato = preciosPersonajes.length > 0 ? `✓ _${preciosPersonajes[0].name}_ » \`\`\`${preciosPersonajes[0].price}\`\`\` 🐱` : `*✘* \`\`\`No tienes personajes\`\`\``
let personajeMasCaro = preciosPersonajes.length > 0 ? `✓ _${preciosPersonajes[preciosPersonajes.length - 1].name}_ » \`\`\`${preciosPersonajes[preciosPersonajes.length - 1].price}\`\`\` 🐱` : `*✘* \`\`\`No tienes personajes\`\`\``
if (preciosPersonajes.length > 0 && preciosPersonajes[0].price === preciosPersonajes[preciosPersonajes.length - 1].price) {
personajeMasCaro = `*✘* \`\`\`No hay un Personaje más caro\`\`\``
}

const clases = {}
fantasyUsuario.forEach(personaje => {
const infoPersonaje = data.infoImg.find(img => img.name.toLowerCase() === personaje.name.toLowerCase())
if (infoPersonaje) {
if (!clases[infoPersonaje.class]) clases[infoPersonaje.class] = 0
clases[infoPersonaje.class]++
}})

let claseMasPersonajes = `*✘* \`\`\`No tienes personajes\`\`\``
let claseMenosPersonajes = `*✘* \`\`\`No tienes personajes\`\`\``
    
let maxCount = 0, minCount = Infinity
Object.entries(clases).forEach(([clase, count]) => {
if (count > maxCount) {
maxCount = count
claseMasPersonajes = `*✓* La clase *${clase}* tiene \`\`\`${count}\`\`\` personaje${maxCount === 1 ? '' : 's'}`
}
if (count < minCount && count > 0) {
minCount = count
claseMenosPersonajes = `*✓* La clase *${clase}* tiene \`\`\`${count}\`\`\` personaje${minCount === 1 ? '' : 's'}`
}
if (maxCount === minCount) {
claseMasPersonajes = `*✘* \`\`\`No hay una clase con mayor personajes\`\`\``
}
})

const mensaje = `
*❰ Información de tus personajes ❱*
    
*❰ Total de personajes ❱* 
${fantasyUsuario.length > 0 ? `*✓* \`\`\`${fantasyUsuario.length}\`\`\`` : `*✘* \`\`\`No tienes personajes\`\`\``}

*❰ Tus personajes ❱*
${listaPersonajes}
    
*❰ Calificación total de personajes ❱* 
${calificacionTotal > 0 ? `*✓* \`\`\`${calificacionTotal}\`\`\`` : `*✘* \`\`\`No has calificado personajes\`\`\``}
    
*❰ Personajes que has dado 👍 ❱* 
${personajesGustados > 0 ? `*✓* \`\`\`${personajesGustados}\`\`\`` : personajesGustados}
    
*❰ Personajes que has dado ❤️ ❱* 
${personajesSuperlike > 0 ? `*✓* \`\`\`${personajesSuperlike}\`\`\`` : personajesSuperlike}
    
*❰ Personajes que has dado 👎 ❱*
${personajesNoGustados > 0 ? `*✓* \`\`\`${personajesNoGustados}\`\`\`` : personajesNoGustados}
    
*❰ Tú personaje más barato ❱* 
${personajeMasBarato}
    
*❰ Tú personaje más caro ❱* 
${personajeMasCaro}

*❰ Clase con menos personajes ❱* 
${claseMenosPersonajes}
    
*❰ Clase con más personajes ❱* 
${claseMasPersonajes}
`
conn.reply(m.chat, mensaje.trim(), m)
}

handler.command = /^(fantasymy|fymy)$/i
export default handler
