import { wallpaper } from '@bochilteam/scraper'
let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()}}${mid.smsMalused7}\n${usedPrefix + command} Gata | cat`
const res = await (/2/.test(command) ? wallpaperv2 : wallpaper)(text)
const img = res[Math.floor(Math.random() * res.length)]
let link = img
conn.sendFile(m.chat, img, 'error.jpg', `*💞 ${mid.buscador} ${text}*\n${wm}`, m)
/*conn.sendHydrated(m.chat, `💞 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤 | 𝙍𝙚𝙨𝙪𝙡𝙩: ${text}`, `𝙁𝙤𝙣𝙙𝙤 | 𝙒𝙥 | ${wm}`, img, img, '☘️ 𝙐𝙍𝙇', null, null, [
['🔄 𝙎𝙞𝙜𝙪𝙞𝙚𝙣𝙩𝙚 | 𝙉𝙚𝙭𝙩', `${usedPrefix + command} ${text}`],
['🔍 𝙋𝙞𝙣𝙩𝙚𝙧𝙚𝙨𝙩 ', `#pinterest ${text}`],
['🔍 𝙂𝙤𝙤𝙜𝙡𝙚 ', `#image ${text}`],
], m)*/
}
handler.help = ['', '2'].map(v => 'wallpaper' + v + ' <query>')
handler.tags = ['downloader']
handler.command = /^(wp|wallpaper2?)$/i
handler.exp = 29
handler.limit = 1
handler.level = 3
export default handler 
