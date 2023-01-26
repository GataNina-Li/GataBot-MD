 //BY: VIRUZZ-OFC

let handler = async (m, { conn, text, command, usedPrefix, args }) => {
let pp = 'https://media.istockphoto.com/id/460171067/es/foto/sacudir-el-bot%C3%B3n.jpg?s=612x612&w=0&k=20&c=TsX1krTyz8oyRNhpcbri4dguh3WyAZwYOwMu2T68S2A='
if (!args[0]) throw conn.sendHydrated(m.chat, '*Cara o Cruz*\n\nPuedes eleguir la opción con los botones o usa los comandos:\n.suerte cruz\n.suerte cara\n\n usar en minúsculas',wm, pp, null, null, null, null, [
['Cara', `${usedPrefix + command} cara`],
['Cruz', `${usedPrefix + command} cruz`]
], m)
var astro = Math.random()
if (astro < 0.34) {
    astro = 'cara'
} else if (astro > 0.34){
astro = 'cruz' 
}
if (text == astro) {
global.db.data.users[m.sender].exp += 1000
m.reply(`ganaste \n\nelegiste: ${text}\nresultado: cara\nganaste +1000 XP`)
} else if (text == 'cara') {
if (astro == 'cara') {
global.db.data.users[m.sender].exp += 1000
m.reply(`ganaste\n\nelegiste: ${text}\nresultado: cara\nganaste +1000 XP`)
} else {
global.db.data.users[m.sender].exp -= 300
m.reply(`perdiste\n\nelegiste: ${text}\nresultado: cruz\nperdiste -300 XP`)
}
} else if (text == 'cara') {
if (astro == 'cara') {
global.db.data.users[m.sender].exp += 1000
m.reply(`ganaste\n\nelegiste: ${text}\nresultado: cara\nganaste +1000 XP`)
} else {
global.db.data.users[m.sender].exp -= 300
m.reply(`perdiste\n\nelegiste: ${text}\nresultado: cruz\nperdiste -300 XP*`)
}
}else if (text == 'cruz') {
if (astro == 'cruz') {
global.db.data.users[m.sender].exp += 1000
m.reply(`ganaste\n\nelegiste: ${text}\nresultado: cruz\nganaste+1000 XP`)
} else {
global.db.data.users[m.sender].exp -= 300
m.reply(`perdiste\n\neleguiste ${text}\nresultado cara\nperdiste -300 XP`)
}} else if (text == 'cruz') {
if (astro == 'cruz') {
global.db.data.users[m.sender].exp += 1000
m.reply(`ganaste\n\nelegiste ${text}\nresultado: cruz\nganaste +1000 XP`)
} else {
global.db.data.users[m.sender].exp -= 300
m.reply(`perdiste\n\nelegiste: ${text}\nresultado: cara\nperdiste -300 XP`)
}
} else if (text == 'cara') {
if (astro == 'cara') {
global.db.data.users[m.sender].exp += 1000
m.reply(`ganaste\n\nelegiste: ${text}\nresultado: cara\nganaste +1000 XP`)
} else {
global.db.data.users[m.sender].exp -= 300
m.reply(`perdiste\n\nelegiste: ${text}\nresultado: cruz\nperdiste -300 XP`)
}
}}
handler.help = ['suerte']
handler.tags = ['games']
handler.command = /^(suerte)$/i
export default handler
