/*
El codigo de este archivo esta totalmente hecho por:
- ReyEndymion (https://github.com/ReyEndymion)
*/

import fs from "fs"
let handler = async (m, { conn, usedPrefix }, args, command) => {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let uniqid = `${who.split`@`[0]}`
try {
if(global.conns.push(conn))
await conn.sendMessage(m.chat, {text : usedPrefix + 'serbot' + " " + Buffer.from(fs.readFileSync("./GataJadiBot/" + uniqid + "/creds.json"), "utf-8").toString("base64")}, { quoted: m })
} catch(e) {
await conn.reply(m.chat, `*No eres Sub-Bot de este Bot.*

> 👉 Para convertirte en Sub-Bot, utiliza el comando:
\`${usedPrefix + 'serbot'}\`

> ⚠️ ¿Problemas para iniciar sesión?
*Si no puedes acceder a tu sesión, elimina la sesión creada desde los dispositivos vinculados y utiliza el comando:*
\`${usedPrefix + 'eliminarjb'}\`
De esta manera, podrás solicitar una nueva sesión.`, m)
if (m.fromMe) return
}}
handler.command = /^(codetoken)$/i
handler.private = true
export default handler
