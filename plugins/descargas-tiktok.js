import fg from 'api-dylux' 
import axios from 'axios'
import cheerio from 'cheerio'
import { tiktok } from "@xct007/frieren-scraper";
let generateWAMessageFromContent = (await import(global.baileys)).default
import { tiktokdl } from '@bochilteam/scraper'
let handler = async (m, { conn, text, args, usedPrefix, command}) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
if (!text) return conn.reply(m.chat, `${lenguajeGB['smsAvisoMG']()}𝘿𝙀𝘽𝙀 𝙄𝙉𝙂𝙍𝙀𝙎𝘼𝙍 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙏𝙄𝙆𝙏𝙊𝙆 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} https://vm.tiktok.com/ZMLEPnruc/?k=1*\n\n𝙔𝙊𝙐 𝙈𝙐𝙎𝙏 𝙀𝙉𝙏𝙀𝙍 𝘼 𝙏𝙄𝙆𝙏𝙊𝙆 𝙇𝙄𝙉𝙆 𝙏𝙊 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 𝙏𝙃𝙀 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} https://vm.tiktok.com/ZMLEPnruc/?k=1*`, fkontak,  m)
if (!/(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok.com\/([^\s&]+)/gi.test(text)) return conn.reply(m.chat, `${lenguajeGB['smsAvisoFG']()}𝙀𝙇 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙏𝙄𝙆𝙏𝙊𝙆 𝙀𝙎 𝙄𝙉𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝙊, 𝙋𝙍𝙊𝘾𝙐𝙍𝙀 𝙌𝙐𝙀 𝙀𝙎𝙏𝙀 𝙑𝘼𝙇𝙄𝘿𝙊\n\n𝙏𝙃𝙀 𝙏𝙄𝙆𝙏𝙊𝙆 𝙇𝙄𝙉𝙆 𝙄𝙎 𝙄𝙉𝘾𝙊𝙍𝙍𝙀𝘾𝙏, 𝙈𝘼𝙆𝙀 𝙎𝙐𝙍𝙀 𝙄𝙏 𝙄𝙎 𝙑𝘼𝙇𝙄𝘿`, fkontak,  m)  
await conn.reply(m.chat, `${lenguajeGB['smsAvisoEG']()}𝙋𝙍𝙊𝙉𝙏𝙊 𝙏𝙀𝙉𝘿𝙍𝘼 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊 𝘿𝙀 𝙏𝙄𝙆𝙏𝙊𝙆 😸\n𝙎𝙊𝙊𝙉 𝙒𝙄𝙇𝙇 𝙃𝘼𝙑𝙀 𝙏𝙃𝙀 𝙏𝙄𝙆𝙏𝙊𝙆 𝙑𝙄𝘿𝙀𝙊 🥳`, fkontak,  m) 
try {
const dataF = await tiktok.v1(args[0])
conn.sendFile(m.chat, dataF.play, 'tiktok.mp4', `⛱️ 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 : 𝙐𝙎𝙀𝙍𝙉𝘼𝙈𝙀\n*${nickname}*\n${description ? '\n⛱️ 𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝘾𝙄𝙊𝙉 : 𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝙏𝙄𝙊𝙉\n*${description}*' : ''}\n${wm}`.trim(), m) 
} catch (e1) {
try {
const tTiktok = await tiktokdlF(args[0])
conn.sendFile(m.chat, tTiktok.video, 'tiktok.mp4', `⛱️ 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 : 𝙐𝙎𝙀𝙍𝙉𝘼𝙈𝙀\n*${nickname}*\n${description ? '\n⛱️ 𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝘾𝙄𝙊𝙉 : 𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝙏𝙄𝙊𝙉\n*${description}*' : ''}\n${wm}`.trim(), m) 
} catch (e2) {
try {
let p = await fg.tiktok(args[0]) 
conn.sendFile(m.chat, p.nowm, 'tiktok.mp4', `⛱️ 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 : 𝙐𝙎𝙀𝙍𝙉𝘼𝙈𝙀\n*${nickname}*\n${description ? '\n⛱️ 𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝘾𝙄𝙊𝙉 : 𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝙏𝙄𝙊𝙉\n*${description}*' : ''}\n${wm}`.trim(), m)
} catch (e3) {
try { 
const { author: { nickname }, video, description } = await tiktokdl(args[0])
const url = video.no_watermark2 || video.no_watermark || 'https://tikcdn.net' + video.no_watermark_raw || video.no_watermark_hd
conn.sendFile(m.chat, url, 'tiktok.mp4', `⛱️ 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 : 𝙐𝙎𝙀𝙍𝙉𝘼𝙈𝙀\n*${nickname}*\n${description ? '\n⛱️ 𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝘾𝙄𝙊𝙉 : 𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝙏𝙄𝙊𝙉\n*${description}*' : ''}\n${wm}`.trim(), m)
} catch {
await conn.reply(m.chat, `${lenguajeGB['smsAvisoFG']()}𝙀𝙍𝙍𝙊𝙍 𝘼𝙇 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙍 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝙏𝙄𝙆 𝙏𝙊𝙆, 𝙑𝙐𝙀𝙇𝙑𝘼 𝘼 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙍 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍\n\n𝙀𝙍𝙍𝙊𝙍 𝙏𝙍𝙔𝙄𝙉𝙂 𝙏𝙊 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 𝙏𝙄𝙆𝙏𝙊𝙆, 𝙏𝙍𝙔 𝘼𝙂𝘼𝙄𝙉 𝙋𝙇𝙀𝘼𝙎𝙀`, fkontak,  m) 
handler.limit = 0
}}}}}
handler.help = ['tiktok']
handler.tags = ['dl']
handler.command = /^(tt|tiktok)(dl|nowm)?$/i
handler.limit = 2
export default handler

async function tiktokdlF(url) {
if (!/tiktok/.test(url)) return 'Enlace incorrecto';
const gettoken = await axios.get("https://tikdown.org/id");
const $ = cheerio.load(gettoken.data);
const token = $("#download-form > input[type=hidden]:nth-child(2)").attr( "value" );
const param = { url: url, _token: token };
const { data } = await axios.request("https://tikdown.org/getAjax?", { method: "post", data: new URLSearchParams(Object.entries(param)), headers: { "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "user-agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36" }, });
var getdata = cheerio.load(data.html);
if (data.status) {
return { status: true, thumbnail: getdata("img").attr("src"), video: getdata("div.download-links > div:nth-child(1) > a").attr("href"), audio: getdata("div.download-links > div:nth-child(2) > a").attr("href"), }} else
return { status: false }}
