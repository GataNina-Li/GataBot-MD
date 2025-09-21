let MessageType = (await import(global.baileys)).default
let pajak = 0
let handler = async (m, {conn, text, usedPrefix, command}) => {
  let who
  if (m.isGroup) who = m.mentionedJid[0]
  else who = m.chat
  if (!who) throw `${ag}𝘿𝙀𝘽𝙀 𝘿𝙀 𝙀𝙏𝙄𝙌𝙐𝙀𝙏𝘼𝙍 𝘼𝙇 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 *@tag*\n\n𝙔𝙊𝙐 𝙈𝙐𝙎𝙏 𝙏𝘼𝙂 𝙏𝙃𝙀 𝙐𝙎𝙀𝙍 *@tag*`
  let txt = text.replace('@' + who.split`@`[0], '').trim()
  if (!txt) throw `${ag}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙇𝘼 𝘾𝘼𝙉𝙏𝙄𝘿𝘼𝘿 𝘿𝙀 𝙏𝙊𝙆𝙀𝙉(𝙎)\n\n𝙀𝙉𝙏𝙀𝙍 𝙏𝙃𝙀 𝙉𝙐𝙈𝘽𝙀𝙍 𝙊𝙁 𝙏𝙊𝙆𝙀𝙉(𝙎)`
  if (isNaN(txt)) throw `${mg}𝙎𝙄𝙉 𝙎𝙄𝙈𝘽𝙊𝙇𝙊𝙎, 𝙎𝙊𝙇𝙊 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙉𝙐𝙈𝙀𝙍𝙊𝙎\n\n𝙉𝙊 𝙎𝙔𝙈𝘽𝙊𝙇𝙎, 𝙅𝙐𝙎𝙏 𝙀𝙉𝙏𝙀𝙍 𝙉𝙐𝙈𝘽𝙀𝙍𝙎`
  try {
    let tok = parseInt(txt)
    let joincount = tok
    let pjk = Math.ceil(tok * pajak)
    joincount += pjk
    if (joincount < 1) throw `${mg}𝙀𝙇 𝙉𝙐𝙈𝙀𝙍𝙊 𝙈𝙄𝙉𝙄𝙈𝙊 𝙋𝘼𝙍𝘼 𝙏𝙊𝙆𝙀𝙉(𝙎) 𝙀𝙎 *1*\n\n𝙏𝙃𝙀 𝙈𝙄𝙉𝙄𝙈𝙐𝙈 𝙉𝙐𝙈𝘽𝙀𝙍 𝙁𝙊𝙍 𝙏𝙊𝙆𝙀𝙉(𝙎) 𝙄𝙎 *1*`
    let users = global.db.data.users
    //let users = global.db.data.users[who]
    users[who].joincount += tok
    conn.reply(
      m.chat,
      `╭━━━[ 𝙏𝙊𝙆𝙀𝙉(𝙎) 🪙 ]━━━⬣\n┃\n┃ღ *PARA | FOR:*\n┃ღ *${text}*\n┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┃ღ *SE LE AÑADIÓ | NOW YOU HAVE*\n┃ღ *${tok} Token(s)* 🪙\n┃\n╰━━━━━━━━━━━━━━⬣`,
      m,
      {contextInfo: {mentionedJid: conn.parseMention(text)}}
    )
  } catch (e) {
    await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, m)
    console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
    console.log(e)
  }
}
handler.help = ['adddi <@user>']
handler.tags = ['xp']
handler.command = ['añadirtokens', 'dartokens', 'dartoken']
handler.group = true
handler.owner = true
export default handler
