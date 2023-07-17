import fetch from 'node-fetch'

let handler = async (m, { conn, text, args }) => {
	if (!args[0]) throw `${lenguajeGB['smsAvisoMG']()}𝙄𝙣𝙜𝙧𝙚𝙨𝙚 𝙚𝙡 𝙣𝙤𝙢𝙗𝙧𝙚 𝙙𝙚 𝙡𝙖 𝙖𝙠𝙥 𝙥𝙖𝙧𝙖 𝙗𝙪𝙨𝙘𝙖𝙧`
	let enc = encodeURIComponent(text)
try {
let json = await fetch(`https://latam-api.vercel.app/api/playstore?apikey=nktesla&q={enc}`)
let gPlay = await json.json()
if (!gPlay.titulo) return m.reply(`[ ! ] Sin resultados`)
conn.sendMessage(m.chat,{image:{url: gPlay.imagen},caption:`🔍 𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊𝙎: ${gPlay.titulo}
🧬 𝙄𝘿𝙀𝙉𝙏𝙄𝙁𝙄𝘾𝘼𝘿𝙊𝙍: ${gPlay.id}
⛓️ 𝙇𝙄𝙉𝙆: ${gPlay.link}
🖼️ 𝙄𝙈𝘼𝙂𝙀𝙉: ${gPlay.imagen}
✍️ 𝘿𝙀𝙎𝘼𝙍𝙍𝙊𝙇𝙇𝘼𝘿𝙊𝙍: ${gPlay.desarrollador}
📜 𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝘾𝙄𝙊́𝙉: ${gPlay.descripcion}
💲 𝙈𝙊𝙉𝙀𝘿𝘼: ${gPlay.moneda}
🎭 𝙂𝙍𝘼𝙏𝙄𝙎?: ${gPlay.gratis}
💸 𝙋𝙍𝙀𝘾𝙄𝙊: ${gPlay.precio}
📈 𝙋𝙐𝙉𝙏𝙐𝘼𝘾𝙄𝙊́𝙉: ${gPlay.puntuacion}`},{quoted:m})
} catch (e) {
await m.reply(lenguajeGB['smsMalError3']() + '\n*' + lenguajeGB.smsMensError1() + '*\n*' + usedPrefix + `${lenguajeGB.lenguaje() == 'es' ? 'reporte' : 'report'}` + '* ' + `${lenguajeGB.smsMensError2()} ` + usedPrefix + command)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)}  
}

handler.help = ['playstore <aplicacion>']
handler.tags = ['internet']
handler.command = /^(playstore)$/i

export default handler 
