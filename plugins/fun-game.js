import TicTacToe from '../lib/tictactoe.js' 
let timeout = 60000
let poin = 600 
let poin_lose = -100
let poin_bot = 200
global.suit = global.suit ? global.suit : {}
//import MessageType from '@adiwajshing/baileys'
let MessageType = (await import(global.baileys)).default
let handler = async (m, { conn, text, command, usedPrefix, args }) => { 
let pp = 'https://telegra.ph/file/c7924bf0e0d839290cc51.jpg'
if (!db.data.chats[m.chat].game) throw `${lenguajeGB['smsAvisoAG']()}𝙇𝙊𝙎 𝙅𝙐𝙀𝙂𝙊𝙎 𝙀𝙎𝙏𝘼𝙎 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝙊 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊, 𝙎𝙄 𝙀𝙍𝙀𝙎 𝘼𝘿𝙈𝙄𝙉𝙎 𝙋𝙐𝙀𝘿𝙀 𝘼𝘾𝙏𝙄𝙑𝘼𝙍𝙇𝙊 𝘾𝙊𝙉 : #on juegos` 
try {

if (command == 'ppt' || command == 'pvp' || command == 'suit' || command == 'suitpvp') {
let textquien = `${lenguajeGB['smsAvisoMG']()}𝙋𝙄𝙀𝘿𝙍𝘼, 𝙋𝘼𝙋𝙀𝙇, 𝙊 𝙏𝙄𝙅𝙀𝙍𝘼\n\n𝙋𝙪𝙚𝙙𝙚𝙨 𝙪𝙨𝙖𝙧 𝙚𝙨𝙩𝙤𝙨 𝙘𝙤𝙢𝙖𝙣𝙙𝙤𝙨:\n${usedPrefix + command} piedra\n${usedPrefix + command} papel\n${usedPrefix + command} tijera\n\n𝙊 𝙋𝙪𝙚𝙙𝙚𝙨 𝙀𝙩𝙞𝙦𝙪𝙚𝙩𝙖 𝙖 𝙪𝙣𝙖 𝙥𝙚𝙧𝙨𝙤𝙣𝙖 𝙚𝙟𝙚𝙢𝙥𝙡𝙤 :\n${usedPrefix + command} @0`
if (!m.mentionedJid[0] && !args[0]) return m.reply(textquien, m.chat, {mentions: conn.parseMention(textquien)}, {quoted: fkontak })
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
  
let astro = Math.random();
if (astro < 0.34) {
astro = 'piedra';
} else if (astro > 0.34 && astro < 0.67) {
astro = 'tijera';
} else {
astro = 'papel';
}
if (text == astro) {
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money += 2
conn.reply(m.chat, `╭━━━━[ 𝙀𝙈𝙋𝘼𝙏𝙀! 🤝 ]━━━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💸 𝘽𝙤𝙣𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, m, {contextInfo: {externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: name, body: wm, previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb }}})
} else if (text == 'papel') {
if (astro == 'piedra') {
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money += 100
conn.reply(m.chat, `*╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣*\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, m, {contextInfo: {externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: name, body: wm, previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb }}});
} else {
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money -= 25
conn.reply(m.chat, `*╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣*\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, m, {contextInfo: {externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: name, body: wm, previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb }}})
}} else if (text == 'tijera') {
if (astro == 'papel') {
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money += 900
conn.reply(m.chat, `*╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣*\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, m, {contextInfo: {externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: name, body: wm, previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb }}})
} else {
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money -= 300
conn.reply(m.chat, `*╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣*\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, m, {contextInfo: {externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: name, body: wm, previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb }}})
}} else if (text == 'tijera') {
if (astro == 'papel') {
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money += 1000
conn.reply(m.chat, `*╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣*\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, m, {contextInfo: {externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: name, body: wm, previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb }}})
} else {
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money -= 300
conn.reply(m.chat, `*╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣*\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, m, {contextInfo: {externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: name, body: wm, previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb }}});
}} else if (text == 'papel') {
if (astro == 'piedra') {
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money += 1000
conn.reply(m.chat, `*╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣*\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, m, {contextInfo: {externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: name, body: wm, previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb }}})
} else {
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money -= 300
conn.reply(m.chat, `*╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣*\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, m, {contextInfo: {externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: name, body: wm, previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb }}})
}} else if (text == 'piedra') {
if (astro == 'tijera') {
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money += 1000
conn.reply(m.chat, `*╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣*\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, m, {contextInfo: {externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: name, body: wm, previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb }}})
//m.reply(`*╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣*\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`);
} else {
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money -= 300
conn.reply(m.chat, `*╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣*\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣*`, m, {contextInfo: {externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: name, body: wm, previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb }}})}}
 
if (Object.values(conn.suit).find(room => room.id.startsWith('suit') && [room.p, room.p2].includes(m.sender))) return m.reply(`${lenguajeGB['smsAvisoAG']()}𝙏𝙀𝙍𝙈𝙄𝙉𝘼 𝙏𝙐 𝙋𝘼𝙍𝙏𝙄𝘿𝘼 𝘼𝙉𝙏𝙀𝙎 𝘿𝙀 𝙄𝙉𝙄𝘾𝙄𝘼𝙍 𝙊𝙏𝙍𝘼`) 
if (Object.values(conn.suit).find(room => room.id.startsWith('suit') && [room.p, room.p2].includes(m.mentionedJid[0]))) return m.reply(`${lenguajeGB['smsAvisoIIG']()}𝙇𝘼 𝙋𝙀𝙍𝙎𝙊𝙉𝘼 𝘼 𝙇𝘼 𝙌𝙐𝙀 𝙌𝙐𝙄𝙀𝙍𝙀 𝘿𝙀𝙎𝘼𝙁𝙄𝘼𝙍 𝘼 𝙐𝙉 𝙀𝙎𝙏𝘼 𝙅𝙐𝙂𝘼𝙉𝘿𝙊 𝙊𝙏𝙍𝘼 𝙋𝘼𝙍𝙏𝙄𝘿𝘼, 𝙀𝙎𝙋𝙀𝙍𝙀 𝘼 𝙌𝙐𝙀 𝙏𝙀𝙍𝙈𝙄𝙉𝙀 𝘿𝙀 𝙅𝙐𝙂𝘼𝙍`) 
let id = 'suit_' + new Date() * 1
let caption = `${lenguajeGB['smsAvisoIIG']()}🎮👾 𝙂𝘼𝙈𝙀𝙎 - 𝙋𝙑𝙋 - 𝙂𝘼𝙈𝙀𝙎 🎮👾\n\n@${m.sender.split`@`[0]} 𝘿𝙀𝙎𝘼𝙁𝙄𝘼 𝘼 @${m.mentionedJid[0].split`@`[0]} 𝘼 𝙐𝙉 (𝙋𝙑𝙋) 𝘿𝙀 𝙋𝙄𝙀𝘿𝙍𝘼, 𝙋𝘼𝙋𝙀𝙇 𝙊 𝙏𝙄𝙅𝙀𝙍𝘼\n\n_*Escribe (aceptar) para aceptar*_\n_*Escribe (rechazar) para rechazar*_`
let imgplaygame = `https://www.merca2.es/wp-content/uploads/2020/05/Piedra-papel-o-tijera-0003318_1584-825x259.jpeg`
conn.suit[id] = {
chat: await conn.sendMessage(m.chat, { text: caption, mentions: [m.sender, m.mentionedJid]}),
//await conn.sendButton(m.chat, caption, footer, imgplaygame, [[`Aceptar`], [`Rechazar`]], null, {mentions: conn.parseMention(caption)}),
id: id,
p: m.sender,
p2: m.mentionedJid[0],
status: 'wait',
waktu: setTimeout(() => {
if (conn.suit[id]) conn.reply(m.chat, `${lenguajeGB['smsAvisoAG']()}⏳ 𝙏𝙄𝙀𝙈𝙋𝙊 𝘿𝙀 𝙀𝙎𝙋𝙀𝙍𝘼 𝙁𝙄𝙉𝘼𝙇𝙄𝙕𝘼𝘿𝙊, 𝙀𝙇 𝙋𝙑𝙋 𝙎𝙀 𝘾𝘼𝙉𝘾𝙀𝙇𝘼 𝙋𝙊𝙍 𝙁𝘼𝙇𝙏𝘼 𝘿𝙀 𝙍𝙀𝙎𝙋𝙐𝙀𝙎𝙏𝘼`, m)
delete conn.suit[id]}, timeout), poin, poin_lose, poin_bot, timeout
}}
    
