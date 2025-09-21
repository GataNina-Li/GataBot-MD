let handler = async (m, {conn}) => {
try {
let res = await conn.groupInviteCode(m.chat)
let link = 'https://chat.whatsapp.com/' + res
await conn.reply(m.chat, `${link}`, m)
} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
}
}
handler.help = ['linkgroup']
handler.tags = ['group']
handler.command = /^enlace|link(gro?up)?$/i
handler.group = true
handler.botAdmin = true
export default handler
