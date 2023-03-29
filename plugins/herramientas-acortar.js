import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, args }) => {
	let title = `— *S H O R T E D  U R L* —`
    let caption = 'Por favor seleccione el tipo de URL'
const sections = [
   {
	title: "TYPE URL",
	rows: [
	    {title: "TinyUrl", rowId: ".short " + args[0] + " tinyurl"},
	    {title: "LinkPoi", rowId: ".short " + args[0] + " linkpoi"},
	    {title: "Bitly", rowId: ".short " + args[0] + " bitly"},
	    {title: "OuO", rowId: ".short " + args[0] + " ouo"},
	]
    },
]

const listMessage = {
  text: caption,
  footer: null,
  title: title,
  buttonText: "Enlaces en cortocircuito",
  sections
}

if (!args[0]) return m.reply('¿Dónde está el enlace??')
if (!args[0].startsWith('https://')) throw 'Ingrese URL con prefijo *https://*'
if (!args[1]) return conn.sendMessage(m.chat, listMessage, { quoted: m })

let tesk = '🚀 *ʟɪɴᴋ:* '
let pros = '_*ᴄ ᴏ ɴ ᴠ ɪ ʀ ᴛ ɪ ᴇ ɴ ᴅ ᴏ . . .*_'
//TINY
if (args[1] == "tinyurl") {
	let tiny = await (await fetch(`https://api.lolhuman.xyz/api/shortlink?apikey=${global.lolkey}url=${args[0]}`)).json()
m.reply(pros).then(_ => conn.reply(m.chat, `${tesk}${tiny.result}`,m))
}
//--------------

//LINKPOI
if (args[1] == "linkpoi") {
	let poi = await(await fetch(`https://linkpoi.ga/api.php?url=${args[0]}`)).json()
	m.reply(pros).then(_=> conn.reply(m.chat, `${tesk}${poi.shorturl.replace('\/','/')}`,m))
	}
}
handler.help = ['short <url> <type>']
handler.tags = ['internet']
handler.command = /^(short(url)?)$/i

export default handler

