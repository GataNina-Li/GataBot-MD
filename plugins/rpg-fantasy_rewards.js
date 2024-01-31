const fantasyDBPath = './fantasy.json'
let usuarioExistente = null
export async function before(m,{ conn }) {
const userId = m.sender
let user = global.db.data.users[userId]
let fantasyDB = []
if (fs.existsSync(fantasyDBPath)) {
const data = fs.readFileSync(fantasyDBPath, 'utf8')
fantasyDB = JSON.parse(data)
}
// Si el usuario no existe en la base de datos borra su contador de registro
usuarioExistente = fantasyDB.find((user) => Object.keys(user)[0] === userId)
if (!usuarioExistente) {
user.fantasy_character = 0
user.fantasy_character2 = 0
user.fantasy_character3 = 0
}

// Verifica si el usuario existe en la base de datos y si tiene la estructura fantasy
usuarioExistente = fantasyDB.find((user) => Object.keys(user)[0] === userId && user[userId].fantasy)
if (usuarioExistente && user.fantasy_character === 0) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} ahora puedes calificar personajes*`, m)
user.fantasy_character++
}

// Verifica si el conjunto fantasy tiene id como cadena de texto y status como true
usuarioExistente = fantasyDB.find((user) => Object.keys(user)[0] === userId)
if (usuarioExistente) {
const fantasyArray = usuarioExistente[userId].fantasy
if (fantasyArray.length >= 1 && typeof fantasyArray[0].id === 'string' && fantasyArray[0].status === true && user.fantasy_character2 === 0) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por comprar ${fantasyArray.length} personaje 1*`, m)
user.fantasy_character2++
} else if (fantasyArray.length >= 3 && typeof fantasyArray[2].id === 'string' && fantasyArray[2].status === true && user.fantasy_character2 === 1) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por comprar ${fantasyArray.length} personaje 3*`, m)
user.fantasy_character2++
} else if (fantasyArray.length >= 8 && typeof fantasyArray[7].id === 'string' && fantasyArray[7].status === true && user.fantasy_character2 === 2) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por comprar ${fantasyArray.length} personaje 8*`, m)
user.fantasy_character2++
} else if (fantasyArray.length >= 15 && typeof fantasyArray[14].id === 'string' && fantasyArray[14].status === true && user.fantasy_character2 === 3) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por comprar ${fantasyArray.length} personaje 15*`, m)
user.fantasy_character2++
}}

// Cuenta la cantidad de veces que se ha dado "like"
usuarioExistente = fantasyDB.find((user) => Object.keys(user)[0] === userId)
if (usuarioExistente) {
const flowArray = usuarioExistente[userId].flow || []
const likesCount = flowArray.filter(voto => voto.like).length
if (likesCount === 1 && user.fantasy_character3 === 0) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por dar ${likesCount} vez "👍"*`, m)
user.fantasy_character3++
} else if (likesCount === 5 && user.fantasy_character3 === 1) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por dar ${likesCount} veces "👍"*`, m)
user.fantasy_character3++
} else if (likesCount === 10 && user.fantasy_character3 === 2) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por dar ${likesCount} veces "👍"*`, m)
user.fantasy_character3++
} else if (likesCount === 20 && user.fantasy_character3 === 3) {
conn.reply(m.chat, `\`\`\`Logro desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por dar ${likesCount} veces "👍"*`, m)
user.fantasy_character3++
}}

}

