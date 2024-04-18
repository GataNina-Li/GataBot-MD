let { downloadContentFromMessage } = (await import(global.baileys))

let handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
let media, msg, type
const { antiver, isBanned } = db.data.chats[m.chat]
if (!antiver || isBanned || !m.mtype || !(m.mtype == 'viewOnceMessageV2' || m.mtype == 'viewOnceMessageV2Extension')) return
if (m.mtype == 'viewOnceMessageV2' || m.mtype == 'viewOnceMessageV2Extension') {
msg = m.message.viewOnceMessageV2.message
type = Object.keys(msg)[0]
try {
media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'video')
} catch {
msg = m.message.viewOnceMessageV2Extension.message 
media = await downloadContentFromMessage(msg[type], 'audio')
}
let buffer = Buffer.from([])
for await (const chunk of media) {
buffer = Buffer.concat([buffer, chunk])}
const fileSize = formatFileSize(msg[type].fileLength)
const description = `
🕵️‍♀️ *ANTI VER UNA VEZ* 🕵️\n
🚫 *No ocultar* ${type === 'imageMessage' ? '`Imagen` 📷' : type === 'videoMessage' ? '`Vídeo` 🎥' : type === 'audioMessage' ? '`Mensaje de voz` 🔊' : 'este mensaje'}
- *Tamaño:* \`${fileSize}\`
- *Usuario:* *@${m.sender.split('@')[0]}*
${type === 'audioMessage' ? `- *Texto:* ${msg[type].caption || 'Ninguno'}` : ''}`.trim()
if (/image|video/.test(type)) return await conn.sendFile(m.chat, buffer, type == 'imageMessage' ? 'error.jpg' : 'error.mp4', description, m, false, { mentions: [m.sender] })
if (/audio/.test(type)) { 
await m.reply(description)
await conn.sendMessage(m.chat, { audio: buffer, fileName: 'error.mp3', mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
}
}}
export default handler

function formatFileSize(bytes) {
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'TY', 'EY']
const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + ' ' + sizes[i]
}
