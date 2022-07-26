let handler = async (m, { conn, participants, groupMetadata }) => {
const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || './src/grupos.jpg' 
const { isBanned, welcome, detect, sWelcome, sBye, sPromote, sDemote, antiLink, antiLink2, modohorny, autosticker, audios, delete: del } = global.db.data.chats[m.chat]
const groupAdmins = participants.filter(p => p.admin) 
const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')
const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net'
let text = 
`╭━━━[ *𝙄𝙉𝙁𝙊 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊* ]━━━━⬣

✨ 𝙄𝘿𝙀𝙉𝙏𝙄𝙁𝙄𝘾𝘼𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊
${groupMetadata.id}

✨ 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊
${groupMetadata.subject}

✨ 𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝘾𝙄𝙊𝙉
${groupMetadata.desc?.toString() || '𝙉𝙊 𝙃𝘼𝙔 𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝘾𝙄𝙊𝙉'}

✨ 𝙉𝙐𝙈𝙀𝙍𝙊 𝘿𝙀 𝙐𝙎𝙐𝘼𝙍𝙄𝙊𝙎
${participants.length} Participantes

✨ 𝘾𝙍𝙀𝘼𝘿𝙊𝙍(𝘼) 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊
@${owner.split('@')[0]}

✨ 𝘼𝘿𝙈𝙄𝙉𝙎 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊
${listAdmin}

✨ 𝘾𝙊𝙉𝙁𝙄𝙂𝙐𝙍𝘼𝘾𝙄𝙊𝙉 𝙊𝙉/𝙊𝙁𝙁
𝙒𝙀𝙇𝘾𝙊𝙈𝙀 ${welcome ? '✅' : '❌'}
𝘿𝙀𝙏𝙀𝘾𝙏 ${detect ? '✅' : '❌'} 
𝘼𝙉𝙏𝙄𝙇𝙄𝙉𝙆 ${antiLink ? '✅' : '❌'} 
𝘼𝙉𝙏𝙄𝙇𝙄𝙉𝙆 *2* ${antiLink2 ? '✅' : '❌'} 
𝙈𝙊𝘿𝙊 𝙃𝙊𝙍𝙉𝙔 ${modohorny ? '✅' : '❌'} 
𝘼𝙐𝙏𝙊𝙎𝙏𝙄𝘾𝙆𝙀𝙍 ${autosticker ? '✅' : '❌'} 
𝘼𝙐𝘿𝙄𝙊𝙎 ${audios ? '✅' : '❌'} 

╰━━━━━━❰ *𓃠 ${vs}* ❱━━━━━⬣
`.trim()
//conn.sendFile(m.chat, pp, 'error.jpg', text, m, false, { mentions: [...groupAdmins.map(v => v.id), owner] })
conn.sendHydrated(m.chat, text, wm, pp, md, '𝙵𝚞𝚝𝚊𝚋𝚞𝙱𝚘𝚝-𝙼𝙳', null, null, [
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m, false, { mentions: [...groupAdmins.map(v => v.id), owner] })
}
handler.help = ['infogrup']
handler.tags = ['group']
handler.command = /^(infogrupo|gro?upinfo|info(gro?up|gc))$/i
handler.group = true
export default handler
