import { youtubeSearch, youtubedl, youtubedlv2, youtubedlv3 } from '@bochilteam/scraper'
let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw `${lenguajeGB['smsAvisoMG']()}𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝙊 𝙏𝙄𝙏𝙐𝙇𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} Billie Eilish - Bellyache*\n\n𝙒𝙍𝙄𝙏𝙀 𝙏𝙃𝙀 𝙉𝘼𝙈𝙀 𝙊𝙍 𝙏𝙄𝙏𝙇𝙀\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} Billie Eilish - Bellyache*`
  await m.reply(wait)
  let vid = (await youtubeSearch(text)).video[0]
  if (!vid) throw 'Error'
  let { title, description, thumbnail, videoId, durationH, viewH, publishedTime } = vid
  const url = 'https://www.youtube.com/watch?v=' + videoId

  let captvid = `*𓆩 𓃠 𓆪 ✧═══ ${vs} ═══✧ 𓆩 𓃠 𓆪*
ও *TÍTULO | TITLE:* 
» ${title}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
ও *DESCRIPCIÓN | DESCRIPTION:*
» ${description}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
ও *DURACION | DURATION:*
» ${durationH}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
ও *VISTAS| VIEWS*:
» ${viewH}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
ও *PUBLICADO | PUBLISHED:* 
» ${publishedTime}

*𓆩 𓃠 𓆪 ✧═══ ${vs} ═══✧ 𓆩 𓃠 𓆪*`
  conn.sendButton(m.chat, `*𓆩 𓃠 𓆪 ✧═══ ${vs} ═══✧ 𓆩 𓃠 𓆪*
ও *TÍTULO | TITLE:*
» ${title}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
ও *DESCRIPCIÓN | DESCRIPTION:*
» ${description}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
ও *DURACION | DURATION:*
» ${durationH}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
ও *VISTAS| VIEWS:*
» ${viewH}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
ও *PUBLICADO | PUBLISHED:* 
» ${publishedTime}

*𓆩 𓃠 𓆪 ✧═══ ${vs} ═══✧ 𓆩 𓃠 𓆪*`, author.trim(), await( await conn.getFile(thumbnail)).data, ['📽 🅥🅘🅓🅔🅞 📽', `${usedPrefix}getvid ${url} 360`], false, { quoted: m, 'document': { 'url':'https://wa.me/923470027813' },
'mimetype': global.dpdf,
'fileName': `${vs}`,
'fileLength': 666666666666666,
'pageCount': 666,contextInfo: { externalAdReply: { showAdAttribution: true,
mediaType:  2,
mediaUrl: `${url}`,
title: `🅖🅐🅣🅐🅑🅞🅣-🅜🅓`,
body: wm,
sourceUrl: 'https://github.com/GataNina-Li/GataBot-MD', thumbnail: await ( await conn.getFile(thumbnail)).data
}} })
  
//let buttons = [{ buttonText: { displayText: '📽VIDEO' }, buttonId: `${usedPrefix}ytv ${url} 360` }]
//let msg = await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: captvid, footer: author, buttons }, { quoted: m })

const yt = await await youtubedlv2(url).catch(async _ => await youtubedl(url)).catch(async _ => await youtubedlv3(url))
const link = await yt.audio['128kbps'].download()
  let doc = { 
  audio: 
  { 
    url: link 
}, 
mimetype: 'audio/mp4', fileName: `${title}`, contextInfo: { externalAdReply: { showAdAttribution: true,
mediaType:  2,
mediaUrl: url,
title: title,
body: wm,
sourceUrl: url,
thumbnail: await(await conn.getFile(thumbnail)).data                                                                     
                                                                                                                 }
                       }
  }

  return conn.sendMessage(m.chat, doc, { quoted: m })
	// return conn.sendMessage(m.chat, { document: { url: link }, mimetype: 'audio/mpeg', fileName: `${title}.mp3`}, { quoted: m})
	// return await conn.sendFile(m.chat, link, title + '.mp3', '', m, false, { asDocument: true })
}
handler.help = ['play4'].map(v => v + ' <pencarian>')
handler.tags = ['downloader']
handler.command = /^play4$/i

handler.exp = 0
handler.limit = 2
handler.level = 3
export default handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

