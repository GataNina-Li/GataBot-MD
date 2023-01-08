export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
if (m.isBaileys && m.fromMe) return !0
if (m.isGroup) return !1
if (!m.message) return !0
if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') || m.text.includes('serbot') || m.text.includes('jadibot')) return !0
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
let bot = global.db.data.settings[this.user.jid] || {}
if (bot.antipv && !isOwner && !isROwner) {
await m.reply(`𝙃𝙤𝙡𝙖 *@${m.sender.split`@`[0]}*, 𝙚𝙨𝙩𝙖 𝙥𝙧𝙤𝙝𝙞𝙗𝙞𝙙𝙤 𝙪𝙨𝙖𝙧 𝙚𝙡 𝙗𝙤𝙩 𝙚𝙡 𝙥𝙧𝙞𝙫𝙖𝙙𝙤 𝙨𝙤𝙡𝙤 𝙨𝙞 𝙦𝙪𝙞𝙚𝙧𝙚 𝙝𝙖𝙘𝙚𝙧𝙩𝙚 𝙪𝙣 𝙗𝙤𝙩. 𝙢𝙖𝙣𝙙𝙖 𝙚𝙡 𝙘𝙤𝙢𝙖𝙣𝙙𝙤 .serbot\n𝙉𝙊 𝙐𝙎𝘼𝙍 𝙇𝙊𝙎 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙀𝙇 𝙋𝙑\n𝙋𝙖𝙧𝙖 𝙪𝙨𝙖𝙧 𝙚𝙡 𝙗𝙤𝙩 𝙪𝙣𝙞𝙧𝙩𝙚 𝘼𝙡 𝙜𝙧𝙪𝙥𝙤 𝙤𝙛𝙞𝙘𝙞𝙖𝙡 𝙙𝙚𝙡 𝙗𝙤𝙩  https://chat.whatsapp.com/BaHPUdegBxB4eurlAbhOT8`, false, { mentions: [m.sender] })
user.banned = true
return !1
}}