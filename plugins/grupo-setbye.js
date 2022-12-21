let handler = async (m, { conn, text, isROwner, isOwner }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
if (text) {
global.db.data.chats[m.chat].sBye = text
  
conn.sendButton(m.chat, wm, lenguajeGB['smsSetB'](), null, [[lenguajeGB.smsConMenu(), `/menu`]], fkontak, m)
} else throw `${lenguajeGB['smsSetB2']()}`
}
handler.command = ['setbye', 'despedida'] 
handler.botAdmin = true
handler.admin = true
handler.group = true
export default handler
