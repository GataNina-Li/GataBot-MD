import { webp2png } from '../lib/webp2mp4.js'
let handler = async (m, { conn, usedPrefix, command }) => {
const notStickerMessage = `${lenguajeGB['smsAvisoMG']()}${mid.smsconvert3} *${usedPrefix + command}*`
//if (!m.quoted) return m.reply(notStickerMessage)
const q = m.quoted || m
const mime = q.mediaType || ''
if (!/sticker/.test(mime)) return m.reply(notStickerMessage)
const media = await q.download()
let out = await webp2png(media).catch(_ => null) || Buffer.alloc(0)
await conn.sendFile(m.chat, out, 'error.png', null, m)
}
handler.help = ['toimg (reply)']
handler.tags = ['sticker']
handler.command = ['toimg', 'img', 'jpg']
export default handler
