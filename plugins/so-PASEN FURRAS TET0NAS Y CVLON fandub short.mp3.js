import util from 'util'
import path from 'path'

let handler = async (m, { conn }) => {
if (!db.data.chats[m.chat].audios && m.isGroup) throw 0
global.db.data.users[m.sender].money += 100 
global.db.data.users[m.sender].exp += 100
  
let vn = './media/PASEN FURRAS TET0NAS Y CVLON fandub short.mp3'
conn.sendFile(m.chat, vn, 'PASEN FURRAS TET0NAS Y CVLON fandub short.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true 
})
}
handler.customPrefix = /pasen furras|pasen furras tetonas y culonas|pasen furras culonas y tetonas/i 
handler.command = new RegExp
export default handler
