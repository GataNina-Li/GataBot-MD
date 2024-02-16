/*let handler = async (m, { conn, text, args, participants, usedPrefix, command }) => {	

//conn.sendPoll(m.chat, texto, a, {mentions: m})
await conn.sendPoll(m.chat, `Selecciona una opción:`, [usedPrefix + 'menu', usedPrefix + 'estado', usedPrefix + 'ping'], { mentions: m })
}
handler.command = ['pruebapoll'] 
export default handler*/

const handler = async (m, { conn, text, args, participants, usedPrefix, command }) => {
let caption = 'Selecciona una opción:' 
let comandos = ['menu', 'estado', 'ping']

/*const pollMessage = {
name: caption,
values: comandos,
multiselect: false,
selectableCount: 1
}
await conn.sendMessage(m.chat, { poll: pollMessage })*/


conn.ev.on('messages.update', async chatUpdate => {
for(const { key, update } of chatUpdate) {
if(update.pollUpdates && key.fromMe) {
const pollCreation = await getMessage(key)
if(pollCreation) {
const pollUpdate = await getAggregateVotesInPollMessage({
message: pollCreation,
pollUpdates: update.pollUpdates,
})
var toCmd = pollUpdate.filter(v => v.voters.length !== 0)[0]?.name
if (toCmd == undefined) return
var prefCmd = prefix+toCmd
sock.appenTextMessage(prefCmd, chatUpdate)
}}}})
    
async function getMessage(key){
if (store) {
const msg = await store.loadMessage(key.remoteJid, key.id)
return msg?.message
}
return { conversation: "hola" }}

conn.ev.on('messages.update', async chatUpdate => {
for(const { key, update } of chatUpdate) {
if (update.pollUpdates && key.fromMe) {
const pollCreation = await getMessage(key)
if (pollCreation) {
const pollUpdate = await getAggregateVotesInPollMessage({message: pollCreation, pollUpdates: update.pollUpdates, })
var toCmd = pollUpdate.filter(v => v.voters.length !== 0)[0]?.name
if (toCmd == undefined) return
var prefCmd = usedPrefix+toCmd
sock.appenTextMessage(prefCmd, chatUpdate)
}}}})

conn.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return conn.sendMessage(jid, { poll: { name, values, selectableCount }}) }
    
}

handler.command = ['pruebapoll']
export default handler
