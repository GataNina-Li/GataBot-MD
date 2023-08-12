let { downloadContentFromMessage } = (await import(global.baileys));

export async function before(m, { isAdmin, isBotAdmin }) {
 
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
return this.sendFile(m.chat, buffer, 'error.mp4', `${msg[type].caption}\n\n${lenguajeGB.smsAntiView()}`, m)
} else if (/image/.test(type)) {
return this.sendFile(m.chat, buffer, 'error.jpg', `${msg[type].caption}\n\n${lenguajeGB.smsAntiView()}`, m)
}}}
