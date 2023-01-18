let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw `*[❗] 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙏𝙀𝙓𝙏𝙊 𝙋𝘼𝙍𝘼 𝘾𝙍𝙀𝘼𝙍 𝙐𝙉𝘼 𝙄𝙈𝘼𝙂𝙀𝙉 𝙔 𝘼𝙎𝙄 𝙐𝙎𝘼𝙍 𝙇𝘼 𝙁𝙐𝙉𝘾𝙄𝙊𝙉 𝘿𝙀 𝘿𝘼𝙇𝙇-𝙀*\n\n*❏ 𝙀𝙅𝙀𝙈𝙋𝙇𝙊 𝘿𝙀 𝙋𝙀𝙏𝙄𝘾𝙄𝙊𝙉𝙀𝙎*\n*❏ ${usedPrefix + command} gatitos llorando*\n*❏ ${usedPrefix + command} gata besos*`
try {
m.reply('*[❗] 𝙀𝙎𝙋𝙀𝙍𝙀 𝙐𝙉 𝙈𝙊𝙈𝙀𝙉𝙏𝙊 𝙀𝙉 𝙇𝙊 𝙌𝙐𝙀 𝙈𝘼𝙉𝘿𝙊 𝙇𝙊 𝙌𝙐𝙀 𝙈𝙀 𝙋𝙄𝘿𝙄𝙊*')
let tiores = await conn.getFile(`https://api.lolhuman.xyz/api/dall-e?apikey=${lolkeysapi}&text=${text}`)
await conn.sendFile(m.chat, tiores.data, null, null, m)
} catch {
throw `*[❗] 𝙀𝙍𝙍𝙊𝙍, 𝙑𝙐𝙀𝙇𝙑𝘼 𝘼 𝙄𝙉𝙏𝙀𝙉𝙏𝘼*`
}
}
handler.command = ['dall-e', 'dalle', 'ia2', 'cimg', 'openai2']
handler.level = 1
export default handler
