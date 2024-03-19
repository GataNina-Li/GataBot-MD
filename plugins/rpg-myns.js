import { createHash } from 'crypto'
let handler = async function (m, { conn, text, usedPrefix }) {
let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 6)	
await conn.fakeReply(m.chat, sn, '0@s.whatsapp.net', `⬇️ *ESE ES SU NUMERO DE SERIE* ⬇️`, 'status@broadcast')
//await m.reply(`${sn}`.trim())
}
handler.help = ['myns']
handler.tags = ['xp']
handler.command = /^(myns|ceksn)$/i
handler.register = true
export default handler
