/*import fetch from 'node-fetch'
import { youtubeSearch } from '@bochilteam/scraper'
let handler = async (m, { conn, command, text, usedPrefix }) => {
try {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let grupos = [nn, nnn, nnnt]
let gata = [img5, img6, img7, img8, img9]
let enlace = { contextInfo: { externalAdReply: {title: wm + ' 🐈', body: 'support group' , sourceUrl: grupos.getRandom(), thumbnail: await(await fetch(gata.getRandom())).buffer() }}}
let enlace2 = { contextInfo: { externalAdReply: { showAdAttribution: true, mediaUrl: yt, mediaType: 'VIDEO', description: '', title: wm, body: '😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 ', thumbnailUrl: await(await fetch(img)).buffer(), sourceUrl: yt }}}
let dos = [enlace, enlace2]

if (!text) throw `${lenguajeGB['smsAvisoMG']()}𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝙊 𝙏𝙄𝙏𝙐𝙇𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} Billie Eilish - Bellyache*\n\n𝙒𝙍𝙄𝙏𝙀 𝙏𝙃𝙀 𝙉𝘼𝙈𝙀 𝙊𝙍 𝙏𝙄𝙏𝙇𝙀\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} Billie Eilish - Bellyache*`
let vid = (await youtubeSearch(text)).video[0]
if (!vid) throw `${lenguajeGB['smsAvisoFG']()}𝙉𝙊 𝙎𝙀 𝙋𝙐𝘿𝙊 𝙀𝙉𝘾𝙊𝙉𝙏𝙍𝘼𝙍 𝙀𝙇 𝘼𝙐𝘿𝙄𝙊/𝙑𝙄𝘿𝙀𝙊. 𝙄𝙉𝙏𝙀𝙉𝙏𝙀 𝘾𝙊𝙉 𝙊𝙏𝙍𝙊 𝙉𝙊𝙈𝘽𝙍𝙀 𝙊 𝙏𝙄𝙏𝙐𝙇𝙊\n\n𝙏𝙃𝙀 𝘼𝙐𝘿𝙄𝙊/𝙑𝙄𝘿𝙀𝙊 𝘾𝙊𝙐𝙇𝘿 𝙉𝙊𝙏 𝘽𝙀 𝙁𝙊𝙐𝙉𝘿. 𝙏𝙍𝙔 𝘼𝙉𝙊𝙏𝙃𝙀𝙍 𝙉𝘼𝙈𝙀 𝙊𝙍 𝙏𝙄𝙏𝙇𝙀`
let { title, description, thumbnail, videoId, durationH, viewH, publishedTime } = vid
const url = 'https://www.youtube.com/watch?v=' + videoId
 
await conn.sendButton(m.chat, wm, `*𓆩 𓃠 𓆪 ✧═══ ${vs} ═══✧ 𓆩 𓃠 𓆪*

ও *TÍTULO | TITLE*
» ${title}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
ও *DESCRIPCIÓN | DESCRIPTION*
» ${description}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
ও *PUBLICADO | PUBLISHED*
» ${publishedTime}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
ও *DURACION | DURATION*
» ${durationH}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
ও *VISTAS| VIEWS*
» ${viewH}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
ও *URL*
» ${url}

*𓆩 𓃠 𓆪 ✧═══ ${vs} ═══✧ 𓆩 𓃠 𓆪*`, thumbnail, [['𝗠 𝗘 𝗡 𝗨 ☘️', '/menu']], m, dos.getRandom())
  
const sections = [{
title: comienzo + ' 📡 𝗧𝗜𝗣𝗢𝗦 𝗗𝗘 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦 ' + fin,
rows: [
{title: "𓃠 𝗔 𝗨 𝗗 𝗜 𝗢 (Opcion 1)", rowId: `${usedPrefix}yta ${url}`, description: `${title}\n`},
{title: "𓃠 𝗔 𝗨 𝗗 𝗜 𝗢 (Opcion 2)", rowId: `${usedPrefix}play.1 ${url}`, description: `${title}\n`},
{title: "𓃠 𝗔 𝗨 𝗗 𝗜 𝗢   𝗗 𝗢 𝗖", rowId: `${usedPrefix}pdocaudio ${url}`, description: `${title}\n`},
{title: "𓃠 𝗩 𝗜 𝗗 𝗘 𝗢 (Opcion 1)", rowId: `${usedPrefix}ytv ${url}`, description: `${title}\n`},
{title: "𓃠 𝗩 𝗜 𝗗 𝗘 𝗢 (Opcion 2)", rowId: `${usedPrefix}play.2 ${url}`, description: `${title}\n`},
{title: "𓃠 𝗩 𝗜 𝗗 𝗘 𝗢   𝗗 𝗢 𝗖", rowId: `${usedPrefix}pdocvieo ${url}`, description: `${title}\n`}
]},{
title: comienzo + ' 🔎 𝗕𝗨𝗦𝗤𝗨𝗘𝗗𝗔 𝗔𝗩𝗔𝗡𝗭𝗔𝗗𝗔 ' + fin,
rows: [
{title: "𓃠 𝗠 𝗔 𝗦   𝗥 𝗘 𝗦 𝗨 𝗟 𝗧 𝗔 𝗗 𝗢 𝗦", rowId: `${usedPrefix}ytsearch ${text}`}
]}]

const listMessage = {
  text: `*𝙀𝙇𝙄𝙅𝘼 𝙌𝙐𝙀 𝙑𝘼 𝙃𝘼𝘾𝙀𝙍 𝘾𝙊𝙉  ${text}*`,
  footer: global.wm,
  title: `${htki} *♻️ 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙎* ${htka}`,
  buttonText: `🍄 𝙀𝙇𝙀𝙍𝙂𝙄𝙍 🍁`,
  sections
}

await conn.sendMessage(m.chat, listMessage, {quoted: fkontak})
} catch {
try {
let vid2 = await (await fetch(`https://api.lolhuman.xyz/api/ytsearch?apikey=${lolkeysapi}&query=${text}`)).json()
let { videoId, title, views, published, thumbnail } = await vid2.result[0]
const url = 'https://www.youtube.com/watch?v=' + videoId
let ytLink = await fetch(`https://api.lolhuman.xyz/api/ytplay2?apikey=${lolkeysapi}&query=${text}`)
let jsonn = await ytLink.json()
let aud = await jsonn.result.audio
let capt = `ও *TÍTULO | TITLE:* ${title}\nও *PUBLICADO | PUBLISHED:* ${published}\nও *VISTAS| VIEWS:* ${views}\nও *URL:* ${url}`
const buttons = [{buttonId: `#playlist ${title}`, buttonText: {displayText: '𓃠 𝗠 𝗔 𝗦   𝗥 𝗘 𝗦 𝗨 𝗟 𝗧 𝗔 𝗗 𝗢 𝗦'}, type: 1}]
const buttonMessage = { image: {url: thumbnail}, caption: capt, footer: '*ᴇɴᴠɪᴀɴᴅᴏ ᴀᴜᴅɪᴏ, ᴀɢᴜᴀʀᴅᴇ ᴜɴ ᴍᴏᴍᴇɴᴛᴏ...*', buttons: buttons, headerType: 4 }
let msg = await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
conn.sendMessage(m.chat, { audio: { url: aud }, mimetype: 'audio/mp4', fileName: `${title}.mp3`}, {quoted: msg})
} catch {  
throw '╰⊱❌⊱ *𝙁𝘼𝙇𝙇𝙊́ | 𝙀𝙍𝙍𝙊𝙍* ⊱❌⊱╮\n\n ERROR, SERVIDOR CAIDO, INTENTA DEL NUEVO POR FAVOR'}}}
handler.help = ['play', 'play2'].map(v => v + ' <pencarian>')
handler.tags = ['downloader']
handler.command = /^play2?$/i
handler.limit = 1
handler.level = 2
export default handler*/


