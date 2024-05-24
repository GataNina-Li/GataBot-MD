//Esta función es para la versión LATAM
let handler = m => m
handler.before = async function (m, {conn, isAdmin, isBotAdmin} ) {

if (!m.isGroup) return !1
let chat = global.db.data.chats[m.chat]
if (isBotAdmin && chat.antifake) {
let texto = `${lenguajeGB['smsAvisoAG']()}${lenguajeGB['smsInt1']()} *@${m.sender.split`@`[0]}* ${lenguajeGB['smsInt2']()}`

if (m.sender.startsWith('6') || m.sender.startsWith('9') ||  m.sender.startsWith('7') ||  m.sender.startsWith('4') || m.sender.startsWith('2')) {
await conn.reply(m.chat, texto, m);
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')}

}}
export default handler
