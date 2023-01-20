import { sticker } from '../lib/sticker.js'
let handler = async(m, { conn }) => {
//if (!db.data.chats[m.chat].stickers && m.isGroup) throw `${ag}𝙇𝙊𝙎 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎 𝘿𝙀 𝙎𝙏𝙄𝘾𝙆𝙀𝙍𝙎 𝙀𝙎𝙏𝘼𝙉 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝙊𝙎 𝙐𝙎𝙀 *#on stickers* 𝙋𝘼𝙍𝘼 𝘼𝘾𝙏𝙄𝙑𝘼𝙍\n\n𝙏𝙃𝙀 𝙎𝙏𝙄𝘾𝙆𝙀𝙍𝙎 𝘾𝙊𝙈𝙈𝘼𝙉𝘿𝙎 𝘼𝙍𝙀 𝘿𝙄𝙎𝘼𝘽𝙇𝙀𝘿 𝙐𝙎𝙀 *#on stickers* 𝙏𝙊 𝙀𝙉𝘼𝘽𝙇𝙀`
if (!db.data.chats[m.chat].stickers && m.isGroup) throw 0
 
let nombre = '🐈 𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿'
let nombre2 = '𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨'
 
const s = [
'https://media0.giphy.com/media/65ODCwM00NVmEyLsX3/giphy.gif?cid=ecf05e47p9z5h8ozpdu8cjem55qy6hc6mtjb1tjlyr9usjsy&rid=giphy.gif&ct=g',
'https://media0.giphy.com/media/GpyS1lJXJYupG/giphy.gif?cid=ecf05e47qxzfl93t2e4q41fx6batypxo8sbhmqjjpc7t6lu2&rid=giphy.gif&ct=g',
'https://i.pinimg.com/736x/fd/4e/61/fd4e614a5c0fb835e7858473286f3058.jpg',
'https://media2.giphy.com/media/1LVd4P5P2Kpzi/giphy.gif?cid=ecf05e47nbn37e5sbo69h41lojwsdao7aoxnw2kmr07uwodi&rid=giphy.gif&ct=g',
'https://media1.giphy.com/media/12juneOf2Rc4ak/giphy.gif?cid=ecf05e47gprladmhgg8gqq5kewkd67c39hkboe6hp1z3tvnt&rid=giphy.gif&ct=g',
'http://pm1.narvii.com/7835/01726f9861b2f27c482de69e32537967613bb980r1-813-720v2_uhq.jpg',
'http://pm1.narvii.com/7659/830884bd84986014140803b3425793f6fa39eb34r1-488-418v2_uhq.jpg',
'https://img-10.stickers.cloud/packs/9a9e981d-45e4-4ee9-93ff-483012f02167/webp/33c6b62d-8447-4c7d-a07c-9c09a0272805.webp',
'https://c.tenor.com/SlyuVaDqEdMAAAAd/lizard-dancing-xd.gif',
'https://c.tenor.com/n_CQEVKGB1kAAAAC/dead-chat-xd-discord.gif',
'https://c.tenor.com/woUBgv2VLKoAAAAC/didnt-xd.gif',
'https://img.wattpad.com/2b0a1d3963768b68bf2a50af1206e0e3ed6e5d46/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f326b6174556d5a55542d777546413d3d2d38322e313634663337626661323934613934663433343634353630383138392e6a7067?s=fit&w=720&h=720',
'https://pbs.twimg.com/media/ExhbbMvWUAAjaTJ.jpg',
'https://i.pinimg.com/originals/51/ec/ca/51eccabf758cfa6ddf23a7d62b82fbcf.jpg',
'https://i0.wp.com/ytimg.googleusercontent.com/vi/MwM7FPazq6Q/maxresdefault.jpg?resize=650,400',
'https://i.gifer.com/99do.gif',
'https://i.gifer.com/G0ph.gif',
'https://i.gifer.com/VLgZ.gif',
'https://i.gifer.com/4q.gif' 
];  
 
let stiker = await sticker(null, s[Math.floor(Math.random() * s.length)], nombre, nombre2)
await delay(5 * 5000)
if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '',m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: wm, body: `h`, mediaType: 2, sourceUrl: nn, thumbnail: imagen1}}}, { quoted: m })
}
handler.customPrefix = /risa|xd|😂|🤣|🤪/i 
handler.command = new RegExp
handler.exp = 50
export default handler
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))