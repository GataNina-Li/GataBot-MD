let handler = async (m, { isPrems, conn }) => {
let time = global.db.data.users[m.sender].lastcofre + 86400000 // 36000000 10 Horas //86400000 24 Horas
if (new Date - global.db.data.users[m.sender].lastcofre < 86400000) throw `𝙔𝘼 𝙍𝙀𝘾𝙇𝘼𝙈𝘼𝙎𝙏𝙀 𝙏𝙐 𝘾𝙊𝙁𝙍𝙀 ⚗️\n𝙑𝙐𝙀𝙇𝙑𝙀 𝙀𝙉 *${msToTime(time - new Date())}* 𝙋𝘼𝙍𝘼 𝙑𝙊𝙇𝙑𝙀𝙍 𝘼 𝙍𝙀𝘾𝙇𝘼𝙈𝘼𝙍\n\n𝙔𝙊𝙐 𝘼𝙇𝙍𝙀𝘼𝘿𝙔 𝘾𝙇𝘼𝙄𝙈𝙀𝘿 𝙔𝙊𝙐𝙍 𝘾𝙊𝙁𝙁𝙀𝙍 ⚗️\n𝘾𝙊𝙈𝙀 𝘽𝘼𝘾𝙆 𝙄𝙉 *${msToTime(time - new Date())}* 𝙏𝙊 𝘾𝙇𝘼𝙄𝙈 𝘼𝙂𝘼𝙄𝙉`

let img = 'https://img.freepik.com/vector-gratis/cofre-monedas-oro-piedras-preciosas-cristales-trofeo_107791-7769.jpg?w=2000'
let dia = Math.floor(Math.random() * 30)
let tok = Math.floor(Math.random() * 10)
let gata = Math.floor(Math.random() * 4000)
let expp = Math.floor(Math.random() * 5000)

  global.db.data.users[m.sender].limit += dia
  global.db.data.users[m.sender].money += gata
  global.db.data.users[m.sender].joincount += tok
  global.db.data.users[m.sender].exp += expp
  
let texto = `
╭━━🎉━🎉━🎉━━⬣
┃✨ 𝙊𝘽𝙏𝙄𝙀𝙉𝙀𝙎 𝙐𝙉 𝘾𝙊𝙁𝙍𝙀!!
┃✨ 𝙔𝙊𝙐 𝙂𝙀𝙏 𝘼 𝘾𝙊𝙁𝙁𝙀𝙍!!
┃ ┈┈┈┈┈┈┈┈┈┈┈┈┈
┃⚗️ *${dia} Diamantes* 💎
┃⚗️ *${tok} Tokens* 🪙
┃⚗️ *${gata} GataCoins* 🐈
┃⚗️ *${expp} Exp* ⚡
╰━━〔 𓃠 *${vs}* 〕━━⬣`

const fkontak = {
	"key": {
    "participants":"0@s.whatsapp.net",
		"remoteJid": "status@broadcast",
		"fromMe": false,
		"id": "Halo"
	},
	"message": {
		"contactMessage": {
			"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
		}
	},
	"participant": "0@s.whatsapp.net"
}

await conn.sendFile(m.chat, img, 'gata.jpg', texto, fkontak)
//await conn.sendButton(m.chat, texto, wm, img, [['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu'] ], fkontak, m)  
global.db.data.users[m.sender].lastcofre = new Date * 1
}
handler.help = ['daily']
handler.tags = ['xp']
handler.command = ['coffer', 'cofre', 'abrircofre', 'cofreabrir'] 
handler.level = 5
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

  return hours + " Horas " + minutes + " Minutos"
}
