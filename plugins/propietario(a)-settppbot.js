let handler = async (m, { conn, usedPrefix, command }) => {
const userProfile = conn.user.jid || global.conn.user.jid
let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || q.mediaType || ''
if (/image/.test(mime)) {
let img = await q.download()
if (!img) throw `${lenguajeGB['smsAvisoFG']()}𝙉𝙊 𝙎𝙀 𝙀𝙉𝘾𝙊𝙉𝙏𝙍𝙊́ 𝙇𝘼 𝙄𝙈𝘼𝙂𝙀𝙉 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍 𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝙀 𝘼 𝙐𝙉𝘼 𝙄𝙈𝘼𝙂𝙀𝙉 𝙐𝙎𝘼𝙉𝘿𝙊 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 ${usedPrefix + command}*`;
await conn.updateProfilePicture(userProfile, img).then(_ => m.reply(`${lenguajeGB['smsAvisoEG']()}𝙎𝙀 𝘾𝘼𝙈𝘽𝙄𝙊 𝘾𝙊𝙉 𝙀𝙓𝙄𝙏𝙊 𝙇𝘼 𝙁𝙊𝙏𝙊 𝘿𝙀 𝙋𝙀𝙍𝙁𝙄𝙇 𝘿𝙀𝙇 𝘽𝙊𝙏`))
} else throw `${lenguajeGB['smsAvisoEG']()}𝙉𝙊 𝙎𝙀 𝙀𝙉𝘾𝙊𝙉𝙏𝙍𝙊́ 𝙇𝘼 𝙄𝙈𝘼𝙂𝙀𝙉 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍 𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝙀 𝘼 𝙐𝙉𝘼 𝙄𝙈𝘼𝙂𝙀𝙉 𝙐𝙎𝘼𝙉𝘿𝙊 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 ${usedPrefix + command}`
}
handler.help = ["setppbot"]
handler.tags = ["owner"]
handler.command = /^setppbot|cambiafoto|fotobot$/i;
handler.owner = true;

export default handler;