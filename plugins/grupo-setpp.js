let handler = async (m, { conn, usedPrefix, command }) => {
let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || q.mediaType || ''
if (/image/.test(mime)) {
let img = await q.download()
if (!img) throw '*⚠️️ Responde a una imagen.*'
await conn.updateProfilePicture(m.chat, img).then(_ => m.reply('⚘ *_Imagen actualizada con éxito._*'))
} else throw '*⚠️️ Responde a una imagen.*'}
handler.command = /^setpp(group|grup|gc)?$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler
