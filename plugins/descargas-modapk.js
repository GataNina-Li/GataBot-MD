import {search, download} from 'aptoide-scraper';
const handler = async (m, {conn, usedPrefix, command, text}) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()} ${mid.smsApk}`;
try {    
const searchA = await search(text);
const data5 = await download(searchA[0].id);
let response = `${eg}┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┃💫 ${mid.name}: ${data5.name}\n┃📦 𝙋𝘼𝘾𝙆𝘼𝙂𝙀: ${data5.package}\n┃🕒 ${mid.smsApk2}: ${data5.lastup}\n┃💪 ${mid.smsYT11} ${data5.size}\n┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┃ ${mid.smsApk3} 🚀🚀🚀`
await conn.sendMessage(m.chat, {image: {url: data5.icon}, caption: response}, {quoted: m});
if (data5.size.includes('GB') || data5.size.replace(' MB', '') > 999) {
return await conn.sendMessage(m.chat, {text: mid.smsApk4}, {quoted: m})}
await conn.sendMessage(m.chat, {document: {url: data5.dllink}, mimetype: 'application/vnd.android.package-archive', fileName: data5.name + '.apk', caption: null}, {quoted: m}); 
} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
handler.limit = false
}};
handler.command = /^(apkmod|apk|modapk|dapk2|aptoide|aptoidedl)$/i;
handler.register = true
handler.limit = 2
export default handler;
