let handler = async (m, { text, args, usedPrefix, command, conn}) => { 
let user = global.db.data.users[m.sender]
  
if (args.length >= 1) {
text = args.slice(0).join(" ")
} else if (m.quoted && m.quoted.text) {
text = m.quoted.text
} else return m.reply(`${lenguajeGB['smsAfkQ1'](usedPrefix, command)}`)
  
if (text.length < 10) return m.reply(`${lenguajeGB['smsAfkQ2']()}`)
user.afk = + new Date
user.afkReason = text
await conn.reply(m.chat, `${lenguajeGB['smsAvisoAG']()}✴️ *A F K* ✴️
*▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔*
${lenguajeGB['smsAfkM1A']()} *@${m.sender.split("@")[0]}* ${lenguajeGB['smsAfkM1B']()}${text ? '\n👉 ' + text : ''}`, m, { mentions: [m.sender] })
}

handler.command = /^afk$/i
export default handler