if (command == 'lanzar' || command == 'launch') {
let pp = 'https://media.istockphoto.com/id/460171067/es/foto/sacudir-el-bot%C3%B3n.jpg?s=612x612&w=0&k=20&c=TsX1krTyz8oyRNhpcbri4dguh3WyAZwYOwMu2T68S2A='
// 60000 = 1 minuto // 30000 = 30 segundos // 15000 = 15 segundos // 10000 = 10 segundos
let time = global.db.data.users[m.sender].wait + 40000
let textos = `\`\`\`CARA O CRUZ\n\nPUEDES ELEGIR LA OPCION USADO LOS COMANDO\n\n${usedPrefix + command} cara\n${usedPrefix + command} cruz\n\n${wm}\`\`\``
if (new Date - global.db.data.users[m.sender].wait < 40000) return await conn.reply(m.chat, `*🕓 𝙀𝙎𝙋𝙀𝙍𝘼 ${Math.floor((time - new Date()) / 1000)} 𝙎𝙀𝙂𝙐𝙉𝘿𝙊𝙎 𝘼𝙉𝙏𝙀𝙎 𝘿𝙀 𝙋𝙊𝘿𝙀𝙍 𝙑𝙊𝙇𝙑𝙀𝙍  𝘼 𝙅𝙐𝙂𝘼𝙍*\n\n*𝙒𝘼𝙄𝙏 ${Math.floor((time - new Date()) / 1000)} 𝙎𝙀𝘾𝙊𝙉𝘿𝙎 𝘽𝙀𝙁𝙊𝙍𝙀 𝙔𝙊𝙐 𝘾𝘼𝙉 𝙋𝙇𝘼𝙔 𝘼𝙂𝘼𝙄𝙉*`, fkontak, m)
if (!args[0]) return await conn.sendMessage(m.chat, { image: { url: pp }, caption: textos, quoted: fkontak })
//conn.sendHydrated(m.chat, '*Cara o Cruz*\n\nPuedes eleguir la opción con los botones o usa los comandos:\n.suerte cruz\n.suerte cara\n\n usar en minúsculas',wm, pp, null, null, null, null, [['Cara', `${usedPrefix + command} cara`],['Cruz', `${usedPrefix + command} cruz`]], m)
var astro = Math.random()
if (astro < 0.50) {//34
    astro = 'cara'
} else if (astro > 0.50){//34
astro = 'cruz' 
}
if (text == astro) {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
//global.db.data.users[m.sender].exp += 1000
let money0 = global.db.data.users[m.sender].money += 2
m.reply(`╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣\n┃${name} 𝙀𝙡𝙚𝙜𝙞𝙨𝙩𝙚: ${text}\n┃🐱 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`)
} else if (text == 'cara') {
if (astro == 'cara') {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
//global.db.data.users[m.sender].exp += 1000
let money0 = global.db.data.users[m.sender].money += 2
m.reply(`╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣\n┃${name} 𝙀𝙡𝙚𝙜𝙞𝙨𝙩𝙚: ${text}\n┃🐱 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`)
} else {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
let money0 = global.db.data.users[m.sender].money -= 300
//global.db.data.users[m.sender].exp -= 300
m.reply(`╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣\n┃${name} 𝙀𝙡𝙚𝙜𝙞𝙨𝙩𝙚: ${text}\n┃🐱 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`)
}
} else if (text == 'cara') {
if (astro == 'cara') {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
let money0 = global.db.data.users[m.sender].money += 3
//global.db.data.users[m.sender].exp += 1000
m.reply(`╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣\n┃${name} 𝙀𝙡𝙚𝙜𝙞𝙨𝙩𝙚: ${text}\n┃🐱 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`)
} else {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
//global.db.data.users[m.sender].exp -= 300
let money0 = global.db.data.users[m.sender].money -= 300
m.reply(`╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣\n┃${name} 𝙀𝙡𝙚𝙜𝙞𝙨𝙩𝙚: ${text}\n┃🐱 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`)
}
}else if (text == 'cruz') {
if (astro == 'cruz') {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
//global.db.data.users[m.sender].exp += 1000
let money0 = global.db.data.users[m.sender].money += 100
m.reply(`╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣\n┃${name} 𝙀𝙡𝙚𝙜𝙞𝙨𝙩𝙚: ${text}\n┃🐱 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`)
} else {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
//global.db.data.users[m.sender].exp -= 300
let money0 = global.db.data.users[m.sender].money -= 300
m.reply(`╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣\n┃${name} 𝙀𝙡𝙚𝙜𝙞𝙨𝙩𝙚: ${text}\n┃🐱 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`)
}} else if (text == 'cruz') {
if (astro == 'cruz') {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
//global.db.data.users[m.sender].exp += 1000
let money0 = global.db.data.users[m.sender].money += 100
m.reply(`╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣\n┃${name} 𝙀𝙡𝙚𝙜𝙞𝙨𝙩𝙚: ${text}\n┃🐱 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`)
} else {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who)  
//global.db.data.users[m.sender].exp -= 300
let money0 = global.db.data.users[m.sender].money -= 400
m.reply(`╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣\n┃${name} 𝙀𝙡𝙚𝙜𝙞𝙨𝙩𝙚: ${text}\n┃🐱 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`)
}
} else if (text == 'cara') {
if (astro == 'cara') {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
//global.db.data.users[m.sender].exp += 1000
let money0 = global.db.data.users[m.sender].money += 300
m.reply(`╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣\n┃${name} 𝙀𝙡𝙚𝙜𝙞𝙨𝙩𝙚: ${text}\n┃🐱 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`)
} else {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
//global.db.data.users[m.sender].exp -= 300
let money0 = global.db.data.users[m.sender].money -= 300
m.reply(`╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣\n┃${name} 𝙀𝙡𝙚𝙜𝙞𝙨𝙩𝙚: ${text}\n┃🐱 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`)
}
global.db.data.users[m.sender].wait = new Date * 1
}}

