import fetch from 'node-fetch'
let handler = async (m, { conn, args, text, command, usedPrefix }) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()}${mid.TikTok}\n*${usedPrefix + command} Gata_Dios*`
let res = `https://api.lolhuman.xyz/api/pptiktok/${text}?apikey=${lolkeysapi}`
await conn.sendFile(m.chat, res, 'error.jpg', `✅ ${mid.TikTok1}\n💟 *${text}*`, m, false)
conn.reply(m.chat, `${lenguajeGB['smsAvisoIIG']()} *${mid.smsinfo}*`, m, {
contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, 
title: '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿 | 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨',
body: 'Super Bot WhatsApp',         
previewType: 0, thumbnail: fs.readFileSync("./media/menus/Menu3.jpg"),
sourceUrl: md}}})
/*conn.sendHydrated(m.chat, info, wm, null, md, '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', null, null, [
['𝙈𝙚𝙣𝙪 𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙨 🌀', '#descargasmenu'],
['𝙈𝙚𝙣𝙪 𝘾𝙤𝙢𝙥𝙡𝙚𝙩𝙤 | 𝙁𝙪𝙡𝙡 𝙈𝙚𝙣𝙪 ✨', '.allmenu'],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m,)*/
}
handler.help = ['tiktokfoto'].map(v => v + ' <username>')
handler.tags = ['downloader']
handler.command = /^(tiktokfoto|tiktokphoto)$/i
handler.limit = 1
handler.exp = 68
export default handler
