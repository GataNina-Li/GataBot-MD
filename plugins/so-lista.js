let handler = m => m
handler.all = async function (m) {
let chat = global.db.data.chats[m.chat];
if (m.isBot || m.sender.includes('bot') || m.sender.includes('Bot')) return true;
if (chat.isBanned) return
global.db.data.users[m.sender].money += 50
global.db.data.users[m.sender].exp += 50  
//if (m.fromMe) return !0
if (!db.data.chats[m.chat].audios) throw 0   

const audioMap = [
    { regex: /^A Bueno master|Bueno master|Bueno Máster|🫂$/i, url: 'https://qu.ax/xynz.mp3' },
    { regex: /^Chupame|Pingo|Qliao$/i, url: 'https://qu.ax/SCpi.mp3' },
    { regex: /^ara ara$/i, url: 'https://qu.ax/PPgt.mp3' },
    { regex: /(bienvenido|bienvenid@)/gi, url: 'https://qu.ax/cUYg.mp3' },
    { regex: /^Blackpink in your area$/i, url: 'https://qu.ax/pavq.mp3' },
    { regex: /^Buen día grupo|Buen dia grupo$/i, url: 'https://qu.ax/GoKq.mp3' },
    { regex: /^Calla Fan de BTS|Amo a BTS$/i, url: 'https://qu.ax/oqNf.mp3' },
    { regex: /^Cámbiate a Movistar|cambiate a movistar$/i, url: 'https://qu.ax/RxJC.mp3' },
    { regex: /^(Corte Corte|pelea|golpear)$/i, url: 'https://qu.ax/hRuU.mp3' },
    { regex: /^(El Tóxico|tóxico)$/i, url: 'https://qu.ax/WzBd.mp3' },
    { regex: /^Elmo sabe dónde vives|Elmo sabe donde vives$/i, url: 'https://qu.ax/YsLt.mp3' },
    { regex: /^(En caso de una investigación|fbi|cia|nasa)$/i, url: 'https://qu.ax/Syg.mp3' },
    { regex: /^(Eres Fuerte|god|🤜|🤛)$/i, url: 'https://qu.ax/lhzq.mp3' },
    { regex: /^(Zzzz|😴|💩)$/i, url: 'https://qu.ax/KkSZ.mp3' },
    { regex: /^(Las reglas del grupo|lee|leíste)$/i, url: 'https://qu.ax/fwek.mp3' },
    { regex: /^(Me anda buscando anonymous|anonimus|anónimo)$/i, url: 'https://qu.ax/MWJz.mp3' },
    { regex: /^(Momento equisde|🤘|👄|🕴️)$/i, url: 'https://qu.ax/PitP.mp3' },
    { regex: /^(Motivación|☘️)$/i, url: 'https://qu.ax/MXnK.mp3' },
    { regex: /^(Muchachos|⛈️|🌩️)$/i, url: 'https://qu.ax/dRVb.mp3' },
    { regex: /^Nico Nico|🐄|🐖|🐬|🐼|🐰|🐇|🦦|🐋$/i, url: 'https://qu.ax/OUyB.mp3' },
    { regex: /^(No Rompas más|No Rompas mas|💔|😖|😣)$/i, url: 'https://qu.ax/ZkAp.mp3' },
    { regex: /^(Porque ta tite|Por qué ta tite|😕|😟)$/i, url: 'https://qu.ax/VrjA.mp3' },
    { regex: /^(Potaxio|Potasio|🥑)$/i, url: 'https://qu.ax/vPoj.mp3' },
    { regex: /^(Que tal Grupo|qué tal grupo|grupos)$/i, url: 'https://qu.ax/lirF.mp3' },
    { regex: /^(Se están riendo de mí|Se estan riendo de mi|Se esta riendo de mi|Se está riendo de mi|se estan)$/i, url: 'https://qu.ax/XBXo.mp3' },
    { regex: /^(Su nivel de pendejo|pendeja|pendejo|idiota|tonto|tonta|🙄)$/i, url: 'https://qu.ax/SUHo.mp3' },
    { regex: /^(tal vez|puede ser|posible|🧘‍|♀️🧘|🍦|🍡|🌮|🎩)$/i, url: 'https://qu.ax/QMjH.mp3' },
    { regex: /^(Te gusta el Pepino|🥒|🍆|nepe)$/i, url: 'https://qu.ax/ddrn.mp3' },
    { regex: /^(Todo bien|😇|😄|🏂|⛷️|🏋️‍|♂️🏋️‍|♀️🤹‍|♀️🤹‍|♂️👌)$/i, url: 'https://qu.ax/EDUC.mp3' },
    { regex: /^(Traigan le una falda|Traiganle una falda|Nina|niña|niño)$/i, url: 'https://qu.ax/fnTL.mp3' },
    { regex: /^(Y este quien es|Y este quien poronga es|Y este quien porongas es|vida)$/i, url: 'https://qu.ax/QnET.mp3' },
    { regex: /^(Goku pervertido|pervertido|pervertida|goku|antojen|antogen|😈|👿|👉👌|👌👈)$/i, url: 'https://qu.ax/CUmZ.mp3' },
    { regex: /^(abduzcan|Abduzcan|adbuzcan|Adbuzcan)$/i, url: './media/abduzcan.mp3' },
    { regex: /^(TENGO LOS CALZONES|Tengo los calzones|tengo los calzones|🥶|😨|calzones)$/i, url: 'https://qu.ax/pzRp.mp3' },
    { regex: /^(anadieleimporta|a nadie le importa|y que|no importa|literal)$/i, url: 'https://qu.ax/JocM.mp3' },
    { regex: /^(miarda de bot|mierda de bot|mearda de bot|Miarda de Bot|Mierda de Bot|Mearda de Bot|bot puto|Bot puto|Bot CTM|Bot ctm|bot CTM|bot ctm|bot pendejo|Bot pendejo|bot de mierda)$/i, url: 'https://qu.ax/UEZQ.mp3' },
    { regex: /^(baneado|Baneado|baneada)$/i, url: 'https://qu.ax/SJJt.mp3' },
    { regex: /^(Cada|Basado|Basada|Basadisimo|BASADO|basado|basada|Que basado|Que basada|que basado)$/i, url: 'https://qu.ax/jDAl.mp3' },
    { regex: /^Bien pensado woody$/i, url: 'https://qu.ax/nvxb.mp3' },
    { regex: /^Bañate$/i, url: 'https://qu.ax/JsYa.mp3' },
    { regex: /^Buenas noches$/i, url: 'https://qu.ax/TTfs.mp3' },
    { regex: /^Bueno si$/i, url: 'https://qu.ax/DqBM.mp3' },
    { regex: /^Buenos dias$/i, url: 'https://qu.ax/wLUF.mp3' },
    { regex: /^Me olvide$/i, url: 'https://qu.ax/SbX.mp3' },
    { regex: /^Diagnosticado con gay$/i, url: 'https://qu.ax/cUl.mp3' },
    { regex: /^El pepe$/i, url: 'https://qu.ax/Efdb.mp3' },
    { regex: /^El rap de fernanfloo$/i, url: 'https://qu.ax/Vved.mp3' },
    { regex: /^Enojado$/i, url: 'https://qu.ax/jqTX.mp3' },
    { regex: /^Entrada$/i, url: 'https://qu.ax/UpAC.mp3' },
    { regex: /^Esto va ser épico papus$/i, url: 'https://qu.ax/pjTx.mp3' },
    { regex: /^Esto va para ti$/i, url: 'https://qu.ax/Tabl.mp3' },
    { regex: /^Feliz cumpleaños$/i, url: 'https://qu.ax/UtmZ.mp3' },
    { regex: /^Fiesta del admin2$/i, url: 'https://qu.ax/MpnG.mp3' },
    { regex: /^Fiesta del admin$/i, url: 'https://qu.ax/jDVi.mp3' },
    { regex: /^Fiesta del admin 3$/i, url: 'https://qu.ax/fRz.mp3' },
    { regex: /^Fino señores$/i, url: 'https://qu.ax/hapR.mp3' },
    { regex: /^Me voy$/i, url: 'https://qu.ax/iOky.mp3' },
    { regex: /^Tunometecabrasaramambiche$/i, url: 'https://qu.ax/LAAB.mp3' },
    { regex: /^Gemidos$/i, url: 'https://qu.ax/bwPL.mp3' },
    { regex: /^Audio hentai$/i, url: 'https://qu.ax/GSUY.mp3' }, 
     { regex: /(Contexto|CONTEXTO|contexto|Pasen contexto|PASEN CONTEXTO|pasen contexto|Y el contexto|Y EL CONTEXTO|y el contexto)/gi, url: 'https://qu.ax/YBzh.mp3' },
    { regex: /(Pero esto|pero esto|Pero esto ya es otro nivel|pero esto ya es otro nivel|Otro nivel|otro nivel)/gi, url: 'https://qu.ax/javz.mp3' },
    { regex: /(PIKA|pica|Pica|Pikachu|pikachu|PIKACHU|picachu|Picachu)/gi, url: 'https://qu.ax/wbAf.mp3' },
    { regex: /(Pokemon|pokemon|Pokémon|pokémon)/gi, url: 'https://qu.ax/kWLh.mp3' },
    { regex: /(Quién es tu senpai botsito 7u7|Quien es tu senpai botsito 7u7|Quién es tu sempai botsito 7u7|Quien es tu sempai botsito 7u7|Quién es tu senpai botsito 7w7|Quien es tu senpai botsito 7w7|quién es tu senpai botsito 7u7|quien es tu senpai botsito 7u7|Quién es tu sempai botsito 7w7|Quien es tu sempai botsito 7w7|Quién es tu senpai botsito|Quien es tu senpai botsito|Quién es tu sempai botsito|Quien es tu sempai botsito)/gi, url: 'https://qu.ax/uyqQ.mp3' },
    { regex: /(rawr|Rawr|RAWR|raawwr|rraawr|rawwr)/gi, url: 'https://qu.ax/YnoG.mp3' },
    { regex: /(hablame|Habla me|Hablame|habla me|Háblame|háblame)/gi, url: 'https://qu.ax/uQqA.mp3' },
    { regex: /(Cagaste|Miedo|miedo|Pvp|PVP|temor|que pasa|Que sucede|Que pasa|que sucede|Qué pasa|Qué sucede|Dime|dime)/gi, url: 'https://qu.ax/FAVP.mp3' },
    { regex: /(YOSHI|Yoshi|YoShi|yoshi)/gi, url: 'https://qu.ax/ZgKT.mp3' },
    { regex: /(Verdad que te engañe|verdad que te engañe|verdad que|Verdad que)/gi, url: 'https://qu.ax/yTid.mp3' },
    { regex: /(vivan|vivan los novios|vivanlosnovios)/gi, url: 'https://qu.ax/vHX.mp3' },
    { regex: /(Yamete|yamete|Yamete kudasai|yamete kudasai)/gi, url: 'https://qu.ax/thgS.mp3' },
    { regex: /(Usted esta detenido|usted esta detenido|usted está detenido|Usted está detenido)/gi, url: 'https://qu.ax/UWqX.mp3' },
    { regex: /(una pregunta|pregunton|preguntona)/gi, url: 'https://qu.ax/NHOM.mp3' },
    { regex: /(oye|🐔|Chiste)/gi, url: 'https://qu.ax/MSiQ.mp3' },
    { regex: /(gaspi y la minita|Gaspi y la mina|ig del la minita)/gi, url: 'https://qu.ax/wYil.mp3' },
    { regex: /(gaspi frase|frase)/gi, url: 'https://qu.ax/gNwU.mp3' },
    { regex: /(se pubrio|se que re pubrio)/gi, url: 'https://qu.ax/keKg.mp3' },
    { regex: /(goo|temazo|fuaa temon)/gi, url: 'https://qu.ax/SWYV.mp3' },
    { regex: /(:V|:v|v:)/gi, url: 'https://qu.ax/cxDg.mp3' },
    { regex: /(freefire|freefire)/gi, url: 'https://qu.ax/Dwqp.mp3' },
    { regex: /(Aguanta|aguanta)/gi, url: 'https://qu.ax/Qmz.mp3' },
    { regex: /(es viernes|Es viernes)/gi, url: 'https://qu.ax/LcdD.mp3' },
    { regex: /(feriado|feriado de que)/gi, url: 'https://qu.ax/mFCT.mp3' },
    { regex: /(Delevery|delivery|espanadas)/gi, url: 'https://qu.ax/WGzN.mp3' },
    { regex: /(putos|tarado|tarado eh|tarado)/gi, url: 'https://qu.ax/CoOd.mp3' },
    { regex: /(donde esta?|donde esta)/gi, url: 'https://qu.ax/kCWg.mp3' },
    { regex: /(Q onda|que onda|🤪)/gi, url: 'https://qu.ax/YpsR.mp3' },
    { regex: /(bebesita|bot canta)/gi, url: 'https://qu.ax/Ouwp.mp3' },    
      { regex: /(tka|tka)/gi, url: 'https://qu.ax/jakw.mp3' },
    { regex: /(takataka|bot cantar)/gi, url: 'https://qu.ax/rxvq.mp3' },
    { regex: /(Hey|Hei|hey|HEY)/gi, url: 'https://qu.ax/AaBt.mp3' },
    { regex: /(Joder|joder)/gi, url: 'https://qu.ax/lSgD.mp3' },
    { regex: /(:c|c:|:c)/gi, url: 'https://qu.ax/XMHj.mp3' },
    { regex: /(siu|siiuu|ssiiuu|siuuu|siiuuu|siiiuuuu|siuuuu|siiiiuuuuu|siu|SIIIIUUU)/gi, url: 'https://qu.ax/bfC.mp3' },
    { regex: /(Sus|sus|Amongos|among us|Among us|Among)/gi, url: 'https://qu.ax/Mnrz.mp3' },
    { regex: /(te amo|teamo)/gi, url: 'https://qu.ax/rGdn.mp3' },
    { regex: /(Estoy triste|ESTOY TRISTE|estoy triste|Triste|TRISTE|triste|Troste|TROSTE|troste|Truste|TRUSTE|truste)/gi, url: 'https://qu.ax/QSyP.mp3' },
    { regex: /(un Pato| un pato|un pato que va caminando alegremente|Un pato|Un Pato)/gi, url: 'https://qu.ax/pmOm.mp3' },
    { regex: /(UwU|uwu|Uwu|uwU|UWU)/gi, url: 'https://qu.ax/lOCR.mp3' },
    { regex: /(fiesta viernes|viernes|Viernes|viernes fiesta)/gi, url: 'https://qu.ax/wqXs.mp3' },
    { regex: /(WTF|wtf|Wtf|wataf|watafac|watafack)/gi, url: 'https://qu.ax/aPtM.mp3' },
    { regex: /(Yokese|yokese|YOKESE)/gi, url: 'https://qu.ax/PWgf.mp3' },
    { regex: /(Bruno|bruno)/gi, url: 'https://qu.ax/frSi.mp3' },
    { regex: /(vetealavrg|vete a la vrg|vete a la verga)/gi, url: 'https://qu.ax/pXts.mp3' }  
];

let matchedAudio = audioMap.find(audio => audio.regex.test(m.text));

if (matchedAudio) {
try {
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: matchedAudio.url }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })
} catch (e) {
console.error(e);
} finally {
}}

