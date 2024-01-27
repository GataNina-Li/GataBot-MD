import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'
let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw `╰⊱❗️⊱ *𝙇𝙊 𝙐𝙎𝙊́ 𝙈𝘼𝙇 | 𝙐𝙎𝙀𝘿 𝙄𝙏 𝙒𝙍𝙊𝙉𝙂* ⊱❗️⊱╮\n\n𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙎𝙏𝙄𝘾𝙆𝙀𝙍 𝙏𝙀𝙇𝙀𝙂𝙍𝘼𝙈\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊:\n${usedPrefix + command} https://t.me/addstickers/Porcientoreal\n\n𝙀𝙉𝙏𝙀𝙍 𝙏𝙃𝙀 𝙎𝙏𝙄𝘾𝙆𝙀𝙍 𝙏𝙀𝙇𝙀𝙂𝙍𝘼𝙈 𝙇𝙄𝙉𝙆\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀:\n${usedPrefix + command} https://t.me/addstickers/Porcientoreal`
if (!text.includes('t.me')) throw `╰⊱❗️⊱ *𝙇𝙊 𝙐𝙎𝙊́ 𝙈𝘼𝙇 | 𝙐𝙎𝙀𝘿 𝙄𝙏 𝙒𝙍𝙊𝙉𝙂* ⊱❗️⊱╮\n\n𝙇𝘼 𝙐𝙍𝙇 𝙀𝙎 𝙄𝙉𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝘼\n𝙏𝙃𝙀 𝙐𝙍𝙇 𝙄𝙎 𝙄𝙉𝘾𝙊𝙍𝙍𝙀𝘾𝙏`
let stick = await (await fetch(global.API('fgmods', '/api/downloader/telesticker', { url: text }, 'apikey'))).json()
let res = stick.result.map(obj => obj.url)
m.reply(`*𝙎𝙏𝙄𝘾𝙆𝙀𝙍 𝙏𝙊𝙏𝘼𝙇𝙀𝙎:* ${res.length}
*𝙀𝙉𝙑𝙄𝘼𝘿𝙊 𝙀𝙇:* ${result.stickers.length * 1.5} Segundos`.trim())
for (let i of res) {
const stiker = await sticker(false, i, global.packname, global.author)
await delay(3000)
await conn.sendFile(m.chat, stiker, 'sticker.webp', '',m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: wm, body: ` 😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 `, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: gataImg.getRandom()}}}, { quoted: m })
}}
handler.help = ['telestick']
handler.tags = ['sticker']
handler.command = ['tgstick', 'telestick', 'telesticker', 'tgsticker', 'telegramsticker', 'stickertele']
handler.limit = 1
handler.register = true
export default handler

const delay = time => new Promise(res => setTimeout(res, time))
