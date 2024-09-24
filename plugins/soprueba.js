import util from 'util'
import path from 'path'
let handler = async (m, { conn }) => {
if (!db.data.chats[m.chat].audios && m.isGroup) throw 0
global.db.data.users[m.sender].money += 100 
global.db.data.users[m.sender].exp += 100

case "master1": case "master11":    
let vn = 'https://qu.ax/SCpi.mp3'
conn.sendPresenceUpdate('recording', m.chat)
conn.sendFile(m.chat, vn, 'a.mp3', null, m, true, { 
type: 'audioMessage', 
ptt: true 
})
}
break

}} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)}
}
handler.command = ['master1', 'master11', 'pornovid2', 'nsfwvid2', 'pornovidlesbi', 'nsfwvidlesbi', 'pornovidgay', 'nsfwvidgay', 'pornovidbisexual', 'nsfwvidbisexual', 'pornovidrandom', 'nsfwvidrandom']
handler.premium = false
handler.register = false
export default handler
