import fs from 'fs'
let timeout = 30000
let poin = 600

let handler = async (m, { conn, usedPrefix }) => {
conn.tekateki = conn.tekateki ? conn.tekateki : {}
let id = m.chat
if (id in conn.tekateki) {
conn.reply(m.chat, 'Todavía hay adivinanza sin responder en este chat', conn.tekateki[id][0])
throw false
}
let tekateki = JSON.parse(fs.readFileSync(`./src/game/peliculas.json`))
let json = tekateki[Math.floor(Math.random() * tekateki.length)]
let _clue = json.response
let clue = _clue.replace(/[A-Za-z]/g, '_')
let caption = `*• ADIVINAN LA PELÍCULA CON EMOJIS •*\n\n*${json.question}*\n\n*• Tiempo:* ${(timeout / 1000).toFixed(2)} segundos\n*• Bono:* +${poin} Exp
`.trim()
conn.tekateki[id] = [ 
await conn.reply(m.chat, caption, m), json, poin, setTimeout(async () => {
if (conn.tekateki[id]) await conn.reply(m.chat, `Se acabó el tiempo!\n*Respuesta:* ${json.response}`, conn.tekateki[id][0])
delete conn.tekateki[id]
}, timeout)
]}
handler.help = ['peliculas']
handler.tags = ['game']
handler.command = /^(advpe|adv|peliculas|pelicula)$/i
export default handler
