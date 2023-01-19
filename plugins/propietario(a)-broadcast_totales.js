/*
Creado por https://github.com/DIEGO-OFC | https://github.com/GataNina-Li

*/
import fetch from 'node-fetch'
let handler = async (m, { conn, text }) => {
let groups = Object.keys(await conn.groupFetchAllParticipating())
m.reply(`✅ *El mensaje fue enviado a ${groups.length}Chats Totales*\n*Es posible que no se haya enviado a todos los Chats Totales. Disculpe.*\n\n✅ *The message was sent to ${groups.length} Totals Chats*\n*May not have been sent to all Totals Chats. Excuse me.*`)
for (let id of groups) {
let bg = img13
        
await conn.sendButtonLoc(id, bg, text, wm, "Okey", "Ok", m)
}
m.reply('*✅*')
}
handler.help = ['bcloc'].map(v => v + ' <teks>')
handler.tags = ['owner']
handler.command = /^(pruebaloc)$/i
handler.owner = true

export default handler
