/* Creado/adaptado por Bruno Sobrino (https://github.com/BrunoSobrino) */

import fetch from 'node-fetch';
import axios from 'axios';
import {load} from 'cheerio';
const handler = async (m, {text, usedPrefix, command, conn}) => {
if (!text) throw`️${lenguajeGB['smsAvisoMG']()}${mid.smsMalused7}\n${usedPrefix + command} El Gato con botas`
  let aaaa;
  let img;
  try {
    aaaa = await searchC(text);
    img = 'https://cinefilosoficial.com/wp-content/uploads/2021/07/cuevana.jpg';
  } catch {
    aaaa = await searchP(text);
    img = 'https://elcomercio.pe/resizer/RJM30xnujgfmaODGytH1rRVOrAA=/400x0/smart/filters:format(jpeg):quality(75)/arc-anglerfish-arc2-prod-elcomercio.s3.amazonaws.com/public/BJ2L67XNRRGHTFPKPDOEQ2AH5Y.jpg';
  }
  if (aaaa == '') throw `️${lenguajeGB['smsAvisoFG']()}${mid.buscador10}`
  const res = await aaaa.map((v) => `*🎬 • ${mid.smsYT1}:* ${v.title}\n*🍿 • ${mid.smsYT4}:* ${v.link}`).join`\n\n───────────────\n\n`;
  const ads = `*💫 • ${mid.buscador11}*\nhttps://block-this.com/block-this-latest.apk\n\n≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣\n\n`
  conn.sendMessage(m.chat, {image: {url: img}, caption: ads + res}, {quoted: m});
};
handler.command = ['cuevana', 'pelisplus'];
handler.level = 2
handler.register = true
export default handler;

const safeLoad = async (url, options = {}) => {
  try {
    const {data: pageData} = await axios.get(url, options);
    const $ = load(pageData);
    return $;
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.statusText);
    }
    throw err;
  }
};

async function searchC(query, numberPage = 1) {
  const $ = await safeLoad(`https://cuevana3.mu/page/${numberPage}/`, {
    params: {s: query}});
  const resultSearch = [];
  $('.results-post > article').each((_, e) => {
    const element = $(e);
    const title = element.find('header > h2').text();
    const link = element.find('.lnk-blk').attr('href');
    resultSearch.push({title: title, link: link});
  });
  return resultSearch;
}

async function searchP(query, numberPage = 1) {
  const $ = await safeLoad(`https://pelisplushd.cx/search/`, {
    params: {s: query, page: numberPage}});
  const resultSearch = [];
  $('a[class^=\'Posters\']').each((_, e) => {
    const element = $(e);
    const title = element.find('.listing-content > p').text();
    const link = element.attr('href');
    resultSearch.push({title: title, link: link});
  });
  return resultSearch;
}