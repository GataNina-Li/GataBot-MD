import fetch from "node-fetch"
import { sticker } from '../lib/sticker.js'
let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw ` 𝐼𝑁𝐺𝑅𝐸𝑆𝐸 𝑈𝑁𝐴 𝑈𝑅𝐿 𝐷𝐸 𝑆𝑇𝐼𝐶𝐾𝐸𝑅𝑆  𝑇𝐸𝐿𝐸𝐺𝑅𝐴𝑀._\n\n_📌 𝐸𝐽𝐸𝑀𝑃𝐿𝑂:_ ${usedPrefix + command} https://t.me/addstickers/Porcientoreal`
    if (!args[0].match(/(https:\/\/t.me\/addstickers\/)/gi)) throw `⚠️ _𝐿𝐴 𝑈𝑅𝐿 𝐸𝑆 𝐼𝑁𝐶𝑂𝑅𝑅𝐸𝐶𝑇𝐴_`
    let packName = args[0].replace("https://t.me/addstickers/", "")
    let gas = await fetch(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(packName)}`, { method: "GET", headers: { "User-Agent": "GoogleBot" } })
    if (!gas.ok) throw eror
    let json = await gas.json()
    m.reply(`*Stickers Totales:* ${json.result.stickers.length}
*Estimado completo:* ${json.result.stickers.length * 1.5} Segundos`.trim())
    for (let i = 0; i < json.result.stickers.length; i++) {
        let fileId = json.result.stickers[i].thumb.file_id
        let gasIn = await fetch(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${fileId}`)
        let jisin = await gasIn.json()
        let stiker = await sticker(false, "https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/" + jisin.result.file_path, global.packname, global.author)
        if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '',m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: wm, body: `h`, mediaType: 2, sourceUrl: nna, thumbnail: imagen1}}}, { quoted: m })
        await delay(5000)
    }
    throw `*𝙇𝙄𝙎𝙏𝙊𝙊𝙊𝙊𝙊 ✅️*`
}
handler.help = ['stikertele *<url>*']
handler.tags = ['sticker', 'downloader']
handler.command = /^(stic?kertele(gram)?)$/i

handler.limit = 1
handler.register = true
export default handler

const delay = time => new Promise(res => setTimeout(res, time))