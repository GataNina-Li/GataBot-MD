// Botones interactivos adptados y funcionando por Gata Dios (GataNina-Li)

//QUEDO OBSOLETO DE NUEVO CULPA DE WHATSAPP BUG :v
import { getDevice } from '@whiskeysockets/baileys'
import fs from 'fs'
import moment from 'moment-timezone'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
const { levelling } = '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text, command }) => {
const dispositivo = await getDevice(m.key.id)
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
let taguser = '@' + m.sender.split("@s.whatsapp.net")[0]
let pp = gataVidMenu
let vn = 'https://qu.ax/bfaM.mp3'
let pareja = global.db.data.users[m.sender].pasangan 
//let fsizedoc = '1'.repeat(10)
//let adReply = { fileLength: fsizedoc, seconds: fsizedoc, contextInfo: { forwardingScore: fsizedoc, externalAdReply: { showAdAttribution: true, title: wm, body: '👋 ' + username, mediaUrl: ig, description: 'Hola', previewType: 'PHOTO', thumbnail: await(await fetch(gataMenu.getRandom())).buffer(), sourceUrl: redesMenu.getRandom() }}}
const numberToEmoji = { "0": "0️⃣", "1": "1️⃣", "2": "2️⃣", "3": "3️⃣", "4": "4️⃣", "5": "5️⃣", "6": "6️⃣", "7": "7️⃣", "8": "8️⃣", "9": "9️⃣", }
let lvl = level
let emoji = Array.from(lvl.toString()).map((digit) => numberToEmoji[digit] || "❓").join("")

const lugarFecha = moment().tz('America/Lima')
const formatoFecha = {
weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
}
lugarFecha.locale('es', formatoFecha)
const horarioFecha = lugarFecha.format('dddd, DD [de] MMMM [del] YYYY || HH:mm A').replace(/^\w/, (c) => c.toUpperCase())

