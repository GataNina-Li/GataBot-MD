let handler = async (m, { conn, usedPrefix: _p, args, text, usedPrefix}) => {
	
	if (!m.quoted) throw 'Responde a un mensaje !'
	if (text.length > 2) throw 'Solo para 1 emoji!'
	if (!text) throw `📍 Ejemplo de uso :\n${usedPrefix}react 🗿`
conn.relayMessage(m.chat, { reactionMessage: {
key: {
 id: m.quoted.id,
 remoteJid: m.chat,
 fromMe: true
},
 text: `${text}`}}, { messageId: m.id })
 }
 handler.help = ['react <emoji>']
handler.tags = ['tools']
handler.command = /^(react)$/i

export default handler
