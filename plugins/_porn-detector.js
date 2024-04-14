import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'
import { spawn } from 'child_process'
import fetch from 'node-fetch'

let { downloadContentFromMessage } = (await import(global.baileys))

let handler = m => m
handler.before = async function (m, { conn }) {
let media, link, buffer
try{
let q = m
let mime = (q.msg || q).mimetype || ''
media = await q.download()
let isTele = /^image\/(png|jpe?g)$/.test(mime)
if (isTele) {
link = await uploadImage(media)
}

if (m.mtype == 'viewOnceMessageV2') {
let msg = m.message.viewOnceMessageV2.message
let type = Object.keys(msg)[0]
if (/image/.test(type)) {
if (type == 'imageMessage') {
media = await downloadContentFromMessage(msg[type], 'image')
buffer = Buffer.from([])
for await (const chunk of media) {
buffer = Buffer.concat([buffer, chunk])
}
link = await uploadImage(buffer)
}}}

if (/sticker/.test(mime)) {
media = await q.download()
try {
buffer = await webp2png(media).catch((_) => null) || Buffer.alloc(0)
} catch {
let bufs = []
const [_spawnprocess, ..._spawnargs] = [...(global.support.gm ? ['gm'] : global.support.magick ? ['magick'] : []), 'convert', 'webp:-', 'png:-']
let im = spawn(_spawnprocess, _spawnargs);
im.stdout.on('data', chunk => bufs.push(chunk))
im.stdin.write(sticker);
im.stdin.end();
im.on('exit', () => {
buffer = Buffer.concat(bufs)
})
media = buffer
}
link = await uploadImage(media)
}

const response = await fetch(`https://api.alyachan.dev/api/porn-detector?image=${link}&apikey=GataDios`)
const result = await response.json()
await m.reply(link)
await m.reply(result.data.isPorn)
if (result.status && result.data && result.data.isPorn) {
await m.reply('La imagen contiene contenido para adultos.')
}
} catch (error) {
await m.reply(error.text)
}
  
}		
export default handler
