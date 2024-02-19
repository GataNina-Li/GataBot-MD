import fetch from 'node-fetch'
import fs from 'fs'

const fantasyDBPath = './fantasy.json'
const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'

let handler = async (m, { command, text, conn }) => {

const response = await fetch(jsonURL)
const data = await response.json()

let personajeInfo = null
let calificacionTotal = 0, cantidadLikes = 0, cantidadSuperlikes = 0, cantidadDislikes = 0
const personaje = data.infoImg.find(p => p.name.toLowerCase() === text.toLowerCase() || p.code === text)

if (!personaje) {
return conn.reply(m.chat, 'No se encontró información para el personaje especificado.', m)
}

const imagen = personaje.url
const nombre = personaje.name
const descripcion = personaje.desp
const precio = personaje.price
const clase = personaje.class
const tipo = personaje.type
const codigo = personaje.code

let fantasyDB = []
if (fs.existsSync(fantasyDBPath)) {
const data = fs.readFileSync(fantasyDBPath, 'utf8')
fantasyDB = JSON.parse(data)
}

if (fs.existsSync(fantasyDBPath)) {
fantasyDB.forEach(user => {
const id = Object.keys(user)[0]
const flow = user[id].flow
if (flow) {
flow.forEach(voto => {
if (voto.character_name === nombre && voto.like) cantidadLikes++
if (voto.character_name === nombre && voto.superlike) cantidadSuperlikes++
if (voto.character_name === nombre && voto.dislike) cantidadDislikes++
})
}
})
calificacionTotal = cantidadLikes + cantidadSuperlikes + cantidadDislikes
}
        
let estado = 'Personaje Libre'
if (fs.existsSync(fantasyDBPath)) {
const usuarioExistente = fantasyDB.find(user => {
const id = Object.keys(user)[0]
const fantasy = user[id].fantasy
return fantasy.some(personaje => personaje.id === codigo)
})
if (usuarioExistente) {
const idUsuarioExistente = Object.keys(usuarioExistente)[0];
const nombreImagen = data.infoImg.find(personaje => personaje.code === codigo)?.name
if (nombreImagen) {
estado = `*${nombreImagen}* fue comprado por *${conn.getName(idUsuarioExistente)}*`
}}}

await conn.reply(m.chat, '> *Obteniendo información del personaje...*\n\n_Esto puede tomar tiempo, paciencia por favor_', m)
const preguntas = [
`¿Cuál es el nombre completo del personaje ${nombre}?`,
`¿En qué obra (libro, película, serie, videojuego, etc.) aparece este personaje ${nombre}?`,
`¿Cuál es el papel o función del personaje ${nombre} en la historia?`,
//`¿Cuál es la historia o trasfondo del personaje ${nombre}?`,
//`¿Cuáles son las características físicas del personaje ${nombre} (edad, género, apariencia)?`,
//`¿Qué habilidades o rasgos distintivos tiene el personaje ${nombre}?`,
`¿Cuál es la personalidad del personaje ${nombre}?`,
`¿Quién es el autor o creador del personaje ${nombre}?`,
`¿Existen adaptaciones o reinterpretaciones del personaje ${nombre} en diferentes medios?`,
`¿Cuál es la recepción crítica o popular del personaje ${nombre}?`,
`¿Hay algún detalle interesante o curioso sobre el personaje ${nombre} que valga la pena conocer?`,
`¿Dónde puedo ver al personaje ${nombre} (plataformas, libros, páginas, etc.)?`,
`Muestra la lista completa de los personajes que están relacionados con ${nombre}`,
//`¿El personaje ${nombre} es una persona real? En ese caso, ¿cuál es su ocupación, logros, historia personal, etc.?`,
`Si el personaje ${nombre} es de un anime o serie, ¿hay información sobre el estudio de animación o la producción de la serie?`,
`¿Cuál es la fecha de nacimiento y lugar de origen del actor o del personaje ${nombre}? (en caso de ser una persona real)`,
//`¿Ha participado el actor/personaje ${nombre} en obras de teatro? En ese caso, ¿cuáles?`,
`¿Cuándo se hizo (fecha) la obra (libro, película, serie, videojuego, etc.) del personaje ${nombre}?`,
`¿Qué lecciones o valores representa el personaje ${nombre} dentro de la historia?`
//`¿Existe alguna página web o comunidad en línea dedicada al personaje ${nombre} o al actor?`
]
const respuestas = []
const modo = `Mediante un resumen o respuesta directa a la pregunta, responde` //`Responderás a esta pregunta únicamente`
for (const pregunta of preguntas) {
try {
const response = await fetch(`https://api.cafirexos.com/api/chatgpt?text=${pregunta}&name=${m.name}&prompt=${modo}`)
const data = await response.json()
respuestas.push(data.resultado || 'err-gb')
} catch (error) {
respuestas.push('err-gb')
}}

let mensaje = `
*Detalles del personaje:*

*Imagen:* ${imagen}
*Nombre:* ${nombre}
*Descripción:* ${descripcion}
*Precio:* ${precio} coins
*Clase:* ${clase}
*Tipo:* ${tipo}
*Código:* ${codigo}

*Calificación total del personaje:* ${calificacionTotal}
*Cantidad de 👍 (Likes):* ${cantidadLikes}
*Cantidad de ❤️ (Superlikes):* ${cantidadSuperlikes}
*Cantidad de 👎 (Dislikes):* ${cantidadDislikes}

*Comprado por:* ${estado}
`

mensaje += `
> *Información/Preguntas basada en IA*
${respuestas.some(respuesta => respuesta === 'err-gb') ? '`En este momento no se puede acceder a este recurso`' :
preguntas.map((pregunta, index) => `*${pregunta}*\n${respuestas[index]}`).join('\n\n')}
`
await conn.reply(m.chat, mensaje.trim(), m)
}

handler.command = /^(fantasyinfo|fyinfo)$/i
export default handler
