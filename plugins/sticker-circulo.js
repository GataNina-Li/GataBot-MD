// Gracias a https://github.com/BrunoSobrino

import uploadImage from '../lib/uploadImage.js'
import { sticker } from '../lib/sticker.js'
let handler = async (m, { conn, text, usedPrefix, command }) => {
let user = global.db.data.users[m.sender]
let f = user.packname || global.packname
let g = (user.packname && user.author ? user.author : (user.packname && !user.author ? '' : global.author))
try {
let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || ''
let img = await q.download()
let url = await uploadImage(img)
let scircle = global.API('dzx', '/api/canvas/circle', { url }) 
let stiker = await sticker(null, scircle, f, g)
conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, { asSticker: true })
} catch (e) {
m.reply(`${fg}𝙍𝙀𝘾𝙐𝙀𝙍𝘿𝙀 𝙐𝙎𝘼𝙍 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 *${usedPrefix + command}* 𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝙄𝙀𝙉𝘿𝙊 𝘼 𝙐𝙉𝘼 𝙄𝙈𝘼𝙂𝙀𝙉, 𝙋𝘼𝙍𝘼 𝙃𝘼𝘾𝙀𝙍 𝙐𝙉 𝙎𝙏𝙄𝘾𝙆𝙀𝙍 𝘾𝙄𝙍𝘾𝙐𝙇𝘼𝙍\n\n𝙍𝙀𝙈𝙀𝙈𝘽𝙀𝙍 𝙏𝙊 𝙐𝙎𝙀 𝙏𝙃𝙀 𝘾𝙊𝙈𝙈𝘼𝙉𝘿 *${usedPrefix + command}* 𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝙄𝙉𝙂 𝙏𝙊 𝘼𝙉 𝙄𝙈𝘼𝙂𝙀, 𝙏𝙊 𝙈𝘼𝙆𝙀 𝘼 𝘾𝙄𝙍𝘾𝙐𝙇𝘼𝙍 𝙎𝙏𝙄𝘾𝙆𝙀𝙍`)
}}
handler.command = /^scircle|circle|círculo|circulo|scírculo|scirculo|sircle|redondo|circular$/i
export default handler
/* `https://api.dhamzxploit.my.id/api/canvas/circle?url=${url}` */
