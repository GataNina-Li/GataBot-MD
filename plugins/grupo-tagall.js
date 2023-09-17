let handler = async(m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
if (!(isAdmin || isOwner)) {
global.dfail('admin', m, conn)
throw false
}
let pesan = args.join` `
let oi = `ღ ${lenguajeGB['smsAddB5']()} ${pesan}`
let teks = `𝙇𝙄𝙎𝙏𝘼 𝘾𝙊𝙈𝙋𝙇𝙀𝙏𝘼 🧤\n\n`
for (let mem of participants) {
teks += `🌀⊹ @${mem.id.split('@')[0]}\n`}
teks += `╰━━━━━[ ALCA BOT ]━━━━━⬣`
conn.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, )  
}
handler.command = /^(tagall|invocar|invocacion|todos|invocación)$/i
handler.admin = true
handler.group = true
export default handler