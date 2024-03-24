const handler = async (m, {conn, participants, usedPrefix, command}) => {
if (!global.db.data.settings[conn.user.jid].restrict) throw `${lenguajeGB['smsAvisoAG']()}${lenguajeGB['smsSoloOwner']()}`
let texto = `${lenguajeGB['smskick1']()}${usedPrefix + command} @0*`
if (!m.mentionedJid[0] && !m.quoted) return m.reply(texto, m.chat, {mentions: conn.parseMention(texto)})
if (m.mentionedJid.includes(conn.user.jid)) return
const user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
const owr = m.chat.split`-`[0]
await conn.groupParticipantsUpdate(m.chat, [user], 'remove')}
handler.command = /^(kick|echar|hechar|sacar|ban)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true
export default handler

/*let handler = async (m, { conn, participants, command, usedPrefix }) => { 
try{
let texto = `${lenguajeGB['smskick1']()}${usedPrefix + command} @${global.owner[0][0]}*`

if (!global.db.data.settings[conn.user.jid].restrict) return conn.sendButton(m.chat, wm, `${lenguajeGB['smsAvisoAG']()}${lenguajeGB['smsSoloOwner']()}`, null, [[lenguajeGB.smsEncender(), `${usedPrefix}on restringir`]], fkontak, m)
if (!m.mentionedJid[0] && !m.quoted) return m.reply(texto, m.chat, { mentions: conn.parseMention(texto)}) 
let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
let owr = m.chat.split`-`[0]
let eliminar = await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
if (m.message.extendedTextMessage === undefined || m.message.extendedTextMessage === null) return conn.reply(m.chat, texto, fkontak, m) 
if(m.message.extendedTextMessage.contextInfo.participant !== null && m.message.extendedTextMessage.contextInfo.participant != undefined && m.message.extendedTextMessage.contextInfo.participant !== "") {

var mentioned = m.message.extendedTextMessage.contextInfo.mentionedJid[0] ? m.message.extendedTextMessage.contextInfo.mentionedJid[0] : m.message.extendedTextMessage.contextInfo.participant
if(conn.user.jid.includes(mentioned)) return conn.reply(m.chat, `${lenguajeGB['smskick1']()}${usedPrefix + command} @${global.owner[0][0]}*`, fkontak, m)
//let eliminar = await conn.groupParticipantsUpdate(m.chat, [mentioned], 'remove')
let done = `${lenguajeGB['smsAvisoEG']()}*@${mentioned.split("@")[0]} ${lenguajeGB['smskick2']()}*`
let err1 = `${lenguajeGB['smsAvisoFG']()}*@${mentioned.split("@")[0]} ${lenguajeGB['smskick3']()}*`
let err2 = `${lenguajeGB['smsAvisoAG']()}*@${mentioned.split("@")[0]} ${lenguajeGB['smskick4']()}*`


if (eliminar[0].status === "200") m.reply(done, m.chat, { mentions: conn.parseMention(done)})  
else if (eliminar[0].status === "406") m.reply(err1, m.chat, { mentions: conn.parseMention(err1)})   
else if (eliminar[0].status === "404") m.reply(err2, m.chat, { mentions: conn.parseMention(err2)})  
else conn.sendButton(m.chat, `\n${wm}`, lenguajeGB['smsMalError3']() + '#report ' + usedPrefix + command, null, [[lenguajeGB.smsMensError1(), `#reporte ${lenguajeGB['smsMensError2']()} *${usedPrefix + command}*`]], m)
} else if (m.message.extendedTextMessage.contextInfo.mentionedJid != null && m.message.extendedTextMessage.contextInfo.mentionedJid != undefined) return
} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
}} 
handler.help = ['kick']
handler.tags = ['group']
handler.command = /^(kick|echar|hechar|sacar|ban)$/i
handler.admin = handler.group = handler.botAdmin = true
export default handler*/
