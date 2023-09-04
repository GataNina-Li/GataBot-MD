//export function before(m) {
let handler = m => m
handler.before = async function (m, { text, args, usedPrefix, command, conn } ) {
let user = global.db.data.users[m.sender]
if (user.afk > -1) {
await conn.reply(m.chat, `${lenguajeGB['smsAvisoEG']()}✴️ *A F K* ✴️
*▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔*
*@${m.sender.split("@")[0]}* ${lenguajeGB['smsAfkM1']()}${user.afkReason ? ` ${lenguajeGB['smsAfkM2']()} ` + user.afkReason : ''}

${lenguajeGB['smsAfkM3']()} *${(new Date - user.afk).toTimeString()}*`.trim(), m, { mentions: [m.sender] })
user.afk = -1
user.afkReason = ''
}
let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
for (let jid of jids) {
let user = global.db.data.users[jid]
if (!user)
continue
let afkTime = user.afk
if (!afkTime || afkTime < 0)
continue
let reason = user.afkReason || ''
m.reply(`${lenguajeGB['smsAfkM4']()}     
${reason ? `${lenguajeGB['smsAfkM5']()} ` + reason : `${lenguajeGB['smsAfkM6']()}`}
${lenguajeGB['smsAfkM3']()} *${(new Date - afkTime).toTimeString()}*
`.trim())
}
return true
}
export default handler
