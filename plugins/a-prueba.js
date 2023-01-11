let handler = async (m, { conn }) => { 
let txt = ''
let group = m.chat
conn.reply(m.chat, 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group), m, {
for (let [jid, chat] of Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)) txt += `\n🐈 ${await conn.getName(jid)}\n✦ ${jid} \n${chat?.metadata?.read_only ? '❌ *SIN ESTAR AQUÍ | NO*' : '✅ *SIGO AQUÍ | YES*'}\n\n`
m.reply(`*${gt} ESTÁ EN ESTOS GRUPOS*
*IS IN THESE GROUPS:*`.trim())

conn.sendHydrated(m.chat, txt, wm, null, 'https://github.com/GataNina-Li/GataBot-MD', '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', null, null, [
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '.menu'],
['𝘾𝙪𝙚𝙣𝙩𝙖𝙨 𝙊𝙛𝙞𝙘𝙞𝙖𝙡𝙚𝙨 | 𝘼𝙘𝙘𝙤𝙪𝙣𝙩𝙨 ✅', '/cuentasgb']
], m,)
}
handler.help = ['groups', 'grouplist']
handler.tags = ['info']
handler.command = /^(prueba)$/i
handler.exp = 30
export default handler