if (!m.isWABusiness && !/web|desktop|unknown/gi.test(dispositivo)) {  
let menu = `⎔ \`\`\`${horarioFecha}\`\`\`
⎔ *${lenguajeGB['smsTotalUsers']()}* ➺ _${Object.keys(global.db.data.users).length}_ 
⎔ *Registrados »* ${rtotalreg}/${totalreg}    
⎔ *${lenguajeGB['smsUptime']()}* ➺ _${uptime}_ 
⎔ *${lenguajeGB['smsVersion']()}* ➺ _${vs}_
⎔ *${lenguajeGB['smsMode']()} ➺* _${global.opts['self'] ? `${lenguajeGB['smsModePrivate']().charAt(0).toUpperCase() + lenguajeGB['smsModePrivate']().slice(1).toLowerCase()}` : `${lenguajeGB['smsModePublic']().charAt(0).toUpperCase() + lenguajeGB['smsModePublic']().slice(1).toLowerCase()}`}_
⎔ *${lenguajeGB['smsBanChats']()}* ➺ _${Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned).length}_ 
⎔ *${lenguajeGB['smsBanUsers']()}* ➺ _${Object.entries(global.db.data.users).filter(user => user[1].banned).length}_ ${(conn.user.jid == global.conn.user.jid ? '' : `\n⎔ *SOY SUB BOT DE: https://wa.me/${global.conn.user.jid.split`@`[0]}*`) || ''}

✨ *◜INFORMACIÓN DEL USUARIO◞* ✨
⊜ *Tipo de registro »* ${user.registered === true ? `_${user.registroC === true ? 'Registro Completo 🗂️' : 'Registro Rápido 📑'}_` : '❌ _Sin registro_'}
⊜ *Mi estado »* ${typeof user.miestado !== 'string' ? '❌ _' + usedPrefix + 'miestado_' : '_Me siento ' + user.miestado + '_'}
⊜ *Registrado »* ${user.registered === true ? '✅' : '❌ _' + usedPrefix + 'verificar_'}
⊜ *${lenguajeGB['smsBotonM7']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM7']().slice(1).toLowerCase()} »* ${user.premiumTime > 0 ? '✅' : '❌ _' + usedPrefix + 'pase premium_'}
⊜ *${lenguajeGB['smsBotonM5']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM5']().slice(1).toLowerCase()} »* ${role}
⊜ *${lenguajeGB['smsBotonM6']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM6']().slice(1).toLowerCase()} »* ${emoji} || ${user.exp - min}/${xp}
⊜ *${lenguajeGB['smsPareja']()}* ${pareja ? `\n*»* ${name} 💕 ${conn.getName(pareja)}` : `🛐 ${lenguajeGB['smsResultPareja']()}`}
⊜ *Pasatiempo(s)* ➺ ${user.pasatiempo === 0 ? '*Sin Registro*' : user.pasatiempo + '\n'}
⊜ *Experiencia ➟* ${exp} ⚡
⊜ *Diamantes ➟* ${limit} 💎
⊜ *GataCoins ➟* ${money} 🐈
⊜ *Tokens ➟* ${joincount} 🪙`.trim()
      
const buttonParamsJson = JSON.stringify({
title: "VER LISTA",
description: "Infórmate por medios oficiales sobre GataBot",
sections: [
{ title: "ℹ️ Información", highlight_label: "Popular",
rows: [
{ header: "✅ Redes", title: "🔓 Para: Todos", description: "Infórmate por medios oficiales sobre GataBot", id: usedPrefix + "cuentasgb" },
{ header: "📢 Grupos/Canales", title: "🔓 Para: Todos", description: "¡Te esperamos!", id: usedPrefix + "grupos" },
{ header: "🎁 Donar", title: "🔓 Para: Todos", description: "GataBot se mantiene funcionando gracias a donaciones ¡tú también puedes sumarte apoyando el proyecto!", id: usedPrefix + "donar" }
]},
{ title: "🔖 Atajos", highlight_label: "Popular",
rows: [
{ header: "🆕 Ser Bot (código)", title: "🔓 Para: Todos", description: "¡Conviértete en Bot con el método de código de 8 dígitos!", id: usedPrefix + "serbot --code" },
{ header: "🤖 Ser Bot (qr)", title: "🔓 Para: Todos", description: "Forma estándar de ser bot con código QR", id: usedPrefix + "serbot" },
{ header: "🚄 Velocidad", title: "🔓 Para: Todos", description: "Seleccione esto si desea saber el ping del Bot", id: usedPrefix + "ping" },
{ header: "😺 Estado", title: "🔓 Para: Todos", description: "Conoce en que estado se encuentra GataBot", id: usedPrefix + "estado" }
]},
{ title: "Ⓜ️ Menú", highlight_label: "Popular",
rows: [
{ header: "⭐ Menú completo", title: "", description: "Visita todos los comandos", id: usedPrefix + "allmenu" }
]}
]})
const interactiveMessage = {
body: { text: menu },
footer: { text: wm + ` \nSi algo no funciona utilice el comando *${usedPrefix}menu2*` },
header: { title: `⭐ *------- NUEVO MENÚ -------* ⭐\n${lenguajeGB['smsConfi2']()} *${user.genero === 0 ? '👤' : user.genero == 'Ocultado 🕶️' ? `🕶️` : user.genero == 'Mujer 🚺' ? `🚺` : user.genero == 'Hombre 🚹' ? `🚹` : '👤'} ${user.registered === true ? user.name : taguser} 💖*`, subtitle: "test4", hasMediaAttachment: false },
nativeFlowMessage: { buttons: [{ 
name: "single_select",
buttonParamsJson
}]
}}
const message = { messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 }, interactiveMessage }
await conn.relayMessage(m.chat, { viewOnceMessage: { message } }, {})
      
} else { 
let menu = `${lenguajeGB['smsConfi2']()} *${user.genero === 0 ? '👤' : user.genero == 'Ocultado 🕶️' ? `🕶️` : user.genero == 'Mujer 🚺' ? `🚺` : user.genero == 'Hombre 🚹' ? `🚹` : '👤'} ${user.registered === true ? user.name : taguser} 💖*

⎔ \`\`\`${horarioFecha}\`\`\`
⎔ *${lenguajeGB['smsTotalUsers']()}* ➺ _${Object.keys(global.db.data.users).length}_ 
⎔ *Registrados »* ${rtotalreg}/${totalreg}    
⎔ *${lenguajeGB['smsUptime']()}* ➺ _${uptime}_ 
⎔ *${lenguajeGB['smsVersion']()}* ➺ _${vs}_
⎔ *${lenguajeGB['smsMode']()} ➺* _${global.opts['self'] ? `${lenguajeGB['smsModePrivate']().charAt(0).toUpperCase() + lenguajeGB['smsModePrivate']().slice(1).toLowerCase()}` : `${lenguajeGB['smsModePublic']().charAt(0).toUpperCase() + lenguajeGB['smsModePublic']().slice(1).toLowerCase()}`}_
⎔ *${lenguajeGB['smsBanChats']()}* ➺ _${Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned).length}_ 
⎔ *${lenguajeGB['smsBanUsers']()}* ➺ _${Object.entries(global.db.data.users).filter(user => user[1].banned).length}_ ${(conn.user.jid == global.conn.user.jid ? '' : `\n⎔ *SOY SUB BOT DE: https://wa.me/${global.conn.user.jid.split`@`[0]}*`) || ''}

✨ *◜INFORMACIÓN DEL USUARIO◞* ✨
⊜ *Tipo de registro »* ${user.registered === true ? `_${user.registroC === true ? 'Registro Completo 🗂️' : 'Registro Rápido 📑'}_` : '❌ _Sin registro_'}
⊜ *Mi estado »* ${typeof user.miestado !== 'string' ? '❌ _' + usedPrefix + 'miestado_' : '_Me siento ' + user.miestado + '_'}
⊜ *Registrado »* ${user.registered === true ? '✅' : '❌ _' + usedPrefix + 'verificar_'}
⊜ *${lenguajeGB['smsBotonM7']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM7']().slice(1).toLowerCase()} »* ${user.premiumTime > 0 ? '✅' : '❌ _' + usedPrefix + 'pase premium_'}
⊜ *${lenguajeGB['smsBotonM5']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM5']().slice(1).toLowerCase()} »* ${role}
⊜ *${lenguajeGB['smsBotonM6']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM6']().slice(1).toLowerCase()} »* ${emoji} || ${user.exp - min}/${xp}
⊜ *${lenguajeGB['smsPareja']()}* ${pareja ? `\n*»* ${name} 💕 ${conn.getName(pareja)}` : `🛐 ${lenguajeGB['smsResultPareja']()}`}
⊜ *Pasatiempo(s)* ➺ ${user.pasatiempo === 0 ? '*Sin Registro*' : user.pasatiempo + '\n'}
⊜ *Experiencia ➟* ${exp} ⚡
⊜ *Diamantes ➟* ${limit} 💎
⊜ *GataCoins ➟* ${money} 🐈
⊜ *Tokens ➟* ${joincount} 🪙

*╭━〔 🐈 OPCIONES DE MENU 🐈 〕⬣*
┃
┃Ⓜ️ _*MENÚ COMPLETO*_ Ⓜ️
┃➺ _${usedPrefix}menucompleto | allmenu_
┃
┃🔊 _*MENÚ DE AUDIOS*_ 🔊
┃➺ _${usedPrefix}menuaudio | menuaudios_
┃
┃💫 _${lenguajeGB['smsTex13']()}_ 💫
┃➺ _${usedPrefix}infomenu_
┃
┃👾 _${lenguajeGB['smsTex10']()}_ 👾
┃➺ _${usedPrefix}juegosmenu_
┃
┃🚀 _${lenguajeGB['smsTex9']()}_ 🚀
┃➺ _${usedPrefix}descargasmenu_
┃
┃🔐 _${lenguajeGB['smsTex11']()}_ 🔐
┃➺ _${usedPrefix}grupomenu_
┃
┃🧸 _${lenguajeGB['smsTex22']()}_ 🧸
┃➺ _${usedPrefix}stickermenu_
┃
┃🛠️ _${lenguajeGB['smsTex12']()}_ 🛠️
┃➺ _${usedPrefix}herramientasmenu_
┃
┃⛩️ _${lenguajeGB['smsTex23']()}_ ⛩️
┃➺ _${usedPrefix}randommenu_
┃
┃🛰️ _${lenguajeGB['smsTex8']()}_ 🛰️
┃➺ _${usedPrefix}convertidormenu_
┃
┃🎈 _${lenguajeGB['smsTex1']()}_🎈
┃➺ _${usedPrefix}buscarmenu_
┃
┃🎧 _${lenguajeGB['smsTex2']()}_ 🎧
┃➺ _${usedPrefix}audioefectomenu_
┃
┃🔞 _${lenguajeGB['smsTex3']()}_ 🔞
┃➺ _${usedPrefix}menu18 | hornymenu_
┃
┃⚗️ _${lenguajeGB['smsTex21']()}_ ⚗️
┃➺ _${usedPrefix}rpgmenu_
┃
┃⛺ _${lenguajeGB['smsTex14']()}_ ⛺
┃➺ _${usedPrefix}makermenu_
┃
┃💮 _${lenguajeGB['smsTex15']()}_ 💮
┃➺ _${usedPrefix}menulogos2_
┃
┃🌅 _${lenguajeGB['smsTex15']()}_ 🌅
┃➺ _${usedPrefix}menulogos2_
┃
┃💎 _${lenguajeGB['smsTex20']()}_ 💎
┃➺ _${usedPrefix}ownermenu_
┃
┃✅ *_CUENTAS OFICIALES GATABOT_* ✅
┃➺ _${usedPrefix}cuentasgatabot | cuentasgb_
┃
*╰━━━━━━━━━━━━━⬣*`.trim()
await conn.sendFile(m.chat, gataImg, 'lp.jpg', menu, fkontak, false, { contextInfo: {mentionedJid, externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: gt, body: ' 😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 ', previewType: 0, thumbnail: imagen4, sourceUrl: redesMenu}}}) 
await conn.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m }) 
//conn.sendFile(m.chat, gataVidMenu.getRandom(), 'gata.mp4', menu, fkontak)
}} catch (e) {
await m.reply(lenguajeGB['smsMalError3']() + '\n*' + lenguajeGB.smsMensError1() + '*\n*' + usedPrefix + `${lenguajeGB.lenguaje() == 'es' ? 'reporte' : 'report'}` + '* ' + `${lenguajeGB.smsMensError2()} ` + usedPrefix + command)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)}}

handler.command = /^(menu|menú|memu|memú|help|2help|commands|commandos)$/i
//handler.register = true
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}  


/* 
import fs from 'fs'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
const { levelling } = '../lib/levelling.js'
import moment from 'moment-timezone'

let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner}) => {
try{
let locale = 'es'
let d = new Date(new Date + 3600000)
let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })

let _uptime = process.uptime() * 1000
let uptime = clockString(_uptime) 
wm = global.wm
vs = global.vs
      
let { exp, limit, level, role } = global.db.data.users[m.sender]
let { min, xp, max } = xpRange(level, global.multiplier)
let name = await conn.getName(m.sender)
let pareja = global.db.data.users[m.sender].pasangan 
let user = global.db.data.users[m.sender]
let totalreg = Object.keys(global.db.data.users).length
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length

let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

const sections = [{
title: comienzo + ' ' + lenguajeGB['smsLista1']() + ' ' + fin,
rows: [
{title: lenguajeGB['smsLista2'](), rowId: `${usedPrefix}creadora`},
{title: lenguajeGB['smsLista3'](), rowId: `${usedPrefix}donar`},
{title: lenguajeGB['smsLista4'](), rowId: `${usedPrefix}ping`},
{title: lenguajeGB['smsLista5'](), rowId: `${usedPrefix}infomenu`},
{title: lenguajeGB['smsLista6'](), rowId: `${usedPrefix}allmenu`},
{title: lenguajeGB['smsLista7'](), rowId: `${usedPrefix}instalarbot`},
{title: lenguajeGB['smsLista8'](), rowId: `${usedPrefix}serbot`},
{title: lenguajeGB['smsLista9'](), rowId: `${usedPrefix}términos`, description: '\n'}
]},{
title: comienzo + ' ' + lenguajeGB['smsLista10']() + ' ' + fin,
rows: [
{title: lenguajeGB['smsLista11'](), rowId: `${usedPrefix}top`},
{title: lenguajeGB['smsLista12'](), rowId: `${usedPrefix}listprem`},
{title: lenguajeGB['smsLista13'](), rowId: `${usedPrefix}pase premium`},
{title: lenguajeGB['smsLista14'](), rowId: `${usedPrefix}inventario 3`},
{title: lenguajeGB['smsLista15'](), rowId: `${usedPrefix}rpgmenu`},
{title: lenguajeGB['smsLista16'](), rowId: `${usedPrefix}buy`},
{title: lenguajeGB['smsLista17'](), rowId: `${usedPrefix}inventory`, description: '\n'}
]},{	
title: comienzo + ' ' + lenguajeGB['smsLista18']() + ' ' + fin,
rows: [
{title: lenguajeGB['smsLista19'](), rowId: `${usedPrefix}descargasmenu`},
{title: lenguajeGB['smsLista20'](), rowId: `${usedPrefix}buscarmenu`},
{title: lenguajeGB['smsLista21'](), rowId: `${usedPrefix}convertidormenu`},
{title: lenguajeGB['smsLista22'](), rowId: `${usedPrefix}audioefectomenu`},
{title: lenguajeGB['smsLista22_1'](), rowId: `${usedPrefix}herramientasmenu`, description: '\n'}
]},{
title: comienzo + ' ' + lenguajeGB['smsLista23']() + ' ' + fin,
rows: [
{title: lenguajeGB['smsLista24'](), rowId: `${usedPrefix}juegosmenu`},
{title: lenguajeGB['smsLista25'](), rowId: `${usedPrefix}audios`},
{title: lenguajeGB['smsLista26'](), rowId: `${usedPrefix}stickermenu`},
{title: lenguajeGB['smsLista27'](), rowId: `${usedPrefix}makermenu`},
{title: lenguajeGB['smsLista28'](), rowId: `${usedPrefix}menulogos2`},
{title: lenguajeGB['smsLista29'](), rowId: `${usedPrefix}randommenu`},
{title: lenguajeGB['smsLista30'](), rowId: `${usedPrefix}hornymenu`, description: '\n'}
]},{	
title: comienzo + ' ' + lenguajeGB['smsLista31']() + ' ' + fin,
rows: [
{title: lenguajeGB['smsLista32'](), rowId: `${usedPrefix}grupomenu`},
{title: lenguajeGB['smsLista33'](), rowId: `${usedPrefix}listas`},
{title: lenguajeGB['smsLista34'](), rowId: `${usedPrefix}on`},
{title: lenguajeGB['smsLista35'](), rowId: `${usedPrefix}ownermenu`}
]}]

const listMessage = {
text: `╭━⊰ *${ucapan()}* ⊱━⬣
┃
┃ *︾ U S U A R I O ︾*
┃
┃»» *${user.genero === 0 ? '👤' : user.genero == 'Ocultado 🕶️' ? `🕶️` : user.genero == 'Mujer 🚺' ? `🚺` : user.genero == 'Hombre 🚹' ? `🚹` : '👤'} ${user.registered === true ? user.name : name}*
┃»» *Mi estado* ➺ ${typeof user.miestado !== 'string' ? '_#miestado || Estado no asignado_' : '_Me siento ' + user.miestado + '_'}
┃»» *Registrado ➺ ${user.registered === true ? '✅' : '❌ _#verificar_'}* 
┃»» *Premium ➺ ${user.premiumTime > 0 ? '✅' : '❌ _#pase premium_'}*
┃
┃ *︾ M E N U ︾*
┃
┃✜ *${lenguajeGB['smsVersion']()}* 
┃➺ \`\`\`${vs}\`\`\`
┃✜ *Tipo de registro* 
┃➺ ${user.registered === true ? `_${user.registroC === true ? 'Registro Completo 🗂️' : 'Registro Rápido 📑'}_` : '_' + usedPrefix + 'verificar_'} 
┃   ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃✜ *${lenguajeGB['smsTotalUsers']()}* 
┃➺ _${Object.keys(global.db.data.users).length}_
┃✜ *Registrados* 
┃➺ _${rtotalreg}/${totalreg}_
┃✜ *${lenguajeGB['smsMode']()}* 
┃➺ _${global.opts['self'] ? `*${lenguajeGB['smsModePrivate']()}*` : `*${lenguajeGB['smsModePublic']()}*`}_
┃   ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃✜ *${lenguajeGB['smsTime']()}* 
┃➺ _${time}_ 	    
┃✜ *${lenguajeGB['smsUptime']()}* 
┃➺ _${uptime}_
┃   ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃✜ *${lenguajeGB['smsBanChats']()}* 
┃➺ _${Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned).length}_ 
┃✜ *${lenguajeGB['smsBanUsers']()}* 
┃➺ _${Object.entries(global.db.data.users).filter(user => user[1].banned).length}_
┃
╰━⊰ *${wm}* ⊱━⬣\n
*»» ✨ Pasatiempo(s)* ➺ ${user.pasatiempo === 0 ? '*Sin Registro*' : user.pasatiempo + '\n'}
*»» ${lenguajeGB['smsPareja']()} ➺ ${pareja ? `${name} 💕 ${conn.getName(pareja)}` : `🛐 ${lenguajeGB['smsResultPareja']()}`}* ${(conn.user.jid == global.conn.user.jid ? '' : `\n»» *Sub Bot del:* wa.me/${global.conn.user.jid.split`@`[0]}`) || ''}`,
footer: `*↓ TRUSTED LINK* ✅
${readMore}${redesMenu.getRandom()}`, //${name} ${ucapan()} //lenguajeGB['smsMenu']()
title: null,
buttonText: `${lenguajeGB['smsListaMenu']()}`, 
sections }
await conn.sendMessage(m.chat, listMessage, {quoted: fkontak})


} catch (e) {
await conn.sendButton(m.chat, `\n${wm}`, lenguajeGB['smsMalError3']() + '#report ' + usedPrefix + command, null, [[lenguajeGB.smsMensError1(), `#reporte ${lenguajeGB['smsMensError2']()} *${usedPrefix + command}*`]], m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)	
}}
handler.command = /^(menu|menú|memu|memú|help|info|comandos|2help|menu1.2|ayuda|commands|commandos|m|\?)$/i
//handler.register = true
handler.exp = 50
export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function ucapan() {
  const time = moment.tz('America/Los_Angeles').format('HH')  //America/Los_Angeles  Asia/Jakarta   America/Toronto
  let res = `${lenguajeGB['smsSaludo']()}`
  if (time >= 4) {
    res = `${lenguajeGB['smsDia']()}`
  }
  if (time >= 11) {
    res = `${lenguajeGB['smsTarde']()}`
  }
  if (time >= 15) {
    res = `${lenguajeGB['smsTarde2']()}`
  }
  if (time >= 17) {
    res = `${lenguajeGB['smsNoche']()}`
  }
  return res
} 
*/
