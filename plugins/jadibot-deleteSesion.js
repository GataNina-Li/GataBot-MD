/*⚠ PROHIBIDO EDITAR ⚠ -- ⚠ PROHIBIDO EDITAR ⚠ -- ⚠ PROHIBIDO EDITAR ⚠
El codigo de este archivo fue realizado por:
- ReyEndymion >> https://github.com/ReyEndymion
*/

import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fs} from "fs"
import path, { join } from 'path'
let handler  = async (m, { conn, usedPrefix, command}, args) => {
let parentw = conn
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let uniqid = `${who.split`@`[0]}`
let userS = `${conn.getName(who)}`
if (global.conn.user.jid !== conn.user.jid) return conn.sendMessage(m.chat, {text: lenguajeGB.smsJBDel() + `\n\n*https://api.whatsapp.com/send/?phone=${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}&type=phone_number&app_absent=0*`}, { quoted: m }) 
else {
await conn.sendMessage(m.chat, { text: lenguajeGB.smsJBAdios() }, { quoted: m })}
try {
fs.rmdir("./GataJadiBot/" + uniqid, { recursive: true, force: true })
await conn.sendMessage(m.chat, { text : lenguajeGB.smsJBCerrarS() } , { quoted: m })
} catch(err) {
console.error(userS + ' ' + lenguajeGB.smsJBErr(), err)   
}}
handler.command = /^(deletesesion|eliminarsesion|borrarsesion|delsesion|cerrarsesion)$/i
handler.private = true
handler.fail = null
export default handler
