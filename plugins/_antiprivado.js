const comandos = /piedra|papel|tijera|estado|verificar|code|jadibot --code|--code|creadora|bottemporal|grupos|instalarbot|términos|bots|deletebot|eliminarsesion|serbot|verify|register|registrar|reg|reg1|nombre|name|nombre2|name2|edad|age|edad2|age2|genero|género|gender|identidad|pasatiempo|hobby|identify|finalizar|pas2|pas3|pas4|pas5|registroc|deletesesion|registror|jadibot/i

let handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, usedPrefix, command }) {
if (m.isBaileys && m.fromMe) return !0
if (m.isGroup) return !1
if (!m.message) return !0
const regex = new RegExp(`^${comandos.source}$`, 'i')
if (regex.test(m.text.toLowerCase().trim())) return !0

let chat, user, bot, mensaje
chat = global.db.data.chats[m.chat]
user = global.db.data.users[m.sender]
bot = global.db.data.settings[this.user.jid] || {}

if (bot.antiPrivate && !isOwner && !isROwner) {
if (user.counterPrivate === 0) {
//mensaje = `*@${m.sender.split`@`[0]} 𝙀𝙎𝙏𝘼 𝙋𝙍𝙊𝙃𝙄𝘽𝙄𝘿𝙊 𝙀𝙎𝘾𝙍𝙄𝘽𝙄𝙍 𝘼𝙇 𝙋𝙍𝙄𝙑𝘼𝘿𝙊 𝘿𝙀𝙇 𝘽𝙊𝙏.*\n\n⚠️ \`\`\`𝐏𝐑𝐈𝐌𝐄𝐑𝐀 𝐀𝐃𝐕𝐄𝐑𝐓𝐄𝐍𝐂𝐈𝐀\`\`\` ⚠️`
await conn.reply(m.chat, mid.smsprivado(m), m, { mentions: [m.sender] })  
  
} else if (user.counterPrivate === 1) {
let grupos = redesMenu
//mensaje = `*@${m.sender.split`@`[0]} 𝙎𝙀 𝘼 𝙈𝙀𝙉𝘾𝙄𝙊𝙉𝘼𝘿𝙊 𝘼𝙉𝙏𝙀𝙍𝙄𝙊𝙍𝙈𝙀𝙉𝙏𝙀 𝙌𝙐𝙀 𝙉𝙊 𝙎𝙀 𝙇𝙀 𝙋𝙐𝙀𝘿𝙀 𝙀𝙎𝘾𝙍𝙄𝘽𝙄𝙍 𝘼𝙇 𝘽𝙊𝙏 𝙀𝙉 𝙋𝙍𝙄𝙑𝘼𝘿𝙊 🫤*\n\n👇 𝙋𝙐𝙀𝘿𝙀 𝙐𝙉𝙄𝙍𝙎𝙀 𝘼 𝙉𝙐𝙀𝙎𝙏𝙍𝙊 𝙂𝙍𝙐𝙋𝙊 𝙋𝘼𝙍𝘼 𝙐𝙎𝘼𝙍 𝙀𝙇 𝘽𝙊𝙏\n\n${grupos}\n\n𝙎𝙄 𝙑𝙐𝙀𝙇𝙑𝙀 𝘼 𝙀𝙎𝘾𝙍𝙄𝘽𝙄𝙍 𝘼𝙇 𝙋𝙍𝙄𝙑𝘼𝘿𝙊 𝘿𝙀𝙇 𝘽𝙊𝙏,𝙎𝙀𝙍𝘼́ 𝘽𝙇𝙊𝙌𝙐𝙀𝘼𝘿𝙊‼️\n\n⚠️ \`\`\`𝐒𝐄𝐆𝐔𝐍𝐃𝐀 𝐀𝐃𝐕𝐄𝐑𝐓𝐄𝐍𝐂𝐈𝐀\`\`\` ⚠️`
await conn.reply(m.chat, mid.smsprivado1(m, grupos), m, { mentions: [m.sender] }) 
  
} else if (user.counterPrivate === 2) {
//mensaje = `*@${m.sender.split`@`[0]} 𝙎𝙀𝙍𝘼́́ 𝘽𝙇𝙊𝙌𝙐𝙀𝘼𝘿𝙊(𝘼) 𝘿𝙀𝙇 𝘽𝙊𝙏. 😾 𝙎𝙀 𝙈𝙀𝙉𝘾𝙄𝙊𝙉𝙊́ 𝘼𝙉𝙏𝙀𝙍𝙄𝙊𝙍𝙈𝙀𝙉𝙏𝙀 𝙌𝙐𝙀 𝙉𝙊 𝙎𝙀 𝙋𝙊𝘿𝙄𝘼 𝙀𝙎𝘾𝙍𝙄𝘽𝙄𝙍 𝘼𝙇 𝙋𝙍𝙄𝙑𝘼𝘿𝙊.*\n\n⚠️ \`\`\`𝐓𝐄𝐑𝐂𝐄𝐑𝐀 𝐀𝐃𝐕𝐄𝐑𝐓𝐄𝐍𝐂𝐈𝐀\`\`\` ⚠️`
await conn.reply(m.chat, mid.smsprivado2(m), m, { mentions: [m.sender] }) 
  
user.counterPrivate = -1
await this.updateBlockStatus(m.sender, 'block')
}
user.counterPrivate++
}
return !1
}
export default handler
