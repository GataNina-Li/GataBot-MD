import ws from 'ws'

let handler = async (m, {conn, usedPrefix, args}) => {
if (!args[0] && !m.quoted)
return m.reply(`⚠️ Menciona el número de un bot o responde al mensaje de un bot.\n> Ejemplo: *${usedPrefix}setprimary @0*`)

let numBot = conn.user.lid.replace(/:.*/, '')
let numBot2 = global.conn.user.lid.replace(/:.*/, '')
const detectwhat = m.sender.includes('@lid') ? `${numBot2}@lid` : global.conn.user.jid
const detectwhat2 = m.sender.includes('@lid') ? `${numBot}@lid` : conn.user.jid
const pref = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net'
const users = [
...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])
]

let botJid
let selectedBot

if (m.mentionedJid && m.mentionedJid.length > 0) {
botJid = m.mentionedJid[0]
} else if (m.quoted) {
botJid = m.quoted.sender
} else {
botJid = args[0].replace(/[^0-9]/g, '') + pref
}
if (botJid === detectwhat2 || botJid === detectwhat) {
selectedBot = conn
} else {
selectedBot = users.find((conn) => detectwhat2 === botJid)
}

if (!selectedBot) {
return conn.reply(m.chat, '⚠️ Ese bot no es un bot de la misma sessión, verifica los bots conectados, usando *.bots*.', m)
}

let chat = global.db.data.chats[m.chat]
if (chat.primaryBot === botJid) {
return conn.reply(m.chat, '⚠️ Listo, ese bot ya es el bot primario.', m)
}

chat.primaryBot = botJid
conn.sendMessage(m.chat, {text: '✅ El bot ha sido establecido como primario en este grupo. Los demás bots no responderán aquí.'}, {quoted: m})
}

handler.help = ['setprimary <@tag>']
handler.tags = ['jadibot']
handler.command = ['setprimary']
handler.group = true
handler.admin = true

export default handler
