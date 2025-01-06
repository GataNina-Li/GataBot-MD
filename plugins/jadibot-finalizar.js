let handler  = async (m, { conn, command }) => {
if (m.sender === conn.user.jid && m.fromMe) return

if (/stop/i.test(command)) {
let resp
let i = global.conns.indexOf(conn)
    
if (global.conn.user.jid != conn.user.jid && m.sender != global.conn.user.jid) { 
if (i < 0) return
        
resp = 'Me apagaré'
global.conns.splice(i, 1)
conn.isInit = false
        
conn.ev.removeAllListeners()
conn.ws.close()
        
return conn.sendMessage(m.chat, resp, m)
} else {
resp = '*Este comando solo puede ser ejecutado por Sub-Bots*'
return conn.sendMessage(m.chat, resp, m)
}
}

handler.command = /^(berhenti|stop|detener)$/i
//handler.owner = true  
//handler.fail = null
export default handler
