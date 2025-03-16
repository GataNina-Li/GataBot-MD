import uploadImage from '../lib/uploadImage.js'
import { sticker } from '../lib/sticker.js'
let handler = async (m, { conn, text, usedPrefix, command }) => {
let user = global.db.data.users[m.sender]
let f = user.packname || global.packname
let g = (user.packname && user.author ? user.author : (user.packname && !user.author ? '' : global.author))
let [atas, bawah] = text.split`|`
let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || ''
if (!mime) throw `RESPONDE A UNA IMAGEN\nEJEMPLO: .smeme bot|uwu`
if (!/image\/(jpe?g|png)/.test(mime)) throw `Error`
m.reply(global.wait)
let img = await q.download()
let url = await uploadImage(img)
let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas ? atas : '')}/${encodeURIComponent(bawah ? bawah : '')}.png?background=${url}`
let stiker = await sticker(false, meme, f, g)
if (stiker) await conn.sendFile(m.chat, stiker, '', author, m, '', { asSticker: 1 })
}
handler.help = ['smeme (teks|teks)']
handler.tags = ['sticker']
handler.command = /^(smeme)$/i

handler.limit = true

export default handler