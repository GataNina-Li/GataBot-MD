import { randomBytes } from 'crypto'
let handler = async (m, { conn, command, usedPrefix, text }) => {
  if (!text && !m.quoted) return m.reply(lenguajeGB.smsBCMensaje(usedPrefix, command))        
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${conn.user.jid.split('@')[0]}:${conn.user.jid.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" } 
let cc3 = text ? m : m.quoted ? await m.getQuotedObj() : false || m
let teks3 = text ? text : cc3.text  
let chats = Object.keys(global.db.data.users).filter(user => user.endsWith('@s.whatsapp.net')) 
await conn.reply(m.chat, lenguajeGB.smsBCMensaje2(), m)
let start = new Date().getTime()
let totalPri = 0
for (let user of chats) {
await new Promise(resolve => setTimeout(resolve, 2000)) // 2 segundos
await conn.reply(user, `${lenguajeGB.smsBCbot7()}\n\n` + teks3, fkontak, null)
totalPri++
if (totalPri >= 500000) { 
break
}}   
let end = new Date().getTime() 
let time = Math.floor((end - start) / 1000)
if (time >= 60) {
let minutes = Math.floor(time / 60)
let seconds = time % 60
time = `${minutes} minutos y ${seconds} segundos`
} else {
time = `${time} segundos`
}
await m.reply(lenguajeGB.smsBCMensaje3(totalPri, time)) 
}
handler.help = ['broadcastchats', 'bcchats'].map(v => v + ' <teks>')
handler.tags = ['owner']
handler.command = /^(broadcastchats?|bcc(hats?)?)$/i

handler.owner = true

export default handler
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

const randomID = length => randomBytes(Math.ceil(length * .5)).toString('hex').slice(0, length)

  
