import uploadImage from '../lib/uploadImage.js'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text, args }) => {
let stiker = false
let json

let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || q.mediaType || ''
if (/image/g.test(mime) && !/webp/g.test(mime)) {
await m.reply(wait)
let buffer = await q.download()
let media = await (uploadImage)(buffer)
json = await (await fetch(`https://aemt.me/removebg?url=${media}`)).json()
stiker = await sticker(false, json.url.result, global.packname, global.author)
} else if (text) {
json = await (await fetch(`https://aemt.me/removebg?url=${text}`)).json()
if (isUrl(text)) stiker = await sticker(false, json.url.result, global.packname, global.author) 
} else return m.reply(`*Responde a una imagen o ingresa una url que sea \`(jpg, jpeg o png)\` para quitar el fondo*`)

await conn.sendMessage(m.chat, { image: { url: json.url.result }, caption: null }, { quoted: m })
await conn.sendFile(m.chat, stiker, 'sticker.webp', '', null, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: packname, body: '• STICKER •', mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: gataImg.getRandom()}}})
}
handler.command = /^(s?removebg)$/i
export default handler

const isUrl = (text) => {
return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|png)/, 'gi'))
}
