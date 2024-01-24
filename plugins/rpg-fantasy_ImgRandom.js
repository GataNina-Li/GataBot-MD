import fetch from 'node-fetch'

let handler = async (m, { command, usedPrefix, conn }) => {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender

  
const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
try {
const response = await fetch(jsonURL)
const data = await response.json()

if (data.imagenesReclamadas && data.imagenesReclamadas.length > 0) {
const dato = data.imagenesReclamadas[Math.floor(Math.random() * data.imagenesReclamadas.length)]
let pp = await conn.profilePictureUrl(who, 'image').catch((_) => dato.urlImagen)
//let fakeIMG = { contextInfo: { externalAdReply: { title: `${conn.getName(m.sender)}`, body: `${dato.descripcion}`, sourceUrl: redesMenu.getRandom(), thumbnailUrl: dato.urlImagen }}}
let info = `*Nombre:* ${dato.nombre}
*Origen:* ${dato.descripcion}
*Costo:* $${dato.costo}
*Estado:* Libre
*Clase:* ${dato.clase}
*ID:* \`\`\`${dato.codigoImagen}\`\`\``
let fkontak = {
  "key": {
    "participants": "0@s.whatsapp.net",
    "remoteJid": "status@broadcast",
    "fromMe": false,
    "id": "Halo"
  },
  "message": {
    "contactMessage": {
      "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
      "jpegThumbnail": "https://i.imgur.com/IXlUwTW.jpg"
    }
  },
  "participant": "0@s.whatsapp.net"
};

//let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let fkontak = {
  "key": {
    "participants": "0@s.whatsapp.net",
    "remoteJid": "status@broadcast",
    "fromMe": false,
    "id": "Halo"
  },
  "message": {
    "contactMessage": {
      "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
      "thumbnailUrl": "https://i.imgur.com/IXlUwTW.jpg"  // Reemplazar con el enlace JPG directo
    }
  },
  "participant": "0@s.whatsapp.net"
};

  conn.sendFile(m.chat, dato.urlImagen, 'error.jpg', info, fkontak, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: `${conn.getName(m.sender)}`, body: `${dato.descripcion}`, mediaType: 1, sourceUrl: accountsgb.getRandom(), thumbnailUrl: pp}}})
} else {
console.error('El JSON no contiene imágenes reclamadas.')
conn.sendMessage(m.chat, 'Error al obtener o procesar los datos.', { quoted: m })
}} catch (error) {
console.error('Error al obtener o procesar los datos: ', error)
conn.sendMessage(m.chat, 'Error al procesar la solicitud.', { quoted: m })
}}

handler.command = /^(fantasy|fy)$/i;
export default handler;

