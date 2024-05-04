import fetch from 'node-fetch'
let handler = async (m, { conn, command }) => {
let res = await fetch('https://api.lolhuman.xyz/api/random/ppcouple?apikey=9b817532fadff8fc7cb86862')
if (res.status != 200) throw await res.text()
let json = await res.json()
if (!json.status) throw json
//conn.sendFile(m.chat, json.result.female, 'error.jpg', `𝘾𝙃𝙄𝘾𝘼 ✨`, m)
conn.sendButton(m.chat, '𝘾𝙃𝙄𝘾𝘼 ✨', wm, json.result.female, [['𝙎𝙄𝙂𝙐𝙄𝙀𝙉𝙏𝙀 | 𝙉𝙀𝙓𝙏 🆕', `/${command}`]], null, null, m)
//conn.sendFile(m.chat, json.result.male, 'error.jpg', `𝘾𝙃𝙄𝘾𝙊 ✨`, m)
conn.sendButton(m.chat, '𝘾𝙃𝙄𝘾𝙊 ✨', wm, json.result.male, [['𝙎𝙄𝙂𝙐𝙄𝙀𝙉𝙏𝙀 | 𝙉𝙀𝙓𝙏 🆕', `/${command}`]], null, null, m)
}
handler.help = ['ppcouple']
handler.tags = ['internet']
handler.command = /^(ppcp|ppcouple|compartirperfil|compartirfoto)$/i
export default handler
