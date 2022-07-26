let handler = async (m, { conn, text, isROwner, isOwner }) => {
if (text) {
global.db.data.chats[m.chat].sBye = text
conn.sendHydrated(m.chat, `${eg} 𝙇𝘼 𝘿𝙀𝙎𝙋𝙀𝘿𝙄𝘿𝘼 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊 𝙃𝘼 𝙎𝙄𝘿𝙊 𝘾𝙊𝙉𝙁𝙄𝙂𝙐𝙍𝘼𝘿𝘼`, wm, null, md, '𝙵𝚞𝚝𝚊𝚋𝚞𝙱𝚘𝚝-𝙼𝙳', null, null, [
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m,)
} else throw `${iig}𝙐𝙎𝙀 𝙇𝙊 𝙌𝙐𝙀 𝙀𝙎𝙏𝘼 𝘾𝙊𝙉 *"@"* 𝙋𝘼𝙍𝘼 𝘿𝘼𝙍 𝙇𝙊𝙎 𝙎𝙄𝙂𝙐𝙀𝙉𝙏𝙀𝙎 𝙎𝙄𝙂𝙉𝙄𝙁𝙄𝘾𝘼𝘿𝙊𝙎:\n*⚡ @user (Mención al usuario(a))*\n*⚡ @subject (Nombre de grupo)*\n*⚡ @desc (Description de grupo)*\n\n𝙍𝙀𝘾𝙐𝙀𝙍𝘿𝙀 𝙌𝙐𝙀 𝙇𝙊𝙎 *"@"* 𝙇𝙊𝙎 𝙋𝙐𝙀𝘿𝙀 𝙊𝙈𝙄𝙏𝙄𝙍 𝘿𝙀 𝙎𝙀𝙍 𝘾𝙊𝙉𝙑𝙀𝙉𝙄𝙀𝙉𝙏𝙀 𝘼𝙇 𝘾𝙊𝙉𝙁𝙄𝙂𝙐𝙍𝘼𝙍 𝙂𝘼𝙏𝘼𝘽𝙊𝙏-𝙈𝘿`
}
handler.help = ['setbye <text>']
handler.tags = ['group']
handler.command = ['setbye'] 
handler.botAdmin = true
handler.admin = true
export default handler
