let handler = async (m, { conn, usedPrefix, text, command }) => {
let hash = text
if (m.quoted && m.quoted.fileSha256) hash = m.quoted.fileSha256.toString('hex')
if (!hash) throw `*[❗INFO❗] SOLO SE PUEDE ASIGNAR TEXTO O COMANDO A STICKER  E IMAGBE, PARA OBTENER EL CODIGO ASIGNADO USE EL COMANDO ${usedPrefix}listcmd*`
let sticker = global.db.data.sticker
if (sticker[hash] && sticker[hash].locked) throw '*[❗INFO❗] SOLO EL OWNER PUEDE REALIZAR ESTA MODIFICACIÓN*'
delete sticker[hash]
m.reply(`*[ ✔ ]  EL TEXTO/COMANDO ASIGNADO AL STICKER E IMAGEN FUE ELIMINADO DE LA BASE DE DATOS CORRECTAMENTE*`)}
handler.command = ['delcmd']
handler.rowner = true
export default handler
