import { pinterest } from '@bochilteam/scraper'
let handler = async(m, { conn, text, usedPrefix, command }) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()} ${mid.smsMalused7}\n*${usedPrefix + command} gata | cat*` 
try {
const json = await pinterest(text)
conn.sendButton(m.chat, `💞 ${mid.buscador} ${text}`, `𝙋𝙞𝙣𝙩𝙚𝙧𝙚𝙨𝙩 | ${wm}`, json.getRandom(), [
['🔄 𝙎𝙞𝙜𝙪𝙞𝙚𝙣𝙩𝙚 | 𝙉𝙚𝙭𝙩', `${usedPrefix}pinterest ${text}`]], null, null, m)
//await conn.sendFile(m.chat, json.getRandom(), 'error.jpg', `${lenguajeGB['smsAvisoEG']()} 💞 ${mid.buscador}: ${text}`.trim(), m)
} catch (e) {
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
handler.money = false
}}
handler.help = ['pinterest <keyword>']
handler.tags = ['internet']
handler.command = /^(pinterest|dlpinterest|pinterestdl)$/i
handler.money = 50
export default handler

/*conn.sendHydrated(m.chat, `💞 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤 | 𝙍𝙚𝙨𝙪𝙡𝙩: ${text}`, `𝙋𝙞𝙣𝙩𝙚𝙧𝙚𝙨𝙩 | ${wm}`, null, md, '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', null, null, [
['🔄 𝙎𝙞𝙜𝙪𝙞𝙚𝙣𝙩𝙚 | 𝙉𝙚𝙭𝙩', `/pinterest ${text}`],
['🔍 𝙂𝙤𝙤𝙜𝙡𝙚 ', `#image ${text}`],
['🐈 𝙈𝙚𝙣𝙪', `.menu`],  
], m)*/
