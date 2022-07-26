import util from 'util'
import path from 'path'

let handler = async (m, { conn }) => {
if (!db.data.chats[m.chat].audios && m.isGroup) throw 0
<<<<<<<< HEAD:plugins/nv-hueleasex_mp3.js
let vn = './media/huele a sexo Dross.mp3'
conn.sendFile(m.chat, vn, 'huele a sexo Dross.mp3', null, m, true, {
========
global.db.data.users[m.sender].money += 100 
global.db.data.users[m.sender].exp += 100
  
let vn = './media/maau1.mp3'
conn.sendFile(m.chat, vn, 'maau1.mp3', null, m, true, {
>>>>>>>> 855c27f7d8e5f25c9299dd0d98852020f087fc17:plugins/so-horadesex_mp3.js
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /🔥|sexo|Sexo|huele a sexo/
handler.command = new RegExp
export default handler

