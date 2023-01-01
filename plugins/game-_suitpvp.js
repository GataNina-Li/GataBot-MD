let handler = m => m
handler.before = async function (m) {
this.suit = this.suit ? this.suit : {}
if (db.data.users[m.sender].suit < 0) db.data.users[m.sender].suit = 0
let room = Object.values(this.suit).find(room => room.id && room.status && [room.p, room.p2].includes(m.sender))
if (room) {
let win = ''
let tie = false
if (m.sender == room.p2 && /^(acc(ept)?|terima|aceptar|gas|aceptare?|nao|gamau|rechazar|ga(k.)?bisa)/i.test(m.text) && m.isGroup && room.status == 'wait') {
if (/^(tolak|gamau|rechazar|ga(k.)?bisa)/i.test(m.text)) {
let textno = `*[❗] @${room.p2.split`@`[0]} 𝙍𝙚𝙘𝙝𝙖𝙯𝙤 𝙚𝙡 𝙥𝙫𝙥, 𝙚𝙡 𝙟𝙪𝙚𝙜𝙤𝙨 𝙨𝙚 𝙘𝙖𝙣𝙘𝙚𝙡𝙖*`
m.reply(textno, null, {mentions: this.parseMention(textno)})
delete this.suit[room.id]
return !0 }
room.status = 'play'
room.asal = m.chat
clearTimeout(room.waktu)
let textplay = `🎮 𝙂𝘼𝙈𝙀𝙎 - 𝙋𝙑𝙋 - 𝙂𝘼𝙈𝙀𝙎 🎮\n\n—◉ 𝙀𝙡 𝙟𝙪𝙚𝙜𝙤𝙨 𝙘𝙤𝙢𝙞𝙚𝙣𝙯𝙖, 𝙡𝙖𝙨 𝙤𝙥𝙘𝙞𝙤𝙣𝙚𝙨 𝙝𝙖𝙣 𝙨𝙞𝙙𝙤 𝙚𝙣𝙫𝙞𝙖𝙙𝙖𝙨 𝙖 𝙡𝙤𝙨 𝙘𝙝𝙖𝙩𝙨 𝙥𝙧𝙞𝙫𝙖𝙙𝙤𝙨 𝙙𝙚 @${room.p.split`@`[0]} 𝙮 @${room.p2.split`@`[0]}\n\n◉ 𝙎𝙚𝙡𝙚𝙘𝙘𝙞𝙤𝙣𝙚𝙣 𝙪𝙣𝙖 𝙤𝙥𝙘𝙞𝙤𝙣 𝙚𝙣 𝙨𝙪𝙨 𝙘𝙝𝙖𝙩 𝙥𝙧𝙞𝙫𝙖𝙙𝙤, 𝙧𝙚𝙨𝙥𝙚𝙘𝙩𝙞𝙫𝙖𝙢𝙚𝙣𝙩𝙚\n*• 𝙀𝙡𝙚𝙜𝙞𝙧 𝙤𝙥𝙘𝙞𝙤𝙣 wa.me/${conn.user.jid.split`@`[0]}*`
m.reply(textplay, m.chat, {mentions: this.parseMention(textplay)})
let imgplay = `https://www.merca2.es/wp-content/uploads/2020/05/Piedra-papel-o-tijera-0003318_1584-825x259.jpeg`    
if (!room.pilih) this.sendHydrated(room.p, '𝙋𝙤𝙧 𝙛𝙖𝙫𝙤𝙧 𝙨𝙚𝙡𝙚𝙘𝙘𝙞𝙤𝙣𝙚 𝙪𝙣𝙖 𝙙𝙚 𝙡𝙖𝙨 𝙨𝙞𝙜𝙪𝙞𝙚𝙣𝙩𝙚𝙨 𝙤𝙥𝙘𝙞𝙤𝙣𝙚𝙨', `Ganador +${room.poin}XP\nPerdedor ${room.poin_lose}XP`, imgplay, null, null, null, null, [['PIEDRA 🗿', 'Piedra'], ['PAPEL 📄', 'Papel'], ['TIJERA ✂️', 'Tijera']], m)
if (!room.pilih2) this.sendHydrated(room.p2, '𝙋𝙤𝙧 𝙛𝙖𝙫𝙤𝙧 𝙨𝙚𝙡𝙚𝙘𝙘𝙞𝙤𝙣𝙚 𝙪𝙣𝙖 𝙙𝙚 𝙡𝙖𝙨 𝙨𝙞𝙜𝙪𝙞𝙚𝙣𝙩𝙚𝙨 𝙤𝙥𝙘𝙞𝙤𝙣𝙚𝙨', `Ganador +${room.poin}XP\nPerdedor ${room.poin_lose}XP`, imgplay, null, null, null, null, [['PIEDRA 🗿', 'Piedra'], ['PAPEL 📄', 'Papel'], ['TIJERA ✂️', 'Tijera']], m)                             
room.waktu_milih = setTimeout(() => {
if (!room.pilih && !room.pilih2) this.sendButton(m.chat, `[❗] 𝙉𝙞𝙣𝙜𝙪𝙣 𝙟𝙪𝙜𝙖𝙙𝙤𝙧 𝙩𝙤𝙢𝙤 𝙡𝙖 𝙞𝙣𝙞𝙘𝙞𝙖𝙩𝙞𝙫𝙖 𝙙𝙚 𝙚𝙢𝙥𝙚𝙯𝙖𝙧 𝙚𝙡 𝙟𝙪𝙚𝙜𝙤, 𝙚𝙡 𝙥𝙫𝙥 𝙨𝙚 𝙝𝙖 𝙘𝙖𝙣𝙘𝙚𝙡𝙖𝙙𝙤`, wm, null, [['OK', '.ok']], m)
else if (!room.pilih || !room.pilih2) {
win = !room.pilih ? room.p2 : room.p 
let textnull = `*[❗] @${(room.pilih ? room.p2 : room.p).split`@`[0]}  𝙉𝙤 𝙚𝙡𝙚𝙜𝙞𝙨𝙩𝙚 𝙣𝙞𝙣𝙜𝙪𝙣𝙖 𝙤𝙥𝙘𝙞𝙤𝙣, 𝙛𝙞𝙣 𝙙𝙚𝙡 𝙥𝙫𝙥*`
this.sendButton(m.chat, textnull, wm, null, [['ok', '.ok']], m, { mentions: this.parseMention(textnull)})
db.data.users[win == room.p ? room.p : room.p2].exp += room.poin
db.data.users[win == room.p ? room.p : room.p2].exp += room.poin_bot
db.data.users[win == room.p ? room.p2 : room.p].exp -= room.poin_lose
}
delete this.suit[room.id]
return !0
}, room.timeout)}
let jwb = m.sender == room.p
let jwb2 = m.sender == room.p2
let g = /tijera/i
let b = /piedra/i
let k = /papel/i
let reg = /^(tijera|piedra|papel)/i
if (jwb && reg.test(m.text) && !room.pilih && !m.isGroup) {
room.pilih = reg.exec(m.text.toLowerCase())[0]
room.text = m.text
m.reply(`*[ ✔ ] 𝙃𝙖𝙨 𝙀𝙡𝙚𝙜𝙞𝙙𝙤 ${m.text}, 𝙍𝙚𝙜𝙧𝙚𝙨𝙖 𝙖𝙡 𝙜𝙧𝙪𝙥𝙤 𝙮 ${room.pilih2 ? `𝙍𝙚𝙫𝙞𝙨𝙖 𝙡𝙤𝙨 𝙧𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨*` : '𝙀𝙨𝙥𝙚𝙧𝙖 𝙡𝙤𝙨 𝙧𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨*'}`)
if (!room.pilih2) this.reply(room.p2, '*[❗]  𝙀𝙡 𝙤𝙥𝙤𝙣𝙚𝙣𝙩𝙚 𝙖𝙝 𝙚𝙡𝙚𝙜𝙞𝙙𝙤, 𝙚𝙨 𝙩𝙪 𝙩𝙪𝙧𝙣𝙤 𝙙𝙚 𝙚𝙡𝙚𝙜𝙞𝙧!!*', 0)}
if (jwb2 && reg.test(m.text) && !room.pilih2 && !m.isGroup) {
room.pilih2 = reg.exec(m.text.toLowerCase())[0]
room.text2 = m.text
m.reply(`*[ ✔ ] 𝙃𝙖𝙨 𝙀𝙡𝙚𝙜𝙞𝙙𝙤 ${m.text}, 𝙍𝙚𝙜𝙧𝙚𝙨𝙖 𝙖𝙡 𝙜𝙧𝙪𝙥𝙤 𝙮 ${room.pilih ? `𝙍𝙚𝙫𝙞𝙨𝙖 𝙡𝙤𝙨 𝙧𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨*` : '𝙀𝙨𝙥𝙚𝙧𝙖 𝙡𝙤𝙨 𝙧𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤*'}`)
if (!room.pilih) this.reply(room.p, '*[❗] 𝙀𝙡 𝙤𝙥𝙤𝙣𝙚𝙣𝙩𝙚 𝙖𝙝 𝙚𝙡𝙚𝙜𝙞𝙙𝙤, 𝙚𝙨 𝙩𝙪 𝙩𝙪𝙧𝙣𝙤 𝙙𝙚 𝙚𝙡𝙚𝙜𝙞𝙧!!*', 0)}
let stage = room.pilih
let stage2 = room.pilih2
if (room.pilih && room.pilih2) {
clearTimeout(room.waktu_milih)
if (b.test(stage) && g.test(stage2)) win = room.p
else if (b.test(stage) && k.test(stage2)) win = room.p2
else if (g.test(stage) && k.test(stage2)) win = room.p
else if (g.test(stage) && b.test(stage2)) win = room.p2
else if (k.test(stage) && b.test(stage2)) win = room.p
else if (k.test(stage) && g.test(stage2)) win = room.p2
else if (stage == stage2) tie = true 
this.reply(room.asal, `
*🐈 𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊𝙎 𝘿𝙀𝙇 𝙋𝙑𝙋 🐈*${tie ? '\n*—◉ 𝙀𝙈𝙋𝘼𝙏𝙀!!*' : ''}

*@${room.p.split`@`[0]} (${room.text}) ${tie ? '' : room.p == win ? ` 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊 🥳 +${room.poin}XP*` : ` 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊 🤡 ${room.poin_lose}XP*`}
*@${room.p2.split`@`[0]} (${room.text2}) ${tie ? '' : room.p2 == win ? ` 𝙃𝘼 𝙂𝘼𝙉𝘼𝘿𝙊 🥳 +${room.poin}XP*` : ` 𝙃𝘼 𝙋𝙀𝙍𝘿𝙄𝘿𝙊 🤡 ${room.poin_lose}XP*`}
`.trim(), m, { mentions: [room.p, room.p2] } )
if (!tie) {
db.data.users[win == room.p ? room.p : room.p2].exp += room.poin
db.data.users[win == room.p ? room.p : room.p2].exp += room.poin_bot
db.data.users[win == room.p ? room.p2 : room.p].exp += room.poin_lose
}
delete this.suit[room.id]}}
return !0
}
handler.exp = 0
export default handler
function random(arr) {
return arr[Math.floor(Math.random() * arr.length)]}









