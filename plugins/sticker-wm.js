import { addExif } from '../lib/sticker.js'
let handler = async (m, { conn, text }) => {
if (!m.quoted) throw '*[❗𝙄𝙣𝙛𝙤❗] 𝙍𝙚𝙨𝙥𝙤𝙣𝙙𝙚 𝙖𝙡 𝙨𝙩𝙞𝙘𝙠𝙚𝙧 𝙦𝙪𝙚 𝙙𝙚𝙨𝙚𝙖 𝙖𝙜𝙧𝙚𝙜𝙖 𝙪𝙣 𝙥𝙖𝙦𝙪𝙚𝙩𝙚 𝙮 𝙪𝙣 𝙣𝙤𝙢𝙗𝙧𝙚*'
let stiker = false
try {
let [packname, ...author] = text.split('|')
author = (author || []).join('|')
let mime = m.quoted.mimetype || ''
if (!/webp/.test(mime)) throw '*[❗𝙄𝙣𝙛𝙤❗] 𝙍𝙚𝙨𝙥𝙤𝙣𝙙𝙚 𝙖𝙡 𝙨𝙩𝙞𝙘𝙠𝙚𝙧 𝙦𝙪𝙚 𝙙𝙚𝙨𝙚𝙖 𝙖𝙜𝙧𝙚𝙜𝙖 𝙪𝙣 𝙥𝙖𝙦𝙪𝙚𝙩𝙚 𝙮 𝙪𝙣 𝙣𝙤𝙢𝙗𝙧𝙚*'
let img = await m.quoted.download()
if (!img) throw '*[❗𝙄𝙣𝙛𝙤❗] 𝙍𝙚𝙨𝙥𝙤𝙣𝙙𝙚 𝙖𝙡 𝙨𝙩𝙞𝙘𝙠𝙚𝙧 𝙦𝙪𝙚 𝙙𝙚𝙨𝙚𝙖 𝙖𝙜𝙧𝙚𝙜𝙖 𝙪𝙣 𝙥𝙖𝙦𝙪𝙚𝙩𝙚 𝙮 𝙪𝙣 𝙣𝙤𝙢𝙗𝙧𝙚*'
stiker = await addExif(img, packname || '', author || '')
} catch (e) {
console.error(e)
if (Buffer.isBuffer(e)) stiker = e
} finally {
if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '',m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: wm, body: `h`, mediaType: 2, sourceUrl: nn, thumbnail: imagen1}}}, { quoted: m })
else throw '❗𝑬𝒓𝒓𝒐𝒓, 𝒂𝒍𝒈𝒐 𝒔𝒂𝒍𝒊𝒐 𝒎𝒂𝒍, 𝒗𝒖𝒆𝒍𝒗𝒂 𝒂𝒍 𝒊𝒏𝒕𝒆𝒏𝒕𝒂 𝒅𝒆𝒍 𝒏𝒖𝒆𝒗𝒐𝒔*'
}}
handler.help = ['wm <packname>|<author>']
handler.tags = ['sticker']
handler.command = /^robar|wm$/i
export default handler