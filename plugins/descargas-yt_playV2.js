import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'
import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';
import fg from 'api-dylux';
const handler = async (m, { command, usedPrefix, conn, args, text }) => {
if (!args[0] || !text) throw `${mg}${mid.smsMalused4}\n*${usedPrefix + command} Billie Eilish - Bellyache*`;
const yt_play = await search(args.join(' '));
const ytplay2 = await yts(text);
try {

if (command === 'play.1' || command === 'audio') {
conn.reply(m.chat, lenguajeGB['smsAvisoEG']() + mid.smsAud, m, { contextInfo: { externalAdReply: { mediaUrl: null, mediaType: 1, description: null, title: wm, body: '😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝗦𝗔𝗽𝗽', previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb }}});
try {
const res = await fetch(`https://api.siputzx.my.id/api/d/ytmp3?url=${yt_play[0].url}`);
let { data } = await res.json();
await conn.sendMessage(m.chat, { audio: { url: data.dl }, mimetype: 'audio/mpeg' }, { quoted: m ||null });
} catch (e1) {
try {  
const axeelUrl = `https://axeel.my.id/api/download/audio?url=${yt_play[0].url}`;
const axeelResponse = await fetch(axeelUrl);
const axeelData = await axeelResponse.json();
if (!axeelData || !axeelData.downloads?.url) throw new Error();
await conn.sendMessage(m.chat, { audio: { url: axeelData.downloads.url }, mimetype: 'audio/mpeg' }, { quoted: m });
} catch {
try {
const ryzenUrl = `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${yt_play[0].url}`;
const ryzenResponse = await fetch(ryzenUrl);
const ryzenData = await ryzenResponse.json();
if (ryzenData.status === 'tunnel' && ryzenData.url) {
const downloadUrl = ryzenData.url;
await conn.sendMessage(m.chat, { audio: { url: downloadUrl }, mimetype: 'audio/mpeg' }, { quoted: m });
}
} catch {
try {          
let d2 = await fetch(`https://exonity.tech/api/ytdlp2-faster?apikey=adminsepuh&url=${yt_play[0].url}`);
let dp = await d2.json();
const audiop = await getBuffer(dp.result.media.mp3);
const fileSize = await getFileSize(dp.result.media.mp3);
await conn.sendMessage(m.chat, { audio: { url: audiop }, mimetype: 'audio/mpeg' }, { quoted: m });
} catch (e) {
console.error('Error al obtener el audio:', e);
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, m);
}}}}}

if (command === 'play.2') {
conn.reply(m.chat, lenguajeGB['smsAvisoEG']() + mid.smsVid, m, { contextInfo: { externalAdReply: { mediaUrl: null, mediaType: 1, description: null, title: wm, body: '😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝗦𝗔𝗽𝗽', previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb }}});
try {
const res = await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${yt_play[0].url}`);
let { data } = await res.json();
await conn.sendFile(m.chat, data.dl, 'error.mp4', `${gt}`, m)
} catch (e1) {
try {  
const axeelUrl = `https://axeel.my.id/api/download/audio?url=${yt_play[0].url}`;
const axeelResponse = await fetch(axeelUrl);
const axeelData = await axeelResponse.json();
if (!axeelData || !axeelData.downloads?.url) throw new Error();
await conn.sendFile(m.chat, axeelData.downloads.url, 'error.mp4', `${gt}`, m)
} catch {
try {
const ryzenUrl = `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${yt_play[0].url}`;
const ryzenResponse = await fetch(ryzenUrl);
const ryzenData = await ryzenResponse.json();
if (ryzenData.status === 'tunnel' && ryzenData.url) {
const downloadUrl = ryzenData.url;
await conn.sendFile(m.chat, downloadUrl, 'error.mp4', `${gt}`, m)
}
} catch {
try {          
let d2 = await fetch(`https://exonity.tech/api/ytdlp2-faster?apikey=adminsepuh&url=${yt_play[0].url}`);
let dp = await d2.json();
const audiop = await getBuffer(dp.result.media.mp3);
const fileSize = await getFileSize(dp.result.media.mp3);
await conn.sendFile(m.chat, audiop, 'error.mp4', `${gt}`, m)
} catch (e) {
console.error('Error al obtener el audio:', e);
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, m);
}}}}}

} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, m);
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`);
console.log(e);
handler.limit = 0; // No gastar límite si fallas
}};
handler.help = ['play.1', 'play.2'].map(v => v + ' <texto>');
handler.tags = ['downloader'];
handler.command = ['play.1', 'play.2'];
handler.limit = 1;

export default handler;

async function search(query, options = {}) {
const search = await yts.search({query, hl: 'es', gl: 'ES', ...options});
return search.videos;
}

function MilesNumber(number) {
const exp = /(\d)(?=(\d{3})+(?!\d))/g;
const rep = '$1.';
const arr = number.toString().split('.');
arr[0] = arr[0].replace(exp, rep);
return arr[1] ? arr.join('.') : arr[0];
}

function secondString(seconds) {
seconds = Number(seconds);
const d = Math.floor(seconds / (3600 * 24));
const h = Math.floor((seconds % (3600 * 24)) / 3600);
const m = Math.floor((seconds % 3600) / 60);
const s = Math.floor(seconds % 60);
const dDisplay = d > 0 ? d + (d == 1 ? ' día, ' : ' días, ') : '';
const hDisplay = h > 0 ? h + (h == 1 ? ' hora, ' : ' horas, ') : '';
const mDisplay = m > 0 ? m + (m == 1 ? ' minuto, ' : ' minutos, ') : '';
const sDisplay = s > 0 ? s + (s == 1 ? ' segundo' : ' segundos') : '';
return dDisplay + hDisplay + mDisplay + sDisplay;
}

 /*import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';
import fg from 'api-dylux';

const handler = async (m, {command, usedPrefix, conn, text}) => {
if (!text) throw `${mg}${mid.smsMalused4}\n*${usedPrefix + command} Billie Eilish - Bellyache*`
try {
if (command == 'play.1') {
conn.reply(m.chat, lenguajeGB['smsAvisoEG']() + mid.smsAud, m, { contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: wm, body: '😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽', previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb }}})
try {
const mediaa = await ytPlay(text);
const audiocore = mediaa.result2?.[0]?.audio || mediaa.result2?.[1]?.audio || mediaa.result2?.[2]?.audio || null;
const aa = await conn.sendMessage(m.chat, {audio: {url: audiocore}, fileName: `error.mp3`, mimetype: 'audio/mp4'}, {quoted: m});
if (!aa) {
throw new Error();
}} catch {
try{const res = await fetch(`https://skizo.tech/api/y2mate?apikey=GataDios&url=${text}`);
const json = await res.json();
const aa_1 = await conn.sendMessage(m.chat, {audio: {url: json.result.audio}, fileName: `error.mp3`, mimetype: 'audio/mp4'}, {quoted: m});
if (!aa_1) aa_1 = await conn.sendFile(m.chat, json.result.audio, 'error.mp3', null, m, false, {mimetype: 'audio/mp4'});
}catch {
try{
let res = await yts(text)
res=res.videos[0]
let yt = await fg.yta(res.url,'128kbps')
await conn.sendMessage(m.chat, {audio: {url: yt.dl_url}, fileName: `error.mp3`, mimetype: 'audio/mp4'}, {quoted: m});
}catch(e){ 
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
handler.limit = 0 //No gastada limite si fallas
}}}}
if (command == 'play.2') {
conn.reply(m.chat, lenguajeGB['smsAvisoEG']() + mid.smsVid, m, {contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: wm, body: '😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽', previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb }}}) 
try {
const mediaa = await ytPlayVid(text);
const aa_2 = await conn.sendMessage(m.chat, {video: {url: mediaa.result}, fileName: `error.mp4`, caption: `${wm}`, thumbnail: mediaa.thumb, mimetype: 'video/mp4'}, {quoted: m});
if (!aa_2) {
throw new Error();
}} catch {
try
{
let res0 = await yts(text)
res0=res0.videos[0]
let yt0 = await fg.ytv(res0.url,'360p')
await conn.sendFile(m.chat, yt0.dl_url, 'error.mp4', `${wm}`, m);
}
catch{
const res = await fetch(`https://skizo.tech/api/y2mate?apikey=GataDios&url=${text}`);
const json = await res.json();
await conn.sendFile(m.chat, json.result.video, 'error.mp4', `${wm}`, m);  
}
}}} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
handler.limit = 0 //No gastada limite si fallas
}}
handler.help = ['play.1' , 'play.2'].map(v => v + ' <texto>')
handler.tags = ['downloader']
handler.command = ['play.1', 'play.2']
handler.limit = 1
export default handler