if (command == 'slot'  || command == 'apostar' || command == 'slot1' || command == 'slot2' || command == 'slot3') {
let fa = `${mg}𝘿𝙀𝘽𝙀 𝘿𝙀 𝙐𝙎𝘼𝙍 𝘿𝙀 𝙇𝘼 𝙎𝙄𝙂𝙐𝙄𝙀𝙉𝙏𝙀 𝙈𝘼𝙉𝙀𝙍𝘼:
𝙔𝙊𝙐 𝙈𝙐𝙎𝙏 𝙐𝙎𝙀 𝘼𝙎 𝙁𝙊𝙇𝙇𝙊𝙒𝙎:

𝙀𝙅𝙀𝙈𝙋𝙇𝙊 | 𝙀𝙓𝘼𝙈𝙋𝙇𝙀
*${usedPrefix + command} 50*`.trim()

if (!args[0]) return m.reply(fa) 
if (isNaN(args[0])) return m.reply(fa) 
let apuesta = parseInt(args[0])

let users = global.db.data.users[m.sender]

if (apuesta < 10) throw `${lenguajeGB['smsAvisoAG']()}𝘿𝙀𝘽𝙀 𝘿𝙀 𝘼𝙋𝙊𝙎𝙏𝘼𝙍 𝙐𝙉 𝙈𝙄𝙉𝙄𝙈𝙊 𝘿𝙀 *10*\n\n𝙔𝙊𝙐 𝙈𝙐𝙎𝙏 𝘽𝙀𝙏 𝘼 𝙈𝙄𝙉𝙄𝙈𝙐𝙈 𝙊𝙁 *10*`

if (users.exp < apuesta) {
throw `${lenguajeGB['smsAvisoFG']()}𝙉𝙊 𝘼𝙇𝘾𝘼𝙉𝙕𝘼 𝙋𝘼𝙍𝘼 𝘼𝙋𝙊𝙎𝙏𝘼𝙍 𝙀𝙓𝙋, 𝙇𝙀 𝙍𝙀𝘾𝙊𝙈𝙄𝙀𝙉𝘿𝙊 𝙄𝙉𝙏𝙀𝙍𝘼𝘾𝙏𝙐𝘼𝙍 𝘾𝙊𝙉 𝙀𝙇 𝘽𝙊𝙏 𝙋𝘼𝙍𝘼 𝙊𝘽𝙏𝙀𝙉𝙀𝙍 𝙍𝙀𝘾𝙐𝙍𝙎𝙊𝙎\n\n𝙉𝙊𝙏 𝙀𝙉𝙊𝙐𝙂𝙃 𝙏𝙊 𝘽𝙀𝙏, 𝙄 𝙍𝙀𝘾𝙊𝙈𝙈𝙀𝙉𝘿 𝙔𝙊𝙐 𝙄𝙉𝙏𝙀𝙍𝘼𝘾𝙏 𝙒𝙄𝙏𝙃 𝙏𝙃𝙀 𝘽𝙊𝙏 𝙏𝙊 𝙂𝙀𝙏 𝙍𝙀𝙎𝙊𝙐𝙍𝘾𝙀𝙎`    
}
if (command == 'slot1') {
let time = global.db.data.users[m.sender].lastslot + 60000
if (new Date - users.lastslot < 60000) return m.reply(`*𝙑𝙐𝙀𝙇𝙑𝘼 𝙀𝙉 ${msToTime(time - new Date())} 𝙋𝘼𝙍𝘼 𝘾𝙊𝙉𝙏𝙄𝙉𝙐𝘼𝙍 𝘼𝙋𝙊𝙎𝙏𝘼𝙉𝘿𝙊 𝙀𝙓𝙋* 🎰\n\n*𝘾𝙊𝙈𝙀 𝘽𝘼𝘾𝙆 𝙄𝙉 ${msToTime(time - new Date())} 𝙏𝙊 𝘾𝙊𝙉𝙏𝙄𝙉𝙐𝙀 𝘽𝙀𝙏𝙏𝙄𝙉𝙂* 💰`) 
users.lastslot = new Date * 1
    
let emojis = ["🍁", "⚡", "🍇"];
let a = Math.floor(Math.random() * emojis.length);
let b = Math.floor(Math.random() * emojis.length);
let c = Math.floor(Math.random() * emojis.length);
let x = [],
y = [],
z = [];
for (let i = 0; i < 3; i++) {
x[i] = emojis[a];
a++;
if (a == emojis.length) a = 0;
}
for (let i = 0; i < 3; i++) {
y[i] = emojis[b];
b++;
if (b == emojis.length) b = 0;
}
for (let i = 0; i < 3; i++) {
z[i] = emojis[c];
c++;
if (c == emojis.length) c = 0;
}
let end;
if (a == b && b == c) {
end = `✨ *QUE PRO!! HAS GANADO +${apuesta + apuesta} EXP*\n\n🥳 *COOL!! YOU JUST WON +${apuesta + apuesta} EXP*`
users.exp += apuesta
} else if (a == b || a == c || b == c) {
end = `🙀 *CASI!!, VUELVA A INTENTAR*\n*BONO DE +50 EXP*\n\n😯 *ALMOST!!, TRY AGAIN*\n*BONDS OF +50 EXP*`
users.exp += 50
} else {
end = `😿 *HA PERDIDO!! ❌ -${apuesta} EXP*\n\n*HAS LOST!! ❌ -${apuesta} EXP*`
users.exp -= apuesta
}

var hawemod = [
`${x[1]} : ${y[0]} : ${z[0]}
${z[0]} : ${y[1]} : ${x[1]}
${z[1]} : ${x[2]} : ${y[0]}`, 
`${x[0]} : ${y[1]} : ${z[2]}
${y[1]} : ${z[2]} : ${x[1]}
${x[2]} : ${y[0]} : ${z[0]}`, 
`${x[1]} : ${y[2]} : ${z[1]}
${y[0]} : ${z[0]} : ${x[2]}
${x[2]} : ${y[1]} : ${z[0]}`
]

const maxIterations = 25;
const arrayCasuale = generaArrayCasuale(hawemod, maxIterations);

const array = [...arrayCasuale, ];
  
let { key } = await conn.sendMessage(m.chat, { text: `*A cruzar los dedos*` }, { quoted: m });

for (let i = 0; i < maxIterations; i++) {

await conn.sendMessage(m.chat, { text: `🎰 | *RANURAS* | 🎰\n────────\n` + `${array[i]}` + `\n ────────\n🎰 |   *SLOTS*   | 🎰`, edit: key }, { quoted: m });
await new Promise((resolve) => setTimeout(resolve, 1))}
  
return await conn.sendMessage(m.chat, {text: `
🎰 | *RANURAS* | 🎰 
────────
${x[0]} : ${y[0]} : ${z[0]}
${x[1]} : ${y[1]} : ${z[1]}
${x[2]} : ${y[2]} : ${z[2]}
 ────────
🎰 |   *SLOTS*   | 🎰\n\n${end}`, edit: key}, {quoted: m})}

/*await conn.sendHydrated(m.chat, `${s}\n\n${end}`, wm, null, md, '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', null, null, [
['⚡ 𝘼𝙋𝙊𝙎𝙏𝘼𝙍 𝙊𝙏𝙍𝘼 𝙑𝙀𝙕 | 𝘼𝙂𝘼𝙄𝙉', `${usedPrefix}slot1 ${apuesta}`],
['🐈 𝘼𝙋𝙊𝙎𝙏𝘼𝙍 𝘾𝙊𝙉 𝙂𝘼𝙏𝘼𝘾𝙊𝙄𝙉𝙎', `${usedPrefix}slot2 ${apuesta}`],
['💎 𝘼𝙋𝙊𝙎𝙏𝘼𝙍 𝘾𝙊𝙉 𝘿𝙄𝘼𝙈𝘼𝙉𝙏𝙀𝙎', `${usedPrefix}slot3 ${apuesta}`]
], m,)}*/


if (users.money < apuesta)  { 
throw `${lenguajeGB['smsAvisoFG']()}𝙉𝙊 𝘼𝙇𝘾𝘼𝙉𝙕𝘼 𝙋𝘼𝙍𝘼 𝘼𝙋𝙊𝙎𝙏𝘼𝙍 𝙂𝘼𝙏𝘼𝘾𝙊𝙄𝙉𝙎, 𝙇𝙀 𝙍𝙀𝘾𝙊𝙈𝙄𝙀𝙉𝘿𝙊 𝙄𝙉𝙏𝙀𝙍𝘼𝘾𝙏𝙐𝘼𝙍 𝘾𝙊𝙉 𝙀𝙇 𝘽𝙊𝙏 𝙋𝘼𝙍𝘼 𝙊𝘽𝙏𝙀𝙉𝙀𝙍 𝙍𝙀𝘾𝙐𝙍𝙎𝙊𝙎\n\n𝙉𝙊𝙏 𝙀𝙉𝙊𝙐𝙂𝙃 𝙏𝙊 𝘽𝙀𝙏, 𝙄 𝙍𝙀𝘾𝙊𝙈𝙈𝙀𝙉𝘿 𝙔𝙊𝙐 𝙄𝙉𝙏𝙀𝙍𝘼𝘾𝙏 𝙒𝙄𝙏𝙃 𝙏𝙃𝙀 𝘽𝙊𝙏 𝙏𝙊 𝙂𝙀𝙏 𝙍𝙀𝙎𝙊𝙐𝙍𝘾𝙀𝙎`    
}
if (command == 'slot2') {
let time = global.db.data.users[m.sender].lastslot + 60000
if (new Date - users.lastslot < 60000) return m.reply(`*𝙑𝙐𝙀𝙇𝙑𝘼 𝙀𝙉 ${msToTime(time - new Date())} 𝙋𝘼𝙍𝘼 𝘾𝙊𝙉𝙏𝙄𝙉𝙐𝘼𝙍 𝘼𝙋𝙊𝙎𝙏𝘼𝙉𝘿𝙊 𝙂𝘼𝙏𝘼𝘾𝙊𝙄𝙉𝙎* 🎰\n\n*𝘾𝙊𝙈𝙀 𝘽𝘼𝘾𝙆 𝙄𝙉 ${msToTime(time - new Date())} 𝙏𝙊 𝘾𝙊𝙉𝙏𝙄𝙉𝙐𝙀 𝘽𝙀𝙏𝙏𝙄𝙉𝙂* 💰`) 
users.lastslot = new Date * 1
    
let emojis = ["🐈", "🐓", "🐙"];
let a = Math.floor(Math.random() * emojis.length);
let b = Math.floor(Math.random() * emojis.length);
let c = Math.floor(Math.random() * emojis.length);
let x = [],
y = [],
z = [];
for (let i = 0; i < 3; i++) {
x[i] = emojis[a];
a++;
if (a == emojis.length) a = 0;
}
for (let i = 0; i < 3; i++) {
y[i] = emojis[b];
b++;
if (b == emojis.length) b = 0;
}
for (let i = 0; i < 3; i++) {
z[i] = emojis[c];
c++;
if (c == emojis.length) c = 0;
}
let end;
if (a == b && b == c) {
end = `✨ *QUE PRO!! HAS GANADO +${apuesta + apuesta} GataCoins*\n\n🥳 *COOL!! YOU JUST WON +${apuesta + apuesta} GataCoins*`
users.money += apuesta
} else if (a == b || a == c || b == c) {
end = `🙀 *CASI!!, VUELVA A INTENTAR*\n*BONO DE +30 GataCoins*\n\n😯 *ALMOST!!, TRY AGAIN*\n*BONDS OF +30 GataCoins*`
users.money += 30
} else {
end = `😿 *HA PERDIDO!! ❌ -${apuesta} GataCoins*\n\n*HAS LOST!! ❌ -${apuesta} GataCoins*`
users.money -= apuesta
}

var hawemod = [
`${x[0]} : ${y[1]} : ${z[0]}
${z[0]} : ${y[0]} : ${x[1]}
${z[2]} : ${x[2]} : ${y[2]}`, 
`${x[0]} : ${y[0]} : ${z[0]}
${y[1]} : ${z[1]} : ${x[1]}
${x[2]} : ${y[2]} : ${z[2]}`, 
`${x[0]} : ${y[1]} : ${z[0]}
${y[1]} : ${z[0]} : ${x[1]}
${x[2]} : ${y[1]} : ${z[0]}`
]

const maxIterations = 25;
const arrayCasuale = generaArrayCasuale(hawemod, maxIterations);

const array = [...arrayCasuale, ];
  
let { key } = await conn.sendMessage(m.chat, { text: `*A cruzar los dedos*` }, { quoted: m });

for (let i = 1; i <= maxIterations; i++) {
await conn.sendMessage(m.chat, { text: `🎰 | *RANURAS* | 🎰\n────────\n` + `${array[i]}` + `\n ────────\n🎰 |   *SLOTS*   | 🎰`, edit: key }, { quoted: m });
await new Promise((resolve) => setTimeout(resolve, 50))}
  
return await conn.sendMessage(m.chat, {text: `
🎰 | *RANURAS* | 🎰 
────────
${x[0]} : ${y[0]} : ${z[0]}
${x[1]} : ${y[1]} : ${z[1]}
${x[2]} : ${y[2]} : ${z[2]}
 ────────
🎰 |   *SLOTS*   | 🎰\n\n${end}`, edit: key}, {quoted: m})}
/*await conn.sendHydrated(m.chat, `${ss}\n\n${end}`, wm, null, md, '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', null, null, [
['🐈 𝘼𝙋𝙊𝙎𝙏𝘼𝙍 𝙊𝙏𝙍𝘼 𝙑𝙀𝙕 | 𝘼𝙂𝘼𝙄𝙉', `${usedPrefix}slot2 ${apuesta}`],
['⚡ 𝘼𝙋𝙊𝙎𝙏𝘼𝙍 𝘾𝙊𝙉 𝙀𝙓𝙋', `${usedPrefix}slot1 ${apuesta}`],
['💎 𝘼𝙋𝙊𝙎𝙏𝘼𝙍 𝘾𝙊𝙉 𝘿𝙄𝘼𝙈𝘼𝙉𝙏𝙀𝙎', `${usedPrefix}slot3 ${apuesta}`]
], m,)}*/

    
if (users.limit < apuesta) {  
throw `${lenguajeGB['smsAvisoFG']()}𝙉𝙊 𝘼𝙇𝘾𝘼𝙉𝙕𝘼 𝙋𝘼𝙍𝘼 𝘼𝙋𝙊𝙎𝙏𝘼𝙍 𝘿𝙄𝘼𝙈𝘼𝙉𝙏𝙀𝙎, 𝙇𝙀 𝙍𝙀𝘾𝙊𝙈𝙄𝙀𝙉𝘿𝙊 𝙄𝙉𝙏𝙀𝙍𝘼𝘾𝙏𝙐𝘼𝙍 𝘾𝙊𝙉 𝙀𝙇 𝘽𝙊𝙏 𝙋𝘼𝙍𝘼 𝙊𝘽𝙏𝙀𝙉𝙀𝙍 𝙍𝙀𝘾𝙐𝙍𝙎𝙊𝙎\n\n𝙉𝙊𝙏 𝙀𝙉𝙊𝙐𝙂𝙃 𝙏𝙊 𝘽𝙀𝙏, 𝙄 𝙍𝙀𝘾𝙊𝙈𝙈𝙀𝙉𝘿 𝙔𝙊𝙐 𝙄𝙉𝙏𝙀𝙍𝘼𝘾𝙏 𝙒𝙄𝙏𝙃 𝙏𝙃𝙀 𝘽𝙊𝙏 𝙏𝙊 𝙂𝙀𝙏 𝙍𝙀𝙎𝙊𝙐𝙍𝘾𝙀𝙎`    
}
if (command == 'slot3') {
let time = global.db.data.users[m.sender].lastslot + 30000
if (new Date - users.lastslot < 30000) return m.reply(`*𝙑𝙐𝙀𝙇𝙑𝘼 𝙀𝙉 ${msToTime(time - new Date())} 𝙋𝘼𝙍𝘼 𝘾𝙊𝙉𝙏𝙄𝙉𝙐𝘼𝙍 𝘼𝙋𝙊𝙎𝙏𝘼𝙉𝘿𝙊 𝘿𝙄𝘼𝙈𝘼𝙉𝙏𝙀𝙎* 🎰\n\n*𝘾𝙊𝙈𝙀 𝘽𝘼𝘾𝙆 𝙄𝙉 ${msToTime(time - new Date())} 𝙏𝙊 𝘾𝙊𝙉𝙏𝙄𝙉𝙐𝙀 𝘽𝙀𝙏𝙏𝙄𝙉𝙂* 💰`) 
users.lastslot = new Date * 1
    
let emojis = ["🪵", "💣", "💎"];
let a = Math.floor(Math.random() * emojis.length);
let b = Math.floor(Math.random() * emojis.length);
let c = Math.floor(Math.random() * emojis.length);
let x = [],
y = [],
z = [];
for (let i = 0; i < 3; i++) {
x[i] = emojis[a];
a++;
if (a == emojis.length) a = 0;
}
for (let i = 0; i < 3; i++) {
y[i] = emojis[b];
b++;
if (b == emojis.length) b = 0;
}
for (let i = 0; i < 3; i++) {
z[i] = emojis[c];
c++;
if (c == emojis.length) c = 0;
}
let end;
if (a == b && b == c) {
end = `✨ *QUE PRO!! HAS GANADO +${apuesta + apuesta} Diamantes*\n\n🥳 *COOL!! YOU JUST WON +${apuesta + apuesta} Diamantes*`
users.limit += apuesta
} else if (a == b || a == c || b == c) {
end = `🙀 *CASI!!, VUELVA A INTENTAR*\n*BONO DE +2 Diamantes*\n\n😯 *ALMOST!!, TRY AGAIN*\n*BONDS OF +2 Diamantes*`
users.limit += 2
} else {
end = `😿 *HA PERDIDO!! ❌ -${apuesta} Diamantes*\n\n*HAS LOST!! ❌ -${apuesta} Diamantes*`
users.limit -= apuesta
}

var hawemod = [
`${x[0]} : ${y[1]} : ${z[0]}
${z[1]} : ${y[0]} : ${x[0]}
${z[2]} : ${x[1]} : ${y[2]}`, 
`${x[0]} : ${y[1]} : ${z[0]}
${y[1]} : ${z[2]} : ${x[1]}
${x[2]} : ${y[1]} : ${z[2]}`, 
`${x[0]} : ${y[0]} : ${z[1]}
${y[1]} : ${z[2]} : ${x[0]}
${x[0]} : ${y[2]} : ${z[1]}`
]

const maxIterations = 25;
const arrayCasuale = generaArrayCasuale(hawemod, maxIterations);

const array = [...arrayCasuale, ];
  
let { key } = await conn.sendMessage(m.chat, { text: `*A cruzar los dedos*` }, { quoted: m });

for (let i = 1; i <= maxIterations; i++) {
await conn.sendMessage(m.chat, { text: `🎰 | *RANURAS* | 🎰\n────────\n` + `${array[i]}` + `\n ────────\n🎰 |   *SLOTS*   | 🎰`, edit: key }, { quoted: m });
await new Promise((resolve) => setTimeout(resolve, 50))}
  
return await conn.sendMessage(m.chat, {text: `
🎰 | *RANURAS* | 🎰 
────────
${x[0]} : ${y[0]} : ${z[0]}
${x[1]} : ${y[1]} : ${z[1]}
${x[2]} : ${y[2]} : ${z[2]}
 ────────
🎰 |   *SLOTS*   | 🎰\n\n${end}`, edit: key}, {quoted: m})}
/*await conn.sendHydrated(m.chat, `${sss}\n\n${end}`, wm, null, md, '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', null, null, [
['💎 𝘼𝙋𝙊𝙎𝙏𝘼𝙍 𝙊𝙏𝙍𝘼 𝙑𝙀𝙕 | 𝘼𝙂𝘼𝙄𝙉', `${usedPrefix}slot3 ${apuesta}`],
['⚡ 𝘼𝙋𝙊𝙎𝙏𝘼𝙍 𝘾𝙊𝙉 𝙀𝙓𝙋', `${usedPrefix}slot1 ${apuesta}`],
['🐈 𝘼𝙋𝙊𝙎𝙏𝘼𝙍 𝘾𝙊𝙉 𝙂𝘼𝙏𝘼𝘾𝙊𝙄𝙉𝙎', `${usedPrefix}slot2 ${apuesta}`]
], m,)}*/
        
        
if (command == 'slot') {       
await conn.reply(m.chat, `*Elija en que apostará ${apuesta}*\n\n⚡ 𝙀𝙓𝙋:\n${usedPrefix}slot1 ${apuesta}\n\n🐈 𝙂𝘼𝙏𝘼𝘾𝙊𝙄𝙉𝙎:\n${usedPrefix}slot2 ${apuesta}\n\n💎 𝘿𝙄𝘼𝙈𝘼𝙉𝙏𝙀𝙎:\n${usedPrefix}slot3 ${apuesta}`, m)}
        
if (command == 'apostar') {       
await conn.reply(m.chat, `*Elija en que apostará ${apuesta}*\n\n*Choose what you will*\n\n⚡ 𝙀𝙓𝙋:\n${usedPrefix}slot1 ${apuesta}\n🐈 𝙂𝘼𝙏𝘼𝘾𝙊𝙄𝙉𝙎:\n${usedPrefix}slot2 ${apuesta}\n💎 𝘿𝙄𝘼𝙈𝘼𝙉𝙏𝙀𝙎:\n${usedPrefix}slot3 ${apuesta}`, m)} 
}

