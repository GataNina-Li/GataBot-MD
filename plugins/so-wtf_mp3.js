import util from 'util'
import path from 'path'

let handler = async (m, { conn }) => {
if (!db.data.chats[m.chat].audios && m.isGroup) throw 0
global.db.data.users[m.sender].money += 60
global.db.data.users[m.sender].exp += 70
  
let vn = './media/wtf.mp3'
conn.sendFile(m.chat, vn, 'wtf.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /WTF|wtf|Wtf|wataf|watafac|watafack/ 
handler.command = new RegExp
export default handler
