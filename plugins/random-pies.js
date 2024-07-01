import fetch from 'node-fetch'
let handler = async (m, { conn, command }) => {
if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${lenguajeGB['smsContAdult']()}`
let url = pies[Math.floor(Math.random() * pies.length)]
//conn.sendFile(m.chat, url, 'error.jpg', `🥵 ♥ PIES ♥  🥵`, m)
conn.sendButton(m.chat, `🥵 ♥ PIES ♥  🥵`, author, url, [['𝙎𝙄𝙂𝙐𝙄𝙀𝙉𝙏𝙀 | 𝙉𝙀𝙓𝙏 🆕', `/${command}`]], null, null, m)
}
handler.help = ['pies']
handler.tags = ['internet']
handler.command = /^(pies)$/
handler.exp = 50
handler.level = 5
export default handler


global.pies = [
"https://i.pinimg.com/originals/d9/e0/d4/d9e0d435743e9db03cf6b1b01627830f.jpg",
"https://i.pinimg.com/474x/ef/75/1e/ef751e617f97136f3da8d841e967449d.jpg",
"https://i.pinimg.com/564x/5d/b0/74/5db074236b157c385a0b8511218ed3e2.jpg",
"https://i.pinimg.com/originals/33/8e/f3/338ef392abc25df264805322c8f9f782.jpg",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU1nvWjV23QS1Sa2nH_mgk9dIZ8YnO7k-4xA&usqp=CAU",
"https://i.pinimg.com/236x/bc/52/4c/bc524c4fc826416bbea72c47081956cf.jpg",
"https://i.pinimg.com/originals/9f/87/06/9f8706e96df3d71dfae29d76b3b02cd0.jpg",
"https://i.pinimg.com/736x/50/9f/71/509f71c49048ef066072d4b71e9f6cdf.jpg",
"https://i.pinimg.com/474x/6c/25/64/6c25641c872ac79be7523a2451e38e97.jpg",
"https://i.pinimg.com/236x/04/0c/6a/040c6a8be34d7720a13a35660b38206e.jpg",
"https://d9i9nmwzijaw9.cloudfront.net/825/468/062/-339996984-1tfbdp6-75i10fd292aij0p/original/avatar.jpg",
]
