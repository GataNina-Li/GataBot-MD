let handler = async (m, { conn, text, command, usedPrefix }) => {//prems 
let lenGB = lenguajeGB.lenguaje() == 'en' ? usedPrefix + 'on antitoxic' : usedPrefix + 'on antitoxicos';
if (!db.data.chats[m.chat].antitoxic && m.isGroup) return conn.sendButton(m.chat, wm, lenguajeGB.smsAdveu1() + lenGB, null, [[lenguajeGB.smsEncender(), lenGB]], fkontak, m) 

let who
let img = 'https://i.imgur.com/vWnsjh8.jpg'
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text
else who = m.chat
let name = await conn.getName(m.sender)	
let user = global.db.data.users[who]
if (!who) return conn.reply(m.chat, lenguajeGB.smsMalused3() + `*${usedPrefix + command} @${name}*`, fkontak, m)  
try{
user.warn -= 1
 
   await m.reply(`${user.warn == 1 ? `*@${who.split`@`[0]}*` : `♻️ *@${who.split`@`[0]}*`}  ${lenguajeGB['smsAdveu10']()}\n\n*${lenguajeGB['smsAdveu5']()}*\n⚠️ *${lenguajeGB['smsAdveu11']()} ${user.warn + 1}/4*\n⚠️ *${lenguajeGB['smsAdveu12']()} ${user.warn}/4*`, null, { mentions: [who]})
/*await conn.sendButton(m.chat,`${user.warn == 1 ? `*@${who.split`@`[0]}*` : `♻️ *@${who.split`@`[0]}*`} ${lenguajeGB['smsAdveu10']()}`, `*${lenguajeGB['smsAdveu5']()}*\n⚠️ *${lenguajeGB['smsAdveu11']()} ${user.warn + 1}/4*\n⚠️ *${lenguajeGB['smsAdveu12']()} ${user.warn}/4*\n\n${wm}`, img, [
[lenguajeGB.smsAdveu9(), '.ok'],
[lenguajeGB.smsAdveu6(), lenguajeGB.lenguaje() == 'en' ? usedPrefix + 'inventory' : usedPrefix + 'inventario']], false, { mentions: [who] }) //[m.sender]*/
	
} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
}}
handler.help = ['addprem <@user>']
handler.tags = ['owner']
handler.command = /^(del|delete|eliminar|\-)advertir|quitar|warn(ing)?$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler
