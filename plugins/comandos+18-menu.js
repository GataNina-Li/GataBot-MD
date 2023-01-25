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
['pornopack', 'nsfwpack'], ['pornopackchica', 'nsfwpackgirl'], ['pornopackchico', 'nsfwpackmen'], ['pornohentai3', 'nsfwhentai3'], ['pornoass2', 'nsfwass2'],
['pornosticker', 'nsfwsticker'], ['pornochica', 'nsfwsgirl'], ['pornoass3', 'nsfwass3'], ['pornotetas2', 'nsfwboobs2'], ['pornotetas3', 'nsfwboobs3'],
['pornopussy', 'nsfwpussy'], ['pornopaizuri', 'nsfwpaizuri'], ['pornoneko', 'nsfwneko'], ['pornopies2', 'nsfwfoot2'], ['pornoyuri3', 'nsfwyuri3'],
['pornomuslo', 'nsfwhthigh'], ['pornochica2', 'nsfwsgirl2'], ['pornoanal', 'nsfwanal'], ['pornomamada', 'nsfwblowjob'], ['pornogonewild', 'nsfwgonewild'],
['pornofurro2', 'nsfwfurry2'], ['pornotentacle', 'nsfwtentacle'], ['porno4k', 'porn4k'], ['pornokanna', 'nsfwkanna'], ['pornoanal2', 'nsfwanal2'],
['pornoalimento', 'nsfwfood'], ['pornoholo', 'nsfwholo'], ['pornoanal3', 'nsfwanal3'], ['pornomamada2', 'nsfwblowjob2'], ['pornocum2', 'nsfwcum2'],
['pornofuck', 'nsfwfuck'], ['pornoneko2', 'nsfwneko2'], ['pornopussy2', 'nsfwpussy2'], ['pornosolo', 'nsfwsolo'], ['pornorgia2', 'nsfworgy2'],
['pornorgia3', 'nsfworgy3'], ['pornoyaoi3', 'nsfwyaoi3'], ['pornocosplay', 'nsfwcosplay'], ['pornodbz', 'nsfwdbz'], ['pornogenshin', 'nsfwgenshin'],
['pornokimetsu', 'nsfwkimetsu'], ['pornohentai2', 'nsfwhentai2'], ['pornonintendo', 'nsfwnintendo'], ['pornohololive', 'nsfwhololive'], ['pornoheroacademy', 'nsfwheroacademy'],
['pornorezero', 'nsfwrezero'], ['pornotatsumaki', 'nsfwtatsumaki'], ['pornonaruto', 'nsfwnaruto'], ['pornokitagawa', 'nsfwkitagawa'], ['pornovid', 'nsfwvid'],
['pornovid2', 'nsfwvid2'], ['pornovidlesbi', 'nsfwvidlesbi'], ['pornovidgay', 'nsfwvidgay'], ['pornovidbisexual', 'nsfwvidbisexual'], ['pornovidrandom', 'nsfwvidrandom']]

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
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[34][0] : temaX[34][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[35][0] : temaX[35][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[36][0] : temaX[36][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[37][0] : temaX[37][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[38][0] : temaX[38][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[39][0] : temaX[39][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[40][0] : temaX[40][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[41][0] : temaX[41][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[42][0] : temaX[42][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[43][0] : temaX[43][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[44][0] : temaX[44][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[45][0] : temaX[45][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[46][0] : temaX[46][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[47][0] : temaX[47][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[48][0] : temaX[48][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[49][0] : temaX[49][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[50][0] : temaX[50][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[51][0] : temaX[51][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[52][0] : temaX[52][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[53][0] : temaX[53][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[54][0] : temaX[54][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[55][0] : temaX[55][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[56][0] : temaX[56][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[57][0] : temaX[57][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[58][0] : temaX[58][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[59][0] : temaX[59][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[60][0] : temaX[60][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[61][0] : temaX[61][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[62][0] : temaX[62][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[63][0] : temaX[63][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[64][0] : temaX[64][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[65][0] : temaX[65][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[66][0] : temaX[66][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[67][0] : temaX[67][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[68][0] : temaX[68][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[69][0] : temaX[69][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[70][0] : temaX[70][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[71][0] : temaX[71][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[72][0] : temaX[72][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[73][0] : temaX[73][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[74][0] : temaX[74][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[75][0] : temaX[75][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[76][0] : temaX[76][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[77][0] : temaX[77][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[78][0] : temaX[78][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[79][0] : temaX[79][1]}_

⠇ ${lenguajeGB['smsTex4']()} 🥵
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[80][0] : temaX[80][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[81][0] : temaX[81][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[82][0] : temaX[82][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[83][0] : temaX[83][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[84][0] : temaX[84][1]}_
∘ _${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? temaX[85][0] : temaX[85][1]}_`.trim()

if (command == 'hornymenu') {
await conn.sendButton(m.chat, menuA, menuB, pp, [
[lenguajeGB.smsBotonM1(), usedPrefix + 'menu'], [lenguajeGB.smsBotonM2(), usedPrefix + 'allmenu'], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], fkontak, adReply, m)}
 
if (command == 'listaporno' || command == 'listhorny') {
let sections = Object.keys(temaX).map((v, index, temaX2) => ({ title: `${lenguajeGB['smsTex4']().slice(1, -1)} : ${wm}`,
rows: [{ 
title: `${1 + index <= 33 ? '🥵' : user.premiumTime > 0 ? '🎟️🥵' : '⚠️'} ${lenguajeGB.lenguaje() == 'es' ? temaX[index][0].toUpperCase() : temaX[index][1].toUpperCase()} ${1 + index <= 33 ? '🥵' : user.premiumTime > 0 ? '🥵🎟️' : '⚠️'} • ${lenguajeGB['smsBotonM7']()} ➜ ${user.premiumTime > 0 ? '✅' : '❌'}`, 
description: `${1 + index}. ${lenguajeGB.lenguaje() == 'es' ? temaX[index][0] : temaX[index][1]} ➜ ${1 + index <= 33 ? user.limit < 2 ? lenguajeGB.smsList1() + lenguajeGB.eDiamante() + lenguajeGB.smsList2() + rpgshopp.emoticon('limit') : lenguajeGB.smsList3() : lenguajeGB.smsList4() + rpg.emoticon('premium')}`, 
rowId: `${usedPrefix}${1 + index <= 33 ? user.limit < 2 ? 'buy limit 5' : lenguajeGB.lenguaje() == 'es' ? temaX[index][0] : temaX[index][1] : user.premiumTime > 0 ? lenguajeGB.lenguaje() == 'es' ? temaX[index][0] : temaX[index][1] : 'pase premium' }` }], }))

let name = await conn.getName(m.sender)
const listMessage = {
text: `${user.premiumTime > 0 ? lenguajeGB.smsCont18PornP() : lenguajeGB.smsCont18Porn()}`,
footer: `╭━━━✦ 🛐 ✦━━━━⬣

🔞 ${lenguajeGB.smsConfi2()} *${name}*

${lenguajeGB.smsList5()}

╰━━━✦ *${vs}* ✦━━━⬣
${wm}`,
title: null,
buttonText: lenguajeGB.smsList6(),
sections }
conn.sendMessage(m.chat, listMessage, {quoted: fkontak})}
 
} catch (e) {
await conn.sendButton(m.chat, `\n${wm}`, lenguajeGB['smsMalError3']() + '#report ' + usedPrefix + command, null, [[lenguajeGB.smsMensError1(), `#reporte ${lenguajeGB['smsMensError2']()} *${usedPrefix + command}*`]], m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)	
}}

handler.help = ['infomenu'].map(v => v + 'able <option>')
handler.tags = ['group', 'owner']
handler.command = ['hornymenu', 'listaporno', 'listhorny']
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}

