// Acepta Gata...
import { sticker } from '../lib/sticker.js'

let handler = (m) => m
handler.before = async function (m) {
let chat = db.data.chats[m.chat]
let user = db.data.users[m.sender]

if (chat.autosticker && m.isGroup) {
let q = m
let stiker = false
let mime = (q.msg || q).mimetype || q.mediaType || ''
if (/webp/g.test(mime)) return

// Obtiene autor y paquete del texto en el mensaje
let customAuthor = author
let customPackname = packname
if (m.text && m.text.includes('|')) {
const parts = m.text.split('|').map(p => p.trim())
if (parts.length === 2) {
customAuthor = parts[0] || author
customPackname = parts[1] || packname
}}

if (/image/g.test(mime)) {
let img = await q.download?.()
if (!img) return
// Usa los nombres asignados del mensaje 
stiker = await sticker(img, false, customAuthor, customPackname)
} else if (/video/g.test(mime)) {
if (/video/g.test(mime)) {
if ((q.msg || q).seconds > 8) {
return await m.reply(lenguajeGB.smsAutoStik())
}}
let img = await q.download()
if (!img) return
stiker = await sticker(img, false, customAuthor, customPackname)
} else if (m.text.split(/\n| /i)[0]) {
if (isUrl(m.text)) {
stiker = await sticker(false, m.text.split(/\n| /i)[0], customAuthor, customPackname)
} else {
return
}}

if (stiker) {
await conn.sendFile(
m.chat,
stiker,
'sticker.webp',
'',
m,
true,
{
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: gt,
body: ' 😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 ',
mediaType: 2,
thumbnail: gataImg,
sourceUrl: accountsgb
}
}
},
{quoted: m}
)
//this.sendFile(m.chat, stiker, null, { asSticker: true })
}
}
return !0
}
export default handler

const isUrl = (text) => {
return text.match(
new RegExp(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png|mp4)/, 'gi')
)
}
