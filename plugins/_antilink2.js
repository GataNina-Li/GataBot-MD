// Esta versión actualizada detecta enlaces aunque no tengan presente el protocolo https

const linkRegex = (text) => {
const urlRegex = /(?:[a-zA-Z]+:\/\/[^\s]+)|(?:\b(www\.|ftp\.)[^\s]+\.[a-z]{2,}\/?[^\s]*)|(?:\b[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?)/gi
const urls = [...new Set((text.match(urlRegex) || [])
.map(m => m.replace(/[.,;!?]+$/, '')) 
.map(m => /^(?:www\.|ftp\.)/.test(m) ? 'http://' + m : m) 
.map(m => /^(?!https?:\/\/|ftp:\/\/)/.test(m) ? 'http://' + m : m) 
.filter(u => { 
try { 
const parsed = new URL(u);
return /^[a-z0-9.-]+\.[a-z]{2,}$/.test(parsed.hostname)
} catch { 
return false
}})
)]
return urls.length > 0
}

let handler = m => m
handler.before = async function (m, { isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
if (!m.isGroup) return 
if (isAdmin || isOwner || m.fromMe || isROwner || !isBotAdmin) return

let chat = global.db.data.chats[m.chat]
let delet = m.key.participant
let bang = m.key.id
const user = `@${m.sender.split`@`[0]}`
//const groupAdmins = participants.filter(p => p.admin)
//const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n')
let bot = global.db.data.settings[this.user.jid] || {}
const isGroupLink = linkRegex(m.text) 
if (chat.antiLink2 && isGroupLink) {
//if (chat.delete) return conn.sendMessage(m.chat, { text: mid.mAdvertencia + mid.mAntiDelete }, { quoted: m }) 
if (isBotAdmin) {
const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
if (m.text.includes(linkThisGroup)) return !0
}     
if (isBotAdmin) {
await conn.sendMessage(m.chat, { text: `${mid.mAdvertencia + mid.mWhatsApp2} *${user}*`, mentions: [m.sender] }, { quoted: m })    
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (remove[0].status === '404') return
}}
return !0
}
export default handler
