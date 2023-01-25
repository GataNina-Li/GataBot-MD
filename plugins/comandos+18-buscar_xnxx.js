//Creditos https://github.com/BrunoSobrino
import axios from 'axios'
import fs from 'fs'
let handler = async (m, { text, conn, args, command, usedPrefix }) => {
if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${lenguajeGB['smsAvisoAG']()}𝙇𝙊𝙎 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎 +18 𝙀𝙎𝙏𝘼𝙉 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝙊𝙎 𝙐𝙎𝙀 #𝙤𝙣 𝙢𝙤𝙙𝙤𝙝𝙤𝙧𝙣𝙮 𝙋𝘼𝙍𝘼 𝘼𝘾𝙏𝙄𝙑𝘼𝙍\n\n+18 𝘾𝙊𝙈𝙈𝘼𝙉𝘿𝙎 𝘼𝙍𝙀 𝘿𝙄𝙎𝘼𝘽𝙇𝙀𝘿 𝙐𝙎𝙀 #𝙤𝙣 𝙢𝙤𝙙𝙤𝙝𝙤𝙧𝙣𝙮 𝙏𝙊 𝙀𝙉𝘼𝘽𝙇𝙀*`
await delay(5000)
if (!text) throw `*𝙌𝙪𝙚 𝙗𝙪𝙨𝙘𝙖? \n𝙐𝙨𝙚𝙧 𝙚𝙡 𝙘𝙤𝙢𝙖𝙣𝙙𝙤 𝙙𝙚 𝙚𝙨𝙩𝙖 𝙢𝙖𝙣𝙚𝙧𝙖\n𝙀𝙟𝙚𝙢𝙥𝙡𝙤\n${usedPrefix + command} Con mi prima*`
try {
let res = await axios.get(`https://zenzapis.xyz/searching/xnxx?apikey=${keysxxx}&query=${text}`)
let json = res.data
let listSerch = []
let teskd = `𝑪𝒐𝒏𝒕𝒆𝒏𝒊𝒅𝒐 𝒓𝒆𝒍𝒂𝒄𝒊𝒐𝒏𝒂𝒅𝒐: ${args.join(" ")}`
const sections = [{
title: `ⓡⓔⓢⓤⓛⓣⓐⓓⓞⓢ`,
rows: listSerch }]
const listMessage = {
text: teskd,
footer: '𝑬𝒍𝒊𝒋𝒂 𝒚 𝒑𝒓𝒆𝒔𝒊𝒐𝒏𝒆 𝒆𝒏𝒗𝒊𝒂𝒓',
title: " ➤ 𝑪𝒐𝒏𝒕𝒆𝒏𝒊𝒅𝒐 𝒆𝒏𝒄𝒐𝒏𝒕𝒓𝒂𝒅𝒐",
buttonText: "➤ 𝑹𝒆𝒔𝒖𝒍𝒕𝒂𝒅𝒐𝒔",
sections}
for (let i of json.result) {
listSerch.push({title: i.title, description: '⇧ 𝑺𝒆𝒍𝒆𝒄𝒄𝒊𝒐𝒏𝒆 𝒂𝒒𝒖𝒊 𝑷𝒂𝒓𝒂 𝒑𝒐𝒅𝒆𝒓 𝒅𝒆𝒔𝒄𝒂𝒓𝒈𝒂𝒓 𝒆𝒍 𝒗𝒊́𝒅𝒆𝒐 ⇧', rowId: `${usedPrefix}xnxxdl ${i.url}`})} 
conn.sendMessage(m.chat, listMessage, { quoted: m })
} catch (e) {
m.reply('*𝑼𝒇𝒇, 𝒔𝒆 𝒎𝒆 𝒄𝒂𝒚𝒐́ 𝒆𝒍 𝒔𝒆𝒓𝒗𝒊𝒅𝒐🤡, 𝒗𝒖𝒆𝒍𝒗𝒂 𝒂𝒍 𝒊𝒏𝒕𝒆𝒏𝒕𝒂𝒓 𝒑𝒂𝒋𝒆𝒓𝒐*')
}}
handler.command = /^porhubsearch|xvideossearch|xnxxsearch$/i
//handler.level = 9
handler.limit = 6
handler.register = true
export default handler
const delay = time => new Promise(res => setTimeout(res, time))

