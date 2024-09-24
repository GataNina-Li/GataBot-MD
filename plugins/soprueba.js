import util from 'util'
import path from 'path'
let handler = async (m, { conn }) => {
if (!db.data.chats[m.chat].audios && m.isGroup) throw 0
global.db.data.users[m.sender].money += 100 
global.db.data.users[m.sender].exp += 100

if (/^A Bueno master|Bueno master|Bueno Máster|🫂$/i.test(m.text) && chat.audios){
if (!db.data.chats[m.chat].audios && m.isGroup) throw 0 
let vn = 'https://qu.ax/SCpi.mp3'
conn.sendPresenceUpdate('recording', m.chat)
conn.sendFile(m.chat, vn, 'a.mp3', null, m, true, { 
type: 'audioMessage', 
ptt: true 
})
}

return !0 }
export default handler
/*handler.customPrefix = /muma|master1|A/
handler.command = /^(muma|master1|A?$)/
export default handler*/
