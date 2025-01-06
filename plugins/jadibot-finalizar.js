let handler = async (m, { conn, command }) => {
let resp
try {
if (global.conns.some(c => c.user.jid === conn.user.jid)) {
if (/stop/i.test(command)) {
let i = global.conns.indexOf(conn)
if (global.conn.user.jid != conn.user.jid && m.sender != global.conn.user.jid) {
if (i < 0) return
resp = 'Me apagaré'
global.conns.splice(i, 1)
conn.isInit = false
conn.ev.removeAllListeners()
conn.ws.close()
return conn.sendMessage(m.chat, { text: resp }, { quoted: m })
}}
} else {
resp = 'Este comando solo puede ser ejecutado por un Sub-Bot registrado.'
return conn.sendMessage(m.chat, { text: resp }, { quoted: m })
}} catch (e) {
console.log('Error al intentar apagar el Sub-Bot:', e)
resp = 'Hubo un error al intentar apagar el Sub-Bot.'
return conn.sendMessage(m.chat, { text: resp }, { quoted: m })
}}

handler.command = /^(berhenti|stop|detener)$/i
handler.private = true  
export default handler

