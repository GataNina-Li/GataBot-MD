import fetch from 'node-fetch'
import uploader from '../lib/uploadImage.js'

var handler = async (m, { conn, text, command, usedPrefix }) => {

let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || q.mediaType || ''
if (/image/g.test(mime) && !/webp/g.test(mime)) {
let buffer = await q.download()

await m.reply(wait)

let media = await (uploader)(buffer)
let json = await (await fetch(`https://aemt.me/bardimg?url=${media}&text=${text}`)).json()

conn.sendMessage(m.chat, { text: json.result }, { quoted: m })

} else throw `RESPONDE A UNA IMAGEN CON UN TEXTO\n\nEJEMPLO\n${usedPrefix + command} dame información sobre la imagen enviada`
  
}
handler.help = ['bardimg', 'geminiimg']
handler.tags = ['herramientas']
handler.command = /^(bardimg|bardimage|geminiimg|geminiimage|geminimg|geminimage)$/i

handler.limit = true

export default handler
