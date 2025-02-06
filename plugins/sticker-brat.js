import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text, command }) => {
    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
    let apiUrl = command === 'brat' ? global.API('caliphdev', '/api/brat', { text: encodeURIComponent(teks) }) : global.API('caliphdev', '/api/brat/animate', { text: encodeURIComponent(teks) })
    let stiker = await sticker(null, apiUrl, global.packname, global.author)
    if (stiker) return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
    throw stiker.toString()
}
handler.help = ['brat <teks>', 'brat animate <teks>']
handler.tags = ['sticker']
handler.command = /^brat( animate)?$/i
export default handler
