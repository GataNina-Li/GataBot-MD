import util from 'util'
import path from 'path'
let handler = async (m, { conn }) => {
if (!db.data.chats[m.chat].audios && m.isGroup) throw 0
global.db.data.users[m.sender].money += 100 
global.db.data.users[m.sender].exp += 100


 if (command == 'muma') {
   let vn = 'https://qu.ax/SCpi.mp3'
   conn.sendPresenceUpdate('recording', m.chat)
   conn.sendFile(m.chat, vn, 'a.mp3', null, m, true, {
  type: 'audioMessage', 
ptt: true 
})
}
    if (command == 'pinguita') {
   let vn = 'https://qu.ax/xynz.mp3'
   conn.sendPresenceUpdate('recording', m.chat)
   conn.sendFile(m.chat, vn, 'a.mp3', null, m, true, {
  type: 'audioMessage', 
ptt: true 
})

    
  

    } catch {
    conn.reply(m.chat, `${fg}𝘼𝙇𝙂𝙊 𝙎𝘼𝙇𝙄𝙊 𝙈𝘼𝙇 𝙑𝙐𝙀𝙇𝘼𝙑𝘼 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙍\n\n𝙎𝙊𝙈𝙀𝙏𝙃𝙄𝙉𝙂 𝙒𝙀𝙉𝙏 𝙒𝙍𝙊𝙉𝙂 𝙏𝙍𝙔 𝘼𝙂𝘼𝙄𝙉`, fkontak, m)    
    }}
handler.customPrefix = /muma|lala/
    handler.command = /^lala|muma/i
    export default handler
