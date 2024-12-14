let handler = m => m
handler.all = async function (m) {
let chat = global.db.data.chats[m.chat];
if (m.isBot || m.sender.includes('bot') || m.sender.includes('Bot')) return true;
if (chat.isBanned) return
global.db.data.users[m.sender].money += 50
global.db.data.users[m.sender].exp += 50  
if (m.fromMe) return !0
if (!db.data.chats[m.chat].audios) return   

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
