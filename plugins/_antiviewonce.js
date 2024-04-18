let { downloadContentFromMessage } = (await import(global.baileys))

let handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {

const { antiver, isBanned } = db.data.chats[m.chat]
//if (/^[.~#/\$,](read)?viewonce/.test(m.text)) return
//if (!antiver || isBanned || !m.mtype || !(m.mtype == 'viewOnceMessageV2')) return
//if (m.mtype == 'viewOnceMessageV2') {
let msg = m.message.viewOnceMessageV2Extension //m.message.viewOnceMessageV2.message || m.viewOnceMessageV2Extension?.message?.audioMessage || m.viewOnceMessageV2Extension.message.audioMessage
let type = Object.keys(msg)[0]
let media = await downloadContentFromMessage(m.message.viewOnceMessageV2Extension, 'buffer', {}, { reuploadRequest: m.client.updateMediaMessage }) //await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : type == 'videoMessage' ? 'video' : 'audio')
await conn.sendMessage(m.chat, { audio: media, fileName: 'error.mp3', mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
let buffer = Buffer.from([])
for await (const chunk of media) {
buffer = Buffer.concat([buffer, chunk])}

const fileSize = formatFileSize(msg[type].fileLength)
const description = `
🕵️‍♀️ *ANTI VER UNA VEZ* 🕵️\n
🚫 *No ocultar* ${type === 'imageMessage' ? '`Imagen` 📷' : type === 'videoMessage' ? '`Vídeo` 🎥' : type === 'audioMessage' ? '`Audio` 🔊' : 'este mensaje'}
- *Tamaño:* \`${fileSize}\`
- *Usuario:* *@${m.sender.split('@')[0]}*
- *Texto:* ${msg[type].caption || 'Ninguno'}`.trim()
console.log(type)
if (/image|video/.test(type)) return await conn.sendFile(m.chat, buffer, type == 'imageMessage' ? 'error.jpg' : 'error.mp4', description, m, false, { mentions: [m.sender] })
if (/audio/.test(type)) return await conn.sendMessage(m.chat, { audio: buffer, fileName: 'error.mp3', mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
}//}
export default handler

function formatFileSize(bytes) {
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'TY', 'EY']
const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + ' ' + sizes[i]
}

/*let { downloadContentFromMessage } = (await import(global.baileys))

let handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {

let chat = db.data.chats[m.chat] 
if (/^[.~#/\$,](read)?viewonce/.test(m.text)) return
if (!chat.antiver || chat.isBanned) return
if (m.mtype == 'viewOnceMessageV2') {
let msg = m.message.viewOnceMessageV2.message
let type = Object.keys(msg)[0]
let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'video')
let buffer = Buffer.from([])
for await (const chunk of media) {
buffer = Buffer.concat([buffer, chunk])}
if (/video/.test(type)) {
return conn.sendFile(m.chat, buffer, 'error.mp4', `${msg[type].caption}\n\n${lenguajeGB.smsAntiView()}`, m)
} else if (/image/.test(type)) {
return conn.sendFile(m.chat, buffer, 'error.jpg', `${msg[type].caption}\n\n${lenguajeGB.smsAntiView()}`, m)
}}}
export default handler*/
