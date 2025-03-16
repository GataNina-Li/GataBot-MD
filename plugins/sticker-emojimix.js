import { sticker } from '../lib/sticker.js'
let MessageType = (await import(global.baileys)).default
import fetch from 'node-fetch'
import fs from "fs"
let handler = async (m, { conn, text, args, usedPrefix, command }) => {
let user = global.db.data.users[m.sender]
let f = user.packname || global.packname
let g = (user.packname && user.author ? user.author : (user.packname && !user.author ? '' : global.author))
if (!args[0]) throw `𝘿𝙀𝘽𝙀 𝘿𝙀 𝙐𝙎𝘼𝙍 𝘿𝙊𝙎 𝙀𝙈𝙊𝙅𝙄𝙎 𝙔 𝙀𝙉 𝙈𝙀𝘿𝙄𝙊 𝙐𝙎𝘼𝙍 𝙀𝙇 *+*\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command}* 😺+😆\n\n𝙔𝙊𝙐 𝙈𝙐𝙎𝙏 𝙐𝙎𝙀 𝙏𝙒𝙊 𝙀𝙈𝙊𝙅𝙄𝙎 𝘼𝙉𝘿 𝙄𝙉 𝙏𝙃𝙀 𝙈𝙄𝘿𝘿𝙇𝙀 𝙐𝙎𝙀 𝙏𝙃𝙀 *+*\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command}* 😼+😁`
let [emoji1, emoji2] = text.split`+`
let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
for (let res of anu.results) {
let stiker = await sticker(false, res.url, f, g)
conn.sendFile(m.chat, stiker, null, { asSticker: true })
}}
handler.help = ['emojimix'].map(v => v + ' emot1|emot2>')
handler.tags = ['fun']
handler.command = /^(emojimix|emogimix|combinaremojis|crearemoji|emojismix|emogismix)$/i
export default handler
const fetchJson = (url, options) => new Promise(async (resolve, reject) => {
fetch(url, options)
.then(response => response.json())
.then(json => {
resolve(json)
})
.catch((err) => {
reject(err)
})})