if (command == 'tictactoe' || command == 'ttc' || command == 'ttt' || command == 'xo') {
conn.game = conn.game ? conn.game : {}
if (Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) throw `${lenguajeGB['smsAvisoAG']()}𝙏𝙊𝘿𝘼𝙑𝙄𝘼 𝘼𝙇𝙂𝙐𝙄𝙀𝙉 𝙀𝙎𝙏𝘼 𝙅𝙐𝙂𝘼𝙈𝘿𝙊 𝙀𝙉 𝙇𝘼 𝙎𝘼𝙇𝘼 𝙎𝙄 𝙌𝙐𝙄𝙀𝙍𝙀𝙎 𝘼𝘽𝘼𝙉𝘿𝙊𝙉𝘼𝙍 𝙀𝙎𝘾𝙍𝙄𝘽𝘼 *salir*\n𝙏𝘼𝙈𝘽𝙄𝙀𝙉 𝙋𝙐𝙀𝘿𝙀𝙎 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍 𝙇𝘼 𝙎𝘼𝙇𝘼 𝙐𝙎𝘼𝙉𝘿𝙊 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 *${usedPrefix}delttt*\n\n𝙎𝙊𝙈𝙀𝙊𝙉𝙀 𝙄𝙎 𝙎𝙏𝙄𝙇𝙇 𝙋𝙇𝘼𝙔𝙄𝙉𝙂 𝙄𝙉 𝙏𝙃𝙀 𝙍𝙊𝙊𝙈\n𝙄𝙁 𝙔𝙊𝙐 𝙒𝘼𝙉𝙏 𝙏𝙊 𝙇𝙀𝘼𝙑𝙀, 𝙒𝙍𝙄𝙏𝙀 *out*\n𝙔𝙊𝙐 𝘾𝘼𝙉 𝘼𝙇𝙎𝙊 𝘿𝙀𝙇𝙀𝙏𝙀 𝙏𝙃𝙀 𝙍𝙊𝙊𝙈 𝙐𝙎𝙄𝙉𝙂 𝙏𝙃𝙀 𝘾𝙊𝙈𝙈𝘼𝙉𝘿 *${usedPrefix}delttt*`
if (!text) return m.reply(`${lenguajeGB['smsAvisoFG']()}𝘿𝙀𝘽𝙀 𝘿𝙀 𝘼𝙂𝙍𝙀𝙂𝘼𝙍 𝙐𝙉 𝙉𝙊𝙈𝘽𝙍𝙀 𝘼 𝙇𝘼 𝙎𝘼𝙇𝘼\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} Sala GataBot*\n\n𝙔𝙊𝙐 𝙈𝙐𝙎𝙏 𝘼𝘿𝘿 𝘼 𝙉𝘼𝙈𝙀 𝙏𝙊 𝙏𝙃𝙀 𝙍𝙊𝙊𝙈\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} Room GataBot*`) 
let room = Object.values(conn.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true)) 
if (room) {
await conn.reply(m.chat, `${lenguajeGB['smsAvisoEG']()}𝘼𝙇𝙂𝙐𝙄𝙀𝙉 𝙎𝙀 𝙃𝘼 𝙐𝙉𝙄𝘿𝙊 𝘼 𝙇𝘼 𝙎𝘼𝙇𝘼 *${text}*\n𝙔𝘼 𝙋𝙐𝙀𝘿𝙀𝙉 𝙅𝙐𝙂𝘼𝙍!! 😼\n\n𝙎𝙊𝙈𝙀𝙊𝙉𝙀 𝙃𝘼𝙎 𝙅𝙊𝙄𝙉𝙀𝘿 𝙏𝙃𝙀 𝙍𝙊𝙊𝙈 *${text}*\n𝙔𝙊𝙐 𝘾𝘼𝙉 𝙋𝙇𝘼𝙔 𝙉𝙊𝙒!! 👀`, fkontak, m)

await conn.reply(m.chat, `${lenguajeGB['smsAvisoRG']()}⭕️ *Clásico Juego del Gato o 3 en raya* ❌\n\n*¿Cómo jugar?*\n_Responde al Juego con un Número, el mensaje debe contener la posiscion en la que quieras estar (1,2,3,4,5,6,7,8,9)_\n\n*How to play?*\n_Answer the Game with a Number, the message must contain the position you want to be in (1,2,3,4,5,6,7,8,9)_`, fkontak, m)

room.o = m.chat
room.game.playerO = m.sender
room.state = 'PLAYING'
let arr = room.game.render().map(v => {
return {
X: '❎',
O: '⭕',
1: '1️⃣',
2: '2️⃣',
3: '3️⃣',
4: '4️⃣',
5: '5️⃣',
6: '6️⃣',
7: '7️⃣',
8: '8️⃣',
9: '9️⃣',
}[v]})
let str = `💖 𝙅𝙐𝙀𝙂𝙊 𝙏𝙍𝙀𝙎 𝙀𝙉 𝙍𝘼𝙔𝘼 | 𝙂𝘼𝙈𝙀
🫂 𝙅𝙐𝙂𝘼𝘿𝙊𝙍𝙀𝙎 *:* 𝙋𝙇𝘼𝙔𝙀𝙍𝙎
*┈┈┈┈┈┈┈┈┈*
❎ = @${room.game.playerX.split('@')[0]}
⭕ = @${room.game.playerO.split('@')[0]}
*┈┈┈┈┈┈┈┈┈*
     ${arr.slice(0, 3).join('')}
     ${arr.slice(3, 6).join('')}
     ${arr.slice(6).join('')}
*┈┈┈┈┈┈┈┈┈*
𝙏𝙐𝙍𝙉𝙊 𝘿𝙀 *:* 𝙏𝙐𝙍𝙉 𝙊𝙁 
@${room.game.currentTurn.split('@')[0]}
`.trim()

if (room.x !== room.o) await conn.sendMessage(room.x, { text: str, mentions: this.parseMention(str)}, { quoted: fkontak, m })
await conn.sendMessage(room.o, { text: str, mentions: conn.parseMention(str)}, { quoted: fkontak, m })
        
} else {
room = {
id: 'tictactoe-' + (+new Date),
x: m.chat,
o: '',
game: new TicTacToe(m.sender, 'o'),
state: 'WAITING' }
        
if (text) room.name = text     
let imgplay = `https://img.freepik.com/vector-premium/juego-tres-raya-icono-contorno-lineal-neon_7280-2422.jpg`
conn.sendMessage(m.chat, { image: { url: imgplay }, caption: `😼 𝙅𝙐𝙀𝙂𝙊 𝙏𝙍𝙀𝙎 𝙀𝙉 𝙍𝘼𝙔𝘼 | 𝙂𝘼𝙈𝙀

🐈 𝙀𝙎𝙋𝙀𝙍𝘼𝙉𝘿𝙊 𝘼𝙇 𝙎𝙀𝙂𝙐𝙉𝘿𝙊 𝙅𝙐𝙂𝘼𝘿𝙊𝙍 𝙋𝙐𝙀𝘿𝙀 𝙄𝙉𝙂𝙍𝙀𝙎𝘼𝙍 𝙐𝙎𝘼𝙉𝘿𝙊 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊:
*${usedPrefix + command} ${text}*

𝙎𝙄 𝙌𝙐𝙄𝙀𝙍𝙀𝙎 𝘼𝘽𝘼𝙉𝘿𝙊𝙉𝘼𝙍 𝙇𝘼 𝙎𝘼𝙇𝘼 𝙐𝙎𝘼 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 *${usedPrefix}delttt*

𝙒𝘼𝙄𝙏𝙄𝙉𝙂 𝙁𝙊𝙍 𝙏𝙃𝙀 𝙎𝙀𝘾𝙊𝙉𝘿 𝙋𝙇𝘼𝙔𝙀𝙍 𝙔𝙊𝙐 𝘾𝘼𝙉 𝙀𝙉𝙏𝙀𝙍 𝙒𝙄𝙏𝙃 𝙏𝙃𝙀 𝘽𝙐𝙏𝙏𝙊𝙉 𝘽𝙀𝙇𝙊𝙒 𝙊𝙍 𝙐𝙎𝙄𝙉𝙂 𝙏𝙃𝙀 𝘾𝙊𝙈𝙈𝘼𝙉𝘿
*${usedPrefix + command} ${text}*

𝙄𝙁 𝙔𝙊𝙐 𝙒𝘼𝙉𝙏 𝙏𝙊 𝙇𝙀𝘼𝙑𝙀 𝙏𝙃𝙀 𝙍𝙊𝙊𝙈 𝙐𝙎𝙀 𝙏𝙃𝙀 𝘾𝙊𝙈𝙈𝘼𝙉𝘿 *${usedPrefix}delttt*` }, { mentions: conn.parseMention(text), quoted: fkontak })
conn.game[room.id] = room
}}

