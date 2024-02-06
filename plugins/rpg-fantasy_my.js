import fetch from 'node-fetch'
import fs from 'fs'

const fantasyDBPath = './fantasy.json'
let fantasyDB = []
const validClasses = ['Común', 'Poco Común', 'Raro', 'Épico', 'Legendario', 'Sagrado', 'Supremo', 'Transcendental']

let handler = async (m, { command, usedPrefix, conn, text }) => {
const userId = m.sender
let user = global.db.data.users[userId]

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

let mensajeDesafiosPendientes = `
*❰ Desafíos pendientes ❱*

Puedes calificar personajes:
`

if (user.fantasy_character === 1) {
    mensajeDesafiosPendientes += "✓ Sí\n"
} else {
    mensajeDesafiosPendientes += "✘ No\n"
}

mensajeDesafiosPendientes += `
Recompensas por desbloquear:
`

// Por personaje
if (user.fantasy_character2 < 5) {
    mensajeDesafiosPendientes += `Compra ${5 - user.fantasy_character2 * 5} Personajes más para obtener una recompensa, ${user.fantasy_character2 * 5}/5\n`
} else if (user.fantasy_character2 < 10) {
    mensajeDesafiosPendientes += `Compra ${10 - user.fantasy_character2 * 5} Personajes más para obtener una recompensa, ${user.fantasy_character2 * 5}/10\n`
} else if (user.fantasy_character2 < 15) {
    mensajeDesafiosPendientes += `Compra ${15 - user.fantasy_character2 * 5} Personajes más para obtener una recompensa, ${user.fantasy_character2 * 5}/15\n`
} else if (user.fantasy_character2 < 20) {
    mensajeDesafiosPendientes += `Compra ${20 - user.fantasy_character2 * 5} Personajes más para obtener una recompensa, ${user.fantasy_character2 * 5}/20\n`
} else if (user.fantasy_character2 < 30) {
    mensajeDesafiosPendientes += `Compra ${30 - user.fantasy_character2 * 5} Personajes más para obtener una recompensa, ${user.fantasy_character2 * 5}/30\n`
} else {
    mensajeDesafiosPendientes += "✓ Has completado todas las misiones\n"
}

// Por dar 👍
if (user.fantasy_character3 < 10) {
    mensajeDesafiosPendientes += `Califica a ${3 + user.fantasy_character3 * 5} personajes más con "👍", ${user.fantasy_character3 * 5}/8\n`
} else if (user.fantasy_character3 < 35) {
    mensajeDesafiosPendientes += `Califica a ${8 + (user.fantasy_character3 - 1) * 5} personajes más con "👍", ${user.fantasy_character3 * 5}/25\n`
} else if (user.fantasy_character3 < 40) {
    mensajeDesafiosPendientes += `Califica a ${13 + (user.fantasy_character3 - 1) * 5} personajes más con "👍", ${user.fantasy_character3 * 5}/30\n`
} else if (user.fantasy_character3 < 55) {
    mensajeDesafiosPendientes += `Califica a ${18 + (user.fantasy_character3 - 1) * 5} personajes más con "👍", ${user.fantasy_character3 * 5}/40\n`
} else if (user.fantasy_character3 < 65) {
    mensajeDesafiosPendientes += `Califica a ${25 + (user.fantasy_character3 - 1) * 5} personajes más con "👍", ${user.fantasy_character3 * 5}/50\n`
} else if (user.fantasy_character3 < 80) {
    mensajeDesafiosPendientes += `Califica a ${35 + (user.fantasy_character3 - 1) * 5} personajes más con "👍", ${user.fantasy_character3 * 5}/65\n`
} else if (user.fantasy_character3 < 100) {
    mensajeDesafiosPendientes += `Califica a ${40 + (user.fantasy_character3 - 1) * 5} personajes más con "👍", ${user.fantasy_character3 * 5}/80\n`
} else {
    mensajeDesafiosPendientes += "✓ Has completado todas las misiones\n"
}

// Por dar ❤️
if (user.fantasy_character4 < 10) {
    mensajeDesafiosPendientes += `Califica a ${3 + user.fantasy_character4 * 5} personajes más con "❤️", ${user.fantasy_character4 * 5}/8\n`
} else if (user.fantasy_character4 < 35) {
    mensajeDesafiosPendientes += `Califica a ${8 + (user.fantasy_character4 - 1) * 5} personajes más con "❤️", ${user.fantasy_character4 * 5}/25\n`
} else if (user.fantasy_character4 < 40) {
    mensajeDesafiosPendientes += `Califica a ${13 + (user.fantasy_character4 - 1) * 5} personajes más con "❤️", ${user.fantasy_character4 * 5}/30\n`
} else if (user.fantasy_character4 < 55) {
    mensajeDesafiosPendientes += `Califica a ${18 + (user.fantasy_character4 - 1) * 5} personajes más con "❤️", ${user.fantasy_character4 * 5}/40\n`
} else if (user.fantasy_character4 < 65) {
    mensajeDesafiosPendientes += `Califica a ${25 + (user.fantasy_character4 - 1) * 5} personajes más con "❤️", ${user.fantasy_character4 * 5}/50\n`
} else if (user.fantasy_character4 < 80) {
    mensajeDesafiosPendientes += `Califica a ${35 + (user.fantasy_character4 - 1) * 5} personajes más con "❤️", ${user.fantasy_character4 * 5}/65\n`
} else if (user.fantasy_character4 < 100) {
    mensajeDesafiosPendientes += `Califica a ${40 + (user.fantasy_character4 - 1) * 5} personajes más con "❤️", ${user.fantasy_character4 * 5}/80\n`
} else {
    mensajeDesafiosPendientes += "✓ Has completado todas las misiones\n"
}

// Por dar 👎
if (user.fantasy_character5 < 10) {
    mensajeDesafiosPendientes += `Califica a ${3 + user.fantasy_character5 * 5} personajes más con "👎", ${user.fantasy_character5 * 5}/8\n`
} else if (user.fantasy_character5 < 35) {
    mensajeDesafiosPendientes += `Califica a ${8 + (user.fantasy_character5 - 1) * 5} personajes más con "👎", ${user.fantasy_character5 * 5}/25\n`
} else if (user.fantasy_character5 < 40) {
    mensajeDesafiosPendientes += `Califica a ${13 + (user.fantasy_character5 - 1) * 5} personajes más con "👎", ${user.fantasy_character5 * 5}/30\n`
} else if (user.fantasy_character5 < 55) {
    mensajeDesafiosPendientes += `Califica a ${18 + (user.fantasy_character5 - 1) * 5} personajes más con "👎", ${user.fantasy_character5 * 5}/40\n`
} else if (user.fantasy_character5 < 65) {
    mensajeDesafiosPendientes += `Califica a ${25 + (user.fantasy_character5 - 1) * 5} personajes más con "👎", ${user.fantasy_character5 * 5}/50\n`
} else if (user.fantasy_character5 < 80) {
    mensajeDesafiosPendientes += `Califica a ${35 + (user.fantasy_character5 - 1) * 5} personajes más con "👎", ${user.fantasy_character5 * 5}/65\n`
} else if (user.fantasy_character5 < 100) {
    mensajeDesafiosPendientes += `Califica a ${40 + (user.fantasy_character5 - 1) * 5} personajes más con "👎", ${user.fantasy_character5 * 5}/80\n`
} else {
    mensajeDesafiosPendientes += "✓ Has completado todas las misiones\n"
}

// Desafíos iniciales
if (user.fantasy_character3 === 0) {
    mensajeDesafiosPendientes += `Califica a 3 personajes con "👍", 0/3\n`
}
if (user.fantasy_character4 === 0) {
    mensajeDesafiosPendientes += `Califica a 3 personajes con "❤️", 0/3\n`
}
if (user.fantasy_character5 === 0) {
    mensajeDesafiosPendientes += `Califica a 3 personajes con "👎", 0/3\n`
}

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

${mensajeDesafiosPendientes}
`
conn.reply(m.chat, mensaje.trim(), m)
}

handler.command = /^(fantasymy|fymy)$/i
export default handler
