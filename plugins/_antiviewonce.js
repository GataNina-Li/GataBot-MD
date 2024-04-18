let { downloadContentFromMessage } = (await import(global.baileys))

let handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
const { antiver, isBanned } = global.db.data.chats[m.chat]
 
//if (!antiver || isBanned || !m.mtype || !(m.mtype == 'viewOnceMessageV2')) return
try {
const type = Object.keys(msg)[0]
const media = await downloadContentFromMessage(m.msg, type)
let buffer = Buffer.from([])
for await (const chunk of media) {
buffer = Buffer.concat([buffer, chunk])
}

const fileSize = formatFileSize(m.msg.fileLength)
const description = `
🕵️‍♀️ *ANTI VER UNA VEZ* 🕵️

🚫 *No se permite ocultar* \`${type === 'imageMessage' ? 'Imagen 📷' : type === 'videoMessage' ? 'Vídeo 🎥' : type === 'audioMessage' ? 'Audio 🔊' : 'este mensaje'}\`
- *Tamaño:* \`${fileSize}\`
- *Usuario:* *@${m.sender.split('@')[0]}*
- *Texto:* ${m.msg.caption || 'Ninguno'}`.trim()

 if (/image|video|audio/.test(type)) return await conn.sendFile(m.chat, buffer, type, description || type, m, false, { mentions: [m.sender] })
 } catch (error) {
 return console.log(error)
 }

}
export default handler

function formatFileSize(bytes) {
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'TY', 'EY']
const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + ' ' + sizes[i]
}
