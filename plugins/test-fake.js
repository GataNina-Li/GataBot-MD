let handler = async (m, { conn, text, usedPrefix, command }) => {

let text = 'Texto'
let titulo = 'Titulo texto'
let canal = 'Canal'
let id = '120363160031023229@newsletter'
let titulo_cita = 'Cita Titulo'
let text_cita = 'Cita Texto'
let img_cita = 'https://qu.ax/TPVV.jpg'

await conn.sendMessage(m.chat, { text: text, 
contextInfo: { 
  forwardingScore: 999, 
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
}}}, { quoted: fkontak })

}
handler.command = /^(fake10)$/i
export default handler
