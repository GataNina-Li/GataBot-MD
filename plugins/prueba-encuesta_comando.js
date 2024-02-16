/*let handler = async (m, { conn, text, args, participants, usedPrefix, command }) => {	

//conn.sendPoll(m.chat, texto, a, {mentions: m})
await conn.sendPoll(m.chat, `Selecciona una opción:`, [usedPrefix + 'menu', usedPrefix + 'estado', usedPrefix + 'ping'], { mentions: m })
}
handler.command = ['pruebapoll'] 
export default handler*/

const handler = async (m, { conn, text, args, participants, usedPrefix, command }) => {
let caption = 'Selecciona una opción:' 
let comandos = ['.menu', '.estado', '.ping']

/*const pollMessage = {
name: caption,
values: comandos,
multiselect: false,
selectableCount: 1
}
await conn.sendMessage(m.chat, { poll: pollMessage })*/
await conn.sendPoll(m.chat, caption, comandos)
    
}

handler.command = ['pruebapoll']
export default handler
