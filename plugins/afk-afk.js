let handler = async (m, { text, usedPrefix }) => {
let user = global.db.data.users[m.sender]
  if (!text) return m.reply(`*⚠️ POR FAVOR COLOQUE SU MOTIVO PARA ESTAR AFK*\n\n❕ EJEMPLO\n*${usedPrefix}afk Voy a come*`)
    if (text.length < 10) return m.reply(`*⚠️ EL MOTIVO ES MUY CORTO, MINIMO 10 CARÁCTERES*`)
user.afk = + new Date
user.afkReason = text
m.reply(`${lenguajeGB['smsAfkM1A']()} *${conn.getName(m.sender)}* ${lenguajeGB['smsAfkM1B']()}${text ? ': ' + text : ''}
`)}
handler.help = ['afk [alasan]']
handler.tags = ['main']
handler.command = /^afk$/i
export default handler
