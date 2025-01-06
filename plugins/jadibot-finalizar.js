let handler = async (m, { conn, command }) => {
if (global.conns.some(c => c.user.jid === conn.user.jid)) {
let resp
if (/stop/i.test(command)) {
let i = global.conns.indexOf(conn)
if (global.conn.user.jid != conn.user.jid && m.sender != global.conn.user.jid) {
if (i < 0) return
resp = 'Me apagaré'
global.conns.splice(i, 1)
conn.isInit = false
conn.ev.removeAllListeners()
conn.ws.close()
return conn.sendMessage(m.chat, resp, { quoted: m })
}}
} else {
let resp = 'Este comando solo puede ser ejecutado por un Sub-Bot registrado.'
return conn.sendMessage(m.chat, resp, { quoted: m })
}}

handler.command = /^(berhenti|stop|detener)$/i
handler.private = true  
export default handler

