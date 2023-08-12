import fetch from 'node-fetch'
import Spotify from "spotifydl-x"
import fs from 'fs'
let handler = async(m, { conn, usedPrefix, command, text }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let frep = { contextInfo: { externalAdReply: {title: wm, body: author, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(gataMenu.getRandom())).buffer() }}}
if (!text) return await conn.reply(m.chat, `${lenguajeGB.smsMalused2()} ⊱ *${usedPrefix + command} Bellyache*`, fkontak, m)
try {
let resDL = await fetch(`https://api.lolhuman.xyz/api/spotifysearch?apikey=${lolkeysapi}&query=${text}`)
let jsonDL = await resDL.json()
let linkDL = jsonDL.result[0].link
let spty = await spotifydl(linkDL)
const getRandom = (ext) => {
return `${Math.floor(Math.random() * 10000)}${ext}`}
let randomName = getRandom(".mp3")
const filePath = `./tmp/${randomName}`
fs.writeFileSync(filePath, spty.audio)
let spotifyi = `✨ *TITULO:*
_${spty.data.name}_

🗣️ *ARTISTA:*
» _${spty.data.artists}_

🌐 *URL*:
» _${linkDL}_

🎶 *Enviando canción...*
${wm}`
await conn.sendFile(m.chat, spty.data.cover_url, 'error.jpg', spotifyi, fkontak, m)
await conn.sendMessage(m.chat, { audio: fs.readFileSync(`./tmp/${randomName}`), fileName: `${spty.data.name}.mp3`, mimetype: "audio/mp4", }, { quoted: m })    
} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${usedPrefix + command}\n\n${wm}`, fkontak, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
handler.limit = false
}}
handler.command = /^(spotify|music)$/i
handler.limit = 1
handler.level = 3
export default handler

const credentials = { clientId: 'acc6302297e040aeb6e4ac1fbdfd62c3', clientSecret: '0e8439a1280a43aba9a5bc0a16f3f009' }
const spotify = new Spotify.default(credentials)
async function spotifydl(url) {
const res = await spotify.getTrack(url).catch(() => {
return { error: 'Fallo la descarga' }})
return { data: res, audio: await spotify.downloadTrack(url) }}


/*import fetch from 'node-fetch'
import fs from 'fs'

let handler = async(m, { conn, text, usedPrefix, command }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let frep = { contextInfo: { externalAdReply: {title: wm, body: author, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(gataMenu.getRandom())).buffer() }}}
if (!text) return await conn.reply(m.chat, `${lenguajeGB.smsMalused2()} ⊱ *${usedPrefix + command} Bellyache*`, fkontak, m)
 //conn.sendButton(m.chat, lenguajeGB.smsMalused2(), `⊱ *${usedPrefix + command} Bellyache*`, null, [[lenguajeGB.smsConMenu(), `${usedPrefix}menu`]], fkontak, m)
try {
let res = await fetch(`https://api.lolhuman.xyz/api/spotifysearch?apikey=${lolkeysapi}&query=${text}`)
let json = await res.json()
let { link } = json.result[0]
let res2 = await fetch(`https://api.lolhuman.xyz/api/spotify?apikey=${lolkeysapi}&url=${link}`)
let json2 = await res2.json()
let { thumbnail, title, artists } = json2.result

let spotifyi = `✨ *TITULO:* 
_${title}_

🗣️ *ARTISTA:* 
» _${artists}_

🌐 *URL*: 
» _${link}_

💚 *URL DE DESCARGA:* 
» _${json2.result.link}_

🎶 *Enviando canción...*
${wm}`

conn.sendFile(m.chat, thumbnail, 'error.jpg', spotifyi, fkontak, m)
//await conn.sendButton(m.chat, '🎧 *Ｓ Ｐ Ｏ Ｔ Ｉ Ｆ Ｙ* 🎧', spotifyi, thumbnail, [[lenguajeGB.smsConMenu(), `${usedPrefix}menu`]], m, frep)
let aa = await conn.sendMessage(m.chat, { audio: { url: json2.result.link }, fileName: `error.mp3`, mimetype: 'audio/mp4' }, { quoted: m })  
if (!aa) return conn.sendFile(m.chat, json2.result.link, 'error.mp3', null, m, false, { mimetype: 'audio/mp4' }) 
} catch (e) {
await conn.sendButton(m.chat, `\n${wm}`, lenguajeGB['smsMalError3']() + '#report ' + usedPrefix + command, null, [[lenguajeGB.smsMensError1(), `#reporte ${lenguajeGB['smsMensError2']()} *${usedPrefix + command}*`]], m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
}}
handler.command = /^(spotify|music)$/i
handler.limit = 1
handler.level = 3
export default handler*/
