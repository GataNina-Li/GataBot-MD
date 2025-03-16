import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text, command }) => {
let user = global.db.data.users[m.sender]
let f = user.packname || global.packname
let g = (user.packname && user.author ? user.author : (user.packname && !user.author ? '' : global.author))
let stiker = await sticker(null, global.API('caliphdev', `/api/brat`, { text: text }), f, g)
if (stiker) return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
throw stiker.toString()
}
handler.help = ['brat <texto>']
handler.tags = ['sticker']
handler.command = /^brat$/i
export default handler