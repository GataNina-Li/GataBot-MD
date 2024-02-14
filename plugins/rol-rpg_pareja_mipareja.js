let handler = async (m, { conn, usedPrefix }) => { // @${global.db.data.users[m.sender].pasangan.split('@')[0]}
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let usuario = conn.getName(who)
let persona = global.db.data.users[m.sender].pasangan

if (global.db.data.users[m.sender].pasangan == "") return await conn.reply(m.chat, `*${usuario}* 𝙉𝙊 𝙏𝙄𝙀𝙉𝙀𝙎 𝙋𝘼𝙍𝙀𝙅𝘼\n\n𝙔𝙊𝙐 𝘼𝙍𝙀 𝙉𝙊𝙏 𝙄𝙉 𝘼 𝙍𝙀𝙇𝘼𝙏𝙄𝙊𝙉𝙎𝙃𝙄𝙋\n\n> *_Si quiere tener una pareja use el comando ${usedPrefix}pareja etiquetando a alguien._*\n\n> ${wm}`, fkontak,  m)
//await conn.sendButton(m.chat, `*${usuario}* 𝙉𝙊 𝙏𝙄𝙀𝙉𝙀𝙎 𝙋𝘼𝙍𝙀𝙅𝘼\n\n𝙔𝙊𝙐 𝘼𝙍𝙀 𝙉𝙊𝙏 𝙄𝙉 𝘼 𝙍𝙀𝙇𝘼𝙏𝙄𝙊𝙉𝙎𝙃𝙄𝙋`, `*_Si quiere tener una pareja use el comando ${usedPrefix}pareja etiquetando a alguien._*\n\n` + wm, null, [['𝗠 𝗘 𝗡 𝗨 ☘️', '/menu']], fkontak, m)

try {  
if (global.db.data.users[global.db.data.users[m.sender].pasangan].pasangan == m.sender) return await conn.reply(m.chat, `*${usuario}* 💗 𝙀𝙎𝙏𝘼𝙎 𝙀𝙉 𝙐𝙉𝘼 𝙍𝙀𝙇𝘼𝘾𝙄𝙊𝙉 𝘾𝙊𝙉 *${await conn.getName(persona)}* 💖`, fkontak, m, {contextInfo: { mentionedJid: [ m.sender, who ] }})
//await conn.sendButton(m.chat, `*${usuario}* 💗 𝙀𝙎𝙏𝘼𝙎 𝙀𝙉 𝙐𝙉𝘼 𝙍𝙀𝙇𝘼𝘾𝙄𝙊𝙉 𝘾𝙊𝙉 *${await conn.getName(persona)}* 💖`, wm, null, ['𝗠 𝗘 𝗡 𝗨 ☘️', '/menu']], fkontak, m, {contextInfo: { mentionedJid: [ m.sender, who ] }})-
await conn.reply(m.chat, `🤨 𝙋𝘼𝙍𝙀𝘾𝙀 𝙌𝙐𝙀 *${await conn.getName(persona)}* 𝙉𝙊 𝙃𝘼 𝘼𝘾𝙀𝙋𝙏𝘼𝘿𝙊 𝙉𝙄 𝙍𝙀𝘾𝙃𝘼𝙕𝘼𝘿𝙊 𝙏𝙐 𝙋𝙍𝙊𝙋𝙐𝙀𝙎𝙏𝘼 𝘿𝙀 𝙀𝙎𝙏𝘼𝙍 𝘼𝙈𝘽𝙊𝙎 𝙀𝙉 𝙐𝙉𝘼 𝙍𝙀𝙇𝘼𝘾𝙄𝙊𝙉\n\n*_Vista la situación se anulará este pendiente_*\n\n${wm}`, fkontak, m, {contextInfo: { mentionedJid: [ persona, m.sender ] }})
//conn.sendButton(m.chat, `🤨 𝙋𝘼𝙍𝙀𝘾𝙀 𝙌𝙐𝙀 *${await conn.getName(persona)}* 𝙉𝙊 𝙃𝘼 𝘼𝘾𝙀𝙋𝙏𝘼𝘿𝙊 𝙉𝙄 𝙍𝙀𝘾𝙃𝘼𝙕𝘼𝘿𝙊 𝙏𝙐 𝙋𝙍𝙊𝙋𝙐𝙀𝙎𝙏𝘼 𝘿𝙀 𝙀𝙎𝙏𝘼𝙍 𝘼𝙈𝘽𝙊𝙎 𝙀𝙉 𝙐𝙉𝘼 𝙍𝙀𝙇𝘼𝘾𝙄𝙊𝙉`, `*_Vista la situación se anulará este pendiente_*\n\n` + wm, null, [['𝗠 𝗘 𝗡 𝗨 ☘️', '/menu']], fkontak, m, {contextInfo: { mentionedJid: [ persona, m.sender ] }})
global.db.data.users[m.sender].pasangan = ""
} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)}}
handler.command = /^(sinceridad|mipareja|miamor|minovio|minovia|mylove)$/i
handler.group = true
export default handler
