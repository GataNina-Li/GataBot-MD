let handler = async (m, { conn, text, command, usedPrefix, args }) => {
//let pp = 'https://www.bighero6challenge.com/images/thumbs/Piedra,-papel-o-tijera-0003318_1584.jpeg'
let pp = 'https://telegra.ph/file/c7924bf0e0d839290cc51.jpg'
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }  
// 60000 = 1 minuto // 30000 = 30 segundos // 15000 = 15 segundos // 10000 = 10 segundos
let time = global.db.data.users[m.sender].wait + 40000
let textos = `𝙋𝙄𝙀𝘿𝙍𝘼, 𝙋𝘼𝙋𝙀𝙇, 𝙊 𝙏𝙄𝙅𝙀𝙍𝘼\n\n𝙥𝙪𝙚𝙙𝙚𝙨 𝙪𝙨𝙖𝙧 𝙚𝙨𝙩𝙤𝙨 𝙘𝙤𝙢𝙖𝙣𝙙𝙤𝙨:\n${usedPrefix + command} 𝙥𝙞𝙚𝙙𝙧𝙖\n${usedPrefix + command} 𝙥𝙖𝙥𝙚𝙡\n${usedPrefix + command} 𝙩𝙞𝙟𝙚𝙧𝙖\n\n𝙐𝙨𝙚 𝙚𝙣 𝙢𝙞𝙣𝙪𝙨𝙘𝙪𝙡𝙖𝙨\n\n${wm}`
if (new Date - global.db.data.users[m.sender].wait < 40000) return await conn.reply(m.chat, `*🕓 𝙀𝙎𝙋𝙀𝙍𝘼 ${Math.floor((time - new Date()) / 1000)} 𝙎𝙀𝙂𝙐𝙉𝘿𝙊𝙎 𝘼𝙉𝙏𝙀𝙎 𝘿𝙀 𝙋𝙊𝘿𝙀𝙍 𝙑𝙊𝙇𝙑𝙀𝙍  𝘼 𝙅𝙐𝙂𝘼𝙍*\n\n*𝙒𝘼𝙄𝙏 ${Math.floor((time - new Date()) / 1000)} 𝙎𝙀𝘾𝙊𝙉𝘿𝙎 𝘽𝙀𝙁𝙊𝙍𝙀 𝙔𝙊𝙐 𝘾𝘼𝙉 𝙋𝙇𝘼𝙔 𝘼𝙂𝘼𝙄𝙉*`, fkontak, m)
if (!args[0]) return await conn.sendMessage(m.chat, { image: { url: pp }, caption: textos, quoted: fkontak })
var astro = Math.random()
if (astro < 0.34) {
astro = 'piedra' 
} else if (astro > 0.34 && astro < 0.67) {
astro = 'tijera' 
} else {
astro = 'papel'
} 
if (text == astro) {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money += 2

 await conn.reply(m.chat, `╭━━━━[ 𝙀𝙈𝙋𝘼𝙏𝙀! 🤝 ]━━━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💸 𝘽𝙤𝙣𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, fkontak, m)
/*conn.sendHydrated(m.chat, `╭━━━━[ 𝙀𝙈𝙋𝘼𝙏𝙀! 🤝 ]━━━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💸 𝘽𝙤𝙣𝙤: $${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: $${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, wm, null, yt, '𝙔𝙤𝙪𝙏𝙪𝙗𝙚', null, null, [
['𝙈𝙚𝙣𝙪 𝙅𝙪𝙚𝙜𝙤𝙨 | 𝙂𝙖𝙢𝙚𝙨 𝙈𝙚𝙣𝙪 🎡', '#juegosmenu'],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m,)*/
  
} else if (text == 'papel') {
if (astro == 'piedra') {
//global.db.data.users[m.sender].uang += 1000
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money += 100

await conn.reply(m.chat, `╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, fkontak, m)
/*conn.sendHydrated(m.chat, `╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: $${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: $${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, wm, null, yt, '𝙔𝙤𝙪𝙏𝙪𝙗𝙚', null, null, [
['𝙈𝙚𝙣𝙪 𝙅𝙪𝙚𝙜𝙤𝙨 | 𝙂𝙖𝙢𝙚𝙨 𝙈𝙚𝙣𝙪 🎡', '#juegosmenu'],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m,)*/
  
} else {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money -= 500
await conn.reply(m.chat, `╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, fkontak, m)
/*conn.sendHydrated(m.chat, `╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: $${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: $${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, wm, null, yt, '𝙔𝙤𝙪𝙏𝙪𝙗𝙚', null, null, [
['𝙈𝙚𝙣𝙪 𝙅𝙪𝙚𝙜𝙤𝙨 | 𝙂𝙖𝙢𝙚𝙨 𝙈𝙚𝙣𝙪 🎡', '#juegosmenu'],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m,)*/
  
}
} else if (text == 'tijera') {
if (astro == 'papel') {
//global.db.data.users[m.sender].uang += 125
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money += 175
await conn.reply(m.chat, `╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, fkontak, m)
/*conn.sendHydrated(m.chat, `╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: $${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: $${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, wm, null, yt, '𝙔𝙤𝙪𝙏𝙪𝙗𝙚', null, null, [
['𝙈𝙚𝙣𝙪 𝙅𝙪𝙚𝙜𝙤𝙨 | 𝙂𝙖𝙢𝙚𝙨 𝙈𝙚𝙣𝙪 🎡', '#juegosmenu'],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m,)*/
  
} else {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money -= 95
await conn.reply(m.chat, `╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, fkontak, m)
/*conn.sendHydrated(m.chat, `╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: $${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: $${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, wm, null, yt, '𝙔𝙤𝙪𝙏𝙪𝙗𝙚', null, null, [
['𝙈𝙚𝙣𝙪 𝙅𝙪𝙚𝙜𝙤𝙨 | 𝙂𝙖𝙢𝙚𝙨 𝙈𝙚𝙣𝙪 🎡', '#juegosmenu'],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m,)  */
  
}
} else if (text == 'tijera') {
if (astro == 'papel') {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money += 225
//global.db.data.users[m.sender].uang += 1000
await conn.reply(m.chat, `╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, fkontak, m)
/*conn.sendHydrated(m.chat, `╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: $${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: $${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, wm, null, yt, '𝙔𝙤𝙪𝙏𝙪𝙗𝙚', null, null, [
['𝙈𝙚𝙣𝙪 𝙅𝙪𝙚𝙜𝙤𝙨 | 𝙂𝙖𝙢𝙚𝙨 𝙈𝙚𝙣𝙪 🎡', '#juegosmenu'],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m,)  */
  
} else {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money -= 90
await conn.reply(m.chat, `╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, fkontak, m)
/*conn.sendHydrated(m.chat, `╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: $${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: $${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, wm, null, yt, '𝙔𝙤𝙪𝙏𝙪𝙗𝙚', null, null, [
['𝙈𝙚𝙣𝙪 𝙅𝙪𝙚𝙜𝙤𝙨 | 𝙂𝙖𝙢𝙚𝙨 𝙈𝙚𝙣𝙪 🎡', '#juegosmenu'],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m,)    */
  
}
} else if (text == 'papel') {
if (astro == 'piedra') {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money += 75
//global.db.data.users[m.sender].uang += 1000
await conn.reply(m.chat, `╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, fkontak, m)
/*conn.sendHydrated(m.chat, `╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: $${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: $${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, wm, null, yt, '𝙔𝙤𝙪𝙏𝙪𝙗𝙚', null, null, [
['𝙈𝙚𝙣𝙪 𝙅𝙪𝙚𝙜𝙤𝙨 | 𝙂𝙖𝙢𝙚𝙨 𝙈𝙚𝙣𝙪 🎡', '#juegosmenu'],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m,)   */
  
} else {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money -= 240
await conn.reply(m.chat, `╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, fkontak, m)
/*conn.sendHydrated(m.chat, `╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: $${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: $${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, wm, null, yt, '𝙔𝙤𝙪𝙏𝙪𝙗𝙚', null, null, [
['𝙈𝙚𝙣𝙪 𝙅𝙪𝙚𝙜𝙤𝙨 | 𝙂𝙖𝙢𝙚𝙨 𝙈𝙚𝙣𝙪 🎡', '#juegosmenu'],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m,)    */
  
}
} else if (text == 'piedra') {
if (astro == 'tijera') {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money += 300
//global.db.data.users[m.sender].uang += 1000
await conn.reply(m.chat, `╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, fkontak, m)
/*conn.sendHydrated(m.chat, `╭━━━━[ 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊! 🎉 ]━━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃💰 𝙋𝙧𝙚𝙢𝙞𝙤: $${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: $${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, wm, null, yt, '𝙔𝙤𝙪𝙏𝙪𝙗𝙚', null, null, [
['𝙈𝙚𝙣𝙪 𝙅𝙪𝙚𝙜𝙤𝙨 | 𝙂𝙖𝙢𝙚𝙨 𝙈𝙚𝙣𝙪 🎡', '#juegosmenu'],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m,)     */
  
} else {
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
else who = m.sender 
let name = conn.getName(who) 
let money = global.db.data.users[who].money
let money0 = global.db.data.users[m.sender].money -= 210
await conn.reply(m.chat, `╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: ${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: ${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, fkontak, m)
/*conn.sendHydrated(m.chat, `╭━━━━[ 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊! 🤡 ]━━⬣\n┃${name} 𝙐𝙨𝙩𝙚𝙙: ${text}\n┃🐱 𝙂𝙖𝙩𝙖𝘽𝙤𝙩: ${astro}\n┃📈 𝙋𝙚𝙧𝙙𝙞𝙙𝙖: $${[money0].getRandom()} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n┃💵 𝙎𝙪 𝘿𝙞𝙣𝙚𝙧𝙤: $${money} 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨\n╰━━━━━━[ ${vs} ]━━━━━⬣`, wm, null, yt, '𝙔𝙤𝙪𝙏𝙪𝙗𝙚', null, null, [
['𝙈𝙚𝙣𝙪 𝙅𝙪𝙚𝙜𝙤𝙨 | 𝙂𝙖𝙢𝙚𝙨 𝙈𝙚𝙣𝙪 🎡', '#juegosmenu'],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m,)*/
}}
global.db.data.users[m.sender].wait = new Date * 1
}
handler.help = ['ppt']
handler.tags = ['games']
handler.command = /^(ppt)$/i
export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]}