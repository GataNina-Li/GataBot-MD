import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {

let texto = `𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝙀 𝘼𝙇 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝘿𝙀 𝘼𝙇𝙂𝙐𝙄𝙀𝙉 𝙋𝘼𝙍𝘼 𝙋𝙊𝘿𝙀𝙍 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍 𝙀𝙇 𝙈𝙀𝙉𝙎𝘼𝙅𝙀\n\n𝙍𝙀𝙋𝙇𝙔 𝙏𝙊 𝙎𝙊𝙈𝙀𝙊𝙉𝙀'𝙎 𝙈𝙀𝙎𝙎𝘼𝙂𝙀 𝙎𝙊 𝙔𝙊𝙐 𝘾𝘼𝙉 𝘿𝙀𝙇𝙀𝙏𝙀 𝙏𝙃𝙀 𝙈𝙀𝙎𝙎𝘼𝙂𝙀`
	
if (!m.quoted) return await conn.reply(m.chat, texto, m)
try {
let delet = m.message.extendedTextMessage.contextInfo.participant
let bang = m.message.extendedTextMessage.contextInfo.stanzaId
return conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
 } catch {
return conn.sendMessage(m.chat, { delete: m.quoted.vM.key })
}
}
handler.help = ['delete']
handler.tags = ['group']
handler.command = /^(eliminar|del(ete)?)$/i

handler.group = false
handler.admin = true
handler.botAdmin = true

export default handler
