let handler = async (m, { conn, command, text }) => {
if (!text) throw `*Ingrese el @ o el nombre de la persona que quieras saber si te puedes ${command.replace('how', '')}*`
let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
conn.reply(m.chat, `
🥵 *𝙏𝙀 𝙃𝘼𝙉 𝙁𝙊𝙇𝙇𝘼𝘿𝙊!!!* 🥵

*𝙏𝙚 𝙖𝙘𝙖𝙗𝙖𝙨 𝙙𝙚 𝙛𝙤𝙡𝙡𝙖𝙧 𝙖* *${text}* ⁩ *𝙖 𝟰 𝙥𝙖𝙩𝙖𝙨 𝙢𝙞𝙚𝙣𝙩𝙧𝙖𝙨 𝙩𝙚 𝙜𝙚𝙢𝙞𝙖 "𝘼𝙖𝙝.., 𝘼𝙖𝙖𝙝𝙝𝙝.." 𝙮 𝙩𝙪 𝙧𝙚𝙘𝙤𝙢𝙥𝙚𝙣𝙨𝙖 𝙚𝙨*

handler.command = /^(Follar|violar)/i
handler.fail = null
handler.register = true
export default handler
