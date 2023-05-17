import yts from "yt-search"
let handler = async (m, { text, conn, args, command, usedPrefix }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
if (!text) return conn.reply(m.chat, `${lenguajeGB['smsAvisoMG']()}𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝙐𝙉 𝙑𝙄𝘿𝙀𝙊 𝙊 𝘾𝘼𝙉𝘼𝙇 𝘿𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀\n\n𝙒𝙍𝙄𝙏𝙀 𝙏𝙃𝙀 𝙉𝘼𝙈𝙀 𝙊𝙁 𝘼 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 𝙑𝙄𝘿𝙀𝙊 𝙊𝙍 𝘾𝙃𝘼𝙉𝙉𝙀𝙇`, fkontak,  m)
//await conn.reply(m.chat, global.wait, m)
  let results = await yts(text)
  let tes = results.all
  let teks = results.all.map(v => {
    switch (v.type) { 
      case 'video': return `❤️꙰༻ *TÍTULO:* ${v.title}
⁖🩵꙰༻ *ENLACE:* ${v.url}
⁖💜꙰༻ *DURACIÓN:* ${v.timestamp}
⁖💚꙰༻ *SUBIDO:* ${v.ago}
⁖🧡꙰༻ *VISTAS:* ${v.views}`}}).filter(v => v).join('\n\n••••••••••••••••••••••••••••••••••••\n\n')
  conn.sendFile(m.chat, tes[0].thumbnail, 'yts.jpeg', teks, fkontak, m)
}
handler.help = ['', 'earch'].map(v => 'yts' + v + ' <pencarian>')
handler.tags = ['tools']
handler.command = /^playlist|ytbuscar|yts(earch)?$/i
handler.exp = 70
handler.limit = 1
handler.level = 4
export default handler


