import fetch from 'node-fetch'  

const isLinkTik = /tiktok.com/i 
const isLinkYt = /youtube.com|youtu.be/i 
const isLinkTel = /telegram.com|t.me/i 
const isLinkFb = /facebook.com|fb.me/i 
const isLinkIg = /instagram.com/i 
const isLinkTw = /twitter.com|x.com/i 
const isLinkDc = /discord.com|discord.gg/i 
const isLinkTh = /threads.net/i 
const isLinkTch = /twitch.tv/i
  
let handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
if (!m.isGroup) return 
if (m.fromMe) return
if (isAdmin || isOwner || isROwner || m.fromMe || !isBotAdmin) return

let chat = global.db.data.chats[m.chat]
let bot = global.db.data.settings[this.user.jid] || {}
let delet = m.key.participant
let bang = m.key.id
let toUser = `${m.sender.split("@")[0]}`
let aa = toUser + '@s.whatsapp.net'
    
const isAntiLinkTik = isLinkTik.exec(m.text)
const isAntiLinkYt = isLinkYt.exec(m.text)
const isAntiLinkTel = isLinkTel.exec(m.text)
const isAntiLinkFb = isLinkFb.exec(m.text)
const isAntiLinkIg = isLinkIg.exec(m.text)
const isAntiLinkTw = isLinkTw.exec(m.text)
const isAntiLinkDc = isLinkDc.exec(m.text)
const isAntiLinkTh = isLinkTh.exec(m.text)
const isAntiLinkTch = isLinkTch.exec(m.text)
 
if (chat.antiTiktok && isAntiLinkTik) {  
if (chat.delete) return conn.sendMessage(m.chat, { text: mid.mAdvertencia + mid.mAntiDelete }, { quoted: m })  
if (isBotAdmin) {
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mTiktok} *@${toUser}*`, null, { mentions: [aa] })
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (remove[0].status === '404') return
}}
    
if (chat.antiYoutube && isAntiLinkYt) {
if (chat.delete) return conn.sendMessage(m.chat, { text: mid.mAdvertencia + mid.mAntiDelete }, { quoted: m })  
if (isBotAdmin) {
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mYoutube} *@${toUser}*`, null, { mentions: [aa] })
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (remove[0].status === '404') return
}}
    
if (chat.antiTelegram && isAntiLinkTel) {
if (chat.delete) return conn.sendMessage(m.chat, { text: mid.mAdvertencia + mid.mAntiDelete }, { quoted: m })   
if (isBotAdmin) {
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mTelegram} *@${toUser}*`, null, { mentions: [aa] })
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (remove[0].status === '404') return
}}
    
if (chat.antiFacebook && isAntiLinkFb) {
if (chat.delete) return conn.sendMessage(m.chat, { text: mid.mAdvertencia + mid.mAntiDelete }, { quoted: m })  
if (isBotAdmin) {
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mFacebook} *@${toUser}*`, null, { mentions: [aa] })
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (remove[0].status === '404') return 
}}
    
if (chat.antiInstagram && isAntiLinkIg) {
if (chat.delete) return conn.sendMessage(m.chat, { text: mid.mAdvertencia + mid.mAntiDelete }, { quoted: m })  
if (isBotAdmin) {
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mInstagram} *@${toUser}*`, null, { mentions: [aa] })
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (remove[0].status === '404') return 
}}
    
if (chat.antiTwitter && isAntiLinkTw) {
if (chat.delete) return conn.sendMessage(m.chat, { text: mid.mAdvertencia + mid.mAntiDelete }, { quoted: m })  
if (isBotAdmin) {
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mX} *@${toUser}*`, null, { mentions: [aa] })
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (remove[0].status === '404') return
}}

if (chat.antiDiscord && isAntiLinkDc) {
if (chat.delete) return conn.sendMessage(m.chat, { text: mid.mAdvertencia + mid.mAntiDelete }, { quoted: m })  
if (isBotAdmin) {
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mDiscord} *@${toUser}*`, null, { mentions: [aa] })
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (remove[0].status === '404') return
}}

if (chat.antiThreads && isAntiLinkTh) {
if (chat.delete) return conn.sendMessage(m.chat, { text: mid.mAdvertencia + mid.mAntiDelete }, { quoted: m })  
if (isBotAdmin) {
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mThreads} *@${toUser}*`, null, { mentions: [aa] })
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (remove[0].status === '404') return
}}

if (chat.antiTwitch && isAntiLinkTch) {
if (chat.delete) return conn.sendMessage(m.chat, { text: mid.mAdvertencia + mid.mAntiDelete }, { quoted: m })  
if (isBotAdmin) {
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mTwitch} *@${toUser}*`, null, { mentions: [aa] })
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (remove[0].status === '404') return
}}

return !0
}
export default handler
