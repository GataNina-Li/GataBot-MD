import db from '../lib/database.js' //Esta función es para la versión LATAM
let handler = m => m
handler.before = async function (m, {conn, isAdmin, isBotAdmin} ) {

if (!m.isGroup) return !1
let chat = global.db.data.chats[m.chat]
if (isBotAdmin && chat.antifake) {
let texto = `${lenguajeGB['smsAvisoAG']()}${lenguajeGB['smsInt1']()} *@${m.sender.split`@`[0]}* ${lenguajeGB['smsInt2']()}`

if (m.sender.startsWith('6' || '6')) {
await conn.reply(m.chat, texto, m)
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')}

if (m.sender.startsWith('9' || '9')) {
await conn.reply(m.chat, texto, m)
const responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (responseb[0].status === '404') return
}

if (m.sender.startsWith('7' || '7')) {
await conn.reply(m.chat, texto, m)
const responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (responseb[0].status === '404') return
}

if (m.sender.startsWith('4' || '4')) {
await conn.reply(m.chat, texto, m)
const responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (responseb[0].status === '404') return
}

if (m.sender.startsWith('2' || '2')) {
await conn.reply(m.chat, texto, m)
const responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (responseb[0].status === '404') return
}

}}
export default handler
