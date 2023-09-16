import fs from 'fs'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
const { levelling } = '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text, command }) => {
try {
let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
let { exp, limit, level, role } = global.db.data.users[m.sender]
let { min, xp, max } = xpRange(level, global.multiplier)
let name = await conn.getName(m.sender)
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
let user = global.db.data.users[m.sender]
let muptime = clockString(_muptime)
let uptime = clockString(_uptime)
let totalreg = Object.keys(global.db.data.users).length
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
let replace = {
'%': '%',
p: _p, uptime, muptime,
me: conn.getName(conn.user.jid),
npmname: _package.name,
npmdesc: _package.description,
version: _package.version,
exp: exp - min,
maxexp: xp,
totalexp: exp,
xp4levelup: max - exp,
github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
readmore: readMore
}
text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)
let pp = gataVidMenu.getRandom()
let pareja = global.db.data.users[m.sender].pasangan 
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

let menu = `
    
*╭━[ MENU DE ALCA BOT 🛠️ ]━⬣*
*╭━━━[ AJUSTES - CHATS ]━━━⬣*
🔵 _${usedPrefix}on *:* off *bienvenida*_
🔵 _${usedPrefix}on *:* off *avisos*_
🔵 _${usedPrefix}on *:* off *autonivel*_
🔵 _${usedPrefix}on *:* off *stickers*_
🔵 _${usedPrefix}on *:* off *autosticker*_
🔵 _${usedPrefix}on *:* off *reaction*_
🔵 _${usedPrefix}on *:* off *audios*_
 
*╭━[ 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙎 𝘼𝙇𝘾𝘼𝘽𝙊𝙏 🌀 ]━⬣*
🟢➺ _${usedPrefix}play *texto*_
*╭━[ 𝙎 𝙏 𝙄 𝘾 𝙆 𝙀 𝙍 𝙎👋]━⬣*
⚫️➺ _${usedPrefix}tts es *texto*_
⚫️➺ _${usedPrefix}sticker | s *imagen*_
⚫️➺ _${usedPrefix}sticker | s *url de tipo jpg*_

*╭━[ 𝘾𝙊𝙉𝙁𝙄𝙂𝙐𝙍𝘼𝘾𝙄𝙊𝙉 - 𝙂𝙍𝙐𝙋𝙊𝙎🧤 ]━⬣*
🟢➺ _${usedPrefix}add *numero*_
🟢➺ _${usedPrefix}sacar | ban | kick_
🟢➺ _${usedPrefix}grupo *abrir : cerrar*_
🟢➺ _${usedPrefix}group *open : close*_
🟢➺ _${usedPrefix}daradmin*@tag*_
🟢➺ _${usedPrefix}quitar *@tag*_
🟢➺ _${usedPrefix}banchat_
🟢➺ _${usedPrefix}unbanchat_
🟢➺ _${usedPrefix}banuser *@tag*_
🟢➺ _${usedPrefix}admins *texto*_
🟢➺ _${usedPrefix}invocar *texto*_
🟢➺ _${usedPrefix}infogrupo_
🟢➺ _${usedPrefix}newdesc *texto*_
🟢➺ _${usedPrefix}bienvenida *texto*_
🟢➺ _${usedPrefix}despedida *texto*_
🟢➺ _${usedPrefix}on_
🟢➺ _${usedPrefix}off_

*╭━[+ FUNCIONES 🧤 ]━⬣*
🔴➺ _${usedPrefix}registrar_
🔴➺ _${usedPrefix}perfil_
🔴➺ _${usedPrefix}myns_
🔴➺ _${usedPrefix}unreg *numero de serie*_
*⚡️ ALCA VENTAS 528241050228 ⚡️*`.trim()
await conn.sendFile(m.chat, gataVidMenu.getRandom(), 'gata.mp4', menu, fkontak)
	
} catch (e) {
await m.reply(lenguajeGB['smsMalError3']() + '\n*' + lenguajeGB.smsMensError1() + '*\n*' + usedPrefix + `${lenguajeGB.lenguaje() == 'es' ? 'reporte' : 'report'}` + '* ' + `${lenguajeGB.smsMensError2()} ` + usedPrefix + command)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)}}

handler.command = /^(menu|menú|memu|memú|help|info|comandos|2help|menu1.2|ayuda|commands|commandos|menucompleto|allmenu|allm|m|\?)$/i
//handler.register = true
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}