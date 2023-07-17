let handler = async (m, { conn, usedPrefix, text, command }) => {
let hash = text
if (m.quoted && m.quoted.fileSha256) hash = m.quoted.fileSha256.toString('hex')
if (!hash) throw `${lenguajeGB['smsAvisoMG']()}𝙎𝙊𝙇𝙊 𝙎𝙀 𝙋𝙐𝙀𝘿𝙀 𝘼𝙎𝙄𝙂𝙉𝘼𝙍 𝙏𝙀𝙓𝙏𝙊 𝙊 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝘼 𝙎𝙏𝙄𝘾𝙆𝙀𝙍  𝙀 𝙄𝙈𝘼𝙂𝙀𝙉, 𝙋𝘼𝙍𝘼 𝙊𝘽𝙏𝙀𝙉𝙀𝙍 𝙀𝙇 𝘾𝙊𝘿𝙄𝙂𝙊 𝘼𝙎𝙄𝙂𝙉𝘼𝘿𝙊 𝙐𝙎𝙀 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 ${usedPrefix}listcmd*`
let sticker = global.db.data.sticker
if (sticker[hash] && sticker[hash].locked) throw `${lenguajeGB['smsAvisoAG']()}𝙎𝙊𝙇𝙊 𝙈𝙄 𝙋𝙍𝙊𝙋𝙄𝙀𝙏𝘼𝙍𝙄𝙊 𝙋𝙐𝙀𝘿𝙀 𝙍𝙀𝘼𝙇𝙄𝙕𝘼𝙍 𝙀𝙎𝙏𝘼 𝙈𝙊𝘿𝙄𝙁𝙄𝘾𝘼𝘾𝙄𝙊́𝙉`
delete sticker[hash]
m.reply(`${lenguajeGB['smsAvisoEG']()}𝙀𝙇 𝙏𝙀𝙓𝙏𝙊/𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝘼𝙎𝙄𝙂𝙉𝘼𝘿𝙊 𝘼𝙇 𝙎𝙏𝙄𝘾𝙆𝙀𝙍 𝙀 𝙄𝙈𝘼𝙂𝙀𝙉 𝙁𝙐𝙀 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝘿𝙊 𝘿𝙀 𝙇𝘼 𝘽𝘼𝙎𝙀 𝘿𝙀 𝘿𝘼𝙏𝙊𝙎 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝘼𝙈𝙀𝙉𝙏𝙀`)}
handler.command = ['delcmd']
handler.rowner = true
export default handler
