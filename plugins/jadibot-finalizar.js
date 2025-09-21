let handler = async (m, {conn, command, usedPrefix}) => {
let resp
try {
if (global.conns.some((c) => c.user.jid === conn.user.jid)) {
if (/stop/i.test(command)) {
let i = global.conns.indexOf(conn)
if (global.conn.user.jid != conn.user.jid && m.sender != global.conn.user.jid) {
if (i < 0) return
resp = `${gt} Pausado. Si quiere reanudar use el comando *${usedPrefix}serbot* o su token.`
await conn.sendMessage(m.chat, {text: resp}, {quoted: m})
conn.ev.removeAllListeners()
conn.ws.close()
conn.isInit = false
global.conns.splice(i, 1)
return
}
}
} else {
resp = '*Este comando sólo puede ser ejecutado por un usuario que sea Sub-Bot*.'
return conn.sendMessage(m.chat, {text: resp}, {quoted: m})
}
} catch (e) {
resp = '*Hubo un error al intentar apagar el Sub-Bot.*'
console.log('Error al intentar apagar el Sub-Bot: ', e)
return conn.sendMessage(m.chat, {text: resp}, {quoted: m})
}
}

handler.command = /^(berhenti|stop|detener)$/i
handler.private = true
export default handler
