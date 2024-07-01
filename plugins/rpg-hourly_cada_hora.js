import fetch from 'node-fetch'
let handler = async (m, { isPrems, conn }) => {
let user = global.db.data.users[m.sender]
let premium = user.premium

let botol = `${pickRandom([1, 1, 2, 3, 3, 0, 0])}` * 1
let botolpremium = `${pickRandom([3, 3, 7, 7, 5, 5])}` * 1
	
let batu = `${pickRandom([2, 2, 1, 1, 1, 1, 3])}` * 1
let batupremium = `${pickRandom([4, 4, 3, 7, 7, 5])}` * 1

let potion = `${pickRandom([1, 2, 3, 4, 5])}` * 1
let potionpremium = `${pickRandom([2, 4, 6, 9, 12])}` * 1

let common = `${pickRandom([1, 0, 0, 2, 0, 1, 1, 1])}` * 1
let commonpremium = `${pickRandom([2, 2, 1, 3, 4])}` * 1
 
const recompensas = {
  botol: premium ? botolpremium : botol,
  batu: premium ? batupremium : batu,
  common: premium ? commonpremium : common,
}

let time = user.lasthourly + 3600000 //1 Hora //3600000
if (new Date - user.lasthourly < 3600000) return await 
//conn.reply(m.chat, `𝙔𝘼 𝙍𝙀𝘾𝙄𝘽𝙄𝙎𝙏𝙀 𝙏𝙐 𝙀𝙉𝙏𝙀𝙂𝘼 𝘿𝙀 𝘾𝘼𝘿𝘼 𝙃𝙊𝙍𝘼 ♻️\n𝙑𝙐𝙀𝙇𝙑𝙀 𝙀𝙉 *${msToTime(time - new Date())}* 𝙋𝘼𝙍𝘼 𝙍𝙀𝘾𝙄𝘽𝙄𝙍 𝙊𝙏𝙍𝘼 𝙀𝙉𝙏𝙍𝙀𝙂𝘼\n\n𝙔𝙊𝙐 𝘼𝙇𝙍𝙀𝘼𝘿𝙔 𝙍𝙀𝘾𝙀𝙄𝙑𝙀𝘿 𝙔𝙊𝙐𝙍 𝙃𝙊𝙐𝙍𝙇𝙔 𝘿𝙀𝙇𝙄𝙑𝙀𝙍𝙔 ♻️\n𝘾𝙊𝙈𝙀 𝘽𝘼𝘾𝙆 𝙄𝙉 *${msToTime(time - new Date())}* 𝙏𝙊 𝙍𝙀𝘾𝙀𝙄𝙑𝙀 𝘼𝙉𝙊𝙏𝙃𝙀𝙍 𝘿𝙀𝙇𝙄𝙑𝙀𝙍𝙔`, fkontak,  m)
conn.sendButton(m.chat, `𝙔𝘼 𝙍𝙀𝘾𝙄𝘽𝙄𝙎𝙏𝙀 𝙏𝙐 𝙀𝙉𝙏𝙀𝙂𝘼 𝘿𝙀 𝘾𝘼𝘿𝘼 𝙃𝙊𝙍𝘼 ♻️\n𝙑𝙐𝙀𝙇𝙑𝙀 𝙀𝙉 *${msToTime(time - new Date())}* 𝙋𝘼𝙍𝘼 𝙍𝙀𝘾𝙄𝘽𝙄𝙍 𝙊𝙏𝙍𝘼 𝙀𝙉𝙏𝙍𝙀𝙂𝘼\n\n𝙔𝙊𝙐 𝘼𝙇𝙍𝙀𝘼𝘿𝙔 𝙍𝙀𝘾𝙀𝙄𝙑𝙀𝘿 𝙔𝙊𝙐𝙍 𝙃𝙊𝙐𝙍𝙇𝙔 𝘿𝙀𝙇𝙄𝙑𝙀𝙍𝙔 ♻️\n𝘾𝙊𝙈𝙀 𝘽𝘼𝘾𝙆 𝙄𝙉 *${msToTime(time - new Date())}* 𝙏𝙊 𝙍𝙀𝘾𝙀𝙄𝙑𝙀 𝘼𝙉𝙊𝙏𝙃𝙀𝙍 𝘿𝙀𝙇𝙄𝙑𝙀𝙍𝙔`, wm, null, [['𝗠 𝗘 𝗡 𝗨 ☘️', '/menu']], null, null, fkontak)
let texto = ''
for (let reward of Object.keys(recompensas)) {
    if (!(reward in user)) continue
    user[reward] += recompensas[reward]
texto += `*+${recompensas[reward]}* ${global.rpgshop.emoticon(reward)}\n┃ `}
let text = `╭━━🕐━🕑━🕒━━⬣
┃ ♻️ 𝙀𝙉𝙏𝙍𝙀𝙂𝘼 𝘾𝘼𝘿𝘼 𝙃𝙊𝙍𝘼!!
┃ ♻️ 𝙃𝙊𝙐𝙍𝙇𝙔 𝘿𝙀𝙇𝙄𝙑𝙀𝙍𝙔!!
┃ *${premium ? '🎟️ Recompensa Premium' : '🆓 Recompensa Gratis'}*
┃ ${texto}
╰━━🕕━🕔━🕓━━⬣\n\n🎟️ 𝗣 𝗥 𝗘 𝗠 𝗜 𝗨 𝗠 ⇢ ${premium ? '✅' : '❌'}\n${wm}`
let pp = 'https://telegra.ph/file/aea15921a50814cf331ae.jpg'
//conn.sendMessage(m.chat, {image: {url: gataImg}, caption: text, mentions: conn.parseMention(text)}, {quoted: fkontak, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100})
await conn.sendButton(m.chat, text, texto + `\n\n🎟️ 𝗣 𝗥 𝗘 𝗠 𝗜 𝗨 𝗠 ⇢ ${premium ? '✅' : '❌'}\n${wm}`, img5, [['🎁 𝙍𝙀𝙂𝘼𝙇𝙊 | 𝘾𝙇𝘼𝙄𝙈 🎁', '/claim'], ['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']], null, null, m)  
user.lasthourly = new Date * 1
}
handler.help = ['hourly']
handler.tags = ['xp']
handler.command = ['hourly', 'entega', 'cadahora', 'recibirentrega'] 
handler.level = 4
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
