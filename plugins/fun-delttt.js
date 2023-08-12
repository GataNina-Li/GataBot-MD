//import MessageType from '@adiwajshing/baileys'
let MessageType = (await import(global.baileys)).default
let handler = async (m, { conn, usedPrefix, command }) => {
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

let room = Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))
if (room == undefined) return await conn.reply(m.chat, `${lenguajeGB['smsAvisoFG']()}𝙉𝙊 𝙀𝙎𝙏𝘼𝙎 𝙀𝙉 𝙉𝙄𝙉𝙂𝙐𝙉𝘼 𝙋𝘼𝙍𝙏𝙄𝘿𝘼 𝙀𝙉 𝙀𝙇 𝙅𝙐𝙀𝙂𝙊 𝙏𝙍𝙀𝙎 𝙀𝙉 𝙍𝘼𝙔𝘼\n\n𝙔𝙊𝙐 𝘼𝙍𝙀 𝙉𝙊𝙏 𝙄𝙉 𝘼𝙉𝙔 𝙂𝘼𝙈𝙀 𝙄 𝙂𝘼𝙈𝙀 𝙏𝙃𝙍𝙀𝙀 𝙄𝙉 𝙎𝙏𝙍𝙄𝙋𝙀𝙎\n\n💫 𝙄𝙉𝙄𝘾𝙄𝘼𝙍 𝙋𝘼𝙍𝙏𝙄𝘿𝘼 | 𝙎𝙏𝘼𝙍𝙏 𝙂𝘼𝙈𝙀 (${usedPrefix}ttt sala nueva)`, fkontak, m)
//conn.sendButton(m.chat, `${lenguajeGB['smsAvisoFG']()}𝙉𝙊 𝙀𝙎𝙏𝘼𝙎 𝙀𝙉 𝙉𝙄𝙉𝙂𝙐𝙉𝘼 𝙋𝘼𝙍𝙏𝙄𝘿𝘼 𝙀𝙉 𝙀𝙇 𝙅𝙐𝙀𝙂𝙊 𝙏𝙍𝙀𝙎 𝙀𝙉 𝙍𝘼𝙔𝘼\n\n𝙔𝙊𝙐 𝘼𝙍𝙀 𝙉𝙊𝙏 𝙄𝙉 𝘼𝙉𝙔 𝙂𝘼𝙈𝙀 𝙄 𝙂𝘼𝙈𝙀 𝙏𝙃𝙍𝙀𝙀 𝙄𝙉 𝙎𝙏𝙍𝙄𝙋𝙀𝙎`, wm, null, [['💫 𝙄𝙉𝙄𝘾𝙄𝘼𝙍 𝙋𝘼𝙍𝙏𝙄𝘿𝘼 | 𝙎𝙏𝘼𝙍𝙏 𝙂𝘼𝙈𝙀', `${usedPrefix}ttt sala nueva`]], fkontak, m)
delete conn.game[room.id]

await conn.reply(m.chat, `${lenguajeGB['smsAvisoEG']()}𝙇𝘼 𝙎𝘼𝙇𝘼 𝙏𝙍𝙀𝙎 𝙀𝙉 𝙍𝘼𝙔𝘼 𝙁𝙐𝙀 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝘿𝘼\n\n𝙏𝙃𝙀 𝙏𝙃𝙍𝙀𝙀 𝙄𝙉 𝘼 𝙍𝙊𝙒 𝙍𝙊𝙊𝙈 𝙒𝘼𝙎 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙏𝙀𝘿`, fkontak, m)}
//await conn.sendButton(m.chat, `${lenguajeGB['smsAvisoEG']()}𝙇𝘼 𝙎𝘼𝙇𝘼 𝙏𝙍𝙀𝙎 𝙀𝙉 𝙍𝘼𝙔𝘼 𝙁𝙐𝙀 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝘿𝘼\n\n𝙏𝙃𝙀 𝙏𝙃𝙍𝙀𝙀 𝙄𝙉 𝘼 𝙍𝙊𝙒 𝙍𝙊𝙊𝙈 𝙒𝘼𝙎 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙏𝙀𝘿`, wm, null, [['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu'] ], fkontak, m)}  
handler.command = /^(delttt|deltt|delxo|deltictactoe)$/i
handler.fail = null
export default handler
