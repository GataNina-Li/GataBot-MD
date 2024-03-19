import { xpRange } from '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
let handler = async (m, { conn, usedPrefix, command, args, usedPrefix: _p, __dirname, isOwner, text, isAdmin, isROwner }) => {
  
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
let { money, joincount } = global.db.data.users[m.sender]
//let { limit } = global.db.data.users[m.sender]
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
  
//let name = await conn.getName(m.sender)
let user = global.db.data.users[m.sender]
let toUser = `${m.sender.split("@")[0]}`
let aa = toUser + '@s.whatsapp.net'
let pp = gataImg
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)

let tex = `╭━━〔 *${wm}* 〕━━⬣
┃ ✪ *NOMBRE* 
┃ *${username}*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ ✪ *EXPERIENCIA | EXP* 
┃ ➥ *${user.exp - min}/${xp}*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ ✪ *NIVEL | LEVEL*
┃ ➥ *${level}*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ ✪ *ROL*
┃ ➥ ${role}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ ✪ *GATACOINS*
┃ ➥ *${money}*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ ✪ *TOKENS*
┃ ➥ *${joincount}*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ ✪ *DIAMANTES* 
┃ ➥ *${limit}*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ ✪ *FECHA*
┃ ➥ *${week}, ${date}*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ ✪ *USUARIOS | USERS*
┃ ➥ *${Object.keys(global.db.data.users).length}* 
╰━━━━━━〔 *𓃠 ${vs}* 〕━━━━━━⬣`
await conn.sendFile(m.chat, pp, 'gata.jpg', tex, fkontak, { mentions: [aa,] })
/*await conn.sendButton(m.chat, tex, wm, [['𝙀𝙭𝙥𝙚𝙧𝙞𝙚𝙣𝙘𝙞𝙖 𝙥𝙤𝙧 𝘿𝙞𝙖𝙢𝙖𝙣𝙩𝙚 ⚡', '.buy'],
['𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨 𝙥𝙤𝙧 𝘿𝙞𝙖𝙢𝙖𝙣𝙩𝙚 🐈', '/buy2'],
['𝙏𝙤𝙥𝙨 | 𝙍𝙖𝙣𝙠𝙞𝙣𝙜 🏆', '#top']], m)  */
}

handler.help = ['infomenu'].map(v => v + 'able <option>')
handler.tags = ['group', 'owner']
handler.command = /^(xp|experiencia|esperiencia|esperiensia|experiensia|exp|coinsgata|coins)$/i
handler.exp = 10
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}
