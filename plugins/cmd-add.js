let handler = async (m, { conn, text, usedPrefix, command }) => {
global.db.data.sticker = global.db.data.sticker || {}
if (!m.quoted) throw '*[❗INFO❗] RESPONDE AL STICKER O IMAGEN AL CUAL QUIERE AGREGA UN COMANDO O TEXTO*'
if (!m.quoted.fileSha256) throw '*[❗INFO❗] SOLO PUEDES ASIGNAR COMANDOS O TEXTOS A STICKERS E IMAGEN*'
if (!text) throw `*[❗INFO❗] ERROR, LOS USARTE MAL,\n USA DE ESTA MANERA:*\n*—◉ ${usedPrefix + command} <texto> <responder a sticker o imagen>*\n\n*EJEMPLOS:*\n*—◉ ${usedPrefix + command} <#menu> <responder a sticker o imagen>*`
let sticker = global.db.data.sticker
let hash = m.quoted.fileSha256.toString('base64')
if (sticker[hash] && sticker[hash].locked) throw '*[❗INFO❗] SOLO EL OWNER PUEDE REALIZAR ESTA MODIFICACIÓN*'
sticker[hash] = { text, mentionedJid: m.mentionedJid, creator: m.sender, at: + new Date, locked: false }
m.reply(`*[ ✔ ] EL TEXTO/COMANDO ASIGNADO AL STICKER E IMAGEN FUE AGREGADO A LA BASE DE DATOS CORRECTAMENTE*`)
}
handler.command = ['setcmd', 'addcmd', 'cmdadd', 'cmdset']
handler.rowner = true
export default handler
