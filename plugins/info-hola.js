import fs from "fs"
let handler = m => m

handler.all = async function (m) {
let vn = './media/bot.mp3'
const estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) },
message: { 
orderMessage: { itemCount : 999999, status: 1, surface : 1, message: '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', orderTitle: 'Bang', thumbnail: fs.readFileSync('./media/menus/Menu3.jpg'), sellerJid: '0@s.whatsapp.net'    
}}}

if (/^hola$/i.test(m.text)) {
    
conn.sendButton(m.chat, `Hola`, 'conversation', { sendEphemeral: true, quoted: estilo })
conn.sendFile(m.chat, vn, 'bot.mp3', null, m, true, { type: 'audioMessage', ptt: true, sendEphemeral: true, quoted: estiloaudio })   
}
return !0
}
export default handler
