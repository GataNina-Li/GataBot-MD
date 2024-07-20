/*import fetch from "node-fetch"

let handler = async (m, { conn, usedPrefix, command, text }) => {
let query = text.trim()

  const sections = [{
    title: `${htki} LISTA ${htka}`,
    rows: [{
      header: 'wwww',
      title: "ADMFJ",
      description: 'yyyyyyy',
      id: ".MENU"
    }, {
      title: "ADJNF",
      id: ".MENU"
    }, {
      title: "DNFKV",
      id: ".MENU" 
    }, {
      title: "DHJNS",
      id: ".MENU"
    }, ]
  }, ]  

const listMessage = {
text: 'Texto',
footer: '┏- - - - -  INFO - - - - -\n┊ 🅟 = Premium\n┊ Ⓕ = Free\n┗•',
title: `❏––––[ *TEX* ]–––`,
buttonText: "- -- -",
sections
  }

async function getPinterestImages(query) {
let response = await fetch(`https://aemt.me/pinterest?query=${encodeURIComponent(query)}`)
let data = await response.json()
return data.result
}

async function getGoogleImages(query) {
let response = await fetch(`https://aemt.me/googleimage?query=${encodeURIComponent(query)}`)
let data = await response.json()
return data.result
}

async function sendPinterestCarousel(conn, chat, query, usedPrefix) {
let images = await getPinterestImages(query)
const messages = images.map((image) => [ null, null, 
image, 
[['u', usedPrefix + `pinterest ${query}`], ['Buscar con Google 🌐', usedPrefix + `image2 ${query}`]],
null, 
[['🔗 Enlace de imagen', image]], 
[['DDDDD', sections]]
])
await conn.sendCarousel(chat, '💗 *Resultados de Pinterest*', 'Imágenes', '✨ Imágenes de Pinterest', messages)
}

async function sendGoogleCarousel(conn, chat, query, usedPrefix) {
let images = await getGoogleImages(query);
const messages = images.map((image) => [ null, null, 
image, 
[['Buscar de nuevo 🔎', usedPrefix + `image2 ${query}`], ['Buscar con Pinterest ✨', usedPrefix + `pinterest ${query}`]], 
null, 
[['🔗 Enlace de imagen', image]], 
[]
])
await conn.sendCarousel(chat, '🤩 *Resultados de Google*', 'Imágenes', '✅ Imágenes de Google', messages)
}

if (!query) {
conn.reply(m.chat, '*Por favor, escribe lo que quieres buscar en Pinterest.*', m)
return
}

if (command === 'pinterest') {
await sendPinterestCarousel(conn, m.chat, query)
} else if (command === 'image2') {
await sendGoogleCarousel(conn, m.chat, query)
}
}

handler.command = /^(pinterest|image2)$/i
export default handler

*/

import { pinterest } from '@bochilteam/scraper'
let handler = async(m, { conn, text, usedPrefix, command }) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()} ${mid.smsMalused7}\n*${usedPrefix + command} gata | cat*` 
try {
const json = await pinterest(text)
conn.sendButton(m.chat, `💞 ${mid.buscador} ${text}`, `𝙋𝙞𝙣𝙩𝙚𝙧𝙚𝙨𝙩 | ${wm}`, json.getRandom(), [
['🔄 𝙎𝙞𝙜𝙪𝙞𝙚𝙣𝙩𝙚 | 𝙉𝙚𝙭𝙩', `${usedPrefix}pinterest ${text}`]], null, null, m)
//await conn.sendFile(m.chat, json.getRandom(), 'error.jpg', `${lenguajeGB['smsAvisoEG']()} 💞 ${mid.buscador}: ${text}`.trim(), m)
} catch (e) {
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
handler.money = false
}}
handler.help = ['pinterest <keyword>']
handler.tags = ['internet']
handler.command = /^(pinterest|dlpinterest|pinterestdl)$/i
handler.money = 50
export default handler

/*conn.sendHydrated(m.chat, `💞 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤 | 𝙍𝙚𝙨𝙪𝙡𝙩: ${text}`, `𝙋𝙞𝙣𝙩𝙚𝙧𝙚𝙨𝙩 | ${wm}`, null, md, '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', null, null, [
['🔄 𝙎𝙞𝙜𝙪𝙞𝙚𝙣𝙩𝙚 | 𝙉𝙚𝙭𝙩', `/pinterest ${text}`],
['🔍 𝙂𝙤𝙤𝙜𝙡𝙚 ', `#image ${text}`],
['🐈 𝙈𝙚𝙣𝙪', `.menu`],  
], m)*/
