import axios from "axios"
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `${mg}${mid.smsAcorta}`
    try {
        let json = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(text)}`)
        if (!json.data) throw json
        let hasil = `${mid.smsAcorta2(text)}\n*${json.data}*`.trim()
        m.reply(hasil)
    } catch (e) {
        await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
        console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
        console.log(e)
    }
}
handler.help = ['tinyurl', 'acortar'].map(v => v + ' <link>')
handler.tags = ['tools']
handler.command = /^(tinyurl|short|acortar|corto)$/i
handler.fail = null
export default handler
