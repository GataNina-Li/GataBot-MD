import { sticker } from '../lib/sticker.js'
let handler = async(m, { conn }) => {
//if (!db.data.chats[m.chat].stickers && m.isGroup) throw `${ag}𝙇𝙊𝙎 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎 𝘿𝙀 𝙎𝙏𝙄𝘾𝙆𝙀𝙍𝙎 𝙀𝙎𝙏𝘼𝙉 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝙊𝙎 𝙐𝙎𝙀 *#on stickers* 𝙋𝘼𝙍𝘼 𝘼𝘾𝙏𝙄𝙑𝘼𝙍\n\n𝙏𝙃𝙀 𝙎𝙏𝙄𝘾𝙆𝙀𝙍𝙎 𝘾𝙊𝙈𝙈𝘼𝙉𝘿𝙎 𝘼𝙍𝙀 𝘿𝙄𝙎𝘼𝘽𝙇𝙀𝘿 𝙐𝙎𝙀 *#on stickers* 𝙏𝙊 𝙀𝙉𝘼𝘽𝙇𝙀`
if (!db.data.chats[m.chat].stickers && m.isGroup) throw 0
 
let nombre = '🐈 𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿'
let nombre2 = '𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨'
 
const s = [
'https://media1.giphy.com/media/3fmRTfVIKMRiM/giphy.gif?cid=ecf05e47pyhfy4u8g5l7ij4rw7g0t3p46n7316kciee0ozt7&rid=giphy.gif&ct=g',
'https://media1.giphy.com/media/OPU6wzx8JrHna/giphy.gif?cid=ecf05e47jownk0m3q4bbrmiarbcjyzrvfcldw6fq2cl9qgeo&rid=giphy.gif&ct=g',
'https://media3.giphy.com/media/UYzNgRSTf9X1e/giphy.gif?cid=ecf05e47eyl7fbdshc46l04t6n9vhq8tlb7v68z5grx9sk4h&rid=giphy.gif&ct=g',
'https://media4.giphy.com/media/4bBLOhnMb0vHG/giphy.gif?cid=ecf05e47ccuhintdj5piel7ar1kpijylv7yl7jety6zwb0n4&rid=giphy.gif&ct=g',
'https://media0.giphy.com/media/KDRv3QggAjyo/giphy.gif?cid=ecf05e47u0k1a48j85ewtw30exm64hd7yfcsol47x4x5h1kq&rid=giphy.gif&ct=g',
'https://media3.giphy.com/media/xUPGcq0kyXkLQBvAIM/giphy.gif?cid=ecf05e47gscyh1yvbrh4zudbdaeqx5wmxmwal01nd4sqypgv&rid=giphy.gif&ct=g',
'https://c.tenor.com/iZukxR3qFRQAAAAi/gato-pls-pls-cat.gif'
];  
 
let stiker = await sticker(null, s[Math.floor(Math.random() * s.length)], nombre, nombre2)
conn.sendFile(m.chat, stiker, null, { asSticker: true })
 
 }
handler.customPrefix = /llorar|yorar|llorando|llorando|llorare|llorará|lloremos|llorastes|lloraste|llora|lloró|lloro|yoro|😭|😢|😰|😿/i 
handler.command = new RegExp
handler.exp = 50
export default handler
