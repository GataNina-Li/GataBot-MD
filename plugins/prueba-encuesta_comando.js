const handler = async (m, { conn, text, args, participants, usedPrefix, command }) => {
let caption = 'Selecciona una opción:' 
let comandos = [ usedPrefix+ 'menu', usedPrefix + 'estado', usedPrefix + 'ping']

/*const pollMessage = {
name: caption,
values: comandos,
multiselect: false,
selectableCount: 1
}
await conn.sendMessage(m.chat, { poll: pollMessage })*/
    
await conn.sendPoll(m.chat, caption, comandos)
    
conn.on('message-new', async (message) => {
if (message.pollReply && message.pollReply.fromMe) {
const texto = message.text.trim()
console.log("Respuesta a la votación:", texto)
}})
    
}

handler.command = ['pruebapoll']
export default handler
