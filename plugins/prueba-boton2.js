import { googleImage } from '@bochilteam/scraper'
const handler = async (m, {conn, text, usedPrefix, command}) => {
if (!text) return conn.reply(m.chat, '_ingresa el texto de lo que quieres buscar\n\n`ejemplo`\n' + `> ❒ *${usedPrefix + command}* bad bunny`, m )
const res = await googleImage(text)
const image = await res.getRandom()
const link = image
await conn.sendButton(m.chat,'Resultados de:', [[`${text}`]], null, [['resp.1', `${usedPrefix}🌠 ${text}`], ['resp.2', `${usedPrefix}🌠 ${text}`], ['resp.3', `${usedPrefix}🌠 ${text}`]], m)
}
handler.help = ['ɪᴍᴀɢᴇɴ']
handler.tags = ['search']
handler.command = /^(prueba96)$/i
export default handler
