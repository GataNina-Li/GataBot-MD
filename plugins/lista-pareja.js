let handler = async (m, { conn, isOwner }) => {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender  
let user = conn.getName(m.sender)
let pareja = global.db.data.users[m.sender].pasangan 
let relacion = Object.entries(global.db.data.users).filter(user => user[1].pasangan)
let caption = `💝 𝙇𝙄𝙎𝙏𝘼 𝘿𝙀 𝙍𝙀𝙇𝘼𝘾𝙄𝙊𝙉 : 𝙍𝙀𝙇𝘼𝙏𝙄𝙊𝙉𝙎𝙃𝙄𝙋
*╭•·–––––––––––––––––––·•*
│ *Total : ${relacion.length} Usuarios* ${relacion ? '\n│\n' + relacion.map(([jid], i) => `
│ *${i + 1}.* ${conn.getName(jid) == undefined ? 'Sin Pareja' : conn.getName(jid)}
│ ${isOwner ? '@' + jid.split`@`[0] : jid}\n│ - - - - - - - - -`.trim()).join('\n') : ''}
*╰•·–––––––––––––––––––·•*\n\n💟 𝗠𝗜 𝗣𝗔𝗥𝗘𝗝𝗔 ⇢ ${pareja ? `*${user} 💞 ${conn.getName(pareja)}*` : `❌ *No tiene Pareja*`}\n${wm}`
await conn.reply(m.chat, caption, m, { mentions: await conn.parseMention(caption) })
/*await conn.sendButton(m.chat, caption, `💟 𝗠𝗜 𝗣𝗔𝗥𝗘𝗝𝗔 ⇢ ${pareja ? `*${user} 💞 ${conn.getName(pareja)}*` : `❌ *No tiene Pareja*`}\n${wm}`, null, [ 
['𝗠 𝗘 𝗡 𝗨 ☘️', '/menu']], m, { mentions: await conn.parseMention(caption) })*/
}
handler.command = /^(listaparejas|listarelacion|listship|listpareja)$/i

export default handler