/*==========CÓDIGO PRIVADO, SI LO QUIERES EDITAR USA EL DE ARRIBA========*/

const _0x85760=_0x3fdf;(function(_0x3a2884,_0x1055fc){const _0x20122c=_0x3fdf,_0x192354=_0x3a2884();while(!![]){try{const _0x3b1a13=-parseInt(_0x20122c(0x169))/0x1*(parseInt(_0x20122c(0x15f))/0x2)+parseInt(_0x20122c(0x170))/0x3*(-parseInt(_0x20122c(0x17b))/0x4)+parseInt(_0x20122c(0x193))/0x5*(parseInt(_0x20122c(0x18f))/0x6)+-parseInt(_0x20122c(0x160))/0x7+parseInt(_0x20122c(0x199))/0x8*(parseInt(_0x20122c(0x1a3))/0x9)+parseInt(_0x20122c(0x1ab))/0xa+-parseInt(_0x20122c(0x1aa))/0xb;if(_0x3b1a13===_0x1055fc)break;else _0x192354['push'](_0x192354['shift']());}catch(_0x2b1d9f){_0x192354['push'](_0x192354['shift']());}}}(_0xf8ec,0x78330));const _0x2bf29b=(function(){let _0xeebb77=!![];return function(_0x25f779,_0x3d10f6){const _0x2a25fa=_0xeebb77?function(){const _0x507ad5=_0x3fdf;if(_0x3d10f6){const _0x5dc6a4=_0x3d10f6[_0x507ad5(0x189)](_0x25f779,arguments);return _0x3d10f6=null,_0x5dc6a4;}}:function(){};return _0xeebb77=![],_0x2a25fa;};}()),_0x20e46f=_0x2bf29b(this,function(){const _0x187bcd=_0x3fdf;return _0x20e46f['toString']()[_0x187bcd(0x19a)](_0x187bcd(0x1a8))[_0x187bcd(0x1a5)]()['constructor'](_0x20e46f)['search'](_0x187bcd(0x1a8));});_0x20e46f();const _0x4a1ce6=(function(){let _0x78f653=!![];return function(_0x383d8b,_0x3599fd){const _0x240afb=_0x78f653?function(){if(_0x3599fd){const _0x144847=_0x3599fd['apply'](_0x383d8b,arguments);return _0x3599fd=null,_0x144847;}}:function(){};return _0x78f653=![],_0x240afb;};}()),_0x4a126c=_0x4a1ce6(this,function(){const _0x4c95ef=_0x3fdf;let _0x36e6fa;try{const _0xbabd8f=Function('return\x20(function()\x20'+_0x4c95ef(0x190)+');');_0x36e6fa=_0xbabd8f();}catch(_0x552a26){_0x36e6fa=window;}const _0x22fb08=_0x36e6fa[_0x4c95ef(0x15d)]=_0x36e6fa[_0x4c95ef(0x15d)]||{},_0x3b0711=['log',_0x4c95ef(0x181),_0x4c95ef(0x161),'error',_0x4c95ef(0x1a0),_0x4c95ef(0x1a2),_0x4c95ef(0x186)];for(let _0x3c6ba6=0x0;_0x3c6ba6<_0x3b0711[_0x4c95ef(0x18a)];_0x3c6ba6++){const _0x370b64=_0x4a1ce6[_0x4c95ef(0x184)][_0x4c95ef(0x16d)]['bind'](_0x4a1ce6),_0x1127a7=_0x3b0711[_0x3c6ba6],_0x1910b5=_0x22fb08[_0x1127a7]||_0x370b64;_0x370b64[_0x4c95ef(0x194)]=_0x4a1ce6[_0x4c95ef(0x18b)](_0x4a1ce6),_0x370b64['toString']=_0x1910b5[_0x4c95ef(0x1a5)][_0x4c95ef(0x18b)](_0x1910b5),_0x22fb08[_0x1127a7]=_0x370b64;}});_0x4a126c();import{youtubeSearch,youtubedl,youtubedlv2,youtubedlv3}from'@bochilteam/scraper';let handler=async(_0x31f537,{conn:_0x309b3a,command:_0x588b80,text:_0x4802cc,usedPrefix:_0x3bccc6})=>{const _0x170fe5=_0x3fdf;let _0x32dd46={'key':{'participants':_0x170fe5(0x15e),'remoteJid':'status@broadcast','fromMe':![],'id':'Halo'},'message':{'contactMessage':{'vcard':_0x170fe5(0x15c)+_0x31f537['sender']['split']('@')[0x0]+':'+_0x31f537[_0x170fe5(0x18c)]['split']('@')[0x0]+_0x170fe5(0x182)}},'participant':'0@s.whatsapp.net'};if(!_0x4802cc)throw lenguajeGB['smsAvisoMG']()+_0x170fe5(0x17d)+(_0x3bccc6+_0x588b80)+_0x170fe5(0x173)+(_0x3bccc6+_0x588b80)+_0x170fe5(0x166);try{let _0x9003d5=(await youtubeSearch(_0x4802cc))[_0x170fe5(0x163)][0x0];if(!_0x9003d5)throw lenguajeGB[_0x170fe5(0x18d)]()+'𝙉𝙊\x20𝙎𝙀\x20𝙋𝙐𝘿𝙊\x20𝙀𝙉𝘾𝙊𝙉𝙏𝙍𝘼𝙍\x20𝙀𝙇\x20𝘼𝙐𝘿𝙄𝙊/𝙑𝙄𝘿𝙀𝙊.\x20𝙄𝙉𝙏𝙀𝙉𝙏𝙀\x20𝘾𝙊𝙉\x20𝙊𝙏𝙍𝙊\x20𝙉𝙊𝙈𝘽𝙍𝙀\x20𝙊\x20𝙏𝙄𝙏𝙐𝙇𝙊\x0a\x0a𝙏𝙃𝙀\x20𝘼𝙐𝘿𝙄𝙊/𝙑𝙄𝘿𝙀𝙊\x20𝘾𝙊𝙐𝙇𝘿\x20𝙉𝙊𝙏\x20𝘽𝙀\x20𝙁𝙊𝙐𝙉𝘿.\x20𝙏𝙍𝙔\x20𝘼𝙉𝙊𝙏𝙃𝙀𝙍\x20𝙉𝘼𝙈𝙀\x20𝙊𝙍\x20𝙏𝙄𝙏𝙇𝙀';let {title:_0x527263,description:_0x56ea88,thumbnail:_0x24ed0b,videoId:_0x2fc440,durationH:_0x595bb6,viewH:_0x14f716,publishedTime:_0x570403}=_0x9003d5;const _0x6f0d5=_0x170fe5(0x165)+_0x2fc440;await _0x309b3a[_0x170fe5(0x19e)](_0x31f537[_0x170fe5(0x16c)],wm,_0x170fe5(0x1a9)+vs+_0x170fe5(0x16a)+_0x527263+_0x170fe5(0x17a)+_0x56ea88+_0x170fe5(0x168)+_0x570403+_0x170fe5(0x197)+_0x595bb6+_0x170fe5(0x17f)+_0x14f716+_0x170fe5(0x185)+_0x6f0d5+'\x0a*𓆩\x20𓃠\x20𓆪\x20✧═══\x20'+vs+_0x170fe5(0x19c),await(await _0x309b3a[_0x170fe5(0x180)](_0x24ed0b))[_0x170fe5(0x17c)],[_0x170fe5(0x192),_0x3bccc6+'ytv\x20'+_0x6f0d5],![],{'quoted':_0x31f537,'document':{'url':_0x170fe5(0x198)},'mimetype':global[_0x170fe5(0x191)],'fileName':'😻\x20𝗦𝘂𝗽𝗲𝗿\x20𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗','fileLength':0x25e546dd9aaaa,'pageCount':0x29a,'contextInfo':{'externalAdReply':{'showAdAttribution':!![],'mediaType':0x2,'mediaUrl':''+_0x6f0d5,'title':_0x170fe5(0x162),'body':wm,'sourceUrl':md,'thumbnail':await(await _0x309b3a[_0x170fe5(0x180)](_0x24ed0b))[_0x170fe5(0x17c)]}}});const _0x3e7122=[{'title':comienzo+'\x20📡\x20𝗧𝗜𝗣𝗢𝗦\x20𝗗𝗘\x20𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦\x20'+fin,'rows':[{'title':_0x170fe5(0x177),'rowId':_0x3bccc6+'yta\x20'+_0x6f0d5,'description':_0x527263+'\x0a'},{'title':_0x170fe5(0x19b),'rowId':_0x3bccc6+_0x170fe5(0x1a6)+_0x6f0d5,'description':_0x527263+'\x0a'},{'title':_0x170fe5(0x16f),'rowId':_0x3bccc6+_0x170fe5(0x17e)+_0x6f0d5,'description':_0x527263+'\x0a'},{'title':_0x170fe5(0x19d),'rowId':_0x3bccc6+_0x170fe5(0x178)+_0x6f0d5,'description':_0x527263+'\x0a'},{'title':'𓃠\x20𝗩\x20𝗜\x20𝗗\x20𝗘\x20𝗢\x20(Opcion\x202)','rowId':_0x3bccc6+_0x170fe5(0x172)+_0x6f0d5,'description':_0x527263+'\x0a'},{'title':'𓃠\x20𝗩\x20𝗜\x20𝗗\x20𝗘\x20𝗢\x20\x20\x20𝗗\x20𝗢\x20𝗖','rowId':_0x3bccc6+_0x170fe5(0x183)+_0x6f0d5,'description':_0x527263+'\x0a'}]},{'title':comienzo+_0x170fe5(0x19f)+fin,'rows':[{'title':_0x170fe5(0x18e),'rowId':_0x3bccc6+_0x170fe5(0x1a7)+_0x4802cc}]}],_0x2344f3={'text':_0x170fe5(0x196)+_0x4802cc+'*','footer':global['wm'],'title':htki+'\x20*♻️\x20𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙎*\x20'+htka,'buttonText':'🍄\x20𝙀𝙇𝙀𝙍𝙂𝙄𝙍\x20🍁','sections':_0x3e7122};await _0x309b3a[_0x170fe5(0x16b)](_0x31f537[_0x170fe5(0x16c)],_0x2344f3,{'quoted':_0x32dd46});const _0xff601c=await await youtubedlv2(_0x6f0d5)[_0x170fe5(0x175)](async _0x172966=>await youtubedl(_0x6f0d5))[_0x170fe5(0x175)](async _0x42b8a7=>await youtubedlv3(_0x6f0d5)),_0x42931e=await _0xff601c['audio'][_0x170fe5(0x1a4)]['download']();let _0x140ba8={'audio':{'url':_0x42931e},'mimetype':_0x170fe5(0x179),'fileName':''+_0x527263,'contextInfo':{'externalAdReply':{'showAdAttribution':!![],'mediaType':0x2,'mediaUrl':_0x6f0d5,'title':_0x527263,'body':wm,'sourceUrl':_0x6f0d5,'thumbnail':await(await _0x309b3a[_0x170fe5(0x180)](_0x24ed0b))[_0x170fe5(0x17c)]}}};return _0x309b3a['sendMessage'](_0x31f537[_0x170fe5(0x16c)],_0x140ba8,{'quoted':_0x31f537});}catch(_0x3605aa){await _0x309b3a[_0x170fe5(0x19e)](_0x31f537[_0x170fe5(0x16c)],'\x0a'+wm,lenguajeGB['smsMalError3']()+'#report\x20'+_0x3bccc6+_0x588b80,null,[[lenguajeGB[_0x170fe5(0x171)](),'#reporte\x20'+lenguajeGB[_0x170fe5(0x187)]()+'\x20*'+(_0x3bccc6+_0x588b80)+'*']],_0x31f537),console[_0x170fe5(0x1a1)](_0x170fe5(0x176)+lenguajeGB[_0x170fe5(0x187)]()+'\x20'+(_0x3bccc6+_0x588b80)+_0x170fe5(0x164)),console[_0x170fe5(0x1a1)](_0x3605aa);}};function _0x3fdf(_0x3e684c,_0xd7ff8a){const _0x1bbc6c=_0xf8ec();return _0x3fdf=function(_0x4a126c,_0x4a1ce6){_0x4a126c=_0x4a126c-0x15c;let _0x1712de=_0x1bbc6c[_0x4a126c];return _0x1712de;},_0x3fdf(_0x3e684c,_0xd7ff8a);}function _0xf8ec(){const _0x42bf1c=['play.2\x20','\x20Billie\x20Eilish\x20-\x20Bellyache*\x0a\x0a𝙒𝙍𝙄𝙏𝙀\x20𝙏𝙃𝙀\x20𝙉𝘼𝙈𝙀\x20𝙊𝙍\x20𝙏𝙄𝙏𝙇𝙀\x0a𝙀𝙓𝘼𝙈𝙋𝙇𝙀\x0a*','random','catch','❗❗\x20','𓃠\x20𝗔\x20𝗨\x20𝗗\x20𝗜\x20𝗢\x20(Opcion\x201)','ytv\x20','audio/mp4','\x0a﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘\x0aও\x20*DESCRIPCIÓN\x20|\x20DESCRIPTION*\x0a»\x20','164708KkjqeX','data','𝙀𝙎𝘾𝙍𝙄𝘽𝘼\x20𝙀𝙇\x20𝙉𝙊𝙈𝘽𝙍𝙀\x20𝙊\x20𝙏𝙄𝙏𝙐𝙇𝙊\x0a𝙀𝙅𝙀𝙈𝙋𝙇𝙊\x0a*','pdocaudio\x20','\x0a﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘\x0aও\x20*VISTAS|\x20VIEWS*\x0a»\x20','getFile','warn','\x0aitem1.X-ABLabel:Ponsel\x0aEND:VCARD','pdocvieo\x20','constructor','\x0a﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘\x0aও\x20*URL*\x0a»\x20','trace','smsMensError2','floor','apply','length','bind','sender','smsAvisoFG','𓃠\x20𝗠\x20𝗔\x20𝗦\x20\x20\x20𝗥\x20𝗘\x20𝗦\x20𝗨\x20𝗟\x20𝗧\x20𝗔\x20𝗗\x20𝗢\x20𝗦','30hPxYeu','{}.constructor(\x22return\x20this\x22)(\x20)','dpdf','𓃠\x20𝗩\x20𝗜\x20𝗗\x20𝗘\x20𝗢','846215KGpSpR','__proto__','limit','*𝙀𝙇𝙄𝙅𝘼\x20𝙌𝙐𝙀\x20𝙑𝘼\x20𝙃𝘼𝘾𝙀𝙍\x20𝘾𝙊𝙉\x20\x20','\x0a﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘\x0aও\x20*DURACION\x20|\x20DURATION*\x0a»\x20','https://wa.me/18059196237','3088048VIGKdp','search','𓃠\x20𝗔\x20𝗨\x20𝗗\x20𝗜\x20𝗢\x20(Opcion\x202)','\x20═══✧\x20𓆩\x20𓃠\x20𓆪*','𓃠\x20𝗩\x20𝗜\x20𝗗\x20𝗘\x20𝗢\x20(Opcion\x201)','sendButton','\x20🔎\x20𝗕𝗨𝗦𝗤𝗨𝗘𝗗𝗔\x20𝗔𝗩𝗔𝗡𝗭𝗔𝗗𝗔\x20','exception','log','table','9KRYvds','128kbps','toString','play.1\x20','ytsearch\x20','(((.+)+)+)+$','*𓆩\x20𓃠\x20𓆪\x20✧═══\x20','9508202xUJNUR','9458480DbWMcT','BEGIN:VCARD\x0aVERSION:3.0\x0aN:Sy;Bot;;;\x0aFN:y\x0aitem1.TEL;waid=','console','0@s.whatsapp.net','11018AAUjIK','1078805ZUNmUn','info','🌟\x20Enviando\x20Audio...','video','\x20❗❗','https://www.youtube.com/watch?v=','\x20Billie\x20Eilish\x20-\x20Bellyache*','level','\x0a﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘\x0aও\x20*PUBLICADO\x20|\x20PUBLISHED*\x0a»\x20','9uoKHCF','\x20═══✧\x20𓆩\x20𓃠\x20𓆪*\x0aও\x20*TÍTULO\x20|\x20TITLE*\x0a»\x20','sendMessage','chat','prototype','command','𓃠\x20𝗔\x20𝗨\x20𝗗\x20𝗜\x20𝗢\x20\x20\x20𝗗\x20𝗢\x20𝗖','45yULjlC','smsMensError1'];_0xf8ec=function(){return _0x42bf1c;};return _0xf8ec();}handler[_0x85760(0x16e)]=/^play$/i,handler[_0x85760(0x195)]=0x2,handler[_0x85760(0x167)]=0x3;export default handler;function pickRandom(_0x15b9a2){const _0x5c6708=_0x85760;return _0x15b9a2[Math[_0x5c6708(0x188)](_0x15b9a2[_0x5c6708(0x18a)]*Math[_0x5c6708(0x174)]())];}
