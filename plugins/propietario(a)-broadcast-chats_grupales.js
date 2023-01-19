/*
Creado por https://github.com/DIEGO-OFC | https://github.com/GataNina-Li

*/
import fetch from 'node-fetch'
let handler = async (m, { conn, text }) => {
let groups = Object.keys(await conn.groupFetchAllParticipating())
m.reply(`✅ *El mensaje fue enviado a ${groups.length}Chats Totales*\n\n✅ *The message was sent to ${groups.length} Totals Chats*`)
for (let id of groups) {      
await conn.sendButtonLoc(id, img13, text, wm, "Menu", ".menu", m)
}
m.reply('*✅*')
}
handler.command = /^(broadcast|bc)(group|grup|gc)$/i
handler.owner = true
export default handler