return !0 }
export default handler

/*
//CREDITOS PARA >> https://github.com/BrunoSobrino
let handler = m => m
handler.all = async function (m) {
let chat = global.db.data.chats[m.chat]
if (chat.isBanned) return
global.db.data.users[m.sender].money += 50
global.db.data.users[m.sender].exp += 50  
    
if (/^A Bueno master|Bueno master|Bueno Máster|🫂$/i.test(m.text) && chat.audios) {  
if (!db.data.chats[m.chat].audios && m.isGroup) throw 0    
let vn = 'https://qu.ax/xynz.mp3'
conn.sendPresenceUpdate('recording', m.chat)       
conn.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (/^Chupame|Pingo|Qliao$/i.test(m.text) && chat.audios) {  
if (!db.data.chats[m.chat].audios && m.isGroup) throw 0    
let vn = 'https://qu.ax/SCpi.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}  

if (/^ara ara$/i.test(m.text) && chat.audios) {  
let vn = 'https://qu.ax/PPgt.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })} 

if (chat.audios && m.text.match(/(bienveni|🥳|🤗)/gi)) {
//let vn = './media/Bienvenido.mp3'
let vn = 'https://qu.ax/cUYg.mp3'
this.sendPresenceUpdate('recording', m.chat)   
conn.sendMessage(m.chat, { audio: { url: vn }, contextInfo: { "externalAdReply": { "title": wm, "body": `🐈`, "previewType": "PHOTO", "thumbnailUrl": null,"thumbnail": imagen1, "sourceUrl": md, "showAdAttribution": true}}, ptt: true, mimetype: 'audio/mpeg', fileName: `error.mp3` }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Blackpink in your area|blackpink in your area|in your area|In your area)/gi)) {    
let vn = 'https://qu.ax/pavq.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Buen día grupo|Buen dia grupo)/gi)) {    
let vn = 'https://qu.ax/GoKq.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Calla Fan de bts|bts|Amo a bts)/gi)) {
let vn = 'https://qu.ax/oqNf.mp3'
let sticker = 'https://qu.ax/rfHP.webp'
this.sendPresenceUpdate('recording', m.chat)
let or = ['audio', 'sticker'];
let media = or[Math.floor(Math.random() * 2)]
if (media === 'audio') await this.sendFile(m.chat, vn, 'error.mp3', null, m, true, {type: 'audioMessage', ptt: true });
if (media === 'sticker') await conn.sendFile(m.chat, sticker, 'error.webp', '', m);
}
    
if (chat.audios && m.text.match(/(Cambiate a Movistar|cambiate a Movistar|cambiate a movistar|Cambiate a movistar|movistar)/gi)) {    
let vn = 'https://qu.ax/RxJC.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Corte Corte|corte|pelea|pelear|golpear|golpea)/gi)) {    
let vn = 'https://qu.ax/hRuU.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(El Toxico|El tóxico|Toxico|tóxico|malo|mala|estupido|estupida)/gi)) {    
let vn = 'https://qu.ax/WzBd.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Elmo sabe donde vives|Elmo sabe dónde vives|elmo|vives|de donde eres|eres de|sabes)/gi)) {    
let vn = 'https://qu.ax/YsLt.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(En caso de una investigación|En caso de una investigacion|fbi|cia|nasa|detective|👤|🕵️‍|♀️🕵️‍♂️)/gi)) {    
let vn = 'https://qu.ax/Syg.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Eres Fuerte|god|🤜|🤛|🦾|👊)/gi)) {    
let vn = 'https://qu.ax/lhzq.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Zzzz|zzz|😴|💩|👽)/gi)) {    
let vn = 'https://qu.ax/KkSZ.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Las reglas del grupo|lee|leíste|leiste)/gi)) {    
let vn = 'https://qu.ax/fwek.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Me anda buscando anonymous|me anda buscando anonymous|Me está buscando anonymous|me está buscando anonymous|Me está buscando anonimo|Me esta buscando anonimo|anonimus|anónimo)/gi)) {    
let vn = 'https://qu.ax/MWJz.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Momento equisde|momento equisde|Momento|fuera|🤘|👄|🕴️|💃|🕺)/gi)) {    
let vn = 'https://qu.ax/PitP.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Motivacion|Motivación|☘️)/gi)) {    
let vn = 'https://qu.ax/MXnK.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Muchachos|⛈️|🌩️|🌦️|🌤️|🌪️|escucharon)/gi)) {    
let vn = 'https://qu.ax/dRVb.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Nico Nico|🐄|🐖|🐬|🐼|🐰|🐇|🦦|🐋)/gi)) {    
let vn = 'https://qu.ax/OUyB.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(No Rompas más|No Rompas mas|💔|😖|😣)/gi)) {    
let vn = 'https://qu.ax/ZkAp.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Porque ta tite|Por qué ta tite|😕|😟)/gi)) {    
let vn = 'https://qu.ax/VrjA.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Potaxio|Potasio|🥑)/gi)) {    
let vn = 'https://qu.ax/vPoj.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Que tal Grupo|qué tal grupo|grupos)/gi)) {    
let vn = 'https://qu.ax/lirF.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Se están riendo de mí|Se estan riendo de mi|Se esta riendo de mi|Se está riendo de mi|se estan)/gi)) {    
let vn = 'https://qu.ax/XBXo.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Su nivel de pendejo|pendeja|pendejo|idiota|tonto|tonta|🙄)/gi)) {    
let vn = 'https://qu.ax/SUHo.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(tal vez|puede ser|posible|🧘‍|♀️🧘|🍦|🍡|🌮|🎩)/gi)) {    
let vn = 'https://qu.ax/QMjH.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Te gusta el Pepino|🥒|🍆|nepe)/gi)) {    
let vn = 'https://qu.ax/ddrn.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Todo bien|😇|😄|🏂|⛷️|🏋️‍|♂️🏋️‍|♀️🤹‍|♀️🤹‍|♂️👌)/gi)) {    
let vn = 'https://qu.ax/EDUC.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Traigan le una falda|Traiganle una falda|Nina|niña|niño)/gi)) {    
let vn = 'https://qu.ax/fnTL.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Y este quien es|Y este quien poronga es|Y este quien porongas es|vida)/gi)) { 
let vn = 'https://qu.ax/QnET.mp3'
let randow = 'https://qu.ax/yHJn.webp'
this.sendPresenceUpdate('recording', m.chat)
let or = ['audio', 'sticker'];
let media = or[Math.floor(Math.random() * 2)]
if (media === 'audio') await this.sendFile(m.chat, vn, 'error.mp3', null, m, true, {type: 'audioMessage', ptt: true });
if (media === 'sticker') await conn.sendFile(m.chat, randow, 'error.webp', '', m)}
    
if (chat.audios && m.text.match(/(Goku pervertido|pervertido|pervertida|goku|antojen|antogen|😈|👿|👉👌|👌👈)/gi)) {    
let vn = 'https://qu.ax/CUmZ.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}    
    
if (chat.audios && m.text.match(/(abduzcan|Abduzcan|adbuzcan|Adbuzcan)/gi)) {    
let vn = './media/abduzcan.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(TENGO LOS CALZONES|Tengo los calzones|tengo los calzones|🥶|😨|calzones)/gi)) {    
let vn = 'https://qu.ax/pzRp.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(anadieleimporta|a nadie le importa|y que|no importa|literal)/gi)) {    
let vn = 'https://qu.ax/JocM.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(miarda de bot|mierda de bot|mearda de bot|Miarda de Bot|Mierda de Bot|Mearda de Bot|bot puto|Bot puto|Bot CTM|Bot ctm|bot CTM|bot ctm|bot pendejo|Bot pendejo|bot de mierda)/gi)) {    
let vn = 'https://qu.ax/UEZQ.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}    
    
if (chat.audios && m.text.match(/(baneado|Baneado|baneada)/gi)) {    
let vn = 'https://qu.ax/SJJt.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Cada|Basado|Basada|Basadisimo|BASADO|basado|basada|Que basado|Que basada|que basado)/gi)) {    
let vn = 'https://qu.ax/jDAl.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Bien pensado woody|bien pensado woody|Bien pensado|bien pensado|Bien pensado wudy|bien pensado wudy|Bien pensado Woody|bien pensado Woody|Bien pensado woodi|bien pensado woodi)/gi)) {    
let vn = 'https://qu.ax/nvxb.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(bañate|Bañat)/gi)) {    
let vn = 'https://qu.ax/JsYa.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(buenas noches|Buenas noches|Boanoite|boanoite)/gi)) {    
let vn = 'https://qu.ax/TTfs.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Bueno si|bueno si|bueno sí|Bueno sí)/gi)) {    
let vn = 'https://qu.ax/DqBM.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(buenos dias|Buenos dias|buenos días|Buenos días)/gi)) {    
let vn = 'https://qu.ax/wLUF.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Me olvide|ME OLVIDE|me olvide|Me olvidé|me olvidé|lgante)/gi)) {    
let vn = 'https://qu.ax/SbX.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(giagnosticadocongay|diagnosticado con gay|diagnosticado gay|te diagnóstico con gay|diagnóstico gay|te diagnostico con gay|te diagnóstico con gay|te diagnosticó con gay|te diagnostico con gay)/gi)) {    
let vn = 'https://qu.ax/cUl.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(El pepe|el pepe|El Pepe|el Pepe)/gi)) {    
let vn = 'https://qu.ax/Efdb.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(el rap de fernanfloo|grap|trap)/gi)) {    
let vn = 'https://qu.ax/Vved.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Enojado|ENOJADO|enojado|Molesto|Enojada|ENOJADA|enojada|Molesta|🤬|😡|😠|😤)/gi)) {    
let vn = 'https://qu.ax/jqTX.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(ENTRADA|entrada|Entrada|Entra|ENTRA|Entra|Ingresa|ingresa|INGRESA|ingresar|INGRESAR|Ingresar)/gi)) {    
let vn = 'https://qu.ax/UpAC.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Esto va ser épico papus|esto va ser épico papus|Esto va ser|Esto va a hacer|esto va acer|Esto va aser|esto va ser|esto va a hacer)/gi)) {    
let vn = 'https://qu.ax/pjTx.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Esto va para ti|esto va para ti)/gi)) {    
let vn = 'https://qu.ax/Tabl.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(feliz cumpleaños|felizcumpleaños|happy birthday)/gi)) {    
let vn = 'https://qu.ax/UtmZ.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(fiesta del admin2|fiesta del admin 2|fiestadeladmin2|fiesta del administrador)/gi)) {    
let vn = 'https://qu.ax/MpnG.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Fiesta del admin|fiesta del admin)/gi)) {    
let vn = 'https://qu.ax/jDVi.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(fiesta del admin 3|atención grupo|atencion grupo|aviso importante|fiestadeladmin3|fiesta en casa)/gi)) {    
let vn = 'https://qu.ax/fRz.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Fino señores|fino señores|Fino senores|fino senores|Fino🧐|🧐🍷|🧐🍷|🐍|🙉|🙈)/gi)) {    
let vn = 'https://qu.ax/hapR.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Me voy|me voy|ME VOY|Me fui|me fui|ME FUI|Se fue|se fue|SE FUE|Adios|adios|ADIOS|Chao|chao|CHAO)/gi)) {    
let vn = 'https://qu.ax/iOky.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(tunometecabrasaramambiche|tunometecabrasaramanbiche|tunometecabrasarananbiche|tunometecabrasaranambiche)/gi)) {    
let vn = 'https://qu.ax/LAAB.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(gemidos|gemime|gime|gemime|gemi2)/gi)) {    
let vn = 'https://qu.ax/bwPL.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(audio hentai|Audio hentai|audiohentai|Audiohentai)/gi)) {    
let vn = 'https://qu.ax/GSUY.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(hola|ola|hi|hello)/gi)) {    
let vn = 'https://qu.ax/eGdW.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Homero chino|homero chino|Omero chino|omero chino|Homero Chino)/gi)) {    
let vn = 'https://qu.ax/ebe.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(sexo|Sexo|Hora de sexo|hora de sexo)/gi)) {    
let vn = 'https://qu.ax/Mlfu.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Jesucristo|jesucristo|Jesús|jesús|Auronplay|Auron|Dios)/gi)) {    
let vn = 'https://qu.ax/AWdx.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(La voz de hombre|la voz de hombre|La voz del hombre|la voz del hombre|La voz|la voz|🥸|👨|👩|🤦‍|♂️🤦‍|♀️🤷‍♂️|🤷‍♀️)/gi)) {    
let vn = './media/la-voz-de-hombre.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(laoracion|La biblia|La oración|La biblia|La oración|la biblia|La Biblia|oremos|recemos|rezemos|🙏)/gi)) {    
let vn = 'https://qu.ax/GeeA.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Marica tu|cancion1|Marica quien|maricon|bando)/gi)) {    
let vn = 'https://qu.ax/XULE.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(MA MA MASIVO|ma ma masivo|Ma ma masivo|Bv|BV|bv|masivo|Masivo|MASIVO)/gi)) {    
let vn = 'https://qu.ax/mNX.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(ho me vengo|oh me vengo|o me vengo|Ho me vengo|Oh me vengo|O me vengo)/gi)) {    
let vn = 'https://qu.ax/waHR.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Me pica los cocos|ME PICA |me pica|Me pican los cocos|ME PICAN)/gi)) {    
let vn = 'https://qu.ax/UrNl.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(mmm|Mmm|MmM)/gi)) {    
let vn = 'https://qu.ax/gxFs.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Moshi moshi|Shinobu|mundo)/gi)) {    
let vn = 'https://qu.ax/JAyd.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(nadie te pregunto|Nadie te pregunto|Nadie te preguntó|nadie te preguntó)/gi)) {    
let vn = 'https://qu.ax/MrGg.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Feliz navidad|feliz navidad|Merry Christmas|merry chritmas)/gi)) {    
let vn = 'https://qu.ax/XYyY.m4a'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(niconico|NICONICO|Niconico|niconiconi|Niconiconi|NICONICONI)/gi)) {    
let vn = 'https://qu.ax/YdVq.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(No chupa la|No chupala|no chupala|No chu|no chu|No, chupala|No, chupa la)/gi)) {    
let vn = 'https://qu.ax/iCRk.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(No me hables|no me hables)/gi)) {    
let vn = 'https://qu.ax/xxtz.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(no me hagas usar esto|No me hagas usar esto|No me agas usar esto)/gi)) {    
let vn = 'https://qu.ax/bzDa.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(NO DIGAS ESO PAPU|no digas eso papu|No gigas eso papu|NO PAPU|No papu|NO papu|no papu)/gi)) {    
let vn = 'https://qu.ax/jsb.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(noche de paz|Noche de paz|Noche de amor|noche de amor|Noche de Paz|🌚|🌕|🌖|🌗|🌘|🌑|🌒|🌓|🌔|🌙|🪐)/gi)) {    
let vn = 'https://qu.ax/SgrV.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Nyapasu|Nyanpasu|nyapasu|Nyapasu|Gambure|Yabure|🐨|🐣|🐥|🦄|🤙)/gi)) {    
let vn = 'https://qu.ax/ZgFZ.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Ohayo|ohayo|Ojayo|ojayo|Ohallo|ohallo|Ojallo|ojallo|🏮|🎎|⛩️|🐲|🐉|🌸|🍙|🍘)/gi)) {    
let vn = 'https://qu.ax/PFxn.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(OMAIGA|OMG|omg|omaiga|Omg|Omaiga|OMAIGA)/gi)) {    
let vn = 'https://qu.ax/PfuN.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(oni-chan|onichan|o-onichan)/gi)) {    
let vn = 'https://qu.ax/sEFj.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(orale|Orale)/gi)) {    
let vn = 'https://qu.ax/Epen.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Pasa pack|vendes tu nudes|pasa video hot|pasa tu pack|pasa fotos hot|vendes tu pack|Vendes tu pack|Vendes tu pack?|vendes tu pack|Pasa Pack Bot|pasa pack Bot|pasa tu pack Bot|Pásame tus fotos desnudas|pásame tu pack|me pasas tu pak|me pasas tu pack|pasa pack)/gi)) {    
let vn = 'https://qu.ax/KjHR.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Contexto|CONTEXTO|contexto|Pasen contexto|PASEN CONTEXTO|pasen contexto|Y el contexto|Y EL CONTEXTO|y el contexto)/gi)) {    
let vn = 'https://qu.ax/YBzh.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Pero esto|pero esto|Pero esto ya es otro nivel|pero esto ya es otro nivel|Otro nivel|otro nivel)/gi)) {    
let vn = 'https://qu.ax/javz.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(PIKA|pica|Pica|Pikachu|pikachu|PIKACHU|picachu|Picachu)/gi)) {    
let vn = 'https://qu.ax/wbAf.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Pokemon|pokemon|Pokémon|pokémon)/gi)) {    
let vn = 'https://qu.ax/kWLh.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Quién es tu senpai botsito 7u7|Quien es tu senpai botsito 7u7|Quién es tu sempai botsito 7u7|Quien es tu sempai botsito 7u7|Quién es tu senpai botsito 7w7|Quien es tu senpai botsito 7w7|quién es tu senpai botsito 7u7|quien es tu senpai botsito 7u7|Quién es tu sempai botsito 7w7|Quien es tu sempai botsito 7w7|Quién es tu senpai botsito|Quien es tu senpai botsito|Quién es tu sempai botsito|Quien es tu sempai botsito|Quién es tu senpai botsito|Quien es tu senpai botsito|quién es tu senpai botsito|quien es tu senpai botsito|Quién es tu sempai botsito|Quien es tu sempai botsito)/gi)) {    
let vn = 'https://qu.ax/uyqQ.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(rawr|Rawr|RAWR|raawwr|rraawr|rawwr)/gi)) {    
let vn = 'https://qu.ax/YnoG.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(hablame|Habla me|Hablame|habla me|Háblame|háblame)/gi)) {    
let vn = 'https://qu.ax/uQqA.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Cagaste|Miedo|miedo|Pvp|PVP|temor|que pasa|Que sucede|Que pasa|que sucede|Qué pasa|Qué sucede|Dime|dime)/gi)) {    
let vn = 'https://qu.ax/FAVP.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(YOSHI|Yoshi|YoShi|yoshi)/gi)) {    
let vn = 'https://qu.ax/ZgKT.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Verdad que te engañe|verdad que te engañe|verdad que|Verdad que)/gi)) {    
let vn = 'https://qu.ax/yTid.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(vivan|vivan los novios|vivanlosnovios)/gi)) {    
let vn = 'https://qu.ax/vHX.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Yamete|yamete|Yamete kudasai|yamete kudasai)/gi)) {    
let vn = 'https://qu.ax/thgS.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(Usted esta detenido|usted esta detenido|usted está detenido|Usted está detenido)/gi)) {    
let vn = 'https://qu.ax/UWqX.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(una pregunta|pregunton|preguntona)/gi)) {    
let vn = 'https://qu.ax/NHOM.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(oye|🐔|Chiste)/gi)) {    
let vn = 'https://qu.ax/MSiQ.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(gaspi y la minita|Gaspi y la mina|ig del la minita)/gi)) {
let vn = 'https://qu.ax/wYil.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(gaspi frase|frase)/gi)) {
let vn = 'https://qu.ax/gNwU.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(se pubrio|se que re pubrio)/gi)) {
let vn = 'https://qu.ax/keKg.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(goo|temazo|fuaa temon)/gi)) {
let vn = 'https://qu.ax/SWYV.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(:V|:v|v:)/gi)) {
let vn = 'https://qu.ax/cxDg.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(freefire|freefire)/gi)) {
let vn = 'https://qu.ax/Dwqp.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(Aguanta|aguanta)/gi)) {
let vn = 'https://qu.ax/Qmz.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(es viernes|Es viernes)/gi)) {
let vn = 'https://qu.ax/LcdD.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(feriado|feriado de que)/gi)) {
let vn = 'https://qu.ax/mFCT.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(Delevery|delivery|espanadas)/gi)) {
let vn = 'https://qu.ax/WGzN.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(putos|tarado|tarado eh|tarado)/gi)) {
let vn = 'https://qu.ax/CoOd.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(donde esta?|donde esta)/gi)) {
let vn = 'https://qu.ax/kCWg.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(Q onda|que onda|🤪)/gi)) {
let vn = 'https://qu.ax/YpsR.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(bebesita|bot canta)/gi)) {
let vn = 'https://qu.ax/Ouwp.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(tka|tka)/gi)) {
let vn = 'https://qu.ax/jakw.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(takataka|bot cantar)/gi)) {
let vn = 'https://qu.ax/rxvq.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(Hey|Hei|hey|HEY)/gi)) {
let vn = 'https://qu.ax/AaBt.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(Joder|joder)/gi)) {
let vn = 'https://qu.ax/lSgD.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(:c|c:|:c)/gi)) {
let vn = 'https://qu.ax/XMHj.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(siu|siiuu|ssiiuu|siuuu|siiuuu|siiiuuuu|siuuuu|siiiiuuuuu|siu|SIIIIUUU)/gi)) {
let vn = 'https://qu.ax/bfC.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(Sus|sus|Amongos|among us|Among us|Among)/gi)) {
let vn = 'https://qu.ax/Mnrz.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(te amo|teamo)/gi)) {
let vn = 'https://qu.ax/rGdn.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(Estoy triste|ESTOY TRISTE|estoy triste|Triste|TRISTE|triste|Troste|TROSTE|troste|Truste|TRUSTE|truste)/gi)) {
let vn = 'https://qu.ax/QSyP.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(un Pato| un pato|un pato que va caminando alegremente|Un pato|Un Pato)/gi)) {
let vn = 'https://qu.ax/pmOm.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(UwU|uwu|Uwu|uwU|UWU)/gi)) {
let vn = 'https://qu.ax/lOCR.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(fiesta viernes|viernes|Viernes|viernes fiesta)/gi)) {
let vn = 'https://qu.ax/wqXs.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(WTF|wtf|Wtf|wataf|watafac|watafack)/gi)) {
let vn = 'https://qu.ax/aPtM.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(Yokese|yokese|YOKESE)/gi)) {
let vn = 'https://qu.ax/PWgf.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}

if (chat.audios && m.text.match(/(Bruno|bruno)/gi)) {
let vn = 'https://qu.ax/frSi.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })}
    
if (chat.audios && m.text.match(/(vetealavrg|vete a la vrg|vete a la verga)/gi)) {    
let vn = 'https://qu.ax/pXts.mp3'
this.sendPresenceUpdate('recording', m.chat)   
this.sendMessage(m.chat, { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mp4', ptt: true }, { quoted: m })} 
   
return !0 }
export default handler
*/
