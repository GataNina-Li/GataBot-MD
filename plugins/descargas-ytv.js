import { youtubedl, youtubedlv2 } from '@bochilteam/scraper' 
import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';
import { ogmp3 } from '../lib/youtubedl.js'; 
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ytmp3, ytmp4 } = require("@hiudyy/ytdl");
const LimitVid = 450 * 1024 * 1024; // 450MB

let handler = async (m, { conn, args, usedPrefix, command }) => {
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
throw `${lenguajeGB['smsAvisoFG']()} ${mid.smsYT} ${matchingItem.urls.length}*`;
}} else {
throw `${lenguajeGB['smsAvisoMG']()}${mid.smsY2(usedPrefix, command)} ${usedPrefix}playlist <texto>*`;
}} else {
throw `${lenguajeGB['smsAvisoMG']()}${mid.smsY2(usedPrefix, command)}${usedPrefix}playlist <texto>*`;
}}}

await conn.reply(m.chat, lenguajeGB['smsAvisoEG']() + mid.smsVid, fkontak, m);
const [input, quality = '720'] = args.join(' ').split(' ');
const validQualities = ['240', '360', '480', '720', '1080'];
const selectedQuality = validQualities.includes(quality) ? quality : '720';

const videoApis = [
{ url: () => ogmp3.download(yt_play[0].url, selectedQuality, 'video'), extract: (data) => ({ data: data.result.download, isDirect: false }) },
{ url: () => ytmp4(args), extract: (data) => ({ data, isDirect: false }) },
{ url: () => fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${args}`).then(res => res.json()), extract: (data) => ({ data: data.dl, isDirect: false }) },
{ url: () => fetch(`https://api.neoxr.eu/api/youtube?url=${args}&type=video&quality=720p&apikey=GataDios`).then(res => res.json()), extract: (data) => ({ data: data.data.url, isDirect: false }) },
{ url: () => fetch(`${global.APIs.fgmods.url}/downloader/ytmp4?url=${args}&apikey=${global.APIs.fgmods.key}`).then(res => res.json()), extract: (data) => ({ data: data.result.dl_url, isDirect: false }) },
{ url: () => fetch(`${apis}/download/ytmp4?url=${args}`).then(res => res.json()), extract: (data) => ({ data: data.status ? data.data.download.url : null, isDirect: false }) },
{ url: () => fetch(`https://exonity.tech/api/ytdlp2-faster?apikey=adminsepuh&url=${args}`).then(res => res.json()), extract: (data) => ({ data: data.result.media.mp4, isDirect: false }) },
{ url: async () => {
let searchh = await yts(youtubeLink);
let __res = searchh.all.filter(v => v.type === "video");
let infoo = await ytdl.getInfo('https://youtu.be/' + __res[0].videoId);
return ytdl.chooseFormat(infoo.formats, { filter: 'videoandaudio' });
}, extract: (data) => ({ data: data.url, isDirect: false }) },
{ url: async () => {
let q = selectedQuality + 'p';
const yt = await youtubedl(youtubeLink).catch(async _ => await youtubedlv2(youtubeLink));
return yt.video[q].download();
}, extract: (data) => ({ data, isDirect: false })
}];

const download = async (apis) => {
let videoData = null;
let isDirect = false;
let title = 'video';
for (const api of apis) {
try {
const data = await api.url();
const { data: extractedData, isDirect: direct } = api.extract(data);
if (extractedData) {
const size = await getFileSize(extractedData);
if (size >= 1024) {
videoData = extractedData;
isDirect = direct;
break;
}}
} catch (e) {
console.log(`Error con API: ${e}`);
continue;
}}
return { videoData, isDirect };
};

const { videoData, isDirect } = await download(videoApis);
if (videoData) {
const fileSize = await getFileSize(videoData);
const messageOptions = { fileName: `${yt_play[0].title}.mp4`, 
caption: `╭━❰ ${wm} ❱━⬣\n┃ 💜 ${mid.smsYT1}\n┃ ${yt_play[0].title} (${selectedQuality}p)\n╰━━━━━❰ *𓃠 ${vs}* ❱━━━━⬣`,  mimetype: 'video/mp4' };
if (fileSize > LimitVid) {
await conn.sendMessage(m.chat, { document: isDirect ? videoData : { url: videoData }, ...messageOptions }, { quoted: m });
} else {
await conn.sendMessage(m.chat, { video: isDirect ? videoData : { url: videoData }, thumbnail: await fetch((await yts(youtubeLink)).videos[0].thumbnail), ...messageOptions }, { quoted: m });
}} else {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m);
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`);
}};
handler.command = /^video|fgmp4|dlmp4|getvid|yt(v|mp4)?$/i;
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

function bytesToSize(bytes) {
return new Promise((resolve, reject) => {
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
if (bytes === 0) return 'n/a';
const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
if (i === 0) resolve(`${bytes} ${sizes[i]}`);
resolve(`${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`)})};

async function ytMp3(url) {
return new Promise((resolve, reject) => {
ytdl.getInfo(url).then(async(getUrl) => {
let result = [];
for(let i = 0; i < getUrl.formats.length; i++) {
let item = getUrl.formats[i];
if (item.mimeType == 'audio/webm; codecs=\"opus\"') {
let { contentLength } = item;
let bytes = await bytesToSize(contentLength);
result[i] = { audio: item.url, size: bytes }}};
let resultFix = result.filter(x => x.audio != undefined && x.size != undefined) 
let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].audio}`);
let tinyUrl = tiny.data;
let title = getUrl.videoDetails.title;
let thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
resolve({ title, result: tinyUrl, result2: resultFix, thumb })}).catch(reject)})}

async function ytMp4(url) {
return new Promise(async(resolve, reject) => {
ytdl.getInfo(url).then(async(getUrl) => {
let result = [];
for(let i = 0; i < getUrl.formats.length; i++) {
let item = getUrl.formats[i];
if (item.container == 'mp4' && item.hasVideo == true && item.hasAudio == true) {
let { qualityLabel, contentLength } = item;
let bytes = await bytesToSize(contentLength);
result[i] = { video: item.url, quality: qualityLabel, size: bytes }}};
let resultFix = result.filter(x => x.video != undefined && x.size != undefined && x.quality != undefined) 
let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].video}`);
let tinyUrl = tiny.data;
let title = getUrl.videoDetails.title;
let thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
resolve({ title, result: tinyUrl, rersult2: resultFix[0].video, thumb })}).catch(reject)})};

async function ytPlay(query) {
return new Promise((resolve, reject) => {
yts(query).then(async(getData) => {
let result = getData.videos.slice( 0, 5 );
let url = [];
for (let i = 0; i < result.length; i++) { url.push(result[i].url) }
let random = url[0];
let getAudio = await ytMp3(random);
resolve(getAudio)}).catch(reject)})};

async function ytPlayVid(query) {
return new Promise((resolve, reject) => {
yts(query).then(async(getData) => {
let result = getData.videos.slice( 0, 5 );
let url = [];
for (let i = 0; i < result.length; i++) { url.push(result[i].url) }
let random = url[0];
let getVideo = await ytMp4(random);
resolve(getVideo)}).catch(reject)})};
