import PhoneNumber from 'awesome-phonenumber'
let handler = async (m, { conn, isBotAdmin }) => { 
let txt = ''
let group = m.chat
for (let [jid, chat] of Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@s.whatsapp.net') + conn.groupInviteCode(jid) && chat.isChats)) 
txt += `\n
🐈 ${await conn.getName(jid)}
✦ ${await conn.getName(jid)}\n
*CREADOR(A):* ` + `${PhoneNumber ? '*Creador no encontrado*' : `${PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')}`}` == undefined ? '' : '*Creador no encontrado*' + '\n' +
`${jid.split`@`[0].length >= 15 ? `*Creador no encontrado*` : `*Wa.me/${jid.split`@`[0]}*`}\n` +
`${chat?.metadata?.read_only ? '❌ *SIN ESTAR AQUÍ | NO*' : '✅ *SIGO AQUÍ | YES*'}\n\n`

m.reply(`*${gt} ESTÁ EN ESTOS GRUPOS*
*IS IN THESE GROUPS:*
${txt}`.trim())

}
handler.help = ['groups', 'grouplist']
handler.tags = ['info']
handler.command = /^(groups|grouplist|listadegrupo|gruposlista|listagrupos|listadegrupos|grupolista|listagrupo)$/i
handler.exp = 30
export default handler
