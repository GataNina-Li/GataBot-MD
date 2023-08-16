import fetch from 'node-fetch';
import axios from 'axios';
import cheerio from 'cheerio';
const handler = async (m, {conn, args, command, usedPrefix, text}) => {
if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${lenguajeGB['smsAvisoAG']()}𝙇𝙊𝙎 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎 +18 𝙀𝙎𝙏𝘼𝙉 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝙊𝙎 𝙐𝙎𝙀 #𝙤𝙣 𝙢𝙤𝙙𝙤𝙝𝙤𝙧𝙣𝙮 𝙋𝘼𝙍𝘼 𝘼𝘾𝙏𝙄𝙑𝘼𝙍\n\n+18 𝘾𝙊𝙈𝙈𝘼𝙉𝘿𝙎 𝘼𝙍𝙀 𝘿𝙄𝙎𝘼𝘽𝙇𝙀𝘿 𝙐𝙎𝙀 #𝙤𝙣 𝙢𝙤𝙙𝙤𝙝𝙤𝙧𝙣𝙮 𝙏𝙊 𝙀𝙉𝘼𝘽𝙇𝙀*`
if (!args[0]) throw `${mg}𝙐𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙓𝙑𝙄𝘿𝙀𝙊𝙎\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n* ${usedPrefix + command} https://www.xvideos.com/video70389849/pequena_zorra_follada_duro*`
try {
await conn.reply(m.chat, '➤ 𝙀𝙎𝙋𝙀𝙍𝙀 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍 𝘼 𝙌𝙐𝙀 𝙎𝙀 𝙀𝙉𝙑𝙄𝙀 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊', m)
const res = await xvideosdl(args[0]);
conn.sendMessage(m.chat, {document: {url: res.result.url}, mimetype: 'video/mp4', fileName: res.result.title}, {quoted: m});
} catch (e) {
m.reply('*${fg}𝙉𝙊 𝙁𝙐𝙉𝘾𝙄𝙊𝙉𝙊, 𝙐𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙓𝙑𝙄𝘿𝙀𝙊𝙎, 𝙑𝙐𝙀𝙇𝙑𝘼 𝘼 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙍*')
}};
handler.command = /^(xvideosdl)$/i
handler.level = 6
handler.limit = 4
handler.register = true
export default handler

async function xvideosdl(url) {
return new Promise((resolve, reject) => {
fetch(`${url}`, {method: 'get'})
.then(res => res.text())
.then(res => {
let $ = cheerio.load(res, {xmlMode: false});
const title = $("meta[property='og:title']").attr("content")
const keyword = $("meta[name='keywords']").attr("content")
const views = $("div#video-tabs > div > div > div > div > strong.mobile-hide").text()+" views"
const vote = $("div.rate-infos > span.rating-total-txt").text()
const likes = $("span.rating-good-nbr").text()
const deslikes = $("span.rating-bad-nbr").text()
const thumb = $("meta[property='og:image']").attr("content")
const url = $("#html5video > #html5video_base > div > a").attr("href")
resolve({status: 200, result: {title, url, keyword, views, vote, likes, deslikes, thumb}})
})})};

async function xvideosSearch(url) {
return new Promise(async (resolve) => {
await axios.request(`https://www.xvideos.com/?k=${url}&p=${Math.floor(Math.random() * 9) +1}`, {method: "get"}).then(async result => {
let $ = cheerio.load(result.data, {xmlMod3: false});
let title = [];
let duration = [];
let quality = [];
let url = [];
let thumb = [];
let hasil = [];
$("div.mozaique > div > div.thumb-under > p.title").each(function(a,b){
title.push($(this).find("a").attr("title"));
duration.push($(this).find("span.duration").text());
url.push("https://www.xvideos.com"+$(this).find("a").attr("href"));
});
$("div.mozaique > div > div.thumb-under").each(function(a,b){
quality.push($(this).find("span.video-hd-mark").text());
});
$("div.mozaique > div > div > div.thumb > a").each(function(a,b){
thumb.push($(this).find("img").attr("data-src"));
});
for(let i=0; i < title.length; i++){
hasil.push({
title: title[i],
duration: duration[i],
quality: quality[i],
thumb: thumb[i],
url: url[i]
});
}
resolve(hasil);
})})};
