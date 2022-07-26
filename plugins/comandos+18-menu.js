import { xpRange } from '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
let handler = async (m, { conn, usedPrefix, command, args, usedPrefix: _p, __dirname, isOwner, text, isAdmin, isROwner }) => {
if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${ag}𝙇𝙊𝙎 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎 +18 𝙀𝙎𝙏𝘼𝙉 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝙊𝙎 𝙐𝙎𝙀 #𝙤𝙣 𝙢𝙤𝙙𝙤𝙝𝙤𝙧𝙣𝙮 𝙋𝘼𝙍𝘼 𝘼𝘾𝙏𝙄𝙑𝘼𝙍\n\n+18 𝘾𝙊𝙈𝙈𝘼𝙉𝘿𝙎 𝘼𝙍𝙀 𝘿𝙄𝙎𝘼𝘽𝙇𝙀𝘿 𝙐𝙎𝙀 #𝙤𝙣 𝙢𝙤𝙙𝙤𝙝𝙤𝙧𝙣𝙮 𝙏𝙊 𝙀𝙉𝘼𝘽𝙇𝙀`

const { levelling } = '../lib/levelling.js'
//let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text }) => {

let { exp, limit, level, role } = global.db.data.users[m.sender]
let { min, xp, max } = xpRange(level, global.multiplier)

let d = new Date(new Date + 3600000)
let locale = 'es'
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
day: 'numeric',
month: 'long',
year: 'numeric'
})
let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
day: 'numeric',
month: 'long',
year: 'numeric'
}).format(d)
let time = d.toLocaleTimeString(locale, {
hour: 'numeric',
minute: 'numeric',
second: 'numeric'
})
let _uptime = process.uptime() * 1000
let _muptime
if (process.send) {
process.send('uptime')
_muptime = await new Promise(resolve => {
process.once('message', resolve)
setTimeout(resolve, 1000)
}) * 1000
}
let { money } = global.db.data.users[m.sender]
let muptime = clockString(_muptime)
let uptime = clockString(_uptime)
let totalreg = Object.keys(global.db.data.users).length
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
let replace = {
'%': '%',
p: _p, uptime, muptime,
me: conn.getName(conn.user.jid),

exp: exp - min,
maxexp: xp,
totalexp: exp,
xp4levelup: max - exp,

level, limit, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
readmore: readMore
}
text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
  

