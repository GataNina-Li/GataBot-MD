import axios from "axios"
import fetch from 'node-fetch'
import moment from 'moment-timezone';
import { sticker } from '../lib/sticker.js'
import { getRandomImageNsfw as nsfw } from 'module-gatadios'
               
let handler = async (m, {usedPrefix, command, conn}) => {
let frep = { contextInfo: { externalAdReply: {title: wm, body: lenguajeGB.smsCont18Porn2(), sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer() }}}
let user = global.db.data.users[m.sender]

if (!db.data.chats[m.chat].modohorny && m.isGroup) return conn.reply(m.chat, `${lenguajeGB['smsContAdult']()}`, m)
const horarioNsfw = db.data.chats[m.chat].horarioNsfw;
const now = moment.tz('America/Guayaquil'); 
const currentTime = now.format('HH:mm'); 

if (horarioNsfw) {
const { inicio, fin } = horarioNsfw;
const inicioTime = moment(inicio, 'HH:mm').tz('America/Guayaquil');
const finTime = moment(fin, 'HH:mm').tz('America/Guayaquil');
const currentMoment = moment(currentTime, 'HH:mm').tz('America/Guayaquil');
let isWithinTimeRange = false;
if (inicioTime.isAfter(finTime)) {
if (currentMoment.isBetween(inicioTime, moment('23:59', 'HH:mm').tz('America/Guayaquil')) || 
currentMoment.isBetween(moment('00:00', 'HH:mm').tz('America/Guayaquil'), finTime)) {
isWithinTimeRange = true;
}} else {
if (currentMoment.isBetween(inicioTime, finTime)) {
isWithinTimeRange = true;
}}
if (!isWithinTimeRange) return m.reply(`${lenguajeGB['smsAvisoAG']()} 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙎𝙊𝙇𝙊 𝙁𝙐𝙉𝘾𝙄𝙊́𝙉𝘼 𝙀𝙇 𝙃𝙊𝙍𝘼𝙍𝙄𝙊 𝙃𝘼𝘽𝙄𝙇𝙄𝙏𝘼𝘿𝙊 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊 𝙀𝙎: ${inicio} a ${fin}`) 
}

try{  
let contenido = `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`
if (command == 'pornololi' || command == 'nsfwloli') {
await conn.sendFile(m.chat, nsfw('nsfwloli'), null, contenido, null, null, { viewOnce: true }, m)
}
if (command == 'pornopies' || command == 'nsfwfoot') {
await conn.sendFile(m.chat, nsfw('nsfwfoot'), null, contenido, null, null, { viewOnce: true }, m)
}
if (command == 'pornoass' || command == 'nsfwass') {
await conn.sendFile(m.chat, nsfw('nsfwass'), null, null, contenido, null, null, { viewOnce: true }, m)
} 
if (command == 'pornobdsm' || command == 'nsfwbdsm') {
await conn.sendFile(m.chat, nsfw('nsfwbdsm'), null, null, contenido, null, null, { viewOnce: true }, m)
}
if (command == 'pornocum' || command == 'nsfwcum') {
await conn.sendFile(m.chat, nsfw('nsfwcum'), null, null, contenido, null, null, { viewOnce: true }, m)
}
if (command == 'pornoero' || command == 'nsfwero') {  
await conn.sendFile(m.chat, nsfw('nsfwero'), null, contenido, null, null, { viewOnce: true }, m)
}
if (command == 'pornodominar' || command == 'nsfwfemdom') { 
await conn.sendFile(m.chat, nsfw('nsfwfemdom'), null, contenido, null, null, { viewOnce: true }, m)
}
if (command == 'pornoglass' || command == 'nsfwglass') {
await conn.sendFile(m.chat, nsfw('nsfwglass'), null, contenido, null, null, { viewOnce: true }, m)
}
if (command == 'pornochica' || command == 'nsfwgirl') {
await conn.sendFile(m.chat, nsfw('nsfwgirl'), null, contenido, null, null, { viewOnce: true }, m)
}
if (command == 'pornohentai' || command == 'nsfwhentai') {
await conn.sendFile(m.chat, nsfw('nsfwhentai'), null, contenido, null, null, { viewOnce: true }, m)
}
if (command == 'pornorgia' || command == 'nsfworgy') {
await conn.sendFile(m.chat, nsfw('nsfworgy'), null, contenido, null, null, { viewOnce: true }, m)
}
if (command == 'pornotetas' || command == 'nsfwboobs') {
let resError = (await axios.get(`https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/tetas.json`)).data   
let res = await conn.getFile(`https://api-fgmods.ddns.net/api/nsfw/boobs?apikey=fg-dylux`).data
if (res == '' || !res || res == null) res = await resError[Math.floor(resError.length * Math.random())]  
await conn.sendFile(m.chat, res, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, res, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno tetas 3' : 'nsfw boobs 3'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornotetas3' : 'nsfwboobs3'}`]], m, frep)}
  
if (command == 'pornobooty' || command == 'nsfwbooty') {
let resError = (await axios.get(`https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/booty.json`)).data   
let res = await conn.getFile(`https://api-fgmods.ddns.net/api/nsfw/ass?apikey=fg-dylux`).data
if (res == '' || !res || res == null) res = await resError[Math.floor(resError.length * Math.random())]  
await conn.sendFile(m.chat, res, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, res, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}
  
if (command == 'pornoecchi' || command == 'nsfwecchi') {
let res = (await axios.get(`https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/ecchi.json`)).data  
let enlace = await res[Math.floor(res.length * Math.random())]
await conn.sendFile(m.chat, enlace, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, enlace, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}
  
if (command == 'pornofurro' || command == 'nsfwfurry') {
let res = (await axios.get(`https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/furro.json`)).data  
let enlace = await res[Math.floor(res.length * Math.random())]
await conn.sendFile(m.chat, enlace, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, enlace, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno furro 2' : 'nsfw furry 2'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornofurro2' : 'nsfwfurry2'}`]], m, frep)}
  
if (command == 'pornotrapito' || command == 'nsfwtrap') { //https://api.lolhuman.xyz/api/random/nsfw/trap?apikey=6fbee8ec83e7b2677026ffae
let res = await fetch(`https://api.waifu.pics/nsfw/trap`)
let json = await res.json()
let enlace = json.url
await conn.sendFile(m.chat, res, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, enlace, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}
  
if (command == 'pornolesbiana' || command == 'nsfwlesbian') {
let resError = (await axios.get(`https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/imagenlesbians.json`)).data   
let res = await conn.getFile(`https://api-fgmods.ddns.net/api/nsfw/lesbian?apikey=fg-dylux`).data
if (res == '' || !res || res == null) res = await resError[Math.floor(resError.length * Math.random())]  
await conn.sendFile(m.chat, res, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, res, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno chica' : 'nsfws girl'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornochica' : 'nsfwsgirl'}`]], m, frep)} 
  
if (command == 'pornobragas' || command == 'nsfwpanties') {
let res = (await axios.get(`https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/panties.json`)).data  
let enlace = await res[Math.floor(res.length * Math.random())]
await conn.sendFile(m.chat, enlace, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, enlace, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno chica 2' : 'nsfws girl 2'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornochica2' : 'nsfwsgirl2'}`]], m, frep)}
  
if (command == 'pornopene' || command == 'nsfwpenis') {
let resError = (await axios.get(`https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/pene.json`)).data   
let res = await conn.getFile(`https://api-fgmods.ddns.net/api/nsfw/penis?apikey=fg-dylux`).data
if (res == '' || !res || res == null) res = await resError[Math.floor(resError.length * Math.random())]  
await conn.sendFile(m.chat, res, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, res, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}
  
if (command == 'porno' || command == 'porn') {
let res = (await axios.get(`https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/porno.json`)).data  
let enlace = await res[Math.floor(res.length * Math.random())]
await conn.sendFile(m.chat, res, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, enlace, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno 4k' : 'nsfws 4k'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'porno4k' : 'porn4k'}`]], m, frep)}
  
if (command == 'pornorandom' || command == 'pornrandom') {
let rawjsonn = ['https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/tetas.json', 'https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/booty.json', 'https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/imagenlesbians.json', 'https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/panties.json', 'https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/porno.json'] 
let rawjson = await rawjsonn[Math.floor(rawjsonn.length * Math.random())]  
let res = (await axios.get(rawjson)).data  
let enlace = await res[Math.floor(res.length * Math.random())]
await conn.sendFile(m.chat, enlace, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, enlace, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}
  
if (command == 'pornopechos' || command == 'nsfwbreasts') {
let res = (await axios.get(`https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/pechos.json`)).data  
let enlace = await res[Math.floor(res.length * Math.random())]
await conn.sendFile(m.chat, enlace, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, enlace, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno muslo' : 'nsfw hthigh'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornomuslo' : 'nsfwhthigh'}`]], m, frep)}
  
if (command == 'pornoyaoi' || command == 'nsfwyaoi') {
let res = (await axios.get(`https://raw.githubusercontent.com/HasamiAini/wabot_takagisan/main/whatsapp%20bot%20takagisan/whatsapp%20bot%20takagisan/lib/Yaoi.json`)).data  //`https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/yaoi.json`
let enlace = await res[Math.floor(res.length * Math.random())]
let link = enlace.image
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: wm, mediaType: 2, sourceUrl: redesMenu, thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendFile(m.chat, null, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, null, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno yaoi 2' : 'nsfw yaoi 2'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoyaoi2' : 'nsfwyaoi2'}`]], fkontak, m)
}else{
await conn.sendFile(m.chat, link, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno yaoi 2' : 'nsfw yaoi 2'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoyaoi2' : 'nsfwyaoi2'}`]], m, frep)}}
  
if (command == 'pornoyaoi2' || command == 'nsfwyaoi2') {
let res = await fetch(`https://purrbot.site/api/img/nsfw/yaoi/gif`)
let json = await res.json()
let enlace = json.link
if (enlace.slice(-3) == 'gif') {
let stickerr = await sticker(false, enlace, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: wm, mediaType: 2, sourceUrl: redesMenu, thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendFile(m.chat, null, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, null, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno yaoi 3' : 'nsfw yaoi 3'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoyaoi3' : 'nsfwyaoi3'}`]], fkontak, m)}}
  
if (command == 'pornoyuri' || command == 'nsfwyuri') { 
let res = (await axios.get(`https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/yuri.json`)).data  
let enlace = await res[Math.floor(res.length * Math.random())]  
await conn.sendFile(m.chat, enlace, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, enlace, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno yuri 2' : 'nsfw yuri 2'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoyuri2' : 'nsfwyuri2'}`]], m, frep)}
  
if (command == 'pornoyuri2' || command == 'nsfwyuri2') {
let res = await fetch(`https://purrbot.site/api/img/nsfw/yuri/gif`)
let json = await res.json()
let link = json.link
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: wm, mediaType: 2, sourceUrl: redesMenu, thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendFile(m.chat, null, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, null, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno yuri 3' : 'nsfw yuri 3'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoyuri3' : 'nsfwyuri3'}`]], fkontak, m)
}else{
await conn.sendFile(m.chat, link, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno yuri 3' : 'nsfw yuri 3'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornoyuri3' : 'nsfwyuri3'}`]], m, frep)}}