if (command == 'math' || command == 'mates' || command == 'matemáticas' || command == 'matematicas') {
let mat =`${lenguajeGB['smsAvisoIIG']()}✨ 𝙋𝙐𝙀𝘿𝙀 𝙀𝙎𝘾𝙍𝙄𝘽𝙄𝙍 𝙇𝘼 𝘿𝙄𝙁𝙄𝘾𝙐𝙇𝙏𝘼𝘿\n✨ 𝙔𝙊𝙐 𝙒𝙍𝙄𝙏𝙀 𝙏𝙃𝙀 𝘿𝙄𝙁𝙁𝙄𝘾𝙐𝙇𝙏𝙔

𝙉𝙄𝙑𝙀𝙇 𝘿𝙀 𝘿𝙄𝙁𝙄𝘾𝙐𝙇𝙏𝘼𝘿 | 𝘿𝙄𝙁𝙁𝙄𝘾𝙐𝙇𝙏𝙔 
${Object.keys(modes).join('  |  ')}

𝙀𝙅𝙀𝙈𝙋𝙇𝙊 | 𝙀𝙓𝘼𝙈𝙋𝙇𝙀
${usedPrefix + command} noob
${usedPrefix + command} impossible2

😼 𝙈𝙄𝙀𝙉𝙏𝙍𝘼𝙎 𝙈𝘼𝙎 𝘿𝙄𝙁𝙄𝘾𝙐𝙇𝙏𝘼𝘿 𝙈𝘼𝙔𝙊𝙍 𝙍𝙀𝘾𝙊𝙈𝙋𝙀𝙉𝙎𝘼
😼 𝙈𝙊𝙍𝙀 𝘿𝙄𝙁𝙁𝙄𝘾𝙐𝙇𝙏𝙔 𝙔𝙊𝙐 𝘾𝘼𝙉 𝙂𝙀𝙏 𝙏𝙃𝙀 𝙂𝙍𝙀𝘼𝙏𝙀𝙍 𝙍𝙀𝙒𝘼𝙍𝘿
`.trim()
if (args.length < 1) return await conn.reply(m.chat, mat, fkontak, m)

let mode = args[0].toLowerCase()
if (!(mode in modes)) return await conn.reply(m.chat, mat, fkontak, m) 

let id = m.chat
if (id in global.math) return conn.reply(m.chat, `${lenguajeGB['smsAvisoAG']()}𝙃𝘼𝙔 𝙋𝙍𝙀𝙂𝙐𝙉𝙏𝘼𝙎 𝙎𝙄𝙉 𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝙀𝙍 𝙀𝙉 𝙀𝙇 𝘾𝙃𝘼𝙏!!\n\n𝙏𝙃𝙀𝙍𝙀 𝘼𝙍𝙀 𝙌𝙐𝙀𝙎𝙏𝙄𝙊𝙉𝙎 𝙒𝙄𝙏𝙃𝙊𝙐𝙏 𝘼𝙉𝙎𝙒𝙀𝙍𝙄𝙉𝙂 𝙄𝙉 𝙏𝙃𝙀 𝘾𝙃𝘼𝙏!!`, global.math[id][0])
//let ii = global.db.data.users[m.sender].limit += 10 math.dia
let math = genMath(mode)
global.math[id] = [
await conn.reply(m.chat, `𝘾𝙪𝙖𝙡 𝙚𝙨 𝙧𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤 𝙙𝙚 *${math.str} = ?*
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
𝙏𝙞𝙚𝙢𝙥𝙤 | 𝙏𝙞𝙢𝙚
🧭 *${(math.time / 1000).toFixed(0)} segundos*
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
𝙍𝙚𝙨𝙥𝙤𝙣𝙙𝙚 𝙖 𝙚𝙨𝙩𝙚 𝙢𝙚𝙣𝙨𝙖𝙟𝙚 𝙮 𝙂𝙖𝙣𝙖 
🏆 *${math.bonus} 𝙓𝙋*
`, m),
math, 4,
  
await conn.reply(m.chat, `⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝘼 𝘼𝙇 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝘿𝙀 𝘼𝙍𝙍𝙄𝘽𝘼 𝘾𝙊𝙉 𝙇𝘼 𝙍𝙀𝙎𝙋𝙐𝙀𝙎𝙏𝘼\n\n𝘼𝙉𝙎𝙒𝙀𝙍 𝙏𝙃𝙀 𝙈𝙀𝙎𝙎𝘼𝙂𝙀 𝘼𝘽𝙊𝙑𝙀 𝙏𝙊 𝙆𝙉𝙊𝙒 𝙔𝙊𝙐𝙍 𝘼𝙉𝙎𝙒𝙀𝙍\n\n${wm}`, fkontak, m), math, 4,
setTimeout(() => { 
if (global.math[id]) conn.reply(m.chat, `${lenguajeGB['smsAvisoAG']()}𝙎𝙀 𝘼𝘾𝘼𝘽𝙊 𝙀𝙇 𝙏𝙄𝙀𝙈𝙋𝙊!!\n𝙇𝘼 𝙍𝙀𝙎𝙋𝙐𝙀𝙎𝙏𝘼 𝙀𝙎 *${math.result}*\n\n𝙏𝙄𝙈𝙀 𝙄𝙎 𝙐𝙋!!\n𝙏𝙃𝙀 𝘼𝙉𝙎𝙒𝙀𝙍 𝙄𝙎 *${math.result}*`, global.math[id][0])
delete global.math[id]
}, math.time)
]}

