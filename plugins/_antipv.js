export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, private }) {
if (m.isBaileys && m.fromMe) return !0
if (m.isGroup) return !1
if (!m.message) return !0
if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') || m.text.includes('serbot') || m.text.includes('jadibot')) return !0
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
let bot = global.db.data.settings[this.user.jid] || {}
if (bot.antipv && !m.isGroup) {
await m.reply(`𝙃𝙤𝙡𝙖 @${m.sender.split`@`[0]}, 𝙚𝙨𝙩𝙖 𝙥𝙧𝙤𝙝𝙞𝙗𝙞𝙙𝙤`, false, { mentions: [m.sender] })
user.banned = true 
} 
if (bot.antipv && m.isGroup) { 
user.banned = false
m.reply('Desbaneado en Grupo')
}
return !1
}