const fantasyDBPath = './fantasy.json'
let usuarioExistente = null
export async function before(m,{ conn }) {
const userId = m.sender

// Verifica si el usuario existe en la base de datos y si tiene la estructura fantasy
usuarioExistente = fantasyDB.find((user) => Object.keys(user)[0] === userId && user[userId].fantasy)
if (usuarioExistente) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} ahora puedes calificar personajes*`, m)
}

// Verifica si el conjunto fantasy tiene id como cadena de texto y status como true
usuarioExistente = fantasyDB.find((user) => Object.keys(user)[0] === userId)
const fantasyArray = usuarioExistente[m.sender].fantasy
if (fantasyArray.length >= 1 && typeof fantasyArray[0].id === 'string' && fantasyArray[0].status === true) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por comprar ${fantasyArray.length} personaje 1*`, m)
} else if (fantasyArray.length >= 3 && typeof fantasyArray[2].id === 'string' && fantasyArray[2].status === true) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por comprar ${fantasyArray.length} personaje 3*`, m)
} else if (fantasyArray.length >= 8 && typeof fantasyArray[7].id === 'string' && fantasyArray[7].status === true) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por comprar ${fantasyArray.length} personaje 8*`, m)
} else if (fantasyArray.length >= 15 && typeof fantasyArray[14].id === 'string' && fantasyArray[14].status === true) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por comprar ${fantasyArray.length} personaje 15*`, m)
}

// Cuenta la cantidad de veces que se ha dado "like"
usuarioExistente = fantasyDB.find((user) => Object.keys(user)[0] === userId)
if (usuarioExistente) {
const flowArray = usuarioExistente[userId].flow || []
const likesCount = flowArray.filter(voto => voto.like).length
if (likesCount === 1) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por dar ${likesCount} vez "👍"*`, m)
} else if (likesCount === 5) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por dar ${likesCount} veces "👍"*`, m)
} else if (likesCount === 10) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por dar ${likesCount} veces "👍"*`, m)
} else if (likesCount === 20) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por dar ${likesCount} veces "👍"*`, m)
}}
  
}
