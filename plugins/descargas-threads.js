import fetch from 'node-fetch'
import axios from 'axios'
import cheerio from 'cheerio'
const handler = async (m, {conn, text, args, usedPrefix, command}) => {
if (!text) return conn.reply(m.chat,`${lenguajeGB['smsAvisoMG']()}${mid.smsMalused7}\n${usedPrefix + command} https://www.threads.net/@adri_leclerc_/post/C_dSNIOOlpy?xmt=AQGzxbmyveDB91QgFo_KQWzqL6PT2yCy2eg8BkhPTO-6Kw`, fkontak)
let key
try{ 
( { key } = await conn.sendMessage(m.chat, {text: wait}, {quoted: fkontak}));
await delay(1000 * 1);
await conn.sendMessage(m.chat, {text: waitt, edit: key});
await conn.sendMessage(m.chat, {text: waittt, edit: key});
await delay(1000 * 1);
await conn.sendMessage(m.chat, {text: waitttt, edit: key});
const apiUrl = `${apis}/download/threads?url=${encodeURIComponent(text)}`

const response = await fetch(apiUrl)
const jsonData = await response.json()
const threadTitle = jsonData.data.description
const threadVideoUrl = jsonData.data.media[0].url
const shortUrl1 =await (await fetch(`https://tinyurl.com/api-create.php?url=${text}`)).text()
const threadTitleWithoutUrl = threadTitle
const txt1 = `🖤 ${threadTitleWithoutUrl}\n\n🔗 *URL:*\n• _${shortUrl1}_`.trim()
await conn.sendFile(m.chat, threadVideoUrl, 'error.mp4', txt1, fkontak)
await conn.sendMessage(m.chat, {text: waittttt, edit: key})
handler.limit = 3
} catch (e) {
await conn.sendMessage(m.chat, {text: `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, edit: key});
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
handler.limit = false
}}
handler.command = /^(thread|threads|threaddl)$/i
handler.register = true
export default handler
const delay = time => new Promise(res => setTimeout(res, time))




