import axios from "axios"
import fetch from "node-fetch"
import cheerio from "cheerio"
async function wikipedia(querry) {
try {
const link = await axios.get(`https://es.wikipedia.org/wiki/${querry}`)
const $ = cheerio.load(link.data)
let judul = $('#firstHeading').text().trim()
let thumb = $('#mw-content-text').find('div.mw-parser-output > div:nth-child(1) > table > tbody > tr:nth-child(2) > td > a > img').attr('src') || `//i.ibb.co/nzqPBpC/http-error-404-not-found.png`
let isi = []
$('#mw-content-text > div.mw-parser-output').each(function (rayy, Ra) {
let penjelasan = $(Ra).find('p').text().trim() 
isi.push(penjelasan)})
for (let i of isi) {
const data = {
status: link.status,
result: {
judul: judul,
thumb: 'https:' + thumb,
isi: i}}
return data}
} catch (err) {
var notFond = {
status: link.status,
Pesan: eror}
return notFond}}
let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()}𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙇𝘼 𝙋𝘼𝙇𝘼𝘽𝙍𝘼 𝘾𝙇𝘼𝙑𝙀 𝙋𝘼𝙍𝘼 𝘽𝙐𝙎𝘾𝘼𝙍\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} Luna*\n\n𝙏𝙔𝙋𝙀 𝙏𝙃𝙀 𝙆𝙀𝙔𝙒𝙊𝙍𝘿 𝙏𝙊 𝙎𝙀𝘼𝙍𝘾𝙃\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} Universe*`
wikipedia(`${text}`).then(res => {
let info = `𝙀𝙉𝘾𝙊𝙉𝙏𝙍𝙀 𝙀𝙎𝙏𝙊 | 𝙄 𝙁𝙊𝙐𝙉𝘿 𝙏𝙃𝙄𝙎:\n\n` + res.result.isi
conn.sendHydrated(m.chat, info, wm, null, ig, '𝙄𝙣𝙨𝙩𝙖𝙜𝙧𝙖𝙢', null, null, [
['𝙈𝙚𝙣𝙪 𝘽𝙪𝙨𝙦𝙪𝙚𝙙𝙖𝙨 | 𝙎𝙚𝙖𝙧𝙘𝙝𝙚𝙨 🔎', '#buscarmenu'],
['𝙈𝙚𝙣𝙪 𝘾𝙤𝙢𝙥𝙡𝙚𝙩𝙤 | 𝙁𝙪𝙡𝙡 𝙈𝙚𝙣𝙪 ✨', '.allmenu'],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m,)   
  
}).catch(() => { m.reply(`${fg}𝙉𝙊 𝙎𝙀 𝙀𝙉𝘾𝙊𝙉𝙏𝙍𝙊 𝙇𝙊 𝙌𝙐𝙀 𝘽𝙐𝙎𝘾𝘼. 𝙋𝙍𝙊𝘾𝙐𝙍𝙀 𝙐𝙎𝘼𝙍 𝙐𝙉𝘼 𝙋𝘼𝙇𝘼𝘽𝙍𝘼 𝘾𝙇𝘼𝙑𝙀\n\n𝙉𝙊𝙏 𝙁𝙊𝙐𝙉𝘿 𝙒𝙃𝘼𝙏 𝙔𝙊𝙐 𝘼𝙍𝙀 𝙇𝙊𝙊𝙆𝙄𝙉𝙂 𝙁𝙊𝙍. 𝙏𝙍𝙔 𝙏𝙊 𝙐𝙎𝙀 𝘼 𝙆𝙀𝙔 𝙒𝙊𝙍𝘿`) })}
handler.help = ['wikipedia'].map(v => v + ' <apa>')
handler.tags = [ 'internet']
handler.command = /^(wiki|wikipedia)$/i 
handler.exp = 40
handler.level = 2
export default handler
