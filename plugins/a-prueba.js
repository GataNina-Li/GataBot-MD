import PhoneNumber from 'awesome-phonenumber'
let handler = async (m, { conn, isBotAdmin }) => { 
let txt = ''
let group = m.chat
for (let [jid, chat] of Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@s.whatsapp.net') + conn.groupInviteCode(jid) && chat.isChats)) 
txt += `\n
🐈 ${await conn.getName(jid)}
✦ ${await conn.getName(jid)}\n
*CREADOR(A):* ` + `${PhoneNumber ? `${PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')}` : '*Creador no encontrado*'}` == undefined ? '' : '*Creador no encontrado*' + '\n' +
`${PhoneNumber.length > 17 ? `*Creador no encontrado*` : `*Wa.me/${jid.split`@`[0]}*`}\n` + 'https://chat.whatsapp.com/ ? await 'conn.groupInviteCode(`${text}`)` +
`${chat?.metadata?.read_only ? '❌ *SIN ESTAR AQUÍ | NO*' : '✅ *SIGO AQUÍ | YES*'}\n\n`

m.reply(`*${gt} ESTÁ EN ESTOS GRUPOS*
*IS IN THESE GROUPS:*
${txt}`.trim())
//conn.sendHydrated(m.chat, txt, wm, null, 'https://github.com/GataNina-Li/GataBot-MD', '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', null, null, [
//['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '.menu'],
//['𝘾𝙪𝙚𝙣𝙩𝙖𝙨 𝙊𝙛𝙞𝙘𝙞𝙖𝙡𝙚𝙨 | 𝘼𝙘𝙘𝙤𝙪𝙣𝙩𝙨 ✅', '/cuentasgb']
//], m,)
}
handler.help = ['groups', 'grouplist']
handler.tags = ['info']
handler.command = /^(prueba9)$/i
handler.exp = 30
export default handler
