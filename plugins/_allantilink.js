import fetch from 'node-fetch'  

const isLinkTik = /\b(?:https?:\/\/)?(?:www\.)?tiktok\.com(\/\S*)?/i
const isLinkYt = /\b(?:https?:\/\/)?(?:www\.)?(youtube\.com|youtu\.be)(\/\S*)?/i
const isLinkTel = /\b(?:https?:\/\/)?(?:www\.)?(telegram\.org|t\.me)(\/\S*)?/i
const isLinkFb = /\b(?:https?:\/\/)?(?:www\.)?(facebook\.com|fb\.me|fb\.watch)(\/\S*)?/i
const isLinkIg = /\b(?:https?:\/\/)?(?:www\.)?instagram\.com(\/\S*)?/i
const isLinkTw = /\b(?:https?:\/\/)?(?:www\.)?(twitter\.com|x\.com)(\/\S*)?/i
const isLinkDc = /\b(?:https?:\/\/)?(?:www\.)?(discord\.com|discord\.gg)(\/\S*)?/i
const isLinkTh = /\b(?:https?:\/\/)?(?:www\.)?threads\.net(\/\S*)?/i
const isLinkTch = /\b(?:https?:\/\/)?(?:www\.)?twitch\.tv(\/\S*)?/i
  
let handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
if (!m.isGroup) return 
if (isAdmin || isOwner || m.fromMe || isROwner || !isBotAdmin) return

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
if (isBotAdmin) {
let wasDeleteActive = chat.delete; 
chat.delete = false; 
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mTiktok} *@${toUser}*`, null, { mentions: [aa] })
await new Promise(resolve => setTimeout(resolve, 100)); 
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }});
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (remove[0].status === '404') return
await new Promise(resolve => setTimeout(resolve, 100)); 
chat.delete = wasDeleteActive;
}}
    
if (chat.antiYoutube && isAntiLinkYt) {
if (isBotAdmin) {
let wasDeleteActive = chat.delete; 
chat.delete = false; 
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mYoutube} *@${toUser}*`, null, { mentions: [aa] })
await new Promise(resolve => setTimeout(resolve, 100)); 
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }});
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
if (remove[0].status === '404') return;
await new Promise(resolve => setTimeout(resolve, 100)); 
chat.delete = wasDeleteActive;
}}
    
if (chat.antiTelegram && isAntiLinkTel) { 
if (isBotAdmin) {
let wasDeleteActive = chat.delete; 
chat.delete = false; 
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mTelegram} *@${toUser}*`, null, { mentions: [aa] })
await new Promise(resolve => setTimeout(resolve, 100)); 
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }});
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
if (remove[0].status === '404') return;
await new Promise(resolve => setTimeout(resolve, 100))
chat.delete = wasDeleteActive
}}
    
if (chat.antiFacebook && isAntiLinkFb) {
if (isBotAdmin) {
let wasDeleteActive = chat.delete; 
chat.delete = false; 
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mFacebook} *@${toUser}*`, null, { mentions: [aa] })
await new Promise(resolve => setTimeout(resolve, 100)); 
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }});
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
if (remove[0].status === '404') return;
await new Promise(resolve => setTimeout(resolve, 100)); 
chat.delete = wasDeleteActive;
}}
    
if (chat.antiInstagram && isAntiLinkIg) { 
if (isBotAdmin) {
let wasDeleteActive = chat.delete; 
chat.delete = false; 
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mInstagram} *@${toUser}*`, null, { mentions: [aa] })
await new Promise(resolve => setTimeout(resolve, 100)); 
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }});
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
if (remove[0].status === '404') return;
await new Promise(resolve => setTimeout(resolve, 100)); 
chat.delete = wasDeleteActive;
}}
    
if (chat.antiTwitter && isAntiLinkTw) {
if (isBotAdmin) {
let wasDeleteActive = chat.delete; 
chat.delete = false; 
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mX} *@${toUser}*`, null, { mentions: [aa] });
await new Promise(resolve => setTimeout(resolve, 100)); 
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }});
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
if (remove[0].status === '404') return;
await new Promise(resolve => setTimeout(resolve, 100)); 
chat.delete = wasDeleteActive;
}}

if (chat.antiDiscord && isAntiLinkDc) {
if (isBotAdmin) {
let wasDeleteActive = chat.delete; 
chat.delete = false; 
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mDiscord} *@${toUser}*`, null, { mentions: [aa] })
await new Promise(resolve => setTimeout(resolve, 100)); 
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }});
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
if (remove[0].status === '404') return;
await new Promise(resolve => setTimeout(resolve, 100)); 
chat.delete = wasDeleteActive;
}}

if (chat.antiThreads && isAntiLinkTh) {
if (isBotAdmin) {
let wasDeleteActive = chat.delete; 
chat.delete = false; 
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mThreads} *@${toUser}*`, null, { mentions: [aa] })
await new Promise(resolve => setTimeout(resolve, 100)); 
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }});
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
if (remove[0].status === '404') return;
await new Promise(resolve => setTimeout(resolve, 100)); 
chat.delete = wasDeleteActive;
}}

if (chat.antiTwitch && isAntiLinkTch) {
if (isBotAdmin) {
let wasDeleteActive = chat.delete; 
chat.delete = false; 
await conn.reply(m.chat, `${mid.mAdvertencia + mid.mTwitch} *@${toUser}*`, null, { mentions: [aa] })
await new Promise(resolve => setTimeout(resolve, 100)); 
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }});
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
if (remove[0].status === '404') return;
await new Promise(resolve => setTimeout(resolve, 100)); 
chat.delete = wasDeleteActive;
}}

return !0
}
export default handler
