let handler = async (m, { text, usedPrefix, command }) => {
let user = global.db.data.users[m.sender]
if (!text) return m.reply(`${lenguajeGB['smsAfkQ1'](usedPrefix, command)}`)
if (text.length < 10) return m.reply(`${lenguajeGB['smsAfkQ2']()}`)
user.afk = + new Date
user.afkReason = text
m.reply(`${lenguajeGB['smsAfkM1A']()} *${conn.getName(m.sender)}* ${lenguajeGB['smsAfkM1B']()}${text ? ': ' + text : ''}`)}

handler.command = /^afk$/i
export default handler
