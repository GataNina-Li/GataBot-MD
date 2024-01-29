let handler = async (m, { command, usedPrefix, conn, text }) => {
let fantasy = `
*¡Bienvenido a la fascinante bitácora de Fantasy!*

_Aquí, te proporcionaré información esencial para que te conviertas en un maestro en el emocionante mundo de los usuarios *Fantasy* en *GataBot*._

*¿Qué es Fantasy RPG?*
_Se trata de una experiencia dinámica que te permite adquirir personajes mediante su compra._

👇 *Continúa bajando para saber: Clases de Imágenes*
${String.fromCharCode(8206).repeat(850)}
*Clases de Imágenes:*

*Común:* Imágenes sencillas pero fácilmente accesibles.
\`\`\`% de encontrarla: 100%\`\`\`
\`\`\`Costo: 100 - 200\`\`\`

*Poco Común:* Imágenes únicas y novedosas, con un costo igualmente accesible.
\`\`\`% de encontrarla: 90%\`\`\`
\`\`\`Costo: 300 - 500\`\`\`

*Raro:* Imágenes de calidad excepcional, poco frecuentes y aclamadas.
\`\`\`% de encontrarla: 75%\`\`\`
\`\`\`Costo: 600 - 700\`\`\`

*Épico:* Imágenes a veces presentadas en excelentes condiciones y realmente sorprendentes.
\`\`\`% de encontrarla: 80%\`\`\`
\`\`\`Costo: 800 - 1500\`\`\`

*Legendario:* Contiene la posibilidad de obtener tu personaje favorito.
\`\`\`% de encontrarla: 50%\`\`\`
\`\`\`Costo: 1600 - 3000\`\`\`

*Sagrado:* Un rango bendecido por los dioses, ofrece bonificaciones excepcionales al cambiarlo.
\`\`\`% de encontrarla: 40%\`\`\`
\`\`\`Costo: 3100 - 9999\`\`\`

*Supremo:* Aparece raramente, con bonificaciones notables y una calidad increíble.
\`\`\`% de encontrarla: 20%\`\`\`
\`\`\`Costo: 10000 - 30000\`\`\`

*Transcendental:* Lo más exclusivo y especial se encuentra en este rango.
\`\`\`% de encontrarla: 10%\`\`\`
\`\`\`Costo: +30000\`\`\`
`.trim()

let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
await conn.sendFile(m.chat, 'https://i.imgur.com/yfokwvx.jpg', 'error.jpg', fantasy, fkontak, true, {
contextInfo: {
'forwardingScore': 200,
'isForwarded': false,
externalAdReply: {
showAdAttribution: false,
title: `FANTASÍA RPG`,
body: `Una aventura nos espera...`,
mediaType: 1,
sourceUrl: accountsgb.getRandom(),
thumbnailUrl: 'https://i.imgur.com/vIH5SKp.jpg'
}}})   
}

handler.command = /^(fantasyinfo|fyinfo)$/i
export default handler
