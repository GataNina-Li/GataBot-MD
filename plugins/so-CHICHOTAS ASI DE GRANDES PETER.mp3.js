import util from 'util'
import path from 'path'

let handler = async (m, { conn }) => {
if (!db.data.chats[m.chat].audios && m.isGroup) throw 0
global.db.data.users[m.sender].money += 100 
global.db.data.users[m.sender].exp += 100
  
let vn = './media/CHICHOTAS ASI DE GRANDES PETER.mp3'
conn.sendFile(m.chat, vn, 'CHICHOTAS ASI DE GRANDES PETER.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /chichotas asi de grandes peter|chichota asi de grande peter|chichotas asi de grande peter/i 
handler.command = new RegExp
export default handler
