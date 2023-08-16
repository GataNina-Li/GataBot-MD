import fetch from 'node-fetch';
const handler = async (m, {text, usedPrefix, command}) => {
if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${lenguajeGB['smsAvisoAG']()}𝙇𝙊𝙎 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎 +18 𝙀𝙎𝙏𝘼𝙉 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝙊𝙎 𝙐𝙎𝙀 #𝙤𝙣 𝙢𝙤𝙙𝙤𝙝𝙤𝙧𝙣𝙮 𝙋𝘼𝙍𝘼 𝘼𝘾𝙏𝙄𝙑𝘼𝙍\n\n+18 𝘾𝙊𝙈𝙈𝘼𝙉𝘿𝙎 𝘼𝙍𝙀 𝘿𝙄𝙎𝘼𝘽𝙇𝙀𝘿 𝙐𝙎𝙀 #𝙤𝙣 𝙢𝙤𝙙𝙤𝙝𝙤𝙧𝙣𝙮 𝙏𝙊 𝙀𝙉𝘼𝘽𝙇𝙀*`
if (!text) throw `${lenguajeGB['smsAvisoMG']()}𝙐𝙎𝙀 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝘿𝙀 𝙀𝙎𝙏𝘼 𝙈𝘼𝙉𝙀𝙍𝘼\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} Sexo*\n\n𝙐𝙎𝙀 𝙏𝙃𝙀 𝘾𝙊𝙈𝙈𝘼𝙉𝘿 𝙇𝙄𝙆𝙀 𝙏𝙃𝙄𝙎\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} Sex*`
try {
const vids_ = {from: m.sender, urls: [],};
if (!global.videoListXXX) {
global.videoListXXX = [];
}
if (global.videoListXXX[0]?.from == m.sender) {
global.videoListXXX.splice(0, global.videoListXXX.length);
}
const res = await xnxxsearch(text);
const json = res.result;
let cap = `🔍 𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊𝙎 𝘿𝙀 𝙇𝘼 𝘽𝙐𝙎𝙌𝙐𝙀𝘿𝘼 : ${text.toUpperCase()}\n\n••••••••••••••••••••••••••••••••••••`;
let count = 1;
for (const v of json) {
const linkXXX = v.link;
vids_.urls.push(linkXXX);
cap += `\n❉ 𝙊𝙋𝘾𝙄𝙊𝙉 : *(${count})*\n❉ 𝙏𝙄𝙏𝙐𝙇𝙊 | 𝙏𝙄𝙏𝙇𝙀: ${v.title}\n❉ 𝙇𝙄𝙉𝙆: ${v.link}\n❉ 𝙄𝙉𝙁𝙊: ${v.info}`
cap += '\n\n' + '••••••••••••••••••••••••••••••••••••' + '\n\n'
count++;
}
m.reply(cap);
global.videoListXXX.push(vids_);
} catch {
throw e;
}}
handler.command = /^porhubsearch|xvideossearch|xnxxsearch$/i
handler.level = 9
handler.limit = 6
handler.register = true
export default handler

async function xnxxsearch(query) {
  return new Promise((resolve, reject) => {
    const baseurl = 'https://www.xnxx.com';
    fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, {method: 'get'}).then((res) => res.text()).then((res) => {
      const $ = cheerio.load(res, {xmlMode: false});
      const title = [];
      const url = [];
      const desc = [];
      const results = [];
      $('div.mozaique').each(function(a, b) {
        $(b).find('div.thumb').each(function(c, d) {
          url.push(baseurl + $(d).find('a').attr('href').replace('/THUMBNUM/', '/'));
        });
      });
      $('div.mozaique').each(function(a, b) {
        $(b).find('div.thumb-under').each(function(c, d) {
          desc.push($(d).find('p.metadata').text());
          $(d).find('a').each(function(e, f) {
            title.push($(f).attr('title'));
          });
        });
      });
      for (let i = 0; i < title.length; i++) {
        results.push({title: title[i], info: desc[i], link: url[i]});
      }
      resolve({code: 200, status: true, result: results});
    }).catch((err) => reject({code: 503, status: false, result: err}));
  });
}




