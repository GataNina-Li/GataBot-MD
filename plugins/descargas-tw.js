import fetch from 'node-fetch';
import axios from 'axios';
import cheerio from 'cheerio';
import vm from 'node:vm';
import qs from 'qs';
const handler = async (m, {conn, text, args, usedPrefix, command}) => {
const fkontak = {
        "key": {
        "participants":"0@s.whatsapp.net", 
            "remoteJid": "status@broadcast",
            "fromMe": false,
            "id": "Halo"    
        },
        "message": {
            "contactMessage": {
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        "participant": "0@s.whatsapp.net"
    }

if (!args[0]) throw `${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙏𝙒𝙄𝙏𝙏𝙀𝙍 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙎𝙐 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} https://twitter.com/Animalesybichos/status/1564616107159330816?t=gKqUsstvflSp7Dhpe_nmDg&s=19*\n\n𝙀𝙉𝙏𝙀𝙍 𝘼 𝙏𝙒𝙄𝙏𝙏𝙀𝙍  𝙇𝙄𝙉𝙆 𝙏𝙊 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 𝙔𝙊𝙐𝙍 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} https://twitter.com/Animalesybichos/status/1564616107159330816?t=gKqUsstvflSp7Dhpe_nmDg&s=19*`
 try {
   const resFG = await twitter(text);
   const { key } = await conn.sendMessage(m.chat, {text: wait}, {quoted: fkontak});
await delay(1000 * 1);
await conn.sendMessage(m.chat, {text: waitt, edit: key});
await delay(1000 * 1);
await conn.sendMessage(m.chat, {text: waittt, edit: key});
await delay(1000 * 1);
await conn.sendMessage(m.chat, {text: waitttt, edit: key});
     const captionFG = `✨ 𝘾𝘼𝙇𝙄𝘿𝘼𝘿 *:* 𝙌𝙐𝘼𝙇𝙄𝙏𝙔 *» ${quality}*\n${wm}`
     await conn.sendFile(m.chat, resFG[0].url, 'error.mp4', captionFG, m);
 } catch {    
 console.log('error')    
 try {
   const res = await twitterDl(text);
   for (let x = 0; x < res.media.length; x++) {
     const caption = x === 0 ? res.caption.replace(/https:\/\/t.co\/[a-zA-Z0-9]+/gi, '').trim() : `✨ 𝘾𝘼𝙇𝙄𝘿𝘼𝘿 *:* 𝙌𝙐𝘼𝙇𝙄𝙏𝙔 *» ${quality}*\n${wm}`
     await conn.sendFile(m.chat, res.media[x].url, 'error.mp4', caption, m);
   }
 } catch {
   try {
     const AA = await savefrom(text);
     await conn.sendFile(m.chat, AA.url[0].url, 'error.mp4', `*✨ 𝘾𝘼𝙇𝙄𝘿𝘼𝘿 *:* 𝙌𝙐𝘼𝙇𝙄𝙏𝙔 *» ${quality}*\n${wm}`, m);
   } catch {
     conn.sendMessage(m.chat, {text: `${lenguajeGB['smsAvisoFG']()} 𝙀𝙍𝙍𝙊𝙍 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍 𝙑𝙐𝙀𝙇𝙑𝘼 𝘼 𝙄𝙉𝙏𝙀𝙉𝙏𝘼`, edit: key});
 handler.limit = false
   }
  }
 }
};    
handler.help = ['twitter'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^((tw|twitter)(dl)?)$/i
handler.limit = 3
handler.level = 3
handler.register = true
handler.exp = 70
export default handler;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function twitterDl(url) {
  const id = /twitter\.com\/[^/]+\/status\/(\d+)/.exec(url)?.[1];
  const res = await fetch(`https://tweetpik.com/api/tweets/${id}`);
  if (res.status !== 200) throw res.statusText;
  const json = await res.json();
  if (json.media) {
    const media = [];
    for (const i of json.media) {
      if (/video|animated_gif/.test(i.type)) {
        let vid = await (await fetch(`https://tweetpik.com/api/tweets/${id}/video`)).json();
        vid = vid.variants.pop();
        media.push({url: vid.url, type: i.type});
      } else {
        media.push({url: i.url, type: i.type});
      }
    }
    return {
      caption: json.text, media,
    };
  }
}
async function savefrom(urlL) {
  const body = new URLSearchParams({'sf_url': encodeURI(urlL), 'sf_submit': '', 'new': 2, 'lang': 'id', 'app': '', 'country': 'id', 'os': 'Windows', 'browser': 'Chrome', 'channel': ' main', 'sf-nomad': 1});
  let {data} = await axios({'url': 'https://worker.sf-tools.com/savefrom.php', 'method': 'POST', 'data': body, 'headers': {'content-type': 'application/x-www-form-urlencoded', 'origin': 'https://id.savefrom.net', 'referer': 'https://id.savefrom.net/', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36'}});
  const exec = '[]["filter"]["constructor"](b).call(a);';
  data = data.replace(exec, `\ntry {\ni++;\nif (i === 2) scriptResult = ${exec.split('.call')[0]}.toString();\nelse (\n${exec.replace(/;/, '')}\n);\n} catch {}`);
  const context = {'scriptResult': '', 'i': 0};
  vm.createContext(context);
  new vm.Script(data).runInContext(context);
  return JSON.parse(context.scriptResult.split('window.parent.sf.videoResult.show(')?.[1].split(');')?.[0]);
}
async function twitter(url) {
	let payload = { url, submit: '' }
	let res = await fetch('https://www.expertsphp.com/instagram-reels-downloader.php', {
		method: 'POST',
		body: new URLSearchParams(Object.entries(payload)),
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			cookie: '_ga=GA1.2.783835709.1637038175; __gads=ID=5b4991618655cd86-22e2c7aeadce00ae:T=1637038176:RT=1637038176:S=ALNI_MaCe3McPrVVswzBEqcQlgnVZXtZ1g; _gid=GA1.2.1817576486.1639614645; _gat_gtag_UA_120752274_1=1',
			origin: 'https://www.expertsphp.com',
			referer: 'https://www.expertsphp.com/twitter-video-downloader.html',
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
		}})
	let $ = cheerio.load(await res.text())
	let results = []
	$('table.table > tbody > tr').each(function () {
		let quality = $(this).find('td').eq(2).find('strong').text()
		let type = $(this).find('td').eq(1).find('strong').text()
		let url = $(this).find('td').eq(0).find('a[href]').attr('href')
		let isVideo = /video/i.test(type)
		results.push({ quality, type, url, isVideo })
	})
	return results
}

/*import { twitterdl } from '@bochilteam/scraper'
let handler = async (m, { conn, args, usedPrefix, command }) => {
const fkontak = {
        "key": {
        "participants":"0@s.whatsapp.net", 
            "remoteJid": "status@broadcast",
            "fromMe": false,
            "id": "Halo"    
        },
        "message": {
            "contactMessage": {
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        "participant": "0@s.whatsapp.net"
    }

if (!args[0]) throw `${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙏𝙒𝙄𝙏𝙏𝙀𝙍 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙎𝙐 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} https://twitter.com/Animalesybichos/status/1564616107159330816?t=gKqUsstvflSp7Dhpe_nmDg&s=19*\n\n𝙀𝙉𝙏𝙀𝙍 𝘼 𝙏𝙒𝙄𝙏𝙏𝙀𝙍  𝙇𝙄𝙉𝙆 𝙏𝙊 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 𝙔𝙊𝙐𝙍 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} https://twitter.com/Animalesybichos/status/1564616107159330816?t=gKqUsstvflSp7Dhpe_nmDg&s=19*`
let res = await twitterdlv2(args[0])
const { url, quality, type } = res[1]

await conn.reply(m.chat, wait, fkontak,  m)
await conn.reply(m.chat, waitt, fkontak,  m)
await conn.reply(m.chat, waittt, fkontak,  m)
await conn.reply(m.chat, waitttt, fkontak,  m)
await conn.sendFile(m.chat, url, 'twitter' + (type == 'image' ? '.jpg' : '.mp4'), `✨ 𝘾𝘼𝙇𝙄𝘿𝘼𝘿 *:* 𝙌𝙐𝘼𝙇𝙄𝙏𝙔 *» ${quality}*\n${wm}`, m)
}
handler.help = ['twitter'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^((tw|twitter)(dl)?)$/i
handler.limit = 2
handler.level = 3
handler.register = true
handler.exp = 70

export default handler*/
