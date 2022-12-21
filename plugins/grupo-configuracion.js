/*import fetch from 'node-fetch' 
let handler = async (m, { conn, participants, groupMetadata }) => {
let grupos = [nna, nn, nnn, nnnt]
let gata = [img5, img6, img7, img8, img9]
let enlace = { contextInfo: { externalAdReply: {title: wm + ' 🐈', body: 'support group' , sourceUrl: grupos.getRandom(), thumbnail: await(await fetch(gata.getRandom())).buffer() }}}
let enlace2 = { contextInfo: { externalAdReply: { showAdAttribution: true, mediaUrl: yt, mediaType: 'VIDEO', description: '', title: wm, body: '😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 ', thumbnailUrl: await(await fetch(img)).buffer(), sourceUrl: yt }}}
let dos = [enlace, enlace2]    
const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || './src/grupos.jpg' 
const { reaction, antifake, antiTwitter, antiInstagram, antiFacebook, antiTelegram, antiYoutube, antiTiktok, isBanned, autolevelup, antiver, antitoxic, temporal, restrict, stickers, welcome, detect, sWelcome, sBye, sPromote, sDemote, antiLink, antiLink2, modohorny, autosticker, audios, delete: del } = global.db.data.chats[m.chat]

let text = 
`╭━[ 𝘾𝙊𝙉𝙁𝙄𝙂𝙐𝙍𝘼𝘾𝙄𝙊𝙉 ]━⬣
┃
┃・ 𝙒𝙀𝙇𝘾𝙊𝙈𝙀 ${welcome ? '✅' : '❌'}
┃・ 𝘿𝙀𝙏𝙀𝘾𝙏 ${detect ? '✅' : '❌'} 
┃・ 𝘼𝙐𝙏𝙊𝙇𝙀𝙑𝙀𝙇𝙐𝙋 ${global.db.data.users[m.sender].autolevelup ? '✅' : '❌'}
┃・ 𝙁𝙐𝙉𝘾𝙄𝙊𝙉 𝘼𝙉𝘼𝘿𝙄𝙍 𝙔 𝙎𝘼𝘾𝘼𝙍 ${global.db.data.settings[conn.user.jid].restrict ? '✅' : '❌'}
┃・ 𝙁𝙐𝙉𝘾𝙄𝙊𝙉 𝘽𝙊𝙏 𝙏𝙀𝙈𝙋𝙊𝙍𝘼𝙇 ${global.db.data.settings[conn.user.jid].temporal ? '✅' : '❌'}
┃・ 𝙎𝙏𝙄𝘾𝙆𝙀𝙍𝙎 ${stickers ? '✅' : '❌'}
┃・ 𝙍𝙀𝘼𝘾𝘾𝙄𝙊𝙉𝙀𝙎 𝘿𝙀 𝙀𝙈𝙊𝙅𝙄𝙎 ${reaction ? '✅' : '❌'}
┃・ 𝘼𝙐𝙏𝙊𝙎𝙏𝙄𝘾𝙆𝙀𝙍 ${autosticker ? '✅' : '❌'} 
┃・ 𝘼𝙐𝘿𝙄𝙊𝙎 ${audios ? '✅' : '❌'} 
┃・ 𝙈𝙊𝘿𝙊 𝙃𝙊𝙍𝙉𝙔 ${modohorny ? '✅' : '❌'} 
┃・ 𝘼𝙉𝙏𝙄𝙏𝙊𝙓𝙄𝘾 ${antitoxic ? '✅' : '❌'} 
┃・ 𝘼𝙉𝙏𝙄 𝙄𝙉𝙏𝙀𝙍𝙉𝘼𝘾𝙄𝙊𝙉𝘼𝙇 ${antifake ? '✅' : '❌'} 
┃・ 𝘼𝙉𝙏𝙄 𝙑𝙀𝙍 ${antiver ? '✅' : '❌'}
┃・ 𝘼𝙉𝙏𝙄𝘿𝙀𝙇𝙀𝙏𝙀 ${global.db.data.chats[m.chat].delete ? '✅' : '❌'}
┃・ 𝘼𝙉𝙏𝙄𝙇𝙄𝙉𝙆 ${antiLink ? '✅' : '❌'} 
┃・ 𝘼𝙉𝙏𝙄𝙇𝙄𝙉𝙆 *2* ${antiLink2 ? '✅' : '❌'} 
┃・ 𝘼𝙉𝙏𝙄 𝙏𝙄𝙆𝙏𝙊𝙆 ${antiTiktok ? '✅' : '❌'}
┃・ 𝘼𝙉𝙏𝙄 𝙔𝙊𝙐 𝙏𝙐𝘽𝙀 ${antiYoutube ? '✅' : '❌'}
┃・ 𝘼𝙉𝙏𝙄 𝙏𝙀𝙇𝙀𝙂𝙍𝘼𝙈 ${antiTelegram ? '✅' : '❌'}
┃・ 𝘼𝙉𝙏𝙄 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 ${antiFacebook ? '✅' : '❌'}
┃・ 𝘼𝙉𝙏𝙄 𝙄𝙉𝙎𝙏𝘼𝙂𝙍𝘼𝙈 ${antiInstagram ? '✅' : '❌'}
┃・ 𝘼𝙉𝙏𝙄 𝙏𝙒𝙄𝙏𝙏𝙀𝙍 ${antiTwitter ? '✅' : '❌'}
┃
╰━━━❰ *𓃠 ${vs}* ❱━━⬣
`.trim()
await conn.sendButton(m.chat, wm, text, img5, [['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']], m, dos.getRandom())
//conn.sendHydrated(m.chat, text, wm, img5, md, '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', null, null, [
//['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
//], m,)
}
handler.help = ['infogrup']
handler.tags = ['group']
handler.command = /^(configuración|settings|setting|confugurar|configuracion|vergrupo|gruporesumen|resumen)$/i
handler.group = true
export default handler*/
