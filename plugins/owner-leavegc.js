let handler = async (m, { conn, text, command }) => {
let id = text ? text : m.chat  
await conn.reply(id, '*GATABOT ABANDONA EL GRUPO FUE UN GUSTO ESTA AQUI HASTA PRONTO 👋*') 
await conn.groupLeave(id)}
handler.command = /^(salir|leavegc|salirdelgrupo|leave)$/i
handler.group = true
handler.rowner = true
export default handler
