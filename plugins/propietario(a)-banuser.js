let handler = async (m, { conn, participants, usedPrefix, command }) => {
let BANtext = `${mg}𝙀𝙏𝙄𝙌𝙐𝙀𝙏𝙀 𝘼 𝘼𝙇𝙂𝙐𝙄𝙀𝙉 𝙋𝘼𝙍𝘼 𝘽𝘼𝙉𝙀𝘼𝙍\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊:\n*${usedPrefix + command} @${global.suittag}*\n𝙏𝘼𝙂 𝙎𝙊𝙈𝙀𝙊𝙉𝙀 𝙏𝙊 𝘽𝘼𝙉\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} @${global.suittag}*`
if (!m.mentionedJid[0] && !m.quoted) return m.reply(BANtext, m.chat, { mentions: conn.parseMention(BANtext)})
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
else who = m.chat
let users = global.db.data.users
users[who].banned = true
conn.reply(m.chat, `${eg}𝙀𝙇/𝙇𝘼 𝙐𝙎𝙐𝘼𝙍𝙄𝙊(𝘼) 𝙁𝙐𝙀 𝘽𝘼𝙉𝙀𝘼𝘿𝙊(𝘼) 🙀\n𝙉𝙊 𝙋𝙊𝘿𝙍𝘼 𝙐𝙎𝘼𝙍 𝘼 ${gt}\n\n𝙏𝙃𝙀 𝙐𝙎𝙀𝙍 𝙒𝘼𝙎 𝘽𝘼𝙉𝙉𝙀𝘿 😱\n𝘾𝘼𝙉𝙉𝙊𝙏 𝙐𝙎𝙀 𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿`, m)
}
handler.command = /^banuser$/i
handler.rowner = true
export default handler
