import fetch from 'node-fetch'
let handler = async (m, { text, usedPrefix, command }) => {
if (!text) throw `[❗] 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉𝘼 𝙋𝙀𝙏𝙄𝘾𝙄𝙊𝙉 𝙊 𝙐𝙉𝘼 𝙊𝙍𝘿𝙀𝙉 𝙋𝘼𝙍𝘼 𝙐𝙎𝘼𝙍 𝙇𝘼 𝙁𝙐𝙉𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝘾𝙃𝘼𝙏𝙂𝙋𝙏\n\n❏ 𝙀𝙅𝙀𝙈𝙋𝙇𝙊 𝘿𝙀 𝙋𝙀𝙏𝙄𝘾𝙄𝙊𝙉𝙀𝙎 𝙔 𝙊𝙍𝘿𝙀𝙉𝙀𝙎\n❏ ${usedPrefix + command} Reflexion sobre la serie Merlina 2022 de netflix\n❏ ${usedPrefix + command} Codigo en JS para un juego de cartas`
try {
m.reply('*[❗] 𝙀𝙎𝙋𝙀𝙍𝙀 𝙐𝙉 𝙈𝙊𝙈𝙀𝙉𝙏𝙊𝙎 𝙀𝙉 𝙇𝙊 𝙌𝙐𝙀 𝙈𝘼𝙉𝘿𝙊 𝙇𝙊𝙎 𝙌𝙐𝙀 𝙈𝙀 𝙋𝙄𝘿𝙄𝙊*')
let tiores = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=${lolkeysapi}&text=${text}&user=user-unique-id`)
let hasil = await tiores.json()
m.reply(`${hasil.result}`.trim())
} catch {
throw `*[❗] 𝙀𝙍𝙍𝙊𝙍, 𝙑𝙐𝙀𝙇𝙑𝘼 𝘼𝙇 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙍𝙇𝙊*`
}}
handler.command = ['openai', 'chatgpt', 'ia', 'robot']
export default handler
