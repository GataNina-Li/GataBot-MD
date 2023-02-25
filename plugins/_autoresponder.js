import { sticker } from '../lib/sticker.js'
let handler = m => m

handler.all = async function (m, {conn}) {
let chat = global.db.data.chats[m.chat]
    
if (m.mentionedJid.includes(this.user.jid) && m.isGroup && !chat.isBanned) {
let stiker = await sticker(imagen1, false, global.packname, global.author)  
this.sendFile(m.chat, stiker, 'sticker.webp', null, m, false, { 
contextInfo: { externalAdReply: { title: '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿 🐈', body: '𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨', sourceUrl: `https://github.com/GataNina-Li/GataBot-MD`, thumbnail: imagen2}}})}
    
return !0 }
export default handler
