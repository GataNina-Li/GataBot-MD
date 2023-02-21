//este antiprivado  todavía está el desarrollo.

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
if (m.isBaileys && m.fromMe) return !0
if (m.isGroup) return !1
if (!m.message) return !0 
if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') || m.text.includes('bots') || m.text.includes('creadora') || m.text.includes('ping') || m.text.includes('bottemporal') || m.text.includes('gruposgb') 
    || m.text.includes('instalarbot') || m.text.includes('términos') || m.text.includes('deletebot') || m.text.includes('serbot') || m.text.includes('jadibot')) return !0
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
let bot = global.db.data.settings[this.user.jid] || {}
if (bot.antipv && !isOwner && !isROwner) {
await m.reply(`Hola @${m.sender.split`@`[0]} NO PUEDE USAR ESTE BOT EN CHAT PRIVADO\nUnirte al Grupo oficial del bot para poder usar el bot ${nn}`, false, { mentions: [m.sender] })
handler.group = true
return !1
}}
