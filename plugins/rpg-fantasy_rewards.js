// Código elaborado por: https://github.com/GataNina-Li

const fantasyDBPath = './fantasy.json'
let usuarioExistente, logro, fake = null

let handler = m => m
handler.before = async function (m, { conn }) {
  
const userId = m.sender
let user = global.db.data.users[userId]
let fantasyDB = []
if (fs.existsSync(fantasyDBPath)) {
const data = fs.readFileSync(fantasyDBPath, 'utf8')
fantasyDB = JSON.parse(data)
}
const rewards = {
exp: 0,
limit: 0,
diamond: 0,
joincount: 0,
emerald: 0,
berlian: 0,
kyubi: 0,
gold: 0,
money: 0,
tiketcoin: 0,
stamina: 0
}

const rewards2 = {
potion: 0,
aqua: 0,
trash: 0,
wood: 0,
rock: 0,
batu: 0,
string: 0,
iron: 0,
coal: 0,
botol: 0,
kaleng: 0,
kardus: 0,
}

const rewards3 = {
eleksirb: 0,
emasbatang: 0,
emasbiasa: 0,
rubah: 0,
sampah: 0,
serigala: 0,
kayu: 0,
sword: 0,
umpan: 0,
healtmonster: 0,
emas: 0,
pancingan: 0,
pancing: 0,
}

const rewards4 = {
anggur: 0,
apel: 0,
jeruk: 0,
mangga: 0,
pisang: 0,
bibitanggur: 0,
bibitapel: 0,
bibitjeruk: 0,
bibitmangga: 0,
bibitpisang: 0,
}

// Si el usuario no existe en la base de datos borra su contador de registro
usuarioExistente = fantasyDB.find((user) => Object.keys(user)[0] === userId)
if (!usuarioExistente) {
user.fantasy_character = 0
user.fantasy_character2 = 0
user.fantasy_character3 = 0
user.fantasy_character4 = 0
user.fantasy_character5 = 0
}

// Verifica si el usuario existe en la base de datos y si tiene la estructura fantasy
usuarioExistente = fantasyDB.find((user) => Object.keys(user)[0] === userId && user[userId].fantasy)
if (usuarioExistente && user.fantasy_character === 0) {
fake = { contextInfo: { externalAdReply: { title: `🌟 NUEVO LOGRO 🌟`, body: `Califica personajes, es gratis ❤️`, sourceUrl: accountsgb, thumbnailUrl: gataMenu }}}
await conn.reply(m.chat, `\`\`\`Desafío desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} ahora puedes calificar personajes*`, null, fake)
user.fantasy_character++
}

// Verifica si el conjunto fantasy tiene id como cadena de texto y status como true
usuarioExistente = fantasyDB.find((user) => Object.keys(user)[0] === userId)
if (usuarioExistente) {
const fantasyArray = usuarioExistente[userId].fantasy
fake = { contextInfo: { externalAdReply: { title: `🌟 RECOMPENSA 🌟`, body: `Usa #fymy para ver más desafíos`, sourceUrl: accountsgb, thumbnailUrl: gataMenu }}}
logro = `\`\`\`Desafío desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por comprar ${fantasyArray.length} personajes*\n\n🌟 *Recompensas:* \`\`\`(X${user.fantasy_character2 + 1})\`\`\``
const conditionMet = [
(fantasyArray.length >= 5 && typeof fantasyArray[4].id === 'string' && fantasyArray[4].status === true && user.fantasy_character2 === 0),
(fantasyArray.length >= 10 && typeof fantasyArray[9].id === 'string' && fantasyArray[9].status === true && user.fantasy_character2 === 1),
(fantasyArray.length >= 15 && typeof fantasyArray[14].id === 'string' && fantasyArray[14].status === true && user.fantasy_character2 === 2),
(fantasyArray.length >= 20 && typeof fantasyArray[19].id === 'string' && fantasyArray[19].status === true && user.fantasy_character2 === 3),
(fantasyArray.length >= 30 && typeof fantasyArray[29].id === 'string' && fantasyArray[29].status === true && user.fantasy_character2 === 4)
].some(condition => condition)
for (const [reward, icon] of Object.entries(rewards)) {
let min, max
switch (reward) {
case 'exp':
min = 100
max = 1500
break
case 'money':
min = 100
max = 800
break
case 'limit':
min = 5
max = 30
break
default:
min = 5
max = 25
break
}
const amount = Math.floor(Math.random() * (max - min + 1) + min)
// Multiplicar la cantidad de acuerdo a user.fantasy_character2
const multipliedAmount = amount * (user.fantasy_character2 + 1)
if (conditionMet) {
user[reward] += multipliedAmount
logro += `\n*${rpgshop.emoticon(reward)}* » \`\`\`${multipliedAmount}\`\`\``
}}  
if (conditionMet) {
await conn.reply(m.chat, logro + `\n\n> Mira tus avances usando *#fymy*`, null, fake)
user.fantasy_character2++
}}

// Cuenta la cantidad de veces que se ha dado "like"
usuarioExistente = fantasyDB.find((user) => Object.keys(user)[0] === userId)
if (usuarioExistente) {
const flowArray = usuarioExistente[userId].flow || []
const likesCount = flowArray.filter(voto => voto.like).length
fake = { contextInfo: { externalAdReply: { title: `SIGUE DANDO 👍`, body: `Califica personajes, es gratis 👍`, sourceUrl: accountsgb, thumbnailUrl: gataMenu }}}
logro = `\`\`\`Desafío desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por calificar ${likesCount} veces "👍"*\n\n🌟 *Recompensas:* \`\`\`(X${user.fantasy_character3 + 1})\`\`\``
const conditionMet = [
(likesCount === 3 && user.fantasy_character3 === 0),
(likesCount === 8 && user.fantasy_character3 === 1),
(likesCount === 13 && user.fantasy_character3 === 2),
(likesCount === 18 && user.fantasy_character3 === 3),
(likesCount === 25 && user.fantasy_character3 === 4),
(likesCount === 35 && user.fantasy_character3 === 5),
(likesCount === 40 && user.fantasy_character3 === 6),
(likesCount === 55 && user.fantasy_character3 === 7),
(likesCount === 65 && user.fantasy_character3 === 8),
(likesCount === 80 && user.fantasy_character3 === 9),
(likesCount === 100 && user.fantasy_character3 === 10)
].some(condition => condition)
for (const [reward, icon] of Object.entries(rewards2)) {
let min, max
switch (reward) {
case 'potion':
min = 4
max = 15
break
case 'string':
min = 10
max = 30
break
case 'iron':
min = 15
max = 40
break
default:
min = 1
max = 25
break
}
const amount = Math.floor(Math.random() * (max - min + 1) + min)
const multipliedAmount = amount * (user.fantasy_character3 + 1)
if (conditionMet) {
user[reward] += multipliedAmount
logro += `\n*${rpgshop.emoticon(reward)}* » \`\`\`${multipliedAmount}\`\`\``
}}  
if (conditionMet) {
await conn.reply(m.chat, logro + `\n\n> Mira tus avances usando *#fymy*`, null, fake)
user.fantasy_character3++
}}

// Cuenta la cantidad de veces que se ha dado "superlike"
usuarioExistente = fantasyDB.find((user) => Object.keys(user)[0] === userId)
if (usuarioExistente) {
const flowArray = usuarioExistente[userId].flow || []
const superlikesCount = flowArray.filter(voto => voto.superlike).length
fake = { contextInfo: { externalAdReply: { title: `SIGUE DANDO ❤️`, body: `Califica personajes, es gratis ❤️`, sourceUrl: accountsgb, thumbnailUrl: gataMenu }}}
logro = `\`\`\`Desafío desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por calificar ${superlikesCount} veces "❤️"*\n\n🌟 *Recompensas:* \`\`\`(X${user.fantasy_character4 + 1})\`\`\``
const conditionMet = [
(superlikesCount === 3 && user.fantasy_character4 === 0),
(superlikesCount === 8 && user.fantasy_character4 === 1),
(superlikesCount === 13 && user.fantasy_character4 === 2),
(superlikesCount === 18 && user.fantasy_character4 === 3),
(superlikesCount === 25 && user.fantasy_character4 === 4),
(superlikesCount === 35 && user.fantasy_character4 === 5),
(superlikesCount === 40 && user.fantasy_character4 === 6),
(superlikesCount === 55 && user.fantasy_character4 === 7),
(superlikesCount === 65 && user.fantasy_character4 === 8),
(superlikesCount === 80 && user.fantasy_character4 === 9),
(superlikesCount === 100 && user.fantasy_character4 === 10)
].some(condition => condition)
for (const [reward, icon] of Object.entries(rewards3)) {
let min, max
switch (reward) {
case 'eleksirb':
min = 50
max = 100
break
case 'umpan':
min = 30
max = 90
break
case 'healtmonster':
min = 1
max = 30
break
default:
min = 10
max = 40
break
}
const amount = Math.floor(Math.random() * (max - min + 1) + min)
const multipliedAmount = amount * (user.fantasy_character4 + 1)
if (conditionMet) {
user[reward] += multipliedAmount
logro += `\n*${rpgshop.emoticon(reward)}* » \`\`\`${multipliedAmount}\`\`\``
}}  
if (conditionMet) {
await conn.reply(m.chat, logro + `\n\n> Mira tus avances usando *#fymy*`, null, fake)
user.fantasy_character4++
}}

// Cuenta la cantidad de veces que se ha dado "dislike"
usuarioExistente = fantasyDB.find((user) => Object.keys(user)[0] === userId)
if (usuarioExistente) {
const flowArray = usuarioExistente[userId].flow || []
const disLikeCount = flowArray.filter(voto => voto.dislike).length
fake = { contextInfo: { externalAdReply: { title: `SIGUE DANDO 👎`, body: `Califica personajes, es gratis 😅`, sourceUrl: accountsgb, thumbnailUrl: gataMenu }}}
logro = `\`\`\`Desafío desbloqueado 🔓\`\`\`\n\n*${conn.getName(userId)} recompensa por calificar ${disLikeCount} veces "👎"*\n\n🌟 *Recompensas:* \`\`\`(X${user.fantasy_character5 + 1})\`\`\`` 
const conditionMet = [
(disLikeCount === 3 && user.fantasy_character5 === 0),
(disLikeCount === 8 && user.fantasy_character5 === 1),
(disLikeCount === 13 && user.fantasy_character5 === 2),
(disLikeCount === 18 && user.fantasy_character5 === 3),
(disLikeCount === 25 && user.fantasy_character5 === 4),
(disLikeCount === 35 && user.fantasy_character5 === 5),
(disLikeCount === 40 && user.fantasy_character5 === 6),
(disLikeCount === 55 && user.fantasy_character5 === 7),
(disLikeCount === 65 && user.fantasy_character5 === 8),
(disLikeCount === 80 && user.fantasy_character5 === 9),
(disLikeCount === 100 && user.fantasy_character5 === 10)
].some(condition => condition)
for (const [reward, icon] of Object.entries(rewards4)) {
let min, max
switch (reward) {
case 'bibitanggur':
min = 50
max = 150
break
case 'bibitjeruk':
min = 100
max = 300
break
case 'bibitpisang':
min = 40
max = 80
break
default:
min = 30
max = 70
break
}
const amount = Math.floor(Math.random() * (max - min + 1) + min)
const multipliedAmount = amount * (user.fantasy_character5 + 1)
if (conditionMet) {
user[reward] += multipliedAmount
logro += `\n*${rpgshop.emoticon(reward)}* » \`\`\`${multipliedAmount}\`\`\``
}}  
if (conditionMet) {
await conn.reply(m.chat, logro + `\n\n> Mira tus avances usando *#fymy*`, null, fake)
user.fantasy_character5++
}}

}
export default handler