/*const sections = [
{
title: `𝙇𝙄𝙎𝙏𝘼 𝘿𝙀𝙎𝙋𝙇𝙀𝙂𝘼𝘽𝙇𝙀 | 𝘿𝙍𝙊𝙋-𝘿𝙊𝙒𝙉 𝙇𝙄𝙎𝙏`,
rows: [
{title: "❇️ 𝙈𝙚𝙣𝙪 𝙋𝙧𝙞𝙣𝙘𝙞𝙥𝙖𝙡 |  𝘿𝙖𝙨𝙝𝙗𝙤𝙖𝙧𝙙 ❇️", description: null, rowId: `${usedPrefix}menu`},
{title: "✳️ 𝙈𝙚𝙣𝙪 𝘾𝙤𝙢𝙥𝙡𝙚𝙩𝙤 | 𝙁𝙪𝙡𝙡 𝙈𝙚𝙣𝙪 ✳️", description: null, rowId: `${usedPrefix}allmenu`},
{title: "✅ 𝘾𝙪𝙚𝙣𝙩𝙖𝙨 𝙊𝙛𝙞𝙘𝙞𝙖𝙡𝙚𝙨 | 𝘼𝙘𝙘𝙤𝙪𝙣𝙩𝙨 ✅", description: null, rowId: `${usedPrefix}cuentasgatabot`},
{title: "🔍 𝘽𝙪𝙨𝙘𝙖𝙧 𝘼𝙣𝙞𝙢𝙚 | 𝙎𝙚𝙖𝙧𝙘𝙝 𝘼𝙣𝙞𝙢𝙚 🔍", description: "𝙋𝙊𝘿𝙍𝘼𝙎 𝘽𝙐𝙎𝘾𝘼𝙍 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊𝙉 𝘿𝙀 𝘼𝙉𝙄𝙈𝙀𝙎\n𝙔𝙊𝙐 𝘾𝘼𝙉 𝙎𝙀𝘼𝙍𝘾𝙃 𝘼𝙉𝙄𝙈𝙀 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉", rowId: `${usedPrefix}animeinfo`},
{title: "🔍 𝘽𝙪𝙨𝙦𝙪𝙚𝙙𝙖 𝙚𝙣 𝙂𝙤𝙤𝙜𝙡𝙚 | 𝙂𝙤𝙤𝙜𝙡𝙚 𝙎𝙚𝙖𝙧𝙘𝙝 🔍", description: "𝘽𝙐𝙎𝘾𝘼 𝙈𝘼𝙎 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊𝙉 𝙋𝙊𝙍 𝙂𝙊𝙊𝙂𝙇𝙀\n𝙎𝙀𝘼𝙍𝘾𝙃 𝙁𝙊𝙍 𝙈𝙊𝙍𝙀 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 𝘽𝙔 𝙂𝙊𝙊𝙂𝙇𝙀", rowId: `${usedPrefix}google`},
{title: "🔍 𝘽𝙪𝙨𝙘𝙖𝙧 𝙇𝙚𝙩𝙧𝙖𝙨 | 𝙎𝙚𝙖𝙧𝙘𝙝 𝙇𝙚𝙩𝙩𝙚𝙧𝙨 🔍", description: "𝙊𝘽𝙏𝙀𝙉 𝙇𝘼𝙎 𝙇𝙀𝙏𝙍𝘼 𝘿𝙀 𝙇𝘼𝙎 𝘾𝘼𝙉𝘾𝙄𝙊𝙉𝙀𝙎\n𝙂𝙀𝙏 𝙏𝙃𝙀 𝙇𝙔𝙍𝙄𝘾𝙎 𝙊𝙁 𝙏𝙃𝙀 𝙎𝙊𝙉𝙂𝙎", rowId: `${usedPrefix}letra`},   
{title: "🔍 𝘽𝙪𝙨𝙘𝙖 𝙥𝙤𝙧 𝙔𝙤𝙪𝙏𝙪𝙗𝙚 | 𝙎𝙚𝙖𝙧𝙘𝙝 𝙤𝙣 𝙔𝙤𝙪𝙏𝙪𝙗𝙚 🔍", description: "𝘽𝙐𝙎𝘾𝘼 𝙀𝙉𝙇𝘼𝘾𝙀𝙎 𝘿𝙀 𝙑𝙄𝘿𝙀𝙊𝙎 𝙊 𝘾𝘼𝙉𝘼𝙇𝙀𝙎\n𝙎𝙀𝘼𝙍𝘾𝙃 𝙁𝙊𝙍 𝙑𝙄𝘿𝙀𝙊 𝙇𝙄𝙉𝙆𝙎 𝙊𝙍 𝘾𝙃𝘼𝙉𝙉𝙀𝙇𝙎", rowId: `${usedPrefix}ytsearch`},    
{title: "🔍 𝘽𝙪𝙨𝙘𝙖𝙧 𝙥𝙤𝙧 𝙒𝙞𝙠𝙞𝙥𝙚𝙙𝙞𝙖 | 𝙎𝙚𝙖𝙧𝙘𝙝 𝙗𝙮 𝙒𝙞𝙠𝙞𝙥𝙚𝙙𝙞𝙖 🔍", description: "𝙀𝙉𝘾𝙐𝙀𝙉𝙏𝙍𝘼 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊𝙉 𝙀𝙉 𝙒𝙄𝙆𝙄𝙋𝙀𝘿𝙄𝘼\n𝙁𝙄𝙉𝘿 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉 𝙊𝙉 𝙒𝙄𝙆𝙄𝙋𝙀𝘿𝙄𝘼", rowId: `${usedPrefix}wiki`},      
]}, ]*/
//let name = await conn.getName(m.sender)
let pp = './src/futabuclub.jpg'
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)
//let user = global.db.data.users[m.sender]
//user.registered = false

