let timeout = 60000
let poin = 500
let poin_lose = -100
let poin_bot = 200
let handler = async (m, { conn, usedPrefix, text }) => {
conn.suit = conn.suit ? conn.suit : {}
if (Object.values(conn.suit).find(room => room.id.startsWith('suit') && [room.p, room.p2].includes(m.sender))) throw '*[❗] 𝙏𝙚𝙧𝙢𝙞𝙣𝙖 𝙩𝙪 𝙥𝙖𝙧𝙩𝙞𝙙𝙖 𝙖𝙣𝙩𝙚𝙨 𝙙𝙚 𝙞𝙣𝙞𝙘𝙞𝙖𝙧 𝙤𝙩𝙧𝙖*'
let textquien = `*𝙖 𝙦𝙪𝙞𝙚𝙣 𝙦𝙪𝙞𝙚𝙧𝙚𝙨 𝙙𝙚𝙨𝙖𝙛𝙞𝙖𝙧? 𝙚𝙩𝙞𝙦𝙪𝙚𝙩𝙖 𝙖 𝙪𝙣𝙖 𝙥𝙚𝙧𝙨𝙤𝙣𝙖*\n\n*—◉ 𝙀𝙟𝙚𝙢𝙥𝙡𝙤:*\n${usedPrefix}ppt @tag`
if (!m.mentionedJid[0]) return m.reply(textquien, m.chat, { mentions: conn.parseMention(textquien)})
if (Object.values(conn.suit).find(room => room.id.startsWith('suit') && [room.p, room.p2].includes(m.mentionedJid[0]))) throw `*[❗] 𝙇𝙖 𝙥𝙚𝙧𝙨𝙤𝙣𝙖 𝙖 𝙡𝙖 𝙦𝙪𝙚 𝙦𝙪𝙞𝙚𝙧𝙚𝙨 𝙙𝙚𝙨𝙖𝙛𝙞𝙖𝙧 𝙖𝙪𝙣 𝙚𝙨𝙩𝙖 𝙟𝙪𝙜𝙖𝙣𝙙𝙤 𝙤𝙩𝙩𝙖 𝙥𝙖𝙧𝙩𝙞𝙙𝙖, 𝙚𝙨𝙥𝙚𝙧𝙖 𝙖 𝙦𝙪𝙚 𝙩𝙚𝙧𝙢𝙞𝙣𝙚 𝙙𝙚 𝙟𝙪𝙜𝙖𝙧`
let id = 'suit_' + new Date() * 1
let caption = `🎮 𝙂𝘼𝙈𝙀𝙎 𝙋𝙑𝙋 𝙂𝘼𝙈𝙀𝙎 🎮\n\n—◉ @${m.sender.split`@`[0]} 𝘿𝙚𝙨𝙖𝙛𝙞𝙖 𝙖 @${m.mentionedJid[0].split`@`[0]} 𝙖 𝙚𝙣 𝙪𝙣 𝙥𝙞𝙚𝙙𝙧𝙖, 𝙥𝙖𝙥𝙚𝙡 𝙤 𝙩𝙞𝙟𝙚𝙧𝙖 `.trim()
let footer = `◉ 𝙀𝙨𝙘𝙧𝙞𝙗𝙞  "aceptar" 𝙥𝙖𝙧𝙖 𝙖𝙘𝙚𝙧𝙩𝙖\n◉ 𝙀𝙨𝙘𝙧𝙞𝙗𝙞 "rechazar" 𝙥𝙖𝙧𝙖 𝙧𝙚𝙘𝙝𝙖𝙯𝙖𝙧`
let imgplaygame = `https://www.merca2.es/wp-content/uploads/2020/05/Piedra-papel-o-tijera-0003318_1584-825x259.jpeg`
conn.suit[id] = {
chat: await conn.sendButton(m.chat, caption, footer, imgplaygame, [[`Aceptar`], [`Rechazar`]], null, {mentions: conn.parseMention(caption)}),
id: id,
p: m.sender,
p2: m.mentionedJid[0],
status: 'wait',
waktu: setTimeout(() => {
if (conn.suit[id]) conn.reply(m.chat, `[ ⏳ ] 𝙏𝙞𝙚𝙢𝙥𝙤 𝙙𝙚 𝙚𝙨𝙥𝙚𝙧𝙖 𝙛𝙞𝙣𝙖𝙡𝙞𝙯𝙖𝙙𝙤, 𝙚𝙡 𝙥𝙫𝙥 𝙨𝙚 𝙘𝙖𝙣𝙘𝙚𝙡𝙤 𝙥𝙤𝙧 𝙛𝙖𝙡𝙩𝙖 𝙙𝙚 𝙧𝙚𝙨𝙥𝙪𝙚𝙨𝙩𝙖`, m)
delete conn.suit[id]
}, timeout), poin, poin_lose, poin_bot, timeout
}}
handler.help = ['ppt']
handler.tags = ['games']
handler.command = /^(ppt|pvp)$/i
handler.group = true
handler.game = true
export default handler
