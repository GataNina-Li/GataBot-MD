let handler = async (m, { conn, usedPrefix}) => {
  
  const fkontak = {
	"key": {
    "participants":"0@s.whatsapp.net",
		"remoteJid": "status@broadcast",
		"fromMe": false,
		"id": "Halo"
	},
	"message": {
		"contactMessage": {
			"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
		}
	},
	"participant": "0@s.whatsapp.net"
}
  
	let banteng = global.db.data.users[m.sender].banteng
	let harimau = global.db.data.users[m.sender].harimau
	let gajah = global.db.data.users[m.sender].gajah
	let kambing = global.db.data.users[m.sender].kambing
	let panda = global.db.data.users[m.sender].panda
	let buaya = global.db.data.users[m.sender].buaya
	let kerbau = global.db.data.users[m.sender].kerbau
	let sapi = global.db.data.users[m.sender].sapi
	let monyet = global.db.data.users[m.sender].monyet
	let babihutan = global.db.data.users[m.sender].babihutan
	let babi = global.db.data.users[m.sender].babi
	let ayam = global.db.data.users[m.sender].ayam

	let ndy = `
*${htki} 𝘼𝙉𝙄𝙈𝘼𝙇𝙀𝙎 ${htka}*
    
 *${rpg.emoticon('bull')} ➡️ ${banteng}*
 *${rpg.emoticon('tiger')} ➡️ ${harimau}*
 *${rpg.emoticon('elephant')} ➡️ ${gajah}*
 *${rpg.emoticon('kambing')} ➡️ ${kambing}*
 *${rpg.emoticon('panda')} ➡️ ${panda}*
 *${rpg.emoticon('buaya')} ➡️ ${buaya}*
 *${rpg.emoticon('kerbau')} ➡️ ${kerbau}*
 *${rpg.emoticon('cow')} ➡️ ${sapi}*
 *${rpg.emoticon('monyet')} ➡️ ${monyet}*
 *${rpg.emoticon('Jabali')} ➡️ ${babihutan}*
 *${rpg.emoticon('babi')} ➡️ ${babi}*
 *${rpg.emoticon('ayam')} ➡️ ${ayam}*`.trim()
await conn.sendButton(m.chat, ndy, `🔖 𝘼𝙣𝙞𝙢𝙖𝙡𝙚𝙨 𝙡𝙞𝙨𝙩𝙤𝙨 𝙥𝙖𝙧𝙖 𝘾𝙤𝙘𝙞𝙣𝙖𝙧\n𝘼𝙣𝙞𝙢𝙖𝙡𝙨 𝙧𝙚𝙖𝙙𝙮 𝙩𝙤 𝙘𝙤𝙤𝙠\n${wm}`, null, [['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu'], [`🎒 𝙄𝙣𝙫𝙚𝙣𝙩𝙖𝙧𝙞𝙤 | 𝙄𝙣𝙫𝙚𝙣𝙩𝙤𝙧𝙮`, `.inventario`]], fkontak, m)

}
handler.help = ['kandang']
handler.tags = ['rpg']
handler.command = /^(kandang|animales|animals)$/i

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
