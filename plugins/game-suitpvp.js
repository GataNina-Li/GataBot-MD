let timeout = 60000
let poin = 500
let poin_lose = -100
let poin_bot = 200
let handler = async (m, { conn, usedPrefix, text }) => {
conn.suit = conn.suit ? conn.suit : {}
if (Object.values(conn.suit).find(room => room.id.startsWith('suit') && [room.p, room.p2].includes(m.sender))) throw '*[❗] Termina tu partida antes de iniciar otra*'
let textquien = `*a quien quieres desafiar? etiqueta a una persona*\n\n*—◉ Ejemplo:*\n${usedPrefix}ppt @${global.suittag}`
if (!m.mentionedJid[0]) return m.reply(textquien, m.chat, { mentions: conn.parseMention(textquien)})
if (Object.values(conn.suit).find(room => room.id.startsWith('suit') && [room.p, room.p2].includes(m.mentionedJid[0]))) throw `*[❗] La persona a la que quieres desafiar aun esta jugando otta partida, espera a que termine de jugar`
let id = 'suit_' + new Date() * 1
let caption = `🎮 Games - PVP - Games 🎮\n\n—◉ @${m.sender.split`@`[0]} Desafia a @${m.mentionedJid[0].split`@`[0]} a en un pvp de piedra, papel o tijera`.trim()
let footer = `◉ Escribí  "aceptar" para acerta\n◉ Escribe "rechazar" para rechazar`
let imgplaygame = `https://www.merca2.es/wp-content/uploads/2020/05/Piedra-papel-o-tijera-0003318_1584-825x259.jpeg`
conn.suit[id] = {
chat: await conn.sendButton(m.chat, caption, footer, imgplaygame, [[`Aceptar`], [`Rechazar`]], null, {mentions: conn.parseMention(caption)}),
id: id,
p: m.sender,
p2: m.mentionedJid[0],
status: 'wait',
waktu: setTimeout(() => {
if (conn.suit[id]) conn.reply(m.chat, `[ ⏳ ] Tiempo de espera finalizado, el pvp se cancelo por falta de respuesta`, m)
delete conn.suit[id]
}, timeout), poin, poin_lose, poin_bot, timeout
}}
handler.help = ['ppt']
handler.tags = ['games']
handler.command = /^(ppt|pvp)$/i
handler.group = true
handler.game = true
export default handler
