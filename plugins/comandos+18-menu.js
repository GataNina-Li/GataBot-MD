import { xpRange } from '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, args, usedPrefix: _p, __dirname, isOwner, text, isAdmin, isROwner }) => {
if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${lenguajeGB['smsContAdult']()}`
try{
const { levelling } = '../lib/levelling.js'
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
//let name = await conn.getName(m.sender)
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)
let user = global.db.data.users[m.sender]
//user.registered = false
 
let pp = './src/+18.jpg'
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let fsizedoc = '1'.repeat(10)
let adReply = { fileLength: fsizedoc, seconds: fsizedoc, contextInfo: { forwardingScore: fsizedoc, externalAdReply: { showAdAttribution: true, title: wm, body: '👋 ' + username, mediaUrl: ig, description: 'Hola', previewType: 'PHOTO', thumbnail: await(await fetch(gataMenu.getRandom())).buffer(), sourceUrl: redesMenu.getRandom() }}}

const temaX = [['pornololi', 'nsfwloli'], ['pornopies', 'nsfwfoot'], ['pornoass', 'nsfwass'], ['pornobdsm', 'nsfwbdsm'], ['pornocum', 'nsfwcum'],
['pornoero', 'nsfwero'], ['pornodominar', 'nsfwfemdom'], ['pornoglass', 'nsfwglass'], ['pornohentai', 'nsfwhentai'], ['pornorgia', 'nsfworgy'], ['pornotetas', 'nsfwboobs'],
['pornobooty', 'nsfwbooty'], ['pornoecchi', 'nsfwecchi'], ['pornofurro', 'nsfwfurry'], ['pornotrapito', 'nsfwtrap'], ['pornolesbiana', 'nsfwlesbian'],
['pornobragas', 'nsfwpanties'], ['pornopene', 'nsfwpenis'], ['porno', 'porn'], ['pornorandom', 'pornrandom'], ['pornopechos', 'nsfwbreasts'],
['pornoyaoi', 'nsfwyaoi'], ['pornoyaoi2', 'nsfwyaoi2'], ['pornoyuri', 'nsfwyuri'], ['pornoyuri2', 'nsfwyuri2'], ['pornodarling', 'nsfwdarling'],
['pornodragonmaid', 'nsfwdragonmaid'], ['pornokonosuba', 'nsfwkonosuba'], ['pornopokemon', 'nsfwpokemon'], ['pornotoloveru', 'nsfwtoloveru'], ['pornouzaki', 'nsfwuzaki'],
['pornopack', 'nsfwpack'], ['pornopackchica', 'nsfwpackgirl'], ['pornopackchico', 'nsfwpackmen'], ['', ''], ['', ''], ['', ''], ['', ''], ['', ''], ['', ''], ['', '']]

let menuA = `😏 ${lenguajeGB['smsConfi2']()} *${username}*`.trim()
let menuB = `╭┄〔 *${wm}* 〕┄⊱
┊დ *${week}, ${date}*
┊დ *${lenguajeGB['smsBotonM4']()} » ${Object.keys(global.db.data.users).length}* 
┊
┊დ *${lenguajeGB['smsBotonM5']()} »* ${role}
┊დ *${lenguajeGB['smsBotonM6']()} » ${level}*
┊დ *${lenguajeGB['smsBotonM7']()} »* ${user.premiumTime > 0 ? '✅' : '❌'}
╰┄┄┄┄〔 *𓃠 ${vs}* 〕┄┄┄┄⊱

