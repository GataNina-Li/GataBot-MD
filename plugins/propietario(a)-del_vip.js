let handler = async (m, { conn, text, command, usedPrefix }) => {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text
else who = m.chat
if (!who) throw `${mg}𝙀𝙏𝙄𝙌𝙐𝙀𝙏𝙀 𝘼 𝙇𝘼 𝙋𝙀𝙍𝙎𝙊𝙉𝘼 𝙌𝙐𝙀 𝙑𝘼 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍 𝘿𝙀 𝙇𝙊𝙎 𝙐𝙎𝙐𝘼𝙍𝙄𝙊𝙎 𝙑𝙄𝙋 😿\n\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} @tag*\n\n𝙏𝘼𝙂 𝙏𝙃𝙀 𝙋𝙀𝙍𝙎𝙊𝙉 𝙔𝙊𝙐 𝙒𝙄𝙇𝙇 𝙍𝙀𝙈𝙊𝙑𝙀 𝙁𝙍𝙊𝙈 𝙋𝙍𝙀𝙈𝙄𝙐𝙈 𝙐𝙎𝙀𝙍𝙎 😿\n\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} @tag*`
if (!global.prems.includes(who.split`@`[0])) throw `${iig}𝙀𝙇/𝙇𝘼 𝙐𝙎𝙐𝘼𝙍𝙄𝙊(𝘼) 𝙉𝙊 𝙀𝙎 𝙑𝙄𝙋 🥺\n\n𝙏𝙃𝙀 𝙐𝙎𝙀𝙍 𝙄𝙎 𝙉𝙊𝙏 𝙋𝙍𝙀𝙈𝙄𝙐𝙈 🥺`
let index = global.prems.findIndex(v => (v.replace(/[^0-9]/g, '') + '@s.whatsapp.net') === (who.replace(/[^0-9]/g, '') + '@s.whatsapp.net'))
global.prems.splice(index, 1)
conn.reply(m.chat, `${eg}@${who.split`@`[0]} 𝘼𝙃𝙊𝙍𝘼 𝙀𝙇/𝙇𝘼 𝙐𝙎𝙐𝘼𝙍𝙄𝙊(𝘼) 𝙔𝘼 𝙉𝙊 𝙀𝙎 𝙑𝙄𝙋. 𝙏𝙀𝙉𝘿𝙍𝘼 𝙇𝙄𝙈𝙄𝙏𝙀𝙎 𝘾𝙊𝙉 ${gt} 😰\n\n@${who.split`@`[0]} 𝙉𝙊𝙒 𝙔𝙊𝙐 𝘼𝙍𝙀 𝙉𝙊 𝙇𝙊𝙉𝙂𝙀𝙍 𝘼 𝙋𝙍𝙀𝙈𝙄𝙐𝙈 𝙐𝙎𝙀𝙍. 𝙃𝘼𝙑𝙀 𝙇𝙄𝙈𝙄𝙏𝙎 😰`, m, {
contextInfo: {
mentionedJid: [who]
}})}
handler.help = ['delprem <@user>']
handler.tags = ['owner']
handler.command = /^(remove|-|del)prem$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.owner = true
export default handler
