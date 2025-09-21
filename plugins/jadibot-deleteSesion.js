/*⚠ PROHIBIDO EDITAR ⚠ -- ⚠ PROHIBIDO EDITAR ⚠ -- ⚠ PROHIBIDO EDITAR ⚠
El codigo de este archivo fue realizado por:
- ReyEndymion >> https://github.com/ReyEndymion
*/

import { existsSync, promises as fs, readdirSync, readFileSync, rmSync, statSync, unlinkSync, watch } from 'fs'
import path, {join} from 'path'

let handler = async (m, {conn, usedPrefix, command}, args) => {
let parentw = conn
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let uniqid = `${who.split`@`[0]}`
let userS = `${conn.getName(who)}`

if (global.conn.user.jid !== conn.user.jid) {
return conn.sendMessage(
m.chat,
{
text:
lenguajeGB.smsJBDel() +
`\n\n*https://api.whatsapp.com/send/?phone=${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}&type=phone_number&app_absent=0*`
},
{quoted: m}
)
} else {
try {
await fs.rmdir('./GataJadiBot/' + uniqid, {recursive: true, force: true})
await conn.sendMessage(m.chat, {text: lenguajeGB.smsJBAdios()}, {quoted: m})
await conn.sendMessage(m.chat, {text: lenguajeGB.smsJBCerrarS()}, {quoted: m})
} catch (err) {
if (err.code === 'ENOENT' && err.path === `./GataJadiBot/${uniqid}`) {
await conn.sendMessage(m.chat, {text: 'Usted no es Sub Bot'}, {quoted: m})
} else {
console.error(userS + ' ' + lenguajeGB.smsJBErr(), err)
}
}
}
}

handler.command = /^(deletesess?ion|eliminarsesion|borrarsesion|delsess?ion|cerrarsesion)$/i
handler.private = true
handler.fail = null

export default handler