let menu = `
💗 *¡HOLA | HI!* ${username}
╭━━〔 *${wm}* 〕━━⬣
┃😏😏😏😏😏😏😏😏😏
┃✪ *EXPERIENCIA | EXP ➺ ${exp}*
┃✪ *NIVEL | LEVEL ➺ ${level}*
┃✪ *ROL ➺* ${role}
┃✪ *GATACOINS ➺ $ ${money}*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃✪ *FECHA ➺ ${week}, ${date}*
┃✪ *USUARIOS | USERS ➺ ${Object.keys(global.db.data.users).length}* 
┃😏😏😏😏😏😏😏😏😏
╰━━━━━━〔 𓃠 *${vs}* 〕━━━━━━⬣

╭━━━━〔 𝙈𝙀𝙉𝙐 *+18* 〕━━━━⬣
┃🔞➺ _${usedPrefix}booty_
┃🔞➺ _${usedPrefix}boyonfutanari | PRONTO!_
┃🔞➺ _${usedPrefix}girlonfutanari | PRONTO!_
┃🔞➺ _${usedPrefix}hentai_
┃🔞➺ _${usedPrefix}pechos_
┃🔞➺ _${usedPrefix}randomxxx_
┃🔞➺ _${usedPrefix}trapito_
┃🔞➺ _${usedPrefix}tetas_ 
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ 🥵 𝘾𝙊𝙉𝙏𝙀𝙉𝙄𝘿𝙊 𝘿𝙄𝙉𝘼𝙈𝙄𝘾𝙊 🥵
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃»🥵 _${usedPrefix}futanari|futa|futasolo|futanarisolo|futanarisolo_
┃»🥵 _${usedPrefix}videosfutanari | PRONTO!_
┃»🥵 _${usedPrefix}videosfutanari2 | PRONTO!_
┃»🥵 _${usedPrefix}videosfutanari3 | PRONTO!_
┃»🥵 _${usedPrefix}videosfutanari4 | PRONTO!_
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ ❤️‍🔥 𝘽𝙐𝙎𝘾𝘼 𝙔 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼 ❤️‍🔥
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃❤️‍🔥➺ _${usedPrefix}xnxxsearch | buscarxnxx *texto*_
┃❤️‍🔥➺ _${usedPrefix}xvideossearch *texto*_
┃❤️‍🔥➺ _${usedPrefix}xnxxdl | xnxx *enlace*_
┃❤️‍🔥➺ _${usedPrefix}xvideosdl | xvideos *enlace*_
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ 🔥 𝘾𝙊𝙉𝙏𝙀𝙉𝙄𝘿𝙊 𝙋𝙇𝙐𝙎 🔥
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *Usar bajo su responsabilidad* 
┃ *Vídeos +18 aleatorios*
┃ *Puede tardar en enviar*
┃ *Contenido de Calidad*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃»🔥 _${usedPrefix}futanaripremium | PRONTO!_
╰━━━━━━━━━━━━━━━━━━━⬣`.trim()
conn.sendHydrated(m.chat, menu, wm, pp, 'https://github.com/ColapsusHD/FutabuBot-MD', '𝙵𝚞𝚝𝚊𝚋𝚞𝙱𝚘𝚝-𝙼𝙳', null, null, [
['𝙈𝙚𝙣𝙪́ 𝙘𝙤𝙢𝙥𝙡𝙚𝙩𝙤 | 𝙁𝙪𝙡𝙡 𝙈𝙚𝙣𝙪 💫', '.allmenu'],
['𝙈𝙚𝙣𝙪 𝙙𝙚𝙨𝙥𝙡𝙚𝙜𝙖𝙗𝙡𝙚 | 𝙈𝙚𝙣𝙪 𝙇𝙞𝙨𝙩 🌟', '/menulista'],
['𝙈𝙚𝙣𝙪 𝙋𝙧𝙞𝙣𝙘𝙞𝙥𝙖𝙡 | 𝙈𝙖𝙞𝙣 𝙢𝙚𝙣𝙪 ⚡', '#menu']
], m,)
}

handler.help = ['infomenu'].map(v => v + 'able <option>')
handler.tags = ['group', 'owner']
handler.command = /^(hornymenu)$/i
//handler.register = true
handler.exp = 70
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}
