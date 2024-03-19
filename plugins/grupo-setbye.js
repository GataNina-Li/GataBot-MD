let handler = async (m, { conn, text, isROwner, isOwner }) => {
if (text) {
global.db.data.chats[m.chat].sBye = text
conn.reply(m.chat, lenguajeGB.smsSetB(), fkontak, m)  
//conn.sendButton(m.chat, wm, lenguajeGB['smsSetB'](), null, [[lenguajeGB.smsConMenu(), `/menu`]], fkontak, m)
} else throw `${lenguajeGB['smsSetB2']()}`
}
handler.command = ['setbye', 'despedida'] 
handler.botAdmin = true
handler.admin = true
handler.group = true
export default handler
