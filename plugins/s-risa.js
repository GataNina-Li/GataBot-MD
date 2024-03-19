import { sticker } from '../lib/sticker.js'
let handler = async(m, { conn }) => {
//if (!db.data.chats[m.chat].stickers && m.isGroup) throw `${ag}𝙇𝙊𝙎 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎 𝘿𝙀 𝙎𝙏𝙄𝘾𝙆𝙀𝙍𝙎 𝙀𝙎𝙏𝘼𝙉 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝙊𝙎 𝙐𝙎𝙀 *#on stickers* 𝙋𝘼𝙍𝘼 𝘼𝘾𝙏𝙄𝙑𝘼𝙍\n\n𝙏𝙃𝙀 𝙎𝙏𝙄𝘾𝙆𝙀𝙍𝙎 𝘾𝙊𝙈𝙈𝘼𝙉𝘿𝙎 𝘼𝙍𝙀 𝘿𝙄𝙎𝘼𝘽𝙇𝙀𝘿 𝙐𝙎𝙀 *#on stickers* 𝙏𝙊 𝙀𝙉𝘼𝘽𝙇𝙀`
if (db.data.chats[m.chat].stickers) {
 
let nombre = '🐈 𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿'
let nombre2 = '𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨'
 
let stiker = await sticker(null, s[Math.floor(Math.random() * s.length)], nombre, nombre2)
await delay(3 * 3000)
if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '',m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: gt, body: `😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽`, mediaType: 2, sourceUrl: accountsgb, thumbnail: gataImg }}}, { quoted: m })
}}
handler.customPrefix = /risa|xd|😂|🤣|🤪/i 
handler.command = new RegExp
handler.exp = 50
export default handler
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const s = [
'https://media0.giphy.com/media/65ODCwM00NVmEyLsX3/giphy.gif?cid=ecf05e47p9z5h8ozpdu8cjem55qy6hc6mtjb1tjlyr9usjsy&rid=giphy.gif&ct=g',
'content://media/external/downloads/1000593125',
'https://telegra.ph/file/fab0eefe87ef1cd1a3b62.png',
'https://telegra.ph/file/9c5b41124eb05ed7e8e0f.jpg',
'https://media1.https://telegra.ph/file/154258d8b98975946ebb7.png',
'http://pm1.narvii.com/7835/01726f9861b2f27c482de69e32537967613bb980r1-813-720v2_uhq.jpg',
'http://pm1.narvii.com/7659/830884bd84986014140803b3425793f6fa39eb34r1-488-418v2_uhq.jpg',
'https://telegra.ph/file/1102719d88d2a9138e2f3.png',
'https://c.tenor.com/SlyuVaDqEdMAAAAd/lizard-dancing-xd.gif',
'https://c.tenor.com/n_CQEVKGB1kAAAAC/dead-chat-xd-discord.gif',
'https://c.tenor.com/woUBgv2VLKoAAAAC/didnt-xd.gif',
'https://telegra.ph/file/6f437c4970a34e2b55ae5.png',
'https://pbs.twimg.com/media/ExhbbMvWUAAjaTJ.jpg',
'https://i.pinimg.com/originals/51/ec/ca/51eccabf758cfa6ddf23a7d62b82fbcf.jpg',
'https://i0.wp.com/ytimg.googleusercontent.com/vi/MwM7FPazq6Q/maxresdefault.jpg?resize=650,400',
'https://i.gifer.com/99do.gif',
'https://i.gifer.com/G0ph.gif',
'https://telegra.ph/file/f2bd6c6b1dcf9a2811617.jpg',
'https://i.gifer.com/4q.gif' 
];  