if (command == 'pornodarling' || command == 'nsfwdarling') { 
let list = global.darling
let link = list[Math.floor(Math.random() * list.length)]
await conn.sendFile(m.chat, link, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}

if (command == 'pornodragonmaid' || command == 'nsfwdragonmaid') { 
let list = global.dragonmaid
let link = list[Math.floor(Math.random() * list.length)]
await conn.sendFile(m.chat, link, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}

if (command == 'pornokonosuba' || command == 'nsfwkonosuba') { 
let list = global.konosuba
let link = list[Math.floor(Math.random() * list.length)]
await conn.sendFile(m.chat, link, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}

if (command == 'pornopokemon' || command == 'nsfwpokemon') { 
let list = global.pokemon
let link = list[Math.floor(Math.random() * list.length)]
await conn.sendFile(m.chat, link, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}

if (command == 'pornotoloveru' || command == 'nsfwtoloveru') { 
let list = global.toloveru 
let link = list[Math.floor(Math.random() * list.length)]
await conn.sendFile(m.chat, link, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}

if (command == 'pornouzaki' || command == 'nsfwuzaki') { 
let list = global.uzaki 
let link = list[Math.floor(Math.random() * list.length)]
await conn.sendFile(m.chat, link, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}

if (command == 'pornopack' || command == 'nsfwpack') { 
let list = global.pack 
let link = list[Math.floor(Math.random() * list.length)]
await conn.sendFile(m.chat, link, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno pack chica' : 'nsfw pack girl'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornopackchica' : 'nsfwpackgirl'}`], [`🥵 ${lenguajeGB.lenguaje() == 'es' ? 'porno pack chico' : 'nsfw pack men'} 🥵`.toUpperCase(), `${usedPrefix}${lenguajeGB.lenguaje() == 'es' ? 'pornopackchico' : 'nsfwpackmen'}`]], m, frep)}

if (command == 'pornopackchica' || command == 'nsfwpackgirl') { 
let list = global.packgirl 
let link = pack[Math.floor(Math.random() * pack.length)]
await conn.sendFile(m.chat, link, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}

if (command == 'pornopackchico' || command == 'nsfwpackmen') { 
let list = global.packmen 
let link = list[Math.floor(Math.random() * list.length)]
await conn.sendFile(m.chat, link, null, `${lenguajeGB['smsCont18Porn']()}\n${lenguajeGB['smsBotonM7']()} » ${user.premiumTime > 0 ? '✅' : '❌'}`, null, null, {viewOnce: true}, m)}
//await conn.sendButton(m.chat, lenguajeGB.smsCont18Porn(), `*_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm + ` : *${command[0].toUpperCase() + command.substring(1)}*`, link, [[lenguajeGB.smsSig(), `${usedPrefix + command}`], [lenguajeGB.lenguaje() == 'es' ? '🔞 ver lista porno 🔞'.toUpperCase() : '🔞 list horny🔞 '.toUpperCase(), lenguajeGB.lenguaje() == 'es' ? usedPrefix + 'listaporno' : usedPrefix + 'listhorny']], m, frep)}
  
} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)}
}  
handler.command = ['pornololi', 'nsfwloli', 'pornopies', 'nsfwfoot', 'pornoass', 'nsfwass', 'pornobdsm', 'nsfwbdsm', 'pornocum', 'nsfwcum', 'pornoero', 'nsfwero', 'pornodominar', 'nsfwfemdom', 'pornoglass', 'nsfwglass', 'pornohentai', 'nsfwhentai', 'pornorgia', 'nsfworgy', 'pornotetas', 'nsfwboobs', 'pornobooty', 'nsfwbooty', 'pornoecchi', 'nsfwecchi', 'pornofurro', 'nsfwfurry', 'pornotrapito', 'nsfwtrap', 'pornolesbiana', 'nsfwlesbian', 'pornobragas', 'nsfwpanties', 'pornopene', 'nsfwpenis', 'porno', 'porn', 'pornorandom', 'pornrandom', 'pornopechos', 'nsfwbreasts', 'pornoyaoi', 'nsfwyaoi', 'pornoyaoi2', 'nsfwyaoi2', 'pornoyuri', 'nsfwyuri',
'pornoyuri2', 'nsfwyuri2', 'pornodarling', 'nsfwdarling', 'pornodragonmaid', 'nsfwdragonmaid', 'pornokonosuba', 'nsfwkonosuba', 'pornopokemon', 'nsfwpokemon',
'pornotoloveru', 'nsfwtoloveru', 'pornouzaki', 'nsfwuzaki', 'pornopack', 'nsfwpack', 'pornopackchica', 'nsfwpackgirl', 'pornopackchico', 'nsfwpackmen']
//handler.level = 5
//handler.limit = 2
handler.register = true
export default  handler

global.pack = [
  "https://i.imgur.com/XbW7FO2.jpg",
  "https://i.imgur.com/ciuzM98.jpg",
  "https://i.imgur.com/uHsrrrx.jpg",
  "https://i.imgur.com/PVi8YDi.jpg",
  "https://i.imgur.com/FLC3ZXE.jpg",
  "https://i.imgur.com/54m52tX.jpg",
  "https://i.imgur.com/OsxYPgQ.jpg",
  "https://i.imgur.com/vpw6Xnr.jpg",
  "https://i.imgur.com/aAyPrZx.jpg",
  "https://i.imgur.com/Gh3ORCd.jpg",
  "https://i.imgur.com/rjGhygM.jpg",
  "https://i.imgur.com/zdHVFEI.jpg",
  "https://i.imgur.com/kAplnSG.jpg",
  "https://i.imgur.com/15UiO8o.jpg",
  "https://i.imgur.com/qjjyr6G.jpg",
  "https://i.imgur.com/bQZRhBU.jpg",
  "https://i.imgur.com/vpw6Xnr.jpg",
  "https://i.imgur.com/aAyPrZx.jpg",
  "https://i.imgur.com/Gh3ORCd.jpg",
  "https://i.imgur.com/rjGhygM.jpg",
  "https://i.imgur.com/0MhmmF4.jpg",
  "https://i.imgur.com/2MX4wvq.jpg",
  "https://i.imgur.com/HYL5ggu.jpg",
  "https://i.imgur.com/7ZjOD2a.jpg",
  "https://i.imgur.com/zbEUy3m.jpg",
  "https://i.imgur.com/tZ6vlg6.jpg",
  "https://i.imgur.com/jdPns8O.jpg",
  "https://i.imgur.com/VyjBQHT.jpg",
  "https://i.imgur.com/ozAGqBD.jpg",
  "https://i.imgur.com/DsSj9S1.jpg",
  "https://i.imgur.com/KYHpjNc.jpg"]


global.packgirl = [
  "https://i.imgur.com/mwLJaxU.jpg",
  "https://i.imgur.com/9ptmlPl.jpg",
  "https://i.imgur.com/38tVliz.jpg",
  "https://i.imgur.com/2NqCKE3.jpg",
  "https://i.imgur.com/pveviMG.jpg",
  "https://i.imgur.com/d71dnkv.jpg",
  "https://i.imgur.com/cr7Ypj1.jpg",
  "https://i.imgur.com/jAxzCj4.jpg",
  "https://i.imgur.com/xokuFLf.jpg",
  "https://i.imgur.com/Hi4zLaf.jpg",
  "https://i.imgur.com/OlaQtwW.jpg",
  "https://i.imgur.com/Dm4GLuF.jpg",
  "https://i.imgur.com/k6Y2E9b.jpg",
  "https://i.imgur.com/1rk7jdu.jpg",
  "https://i.imgur.com/TFmEVPc.jpg",
  "https://i.imgur.com/0XefLlJ.jpg",
  "https://i.imgur.com/bwa9LYZ.jpg",
  "https://i.imgur.com/WgrpTmg.jpg",
  "https://i.imgur.com/Z5f5YAw.jpg",
  "https://i.imgur.com/xEuBtPO.jpg",
  "https://i.imgur.com/NA0fHxn.jpg",
  "https://i.imgur.com/InueCKQ.jpg",
  "https://i.imgur.com/3syOcHe.jpg",
  "https://i.imgur.com/N1dgels.jpg",
  "https://i.imgur.com/IxKAJaV.jpg",
  "https://i.imgur.com/8VrxL1d.jpg",
  "https://i.imgur.com/8B4Y0bG.jpg",
  "https://i.imgur.com/wgkGOjF.jpg",
  "https://i.imgur.com/765Wi6q.jpg",
  "https://i.imgur.com/5joeWnm.jpg",
  "https://i.imgur.com/71fjmmM.jpg",
  "https://i.imgur.com/cAuKeyZ.jpg",
  "https://i.imgur.com/SDZ2Hs5.jpg",
  "https://i.imgur.com/skkEyqI.jpg",
  "https://i.imgur.com/6dXFsBW.jpg",
  "https://i.imgur.com/6CeG9ZX.jpg"]


global.packmen = [
  "https://i.imgur.com/TK0qLAu.jpg",
  "https://i.imgur.com/q8lKT40.jpg",
  "https://i.imgur.com/OwWdL9u.jpg",
  "https://i.imgur.com/Er7WiQo.jpg",
  "https://i.imgur.com/u4y0q4P.jpg",
  "https://i.imgur.com/y8y4PPr.jpg",
  "https://i.imgur.com/qgfLlRY.jpg",
  "https://i.imgur.com/irgyUTD.jpg",
  "https://i.imgur.com/uXrqfBl.jpg",
  "https://i.imgur.com/lgXjetf.jpg",
  "https://i.imgur.com/81QLh8s.jpg",
  "https://i.imgur.com/R3AlYe1.jpg",
  "https://i.imgur.com/a2Myr3F.jpg",
  "https://i.imgur.com/Wp9cgGw.jpg",
  "https://i.imgur.com/ggKUnxt.jpg",
  "https://i.imgur.com/eCJNWBl.jpg",
  "https://i.imgur.com/6lcrBQB.jpg",
  "https://i.imgur.com/eSSbXJ1.jpg",
  "https://i.imgur.com/tNyvzyO.jpg"]
