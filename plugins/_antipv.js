export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
if (m.isBaileys && m.fromMe) return !0
if (!m.message) return !0
if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') || m.text.includes('serbot') || m.text.includes('jadibot')) return !0
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
let bot = global.db.data.settings[this.user.jid] || {}
if (bot.antipv && !isOwner && !isROwner) {
await m.reply(`*[❗] 𝙃𝙊𝙇𝘼 @${m.sender.split`@`[0]}*, 𝙀𝙎𝙏𝘼 𝙋𝙍𝙊𝙃𝙄𝘽𝙄𝘿𝙊 𝙃𝘼𝘽𝙇𝘼 𝘼𝙇 𝙋𝙍𝙄𝙑𝘼𝘿𝙊 𝘿𝙀𝙇 𝘽𝙊𝙏 𝙎𝙀𝙍𝘼𝙎 𝘽𝙇𝙊𝙌𝙐𝙀𝘼𝘿𝙊\n𝙃𝘼𝘽𝙇𝘼 𝘾𝙊𝙉 𝙈𝙄 𝘾𝙍𝙀𝘼𝘿𝙊𝙍𝘼 𝙎𝙄 𝙋𝙊𝙍 𝙐𝙉 𝙀𝙍𝙍𝙊𝙍 𝙀𝙎𝘾𝙍𝙄𝘽𝙄𝙎𝙏𝙀 𝘼𝙇 𝘽𝙊𝙏 𝙔 𝙌𝙐𝙄𝙀𝙍𝙀 𝙌𝙐𝙀 𝙏𝙀 𝘿𝙀𝙎𝘽𝙇𝙊𝙌𝙐𝙀𝙀.\n 𝘼𝙎𝙄𝙎𝙏𝙀𝙉𝘾𝙄𝘼 𝙋𝘼𝙍𝘼 𝙐𝙎𝙐𝘼𝙍𝙄𝙊: https://instagram.com/gata_dios\n\n*Unete al Grupo para usar GataBot ${nn}*`, false, { mentions: [m.sender] })
user.banned = true
if (!m.isGroup) return !1
chat.isBanned = false
await m.reply(`desbaneado`, m) 
return !1
}}
