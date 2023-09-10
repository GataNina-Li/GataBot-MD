let fs = require('fs')
let handler = async (m, { conn, usedPrefix }) => {
let pp = './Menu2.jpg'
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)
let user = global.db.data.users[m.sender]
let taguser = '@' + m.sender.split("@s.whatsapp.net")[0]
let menu = `
╭══〘 ✯✯✯✯✯✯✯✯ 〙═╮
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡
║➤ *✨HOLA SOY ALCA BOT, ${taguser} :D*
║≡≡≡≡≡≡≡≡≡≡≡≡≡≡
╰══╡✯✯✯✯✯✯✯✯╞══╯
┏━━━━━━━━━━━━━┓
┃ *< HERRAMIENTAS >*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟🧤 _a_
┣ ඬ⃟🧤 _${usedPrefix}on welcome_
┣ ඬ⃟🧤 _${usedPrefix}off welcome_
┣ ඬ⃟🧤 _${usedPrefix}sticker *[url]*_
┣ ඬ⃟🧤 _${usedPrefix}ttp *[texto]*_
┣ ඬ⃟🧤 _${usedPrefix}imagen *[texto]*_
┣ ඬ⃟🧤 _${usedPrefix}play *[texto]*_
┣ ඬ⃟🧤 _${usedPrefix}invocar *[texto]*_
┣ ඬ⃟🧤 _${usedPrefix}tts *[lenguaje] [texto]*_
┣ ඬ⃟🧤 _${usedPrefix}sticker *[imagen]*_

┃ *< ALCABOT V1 >*
┃≡≡≡≡≡≡≡≡≡≡≡≡≡≡
┣ ඬ⃟⛔️ _${usedPrefix}update_
┣ ඬ⃟⛔️ _${usedPrefix}banchat_
┣ ඬ⃟⛔️ _${usedPrefix}unbanchat_
┗━━━━━━━━━━━━━┛`.trim()
conn.sendFile(m.chat, pp, 'lp.jpg', menu, m, false, { contextInfo: { mentionedJid }})
}
handler.help = ['menu', 'help', '?']
handler.tags = ['general']
handler.command = /^(menucompleto|comandos|allmenu|info|speed|estado|menú|menu|help|\?)$/i
handler.fail = null
module.exports = handler
