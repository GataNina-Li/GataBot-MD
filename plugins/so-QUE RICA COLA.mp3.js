import util from 'util'
import path from 'path'

let handler = async (m, { conn }) => {
if (!db.data.chats[m.chat].audios && m.isGroup) throw 0
global.db.data.users[m.sender].money += 100 
global.db.data.users[m.sender].exp += 100
  
let vn = './media/QUE RICA COLA.mp3'
conn.sendFile(m.chat, vn, 'QUE RICA COLA.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /que rica cola|que colita|puta que rico|que rico|rico|🍑/i 
handler.command = new RegExp
export default handler
