import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'
let handler = async (m, {command, conn, usedPrefix}) => {
if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${lenguajeGB['smsContAdult']()}`
  
if (command == 'prueba5') {
let res = await fetch(APIs.nekobot + "image?type=" + "hentai") 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: wm, body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: imagen1}}}, { quoted: m })
}else{
await conn.sendButton(m.chat, `${json.message}`.trim(), wm, link, [['🥵 𝙎𝙄𝙂𝙐𝙄𝙀𝙉𝙏𝙀 | 𝙉𝙀𝙓𝙏 🥵', `/${command}`]], m)}
}}  
handler.command = ['prueba5']
export default  handler
