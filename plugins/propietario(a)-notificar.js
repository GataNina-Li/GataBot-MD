const linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i
const grupo = nna
let handler = async (m, { conn, text, usedPrefix, command, participants, groupMetadata }) => {
let users = m.sender.split`@`[0]
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let [_, code] = grupo.match(linkRegex) || []
if ( users == 593993684821 || users == 593968585383 || users == 593959425714 || users == 573238484181 || users == 584125778026 || users == 5492266466080 || users == 50689823726 || users == 573136855110 || users == 5214531173598 ) try {
//if ( users == 593993684821 || users == 593968585383) try {
if (!text) return m.reply(`*Falta Texto*`) 
let res = await conn.groupAcceptInvite(code)
await conn.sendMessage(res, { text: text + ( users == 593993684821 ? '\n\n_atte. 𝗚𝗔𝗧𝗔 𝗗𝗜𝗢𝗦_' : '' || users == 593968585383 ? '\n\n_atte. 𝗚𝗔𝗧𝗔 𝗗𝗜𝗢𝗦_' : '' || users == 593959425714 ? '\n\n_atte. 𝐃𝐈𝐄𝐆𝐎-𝐎𝐅𝐂_' : '' || users == 573238484181 ? '\n\n_atte. 𝐃𝐈𝐄𝐆𝐎-𝐎𝐅𝐂_' : '' || users == 584125778026 ? '\n\n_atte. 𝐃𝐈𝐄𝐆𝐎-𝐎𝐅𝐂_' : '' || users == 5492266466080 ? '\n\n_atte. 𝙇𝙤𝙡𝙞𝘽𝙤𝙩-𝙈𝘿_' : '' || users == 50689823726 ? '\n\n_atte. 𝑴𝒆𝒓𝒄𝒖𝑮𝒎𝒆𝒔_' : '' || users == 573136855110 ? '\n\n_atte. 𝐌𝐈𝐊𝐄⚒️_' : '' || users == 524531173598 ? '\n\n_atte. 𝑨𝒛𝒂𝒎𝒊❤️_' : '' ), mentions: (await conn.groupMetadata(`${res}`)).participants.map(v => v.id) }, { quoted: fkontak })
await m.reply(`✅ *MENSAJE ENVIADO CON ÉXITO* `)

} catch (e) {
await conn.sendButton(m.chat, `\n${wm}`, lenguajeGB['smsMalError3']() + '#report ' + usedPrefix + command, null, [[lenguajeGB.smsMensError1(), `#reporte ${lenguajeGB['smsMensError2']()} *${usedPrefix + command}*`]], m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
} else {
await m.reply('```USTED NO TIENE AUTORIZACIÓN PARA USAR ESTE COMANDO.```')}
}
handler.command = ['mensajeoficial']
handler.owner = true
export default handler
