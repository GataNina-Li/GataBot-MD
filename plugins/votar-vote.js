let handler = async (m, { conn, groupMetadata, usedPrefix, command }) => {
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
  
let isVote = conn.vote[id][1].concat(conn.vote[id][2])
const wasVote = isVote.includes(m.sender)

if (wasVote) { 
return await conn.sendButton(m.chat, `${eg}🥳 𝙔𝘼 𝙃𝘼𝙎 𝙑𝙊𝙏𝘼𝘿𝙊!!\n\n🎊 𝙔𝙊𝙐 𝙃𝘼𝙑𝙀 𝘼𝙇𝙍𝙀𝘼𝘿𝙔 𝙑𝙊𝙏𝙀𝘿!!`, `*Su voto no se cambia una vez que hayas votado.*\n*Your vote is not changed twice*\n\n${wm}`, null, [
['📋 𝙑𝙀𝙍 𝙑𝙊𝙏𝙊𝙎 | 𝙎𝙀𝙀 𝙑𝙊𝙏𝙀𝙎', '/vervotos'],
['🔰 𝙄𝙉𝙑𝙄𝙏𝘼𝙍 𝘼 𝙑𝙊𝙏𝘼𝙍 | 𝙄𝙉𝙑𝙄𝙏𝙀', `${usedPrefix}pedirayuda ✴️ @${conn.getName(m.sender)} *ESTA INVITANDO A QUE SE UNAN A LA VOTACIÓN!!*\n*USEN EL COMANDO ${usedPrefix}vervotos PARA VOTAR!!*\n\n*THEY ARE INVITING YOU TO A VOTE!!*\n*USE THE COMMAND ${usedPrefix}vervotos TO VOTE*`]
], fkontak, m)}
  
if (/up|si/i.test(command)) {
conn.vote[id][1].push(m.sender)
  
} else if (/de|no/i.test(command)) {
conn.vote[id][2].push(m.sender)}
    
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
['❌ 𝙑𝙊𝙏𝘼𝙍 𝙀𝙉 𝘾𝙊𝙉𝙏𝙍𝘼 | 𝘿𝙀𝙑𝙊𝙏𝙀', `${usedPrefix}devote`]], m, { mentions: conn.parseMention(caption) })}

handler.help = ['upvote', 'devote']
handler.tags = ['vote']
handler.command = /^(up|si|de|no)vote|voto|votar$/i  
handler.group = true
handler.botAdmin = true

export default handler
