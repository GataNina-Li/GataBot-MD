// Esta función es para la versión LATAM 

import fs from 'fs'
const rutaArchivo = './prefijos.json'
const existeArchivo = fs.existsSync(rutaArchivo)

let handler = m => m
handler.before = async function (m, {conn, isAdmin, isBotAdmin} ) {

if (!m.isGroup) return !1
let chat = global.db.data.chats[m.chat]
if (isBotAdmin && chat.antifake) {
let texto = `${lenguajeGB['smsAvisoAG']()}${lenguajeGB['smsInt1']()} *@${m.sender.split`@`[0]}* ${lenguajeGB['smsInt2']()}`

if (existeArchivo) {
try {
const contenido = fs.readFileSync(rutaArchivo, 'utf-8')
const prefijos = JSON.parse(contenido)
//if (Array.isArray(prefijos)) {
const comienzaConPrefijo = prefijos.some(prefijo => m.sender.startsWith(prefijo))
if (comienzaConPrefijo) {
await conn.reply(m.chat, texto, m)
await conn.sendMessage(m.chat, { text: texto, mentions: [m.sender] }, { quoted: m })
//await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
}//} 
} catch (error) {
console.log('Error al leer o procesar el archivo prefijos.json:', error)
return
}} else {
if (m.sender.startsWith('6') || m.sender.startsWith('9') ||  m.sender.startsWith('7') ||  m.sender.startsWith('4') || m.sender.startsWith('2')) {
await conn.sendMessage(m.chat, { text: texto, mentions: [m.sender] }, { quoted: m })
//await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
}
}

}}
export default handler
