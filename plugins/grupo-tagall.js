let handler = async(m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix }) => {
if (!(isAdmin || isOwner)) {
global.dfail('admin', m, conn)
throw false
}
let pesan = args.join` `
let oi = `*ღ 𝙈𝙀𝙉𝙎𝘼𝙅𝙀:* ${pesan}`
let teks = `╭━〔 *𝙄𝙉𝙑𝙊𝘾𝘼𝙉𝘿𝙊 𝘼𝙇 𝙂𝙍𝙐𝙋𝙊* 〕━⬣\n\n${oi}\n\n`
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)
for (let username of participants) {
teks += `┃➥ @${username.id.split('@')[0]}\n`}
teks += `╰━━━━━━[ *𓃠 ${vs}* ]━━━━━⬣`
//conn.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, )
  
conn.sendHydrated(m.chat, teks, `𝙀𝙩𝙞𝙦𝙪𝙚𝙩𝙖𝙨 | ${wm}`, null, 'https://github.com/ColapsusHD/FutabuBot-MD', '𝙵𝚞𝚝𝚊𝚋𝚞𝙱𝚘𝚝-𝙼𝙳', null, null, [
['𝙄𝙣𝙫𝙤𝙘𝙖𝙧 𝙤𝙩𝙧𝙖 𝙫𝙚𝙯 📣', `${usedPrefix + command}`],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘', '.menu']
], m, { mentions: participants.map(a => a.id) })  
}
handler.help = ['tagall <mesaje>','invocar <mesaje>']
handler.tags = ['group']
handler.command = /^(tagall|invocar|invocacion|invocación)$/i
handler.botAdmin = true
handler.admin = true
handler.group = true
export default handler
