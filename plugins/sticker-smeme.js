import uploadImage from '../lib/uploadImage.js'
import { sticker } from '../lib/sticker.js'
let handler = async (m, { conn, text, usedPrefix, command }) => {
    let [atas, bawah] = text.split`|`
    let q = m.quoted ? m.quoted : m
    let mime = m.quoted.mimetype || ''
if (!m.quoted) throw '*[❗𝙄𝙣𝙛𝙤❗] 𝙍𝙚𝙨𝙥𝙤𝙣𝙙𝙚 𝙖𝙡 𝙨𝙩𝙞𝙘𝙠𝙚𝙧 𝙦𝙪𝙚 𝙙𝙚𝙨𝙚𝙖 𝙖𝙜𝙧𝙚𝙜𝙖 𝙪𝙣 𝙥𝙖𝙦𝙪𝙚𝙩𝙚 𝙮 𝙪𝙣 𝙣𝙤𝙢𝙗𝙧𝙚*'
let stiker = false
    m.reply(global.wait)
    let img = await q.download()
    let url = await uploadImage(img)
    let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas ? atas : '')}/${encodeURIComponent(bawah ? bawah : '')}.png?background=${url}`
    stiker = await addExif(false, meme, global.packname, global.author)
    if (stiker) await conn.sendFile(m.chat, stiker, '', author, m, '', { asSticker: 1 })
}
handler.help = ['smeme (teks|teks)']
handler.tags = ['sticker']
handler.command = /^(smeme)$/i

handler.limit = true

export default handler