let handler = async (m, { conn, text, command }) => {
let id = text ? text : m.chat  
await conn.reply(id, `*${wm} 𝘼𝘽𝘼𝙉𝘿𝙊𝙉𝘼 𝙀𝙇 𝙂𝙍𝙐𝙋𝙊, 𝙁𝙐𝙀 𝙂𝙀𝙉𝙄𝘼𝙇 𝙀𝙎𝙏𝘼𝙍 𝘼𝙌𝙐𝙄 👋*`) 
await conn.groupLeave(id)}
handler.command = /^(salir|leavegc|salirdelgrupo|leave)$/i
handler.group = true
handler.rowner = true
export default handler
