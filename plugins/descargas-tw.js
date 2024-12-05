import fetch from 'node-fetch'
import axios from 'axios'
import cheerio from 'cheerio'
import vm from 'node:vm'
import qs from 'qs'
const handler = async (m, {conn, text, args, usedPrefix, command}) => {
const twitterUrlRegex = /^https?:\/\/(www\.)?twitter\.com\/(\w+)\/status\/(\d+)$/i 
if (!text) return conn.reply(m.chat,`${lenguajeGB['smsAvisoMG']()}${mid.smsMalused7}\n${usedPrefix + command} https://twitter.com/Animalesybichos/status/1564616107159330816?t=gKqUsstvflSp7Dhpe_nmDg&s=19`, fkontak)
try{ 
const { key } = await conn.sendMessage(m.chat, {text: wait}, {quoted: fkontak});
await delay(1000 * 1);
await conn.sendMessage(m.chat, {text: waitt, edit: key});
await conn.sendMessage(m.chat, {text: waittt, edit: key});
await delay(1000 * 1);
await conn.sendMessage(m.chat, {text: waitttt, edit: key});
const apiUrl = `${apis}/download/twitterv2?url=${encodeURIComponent(text)}`

const response = await fetch(apiUrl)
const jsonData = await response.json()
const tweetTitle = jsonData.data.description
console.log(tweetTitle)
const tweetVideoUrl = jsonData.data.media[0].videos[0].url
const shortUrl1 =await (await fetch(`https://tinyurl.com/api-create.php?url=${text}`)).text()
const tweetTitleWithoutUrl = tweetTitle.replace(/https?:\/\/t\.co\/\w+/i, '').trim()
const txt1 = `🖤 ${tweetTitleWithoutUrl}\n\n🔗 *URL:*\n• _${shortUrl1}_`.trim()
await conn.sendFile(m.chat, tweetVideoUrl, 'error.mp4', txt1, fkontak)
await conn.sendMessage(m.chat, {text: waittttt, edit: key})
handler.limit = 3
} catch (e) {
await conn.sendMessage(m.chat, {text: `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, edit: key});
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
handler.limit = false
}}
handler.command = /^((dl)?tw(it(ter(dl|x)?)?)?|x|t?tx)$/i
//handler.limit = 3
//handler.level = 3
handler.register = true

export default handler

const delay = time => new Promise(res => setTimeout(res, time))
