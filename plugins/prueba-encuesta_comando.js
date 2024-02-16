let handler = async (m, { conn, text, args, participants, usedPrefix, command }) => {	

//conn.sendPoll(m.chat, texto, a, {mentions: m})
await conn.sendPoll(m.chat, `Selecciona una opción:`, [usedPrefix + 'menu', usedPrefix + 'estado', usedPrefix + 'ping'], { mentions: m })
}
handler.command = ['pruebapoll'] 
export default handler
