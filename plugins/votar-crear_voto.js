let handler = async (m, { conn, text, usedPrefix, isAdmin, isOwner }) => {
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


if (m.isGroup) {
//if (!text) throw await conn.reply(m.chat, `${mg}𝘿𝙀𝘽𝙀 𝘿𝙀 𝙀𝙎𝘾𝙍𝙄𝘽𝙄𝙍 𝙇𝘼 𝙍𝘼𝙕𝙊𝙉 𝘿𝙀 𝙇𝘼 𝙑𝙊𝙏𝘼𝘾𝙄𝙊𝙉\n\n𝙔𝙊𝙐 𝙈𝙐𝙎𝙏 𝙒𝙍𝙄𝙏𝙀 𝙏𝙃𝙀 𝙍𝙀𝘼𝙎𝙊𝙉 𝙁𝙊𝙍 𝙏𝙃𝙀 𝙑𝙊𝙏𝙀`, fkontak,  m)	
if (!(isAdmin || isOwner)) return dfail('admin', m, conn)}
conn.vote = conn.vote ? conn.vote : {}
let id = m.chat

if (id in conn.vote) { 
return await conn.sendButton(m.chat, `🗃️ 𝙏𝙊𝘿𝘼𝙑𝙄𝘼 𝙃𝘼𝙔 𝙑𝙊𝙏𝘼𝘾𝙄𝙊𝙉 𝙋𝙀𝙉𝘿𝙄𝙀𝙉𝙏𝙀 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊!!\n\n📍 𝙏𝙃𝙀𝙍𝙀 𝙄𝙎 𝙎𝙏𝙄𝙇𝙇 𝙋𝙀𝙉𝘿𝙄𝙉𝙂 𝙑𝙊𝙏𝙄𝙉𝙂 𝙄𝙉 𝙏𝙃𝙄𝙎 𝙂𝙍𝙊𝙐𝙋!!`, wm, null, [
['🧾 𝙁𝙄𝙉𝘼𝙇𝙄𝙕𝘼𝙍 𝙑𝙊𝙏𝘼𝘾𝙄𝙊𝙉 | 𝙀𝙉𝘿 𝙑𝙊𝙏𝙄𝙉𝙂', `${usedPrefix}-vote`]], fkontak, m)}
  
await conn.sendButton(m.chat, `✴️ 𝙉𝙐𝙀𝙑𝘼 𝙑𝙊𝙏𝘼𝘾𝙄𝙊𝙉 | 𝙉𝙀𝙒 𝙑𝙊𝙏𝙀 ✴️\n\n*CREADOR(A) DE LA VOTACIÓN*\n🛃 @${conn.getName(m.sender)}\n\n*MOTIVO ➫* ${text}`, `
*Puede usar los comandos de abajo o los botones para hacer una acción en la votación!!*

*You can use the commands or the buttons below to do an action on the vote!!*

${htjava} 𝘿𝙐𝙍𝘼𝙉𝙏𝙀 𝙇𝘼 𝙑𝙊𝙏𝘼𝘾𝙄𝙊𝙉 ${htjava}
${dmenub} *${usedPrefix}sivotar | upvote* 
${dmenub} _Estar de acuerdo : Agree_
${dmenub2} *┈┈┈┈┈┈┈┈┈┈┈┈*
${dmenub} *${usedPrefix}novotar | devote*
${dmenub} _Estar en desacuerdo : Disagree_
${dmenub2} *┈┈┈┈┈┈┈┈┈┈┈┈*
${dmenub} *${usedPrefix}vervotos | cekvoto*
${dmenub} _Comprobar el voto : Check the vote_
${dmenub2} *┈┈┈┈┈┈┈┈┈┈┈┈*
${dmenub} *${usedPrefix}delvoto | deletevoto*
${dmenub} _Borrar votos : Delete votes_
${dmenuf}`, null, [
['✅ 𝙑𝙊𝙏𝘼𝙍 𝘼 𝙁𝘼𝙑𝙊𝙍 | 𝙐𝙋𝙑𝙊𝙏𝙀', `${usedPrefix}upvote`],
['❌ 𝙑𝙊𝙏𝘼𝙍 𝙀𝙉 𝘾𝙊𝙉𝙏𝙍𝘼 | 𝘿𝙀𝙑𝙊𝙏𝙀', `${usedPrefix}devote`],
['🔰 𝙄𝙉𝙑𝙄𝙏𝘼𝙍 𝘼 𝙑𝙊𝙏𝘼𝙍 | 𝙄𝙉𝙑𝙄𝙏𝙀', `${usedPrefix}pedirayuda ✴️ @${conn.getName(m.sender)} *ESTA INVITANDO A QUE SE UNAN A LA VOTACIÓN!!*\n*USEN EL COMANDO ${usedPrefix}vervotos PARA VOTAR!!*\n\n*THEY ARE INVITING YOU TO A VOTE!!*\n*USE THE COMMAND ${usedPrefix}vervotos TO VOTE*`]
], fkontak, m) 
conn.vote[id] = [
text,
[],
[]
]
}

handler.help = ['mulaivote [alasan]']
handler.tags = ['vote']
handler.command = /^(start|crear|iniciar|empezar|\+)voto$/i
handler.group = true
handler.botAdmin = true
handler.admin = true
handler.level = 4
handler.limit = 1

export default handler 
