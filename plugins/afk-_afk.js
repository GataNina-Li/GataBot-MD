export function before(m) {
let user = global.db.data.users[m.sender]
if (user.afk > -1) {
m.reply(`
${lenguajeGB['smsAfkM1']()}${user.afkReason ? ` ${lenguajeGB['smsAfkM2']()} ` + user.afkReason : ''}
  
${lenguajeGB['smsAfkM3']()} *${(new Date - user.afk).toTimeString()}*`.trim())
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
