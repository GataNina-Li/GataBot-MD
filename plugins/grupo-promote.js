let handler = async (m, { conn,usedPrefix, text }) => {
if(isNaN(text) && !text.match(/@/g)){
	
}else if(isNaN(text)) {
var number = text.split`@`[1]
}else if(!isNaN(text)) {
var number = text
}
	
if(!text && !m.quoted) return conn.reply(m.chat, `${mg}𝘿𝙀𝘽𝙀 𝘿𝙀 𝙐𝙎𝘼𝙍 𝘿𝙀 𝙇𝘼 𝙎𝙄𝙂𝙐𝙄𝙀𝙉𝙏𝙀 𝙈𝘼𝙉𝙀𝙍𝘼:\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix}darpoder @tag*\n*${usedPrefix}daradmin responder a un mensaje*\n\n𝙔𝙊𝙐 𝙈𝙐𝙎𝙏 𝙐𝙎𝙀 𝘼𝙎 𝙁𝙊𝙇𝙇𝙊𝙒𝙎:\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix}promote @tag*\n*${usedPrefix}promote reply to a message*`, m)
if(number.length > 13 || (number.length < 11 && number.length > 0)) return conn.reply(m.chat, `${fg}𝙀𝙇 𝙉𝙐𝙈𝙀𝙍𝙊 𝙀𝙎 𝙄𝙉𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝙊, 𝙄𝙉𝙏𝙀𝙉𝙏𝙀 𝘿𝙀 𝙉𝙐𝙀𝙑𝙊\n\n𝙏𝙃𝙀 𝙉𝙐𝙈𝘽𝙀𝙍 𝙄𝙎 𝙒𝙍𝙊𝙉𝙂, 𝙏𝙍𝙔 𝘼𝙂𝘼𝙄𝙉`, m)
	
try {
if(text) {
var user = number + '@s.whatsapp.net'
} else if(m.quoted.sender) {
var user = m.quoted.sender
} else if(m.mentionedJid) {
var user = number + '@s.whatsapp.net'
} 
} catch (e) {
} finally {
conn.groupParticipantsUpdate(m.chat, [user], 'promote')
//conn.reply(m.chat, `${eg}𝘼𝙃𝙊𝙍𝘼 𝙏𝙄𝙀𝙉𝙀 𝙀𝙇 𝙋𝙊𝘿𝙀𝙍 𝘿𝙀𝙇 𝘼𝘿𝙈𝙄𝙉 😼\n\n𝙐𝙎𝙀𝙍 𝙄𝙎 𝙉𝙊𝙒 𝘼𝘿𝙈𝙄𝙉 🤠`, m)
	
conn.sendHydrated(m.chat, `${eg}𝘼𝙃𝙊𝙍𝘼 𝙏𝙄𝙀𝙉𝙀 𝙀𝙇 𝙋𝙊𝘿𝙀𝙍 𝘿𝙀𝙇 𝘼𝘿𝙈𝙄𝙉 😼\n\n𝙐𝙎𝙀𝙍 𝙄𝙎 𝙉𝙊𝙒 𝘼𝘿𝙈𝙄𝙉 🤠`, wm, null, md, '𝙵𝚞𝚝𝚊𝚋𝚞𝙱𝚘𝚝-𝙼𝙳', null, null, [
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu'] 
], m)
}}
handler.help = ['*593xxx*','*@usuario*','*responder chat*'].map(v => 'promote ' + v)
handler.tags = ['group']
handler.command = /^(promote|daradmin|darpoder)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null
export default handler
