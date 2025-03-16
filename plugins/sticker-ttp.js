import { sticker } from '../lib/sticker.js'
let handler = async (m, { conn, text }) => {
let user = global.db.data.users[m.sender]
let f = user.packname || global.packname
let g = (user.packname && user.author ? user.author : (user.packname && !user.author ? '' : global.author))
let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
let stiker = await sticker(null, global.API('xteam', '/ttp', { file: '', text: teks }), f, g)
if (stiker) return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
throw stiker.toString()
}
handler.help = ['ttp <teks>']
handler.tags = ['sticker']
handler.command = /^ttp6$/i 
export default handler
