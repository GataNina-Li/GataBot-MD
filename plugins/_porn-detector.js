let { downloadContentFromMessage } = (await import(global.baileys))
import uploadImage from '../lib/uploadImage.js'
import { webp2png, webp2VideoToJpg } from '../lib/webp2mp4.js'
import fetch from 'node-fetch'
import axios from 'axios'
import path from 'path'
global.enlace = null

import FormData from 'form-data'
import { JSDOM } from 'jsdom'

let handler = m => m
handler.before = async function (m, { conn, __dirname, isBotAdmin }) {
let chat = global.db.data.chats[m.chat]
let media, link, buffer = false
let web = /https?:\/\/\S+/
  
if (!isBotAdmin || chat.delete || !m.isGroup) return
if (!chat.antiPorn) return 
  
try{
let q = m
let mime = (q.msg || q).mimetype || q.mediaType || ''
let delet = q.key.participant
let bang = q.key.id
//let link2 = await webp2VideoToJpg(await q.download())  
//console.log(link2)

const videoBuffer = await q.download()
await getFirstFrameFromVideo(videoBuffer).then(firstFrameImgBuffer => {
console.log('Bytes del primer fotograma de video:', firstFrameImgBuffer)
}).catch(error => {
console.error('Error al obtener el primer fotograma de video:', error)
})
  
if (/sticker|image/.test(mime) || m.mtype == 'viewOnceMessageV2') {
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
try {
link = await webp2png(await q.download())
} catch {
link = false
}}

} else {
if (q.text || web.test(q.text)) {
await IsEnlace(q.text).then(result => {
link = result ? enlace : false
}).catch(error => {
link = false
})
} else return  
}

if (!link) return 
const response = await fetch(`https://api.alyachan.dev/api/porn-detector?image=${link}&apikey=GataDios`)
const result = await response.json()
enlace = null

if (result.status && result.data.isPorn) {
await m.reply('*La imagen contiene contenido para adultos.*')
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})

}} catch (error) {
console.log(error)
}
  
}		
export default handler

async function IsEnlace(texto) {
const regexEnlace = /https?:\/\/\S+/
const match = texto.match(regexEnlace)
if (match) {
enlace = match[0]
const response = await fetch(enlace, { method: 'HEAD' })
const contentType = response.headers.get('content-type')
if (contentType && (contentType.startsWith('image/jpeg') || contentType.startsWith('image/jpg') || contentType.startsWith('image/png') || contentType.startsWith('image/webp'))) {
return true
}}
return false
}

async function getFirstFrameFromVideo(video) {
    try {
        
        const formData = new FormData();
        formData.append('file', video);
        const fileIoResponse = await fetch('https://file.io', {
            method: 'POST',
            body: formData
        });
        const fileIoData = await fileIoResponse.json();
        const videoLink = fileIoData.link;

        
        const ezgifResponse = await fetch('https://ezgif.com/video-to-jpg', {
            method: 'GET',
            params: { url: videoLink }
        });
        const ezgifHtml = await ezgifResponse.text();
        const { document } = new JSDOM(ezgifHtml).window;
        const nextUrl = document.querySelector('form').action;
        const fileInputValue = document.querySelector('form > input[type=hidden]').value;

        const ezgifFormData = new FormData();
        ezgifFormData.append('file', fileInputValue);
        ezgifFormData.append('start', '0');
        ezgifFormData.append('end', '1');
        ezgifFormData.append('size', 'original');
        ezgifFormData.append('fps', '10');

        const ezgifNextResponse = await fetch(nextUrl, {
            method: 'POST',
            body: ezgifFormData
        });
        const ezgifNextHtml = await ezgifNextResponse.text();
        const { document: nextDocument } = new JSDOM(ezgifNextHtml).window;
        const firstFrameImgUrl = "https:" + nextDocument.querySelector('img:nth-child(1)').getAttribute('src');

        
        const firstFrameImgResponse = await fetch(firstFrameImgUrl);
        const firstFrameImgBuffer = await firstFrameImgResponse.buffer();

        return firstFrameImgBuffer;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
