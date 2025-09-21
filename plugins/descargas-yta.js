import fetch from 'node-fetch'
import yts from 'yt-search'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const {ytmp3} = require('@hiudyy/ytdl') //

const LimitAud = 700 * 1024 * 1024 // 700MB

let handler = async (m, {text, conn, args, usedPrefix, command}) => {
if (!args[0]) {
return conn.reply(m.chat, `${lenguajeGB['smsAvisoMG']()}${mid.smsMalused7}\n*${usedPrefix + command} https://youtu.be/c5gJRzCi0f0*`, fkontak, m)
}

const yt_play = await search(args.join(' '))
let youtubeLink = ''
if (args[0].includes('you')) {
youtubeLink = args[0]
} else {
const index = parseInt(args[0]) - 1
if (index >= 0) {
if (Array.isArray(global.videoList) && global.videoList.length > 0) {
const matchingItem = global.videoList.find((item) => item.from === m.sender)
if (matchingItem) {
if (index < matchingItem.urls.length) youtubeLink = matchingItem.urls[index]
else throw `${lenguajeGB['smsAvisoFG']()}${mid.smsYT} ${matchingItem.urls.length}*`
} else {
throw `${lenguajeGB['smsAvisoMG']()} ${mid.smsY2(usedPrefix, command)} ${usedPrefix}playlist <texto>*`
}
} else {
throw `${lenguajeGB['smsAvisoMG']()}${mid.smsY2(usedPrefix, command)} ${usedPrefix}playlist <texto>*`
}
} else {
throw `${lenguajeGB['smsAvisoMG']()}${mid.smsY2(usedPrefix, command)} ${usedPrefix}playlist <texto>*`
}
}

await conn.reply(m.chat, lenguajeGB['smsAvisoEG']() + mid.smsAud, fkontak, m)

const [_, qualityArg = '320'] = (text || '').split(' ')
const validQualities = ['64', '96', '128', '192', '256', '320']
const selectedQuality = validQualities.includes(qualityArg) ? qualityArg : '320'

try {
const target = youtubeLink || yt_play?.[0]?.url
if (!target) throw new Error('No se encontró URL válida de YouTube.')

const result = await ytmp3(target)

let audioData = result
let isDirect = true

let fileSize = 0
if (typeof audioData === 'string') {
fileSize = await getFileSize(audioData)
isDirect = false
}

if (fileSize > LimitAud) {
await conn.sendMessage(
m.chat,
{
document: isDirect ? audioData : {url: audioData},
mimetype: 'audio/mpeg',
fileName: `${yt_play?.[0]?.title || 'audio'}.mp3`
},
{quoted: m}
)
} else {
await conn.sendMessage(
m.chat,
{
audio: isDirect ? audioData : {url: audioData},
mimetype: 'audio/mpeg'
},
{quoted: m}
)
}
} catch (e) {
console.log(`❌ Error ytmp3: ${e?.message || e}`)
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
}
}

handler.command = /^audio|fgmp3|dlmp3|getaud|yt(a|mp3)$/i
handler.register = true
export default handler

async function search(query, options = {}) {
const search = await yts.search({query, hl: 'es', gl: 'ES', ...options})
return search.videos
}

async function getFileSize(url) {
try {
const res = await fetch(url, {method: 'HEAD'})
return parseInt(res.headers.get('content-length') || 0)
} catch {
return 0
}
}
