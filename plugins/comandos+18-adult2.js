import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'
const temaX = [['hentai','hentai3'], ['', '']]  

let handler = async (m, {command, conn, usedPrefix}) => {
let frep = { contextInfo: { externalAdReply: {title: wm, body: lenguajeGB.smsCont18PornP2(), sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer() }}}
let user = global.db.data.users[m.sender]
if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${lenguajeGB['smsContAdult']()}` 

if (command == temaX[0][1]) {
let res = await fetch(APIs.nekobot + "image?type=" + temaX[0][0]) 
let json = await res.json()
let link = json.message
if (link.slice(-3) == 'gif') {
let stickerr = await sticker(false, link, global.packname, global.author)
await conn.sendFile(m.chat, stickerr, 'sticker.webp', '', m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: lenguajeGB.smsCont18PornP2(), body: `h`, mediaType: 2, sourceUrl: redesMenu.getRandom(), thumbnail: await(await fetch(img16)).buffer()}}}, { quoted: m })
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), null, null, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m)
}else{
await conn.sendButton(m.chat, lenguajeGB.smsCont18PornP(), ` *_${lenguajeGB['smsBotonM7']()}_* » ${user.premiumTime > 0 ? '✅' : '❌'}\n` + wm, link, [[lenguajeGB.smsSigPrem(), `${usedPrefix + command}`]], m, frep)}
}}  

handler.command = [temaX[0][1]]
export default  handler

