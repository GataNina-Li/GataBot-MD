import {search, download} from 'aptoide-scraper';
import axios from 'axios';
import cheerio from 'cheerio';
const handler = async (m, {conn, usedPrefix, command, text}) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()} ${mid.smsApk}`;
try {    
const res = await fetch(`https://api.dorratz.com/v2/apk-dl?text=${text}`);
const data = await res.json();
let response = `${eg}┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┃💫 ${mid.name}: ${data.name}\n┃📦 𝙋𝘼𝘾𝙆𝘼𝙂𝙀:  ${data.package}\n┃🕒 ${mid.smsApk2}:  ${data.lastUpdate}\n┃💪 ${mid.smsYT11} ${data.size}\n┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┃ ${mid.smsApk3} 🚀🚀🚀`
await conn.sendFile(m.chat, data.icon, 'error.jpg', response, m);
const apkSize = data.size.toLowerCase();
if (apkSize.includes('gb') || (apkSize.includes('mb') && parseFloat(apkSize) > 999)) {
return await conn.sendMessage(m.chat, {text: mid.smsApk4}, {quoted: m})
}
await conn.sendMessage(m.chat, {document: { url: data.dllink }, mimetype: 'application/vnd.android.package-archive', fileName: `${data.name}.apk`, caption: null }, { quoted: m });
} catch {
try {
const res = await fetch(`${apis}/download/apk?query=${text}`);
const data = await res.json();
if (!data.status || !data.data) throw 'error'
const apkData = data.data;
let response = `${eg}┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┃💫 ${mid.name}: ${apkData.name}\n┃📦 𝙋𝘼𝘾𝙆𝘼𝙂𝙀:  ${apkData.developer}\n┃🕒 ${mid.smsApk2}:  ${apkData.publish}\n┃💪 ${mid.smsYT11}  ${apkData.size}\n┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┃ ${mid.smsApk3} 🚀🚀🚀`
await conn.sendMessage(m.chat, {image: {url: apkData.image}, caption: response}, {quoted: m});
if (apkData.size.includes('GB') || parseFloat(apkData.size.replace(' MB', '')) > 999) {
return await conn.sendMessage(m.chat, {text: mid.smsApk4}, {quoted: m})}
await conn.sendMessage(m.chat, {document: { url: apkData.download }, mimetype: 'application/vnd.android.package-archive', fileName: `${apkData.name}.apk`, caption: null }, { quoted: m });
} catch (error) {
try {
const searchA = await search(text);
const data5 = await download(searchA[0].id);
let response = `${eg}┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┃💫 ${mid.name}: ${data5.name}\n┃📦 𝙋𝘼𝘾𝙆𝘼𝙂𝙀: ${data5.package}\n┃🕒 ${mid.smsApk2}: ${data5.lastup}\n┃💪 ${mid.smsYT11} ${data5.size}\n┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┃ ${mid.smsApk3} 🚀🚀🚀`
await conn.sendMessage(m.chat, {image: {url: data5.icon}, caption: response}, {quoted: m});
if (data5.size.includes('GB') || data5.size.replace(' MB', '') > 999) {
return await conn.sendMessage(m.chat, {text: mid.smsApk4}, {quoted: m})}
await conn.sendMessage(m.chat, {document: {url: data5.dllink}, mimetype: 'application/vnd.android.package-archive', fileName: data5.name + '.apk', caption: null}, {quoted: m}); 
} catch (e) {
conn.sendButton(m.chat, `Ocurrió un error temporal, toque el botón reintentar...`, wm, null, [['Reintentar', `.apk2 ${text}`]], null, null, m)
//await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
handler.limit = false
}}}}
handler.command = /^(apkmod|apk|modapk|dapk2|aptoide|aptoidedl)$/i;
handler.register = true
handler.limit = 2
export default handler;

async function searchApk(text) {
  const response = await axios.get(`${apkpureApi}${encodeURIComponent(text)}`);
  const data = response.data;
  return data.results;
}

async function downloadApk(id) {
  const response = await axios.get(`${apkpureDownloadApi}${id}`);
  const data = response.data;
  return data;
}

/* Codigo con botones obsoleto 
import {search, download} from 'aptoide-scraper';
const handler = async (m, {conn, usedPrefix, command, text}) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()} ${mid.smsApk}`;
try {    
if(command.toLowerCase() !=="apkmodr")
{
	const searchA = await search(text);
	let listSections = [];
for (let index = 0; index< searchA.length; index++) {	    
        listSections.push({
            rows: [
                {
                    header: `Aplicacion ${index+1}`,
                    title: "",
                    description: `${searchA[index].name}\n`, 
                    id: `${usedPrefix}apkmodr ${searchA[index].id}`
                }
            ]
        });
    }
  return await conn.sendList(m.chat, `${htki} *𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊𝙎* ${htka}\n`, `\n𝘽𝙪𝙨𝙦𝙪𝙚𝙙𝙖 𝙙𝙚: ${text}`, `𝗕 𝗨 𝗦 𝗖 𝗔 𝗥`, listSections, fkontak);
}	

const data5 = await download(`${text}`);
let response = `${eg}┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┃💫 ${mid.name}: ${data5.name}\n┃📦 𝙋𝘼𝘾𝙆𝘼𝙂𝙀: ${data5.package}\n┃🕒 ${mid.smsApk2}: ${data5.lastup}\n┃💪 ${mid.smsYT11} ${data5.size}\n┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n┃ ${mid.smsApk3} 🚀🚀🚀`
await conn.sendMessage(m.chat, {image: {url: data5.icon}, caption: response}, {quoted: m});
if (data5.size.includes('GB') || data5.size.replace(' MB', '') > 999) {
return await conn.sendMessage(m.chat, {text: mid.smsApk4}, {quoted: m})}
await conn.sendMessage(m.chat, {document: {url: data5.dllink}, mimetype: 'application/vnd.android.package-archive', fileName: data5.name + '.apk', caption: null}, {quoted: m}); 
} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)}
}
handler.command = /^(apkmod|apk|modapk|dapk2|aptoide|aptoidedl|apkmodr)$/i;
handler.register = true
handler.limit = 2
export default handler;
*/
