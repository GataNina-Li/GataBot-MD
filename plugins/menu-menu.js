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
//let fsizedoc = '1'.repeat(10)
//let adReply = { fileLength: fsizedoc, seconds: fsizedoc, contextInfo: { forwardingScore: fsizedoc, externalAdReply: { showAdAttribution: true, title: wm, body: '👋 ' + username, mediaUrl: ig, description: 'Hola', previewType: 'PHOTO', thumbnail: await(await fetch(gataMenu.getRandom())).buffer(), sourceUrl: redesMenu.getRandom() }}}
const numberToEmoji = { "0": "0️⃣", "1": "1️⃣", "2": "2️⃣", "3": "3️⃣", "4": "4️⃣", "5": "5️⃣", "6": "6️⃣", "7": "7️⃣", "8": "8️⃣", "9": "9️⃣", }
let lvl = level
let emoji = Array.from(lvl.toString()).map((digit) => numberToEmoji[digit] || "❓").join("")

let menu = `${lenguajeGB['smsConfi2']()} *${user.genero === 0 ? '👤' : user.genero == 'Ocultado 🕶️' ? `🕶️` : user.genero == 'Mujer 🚺' ? `🚺` : user.genero == 'Hombre 🚹' ? `🚹` : '👤'} ${user.registered === true ? user.name : username}*${(conn.user.jid == global.conn.user.jid ? '' : `\n*SOY SUB BOT DE: https://wa.me/${global.conn.user.jid.split`@`[0]}*`) || ''}

