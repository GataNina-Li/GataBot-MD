//import { bold } from "chalk"
let handler = async (m, { conn, text }) => {

if (!text) return m.reply('\n𝗘𝗦𝗖𝗥𝗜𝗕𝗔 𝗘𝗟 𝗡𝗢𝗠𝗕𝗥𝗘 𝗗𝗘𝗟 𝗚𝗥𝗨𝗣𝗢 🌟\n𝗪𝗥𝗜𝗧𝗘 𝗧𝗛𝗘 𝗡𝗔𝗠𝗘 𝗢𝗙 𝗧𝗛𝗘 𝗚𝗥𝗢𝗨𝗣 🌟')
try{
//m.react('🚀')
m.reply('\n😊 𝗖𝗥𝗘𝗔𝗡𝗗𝗢 𝗘𝗟 𝗚𝗥𝗨𝗣𝗢, 𝗕𝗬: 𝗚𝗔𝗧𝗔𝗕𝗢𝗧\n😊 𝗖𝗥𝗘𝗔𝗧𝗜𝗡𝗚 𝗧𝗛𝗘 𝗚𝗥𝗢𝗨𝗣, 𝗕𝗬: 𝗚𝗔𝗧𝗔𝗕𝗢𝗧')
let group = await conn.groupCreate(text, [m.sender])
let link = await conn.groupInviteCode(group.gid)
let url = 'https://chat.whatsapp.com/' + link;
m.reply('*Link:* ' + url)
} catch (e) {
m.reply(`❌ 𝗘𝗥𝗥𝗢𝗥\n❌ 𝗠𝗜𝗦𝗧𝗔𝗞𝗘`)
}
}
handler.help = ['creategroup *<nombre>*']
handler.tags = ['owner']
handler.command = /^(creargrupo|creargroup|creargc|gccreate)$/
handler.owner = true
//handler.premium = false
export default handler