let handler = async (m, { conn, text }) => {

if (!text) return m.reply(`${lenguajeGB['smsAvisoAG']()}🐈 𝙔 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊?`)
try{
m.reply(`${lenguajeGB['smsAvisoEG']()}🐱 𝘾𝙍𝙀𝘼𝙉𝘿𝙊 𝙀𝙇 𝙂𝙍𝙐𝙋𝙊....`)
let group = await conn.groupCreate(text, [m.sender])
let link = await conn.groupInviteCode(group.gid)
let url = 'https://chat.whatsapp.com/' + link;
m.reply('😺 *Url:* ' + url)
} catch (e) {
m.reply(`${lenguajeGB['smsAvisoFG']()}😿 𝙊𝘾𝙐𝙍𝙍𝙄𝙊́ 𝙐𝙉 𝙀𝙍𝙍𝙊𝙍.`)
}
}
handler.help = ['newgc *<nombre>*']
handler.tags = ['owner']
handler.command = ['newgc']
handler.owner = true
export default handler