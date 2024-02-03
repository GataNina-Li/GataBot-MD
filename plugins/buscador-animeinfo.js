import translate from '@vitalets/google-translate-api';
import {Anime} from '@shineiichijo/marika';
const client = new Anime();
const handler = async (m, {conn, text, command, usedPrefix}) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
if (!text) return m.reply(`${lenguajeGB['smsAvisoMG']()} ${mid.smsMalused2}`);
try {
const anime = await client.searchAnime(text);
const result = anime.data[0];
const resultes = await translate(`${result.background}`, {to: 'es', autoCorrect: true});
const resultes2 = await translate(`${result.synopsis}`, {to: 'es', autoCorrect: true});
const AnimeInfo = `🌺 ${mid.smsYT1}
• ${result.title}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈   
🌺 ${mid.buscador2}
• ${result.episodes}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 
🌺 ${mid.buscador3}
• ${result.source.toUpperCase()}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 
🌺 ${mid.buscador4}
• ${result.aired.from}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 
🌺 ${mid.buscador5}
• ${result.popularity}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 
🌺 ${mid.buscador6}
• ${result.favorites}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 
🌺 ${mid.smsYT5}
• ${result.duration}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 
🌺 ${mid.buscador7}
• ${result.rating}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 
🌺 ${mid.buscador8}
• ${result.trailer.url}
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 
🌺 ${mid.smsYT4}
• ${result.url}`;
conn.sendFile(m.chat, result.images.jpg.image_url, 'error.jpg', AnimeInfo, fkontak, false, { contextInfo: {externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: gt, body: ' 😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 ', previewType: 0, thumbnail: gataImg.getRandom(), sourceUrl: accountsgb.getRandom()}}})
//conn.sendFile(m.chat, result.images.jpg.image_url, 'error.jpg', AnimeInfo, fkontak);
} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
}}
handler.command = /^(anime|animeinfo)$/i;
handler.level = 2
export default handler;