function bytesToSize(bytes) {
return new Promise((resolve, reject) => {
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
if (bytes === 0) return 'n/a';
const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
if (i === 0) resolve(`${bytes} ${sizes[i]}`);
resolve(`${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`);
})}

async function ytMp3(url) {
return new Promise((resolve, reject) => {
ytdl.getInfo(url).then(async (getUrl) => {
const result = [];
for (let i = 0; i < getUrl.formats.length; i++) {
const item = getUrl.formats[i];
if (item.mimeType == 'audio/webm; codecs=\"opus\"') {
const {contentLength} = item;
const bytes = await bytesToSize(contentLength);
result[i] = {audio: item.url, size: bytes};
}}
const resultFix = result.filter((x) => x.audio != undefined && x.size != undefined);
const tiny = await axios.get(`https://skizo.tech/api/y2mate?apikey=GataDios&url=${resultFix[0].audio}`);
const tinyUrl = tiny.data;
const title = getUrl.videoDetails.title;
const thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
resolve({title, result: tinyUrl, result2: resultFix, thumb});
}).catch(reject);
})}

async function ytMp4(url) {
return new Promise(async (resolve, reject) => {
ytdl.getInfo(url).then(async (getUrl) => {
const result = [];
for (let i = 0; i < getUrl.formats.length; i++) {
const item = getUrl.formats[i];
if (item.container == 'mp4' && item.hasVideo == true && item.hasAudio == true) {
const {qualityLabel, contentLength} = item;
const bytes = await bytesToSize(contentLength);
result[i] = {video: item.url, quality: qualityLabel, size: bytes};
}}
const resultFix = result.filter((x) => x.video != undefined && x.size != undefined && x.quality != undefined);
const tiny = await axios.get(`https://skizo.tech/api/y2mate?apikey=GataDios&url=${resultFix[0].video}`);
const tinyUrl = tiny.data;
const title = getUrl.videoDetails.title;
const thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
resolve({title, result: tinyUrl, rersult2: resultFix[0].video, thumb});
}).catch(reject);
})}

