import fetch from 'node-fetch'
import fs from 'fs'

const fantasyDBPath = './fantasy.json'
let id_message, pp, dato, fake, user = null

let handler = async (m, { command, usedPrefix, conn, text }) => {
user = global.db.data.users[m.sender]

const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
const response = await fetch(jsonURL)
const data = await response.json()
var fantasyDB = JSON.parse(fs.readFileSync(fantasyDBPath, 'utf8'))

const userId = m.sender
let usuarioExistente = fantasyDB.find(user => Object.keys(user)[0] === userId)

if (!text) {
if (!usuarioExistente) {
return conn.reply(m.chat, 'Use el comando #fy y compre un personaje.', m)
}

const fantasyUsuario = usuarioExistente[userId].fantasy
if (fantasyUsuario.length === 0) {
return conn.reply(m.chat, 'Usted no ha comprado personajes.', m)
}

const personajesDisponibles = obtenerPersonajesDisponibles(userId, fantasyUsuario, data.infoImg)
const listaPersonajes = construirListaPersonajes(personajesDisponibles)
conn.reply(m.chat, `Personajes disponibles:\n${listaPersonajes}`, m)
}

const imageInfo = data.infoImg.find(img => img.name.toLowerCase() === text.toLowerCase() || img.code === text)
if (!imageInfo) {
return conn.reply(m.chat, `No se encontró la imagen con el nombre o código: ${text}`, m)
}
const imageCode = imageInfo.code
const personaje = imageInfo.name
const imageClass = imageInfo.class

var fantasyDB = []
if (fs.existsSync(fantasyDBPath)) {
const data = fs.readFileSync(fantasyDBPath, 'utf8')
fantasyDB = JSON.parse(data)
}

usuarioExistente = fantasyDB.find(user => Object.keys(user)[0] === userId)

if (usuarioExistente) {
const idUsuario = Object.keys(usuarioExistente)[0]
const fantasyUsuario = usuarioExistente[idUsuario].fantasy
const imagenUsuario = fantasyUsuario.find(personaje => personaje.id === imageCode)

if (imagenUsuario) {
fantasyUsuario.splice(fantasyUsuario.indexOf(imagenUsuario), 1)
fs.writeFileSync(fantasyDBPath, JSON.stringify(fantasyDB, null, 2), 'utf8')

const validClasses = ['Común', 'Poco Común', 'Raro', 'Épico', 'Legendario', 'Sagrado', 'Supremo', 'Transcendental'];
const tiempoPremium = getTiempoPremium(imageClass, validClasses)

asignarTiempoPremium(user, tiempoPremium)
user.money += 100
  
const tiempoPremiumFormateado = formatearTiempo(tiempoPremium * 60 * 1000)
  
conn.reply(m.chat, `Has cambiado a *${personaje}* por monedas. Ahora tienes *${user.money}* monedas.\n\nTiempo premium:\n\`\`\`${tiempoPremiumFormateado}\`\`\``, m)
} else {
conn.reply(m.chat, `No posees a ${personaje} en tu colección.`, m)
}} else {
conn.reply(m.chat, 'No tienes ninguna personaje en tu colección.', m)
}}

handler.command = /^(fantasychange|fychange)$/i
export default handler

// Obtener el tiempo premium según la clase del personaje
function getTiempoPremium(imageClass, validClasses) {
const index = validClasses.indexOf(imageClass)
const tiempoPremiums = [30, 60, 90, 120, 240, 420, 600, 1440] // Tiempos en minutos correspondientes a cada clase
return tiempoPremiums[index] || 0
/*
Común = 30 min
Poco Común = 1 hora
Raro = 1 h 30 min
Épico = 2 horas
Legendario = 4 horas
Sagrado = 7 horas
Supremo = 10 horas
Transcendental = 24 horas
*/
}

// Asignar tiempo premium al usuario
function asignarTiempoPremium(user, tiempoPremium) {
const tiempo = tiempoPremium * 60 * 1000 // minutos a milisegundos
const now = new Date() * 1
if (now < user.premiumTime) user.premiumTime += tiempo
else user.premiumTime = now + tiempo
user.premium = true
}

// Formatear el tiempo en milisegundos 
function formatearTiempo(tiempoEnMilisegundos) {
const segundos = Math.floor(tiempoEnMilisegundos / 1000)
const minutos = Math.floor(segundos / 60)
const horas = Math.floor(minutos / 60)
const dias = Math.floor(horas / 24)
const tiempoFormateado = []

if (dias > 0) tiempoFormateado.push(`${dias} día${dias > 1 ? 's' : ''}`)
if (horas % 24 > 0) tiempoFormateado.push(`${horas % 24} hora${horas % 24 > 1 ? 's' : ''}`)
if (minutos % 60 > 0) tiempoFormateado.push(`${minutos % 60} minuto${minutos % 60 > 1 ? 's' : ''}`)
if (segundos % 60 > 0) tiempoFormateado.push(`${segundos % 60} segundo${segundos % 60 > 1 ? 's' : ''}`)
return tiempoFormateado.length > 0 ? tiempoFormateado.join(', ') : '0 segundos'
}

function obtenerPersonajesDisponibles(userId, fantasyUsuario, infoImg) {
    const personajesDisponibles = [];

    fantasyUsuario.forEach(personaje => {
        const info = infoImg.find(img => img.code === personaje.id);
        if (info) {
            personajesDisponibles.push({
                id: personaje.id,
                name: personaje.name,
                code: personaje.id,
                class: info.class
            });
        }
    });

    return personajesDisponibles;
}

function construirListaPersonajes(personajes) {
    const validClasses = ['Común', 'Poco Común', 'Raro', 'Épico', 'Legendario', 'Sagrado', 'Supremo', 'Transcendental'];
    const personajesPorClase = {};

    
    validClasses.forEach(clase => {
        personajesPorClase[clase] = [];
    });

    personajes.forEach(personaje => {
        personajesPorClase[personaje.class].push(personaje);
    });

    let listaFinal = 'Personajes disponibles:\n';

    validClasses.forEach(clase => {
        const tiempoPremium = formatearTiempo(getTiempoPremium(clase, validClasses) * 60 * 1000);
        const mensajeClase = personajesPorClase[clase].length > 0 ?
            `\n${clase} | ${tiempoPremium} premium:\n${personajesPorClase[clase].map(personaje => `• ${personaje.name} (${personaje.id})`).join('\n')}\n` :
            `\n${clase} | ${tiempoPremium} premium:\nPersonajes de esta clase no encontrados\n`;
        listaFinal += mensajeClase;
    });

    return listaFinal.trim();
}
