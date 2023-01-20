
import fetch from 'node-fetch'
let handler = async(m, { conn, args, text }) => {
if (!text) throw `{mg} 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝙋𝘼𝙍𝘼 𝘼𝘾𝙊𝙍𝙏𝘼𝙍\n\n𝙀𝙉𝙏𝙀𝙍 𝘼 𝙇𝙄𝙉𝙆 𝙏𝙊 𝙎𝙃𝙊𝙍𝙏𝙀𝙉*`
let shortUrl1 = await (await fetch(`https://tinyurl.com/api-create.php?url=${args[0]}`)).text()  
if (!shortUrl1) throw `*[❗] 𝙀𝙍𝙍𝙊𝙍, 𝘾𝙊𝙈𝙋𝙍𝙐𝙀𝘽𝙀 𝙌𝙐𝙀 𝙀𝙇 𝙏𝙀𝙓𝙏𝙊 𝙄𝙉𝙂𝙍𝙀𝙎𝘼𝘿𝙊 𝙎𝙀𝘼 𝙐𝙉 𝙏𝙀𝙓𝙏𝙊 𝙀 𝙄𝙉𝙏𝙀𝙉𝙏𝙀 𝘿𝙀 𝙉𝙐𝙀𝙑𝙊*`
let done = `*✅ 𝙎𝙀 𝙍𝙀𝘼𝙇𝙄𝙕𝙊 𝘾𝙊𝙉 𝙀𝙓𝙄𝙏𝙊\n𝙄𝙏 𝙒𝘼𝙎 𝙎𝙐𝘾𝘾𝙀𝙎𝙎𝙁𝙐𝙇!*\n\n*n𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝘼𝙉𝙏𝙀𝙎 | 𝘽𝙀𝙁𝙊𝙍𝙀 𝙇𝙄𝙉𝙆:*\n${text}\n*n𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝘼𝙃𝙊𝙍𝘼 | 𝙇𝙄𝙉𝙆 𝙉𝙊𝙒:*\n${shortUrl1}`.trim()   
m.reply(done)}
handler.help = ['tinyurl','acortar'].map(v => v + ' <link>')
handler.tags = ['tools']
handler.command = /^(tinyurl|short|acortar|corto)$/i
handler.limit = 1
handler.register = true
handler.fail = null
export default handler
