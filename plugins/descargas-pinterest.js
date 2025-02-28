//import { pinterest } from '@bochilteam/scraper'
import axios from 'axios'
let handler = async(m, { conn, text, usedPrefix, command }) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()} ${mid.smsMalused7}\n*${usedPrefix + command} gata | cat*` 
m.react("🚀")
try {
let response = await axios.get(`https://api.dorratz.com/v2/pinterest?q=${text}`);
let searchResults = response.data; 
let selectedResults = searchResults.slice(0, 9); 
if (m.isWABusiness) {
const medias = selectedResults.map(result => ({image: { url: result.image }, caption: result.fullname || text }));
await conn.sendAlbumMessage(m.chat, medias, { quoted: m, delay: 2000, caption: `${lenguajeGB['smsAvisoEG']()} 💞 ${mid.buscador}: ${text}` });
} else {
let messages = selectedResults.map(result => [
``,
`*${result.fullname || text}*\n*💞 Autor:* ${result.upload_by}\n*💞 Seguidores:* ${result.followers}`, 
result.image 
]);
await conn.sendCarousel(m.chat, `${lenguajeGB['smsAvisoEG']()} 💞 ${mid.buscador}: ${text}`, "🔍 Pinterest Search\n" + wm, messages, m);
m.react("✅️");
}
} catch {
try {
let response = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(text)}`);
if (!response.data.status) return await m.reply("❌ No se encontraron resultados.")
let searchResults = response.data.data; 
let selectedResults = searchResults.slice(0, 6); 
let messages = selectedResults.map(result => [result.grid_title || text, gt, result.images_url]);
await conn.sendCarousel(m.chat, `${lenguajeGB['smsAvisoEG']()} 💞 ${mid.buscador}: ${text}`, "🔍 Pinterest Search", messages, m);
} catch {
try {
let { data: response } = await axios.get(`${apis}/search/pinterestv2?text=${encodeURIComponent(text)}`);
if (!response.status || !response.data || response.data.length === 0) return m.reply(`❌ No se encontraron resultados para "${text}".`);
let searchResults = response.data;
let selectedResults = searchResults.slice(0, 6);
let messages = selectedResults.map(result => [
result.description || null, `🔎 Autor: ${result.name} (@${result.username})`, result.image]);
await conn.sendCarousel(m.chat, `${lenguajeGB['smsAvisoEG']()} 💞 ${mid.buscador}: ${text}`, "🔍 Pinterest Search", messages, m);
/*const response=await fetch(`${apis}/search/pinterest?text=${text}`)
const dataR = await response.json()
const json=dataR.result
await conn.sendFile(m.chat, json.getRandom(), 'error.jpg', `${lenguajeGB['smsAvisoEG']()} 💞 ${mid.buscador}: ${text}`.trim(), m)*/
} catch (e) {
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
handler.money = false
}}}}
handler.help = ['pinterest <keyword>']
handler.tags = ['internet']
handler.command = /^(pinterest|dlpinterest|pinterestdl)$/i
handler.money = 50
export default handler