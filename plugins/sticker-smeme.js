import { addExif } from '../lib/sticker.js'
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!m.quoted) throw '*[❗𝙄𝙣𝙛𝙤❗] 𝙍𝙚𝙨𝙥𝙤𝙣𝙙𝙚 𝙖𝙡 𝙨𝙩𝙞𝙘𝙠𝙚𝙧 𝙦𝙪𝙚 𝙙𝙚𝙨𝙚𝙖 𝙖𝙜𝙧𝙚𝙜𝙖 𝙪𝙣 𝙥𝙖𝙦𝙪𝙚𝙩𝙚 𝙮 𝙪𝙣 𝙣𝙤𝙢𝙗𝙧𝙚*'
let stiker = false
try {
    let [atas, bawah] = text.split`|`
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!/webp/.test(mime)) throw '*[❗𝙄𝙣𝙛𝙤❗] 𝙍𝙚𝙨𝙥𝙤𝙣𝙙𝙚 𝙖𝙡 𝙨𝙩𝙞𝙘𝙠𝙚𝙧 𝙦𝙪𝙚 𝙙𝙚𝙨𝙚𝙖 𝙖𝙜𝙧𝙚𝙜𝙖 𝙪𝙣 𝙥𝙖𝙦𝙪𝙚𝙩𝙚 𝙮 𝙪𝙣 𝙣𝙤𝙢𝙗𝙧𝙚*'
    let img = await m.quoted.download()
if (!img) throw '*[❗𝙄𝙣𝙛𝙤❗] 𝙍𝙚𝙨𝙥𝙤𝙣𝙙𝙚 𝙖𝙡 𝙨𝙩𝙞𝙘𝙠𝙚𝙧 𝙦𝙪𝙚 𝙙𝙚𝙨𝙚𝙖 𝙖𝙜𝙧𝙚𝙜𝙖 𝙪𝙣 𝙥𝙖𝙦𝙪𝙚𝙩𝙚 𝙮 𝙪𝙣 𝙣𝙤𝙢𝙗𝙧𝙚*'
    let url = await uploadsticker(img)
    let meme = `https://api.memegen.link/sticker/custom/${encodeURIComponent(atas ? atas : '')}/${encodeURIComponent(bawah ? bawah : '')}.png?background=${url}`
    let stiker = await sticker(false, meme, global.packname, global.author)
    if (stiker) await conn.sendFile(m.chat, stiker, '', author, m, '', { asSticker: 1 })
}
handler.help = ['smeme (teks|teks)']
handler.tags = ['sticker']
handler.command = /^(smeme)$/i

handler.limit = true

export default handler

/*
import uploadImage from '../lib/uploadImage.js'
import { sticker } from '../lib/sticker.js'
let handler = async (m, { conn, text, usedPrefix, command }) => {
    let [atas, bawah] = text.split`|`
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) throw `Responde a una imagen\nejemplo: .smeme bot|uwu`
    if (!/image\/(jpe?g|png)/.test(mime)) throw `Error, vuelva al intenta`
    m.reply(global.wait)
    let img = await q.download()
    let url = await uploadImage(img)
    let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas ? atas : '')}/${encodeURIComponent(bawah ? bawah : '')}.png?background=${url}`
    let stiker = await sticker(false, meme, global.packname, global.author)
    if (stiker) await conn.sendFile(m.chat, stiker, '', author, m, '', { asSticker: 1 })
}
handler.help = ['smeme (teks|teks)']
handler.tags = ['sticker']
handler.command = /^(smeme)$/i
*/
