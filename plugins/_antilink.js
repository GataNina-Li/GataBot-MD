let linkRegex = /wa.me|whatsapp.com\/channel|chat.whatsapp.com/i

let handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin, participants }) {
  
if (m.isBaileys && m.fromMe) return
if (!m.isGroup) return !1
let chat = global.db.data.chats[m.chat]
let delet = m.key.participant
let bang = m.key.id
const user = `@${m.sender.split`@`[0]}`
//const groupAdmins = participants.filter(p => p.admin)
//const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n')
let bot = global.db.data.settings[this.user.jid] || {}
const isGroupLink = linkRegex.exec(m.text)
const grupo = `https://chat.whatsapp.com`
if (isAdmin && chat.antiLink && m.text.includes(grupo)) return m.reply(mid.mInfo + mid.mAdminTrue)
if (chat.antiLink && isGroupLink && !isAdmin) {
if (isBotAdmin) {
const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
if (m.text.includes(linkThisGroup)) return !0
}      
if (!isBotAdmin) return m.reply(mid.mAdvertencia + mid.mAdmin)
if (chat.delete) return m.reply(mid.mAdvertencia + mid.mAntiDelete)   
if (isBotAdmin) {
await conn.sendMessage(m.chat, { text: `${mid.mAdvertencia + mid.mWhatsApp} *${user}*`, mentions: [m.sender] }, { quoted: m })    
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
//let remove = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
//if (remove[0].status === '404') return
} else if (!bot.restrict) return m.reply(mid.mError + mid.mOwner)
}
return !0
}
export default handler
