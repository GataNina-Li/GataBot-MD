import uploadImage from '../lib/uploadImage.js'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text, args }) => {
let user = global.db.data.users[m.sender]
let f = user.packname || global.packname
let g = (user.packname && user.author ? user.author : (user.packname && !user.author ? '' : global.author))
let stiker = false
let json

let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || q.mediaType || ''
if (/image/g.test(mime) && !/webp/g.test(mime)) {
let buffer = await q.download()
let media = await (uploadImage)(buffer)
json = await (await fetch(`https://btch.us.kg/removebg?url=${media}`)).json()
stiker = await sticker(false, json.result.urls, f, g)
} else if (text) {
json = await (await fetch(`https://btch.us.kg/removebg?url=${text.trim()}`)).json()
} else return m.reply(`*Responde a una imagen o ingresa una url que sea \`(jpg, jpeg o png)\` para quitar el fondo*`)

//await mensajesEditados(conn, m)
//await conn.sendMessage(m.chat, { text: waitttttt, edit: key })
await conn.sendMessage(m.chat, { image: { url: json.result.urls }, caption: null }, { quoted: m })
await conn.sendFile(m.chat, stiker ? stiker : await sticker(false, json.result.urls, global.packname, global.author), 'sticker.webp', '',m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: wm, body: `😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 `, mediaType: 2, sourceUrl: accountsgb, thumbnail: imagen1}}}, { quoted: m })
}
handler.command = /^(s?removebg)$/i
export default handler

const isUrl = (text) => {
const urlRegex = /^(https?):\/\/[^\s/$.?#]+\.(jpe?g|png)$/i
return urlRegex.test(text)
}

