import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import ws from 'ws'
import { performance } from 'perf_hooks'
import { spawn, exec, execSync } from 'child_process'

async function handler(m, { conn, usedPrefix, command }) {
// pin
let start = performance.now()
let neww = performance.now()
let speed = Math.round((start) * 100) / 100

// carpetas creadas
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const carpetaBase = path.resolve(__dirname, '..', 'GataJadiBot')
const cantidadCarpetas = (fs?.readdirSync(carpetaBase, { withFileTypes: true }).filter(item => item?.isDirectory())?.length) || 0

// servidor
let _uptime = process.uptime() * 1000
let uptime = convertirMs(_uptime)
  
const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]

const message = users.map((v, index) => `👤 \`[${index + 1}]\` *${v.user.name || global.db.data.users[v.user.jid]?.name || 'Anónimo' }*
⏱️ \`\`\`${v.uptime ? convertirMs(Date.now() - v.uptime) : "Desconocido"}\`\`\`
🐈 wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}serbot%20code`).join('\n\n∵ ∵ ∵ ∵ ∵ ∵ ∵ ∵ ∵ ∵\n\n')
const replyMessage = message.length === 0 ? '*NO HAY SUB BOTS DISPONIBLE. VERIFIQUE MÁS TARDE.*' : message
const totalUsers = users.length;
const responseMessage = `☄️ *LISTA DE SUB-BOTS V${vsJB}*\n
\`¡Conviértete en sub bot desde otros sub bots!\`\n

🔄 *Auto conexión automática*
✨ *Novedades:* 
_${canal1}_

💠 *Sub Bots conectados:* ${totalUsers || 0}
📁 *Sesiones creadas:* ${cantidadCarpetas}
📁 *Sesiones activas:* ${totalUsers || 0}
🚄 *Ping:* \`${speed} ms\`
💻 *Servidor:* \`\`\`${uptime}\`\`\`\n\n${replyMessage.trim()}`.trim()
  
await conn.sendMessage(m.chat, {text: responseMessage, mentions: conn.parseMention(responseMessage)}, {quoted: m})
}
handler.command = /^(listjadibots|bots|subsbots)$/i
export default handler

function convertirMs(ms) {
const s = Math.floor(ms / 1000) % 60
const m = Math.floor(ms / 60000) % 60
const h = Math.floor(ms / 3600000) % 24
const d = Math.floor(ms / 86400000)
return [
d > 0 ? `${d}d` : "",
h > 0 ? `${h}h` : "",
m > 0 ? `${m}m` : "",
s > 0 ? `${s}s` : ""
].filter(Boolean).join(" ") || "0s"
}