async function ytPlay(query) {
return new Promise((resolve, reject) => {
yts(query).then(async (getData) => {
const result = getData.videos.slice( 0, 5 );
const url = [];
for (let i = 0; i < result.length; i++) {
url.push(result[i].url);
}
const random = url[0];
const getAudio = await ytMp3(random);
resolve(getAudio);
}).catch(reject);
})}

async function ytPlayVid(query) {
return new Promise((resolve, reject) => {
yts(query).then(async (getData) => {
const result = getData.videos.slice( 0, 5 );
const url = [];
for (let i = 0; i < result.length; i++) {
url.push(result[i].url);
}
const random = url[0];
const getVideo = await ytMp4(random);
resolve(getVideo);
}).catch(reject);
})} */

/*import fs from 'fs'
import fetch from 'node-fetch'
let handler = async (m, {command, conn, text, usedPrefix }) => {
if (!text) throw `${mg}𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝙊 𝙏𝙄𝙏𝙐𝙇𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} Billie Eilish - Bellyache*\n\n𝙒𝙍𝙄𝙏𝙀 𝙏𝙃𝙀 𝙉𝘼𝙈𝙀 𝙊𝙍 𝙏𝙄𝙏𝙇𝙀\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} Billie Eilish - Bellyache*`
try {
if (command == 'play.1') {
conn.reply(m.chat, `${eg}𝙀𝙎𝙋𝙀𝙍𝙀 𝙐𝙉 𝙈𝙊𝙈𝙀𝙉𝙏𝙊 𝙀𝙇 𝘼𝙐𝘿𝙄𝙊 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍\n\n𝙒𝘼𝙄𝙏 𝘼 𝙈𝙊𝙈𝙀𝙉𝙏 𝙁𝙊𝙍 𝙏𝙃𝙀 𝘼𝙐𝘿𝙄𝙊 𝙋𝙇𝙀𝘼𝙎𝙀`, m, {
contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, 
title: '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿 | 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨',
body: 'Super Bot WhatsApp',         
previewType: 0, thumbnail: fs.readFileSync("./media/menus/Menu3.jpg"),
sourceUrl: `https://github.com/GataNina-Li/GataBot-MD`}}}) 
  
let res = await fetch("https://violetics.pw/api/media/youtube-play?apikey=beta&query="+text)
//https://leyscoders-api.herokuapp.com/api/playmp3?q=lebih%20baik%20darinya&apikey=Your_Key
  //("https://api.dhamzxploit.my.id/api/ytplaymp3?text="+text)
let json = await res.json()
conn.sendFile(m.chat, json.result.url, 'error.mp3', null, m, false, { mimetype: 'audio/mp4' })}
if (command == 'play.2') {
conn.reply(m.chat, `${eg}𝙀𝙎𝙋𝙀𝙍𝙀 𝙐𝙉 𝙈𝙊𝙈𝙀𝙉𝙏𝙊 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍\n\n𝙒𝘼𝙄𝙏 𝘼 𝙈𝙊𝙈𝙀𝙉𝙏 𝙁𝙊𝙍 𝙏𝙃𝙀 𝙑𝙄𝘿𝙀𝙊 𝙋𝙇𝙀𝘼𝙎𝙀`, m, {
contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, 
title: '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿 | 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨',
body: 'Super Bot WhatsApp',         
previewType: 0, thumbnail: fs.readFileSync("./media/menus/Menu3.jpg"),
sourceUrl: `https://github.com/GataNina-Li/GataBot-MD`}}})
  
let res = await fetch("https://violetics.pw/api/media/youtube-play?apikey=beta&query="+text) 
let json = await res.json()
conn.sendFile(m.chat, json.result.url, 'error.mp4', `${wm}`, m)}
}catch(e){
m.reply(`${fg}𝙄𝙉𝙏𝙀𝙉𝙏𝙀 𝘿𝙀 𝙉𝙐𝙀𝙑𝙊\n𝙏𝙍𝙔 𝘼𝙂𝘼𝙄𝙉`)
console.log(e)
}}
handler.help = ['play.1' , 'play.2'].map(v => v + ' <texto>')
handler.tags = ['downloader']
handler.command = ['play.1', 'play.2']
export default handler*/
