let { downloadContentFromMessage } = (await import(global.baileys))
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'
import fetch from 'node-fetch'
import axios from 'axios'

let handler = m => m
handler.before = async function (m, { conn, __dirname, isBotAdmin }) {
let chat = global.db.data.chats[m.chat]
let media, link, buffer
  
if (!isBotAdmin || chat.delete || !m.isGroup) return
if (!chat.antiPorn) return 
  
try{
let q = m
let mime = (q.msg || q).mimetype || q.mediaType || ''
if (!(/sticker|image/.test(mime)) || m.mtype == 'viewOnceMessageV2') return

let isTele = /^image\/(png|jpe?g)$/.test(mime)
if (isTele) {
media = await q.download()
link = await uploadImage(media)
}

if (m.mtype == 'viewOnceMessageV2') {
let msg = m.message.viewOnceMessageV2.message
let type = Object.keys(msg)[0]
if (type == 'imageMessage') {
media = await downloadContentFromMessage(msg[type], 'image')
buffer = Buffer.from([])
for await (const chunk of media) {
buffer = Buffer.concat([buffer, chunk])
}
link = await uploadImage(buffer)
}}

if (m.mtype == 'stickerMessage') {
const convertWebPToPNG = async (webPBuffer) => {
try {
const response = await axios({
method: 'POST',
url: 'https://api.alyachan.dev/api/webp-convert',
params: {
url: 'data:image/webp;base64,' + webPBuffer.toString('base64'),
action: 'webp-to-png',
apikey: 'GataDios'
},
responseType: 'arraybuffer'
})
return response.data
} catch (error) {
console.log('Error al convertir WebP a PNG:', error)
throw error
}}
//media = await q.download()
//m.reply(media)
//buffer = await getBuffer(q)
//let buffer2 = await webp2png(q)
//link = await uploadImage(buffer2) 
}

if (link) {
const response = await fetch(`https://api.alyachan.dev/api/porn-detector?image=${link}&apikey=GataDios`)
const result = await response.json()
await m.reply(link)

if (result.status && result.data && result.data.isPorn) {
await m.reply('*La imagen contiene contenido para adultos.*')

let delet = m.key.participant
let bang = m.key.id
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
}
}} catch (error) {
await m.reply(error.toString())
}
  
}		
export default handler

const getBuffer = async (url, options) => {
options ? options : {}
const res = await axios({method: 'get', url, headers: {'DNT': 1, 'Upgrade-Insecure-Request': 1,}, ...options, responseType: 'arraybuffer'})
return res.data
}