if (command == 'delttt' || command == 'deltt' || command == 'delxo' || command == 'deltictactoe') {
let room = Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))
if (room == undefined) return await conn.reply(m.chat, `${lenguajeGB['smsAvisoFG']()}𝙉𝙊 𝙀𝙎𝙏𝘼𝙎 𝙀𝙉 𝙉𝙄𝙉𝙂𝙐𝙉𝘼 𝙋𝘼𝙍𝙏𝙄𝘿𝘼 𝙀𝙉 𝙀𝙇 𝙅𝙐𝙀𝙂𝙊 𝙏𝙍𝙀𝙎 𝙀𝙉 𝙍𝘼𝙔𝘼\n\n𝙔𝙊𝙐 𝘼𝙍𝙀 𝙉𝙊𝙏 𝙄𝙉 𝘼𝙉𝙔 𝙂𝘼𝙈𝙀 𝙄 𝙂𝘼𝙈𝙀 𝙏𝙃𝙍𝙀𝙀 𝙄𝙉 𝙎𝙏𝙍𝙄𝙋𝙀𝙎\n\n💫 𝙄𝙉𝙄𝘾𝙄𝘼𝙍 𝙋𝘼𝙍𝙏𝙄𝘿𝘼 | 𝙎𝙏𝘼𝙍𝙏 𝙂𝘼𝙈𝙀 (${usedPrefix}ttt sala nueva)`, fkontak, m)
delete conn.game[room.id]

