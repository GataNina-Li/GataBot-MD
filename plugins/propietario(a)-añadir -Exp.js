import MessageType from '@adiwajshing/baileys'
let pajak = 0
let handler = async (m, { conn, text, usedPrefix, command, groupMetadata }) => {

let who
if (m.isGroup) who = m.mentionedJid[0]
else who = m.chat
if (m.quoted?.sender) m.mentionedJid.push(m.quoted.sender);
  if (!m.mentionedJid.length) m.mentionedJid.push(m.sender);
  if (global.db.data.users[_user] == undefined)

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
  if (!user in global.db.data.users)
if (_user.startsWith(conn.user.jid.split`@`[0]))
if (!who) throw `${ag}𝘿𝙀𝘽𝙀 𝘿𝙀 𝙀𝙏𝙄𝙌𝙐𝙀𝙏𝘼𝙍 𝘼𝙇 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 *@tag*\n\n𝙔𝙊𝙐 𝙈𝙐𝙎𝙏 𝙏𝘼𝙂 𝙏𝙃𝙀 𝙐𝙎𝙀𝙍 *@tag*`
let txt = text.replace('@' + who.split`@`[0], '').trim()
if (!txt) throw `${ag}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙇𝘼 𝘾𝘼𝙉𝙏𝙄𝘿𝘼𝘿 𝘿𝙀 𝙀𝙓𝙋\n\n𝙀𝙉𝙏𝙀𝙍 𝙏𝙃𝙀 𝙉𝙐𝙈𝘽𝙀𝙍 𝙊𝙁 𝙀𝙓𝙋`
if (isNaN(txt)) throw `${mg}𝙎𝙄𝙉 𝙎𝙄𝙈𝘽𝙊𝙇𝙊𝙎, 𝙎𝙊𝙇𝙊 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙉𝙐𝙈𝙀𝙍𝙊𝙎\n\n𝙉𝙊 𝙎𝙔𝙈𝘽𝙊𝙇𝙎, 𝙅𝙐𝙎𝙏 𝙀𝙉𝙏𝙀𝙍 𝙉𝙐𝙈𝘽𝙀𝙍𝙎`
let xp = parseInt(txt)
let exp = xp
let pjk = Math.ceil(xp * pajak)
exp += pjk
if (exp < 1) throw `${mg}𝙀𝙇 𝙉𝙐𝙈𝙀𝙍𝙊 𝙈𝙄𝙉𝙄𝙈𝙊 𝘿𝙀 𝙀𝙓𝙋𝙀𝙍𝙄𝙀𝙉𝘾𝙄𝘼 (𝙀𝙓𝙋) 𝙀𝙎 *1*\n\n𝙏𝙃𝙀 𝙈𝙄𝙉𝙄𝙈𝙐𝙈 𝙉𝙐𝙈𝘽𝙀𝙍 𝙁𝙍𝙊𝙈 𝙀𝙓𝙋𝙀𝙍𝙄𝙀𝙉𝘾𝙀 (𝙀𝙓𝙋) 𝙄𝙎 *1*`
let taguser = await conn.getName(m.sender)
let users = global.db.data.users
users[who].exp += xp
let gata = `╭━[ 𝙀𝙓𝙋𝙀𝙍𝙄𝙀𝙉𝘾𝙄𝘼 | 𝙀𝙓𝙋 ⚡]━⬣\n┃\n┃ღ *PARA | FOR:*\n┃ღ ${taguser}\n┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┃ღ *SE LE AÑADIÓ | NOW YOU HAVE*\n┃ღ *${xp} EXP* ⚡\n┃\n╰━━━━━━━━━━━━━━⬣`
conn.sendMessage(m.chat, { text: gata, mentions: [_user, m.sender] }, { quoted: m })}
handler.help = ["addxp  [@user]"]
handler.tags = ['xp']
handler.command = ['añadirxp', 'añadirexp', 'añadirexperiencia', 'darexperiencia', 'darxp', 'darexp'] 
handler.group = true
handler.rowner = true
export default handler
