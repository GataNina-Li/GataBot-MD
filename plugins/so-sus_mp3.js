import util from 'util'
import path from 'path'

let handler = async (m, { conn }) => {
if (!db.data.chats[m.chat].audios && m.isGroup) throw 0
global.db.data.users[m.sender].money += 10 
global.db.data.users[m.sender].exp += 10
  
let vn = './media/sus.mp3'
conn.sendFile(m.chat, vn, 'sus.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /among us|Among us|Among/i 
handler.command = new RegExp
export default handler
