import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text, command }) => {
    let stiker = await sticker(null,
        global.API('caliphdev', `/api/brat${command.toLowerCase().includes('animate') ? '/animate' : ''}`, {
            text: text
        }),
        global.packname,
        global.author
    )
    conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
}

handler.help = ['brat <texto>', 'bratanimate <texto>']
handler.tags = ['sticker']
handler.command = /^brat(animate)?$/i
export default handler