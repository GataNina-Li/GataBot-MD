import { randomBytes } from 'crypto'

let handler = async (m, { conn, text }) => {
  let chats = Object.entries(conn.chats).filter(([_, chat]) => chat.isChats).map(v => v[0])
  let cc = conn.serializeM(text ? m : m.quoted ? await m.getQuotedObj() : false || m)
  let teks = text ? text : cc.text
  await delay(5 * 5000)
  conn.reply(m.chat, `*[❕] ᴍᴇɴsᴀᴊᴇ ᴇɴᴠɪᴀᴅᴏ ᴀ ${chats.length} ᴄʜᴀᴛs ᴛᴏᴛᴀʟᴇs`, m)
  for (let id of chats) await conn.copyNForward(id, conn.cMod(m.chat, cc, /bc|broadcast/i.test(teks) ? `*𝘾𝙊𝙈𝙐𝙉𝙄𝘾𝘼𝘿𝙊 𝙊𝙁𝙄𝘾𝙄𝘼𝙇 ✅*\n` + teks : `*𝘾𝙊𝙈𝙐𝙉𝙄𝘾𝘼𝘿𝙊 𝙊𝙁𝙄𝘾𝙄𝘼𝙇 ✅*\n` + teks + '\n' + readMore + '\n\n' + botdate), true).catch(_ => _)
  m.reply('se envio con exitos ✅️')
}
handler.help = ['prueba', 'bc'].map(v => v + ' <teks>')
handler.tags = ['owner']
handler.command = /^(prueba)$/i

handler.owner = true

export default handler
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

const randomID = length => randomBytes(Math.ceil(length * .5)).toString('hex').slice(0, length)