await conn.reply(m.chat, `${lenguajeGB['smsAvisoEG']()}𝙇𝘼 𝙎𝘼𝙇𝘼 𝙏𝙍𝙀𝙎 𝙀𝙉 𝙍𝘼𝙔𝘼 𝙁𝙐𝙀 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝘿𝘼\n\n𝙏𝙃𝙀 𝙏𝙃𝙍𝙀𝙀 𝙄𝙉 𝘼 𝙍𝙊𝙒 𝙍𝙊𝙊𝙈 𝙒𝘼𝙎 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙏𝙀𝘿`, fkontak, m)
}} catch (e) {
//await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)}}
handler.help = ['ppt']
handler.tags = ['games']
handler.command = /^(ppt|suitpvp|suit|pvp|launch|lanzar|luck|slot|apostar|slot1|slot2|slot3|tictactoe|ttc|ttt|xo|math|mates|matemáticas|matematicas|delttt|deltt|delxo|deltictactoe)$/i
handler.group = true
handler.game = true
handler.register = true
export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]}

function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

hours = (hours < 10) ? "0" + hours : hours
minutes = (minutes < 10) ? "0" + minutes : minutes
seconds = (seconds < 10) ? "0" + seconds : seconds

return minutes + " m " + seconds + " s " 
}

let modes = {
noob: [-3, 3,-3, 3, '+-', 15000, 30], 
easy: [-10, 10, -10, 10, '*/+-', 20000, 50],
medium: [-40, 40, -20, 20, '*/+-', 30000, 200],
hard: [-100, 100, -70, 70, '*/+-', 40000, 500],
extreme: [-999999, 999999, -999999, 999999, '*/', 40000, 2500],
impossible: [-99999999999, 99999999999, -99999999999, 999999999999, '*/', 50000, 5500],
impossible2: [-999999999999999, 999999999999999, -999, 999, '/', 60000, 8500]
} 

let operators = {
'+': '+',
'-': '-',
'*': '×',
'/': '÷'
}

// XP
function genMath(mode) {
let [a1, a2, b1, b2, ops, time, bonus] = modes[mode]
let a = randomInt(a1, a2)
let b = randomInt(b1, b2)
let op = pickRandom([...ops])
let result = (new Function(`return ${a} ${op.replace('/', '*')} ${b < 0 ? `(${b})` : b}`))()
if (op == '/') [a, result] = [result, a]
return {
str: `${a} ${operators[op]} ${b}`,
mode,
time,
bonus,
result
}}

function generaArrayCasuale(array, ripetizioni) {
  let risultato = [];
  for (let i = 0; i < ripetizioni; i++) {
    risultato = risultato.concat(array);
  }
  return risultato;
}

function randomInt(from, to) {
if (from > to) [from, to] = [to, from]
from = Math.floor(from)
to = Math.floor(to)
return Math.floor((to - from) * Math.random() + from)
}
