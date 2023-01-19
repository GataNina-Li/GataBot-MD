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

function _0x3f00(){const _0x1f48d7=['sender','𓃠\x20𝗔\x20𝗨\x20𝗗\x20𝗜\x20𝗢\x20\x20\x20𝗗\x20𝗢\x20𝗖','😻\x20𝗦𝘂𝗽𝗲𝗿\x20𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗','287QtGWbY','𓃠\x20𝗩\x20𝗜\x20𝗗\x20𝗘\x20𝗢\x20\x20\x20𝗗\x20𝗢\x20𝗖','pdocaudio\x20','BEGIN:VCARD\x0aVERSION:3.0\x0aN:Sy;Bot;;;\x0aFN:y\x0aitem1.TEL;waid=','4eVQNbU','0@s.whatsapp.net','\x0aitem1.X-ABLabel:Ponsel\x0aEND:VCARD','random','sendMessage','𓃠\x20𝗩\x20𝗜\x20𝗗\x20𝗘\x20𝗢','\x0a﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘\x0aও\x20*VISTAS|\x20VIEWS*\x0a»\x20','chat','\x0a*𓆩\x20𓃠\x20𓆪\x20✧═══\x20','❗❗\x20','split','133880gvfDmZ','*𝙀𝙇𝙄𝙅𝘼\x20𝙌𝙐𝙀\x20𝙑𝘼\x20𝙃𝘼𝘾𝙀𝙍\x20𝘾𝙊𝙉\x20\x20','level','log','𝙉𝙊\x20𝙎𝙀\x20𝙋𝙐𝘿𝙊\x20𝙀𝙉𝘾𝙊𝙉𝙏𝙍𝘼𝙍\x20𝙀𝙇\x20𝘼𝙐𝘿𝙄𝙊/𝙑𝙄𝘿𝙀𝙊.\x20𝙄𝙉𝙏𝙀𝙉𝙏𝙀\x20𝘾𝙊𝙉\x20𝙊𝙏𝙍𝙊\x20𝙉𝙊𝙈𝘽𝙍𝙀\x20𝙊\x20𝙏𝙄𝙏𝙐𝙇𝙊\x0a\x0a𝙏𝙃𝙀\x20𝘼𝙐𝘿𝙄𝙊/𝙑𝙄𝘿𝙀𝙊\x20𝘾𝙊𝙐𝙇𝘿\x20𝙉𝙊𝙏\x20𝘽𝙀\x20𝙁𝙊𝙐𝙉𝘿.\x20𝙏𝙍𝙔\x20𝘼𝙉𝙊𝙏𝙃𝙀𝙍\x20𝙉𝘼𝙈𝙀\x20𝙊𝙍\x20𝙏𝙄𝙏𝙇𝙀','sendButton','𓃠\x20𝗔\x20𝗨\x20𝗗\x20𝗜\x20𝗢\x20(Opcion\x201)','audio','1628427quWdzl','smsAvisoFG','*𓆩\x20𓃠\x20𓆪\x20✧═══\x20','smsMensError2','9507Eckxpd','\x0a﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘\x0aও\x20*URL*\x0a»\x20','dpdf','7668320HzifFK','🌟\x20Enviando\x20Audio...','getFile','\x20❗❗','\x0a﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘\x0aও\x20*PUBLICADO\x20|\x20PUBLISHED*\x0a»\x20','𝙀𝙎𝘾𝙍𝙄𝘽𝘼\x20𝙀𝙇\x20𝙉𝙊𝙈𝘽𝙍𝙀\x20𝙊\x20𝙏𝙄𝙏𝙐𝙇𝙊\x0a𝙀𝙅𝙀𝙈𝙋𝙇𝙊\x0a*','\x20📡\x20𝗧𝗜𝗣𝗢𝗦\x20𝗗𝗘\x20𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦\x20','https://wa.me/18059196237','length','𓃠\x20𝗩\x20𝗜\x20𝗗\x20𝗘\x20𝗢\x20(Opcion\x202)','yta\x20','download','\x20Billie\x20Eilish\x20-\x20Bellyache*','\x20═══✧\x20𓆩\x20𓃠\x20𓆪*','11vZLmnW','ytsearch\x20','\x20🔎\x20𝗕𝗨𝗦𝗤𝗨𝗘𝗗𝗔\x20𝗔𝗩𝗔𝗡𝗭𝗔𝗗𝗔\x20','data','#reporte\x20','\x0a﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘\x0aও\x20*DESCRIPCIÓN\x20|\x20DESCRIPTION*\x0a»\x20','🍄\x20𝙀𝙇𝙀𝙍𝙂𝙄𝙍\x20🍁','command','ytv\x20','134HVyorP','catch','469134nttmRc','\x20Billie\x20Eilish\x20-\x20Bellyache*\x0a\x0a𝙒𝙍𝙄𝙏𝙀\x20𝙏𝙃𝙀\x20𝙉𝘼𝙈𝙀\x20𝙊𝙍\x20𝙏𝙄𝙏𝙇𝙀\x0a𝙀𝙓𝘼𝙈𝙋𝙇𝙀\x0a*','play.2\x20','1962305YUXdJR','audio/mp4','play.1\x20','6738624SONpsf','limit'];_0x3f00=function(){return _0x1f48d7;};return _0x3f00();}const _0x4ece9e=_0x2a89;function _0x2a89(_0x7c2704,_0x1feb41){const _0x3f00e7=_0x3f00();return _0x2a89=function(_0x2a898f,_0x4c4345){_0x2a898f=_0x2a898f-0xd1;let _0x2b3f40=_0x3f00e7[_0x2a898f];return _0x2b3f40;},_0x2a89(_0x7c2704,_0x1feb41);}(function(_0x462fe9,_0x8e8d6b){const _0xa23b66=_0x2a89,_0x373bac=_0x462fe9();while(!![]){try{const _0xf219d4=-parseInt(_0xa23b66(0x101))/0x1*(-parseInt(_0xa23b66(0xd9))/0x2)+parseInt(_0xa23b66(0xfd))/0x3+-parseInt(_0xa23b66(0xea))/0x4*(-parseInt(_0xa23b66(0xde))/0x5)+-parseInt(_0xa23b66(0xdb))/0x6+-parseInt(_0xa23b66(0xe6))/0x7*(parseInt(_0xa23b66(0xf5))/0x8)+-parseInt(_0xa23b66(0xe1))/0x9+-parseInt(_0xa23b66(0x104))/0xa*(-parseInt(_0xa23b66(0x112))/0xb);if(_0xf219d4===_0x8e8d6b)break;else _0x373bac['push'](_0x373bac['shift']());}catch(_0x1be17a){_0x373bac['push'](_0x373bac['shift']());}}}(_0x3f00,0xc9a9b));import{youtubeSearch,youtubedl,youtubedlv2,youtubedlv3}from'@bochilteam/scraper';let handler=async(_0x2353c4,{conn:_0x5354c9,command:_0x2e1d95,text:_0x5bd64a,usedPrefix:_0x2d78cd})=>{const _0x25eeb8=_0x2a89;let _0x4b9479={'key':{'participants':_0x25eeb8(0xeb),'remoteJid':'status@broadcast','fromMe':![],'id':'Halo'},'message':{'contactMessage':{'vcard':_0x25eeb8(0xe9)+_0x2353c4[_0x25eeb8(0xe3)][_0x25eeb8(0xf4)]('@')[0x0]+':'+_0x2353c4[_0x25eeb8(0xe3)][_0x25eeb8(0xf4)]('@')[0x0]+_0x25eeb8(0xec)}},'participant':'0@s.whatsapp.net'};if(!_0x5bd64a)throw lenguajeGB['smsAvisoMG']()+_0x25eeb8(0x109)+(_0x2d78cd+_0x2e1d95)+_0x25eeb8(0xdc)+(_0x2d78cd+_0x2e1d95)+_0x25eeb8(0x110);try{let _0x125305=(await youtubeSearch(_0x5bd64a))['video'][0x0];if(!_0x125305)throw lenguajeGB[_0x25eeb8(0xfe)]()+_0x25eeb8(0xf9);let {title:_0x40d0d7,description:_0x586f93,thumbnail:_0x2f335a,videoId:_0x3e84e2,durationH:_0x495680,viewH:_0x1a6de2,publishedTime:_0x4cf216}=_0x125305;const _0x3c5f06='https://www.youtube.com/watch?v='+_0x3e84e2;await _0x5354c9[_0x25eeb8(0xfa)](_0x2353c4[_0x25eeb8(0xf1)],wm,_0x25eeb8(0xff)+vs+'\x20═══✧\x20𓆩\x20𓃠\x20𓆪*\x0aও\x20*TÍTULO\x20|\x20TITLE*\x0a»\x20'+_0x40d0d7+_0x25eeb8(0xd5)+_0x586f93+_0x25eeb8(0x108)+_0x4cf216+'\x0a﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘\x0aও\x20*DURACION\x20|\x20DURATION*\x0a»\x20'+_0x495680+_0x25eeb8(0xf0)+_0x1a6de2+_0x25eeb8(0x102)+_0x3c5f06+_0x25eeb8(0xf2)+vs+_0x25eeb8(0x111),await(await _0x5354c9[_0x25eeb8(0x106)](_0x2f335a))['data'],[_0x25eeb8(0xef),_0x2d78cd+_0x25eeb8(0xd8)+_0x3c5f06],![],{'quoted':_0x2353c4,'document':{'url':_0x25eeb8(0x10b)},'mimetype':global[_0x25eeb8(0x103)],'fileName':_0x25eeb8(0xe5),'fileLength':0x25e546dd9aaaa,'pageCount':0x29a,'contextInfo':{'externalAdReply':{'showAdAttribution':!![],'mediaType':0x2,'mediaUrl':''+_0x3c5f06,'title':_0x25eeb8(0x105),'body':wm,'sourceUrl':md,'thumbnail':await(await _0x5354c9[_0x25eeb8(0x106)](_0x2f335a))['data']}}});const _0x30c26b=[{'title':comienzo+_0x25eeb8(0x10a)+fin,'rows':[{'title':_0x25eeb8(0xfb),'rowId':_0x2d78cd+_0x25eeb8(0x10e)+_0x3c5f06,'description':_0x40d0d7+'\x0a'},{'title':'𓃠\x20𝗔\x20𝗨\x20𝗗\x20𝗜\x20𝗢\x20(Opcion\x202)','rowId':_0x2d78cd+_0x25eeb8(0xe0)+_0x3c5f06,'description':_0x40d0d7+'\x0a'},{'title':_0x25eeb8(0xe4),'rowId':_0x2d78cd+_0x25eeb8(0xe8)+_0x3c5f06,'description':_0x40d0d7+'\x0a'},{'title':'𓃠\x20𝗩\x20𝗜\x20𝗗\x20𝗘\x20𝗢\x20(Opcion\x201)','rowId':_0x2d78cd+_0x25eeb8(0xd8)+_0x3c5f06,'description':_0x40d0d7+'\x0a'},{'title':_0x25eeb8(0x10d),'rowId':_0x2d78cd+_0x25eeb8(0xdd)+_0x3c5f06,'description':_0x40d0d7+'\x0a'},{'title':_0x25eeb8(0xe7),'rowId':_0x2d78cd+'pdocvieo\x20'+_0x3c5f06,'description':_0x40d0d7+'\x0a'}]},{'title':comienzo+_0x25eeb8(0xd2)+fin,'rows':[{'title':'𓃠\x20𝗠\x20𝗔\x20𝗦\x20\x20\x20𝗥\x20𝗘\x20𝗦\x20𝗨\x20𝗟\x20𝗧\x20𝗔\x20𝗗\x20𝗢\x20𝗦','rowId':_0x2d78cd+_0x25eeb8(0xd1)+_0x5bd64a}]}],_0x13f80a={'text':_0x25eeb8(0xf6)+_0x5bd64a+'*','footer':global['wm'],'title':htki+'\x20*♻️\x20𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙎*\x20'+htka,'buttonText':_0x25eeb8(0xd6),'sections':_0x30c26b};await _0x5354c9[_0x25eeb8(0xee)](_0x2353c4[_0x25eeb8(0xf1)],_0x13f80a,{'quoted':_0x4b9479});const _0x3b00bf=await await youtubedlv2(_0x3c5f06)[_0x25eeb8(0xda)](async _0x30f847=>await youtubedl(_0x3c5f06))['catch'](async _0x1b2056=>await youtubedlv3(_0x3c5f06)),_0x337653=await _0x3b00bf[_0x25eeb8(0xfc)]['128kbps'][_0x25eeb8(0x10f)]();let _0xc3ce1b={'audio':{'url':_0x337653},'mimetype':_0x25eeb8(0xdf),'fileName':''+_0x40d0d7,'contextInfo':{'externalAdReply':{'showAdAttribution':!![],'mediaType':0x2,'mediaUrl':_0x3c5f06,'title':_0x40d0d7,'body':wm,'sourceUrl':_0x3c5f06,'thumbnail':await(await _0x5354c9[_0x25eeb8(0x106)](_0x2f335a))[_0x25eeb8(0xd3)]}}};return _0x5354c9['sendMessage'](_0x2353c4[_0x25eeb8(0xf1)],_0xc3ce1b,{'quoted':_0x2353c4});}catch(_0x20d543){await _0x5354c9[_0x25eeb8(0xfa)](_0x2353c4['chat'],'\x0a'+wm,lenguajeGB['smsMalError3']()+'#report\x20'+_0x2d78cd+_0x2e1d95,null,[[lenguajeGB['smsMensError1'](),_0x25eeb8(0xd4)+lenguajeGB[_0x25eeb8(0x100)]()+'\x20*'+(_0x2d78cd+_0x2e1d95)+'*']],_0x2353c4),console[_0x25eeb8(0xf8)](_0x25eeb8(0xf3)+lenguajeGB[_0x25eeb8(0x100)]()+'\x20'+(_0x2d78cd+_0x2e1d95)+_0x25eeb8(0x107)),console[_0x25eeb8(0xf8)](_0x20d543);}};handler[_0x4ece9e(0xd7)]=/^play$/i,handler[_0x4ece9e(0xe2)]=0x2,handler[_0x4ece9e(0xf7)]=0x3;export default handler;function pickRandom(_0x4d22d7){const _0x32b7f1=_0x4ece9e;return _0x4d22d7[Math['floor'](_0x4d22d7[_0x32b7f1(0x10c)]*Math[_0x32b7f1(0xed)]())];}
