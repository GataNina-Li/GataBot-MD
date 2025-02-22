let handler = async (m, { conn, text, usedPrefix, command }) => {

let text_ = 'Texto'
let img = 'https://qu.ax/Vmpl.jpg'
let titulo = 'Titulo texto'
let canal = 'Canal'
let id = '120363160031023229@newsletter'
let titulo_cita = 'Cita Titulo'
let text_cita = 'Cita Texto'
let img_cita = 'https://qu.ax/TPVV.jpg'
let titulo_fkontak = 'Gata Dios'

//let fkontak = { key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `6285600793871-1614953337@g.us` } : {}) }, message: { 'contactMessage': { 'displayName': `${titulo_fkontak}`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${titulo_fkontak},;;;\nFN:${titulo_fkontak},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': null, thumbnail: null,sendEphemeral: true}}}
//let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

/*await conn.sendMessage(m.chat, { image: { url: img }, caption: text_,
contextInfo: { 
  forwardingScore: 99, 
  isForwarded: true, 
forwardedNewsletterMessageInfo: { 
  newsletterName: canal, 
  newsletterJid: id }, 
externalAdReply: { 
  title: titulo_cita, 
  body: text_cita, 
  thumbnailUrl: img_cita, 
  sourceUrl: md, 
  mediaType: 1, 
  renderLargerThumbnail: false 
}}}, { quoted: m })*/

conn.sendMessage(m.chat, {
     text: text_,
     footer: titulo_cita,
     buttons: [ 
         { buttonId: '🚀',
          buttonText: {
              displayText: '🗿'
          }, type: 1 }
     ],
     headerType: 1,
     viewOnce: true
 },{ quoted: null })

}
handler.command = /^(fake10)$/i
export default handler

/*
// NO CONTIENE CRASH

let fkontak = { key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `6285600793871-1614953337@g.us` } : {}) }, message: { 'contactMessage': { 'displayName': `${titulo_fkontak}`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${titulo_fkontak},;;;\nFN:${titulo_fkontak},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': null, thumbnail: null,sendEphemeral: true}}}

await conn.sendMessage(m.chat, { image: { url: img }, caption: text_,
contextInfo: { 
  forwardingScore: 99, 
  isForwarded: true, 
forwardedNewsletterMessageInfo: { 
  newsletterName: canal, 
  newsletterJid: id }, 
externalAdReply: { 
  title: titulo_cita, 
  body: text_cita, 
  thumbnailUrl: img_cita, 
  sourceUrl: md, 
  mediaType: 1, 
  renderLargerThumbnail: true 
}}}, { quoted: fkontak }) */
