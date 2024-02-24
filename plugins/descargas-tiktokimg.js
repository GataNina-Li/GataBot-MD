import fetch from 'node-fetch'

let handler = async(m, { conn, text, usedPrefix, command }) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()}${mid.smsMalused7}\n${usedPrefix + command} https://vm.tiktok.com/`
if (!(text.includes('http://') || text.includes('https://'))) throw `${mid.smsTikTok3}`
if (!text.includes('tiktok.com')) throw `${mid.smsTikTok3}`
try {
let res = await fetch(`https://api.lolhuman.xyz/api/tiktokslide?apikey=${global.lolkeysapi}&url=${text}`)
let anu = await res.json()
if (anu.status != '200') throw Error(anu.message)
anu = anu.result
if (anu.length == 0) throw Error('Error : no data')
let c = 0 
for (let x of anu) {
if (c == 0) await conn.sendMessage(m.chat, { image: { url: x }, caption: `✅ ${mid.smsTikTok5(anu)}` }, { quoted : m })
else await conn.sendMessage(m.sender, { image: { url: x } }, { quoted : m })
c += 1
}
} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
handler.limit = false
}}
handler.menu = ['tiktokslide <url>']
handler.tags = ['search']
handler.command = /^((tt|tiktok)imagen)$/i
handler.register = true
handler.level = 4
handler.limit = 3
export default handler
