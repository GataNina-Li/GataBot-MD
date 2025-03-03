import { youtubedl, youtubedlv2 } from '@bochilteam/scraper' 
import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import { ogmp3 } from '../lib/youtubedl.js'; 
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ytmp3, ytmp4 } = require("@hiudyy/ytdl");
const LimitAud = 700 * 1024 * 1024; // 700MB

let handler = async (m, { text, conn, args, usedPrefix, command }) => {
if (!args[0]) return conn.reply(m.chat, `${lenguajeGB['smsAvisoMG']()}${mid.smsMalused7}\n*${usedPrefix + command} https://youtu.be/c5gJRzCi0f0*`, fkontak, m);
const yt_play = await search(args.join(' '));
let youtubeLink = '';
if (args[0].includes('you')) {
youtubeLink = args[0];
} else {
const index = parseInt(args[0]) - 1;
if (index >= 0) {
if (Array.isArray(global.videoList) && global.videoList.length > 0) {
const matchingItem = global.videoList.find(item => item.from === m.sender);
if (matchingItem) {
if (index < matchingItem.urls.length) {
youtubeLink = matchingItem.urls[index];
} else {
throw `${lenguajeGB['smsAvisoFG']()}${mid.smsYT} ${matchingItem.urls.length}*`;
}} else {
throw `${lenguajeGB['smsAvisoMG']()} ${mid.smsY2(usedPrefix, command)} ${usedPrefix}playlist <texto>*`;
}} else {
throw `${lenguajeGB['smsAvisoMG']()}${mid.smsY2(usedPrefix, command)} ${usedPrefix}playlist <texto>*`;
}}}

await conn.reply(m.chat, lenguajeGB['smsAvisoEG']() + mid.smsAud, fkontak, m);
const [input, quality = '320'] = text.split(' ');
const validQualities = ['64', '96', '128', '192', '256', '320'];
const selectedQuality = validQualities.includes(quality) ? quality : '320';

const audioApis = [
{ url: () => ogmp3.download(yt_play[0].url, selectedQuality, 'audio'), extract: (data) => ({ data: data.result.download, isDirect: false }) },
{ url: () => ytmp3(args), extract: (data) => ({ data, isDirect: true }) },
{ url: () => fetch(`https://api.neoxr.eu/api/youtube?url=${args}&type=audio&quality=128kbps&apikey=GataDios`).then(res => res.json()), extract: (data) => ({ data: data.data.url, isDirect: false }) },
{ url: () => fetch(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${args}&apikey=${fgkeysapi}`).then(res => res.json()), extract: (data) => ({ data: data.result.dl_url, isDirect: false }) },
{ url: () => fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => ({ data: data.dl, isDirect: false }) },
{ url: async () => {
let searchh = await yts(yt_play[0].url);
let __res = searchh.all.filter(v => v.type === "video");
let infoo = await ytdl.getInfo('https://youtu.be/' + __res[0].videoId);
let ress = await ytdl.chooseFormat(infoo.formats, { filter: 'audioonly' });
return ress;
}, extract: (data) => ({ data: data.url, isDirect: false }) },
{ url: async () => {
let q = '128kbps';
let v = youtubeLink || yt_play[0].url;
const yt = await youtubedl(v).catch(async _ => await youtubedlv2(v));
return yt.audio[q].download();
}, extract: (data) => ({ data, isDirect: false }) },
{ url: () => fetch(`${apis}/download/ytmp3?url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => ({ data: data.result?.link, isDirect: false }) },
{ url: () => fetch(`https://api.dorratz.com/v3/ytdl?url=${encodeURIComponent(yt_play[0].url)}`).then(res => res.json()), extract: (data) => { 
const mp3 = data.medias.find(media => media.quality === "160kbps" && media.extension === "mp3");
return { data: mp3.url, isDirect: false }}
}];

const download = async (apis) => {
let audioData = null;
let isDirect = false;
for (const api of apis) {
try {
const data = await api.url();
const { data: extractedData, isDirect: direct } = api.extract(data);
if (extractedData) {
const size = await getFileSize(extractedData);
if (size >= 1024) {
audioData = extractedData;
isDirect = direct;
break;
}}
} catch (e) {
console.log(`Error con API: ${e}`);
continue;
}}
return { audioData, isDirect };
};

const { audioData, isDirect } = await download(audioApis);
if (audioData) {
const fileSize = await getFileSize(audioData);
if (fileSize > LimitAud) {
await conn.sendMessage(m.chat, { document: isDirect ? audioData : { url: audioData }, mimetype: 'audio/mpeg', fileName: `${yt_play[0].title || 'audio'}.mp3` }, { quoted: m });
} else {
await conn.sendMessage(m.chat, { audio: isDirect ? audioData : { url: audioData }, mimetype: 'audio/mpeg' }, { quoted: m });
}
} else {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m);
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`);
}};
handler.command = /^audio|fgmp3|dlmp3|getaud|yt(a|mp3)$/i;
handler.register = true;
export default handler;

async function search(query, options = {}) {
  const search = await yts.search({ query, hl: 'es', gl: 'ES', ...options });
  return search.videos;
}

async function getFileSize(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return parseInt(response.headers.get('content-length') || 0);
  } catch {
    return 0;
  }
}