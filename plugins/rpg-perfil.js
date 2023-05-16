import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import { canLevelUp, xpRange } from '../lib/levelling.js'
//import db from '../lib/database.js'

let handler = async (m, { conn, usedPrefix, command}) => {

let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
if (!(who in global.db.data.users)) throw `*⚠️ El usuario no se encuentra en mi base de datos*`
let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './src/avatar_contact.png')
let user = global.db.data.users[who]
let { name, exp, limit, registered, age, level, role } = global.db.data.users[who]
let { min, xp, max } = xpRange(user.level, global.multiplier)
let username = conn.getName(who)
let math = max - xp
let prem = global.prems.includes(who.split`@`[0])
let sn = createHash('md5').update(who).digest('hex')
let fkon = { key: { fromMe: false, participant: `${m.sender.split`@`[0]}@s.whatsapp.net`, ...(m.chat ? { remoteJid: '16504228206@s.whatsapp.net' } : {}) }, message: { contactMessage: { displayName: `${name}`, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}}
let str = `
]──────❏ *PERFIL* ❏──────[
 ┃ 💌 𝙉𝙤𝙢𝙗𝙧𝙚: ${username} ${registered ? '\n┃🎐 𝙉𝙤𝙢𝙗𝙧𝙚 𝙙𝙚 𝙪𝙨𝙪𝙖𝙧𝙞𝙤:' + name + ' ': ''}
 ┃ 📧 𝙏𝙖𝙜: @${who.replace(/@.+/, '')}
 ┃ 📞 𝙉𝙪𝙢𝙚𝙧𝙤: ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
 ┃ 🔗 𝙇𝙞𝙣𝙠: wa.me/${who.split`@`[0]}${registered ? '\n*🎨 • Edad*: ' + age + ' años' : ''}
 ┃💎 𝘿𝙞𝙖𝙢𝙖𝙣𝙩𝙚𝙨: ${limit}
 ┃ 📊 𝙉𝙞𝙫𝙚𝙡: ${level}
 ┃ ✨ 𝙓𝙥: Total ${exp} (${user.exp - min} / ${xp})
 ┃ 🏆 𝙍𝙖𝙣𝙜𝙤: ${role}
 ┃ 📑 𝙍𝙚𝙜𝙞𝙨𝙩𝙧𝙖𝙙𝙤: ${registered ? '✅': '❌'}
 ┃⭐ 𝙋𝙧𝙚𝙢𝙞𝙪𝙢: ${prem ? '✅' : '❌'}`
    conn.sendFile(m.chat, pp, 'perfil.jpg', str, fkon, false, { mentions: [who]})
 
}
handler.help = ['perfil']
handler.tags = ['group']
handler.command = ['profile', 'perfil'] 

export default handler
