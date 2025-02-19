let linkRegex1 = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})|5chat-whatzapp\.vercel\.app/i;
let linkRegex2 = /whatsapp.com\/channel\/([0-9A-Za-z]{20,24})/i;

let handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
if (!m.isGroup) return 
if (isAdmin || isOwner || m.fromMe || isROwner || !isBotAdmin) return

let chat = global.db.data.chats[m.chat]
let delet = m.key.participant
let bang = m.key.id
const user = `@${m.sender.split`@`[0]}`
const groupAdmins = participants.filter(p => p.admin)
const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n')
let bot = global.db.data.settings[this.user.jid] || {}
const isGroupLink = linkRegex1.exec(m.text) || linkRegex2.exec(m.text);
if (chat.antiLink && isGroupLink) {
const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
//if (chat.delete) return conn.sendMessage(m.chat, { text: mid.mAdvertencia + mid.mAntiDelete }, { quoted: m }) 
if (!isBotAdmin) return conn.sendMessage(m.chat, { text: mid.mAdminTrue, mentions: [...groupAdmins.map(v => v.id)] }, { quoted: m });
if (isBotAdmin) {
if (m.text.includes(linkThisGroup)) return
await conn.sendMessage(m.chat, { text: `${mid.mAdvertencia + mid.mWhatsApp} *${user}*`, mentions: [m.sender] }, { quoted: m })    
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (remove[0].status === '404') return
}}
return !0
}
export default handler
