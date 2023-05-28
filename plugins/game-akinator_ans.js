import fetch from 'node-fetch'
import translate from '@vitalets/google-translate-api'
const teks = '*0 - Sí*\n*1 - No*\n*2 - No sé*\n*3 - Probablemente sí*\n*4 - Probablemente no*\n*5 - Volver a la pregunta anterior*'
export async function before(m) {
if (global.db.data.users[m.sender].banned) return
if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text) return !0
let aki = global.db.data.users[m.sender].akinator
if (!aki.sesi || m.quoted.id != aki.soal.key.id) return
if (!somematch(['0','1','2','3','4','5'], m.text)) return this.sendMessage(m.chat, { text: `╰⊱❗️⊱ *𝙇𝙊 𝙐𝙎𝙊́ 𝙈𝘼𝙇 | 𝙐𝙎𝙀𝘿 𝙄𝙏 𝙒𝙍𝙊𝙉𝙂* ⊱❗️⊱╮\n\n𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝘼 𝘾𝙊𝙉 𝙇𝙊𝙎 𝙉𝙐́𝙈𝙀𝙍𝙊𝙎 𝟷, 𝟸, 𝟹, 𝟺 𝚘 𝟻\n\n${teks}` }, { quoted: aki.soal })
let { server, frontaddr, session, signature, question, progression, step } = aki
if (step == '0' && m.text == '5') return m.reply('╰⊱⚠️⊱ *𝘼𝘿𝙑𝙀𝙍𝙏𝙀𝙉𝘾𝙄𝘼 | 𝙒𝘼𝙍𝙉𝙄𝙉𝙂* ⊱⚠️⊱╮\n\n𝙔𝘼 𝙉𝙊 𝙃𝘼𝙔 𝙈𝘼𝙎 𝙋𝙍𝙀𝙂𝙐𝙉𝙏𝘼 𝘼𝙉𝙏𝙀𝙍𝙄𝙊𝙍𝙀𝙎 𝘼 𝙀𝙎𝙏𝘼, 𝙀𝙎𝙏𝘼 𝙀𝙎 𝙇𝘼 𝙋𝙍𝙄𝙈𝙀𝙍𝘼 𝙋𝙍𝙀𝙂𝙐𝙉𝙏𝘼 :v')
let res, anu, soal
try {
if (m.text == '5') res = await fetch(`https://api.lolhuman.xyz/api/akinator/back?apikey=${lolkeysapi}&server=${server}&session=${session}&signature=${signature}&step=${step}`)
else res = await fetch(`https://api.lolhuman.xyz/api/akinator/answer?apikey=${lolkeysapi}&server=${server}&frontaddr=${frontaddr}&session=${session}&signature=${signature}&step=${step}&answer=${m.text}`)
anu = await res.json()
if (anu.status != '200') {
aki.sesi = false
aki.soal = null
return m.reply('╰⊱⚠️⊱ *𝘼𝘿𝙑𝙀𝙍𝙏𝙀𝙉𝘾𝙄𝘼 | 𝙒𝘼𝙍𝙉𝙄𝙉𝙂* ⊱⚠️⊱╮\n\n𝙇𝘼 𝙎𝙀𝙎𝙄𝙊𝙉 𝘿𝙀 𝘼𝙆𝙄𝙉𝘼𝙏𝙊𝙍 𝙃𝘼 𝘾𝘼𝘿𝙐𝘾𝘼𝘿𝙊, 𝙀𝙇 𝙅𝙐𝙀𝙂𝙊 𝙃𝘼 𝙏𝙀𝙍𝙈𝙄𝙉𝘼𝘿𝙊')}
anu = anu.result
if (anu.name) {
await this.sendMessage(m.chat, { image: { url: anu.image }, caption: `🎮 *𝐀𝐊𝐈𝐍𝐀𝐓𝐎𝐑* 🎮\n\n*𝘼𝙆𝙄𝙉𝘼𝙏𝙊𝙍 𝘾𝙍𝙀𝙀 𝙌𝙐𝙀 𝙏𝙐 𝙋𝙀𝙍𝙎𝙊𝙉𝘼𝙅𝙀 𝙀𝙎 ${anu.name}*\n_${anu.description}_`, mentions: [m.sender] }, { quoted: m })
aki.sesi = false
aki.soal = null
} else {
let resultes = await translate(`${anu.question}`, { to: 'es', autoCorrect: true })   
soal = await this.sendMessage(m.chat, { text: `🎮 *𝐀𝐊𝐈𝐍𝐀𝐓𝐎𝐑* 🎮\n*𝙋𝙍𝙊𝙂𝙍𝙀𝙎𝙊: ${anu.step} (${anu.progression.toFixed(2)} %)*\n\n*𝙅𝙐𝙂𝘼𝘿𝙊𝙍: @${m.sender.split('@')[0]}*\n*𝙋𝙍𝙀𝙂𝙐𝙉𝙏𝘼: ${resultes.text}*\n\n${teks}`, mentions: [m.sender] }, { quoted: m })
aki.soal = soal
aki.step = anu.step
aki.progression = anu.progression
}} catch (e) {
aki.sesi = false
aki.soal = null
m.reply('╰⊱❌⊱ *𝙁𝘼𝙇𝙇𝙊́ | 𝙀𝙍𝙍𝙊𝙍* ⊱❌⊱╮\n\n𝙀𝙍𝙍𝙊𝙍, 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙇𝙊 𝙈𝘼𝙎 𝙏𝘼𝙍𝘿𝙀')}
return !0 }
function somematch( data, id ){
let res = data.find(el => el === id )
return res ? true : false; }
