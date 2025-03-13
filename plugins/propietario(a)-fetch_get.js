import fetch from 'node-fetch'
import { format } from 'util'

let handler = async (m, { conn, text }) => {
if (m.fromMe) return
if (!/^https?:\/\//.test(text)) throw 'Ejemplo:\nhttps://skyultraplus.com'
m.react("💻")
let url = text
let res = await fetch(url)
if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) {
throw `Content-Length: ${res.headers.get('content-length')}`
}
    
if (!/text|json/.test(res.headers.get('content-type'))) return conn.sendFile(m.chat, url, 'file', text, m)
let txt = await res.buffer()
try {
txt = format(JSON.parse(txt + ''))
} catch (e) {
txt = txt + ''
} finally {
m.reply(txt.slice(0, 65536) + '')
}
}
handler.help = ['fetch'].map(v => v + ' *<url>*')
handler.tags = ['owner']
handler.command = /^(fetch|get)$/i
handler.limit = 1
handler.register = true

export default handler