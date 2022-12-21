let handler = async (m, { conn, groupMetadata, usedPrefix }) => {
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

let id = m.chat
conn.vote = conn.vote ? conn.vote : {}
        
if (!(id in conn.vote)) {
return await conn.sendButton(m.chat, `${fg}𝙉𝙊 𝙎𝙀 𝙃𝘼 𝘾𝙍𝙀𝘼𝘿𝙊 𝙑𝙊𝙏𝘼𝘾𝙄𝙊𝙉 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊\n\n𝙉𝙊 𝙑𝙊𝙏𝙀 𝙃𝘼𝙎 𝘽𝙀𝙀𝙉 𝘾𝙍𝙀𝘼𝙏𝙀𝘿 𝙄𝙉 𝙏𝙃𝙄𝙎 𝙂𝙍𝙊𝙐𝙋`, `*Si quieres crear una nueva votación usa el comando ${usedPrefix}crearvoto*\n\n*If you want to make a new vote use the command ${usedPrefix}startvoto*\n${wm}`, null, [
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']], fkontak, m)}

let [reason, upvote, devote] = conn.vote[id]
let caption = `*${htjava} 𝙇𝙄𝙎𝙏𝘼 𝘿𝙀 𝙑𝙊𝙏𝙊𝙎 : 𝙑𝙊𝙏𝙀 𝙇𝙄𝙎𝙏 ${htjava}*

*USUARIO(A)*
🐈 @${conn.getName(m.sender)}

*MOTIVO ➫* ${reason}

*${htjava} 𝙑𝙊𝙏𝙊𝙎 𝘼 𝙁𝘼𝙑𝙊𝙍 : 𝙂𝙊𝙊𝘿 𝙑𝙊𝙏𝙀𝙎 ${htjava}*
*Total: ${upvote.length}*

${dmenut}
${upvote.map((v, i) => `${dmenub} ${i + 1}.  @${v.split`@`[0]}`).join('\n')}
${dmenuf}

*${htjava} 𝙑𝙊𝙏𝙊𝙎 𝙀𝙉 𝘾𝙊𝙉𝙏𝙍𝘼 : 𝙑𝙊𝙏𝙀𝙎 𝘼𝙂𝘼𝙄𝙉𝙎𝙏 ${htjava}*
*Total: ${devote.length}*

${dmenut}
${devote.map((v, i) => `${dmenub} ${i + 1}.  @${v.split`@`[0]}`).join('\n')}
${dmenuf}`.trim()

await conn.sendButton(m.chat, caption, wm, null, [
['✅ 𝙑𝙊𝙏𝘼𝙍 𝘼 𝙁𝘼𝙑𝙊𝙍 | 𝙐𝙋𝙑𝙊𝙏𝙀', `${usedPrefix}upvote`],
['❌ 𝙑𝙊𝙏𝘼𝙍 𝙀𝙉 𝘾𝙊𝙉𝙏𝙍𝘼 | 𝘿𝙀𝙑𝙊𝙏𝙀', `${usedPrefix}devote`],
['🧾 𝙁𝙄𝙉𝘼𝙇𝙄𝙕𝘼𝙍 𝙑𝙊𝙏𝘼𝘾𝙄𝙊𝙉 | 𝙀𝙉𝘿 𝙑𝙊𝙏𝙄𝙉𝙂', `${usedPrefix}delvoto`]], m, { mentions: conn.parseMention(caption) })}

handler.help = ['cekvote']
handler.tags = ['vote']
handler.command = /^cekvote|vervotos|vervoto|vervotaciones|votaciones|votacion|vervotacion$/i
handler.group = true
handler.botAdmin = true

export default handler
