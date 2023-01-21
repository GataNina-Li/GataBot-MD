/*export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
if (m.isBaileys && m.fromMe) return !0
if (m.isGroup) return !1
if (!m.message) return !0
if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') 
    ||  m.text.includes('bots') || m.text.includes('serbot') || m.text.includes('jadibot') 
    || m.text.includes('creadora') || m.text.includes('ping') || m.text.includes('bottemporal') || m.text.includes('gruposgb') 
    || m.text.includes('instalarbot') || m.text.includes('términos') || m.text.includes('donar')) return !0
let chat = global.db.data.chats[m.chat]
let bot = global.db.data.settings[this.user.jid] || {}
let user = global.db.data.users[m.sender]
if (bot.antiPrivate && !isOwner && !isROwner) {
await m.reply(`*@${m.sender.split`@`[0]} NO PUEDE USAR ESTE BOT EN CHAT PRIVADO, SERÁ BANEADO(A)*`, false, { mentions: [m.sender] })
//await this.updateBlockStatus(m.chat, 'block')
}
user.banned = true
return !1
}*/ //ESTA DAÑADO ESPEREN O SOLUCIONEN JJJJJ
