import util from 'util'
import path from 'path'

let handler = async (m, { conn }) => {
if (!db.data.chats[m.chat].audios && m.isGroup) throw 0
global.db.data.users[m.sender].money += 60
global.db.data.users[m.sender].exp += 70
  
let vn = './media/holi.mp3'
conn.sendFile(m.chat, vn, 'holi.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /holi/ 
handler.command = new RegExp
export default handler
