import fetch from 'node-fetch'
let handler = async (m, {command, conn}) => {
if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${lenguajeGB['smsContAdult']()}`
  
if (command == 'prueba5') {
let res = await fetch("https://nekobot.xyz/api/image?type=hentai") 
let json = await res.json()
let link = json.message
conn.sendButton(m.chat, `${json.message}`.trim(), author, link, [['🥵 𝙎𝙄𝙂𝙐𝙄𝙀𝙉𝙏𝙀 | 𝙉𝙀𝙓𝙏 🥵', `/${command}`]], m)}
}  
handler.command = ['prueba5']
export default  handler