\`\`\`${week}, ${date}\`\`\`
⎔ *${lenguajeGB['smsTotalUsers']()}* ➺ _${Object.keys(global.db.data.users).length}_ 
⎔ *Registrados »* ${rtotalreg}/${totalreg}
⎔ *${lenguajeGB['smsTime']()}* ➺ _${time}_    
⎔ *${lenguajeGB['smsUptime']()}* ➺ _${uptime}_ 
⎔ *${lenguajeGB['smsVersion']()}* ➺ _${vs}_
⎔ *${lenguajeGB['smsMode']()} ➺* _${global.opts['self'] ? `${lenguajeGB['smsModePrivate']().charAt(0).toUpperCase() + lenguajeGB['smsModePrivate']().slice(1).toLowerCase()}` : `${lenguajeGB['smsModePublic']().charAt(0).toUpperCase() + lenguajeGB['smsModePublic']().slice(1).toLowerCase()}`}_
⎔ *${lenguajeGB['smsBanChats']()}* ➺ _${Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned).length}_ 
⎔ *${lenguajeGB['smsBanUsers']()}* ➺ _${Object.entries(global.db.data.users).filter(user => user[1].banned).length}_

✨ *◜INFORMACIÓN DEL USUARIO◞* ✨
*❗️AJUSTES - CHATS❗️*
┃ *Configura si eres Propietario(a) y/o*
┃ *Admin!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃⚙️ _${usedPrefix}on *:* off *bienvenida | welcome*_
┃⚙️ _${usedPrefix}on *:* off *avisos | detect*_
┃⚙️ _${usedPrefix}on *:* off *autonivel | autolevelup*_
┃⚙️ _${usedPrefix}on *:* off *restringir | restrict*_
┃⚙️ _${usedPrefix}on *:* off *antillamar | anticall*_
┃⚙️ _${usedPrefix}on *:* off *publico | public*_
┃⚙️ _${usedPrefix}on *:* off *autovisto | autoread*_
┃⚙️ _${usedPrefix}on *:* off *temporal*_
┃⚙️ _${usedPrefix}on *:* off *stickers*_
┃⚙️ _${usedPrefix}on *:* off *autosticker*_
┃⚙️ _${usedPrefix}on *:* off *reacciones | reaction*_
┃⚙️ _${usedPrefix}on *:* off *audios*_
┃⚙️ _${usedPrefix}on *:* off *modocaliente | modohorny*_
┃⚙️ _${usedPrefix}on *:* off *antitoxicos | antitoxic*_
┃⚙️ _${usedPrefix}on *:* off *antiver | antiviewonce*_
┃⚙️ _${usedPrefix}on *:* off *antieliminar | antidelete*_
┃⚙️ _${usedPrefix}on *:* off *antinternacional | antifake*_
┃⚙️ _${usedPrefix}on *:* off *antienlace | antilink*_
┃⚙️ _${usedPrefix}on *:* off *antienlace2 | antilink2*_
┃⚙️ _${usedPrefix}on *:* off *antitiktok | antitk*_
┃⚙️ _${usedPrefix}on *:* off *antiyoutube | antiyt*_
┃⚙️ _${usedPrefix}on *:* off *antitelegram | antitel*_
┃⚙️ _${usedPrefix}on *:* off *antifacebook | antifb*_
┃⚙️ _${usedPrefix}on *:* off *antinstagram | antig*_
┃⚙️ _${usedPrefix}on *:* off *antitwitter | antitw*_
┃⚙️ _${usedPrefix}on *:* off *soloprivados | pconly*_
┃⚙️ _${usedPrefix}on *:* off *sologrupos | gconly*_
*╰━━━━━━━━━━━━⬣*

*❗️DESCARGAS | DOWNLOADS❗️*
┃🧤➺ _${usedPrefix}imagen | image *texto*_
┃🧤➺ _${usedPrefix}play | play2 *texto o link*_
┃🧤➺ _${usedPrefix}play.1 *texto o link*_

*❗️CONFIGURACIÓN - GRUPOS❗️ *
┃🌐➺ _${usedPrefix}add *numero*_
┃🌐➺ _${usedPrefix}sacar | ban | kick  *@tag*_
┃🌐➺ _${usedPrefix}grupo *abrir : cerrar*_
┃🌐➺ _${usedPrefix}group *open : close*_
┃🌐➺ _${usedPrefix}daradmin | promote *@tag*_
┃🌐➺ _${usedPrefix}quitar | demote *@tag*_
┃🌐➺ _${usedPrefix}banchat_
┃🌐➺ _${usedPrefix}unbanchat_
┃🌐➺ _${usedPrefix}banuser *@tag*_
┃🌐➺ _${usedPrefix}unbanuser *@tag*_
┃🌐➺ _${usedPrefix}admins *texto*_
┃🌐➺ _${usedPrefix}invocar *texto*_
┃🌐➺ _${usedPrefix}tagall *texto*_
┃🌐➺ _${usedPrefix}hidetag *texto*_
┃🌐➺ _${usedPrefix}infogrupo | infogroup_
┃🌐➺ _${usedPrefix}enlace | link_
┃🌐➺ _${usedPrefix}newnombre | nuevonombre *texto*_
┃🌐➺ _${usedPrefix}newdesc | descripcion *texto*_
┃🌐➺ _${usedPrefix}setwelcome | bienvenida *texto*_
┃🌐➺ _${usedPrefix}setbye | despedida *texto*_

*❗️FUNCIÓN RPG❗️*
┃⚗️➺ _${usedPrefix}verificar | registrar_
┃⚗️➺ _${usedPrefix}perfil | profile_
┃⚗️➺ _${usedPrefix}myns_
┃⚗️➺ _${usedPrefix}unreg *numero de serie*_

*❗️STICKERS❗️*
┃ *Realiza stickers o crea*
┃🧤 _${usedPrefix}sticker | s *imagen o video*_

*❗️ MENU PARA PROPIETARIO/A❗️*
┃ *Comandos solo para Propietario/a!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃💎 _${usedPrefix}join *enlace*_
┃💎 _${usedPrefix}unete *enlace*_
┃💎➺ _${usedPrefix}darxp *cantidad*_
┃💎➺ _${usedPrefix}idioma | language_
┃💎➺ _${usedPrefix}cajafuerte_
┃💎➺ _${usedPrefix}comunicar | broadcastall | bc *texto*_
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
