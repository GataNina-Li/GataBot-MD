import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text, command }) => {
    let stiker = await sticker(null,
        global.API('caliphdev', `/api/brat`, {
            text: text
        }),
        global.packname,
        global.author
    )
    if (stiker) return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
    throw stiker.toString()

}

handler.help = ['brat <texto>']
handler.tags = ['sticker']
handler.command = /^brat$/i
export default handler