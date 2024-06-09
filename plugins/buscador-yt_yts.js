/*

- Agradecimiento a GataBot Por aceptareme en el Staff ♥️🫰🏻

*/
import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from '@whiskeysockets/baileys'
import yts from 'yt-search';
import fs from 'fs';

const handler = async (m, { conn, text, usedPrefix: prefijo }) => {
    const datas = global;
    const device = await getDevice(m.key.id);
    
  if (!text) throw `⚠️ escriba el nombre de un video o canal de youtube\n\nwrite the name of a youtube video or channel`;
    
  if (device !== 'desktop' || device !== 'web') {      
    
  const results = await yts(text);
  const videos = results.videos.slice(0, 20);
  const randomIndex = Math.floor(Math.random() * videos.length);
  const randomVideo = videos[randomIndex];

  var messa = await prepareWAMessageMedia({ image: {url: randomVideo.thumbnail}}, { upload: conn.waUploadToServer })
  const interactiveMessage = {
    body: { text: `*—◉ Resultados obtenidos:* ${results.videos.length}\n*—◉ Video aleatorio:*\n*-› Title:* ${randomVideo.title}\n*-› Author:* ${randomVideo.author.name}\n*-› Views:* ${randomVideo.views}\n*-› Url:* ${randomVideo.url}\n*-› Imagen:* ${randomVideo.thumbnail}`.trim() },
    footer: { text: `${global.wm}`.trim() },  
      header: {
          title: `*< YouTube Search />*\n`,
          hasMediaAttachment: true,
          imageMessage: messa.imageMessage,
      },
    nativeFlowMessage: {
      buttons: [
        {
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: 'OPCIONES DISPONIBLES',
            sections: videos.map((video) => ({
              title: video.title,
              rows: [
                {
                  header: video.title,
                  title: video.author.name,
                  description: 'Descargar MP3',
                  id: `${prefijo}ytmp3 ${video.url}`
                },
                {
                  header: video.title,
                  title: video.author.name,
                  description: 'Descargar MP4',
                  id: `${prefijo}ytmp4 ${video.url}`
                }
              ]
            }))
          })
        }
      ],
      messageParamsJson: ''
    }
  };        
            
        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage,
                },
            },
        }, { userJid: conn.user.jid, quoted: m })
      conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id});

  } else {
  const results = await yts(text);
  const tes = results.all;
  const teks = results.all.map((v) => {
    switch (v.type) {
      case 'video': return `
° *_${v.title}_*
↳ 🫐 *_Url_* ${v.url}
↳ 🕒 *_Fecha_* ${v.timestamp}
↳ 📥 *_fecha_* ${v.ago}
↳ 👁 *_Vista_* ${v.views}`;
    }
  }).filter((v) => v).join('\n\n◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦\n\n');
  conn.sendFile(m.chat, tes[0].thumbnail, 'error.jpg', teks.trim(), m);      
  }    
};

handler.command = /^y(outubesearch|ts(earch)?)$/i
export default handler

/*import ytSearch from "yt-search"
const handler = async (m, { conn, usedPrefix, args, command }) => {
try {
const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null
    
if (!text) return m.reply(`Ingrese texto o responda a un mensaje con el texto que desea buscar en YouTube.\nEjemplo de uso:\n*${usedPrefix + command} GataBot*`)
    
const { all: [bestItem, ...moreItems] } = await ytSearch(text)
const videoItems = moreItems.filter(item => item.type === 'video')
const formattedData = {
title: "                *[ Búsqueda de Youtube ]*\n",
rows: [{
title: "YT",
highlight_label: "Popular",
rows: [{
header: bestItem.title,
id: `${usedPrefix}yta ${bestItem.url}`,
title: bestItem.description,
description: ""
}]
}, {
title: "Más",
rows: videoItems.map(({
title,
url,
description
}, index) => ({
header: `${index + 1}). ${title}`,
id: `.yta ${url}`,
title: description,
description: ""
}))
}]
}
const emojiMap = {
type: "🎥",
videoId: "🆔",
url: "🔗",
title: "📺",
description: "📝",
image: "🖼️",
thumbnail: "🖼️",
seconds: "⏱️",
timestamp: "⏰",
ago: "⌚",
views: "👀",
author: "👤"
}
    
const caption = Object.entries(bestItem).map(([key, value]) => {
const formattedKey = key.charAt(0).toUpperCase() + key.slice(1)
const valueToDisplay = key === 'views' ? new Intl.NumberFormat('en', { notation: 'compact' }).format(value) : key === 'author' ? `Nombre: ${value.name || 'Desconocido'}\nURL: ${value.url || 'Desconocido'}` : value || 'Desconocido';
return ` ${emojiMap[key] || '🔹'} *${formattedKey}:* ${valueToDisplay}`}).join('\n')

await conn.sendButtonMessages(m.chat, [
[formattedData.title + caption, wm, bestItem.image || bestItem.thumbnail || logo, [
['Menu Lista', usedPrefix + 'menu']
], null, [
['Canal Oficial', canal2]
],
[["Resultados aquí", formattedData.rows]]
]], m)

} catch (error) {
console.error(error)
conn.reply(m.chat, `Ocurrió un error.`, m)
}
}

handler.command = /^y(outubesearch|ts(earch)?)$/i
export default handler*/
