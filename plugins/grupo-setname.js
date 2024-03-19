//import Presence from '@adiwajshing/baileys'
let Presence = (await import(global.baileys)).default
let handler  = async (m, { conn, args, text }) => {
const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || './src/grupos.jpg' 
if (!text) return conn.reply(m.chat, lenguajeGB['smsNam2'](), fkontak, m)
try {
let text = args.join` `
if(!args || !args[0]) {
} else {
conn.groupUpdateSubject(m.chat, text)}
conn.reply(m.chat, lenguajeGB.smsNam1(), fkontak, m)
//conn.sendButton(m.chat, wm, lenguajeGB.smsNam1(), pp, [[lenguajeGB.smsConMenu(), `/menu`]], fkontak, m)}
} catch (e) { 
//return conn.reply(m.chat, lenguajeGB['smsNam3'](), fkontak, m)
throw lenguajeGB['smsNam3']()
}}
handler.command = /^(setname|newnombre|nuevonombre)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler 
