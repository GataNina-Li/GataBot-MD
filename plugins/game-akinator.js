import fetch from 'node-fetch'
import translate from '@vitalets/google-translate-api'
let handler = async (m, { conn, usedPrefix, command, text }) => {
if (m.isGroup) return
let aki = global.db.data.users[m.sender].akinator
if (text == 'end') {
if (!aki.sesi) return m.reply('╰⊱❕⊱ *𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊́𝙉 | 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝙏𝙄𝙊𝙉* ⊱⊱╮\n\n𝘼𝘾𝙏𝙐𝘼𝙇𝙈𝙀𝙉𝙏𝙀 𝙉𝙊 𝙀𝙎𝙏𝘼𝙎 𝙀𝙉 𝙐𝙉𝘼 𝙎𝙀𝙎𝙄𝙊́𝙉 (𝙋𝘼𝙍𝙏𝙄𝘿𝘼) 𝘿𝙀 𝘼𝙆𝙄𝙉𝘼𝙏𝙊𝙍')
aki.sesi = false
aki.soal = null
m.reply('╰⊱💚⊱ *𝙀́𝙓𝙄𝙏𝙊 | 𝙎𝙐𝘾𝘾𝙀𝙎𝙎* ⊱💚⊱╮\n\n𝙎𝙀 𝙀𝙇𝙄𝙈𝙄𝙉𝙊 𝘾𝙊𝙉 𝙀𝙓𝙄𝙏𝙊 𝙇𝘼 𝙎𝙀𝙎𝙄𝙊𝙉 (𝙋𝘼𝙍𝙏𝙄𝘿𝘼) 𝘿𝙀 𝘼𝙆𝙄𝙉𝘼𝙏𝙊𝙍')
} else {
if (aki.sesi) return await conn.reply(m.chat, '╰⊱⚠️⊱ *𝘼𝘿𝙑𝙀𝙍𝙏𝙀𝙉𝘾𝙄𝘼 | 𝙒𝘼𝙍𝙉𝙄𝙉𝙂* ⊱⚠️⊱╮\n\n𝙏𝙊𝘿𝘼𝙑𝙄𝘼 𝙀𝙎𝙏𝘼𝙎  𝙀𝙉 𝙐𝙉𝘼 𝙎𝙀𝙎𝙄𝙊́𝙉 (𝙋𝘼𝙍𝙏𝙄𝘿𝘼) 𝘿𝙀 𝘼𝙆𝙄𝙉𝘼𝙏𝙊𝙍', aki.soal)
try {
let res = await fetch(`https://api.lolhuman.xyz/api/akinator/start?apikey=${lolkeysapi}`)
let anu = await res.json()
if (anu.status !== 200) throw '${lenguajeGB[smsAvisoFG]()} 𝙀𝙍𝙍𝙊𝙍, 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙇𝙊 𝙈𝘼𝙎 𝙏𝘼𝙍𝘿𝙀'
let { server, frontaddr, session, signature, question, progression, step } = anu.result
aki.sesi = true
aki.server = server
aki.frontaddr = frontaddr
aki.session = session
aki.signature = signature
aki.question = question
aki.progression = progression
aki.step = step
let resultes2 = await translate(question, { to: 'es', autoCorrect: false })
let txt = `🎮 *𝐀𝐊𝐈𝐍𝐀𝐓𝐎𝐑* 🎮\n\n*𝙅𝙐𝙂𝘼𝘿𝙊𝙍: @${m.sender.split('@')[0]}*\n*𝙋𝙍𝙀𝙂𝙐𝙉𝙏𝘼: ${resultes2.text}*\n\n`
txt += '*0 - Sí*\n'
txt += '*1 - No*\n'
txt += '*2 - No sé*\n'
txt += '*3 - Probablemente sí*\n'
txt += '*4 - Probablemente no*\n\n'
txt += `*𝙐𝙎𝘼 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 ${usedPrefix + command} end 𝙋𝘼𝙍𝘼 𝙎𝘼𝙇𝙄𝙍 𝘿𝙀 𝙇𝘼 𝙎𝙀𝙎𝙄𝙊𝙉 (𝙋𝘼𝙍𝙏𝙄𝘿𝘼) 𝘿𝙀 𝘼𝙆𝙄𝙉𝘼𝙏𝙊𝙍*`
let soal = await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] }, { quoted: m })
aki.soal = soal
} catch {
m.reply('╰⊱❌⊱ *𝙁𝘼𝙇𝙇𝙊́ | 𝙀𝙍𝙍𝙊𝙍* ⊱❌⊱╮\n\n𝙀𝙍𝙍𝙊𝙍, 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙇𝙊 𝙈𝘼𝙎 𝙏𝘼𝙍𝘿𝙀')
}}}
handler.menu = ['akinator']
handler.tags  = ['game']
handler.command = /^(akinator)$/i
export default handler
