import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝘼𝙇𝙂𝙐𝙈 𝘼𝙍𝙏𝙄𝙎𝙏𝘼 𝘿𝙀 𝙎𝙋𝙊𝙏𝙄𝙁𝙔\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊:\n${usedPrefix + command} tini`
try {
let resultados = await spotifyxv(text)
let res = resultados.map((v, i) => {
let duracion = timestamp(v.duracion)
return `[${i + 1}]\n❤️꙰༻ *TÍTULO:* ${v.nombre}\n⁖👤༻ *ARTISTAS:* ${v.artistas.join(', ')}\n⁖🗂️༻ *ÁLBUM:* ${v.album}\n⁖⏰༻ *DURACIÓN:* ${duracion}\n📎꙰༻ *LINK:* ${v.url}\n\n••••••••••••••••••••••••••••••••••••\n`
}).join('\n')
if (res) {
if (!global.spotifyList) {
global.spotifyList = [];
}    
if (global.spotifyList[0]?.from == m.sender) {
global.spotifyList.splice(0, global.spotifyList.length);
}    
global.spotifyList = resultados.map(v => `${v.nombre} - ${v.artistas.join(', ')}`)
      
const albumInfo = await obtenerAlbumInfo(resultados[0].album)
conn.sendMessage(m.chat, { image: { url: albumInfo.imagen }, caption: res }, { quoted: m })
}} catch (e) {
await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
}}
handler.command = /^(spotifysearch)$/i
handler.limit = 1
handler.level = 3
export default handler

function _0x5a66(){const _0x321d39=['data','&type=track','clientSecret','length','3486687Wvmejl','map','images','&type=album','30727392TJzuSu','3787665KnUGkb','380TNokxl','Bearer\x20','spotify','0e8439a1280a43aba9a5bc0a16f3f009','6KjGNXP','from','23211UceQJg','name','411389QAjubF','https://accounts.spotify.com/api/token','2xNpDKH','4ZvDAvB','get','url','3784HsfkxS','base64','post','grant_type=client_credentials','floor','https://api.spotify.com/v1/search?q=','application/x-www-form-urlencoded','clientId','album','9118774nlsHfS','access_token','tracks','927214pOBryi','artists','duration_ms','external_urls'];_0x5a66=function(){return _0x321d39;};return _0x5a66();}const _0x2d6cc2=_0xc49c;function _0xc49c(_0xc7cce4,_0xcc6a08){const _0x5a66ac=_0x5a66();return _0xc49c=function(_0xc49cc3,_0x8506af){_0xc49cc3=_0xc49cc3-0x1e3;let _0x505106=_0x5a66ac[_0xc49cc3];return _0x505106;},_0xc49c(_0xc7cce4,_0xcc6a08);}(function(_0x4c7fea,_0x552021){const _0xf35b83=_0xc49c,_0x58eed4=_0x4c7fea();while(!![]){try{const _0x396c93=-parseInt(_0xf35b83(0x1e9))/0x1*(parseInt(_0xf35b83(0x1f9))/0x2)+parseInt(_0xf35b83(0x201))/0x3+-parseInt(_0xf35b83(0x1ea))/0x4*(parseInt(_0xf35b83(0x206))/0x5)+-parseInt(_0xf35b83(0x1e3))/0x6*(parseInt(_0xf35b83(0x1f6))/0x7)+-parseInt(_0xf35b83(0x1ed))/0x8*(parseInt(_0xf35b83(0x1e5))/0x9)+parseInt(_0xf35b83(0x207))/0xa*(parseInt(_0xf35b83(0x1e7))/0xb)+parseInt(_0xf35b83(0x205))/0xc;if(_0x396c93===_0x552021)break;else _0x58eed4['push'](_0x58eed4['shift']());}catch(_0x42812f){_0x58eed4['push'](_0x58eed4['shift']());}}}(_0x5a66,0xe4b07));const credentials={'clientId':'acc6302297e040aeb6e4ac1fbdfd62c3','clientSecret':_0x2d6cc2(0x20a)};async function spotifyxv(_0x11bbc5){const _0x500b0b=_0x2d6cc2,_0x5f25cb=await obtenerTokenSpotify(),_0x5771f0=await axios({'method':'get','url':'https://api.spotify.com/v1/search?q='+encodeURIComponent(_0x11bbc5)+_0x500b0b(0x1fe),'headers':{'Authorization':_0x500b0b(0x208)+_0x5f25cb}}),_0x7f1074=_0x5771f0[_0x500b0b(0x1fd)][_0x500b0b(0x1f8)]['items'],_0x297b78=_0x7f1074[_0x500b0b(0x202)](_0x2f1c00=>({'nombre':_0x2f1c00[_0x500b0b(0x1e6)],'artistas':_0x2f1c00[_0x500b0b(0x1fa)][_0x500b0b(0x202)](_0x1609b7=>_0x1609b7[_0x500b0b(0x1e6)]),'album':_0x2f1c00[_0x500b0b(0x1f5)]['name'],'duracion':_0x2f1c00[_0x500b0b(0x1fb)],'url':_0x2f1c00[_0x500b0b(0x1fc)][_0x500b0b(0x209)]}));return _0x297b78;}async function obtenerTokenSpotify(){const _0x34c779=_0x2d6cc2,_0xec6109=await axios({'method':_0x34c779(0x1ef),'url':_0x34c779(0x1e8),'headers':{'Content-Type':_0x34c779(0x1f3),'Authorization':'Basic\x20'+Buffer[_0x34c779(0x1e4)](credentials[_0x34c779(0x1f4)]+':'+credentials[_0x34c779(0x1ff)])['toString'](_0x34c779(0x1ee))},'data':_0x34c779(0x1f0)});return _0xec6109[_0x34c779(0x1fd)][_0x34c779(0x1f7)];}async function obtenerAlbumInfo(_0xbb41ca){const _0x277f0b=_0x2d6cc2,_0x498a0f=await obtenerTokenSpotify(),_0x35078d=await axios({'method':_0x277f0b(0x1eb),'url':_0x277f0b(0x1f2)+encodeURIComponent(_0xbb41ca)+_0x277f0b(0x204),'headers':{'Authorization':_0x277f0b(0x208)+_0x498a0f}}),_0x38fc03=_0x35078d[_0x277f0b(0x1fd)]['albums']['items'];if(_0x38fc03[_0x277f0b(0x200)]>0x0){const _0x53e669=_0x38fc03[0x0];return{'nombre':_0x53e669['name'],'imagen':_0x53e669[_0x277f0b(0x203)][0x0][_0x277f0b(0x1ec)]};}return{'nombre':_0xbb41ca};}function timestamp(_0x11dd62){const _0x5cab0c=_0x2d6cc2,_0x4ce311=Math[_0x5cab0c(0x1f1)](_0x11dd62/0x3e8),_0x4200b6=Math[_0x5cab0c(0x1f1)](_0x4ce311/0x3c),_0x3e0452=_0x4ce311%0x3c;return _0x4200b6+':'+(_0x3e0452<0xa?'0':'')+_0x3e0452;}