/*import yts from "yt-search"
let handler = async (m, { text, conn, args, command, usedPrefix }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
if (!text) return conn.reply(m.chat, `${lenguajeGB['smsAvisoMG']()}𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝙐𝙉 𝙑𝙄𝘿𝙀𝙊 𝙊 𝘾𝘼𝙉𝘼𝙇 𝘿𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀\n\n𝙒𝙍𝙄𝙏𝙀 𝙏𝙃𝙀 𝙉𝘼𝙈𝙀 𝙊𝙁 𝘼 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 𝙑𝙄𝘿𝙀𝙊 𝙊𝙍 𝘾𝙃𝘼𝙉𝙉𝙀𝙇`, fkontak,  m)
try {
let search = await yts(args.join(" "))
let listAudio = []
let listVideo = []
let listAudioDoc = []
let listVideoDoc = []
let teskd = `𝘽𝙪𝙨𝙦𝙪𝙚𝙙𝙖 𝙙𝙚 *${args.join(" ")}*`

const sections = [{ title: comienzo + ' 𝗔 𝗨 𝗗 𝗜 𝗢 ' + fin, rows: listAudio },
{ title: comienzo + ' 𝗩 𝗜 𝗗 𝗘 𝗢 ' + fin, rows: listVideo },
{ title: comienzo + ' 𝗔 𝗨 𝗗 𝗜 𝗢   𝗗 𝗢 𝗖 ' + fin, rows: listAudioDoc },
{ title: comienzo + ' 𝗩 𝗜 𝗗 𝗘 𝗢   𝗗 𝗢 𝗖 ' + fin, rows: listVideoDoc }]

const listMessage = {
text: teskd,
footer: '𝙀𝙡𝙞𝙟𝙖 𝙨𝙪 𝘽𝙪𝙨𝙦𝙪𝙚𝙙𝙖 𝙥𝙖𝙧𝙖 𝙥𝙤𝙙𝙚𝙧 𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙧\n' + wm,
title: `${htki} *𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊𝙎* ${htka}`,
buttonText: "🔎 𝗕 𝗨 𝗦 𝗖 𝗔 𝗥",
sections}

if (m.isGroup) return m.reply('*✳️ 𝙃𝙊𝙇𝘼 𝙀𝙎𝙏𝙄𝙈𝘼𝘿𝙊 𝙐𝙎𝙐𝘼𝙍𝙄𝙊(𝘼), 𝙎𝙐 𝙋𝙀𝙍𝘿𝙄𝘿𝙊 𝙃𝘼 𝙎𝙄𝘿𝙊 𝙀𝙉𝙑𝙄𝘼𝘿𝙊 𝘼 𝙎𝙐 𝘾𝙃𝘼𝙏 𝙋𝙍𝙄𝙑𝘼𝘿𝙊, 𝙀𝙎𝙏𝙊 𝘾𝙊𝙈𝙊 𝙎𝙊𝙇𝙐𝘾𝙄𝙊𝙉 𝙏𝙀𝙈𝙋𝙊𝙍𝘼𝙇 𝘼 𝙀𝙍𝙍𝙊𝙍𝙀𝙎 𝘿𝙀 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝘾𝙊𝙉 𝘽𝙊𝙏𝙊𝙉𝙀𝙎 𝙏𝙄𝙋𝙊 𝙇𝙄𝙎𝙏𝘼𝙎 𝙌𝙐𝙀 𝙉𝙊 𝙎𝙊𝙉 𝙑𝙄𝙎𝙄𝘽𝙇𝙀𝙎 𝙀𝙉 𝙇𝘼𝙎 𝙑𝙀𝙍𝙎𝙄𝙊𝙉𝙀𝙎 𝙈𝘼𝙎 𝙍𝙀𝘾𝙄𝙀𝙉𝙏𝙀𝙎 𝘿𝙀 𝙒𝙃𝘼𝙏𝙎𝘼𝙋𝙋*')        
} catch {
try {     
for (let i of search.all) {
listAudio.push({title: i.title, description: `${i.author.name} | ${i.timestamp}`, rowId: `${usedPrefix}ytmp3 ${i.url}`})
listAudioDoc.push({title: i.title, description: `${i.author.name} | ${i.timestamp}`, rowId: `${usedPrefix}ytmp3doc ${i.url}`})
listVideo.push({title: i.title, description: `${i.author.name} | ${i.timestamp}`, rowId: `${usedPrefix}ytmp4 ${i.url}`})
listVideoDoc.push({title: i.title, description: `${i.author.name} | ${i.timestamp}`, rowId: `${usedPrefix}ytmp4doc ${i.url}`})}
conn.sendMessage(m.chat, listMessage, { quoted: fkontak })
if (m.isGroup) return m.reply('*✳️ 𝙃𝙊𝙇𝘼 𝙀𝙎𝙏𝙄𝙈𝘼𝘿𝙊 𝙐𝙎𝙐𝘼𝙍𝙄𝙊(𝘼), 𝙎𝙐 𝙋𝙀𝙍𝘿𝙄𝘿𝙊 𝙃𝘼 𝙎𝙄𝘿𝙊 𝙀𝙉𝙑𝙄𝘼𝘿𝙊 𝘼 𝙎𝙐 𝘾𝙃𝘼𝙏 𝙋𝙍𝙄𝙑𝘼𝘿𝙊, 𝙀𝙎𝙏𝙊 𝘾𝙊𝙈𝙊 𝙎𝙊𝙇𝙐𝘾𝙄𝙊𝙉 𝙏𝙀𝙈𝙋𝙊𝙍𝘼𝙇 𝘼 𝙀𝙍𝙍𝙊𝙍𝙀𝙎 𝘿𝙀 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝘾𝙊𝙉 𝘽𝙊𝙏𝙊𝙉𝙀𝙎 𝙏𝙄𝙋𝙊 𝙇𝙄𝙎𝙏𝘼𝙎 𝙌𝙐𝙀 𝙉𝙊 𝙎𝙊𝙉 𝙑𝙄𝙎𝙄𝘽𝙇𝙀𝙎 𝙀𝙉 𝙇𝘼𝙎 𝙑𝙀𝙍𝙎𝙄𝙊𝙉𝙀𝙎 𝙈𝘼𝙎 𝙍𝙀𝘾𝙄𝙀𝙉𝙏𝙀𝙎 𝘿𝙀 𝙒𝙃𝘼𝙏𝙎𝘼𝙋𝙋*')    
} catch {    
}}}
handler.help = ['', 'earch'].map(v => 'yts' + v + ' <pencarian>')
handler.tags = ['tools']
handler.command = /^playlist|ytbuscar|yts(earch)?$/i
handler.exp = 70
handler.limit = 1
handler.level = 4
export default handler
*/
