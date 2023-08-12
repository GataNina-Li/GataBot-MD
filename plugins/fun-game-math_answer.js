global.math = global.math ? global.math : {}
let handler = async (m, { conn }) => {
  
let id = m.chat
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }  
if (!m.quoted) return
if (m.quoted.sender != conn.user.jid) return
if (!/^𝘾𝙪𝙖𝙡 𝙚𝙨 𝙧𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤 𝙙𝙚/i.test(m.quoted.text)) return
if (!(m.chat in global.math)) return conn.reply(m.chat, `${lenguajeGB['smsAvisoMG']()}𝙔𝘼 𝙎𝙀 𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝙄𝙊 𝙀𝙎𝙏𝘼 𝙋𝙍𝙀𝙂𝙐𝙉𝙏𝘼\n𝙏𝙃𝙄𝙎 𝙌𝙐𝙀𝙎𝙏𝙄𝙊𝙉 𝙃𝘼𝙎 𝘼𝙇𝙍𝙀𝘼𝘿𝙔 𝘽𝙀𝙀𝙉 𝘼𝙉𝙎𝙒𝙀𝙍𝙀𝘿`, m)
//conn.sendButton(m.chat, `${lenguajeGB['smsAvisoMG']()}𝙔𝘼 𝙎𝙀 𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝙄𝙊 𝙀𝙎𝙏𝘼 𝙋𝙍𝙀𝙂𝙐𝙉𝙏𝘼\n𝙏𝙃𝙄𝙎 𝙌𝙐𝙀𝙎𝙏𝙄𝙊𝙉 𝙃𝘼𝙎 𝘼𝙇𝙍𝙀𝘼𝘿𝙔 𝘽𝙀𝙀𝙉 𝘼𝙉𝙎𝙒𝙀𝙍𝙀𝘿`, wm, null, [['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖 𝙅𝙪𝙜𝙖𝙧 🧮', `/math`], ['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']], m)
if (m.quoted.id == global.math[id][0].id) {
let math = global.math[id][1]
let gatacoins = global.db.data.users[m.sender].money += 500
if (m.text == math.result) {
 
await conn.reply(m.chat, `💖 𝙍𝙀𝙎𝙋𝙐𝙀𝙎𝙏𝘼 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝘼\n𝙌𝙐𝙀 𝙋𝙍𝙊 😎\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n𝙂𝘼𝙉𝘼𝙎𝙏𝙀 | 𝙒𝙊𝙉\n🏆 *_${math.bonus}_* 𝙓𝙋\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n𝘽𝙊𝙉𝙊 | 𝘽𝙊𝙉𝙐𝙎\n🎁 *_$500_* 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n𝙎𝙐 𝘿𝙄𝙉𝙀𝙍𝙊 | 𝙔𝙊𝙐𝙍 𝙈𝙊𝙉𝙀𝙔\n💵 *_$${gatacoins}_* 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨`, fkontak, m) 
//conn.sendButton(m.chat, `💖 𝙍𝙀𝙎𝙋𝙐𝙀𝙎𝙏𝘼 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝘼\n𝙌𝙐𝙀 𝙋𝙍𝙊 😎\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n𝙂𝘼𝙉𝘼𝙎𝙏𝙀 | 𝙒𝙊𝙉\n🏆 *_${math.bonus}_* 𝙓𝙋\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n𝘽𝙊𝙉𝙊 | 𝘽𝙊𝙉𝙐𝙎\n🎁 *_$500_* 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n𝙎𝙐 𝘿𝙄𝙉𝙀𝙍𝙊 | 𝙔𝙊𝙐𝙍 𝙈𝙊𝙉𝙀𝙔\n💵 *_$${gatacoins}_* 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨`, wm, null, [['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖 𝙅𝙪𝙜𝙖𝙧 🧮', `/math ${math.mode}`], ['𝙈𝙚𝙣𝙪 𝙅𝙪𝙚𝙜𝙤𝙨 | 𝙂𝙖𝙢𝙚𝙨 𝙈𝙚𝙣𝙪 🎡', `.juegosmenu`]], m)
global.db.data.users[m.sender].exp += math.bonus

clearTimeout(global.math[id][3])
delete global.math[id]
} else {
if (--global.math[id][2] == 0) {
await conn.reply(m.chat, `${lenguajeGB['smsAvisoAG']()}𝙎𝙀 𝘼𝘾𝘼𝘽𝘼𝙍𝙊𝙉 𝙏𝙐𝙎 𝙊𝙋𝙊𝙍𝙏𝙐𝙉𝙄𝘿𝘼𝘿𝙀𝙎\n𝙇𝘼 𝙍𝙀𝙎𝙋𝙐𝙀𝙎𝙏𝘼 𝙀𝙎 *${math.result}*\n\n𝙔𝙊𝙐𝙍 𝙏𝙐𝙍𝙉𝙎 𝘼𝙍𝙀 𝙊𝙑𝙀𝙍\n𝙏𝙃𝙀 𝘼𝙉𝙎𝙒𝙀𝙍 𝙄𝙎 *${math.result}*`, m)
//conn.sendButton(m.chat, `${lenguajeGB['smsAvisoAG']()}𝙎𝙀 𝘼𝘾𝘼𝘽𝘼𝙍𝙊𝙉 𝙏𝙐𝙎 𝙊𝙋𝙊𝙍𝙏𝙐𝙉𝙄𝘿𝘼𝘿𝙀𝙎\n𝙇𝘼 𝙍𝙀𝙎𝙋𝙐𝙀𝙎𝙏𝘼 𝙀𝙎 *${math.result}*\n\n𝙔𝙊𝙐𝙍 𝙏𝙐𝙍𝙉𝙎 𝘼𝙍𝙀 𝙊𝙑𝙀𝙍\n𝙏𝙃𝙀 𝘼𝙉𝙎𝙒𝙀𝙍 𝙄𝙎 *${math.result}*`, wm, null, [['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖 𝙅𝙪𝙜𝙖𝙧 🧮', `/math ${math.mode}`], ['𝙏𝙤𝙥𝙨 | 𝙍𝙖𝙣𝙠𝙞𝙣𝙜 🏆', `.top`]], m)
clearTimeout(global.math[id][3])
delete global.math[id]
} else conn.reply(m.chat, `${lenguajeGB['smsAvisoFG']()}𝙍𝙀𝙎𝙋𝙐𝙀𝙎𝙏𝘼 𝙄𝙉𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝘼!!\n𝙏𝙀 𝙌𝙐𝙀𝘿𝘼𝙉 *${global.math[id][2]}* 𝙊𝙋𝙊𝙍𝙏𝙐𝙉𝙄𝘿𝘼𝘿𝙀𝙎 😱\n\n𝙒𝙍𝙊𝙉𝙂 𝘼𝙉𝙎𝙒𝙀𝙍!!\n𝙄𝙏 𝙁𝙄𝙏𝙎 𝙔𝙊𝙐 *${global.math[id][2]}* 𝙏𝙐𝙍𝙉𝙎 🤯`, m)
}}}

handler.customPrefix = /^-?[0-9]+(\.[0-9]+)?$/
handler.command = new RegExp
handler.exp = 0
export default handler
