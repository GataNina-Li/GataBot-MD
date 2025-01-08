import fetch from 'node-fetch'
let handler = async(m, { conn, text, command, usedPrefix }) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()}${mid.smsTikTok6}\n*${usedPrefix + command} Gata_Dios*`
try {
const apiUrl = `${apis}/tools/tiktokstalk?q=${encodeURIComponent(args[0])}`;
const apiResponse = await fetch(apiUrl);
const delius = await apiResponse.json();
if (!delius || !delius.result || !delius.result.users) return m.react("❌");
const profile = delius.result.users;
const stats = delius.result.stats;
let gata = `👤 ${mid.user} 
 ${profile.username}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
✨ ${mid.name}
${profile.nickname}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
✅️ VERIFICADO 
${profile.verified ? 'Sí' : 'No'}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
💖 ${mid.smsinsta1}
 ${stats.followerCount.toLocaleString()}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
❇️ ${mid.smsinsta2}
${stats.followingCount.toLocaleString()}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
❤️ ${mid.smsinsta5}
 ${stats.heartCount.toLocaleString()}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
🎁 ${mid.smsinsta3}
${stats.videoCount.toLocaleString()}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
👀 FIRMAR:
${profile.signature}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*○ URL*: 
${profile.url}
`.trim()

await conn.sendFile(m.chat, profile.avatarLarger, 'tt.png', gata, m);
m.react("✅");
} catch (e2) {
try {
let res = await fetch(`https://api.lolhuman.xyz/api/stalktiktok/${text}?apikey=${lolkeysapi}`)
let res2 = `https://api.lolhuman.xyz/api/pptiktok/${text}?apikey=${lolkeysapi}`
let json = await res.json()
if (res.status !== 200) throw await res.text()
if (!json.status) throw json
let thumb = await (await fetch(json.result.user_picture)).buffer()
let gata = `👤 ${mid.user} 
${json.result.username}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
✨ ${mid.name}
${json.result.nickname}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
✅ ${mid.smsinsta1}
${json.result.followers}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
❇️ ${mid.smsinsta2}
${json.result.followings}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
❤️ ${mid.smsinsta5}
${json.result.likes}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
🎁 ${mid.smsinsta3}
${json.result.video}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
👀 ${mid.smsinsta4}
${json.result.bio}`.trim()
await conn.sendButton(m.chat, gata, wm, res2, [
['𝙈𝙚𝙣𝙪 𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙨 🌀', '#descargasmenu'],
['𝙈𝙚𝙣𝙪 𝘾𝙤𝙢𝙥𝙡𝙚𝙩𝙤 | 𝙁𝙪𝙡𝙡 𝙈𝙚𝙣𝙪 ✨', '.allmenu'],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']], null, null, m)
//conn.sendFile(m.chat, res2, 'error.jpg', gata, m, false)
} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
}}}
handler.help = ['tiktokstalk'].map(v => v + ' <username>')
handler.tags = ['stalk']
handler.command = /^(tiktokstalk|ttstalk)$/i
//handler.exp = 48
handler.register = true
export default handler

/*let info = `💖 *Infórmate sobre las Novedades y recuerda tener la última versión.*\n\n💝 *Find out about what's new and remember to have the latest version.*
  `.trim()
  
await conn.sendHydrated(m.chat, info, wm, null, ig, '𝙄𝙣𝙨𝙩𝙖𝙜𝙧𝙖𝙢', null, null, [
['𝙈𝙚𝙣𝙪 𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙨 🌀', '#descargasmenu'],
['𝙈𝙚𝙣𝙪 𝘾𝙤𝙢𝙥𝙡𝙚𝙩𝙤 | 𝙁𝙪𝙡𝙡 𝙈𝙚𝙣𝙪 ✨', '.allmenu'],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m,)  */