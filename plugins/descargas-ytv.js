import { youtubedl, youtubedlv2, youtubedlv3 } from '@bochilteam/scraper'
import fetch from 'node-fetch'
let handler = async (m, { conn, args, usedPrefix, command }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
if (!args[0]) return conn.reply(m.chat, `${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} https://youtu.be/85xI8WFMIUY*\n\n𝙀𝙉𝙏𝙀𝙍 𝙏𝙃𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 𝙇𝙄𝙉𝙆 𝙏𝙊 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 𝙏𝙃𝙀 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} https://youtu.be/c5gJRzCi0f0*`, fkontak, m)
await conn.reply(m.chat, `${lenguajeGB['smsAvisoEG']()}𝙎𝙀 𝙀𝙎𝙏𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙉𝘿𝙊 𝙎𝙐 𝙑𝙄𝘿𝙀𝙊, 𝙀𝙎𝙋𝙀𝙍𝙀 𝙐𝙉 𝙈𝙊𝙈𝙀𝙉𝙏𝙊 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍\n\n𝙔𝙊𝙐𝙍 𝙑𝙄𝘿𝙀𝙊 𝙄𝙎 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿𝙄𝙉𝙂, 𝙒𝘼𝙄𝙏 𝘼 𝙈𝙊𝙈𝙀𝙉𝙏 𝙋𝙇𝙀𝘼𝙎𝙀`, fkontak, m)
try {
let qu = args[1] || '360'
let q = qu + 'p'
let v = args[0]
const yt = await youtubedl(v).catch(async _ => await youtubedlv2(v)).catch(async _ => await youtubedlv3(v))
const dl_url = await yt.video[q].download()
const ttl = await yt.title
const size = await yt.video[q].fileSizeH
await await conn.sendMessage(m.chat, { video: { url: dl_url }, fileName: `╭━❰  ${wm}  ❱━⬣
┃ 💜 𝙏𝙄𝙏𝙐𝙇𝙊 | 𝙏𝙄𝙏𝙇𝙀
┃ ${ttl}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ 💙 𝙋𝙀𝙎𝙊 | 𝙎𝙄𝙕𝙀
┃ ${size}
╰━━━━━❰ *𓃠 ${vs}* ❱━━━━⬣`, thumbnail: await fetch(yt.thumbnail) }, { quoted: m })
} catch {
try {
let lolhuman = await fetch(`https://api.lolhuman.xyz/api/ytvideo2?apikey=${lolkeysapi}&url=${args[0]}`)    
let lolh = await lolhuman.json()
let n = lolh.result.title || 'error'
let n2 = lolh.result.link
let n3 = lolh.result.size
let n4 = lolh.result.thumbnail
await conn.sendMessage(m.chat, { video: { url: n2 }, fileName: `╭━❰  ${wm}  ❱━⬣
┃ 🤍 𝙏𝙄𝙏𝙐𝙇𝙊 | 𝙏𝙄𝙏𝙇𝙀
┃ ${n}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ 🧡 𝙋𝙀𝙎𝙊 | 𝙎𝙄𝙕𝙀
┃ ${n3}
╰━━━━━❰ *𓃠 ${vs}* ❱━━━━⬣`, thumbnail: await fetch(n4) }, { quoted: m })
} catch {
await conn.reply(m.chat, `${lenguajeGB['smsAvisoFG']()}𝙀𝙎 𝙋𝙊𝙎𝙄𝘽𝙇𝙀 𝙌𝙐𝙀 𝙀𝙇 𝘼𝙍𝘾𝙃𝙄𝙑𝙊 𝙎𝙀𝘼 𝙈𝙐𝙔 𝙋𝙀𝙎𝘼𝘿𝙊. 𝙄𝙉𝙏𝙀𝙉𝙏𝙀 𝘾𝙊𝙉 𝙊𝙏𝙍𝘼 𝙊𝙋𝘾𝙄𝙊𝙉 𝘿𝙀 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼\n\n𝙄𝙏 𝙄𝙎 𝙋𝙊𝙎𝙎𝙄𝘽𝙇𝙀 𝙏𝙃𝘼𝙏 𝙏𝙃𝙀 𝙁𝙄𝙇𝙀 𝙄𝙎 𝙑𝙀𝙍𝙔 𝙃𝙀𝘼𝙑𝙔. 𝙏𝙍𝙔 𝘼𝙉𝙊𝙏𝙃𝙀𝙍`, m)}
}}
handler.command = /^fgmp4|dlmp4|getvid|yt(v|mp4)?$/i
export default handler
