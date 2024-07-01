import hispamemes from 'hispamemes'
let handler = async (m, { conn, usedPrefix, command }) => {
const meme = hispamemes.meme()
//conn.sendFile(m.chat, meme, 'error.jpg', `😂😂🤣`, m)
await conn.sendButton(m.chat, `*_🤣 ${command} 🤣_*`.trim(), wm, meme, [['𝙎𝙄𝙂𝙐𝙄𝙀𝙉𝙏𝙀 | 𝙉𝙀𝙓𝙏 🆕', `/${command}`]], null, null, m)
}
handler.command = ['meme2', 'memes2'] 
handler.level = 3
export default handler
