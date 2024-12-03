import fetch from 'node-fetch';
import cheerio from 'cheerio';
import moment from 'moment-timezone';
const handler = async (m, {conn, args, command, usedPrefix}) => {
if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${lenguajeGB['smsContAdult']()}`
const horarioNsfw = db.data.chats[m.chat].horarioNsfw;
const now = moment.tz('America/Guayaquil'); 
const currentTime = now.format('HH:mm'); 

if (horarioNsfw) {
const { inicio, fin } = horarioNsfw;
const inicioTime = moment(inicio, 'HH:mm').tz('America/Guayaquil');
const finTime = moment(fin, 'HH:mm').tz('America/Guayaquil');
const currentMoment = moment(currentTime, 'HH:mm').tz('America/Guayaquil');
let isWithinTimeRange = false;
if (inicioTime.isAfter(finTime)) {
if (currentMoment.isBetween(inicioTime, moment('23:59', 'HH:mm').tz('America/Guayaquil')) || 
currentMoment.isBetween(moment('00:00', 'HH:mm').tz('America/Guayaquil'), finTime)) {
isWithinTimeRange = true;
}} else {
if (currentMoment.isBetween(inicioTime, finTime)) {
isWithinTimeRange = true;
}}
if (!isWithinTimeRange) return m.reply(`${lenguajeGB['smsAvisoAG']()} 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙎𝙊𝙇𝙊 𝙁𝙐𝙉𝘾𝙄𝙊́𝙉𝘼 𝙀𝙇 𝙃𝙊𝙍𝘼𝙍𝙄𝙊 𝙃𝘼𝘽𝙄𝙇𝙄𝙏𝘼𝘿𝙊 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊 𝙀𝙎: ${inicio} a ${fin}`) 
}

if (!args[0]) throw `${mid.smshorny} ${usedPrefix + command} https://www.xnxx.com/video-14lcwbe8/rubia_novia_follada_en_cuarto_de_bano*`
try {
await conn.reply(m.chat, mid.smshorny2, m)
let xnxxLink = '';
    if (args[0].includes('xnxx')) {
      xnxxLink = args[0];
    } else {
      const index = parseInt(args[0]) - 1;
      if (index >= 0) { 
        if (Array.isArray(global.videoListXXX) && global.videoListXXX.length > 0) {
          const matchingItem = global.videoListXXX.find((item) => item.from === m.sender);
          if (matchingItem) {
            if (index < matchingItem.urls.length) {
              xnxxLink = matchingItem.urls[index];
            } else {
              m.reply(`${lenguajeGB['smsAvisoFG']()}${mid.smshorny3}`)
            }
          } else {
            m.reply(`${lenguajeGB['smsAvisoFG']()}${mid.smshorny3}`)
          }
        } else {
          m.reply(`${lenguajeGB['smsAvisoFG']()}${mid.smshorny3}`)
        }
      }
    }
    const res = await xnxxdl(xnxxLink);
    const json = await res.result.files;
    conn.sendMessage(m.chat, {document: {url: json.high}, mimetype: 'video/mp4', fileName: res.result.title}, {quoted: m});
  } catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, fkontak, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
}};
handler.command = /^(xnxxdl)$/i;
handler.level = 6
handler.money = 1200
handler.register = true
export default handler;

async function xnxxdl(URL) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}`, {method: 'get'}).then((res) => res.text()).then((res) => {
      const $ = cheerio.load(res, {xmlMode: false});
      const title = $('meta[property="og:title"]').attr('content');
      const duration = $('meta[property="og:duration"]').attr('content');
      const image = $('meta[property="og:image"]').attr('content');
      const videoType = $('meta[property="og:video:type"]').attr('content');
      const videoWidth = $('meta[property="og:video:width"]').attr('content');
      const videoHeight = $('meta[property="og:video:height"]').attr('content');
      const info = $('span.metadata').text();
      const videoScript = $('#video-player-bg > script:nth-child(6)').html();
      const files = {
        low: (videoScript.match('html5player.setVideoUrlLow\\(\'(.*?)\'\\);') || [])[1],
        high: videoScript.match('html5player.setVideoUrlHigh\\(\'(.*?)\'\\);' || [])[1],
        HLS: videoScript.match('html5player.setVideoHLS\\(\'(.*?)\'\\);' || [])[1],
        thumb: videoScript.match('html5player.setThumbUrl\\(\'(.*?)\'\\);' || [])[1],
        thumb69: videoScript.match('html5player.setThumbUrl169\\(\'(.*?)\'\\);' || [])[1],
        thumbSlide: videoScript.match('html5player.setThumbSlide\\(\'(.*?)\'\\);' || [])[1],
        thumbSlideBig: videoScript.match('html5player.setThumbSlideBig\\(\'(.*?)\'\\);' || [])[1]};
      resolve({status: 200, result: {title, URL, duration, image, videoType, videoWidth, videoHeight, info, files}});
    }).catch((err) => reject({code: 503, status: false, result: err}));
  });
}
