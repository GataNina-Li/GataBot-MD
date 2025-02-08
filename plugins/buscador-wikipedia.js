import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) return conn.reply(m.chat, `🪼 Por favor proporciona un término de búsqueda. Ejemplo: *${usedPrefix + command} El gato con bota*`, m);
try {
let result = await wikiSearch(text);
if (!result) throw `No se encontró información sobre "${text}".`;
let info = `🪭 *Resultados de Wikipedia:* ${text}\n🪽 *Título:* ${result.title}\n🪽 *Descripción:* ${result.description}\n🪽 *Link:* ${result.link}\n\n${wm}`;       
conn.sendMessage(m.chat, { text: info, contextInfo: { forwardingScore: 9999999, isForwarded: true, externalAdReply: { showAdAttribution: true, containsAutoReply: true, renderLargerThumbnail: true, title: 'Wikipedia', body: wm, mediaType: 1, thumbnailUrl: result.thumbnail || 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png', mediaUrl: result.link, sourceUrl: result.link }}}, { quoted: m });
} catch (e1) {
m.reply(`${e1.message || e1}`);
}};

handler.help = ['wikipedia'].map((v) => v + ' <apa>');
handler.tags = ['internet'];
handler.command = /^(wiki|wikipedia)$/i;
handler.exp = 40
handler.level = 3
handler.limit = 1
handler.register = true
export default handler;

async function wikiSearch(query) {
try {
let response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`);
if (response.data && response.data.title && response.data.extract) { return { title: response.data.title, description: response.data.extract, link: response.data.content_urls.desktop.page, thumbnail: response.data.thumbnail ? response.data.thumbnail.source : null }; }
return null;
} catch (error) {
console.error(`Error en wikiSearch: ${error}`);
return null;
}}

/*import axios from 'axios';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
const handler = async (m, {conn, text, usedPrefix, command}) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()}${mid.smsMalused}\n*${usedPrefix + command} Universe*`
  wikipedia(`${text}`).then((res) => {
conn.reply(m.chat, `${mid.buscador9}\n\n` + res.result.isi, fkontak, { contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿 | 𝙒𝙞𝙠𝙞𝙥𝙚𝙙𝙞𝙖', body: '𝗦𝘂𝗽𝗲𝗿 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗕𝗼𝘁 🐱❤️', previewType: 0, thumbnail: imagen2, sourceUrl: accountsgb }}})
}).catch((e) => {
conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
handler.limit = false
})};
handler.help = ['wikipedia'].map((v) => v + ' <apa>');
handler.tags = ['internet'];
handler.command = /^(wiki|wikipedia)$/i;
handler.exp = 40
handler.level = 3
handler.limit = 1
handler.register = true
export default handler;

async function wikipedia(querry) {
  try {
    const link = await axios.get(`https://es.wikipedia.org/wiki/${querry}`);
    const $ = cheerio.load(link.data);
    const judul = $('#firstHeading').text().trim();
    const thumb = $('#mw-content-text').find('div.mw-parser-output > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > a > img').attr('src') || `//i.ibb.co/nzqPBpC/http-error-404-not-found.png`;
    const isi = [];
    $('#mw-content-text > div.mw-parser-output').each(function(rayy, Ra) {
      const penjelasan = $(Ra).find('p').text().trim();
      isi.push(penjelasan);
    });
    for (const i of isi) {
      const data = {
        status: link.status,
        result: {
          judul: judul,
          thumb: 'https:' + thumb,
          isi: i}};
      return data;
    }
  } catch (err) {
    const notFond = {
      status: link.status,
      Pesan: eror};
    return notFond;
  }
}*/