/*import axios from 'axios'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
let handler = async (m, { text, conn, args, command, usedPrefix }) => {
if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${lenguajeGB['smsAvisoAG']()}𝙇𝙊𝙎 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎 +18 𝙀𝙎𝙏𝘼𝙉 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝙊𝙎 𝙐𝙎𝙀 #𝙤𝙣 𝙢𝙤𝙙𝙤𝙝𝙤𝙧𝙣𝙮 𝙋𝘼𝙍𝘼 𝘼𝘾𝙏𝙄𝙑𝘼𝙍\n\n+18 𝘾𝙊𝙈𝙈𝘼𝙉𝘿𝙎 𝘼𝙍𝙀 𝘿𝙄𝙎𝘼𝘽𝙇𝙀𝘿 𝙐𝙎𝙀 #𝙤𝙣 𝙢𝙤𝙙𝙤𝙝𝙤𝙧𝙣𝙮 𝙏𝙊 𝙀𝙉𝘼𝘽𝙇𝙀*`
if (!text) throw `*𝙌𝙪𝙚 𝙗𝙪𝙨𝙘𝙖? 𝙐𝙨𝙚𝙧 𝙪𝙣 𝙚𝙣𝙡𝙖𝙘𝙚 𝙙𝙚 𝙭𝙣𝙭𝙭\n𝙀𝙟𝙚𝙢𝙥𝙡𝙤\n*${usedPrefix + command} Con mi prima*`
try {
await delay(5000)
let res = await xnxxsearch(text)
let json = res.result
let listSerch = []
let teskd = `𝑪𝒐𝒏𝒕𝒆𝒏𝒊𝒅𝒐 𝒓𝒆𝒍𝒂𝒄𝒊𝒐𝒏𝒂𝒅𝒐: ${args.join(" ")}`
const sections = [{
title: `ⓡⓔⓢⓤⓛⓣⓐⓓⓞⓢ`,
rows: listSerch }]
const listMessage = {
text: teskd,
footer: '𝐄𝐥𝐢𝐣𝐚 𝐮𝐧𝐚 𝐨𝐩𝐜𝐢𝐨𝐧 𝐲 𝐩𝐫𝐞𝐜𝐢𝐨𝐧𝐞 𝐄𝐧𝐯𝐢𝐚𝐫',
title: "➤ 𝑪𝒐𝒏𝒕𝒆𝒏𝒊𝒅𝒐 𝒆𝒏𝒄𝒐𝒏𝒕𝒓𝒂𝒅𝒐",
buttonText: "➤ 𝑹𝒆𝒔𝒖𝒍𝒕𝒂𝒅𝒐𝒔",
sections}
for (let i of json) {
listSerch.push({title: i.title, description: '⇧ sᴇʟᴇᴄᴄɪᴏɴᴀ ᴇsᴛᴀ ᴏᴘᴄɪᴏɴ ᴘᴀʀᴀ ᴅᴇsᴄᴀʀɢᴀʀ ᴇsᴛᴇ ᴠɪᴅᴇᴏ ⇧', rowId: `${usedPrefix}xnxxdl ${i.link}`})} 
conn.sendMessage(m.sender, listMessage, { quoted: m })
if (m.isGroup) return m.reply('*✳️ 𝙃𝙊𝙇𝘼 𝙀𝙎𝙏𝙄𝙈𝘼𝘿𝙊 𝙐𝙎𝙐𝘼𝙍𝙄𝙊(𝘼), 𝙎𝙐 𝙋𝙀𝙍𝘿𝙄𝘿𝙊 𝙃𝘼 𝙎𝙄𝘿𝙊 𝙀𝙉𝙑𝙄𝘼𝘿𝙊 𝘼 𝙎𝙐 𝘾𝙃𝘼𝙏 𝙋𝙍𝙄𝙑𝘼𝘿𝙊, 𝙀𝙎𝙏𝙊 𝘾𝙊𝙈𝙊 𝙎𝙊𝙇𝙐𝘾𝙄𝙊𝙉 𝙏𝙀𝙈𝙋𝙊𝙍𝘼𝙇 𝘼 𝙀𝙍𝙍𝙊𝙍𝙀𝙎 𝘿𝙀 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝘾𝙊𝙉 𝘽𝙊𝙏𝙊𝙉𝙀𝙎 𝙏𝙄𝙋𝙊 𝙇𝙄𝙎𝙏𝘼𝙎 𝙌𝙐𝙀 𝙉𝙊 𝙎𝙊𝙉 𝙑𝙄𝙎𝙄𝘽𝙇𝙀𝙎 𝙀𝙉 𝙇𝘼𝙎 𝙑𝙀𝙍𝙎𝙄𝙊𝙉𝙀𝙎 𝙈𝘼𝙎 𝙍𝙀𝘾𝙄𝙀𝙉𝙏𝙀𝙎 𝘿𝙀 𝙒𝙃𝘼𝙏𝙎𝘼𝙋𝙋*')      
} catch (e) {
m.reply(`${lenguajeGB['smsAvisoFG']()}𝙑𝙐𝙀𝙇𝙑𝘼 𝘼 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙍\n\n𝙏𝙍𝙔 𝘼𝙂𝘼𝙄𝙉`)
}}
handler.command = /^porhubsearch|xvideossearch|xnxxsearch$/i
handler.level = 9
handler.limit = 6
handler.register = true
export default handler

const delay = time => new Promise(res => setTimeout(res, time))

async function xnxxsearch(query) {
return new Promise((resolve, reject) => {
const baseurl = 'https://www.xnxx.com'
fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, {method: 'get'}).then(res => res.text()).then(res => {
let $ = cheerio.load(res, { xmlMode: false });
let title = [];
let url = [];
let desc = [];
let results = [];
$('div.mozaique').each(function(a, b) {
$(b).find('div.thumb').each(function(c, d) {
url.push(baseurl+$(d).find('a').attr('href').replace("/THUMBNUM/", "/"))
})})
$('div.mozaique').each(function(a, b) {
$(b).find('div.thumb-under').each(function(c, d) {
desc.push($(d).find('p.metadata').text())
$(d).find('a').each(function(e,f) {
title.push($(f).attr('title'))
})})})
for (let i = 0; i < title.length; i++) {
results.push({ title: title[i], info: desc[i], link: url[i] })}
resolve({ code: 200, status: true, result: results
})}).catch(err => reject({code: 503, status: false, result: err }))})}*/
