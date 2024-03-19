import { sticker } from '../lib/sticker.js'
let handler = async(m, { conn }) => {
if (db.data.chats[m.chat].stickers) {

let nombre = '🐈 𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿'
let nombre2 = '𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨' 
 
let stiker = await sticker(null, s[Math.floor(Math.random() * s.length)], nombre, nombre2)
await delay(3 * 3000)
if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '',m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: gt, body: `? ????? ???????-?? - ????????`, mediaType: 2, sourceUrl: accountsgb, thumbnail: gataImg }}}, { quoted: m })
}}
handler.customPrefix = /lindo|linda|cariño|love|corazón|bonita|bonito/i 
handler.command = new RegExp
handler.exp = 50
export default handler
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const s = [
'https://media1.giphy.com/media/2dQ3FMaMFccpi/giphy.gif?cid=ecf05e476azkdvh2cu7b567gbpgyc6q7qd38pklqp12npygv&rid=giphy.gif&ct=g',
'https://media3.giphy.com/media/cuUVK6p5YrGbC/giphy.gif?cid=ecf05e4749iutq8ycis7x4mlesz3vq4z9wzy9luesfrx5fl1&rid=giphy.gif&ct=g',
'https://media3.giphy.com/media/lqMxLjlpyAaAjfJ9yj/giphy.gif?cid=ecf05e47l6yo1v7gr5b82228pdw55t2dmxet4sf2f8cosi2t&rid=giphy.gif&ct=g',
'https://media1.giphy.com/media/3o7qDJKIO5rSeyHhvO/giphy.gif?cid=ecf05e47wbv1k4le0x9o71uuni46evr2rrqz2c5nbpncbz7q&rid=giphy.gif&ct=g',
'https://media4.giphy.com/media/7WH2eHCxpFcI0/giphy.gif?cid=ecf05e47cjkpwersiadjgg6qsuzl4svavugz7ken1we6sfp2&rid=giphy.gif&ct=g',
'https://media0.giphy.com/media/guvCWEaSNe7iE/giphy.gif?cid=ecf05e47cjkpwersiadjgg6qsuzl4svavugz7ken1we6sfp2&rid=giphy.gif&ct=g',
'https://media2.giphy.com/media/l0HlGdXFWYbKv5rby/giphy.gif?cid=ecf05e47sja0atawmyn9ycshzdkzwsphs6aonhzkiuem4m43&rid=giphy.gif&ct=g',
'https://c.tenor.com/2HJox6Gn7AkAAAAC/anime-hearts.gif',
'https://c.tenor.com/hwsbuAcG8UQAAAAC/foxplushy-foxy.gif',
'https://c.tenor.com/qK_49TUnuJMAAAAC/love-anime-anime-girl.gif',
'https://c.tenor.com/PGXshKPAUh4AAAAC/my-dress-up-darling-anime-love.gif',
'https://c.tenor.com/11XPK5HEweUAAAAd/koisuru-asteroid-asteroid-in-love.gif',
'https://c.tenor.com/OaSQqWO4-YUAAAAC/snuggle-anime.gif',
'https://i.pinimg.com/originals/d7/08/56/d708566c82aa43ca60a50332b508e430.gif',
'https://s11.favim.com/orig/7/779/7794/77949/funny-cute-kawaii-Favim.com-7794969.gif',
'https://i.gifer.com/ZBFI.gif',
'https://pa1.narvii.com/6139/a3d520c7458530f3f63cedbfbd3d4b420a502602_hq.gif',
'https://st1.uvnimg.com/dims4/default/0110acc/2147483647/thumbnail/400x225/quality/75/format/jpg/?url=https%3A%2F%2Fuvn-brightspot.s3.amazonaws.com%2Fassets%2Fvixes%2Fbtg%2Fseries.batanga.com%2Ffiles%2Fcosas-que-extra%C3%B1amos-de-sailor-moon-5.gif',
'https://acegif.com/wp-content/uploads/gif/anime-hug-59.gif',
'https://acegif.com/wp-content/uploads/anime-love-29.gif',
'https://c.tenor.com/DZll3gcSP04AAAAC/love.gif',
'https://c.tenor.com/8ZQda51r0EsAAAAC/hi-love.gif',
'https://c.tenor.com/F__giz9_y90AAAAC/love.gif',
'https://media4.giphy.com/media/bMLGNRoAy0Yko/giphy.gif?cid=ecf05e472u70ws0e40cyvl5u6lywrmgvzzhp9qoew670oqfi&rid=giphy.gif&ct=g',
'https://media4.giphy.com/media/Z21HJj2kz9uBG/giphy.gif?cid=ecf05e472u70ws0e40cyvl5u6lywrmgvzzhp9qoew670oqfi&rid=giphy.gif&ct=g',
'https://media2.giphy.com/media/5bdhq6YF0szPaCEk9Y/giphy.gif?cid=ecf05e47izw67d3ltxeaaij9htevgdp0x4jg3xujxs3bptnk&rid=giphy.gif&ct=g',
'https://media3.giphy.com/media/l3vR8xgaVJIDE8ec0/giphy.gif?cid=ecf05e47izw67d3ltxeaaij9htevgdp0x4jg3xujxs3bptnk&rid=giphy.gif&ct=g',
'https://media4.giphy.com/media/10tTOmhZzHMoW4/giphy.gif?cid=ecf05e47zgffwvy8mvp1j71e71c780oz9uzgru9atqecf91q&rid=giphy.gif&ct=g'
];  
