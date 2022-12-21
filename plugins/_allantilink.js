import fetch from 'node-fetch'
const isLinkTik = /tiktok.com/i 
const isLinkYt = /youtube.com|youtu.be/i 
const isLinkTel = /telegram.com|t.me/i 
const isLinkFb = /facebook.com|fb.me/i 
const isLinkIg = /instagram.com/i 
const isLinkTw = /twitter.com/i 

export async function before(m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin }) {
let enlace = { contextInfo: { externalAdReply: {title: wm, body: 'support group' , sourceUrl: nna, thumbnail: await(await fetch(img)).buffer() }}}
let enlace2 = { contextInfo: { externalAdReply: { showAdAttribution: true, mediaUrl: yt, mediaType: 'VIDEO', description: '', title: wm, body: lenguajeGB.smsTextoYT(), thumbnailUrl: await(await fetch(img)).buffer(), sourceUrl: yt }}}
let dos = [enlace, enlace2]    

if (m.isBaileys && m.fromMe)
return !0
if (!m.isGroup) return !1
let chat = global.db.data.chats[m.chat]
let bot = global.db.data.settings[this.user.jid] || {}
    
const isAntiLinkTik = isLinkTik.exec(m.text)
const isAntiLinkYt = isLinkYt.exec(m.text)
const isAntiLinkTel = isLinkTel.exec(m.text)
const isAntiLinkFb = isLinkFb.exec(m.text)
const isAntiLinkIg = isLinkIg.exec(m.text)
const isAntiLinkTw = isLinkTw.exec(m.text)
    
if (chat.antiTiktok && isAntiLinkTik) {
await conn.sendButton(m.chat, `${lenguajeGB['smsAvisoAG']()}${lenguajeGB['smsEnlaceTik']()} ${await this.getName(m.sender)} ${isBotAdmin ? '' : `\n\n${lenguajeGB['smsAvisoFG']()}${lenguajeGB['smsAllAdmin']()}`}`, wm, img5, [[`${lenguajeGB['smsApagar']()}`, '/off antitiktok']], m, dos.getRandom())
if (isBotAdmin && bot.restrict) {
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
} else if (!bot.restrict) return await conn.sendButton(m.chat, `${lenguajeGB['smsSoloOwner']()}`, wm, img5, [[`${lenguajeGB['smsEncender']()}`, '/on restrict']], m, dos.getRandom())
}
    
if (chat.antiYoutube && isAntiLinkYt) {
await conn.sendButton(m.chat, `${lenguajeGB['smsAvisoAG']()}${lenguajeGB['smsEnlaceYt']()} ${await this.getName(m.sender)} ${isBotAdmin ? '' : `\n\n${lenguajeGB['smsAvisoFG']()}${lenguajeGB['smsAllAdmin']()}`}`, wm, img5, [[`${lenguajeGB['smsApagar']()}`, '/off antitiktok']], m, dos.getRandom())
if (isBotAdmin && bot.restrict) {
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
} else if (!bot.restrict) return await conn.sendButton(m.chat, `${lenguajeGB['smsSoloOwner']()}`, wm, img5, [[`${lenguajeGB['smsEncender']()}`, '/on restrict']], m, dos.getRandom())
}
    
if (chat.antiTelegram && isAntiLinkTel) {
await conn.sendButton(m.chat, `${lenguajeGB['smsAvisoAG']()}${lenguajeGB['smsEnlaceTel']()} ${await this.getName(m.sender)} ${isBotAdmin ? '' : `\n\n${lenguajeGB['smsAvisoFG']()}${lenguajeGB['smsAllAdmin']()}`}`, wm, img5, [[`${lenguajeGB['smsApagar']()}`, '/off antitiktok']], m, dos.getRandom())
if (isBotAdmin && bot.restrict) {
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
} else if (!bot.restrict) return await conn.sendButton(m.chat, `${lenguajeGB['smsSoloOwner']()}`, wm, img5, [[`${lenguajeGB['smsEncender']()}`, '/on restrict']], m, dos.getRandom())
}
    
if (chat.antiFacebook && isAntiLinkFb) {
await conn.sendButton(m.chat, `${lenguajeGB['smsAvisoAG']()}${lenguajeGB['smsEnlaceFb']()} ${await this.getName(m.sender)} ${isBotAdmin ? '' : `\n\n${lenguajeGB['smsAvisoFG']()}${lenguajeGB['smsAllAdmin']()}`}`, wm, img5, [[`${lenguajeGB['smsApagar']()}`, '/off antitiktok']], m, dos.getRandom())
if (isBotAdmin && bot.restrict) {
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
} else if (!bot.restrict) return await conn.sendButton(m.chat, `${lenguajeGB['smsSoloOwner']()}`, wm, img5, [[`${lenguajeGB['smsEncender']()}`, '/on restrict']], m, dos.getRandom())
}
    
if (chat.antiInstagram && isAntiLinkIg) {
await conn.sendButton(m.chat, `${lenguajeGB['smsAvisoAG']()}${lenguajeGB['smsEnlaceIg']()} ${await this.getName(m.sender)} ${isBotAdmin ? '' : `\n\n${lenguajeGB['smsAvisoFG']()}${lenguajeGB['smsAllAdmin']()}`}`, wm, img5, [[`${lenguajeGB['smsApagar']()}`, '/off antitiktok']], m, dos.getRandom())
if (isBotAdmin && bot.restrict) {
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
} else if (!bot.restrict) return await conn.sendButton(m.chat, `${lenguajeGB['smsSoloOwner']()}`, wm, img5, [[`${lenguajeGB['smsEncender']()}`, '/on restrict']], m, dos.getRandom())
}
    
if (chat.antiTwitter && isAntiLinkTw) {
await conn.sendButton(m.chat, `${lenguajeGB['smsAvisoAG']()}${lenguajeGB['smsEnlaceTw']()} ${await this.getName(m.sender)} ${isBotAdmin ? '' : `\n\n${lenguajeGB['smsAvisoFG']()}${lenguajeGB['smsAllAdmin']()}`}`, wm, img5, [[`${lenguajeGB['smsApagar']()}`, '/off antitiktok']], m, dos.getRandom())
if (isBotAdmin && bot.restrict) {
await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
} else if (!bot.restrict) return await conn.sendButton(m.chat, `${lenguajeGB['smsSoloOwner']()}`, wm, img5, [[`${lenguajeGB['smsEncender']()}`, '/on restrict']], m, dos.getRandom())
}
return !0
}

