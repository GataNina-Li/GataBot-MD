let handler = async (m, { conn, args }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || './src/grupos.jpg' 
await conn.groupUpdateDescription(m.chat, `${args.join(" ")}`);
conn.reply(m.chat, lenguajeGB.smsDest(), fkontak, m)
//conn.sendButton(m.chat, wm, lenguajeGB.smsDest(), pp, [[lenguajeGB.smsConMenu(), `/menu`]], fkontak, m)
}
handler.command = /^setdesk|setdesc|newdesc|descripción|descripcion$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler
