import { youtubedl, youtubedlv2, youtubedlv3 } from '@bochilteam/scraper'
import fetch from 'node-fetch'
let handler = async (m, { conn, args, isPrems, isOwner, usedPrefix, command }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
if (!args || !args[0]) return conn.reply(m.chat, `${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝘿𝙊𝘾𝙐𝙈𝙀𝙉𝙏𝙊 𝘿𝙀 𝘼𝙐𝘿𝙄𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} https://youtu.be/85xI8WFMIUY*\n\n𝙀𝙉𝙏𝙀𝙍 𝙏𝙃𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 𝙇𝙄𝙉𝙆 𝙏𝙊 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 𝙏𝙃𝙀 𝘼𝙐𝘿𝙄𝙊 𝘿𝙊𝘾𝙐𝙈𝙀𝙉𝙏\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} https://youtu.be/c5gJRzCi0f0*`, fkontak,  m)

await conn.reply(m.chat, `${lenguajeGB['smsAvisoEG']()}𝙋𝙍𝙊𝙉𝙏𝙊 𝙏𝙀𝙉𝘿𝙍𝘼 𝙎𝙐 𝘿𝙊𝘾𝙐𝙈𝙀𝙉𝙏𝙊 𝘿𝙀 𝘼𝙐𝘿𝙄𝙊, 𝙀𝙎𝙋𝙀𝙍𝙀 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍\n\n𝙎𝙊𝙊𝙉 𝙔𝙊𝙐 𝙒𝙄𝙇𝙇 𝙃𝘼𝙑𝙀 𝙔𝙊𝙐𝙍 𝘼𝙐𝘿𝙄𝙊 𝘿𝙊𝘾𝙐𝙈𝙀𝙉𝙏, 𝙋𝙇𝙀𝘼𝙎𝙀 𝙒𝘼𝙄𝙏`, fkontak,  m)
try {
let q = '128kbps'
let v = args[0]
const yt = await youtubedl(v).catch(async _ => await youtubedlv2(v)).catch(async _ => await youtubedlv3(v))
const dl_url = await yt.audio[q].download()
const ttl = await yt.title
const size = await yt.audio[q].fileSizeH
let cap = `╭━❰  ${wm}  ❱━⬣\n┆📥 YOUTUBE DL 📥\n┆ও *TÍTULO | TITLE:* \n┆» ${ttl}\n┆﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘\n┆ও *PESO | SIZE:*\n┆» ${size}\n╰─────────────────`.trim()
await conn.sendMessage(m.chat, { document: { url: dl_url }, caption: cap, mimetype: 'audio/mpeg', fileName: `${ttl}.mp3`}, { quoted: m })
} catch {
try {
let lolhuman = await fetch(`https://api.lolhuman.xyz/api/ytaudio2?apikey=${lolkeysapi}&url=${args[0]}`)   
let lolh = await lolhuman.json()
let n = lolh.result.title || 'error'
let n2 = lolh.result.link
let n3 = lolh.result.size
let cap2 = `╭━❰  ${wm}  ❱━⬣\n┆📥 YOUTUBE DL 📥\n┆ও *TÍTULO | TITLE:* \n┆» ${ttl}\n┆﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘\n┆ও *PESO | SIZE:*\n┆» ${size}\n╰─────────────────`.trim()
await conn.sendMessage(m.chat, { document: { url: n2 }, caption: cap2, mimetype: 'audio/mpeg', fileName: `${n}.mp3`}, {quoted: m})
} catch {
await conn.reply(m.chat, '*ERROR, VUELVE AL INTENTA*', m)}
}}
handler.command = /^playaudiodoc|pdocaudio|docaudio|ytmp3doc|ytadoc|ytmp3.2|yta.2$/i
handler.limit = 3
export default handler
