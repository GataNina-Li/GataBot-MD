//ESTOS DISEÑOS PARA MENSAJES SON COMPATIBLES CON GATABOT, SIN EMBARGO ALGUNOS NO SE VEN EN LA VERSIÓN DE WHATSAPP WEB
//PERO EN EL CELULAR SI SE NOTA TODOS, PUEDES USAR EL QUE QUIERAS 😼
//import { generateWAMessageFromContent } from "@adiwajshing/baileys"
let generateWAMessageFromContent = (await import(global.baileys)).default
import fs from 'fs'
import fetch from 'node-fetch'
import moment from 'moment-timezone' 

let handler = async (m, { conn, args }) => {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? this.user.jid : m.sender
let name = await conn.getName(who)
let fsizedoc = '1'.repeat(10)
let a = ['AED','AFN','ALL','AMD','ANG','AOA','ARS','AUD','AWG','AZN','BAM','BBD','BDT','BGN','BHD','BIF','BMD','BND','BOB','BOV','BRL','BSD','BTN','BWP','BYR','BZD','CAD','CDF','CHE','CHF','CHW','CLF','CLP','CNY','COP','COU','CRC','CUC','CUP','CVE','CZK','DJF','DKK','DOP','DZD','EGP','ERN','ETB','EUR','FJD','FKP','GBP','GEL','GHS','GIP','GMD','GNF','GTQ','GYD','HKD','HNL','HRK','HTG','HUF','IDR','ILS','INR','IQD','IRR','ISK','JMD','JOD','JPY','KES','KGS','KHR','KMF','KPW','KRW','KWD','KYD','KZT','LAK','LBP','LKR','LRD','LSL','LTL','LVL','LYD','MAD','MDL','MGA','MKD','MMK','MNT','MOP','MRO','MUR','MVR','MWK','MXN','MXV','MYR','MZN','NAD','NGN','NIO','NOK','NPR','NZD','OMR','PAB','PEN','PGK','PHP','PKR','PLN','PYG','QAR','RON','RSD','RUB','RWF','SAR','SBD','SCR','SDG','SEK','SGD','SHP','SLL','SOS','SRD','SSP','STD','SYP','SZL','THB','TJS','TMT','TND','TOP','TRY','TTD','TWD','TZS','UAH','UGX','USD','USN','USS','UYI','UYU','UZS','VEF','VND','VUV','WST','XAF','XAG','XAU','XBA','XBB','XBC','XBD','XCD','XDR','XFU','XOF','XPD','XPF','XPT','XTS','XXX','YER','ZAR','ZMW']
let b = a[Math.floor(Math.random() * a.length)]
//let ucapan = ucapan()
let sap = ['Hai', 'Ohayo', 'Kyaa', 'Halo', 'Nyann']
let sgh = md
let sgc = nnn
let gata = 'https://i.imgur.com/EXTbyyn.jpg'
//let logo = 'https://i.pinimg.com/564x/f7/d2/e4/f7d2e48fd59a8c01cd396bfc70b0a2d1.jpg'
let pp = await conn.profilePictureUrl(who).catch(_ => gata)
//pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || './src/grupos.jpg' 


//global.enlace = { contextInfo: { externalAdReply: {title: wm, body: 'support group' , sourceUrl: nna, thumbnail: await(await fetch(img)).buffer() }}}
//PARA ENLACE DE WHATSAPP	
	
//global.enlace2 = { contextInfo: { externalAdReply: { showAdAttribution: true, mediaUrl: yt, mediaType: 'VIDEO', description: '', title: wm, body: '😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁', thumbnailUrl: await(await fetch(img)).buffer(), sourceUrl: yt }}}
//PARA ENLACE DE YOUTUBE	
	
//global.fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
//VERIFICADO MAS IMAGEN DEL USUARIO
	
//global.fkontak2 = { key: { participant: '0@s.whatsapp.net' }, message: { contactMessage: { displayName: packname, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${author},;;;\nFN:${author},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD`, jpegThumbnail: fs.readFileSync('./media/menus/Menu1.jpg'), thumbnail: fs.readFileSync('./media/menus/Menu1.jpg'), sendEphemeral: true }}}
//CONTACTO CON MENSAJE PERSONALIZADO MAS FOTO DE USUARIO
	
//global.ftroli = { key: { participant: '0@s.whatsapp.net' }, message: { orderMessage: { itemCount: fsizedoc, status: 1, surface: 1, message: botdate, orderTitle: author, sellerJid: '0@s.whatsapp.net' }}}
//MENSAJE CON TEXTO Y VERIFICADO

//global.fvn = { key: { participant: '0@s.whatsapp.net' }, message: { audioMessage: { mimetype: 'audio/ogg; codecs=opus', seconds: fsizedoc, ptt: true }}}
//MENSAJE SIMULADOR DE AUDIO
	
//global.fvn2 = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "50499698072-1625305606@g.us" } : {}) }, message: { "audioMessage": { "mimetype":"audio/ogg; codecs=opus", "seconds": "99569", "ptt": "true"   }}}  
//SIMULADOR DE AUDIO ENVIADO 
	
//global.twa = {key: {participant: "0@s.whatsapp.net", "remoteJid": "0@s.whatsapp.net"}, "message": {"groupInviteMessage": {"groupJid": "51995386439-1616969743@g.us", "inviteCode": "m", "groupName": "P", "caption": wm, 'jpegThumbnail': fs.readFileSync('./media/menus/Menu3.jpg')}}}
//TEXTO PERSONALIZADO CON NOTIFICACION DE FOTO
	
//global.fdoc = {quoted:{key : {participant : '0@s.whatsapp.net'},message: {documentMessage: {title: wm}}}}
//MENSAJE TIPO DOCUMENTO
	
//global.frep = { contextInfo: { externalAdReply: {title: wm, body: author, sourceUrl: md, thumbnail: fs.readFileSync('./media/menus/Menu3.jpg')}}}
//MENSAJE CON TEXTO, IMAGEN Y ENLACE PERSONALIZADO	

/*conn.fakeReply(m.chat, `*Prueba*`, '0@s.whatsapp.net', wm)*/ 
//MENSAJE RESPONDIDO CON TEXTO PERSONALIZADO

 /*await conn.relayMessage(m.chat, { requestPaymentMessage: {
  noteMessage: { extendedTextMessage: { text: wm,
  currencyCodeIso4217: 'USD',
  requestFrom: '0@s.whatsapp.net',
  expiryTimestamp: 8600,
  amount: 10000,
  background: './media/menus/Menu3.jpg'
}}}}, {})*/ //MENSAJE DE PAGO

//let vid = 'https://blogscvc.cervantes.es/martes-neologico/wp-content/uploads/sites/2/2021/08/gif_350.gif'
//let vid = './media/menus/Menuvid1.mp4'
	
/*let adReply = { fileLength: fsizedoc, seconds: fsizedoc, contextInfo: { forwardingScore: fsizedoc, externalAdReply: { showAdAttribution: true, title: wm, body: '👋 ' + username, mediaUrl: ig, description: 'Hola', previewType: 'PHOTO', thumbnail: await(await fetch(gataMenu.getRandom())).buffer(), sourceUrl: redesMenu.getRandom() }}}	
let sipp = await conn.resize(pp, 150, 150)
let fakes = { key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' }, message: { documentMessage: { title: wm, jpegThumbnail: sipp}}}*/
//LA FUNCIÓN DE fakes Y adReply CREA UN DINÁMICO DE DOBLE DISEÑO PARA sendButton Y sendButtonVid

//conn.sendButtonVid(m.chat, vid, `*Texto1*`, wm, 'Boton', '.tomp3', 'Boton2', '.tomp3', 'Boton3', '.tomp3', fkontak, adReply)//, fakes, adReply)
//MENSAJE CON VÍDEO, BOTONES Y DISEÑO 
	
//let btn = [{ urlButton: { displayText: 'A', url: md }}, 
//{ quickReplyButton: { displayText: 'B', id: '#C' }}]
//conn.sendButtonGif(m.chat, text1, text2, { url: link1 }, btn, link2)
//MENSAJE SIMULADOR DE GIF CON BOTON DE ENLACE DE TEXTO Y BOTÓN DE COMANDO

//await conn.sendPayment(m.sender, '99999999', 'texto', m)
//MENSAJE DE PAGO PENDIENTE
		
}
handler.command = /^(fake)$/i
export default handler

function ucapan() {
  const time = moment.tz('America/Los_Angeles').format('HH')  //America/Los_Angeles  Asia/Jakarta   America/Toronto
  let res = "👋 *BIENVENIDO(A) | WELCOME* 👋"
  if (time >= 4) {
    res = "🌇 *Buenos Días | Good Morning* ⛅"
  }
  if (time >= 11) {
    res = "🏙️ *Buenas Tardes | Good Afternoon* 🌤️"
  }
  if (time >= 15) {
    res = "🌆 *Buenas tardes | Good Afternoon* 🌥️"
  }
  if (time >= 17) {
    res = "🌃 *Buenas noches | Good Evening* 💫"
  }
  return res
} 