⠇ ${lenguajeGB['smsTex3']()} 🔞
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[0][0] : temaX[0][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[1][0] : temaX[1][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[2][0] : temaX[2][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[3][0] : temaX[3][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[4][0] : temaX[4][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[5][0] : temaX[5][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[6][0] : temaX[6][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[7][0] : temaX[7][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[8][0] : temaX[8][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[9][0] : temaX[9][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[10][0] : temaX[10][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[11][0] : temaX[11][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[12][0] : temaX[12][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[13][0] : temaX[13][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[14][0] : temaX[14][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[15][0] : temaX[15][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[16][0] : temaX[16][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[17][0] : temaX[17][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[18][0] : temaX[18][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[19][0] : temaX[19][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[20][0] : temaX[20][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[21][0] : temaX[21][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[22][0] : temaX[22][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[23][0] : temaX[23][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[24][0] : temaX[24][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[25][0] : temaX[25][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[26][0] : temaX[26][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[27][0] : temaX[27][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[28][0] : temaX[28][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[29][0] : temaX[29][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[30][0] : temaX[30][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[31][0] : temaX[31][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[32][0] : temaX[32][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[33][0] : temaX[33][1]}_

⠇ ${lenguajeGB['smsTex5']()} ❤️‍🔥
∘ _${usedPrefix}xnxxsearch | buscarxnxx *texto*_
∘ _${usedPrefix}xvideossearch *texto*_
∘ _${usedPrefix}xnxxdl | xnxx *enlace*_
∘ _${usedPrefix}xvideosdl | xvideos *enlace*_


⠇ ${lenguajeGB['smsTex6']()} 🔥
${lenguajeGB['smsTex7']()}

⠇ ${lenguajeGB['smsTex4']()} 🥵
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornohentai3' : 'nsfwhentai3'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoass2' : 'nsfwass2'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornosticker' : 'nsfwsticker'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornochica' : 'nsfwsgirl'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoass3' : 'nsfwass3'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornotetas2' : 'nsfwboobs2'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornotetas3' : 'nsfwboobs3'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornopussy' : 'nsfwpussy'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornopaizuri' : 'nsfwpaizuri'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoneko' : 'nsfwneko'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornopies2' : 'nsfwfoot2'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoyuri3' : 'nsfwyuri3'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornomuslo' : 'nsfwhthigh'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornochica2' : 'nsfwsgirl2'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoanal' : 'nsfwanal'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornomamada' : 'nsfwblowjob'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornogonewild' : 'nsfwgonewild'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornofurro2' : 'nsfwfurry2'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornotentacle' : 'nsfwtentacle'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'porno4k' : 'porn4k'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornokanna' : 'nsfwkanna'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoanal2' : 'nsfwanal2'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoalimento' : 'nsfwfood'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoholo' : 'nsfwholo'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoanal3' : 'nsfwanal3'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornomamada2' : 'nsfwblowjob2'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornocum2' : 'nsfwcum2'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornofuck' : 'nsfwfuck'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoneko2' : 'nsfwneko2'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornopussy2' : 'nsfwpussy2'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornosolo' : 'nsfwsolo'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornorgia2' : 'nsfworgy2'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornorgia3' : 'nsfworgy3'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoyaoi3' : 'nsfwyaoi3'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornocosplay' : 'nsfwcosplay'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornodbz' : 'nsfwdbz'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornogenshin' : 'nsfwgenshin'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornokimetsu' : 'nsfwkimetsu'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornohentai2' : 'nsfwhentai2'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornonintendo' : 'nsfwnintendo'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornohololive' : 'nsfwhololive'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoheroacademy' : 'nsfwheroacademy'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornorezero' : 'nsfwrezero'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornotatsumaki' : 'nsfwtatsumaki'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornonaruto' : 'nsfwnaruto'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornokitagawa' : 'nsfwkitagawa'}_

⠇ ${lenguajeGB['smsTex4']()} 🥵
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornovid' : 'nsfwvid'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornovid2' : 'nsfwvid2'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornovidlesbi' : 'nsfwvidlesbi'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornovidgay' : 'nsfwvidgay'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornovidbisexual' : 'nsfwvidbisexual'}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornovidrandom' : 'nsfwvidrandom'}_`.trim()

if (command == 'hornymenu') {
await conn.sendButton(m.chat, menuA, menuB, pp, [
[lenguajeGB.smsBotonM1(), '.menu'], [lenguajeGB.smsBotonM2(), '/allmenu'], [lenguajeGB.smsBotonM3(), '#inventario']], fkontak, adReply, m)}
 
if (command == 'listhorny') {
 
}
} catch (e) {
await conn.sendButton(m.chat, `\n${wm}`, lenguajeGB['smsMalError3']() + '#report ' + usedPrefix + command, null, [[lenguajeGB.smsMensError1(), `#reporte ${lenguajeGB['smsMensError2']()} *${usedPrefix + command}*`]], m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)	
}}

handler.help = ['infomenu'].map(v => v + 'able <option>')
handler.tags = ['group', 'owner']
handler.command = /^(hornymenu|listhorny)$/i
//handler.register = true
handler.exp = 50
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}
