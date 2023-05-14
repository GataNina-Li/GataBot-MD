// by https://github.com/elrebelde21 & https://github.com/GataNina-Li

import { randomBytes } from 'crypto'

let handler = async (m, { conn, command, participants, usedPrefix, text }) => { 
  if (!text && !m.quoted) return m.reply(lenguajeGB.smsBCMensaje(usedPrefix, command))   
let cc4 = text ? m : m.quoted ? await m.getQuotedObj() : false || m
let teks4 = text ? text : cc4.text 
let groups2 = Object.keys(await conn.groupFetchAllParticipating())
let chats2 = Object.keys(global.db.data.users).filter(user => user.endsWith('@s.whatsapp.net'))
await conn.reply(m.chat, lenguajeGB.smsBCMensaje2(), m)
let start2 = new Date().getTime()
let usersTag2 = participants.map(u => conn.decodeJid(u.id))
let totalPri2 = 0
for (let group of groups2) {
await conn.reply(group, `${lenguajeGB.smsBCbot7()}\n\n` + teks4, { mentions: usersTag2 }, { quoted: m })     
}
for (let user of chats2) {
await new Promise(resolve => setTimeout(resolve, 2000)) // 2 segundos
await conn.reply(user, `${lenguajeGB.smsBCbot7()}\n\n` + teks4, null)
totalPri2++
if (totalPri2 >= 3000) { 
break
}}  
let end2 = new Date().getTime()
let totalPrivate2 = chats2.length
let totalGroups2 = groups2.length
let total2 = totalPrivate2 + totalGroups2
let time2 = Math.floor((end2 - start2) / 1000)
if (time2 >= 60) {
let minutes = Math.floor(time2 / 60)
let seconds = time2 % 60
time2 = `${minutes} minutos y ${seconds} segundos`
} else {
time2 = `${time2} segundos`
} 
await m.reply(`${lenguajeGB.smsBCbot1()}
\`\`\`${lenguajeGB.smsBCbot2()} >> ${totalPrivate2}\`\`\`
\`\`\`${lenguajeGB.smsBCbot3()} >>   ${totalGroups2}\`\`\`
\`\`\`${lenguajeGB.smsBCbot4()} >>   ${total2}\`\`\`\n\n*${lenguajeGB.smsBCbot5()} ${time2}*\n${totalPri2 >= 3000 ? `\n*${lenguajeGB.smsBCbot6()}*` : ''}`)        
}
handler.help = ['broadcast', 'bc'].map(v => v + ' <teks>')
handler.tags = ['owner']
handler.command = /^(comunicar|comunicado|broadcastall|bc)$/i

handler.owner = true

export default handler
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

const randomID = length => randomBytes(Math.ceil(length * .5)).toString('hex').slice(0, length)
