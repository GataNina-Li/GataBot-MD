import util from 'util'
import path from 'path'

let handler = async (m, { conn }) => {
if (!db.data.chats[m.chat].audios && m.isGroup) throw 0
global.db.data.users[m.sender].money += 10
global.db.data.users[m.sender].exp += 10
  
let vn = './media/omaiga.mp3'
conn.sendFile(m.chat, vn, 'omaiga.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /OMAIGA|OMG|omg|omaiga|Omg|Omaiga|OMAIGA/ 
handler.command = new RegExp
export default handler
