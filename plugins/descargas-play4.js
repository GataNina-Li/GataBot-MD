import yts from 'yt-search'
let handler = async (m, { conn, command, text, usedPrefix }) => {
	
	if (!text) throw `${lenguajeGB['smsAvisoMG']()}𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝙊 𝙏𝙄𝙏𝙐𝙇𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} Billie Eilish - Bellyache*\n\n𝙒𝙍𝙄𝙏𝙀 𝙏𝙃𝙀 𝙉𝘼𝙈𝙀 𝙊𝙍 𝙏𝙄𝙏𝙇𝙀\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} Billie Eilish - Bellyache*`
	let vid = (await yts(text)).all[0]
	if (!vid) throw `Error, intente del nuevo`
	let { title, description, thumbnail, videoId, timestamp, views, ago, url } = vid
	//const url = 'https://www.youtube.com/watch?v=' + videoId<
	let play = `*𓆩 𓃠 𓆪 ✧═══ ${vs} ═══✧ 𓆩 𓃠 𓆪*
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
 await conn.sendButton(m.chat, play, gt, thumbnail, [
    ['𓃠 𝗔 𝗨 𝗗 𝗜 𝗢', `${usedPrefix}fgmp3 ${url}`],
    ['𓃠 𝗩 𝗜 𝗗 𝗘 𝗢', `${usedPrefix}fgmp4 ${url}`],
    ['𓃠 𝗠 𝗔 𝗦   𝗥 𝗘 𝗦 𝗨 𝗟 𝗧 𝗔 𝗗 𝗢 𝗦', `${usedPrefix}ytsearch ${text}`]
  ], m, nn)
}
handler.help = ['play4']
handler.tags = ['downloader']
handler.command = ['play4', 'playvid']

export default handler