export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
if (m.isBaileys && m.fromMe) return !0
if (m.isGroup) return !1
if (!m.message) return !0
if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') ||  m.text.includes('bots') || m.text.includes('serbot') || m.text.includes('jadibot')) return !0
let chat = global.db.data.chats[m.chat]
let bot = global.db.data.settings[this.user.jid] || {}
if (bot.antiPrivate && !isOwner && !isROwner) {
await m.reply(`*[❗] 𝙃𝙊𝙇𝘼 @${m.sender.split`@`[0]}*, 𝙀𝙎𝙏𝘼 𝙋𝙍𝙊𝙃𝙄𝘽𝙄𝘿𝙊 𝙃𝘼𝘽𝙇𝘼 𝘼𝙇 𝙋𝙍𝙄𝙑𝘼𝘿𝙊 𝘿𝙀𝙇 𝘽𝙊𝙏\n𝙎𝙊𝙇𝙊 𝙎𝙄 𝙌𝙐𝙄𝙀𝙍𝙀 𝙃𝘼𝘾𝙀𝙍𝙏𝙀 𝙐𝙉 𝘽𝙊𝙏.\n𝙈𝘼𝙉𝘿𝘼 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 .serbot\n𝘼𝙎𝙄𝙎𝙏𝙀𝙉𝘾𝙄𝘼 𝙋𝘼𝙍𝘼 𝙐𝙎𝙐𝘼𝙍𝙄𝙊: https://instagram.com/gata_dios\n\n*𝙐𝙉𝙀𝙏𝙀 𝘼𝙇 𝙂𝙍𝙐𝙋𝙊 𝙋𝘼𝙍𝘼 𝙐𝙎𝘼𝙍 𝘼𝙇 𝙂𝘼𝙏𝘼𝘽𝙊𝙏 ${nn}*`, false, { mentions: [m.sender] })
handler.group = true
return !1
}}
