//CÓDIGO ELABORADO POR: https://github.com/GataNina-Li & https://github.com/DIEGO-OFC

import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'
const temaX = [['hentai','hentai3'], ['ass', 'nsfwass2'], ['pgif', 'pornsticker'], ['thigh', 'porngirl'], ['hass', 'hass'], ['boobs', 'tetas2'], ['hboobs', 'tetas3'], ['pussy', 'pussy'], ['paizuri', 'paizuri'], ['lewdneko', 'nsfwneko'], ['feet', 'nsfwfeet'], ['hyuri', 'yuri3'], ['hthigh', 'hthigh'], ['hmidriff', 'porngirl2'], ['anal', 'nsfwanal'], ['blowjob', 'blowjob'], ['gonewild', 'gonewild'], ['hkitsune', 'furro2'], ['tentacle', 'tentacle'], ['4k', 'porn4k'], ['kanna', 'kanna'], ['hentai_anal', 'nsfwanal2'], ['food', 'food'], ['holo', 'nsfwholo'],
['nsfw/anal/gif', 'nsfwanal3'], ['nsfw/blowjob/gif', 'blowjob2'], ['nsfw/cum/gif', 'nsfwcum2'], ['nsfw/fuck/gif', 'pornfuck'], ['nsfw/neko/gif', 'nsfwneko2'], ['nsfw/neko/img', 'nsfwneko3']]  

let handler = async (m, {command, conn, usedPrefix}) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let frep = { contextInfo: { externalAdReply: {title: wm, body: lenguajeGB.smsCont18PornP2(), sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer() }}}
let user = global.db.data.users[m.sender]
if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${lenguajeGB['smsContAdult']()}` 

try {
if (command == temaX[0][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[0][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

if (command == temaX[1][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[1][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 NSWFASS 🥵`, `${usedPrefix}nsfwass`]], m, frep)}}

if (command == temaX[2][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[2][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

if (command == temaX[3][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[3][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

if (command == temaX[4][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[4][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

if (command == temaX[5][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[5][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 BOOBS 🥵`, `${usedPrefix}tetas`]], m, frep)}}

if (command == temaX[6][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[6][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 BOOBS 2 🥵`, `${usedPrefix}tetas2`]], m, frep)}}

if (command == temaX[7][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[7][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

if (command == temaX[8][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[8][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

if (command == temaX[9][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[9][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

if (command == temaX[10][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[10][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

if (command == temaX[11][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[11][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 YURI 2 🥵`, `${usedPrefix}yuri2`]], m, frep)}}

if (command == temaX[12][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[12][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

if (command == temaX[13][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[13][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 PORN GIRL 2 🥵`, `${usedPrefix}porngirl2`]], m, frep)}}

if (command == temaX[14][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[14][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 NSFW ANAL 2 🥵`, `${usedPrefix}nsfwanal2`]], m, frep)}}

if (command == temaX[15][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[15][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

if (command == temaX[16][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[16][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

if (command == temaX[17][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[17][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 FURRO 2 🥵`, `${usedPrefix}furro2`]], m, frep)}}

if (command == temaX[18][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[18][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

if (command == temaX[19][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[19][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

if (command == temaX[20][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[20][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

if (command == temaX[21][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[21][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

if (command == temaX[22][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[22][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

if (command == temaX[23][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[23][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}}

/*if (command == temaX[24][1]) {
let res = await fetch(APIs.purrbot + "img/" + temaX[24][0]) 
let json = await res.json()
let link2 = json.link
if (link2.slice(-3) == 'gif') {
let stickerr = await sticker(false, link2, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link2, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 NSFW ANAL 🥵`, `${usedPrefix}nsfwanal`]], m, frep)}}
*/
  
if (command == temaX[24][1]) {
let res = await fetch(APIs.purrbot + "img/" + temaX[24][0]) 
let json = await res.json()
let link2 = json.link
let stickerr = await sticker(false, link2, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 NSFW ANAL 🥵`, `${usedPrefix}nsfwanal`]], fkontak, m)}

if (command == temaX[25][1]) {
let res = await fetch(APIs.purrbot + "img/" + temaX[25][0]) 
let json = await res.json()
let link2 = json.link
let stickerr = await sticker(false, link2, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 BLOWJOB 🥵`, `${usedPrefix}blowjob2`]], fkontak, m)}

if (command == temaX[26][1]) {
let res = await fetch(APIs.purrbot + "img/" + temaX[26][0]) 
let json = await res.json()
let link2 = json.link
let stickerr = await sticker(false, link2, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 NSFW CUM 🥵`, `${usedPrefix}nsfwcum`]], fkontak, m)}

if (command == temaX[27][1]) {
let res = await fetch(APIs.purrbot + "img/" + temaX[27][0]) 
let json = await res.json()
let link2 = json.link
let stickerr = await sticker(false, link2, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], fkontak, m)}

if (command == temaX[28][1]) {
let res = await fetch(APIs.purrbot + "img/" + temaX[28][0]) 
let json = await res.json()
let link2 = json.link
let stickerr = await sticker(false, link2, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 NSFW NEKO 🥵`, `${usedPrefix}nswfneko`]], fkontak, m)}

if (command == temaX[29][1]) {
let res = await fetch(APIs.purrbot + "img/" + temaX[29][0]) 
let json = await res.json()
let link2 = json.link
let stickerr = await sticker(false, link2, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`], [`🥵 NSFW NEKO 2 🥵`, `${usedPrefix}nswfneko2`]], fkontak, m)}
 
} catch (e) {
await conn.sendButton(m.chat, `\n${wm}`, lenguajeGB['smsMalError3']() + '#report ' + usedPrefix + command, null, [[lenguajeGB.smsMensError1(), `#reporte ${lenguajeGB['smsMensError2']()} *${usedPrefix + command}*`]], m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)}
}  
handler.command = [temaX[0][1], temaX[1][1], temaX[2][1], temaX[3][1], temaX[4][1], temaX[4][1], temaX[5][1], temaX[6][1], temaX[7][1], temaX[8][1], temaX[9][1], temaX[10][1], temaX[11][1], temaX[12][1], temaX[13][1], temaX[14][1], temaX[15][1], temaX[16][1], temaX[17][1], temaX[18][1], temaX[19][1], temaX[20][1], temaX[21][1], temaX[22][1], temaX[23][1],
temaX[24][1], temaX[25][1], temaX[26][1], temaX[27][1], temaX[28][1], temaX[29][1]]
handler.premium = true
export default  handler

