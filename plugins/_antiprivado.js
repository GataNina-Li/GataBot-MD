/*----------------------[ AUTOREAD ]-----------------------*/
let handler = m => m
handler.all = async function (m) {
let prefixRegex = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

let setting = global.db.data.settings[this.user.jid]
const settingsREAD = global.db.data.settings[this.user.jid] || {}

if (m.text && prefixRegex.test(m.text)) {
await this.sendPresenceUpdate('composing', m.chat)
await this.readMessages([m.key]) 
        
let usedPrefix = m.text.match(prefixRegex)[0]
let command = m.text.slice(usedPrefix.length).trim().split(' ')[0]
}} 

export default handler  

/*----------------------[ ANTIPRIVADO ]-----------------------*/
const comandos = /piedra|papel|tijera|estado|verificar|code|jadibot --code|--code|creadora|bottemporal|grupos|instalarbot|términos|bots|deletebot|eliminarsesion|serbot|verify|register|registrar|reg|reg1|nombre|name|nombre2|name2|edad|age|edad2|age2|genero|género|gender|identidad|pasatiempo|hobby|identify|finalizar|pas2|pas3|pas4|pas5|registroc|deletesesion|registror|jadibot/i

//let handler = m => m
handler.before = async function (m, { conn, isOwner, isROwner }) {
if (m.fromMe) return !0
if (m.isGroup) return !1
if (!m.message) return !0
const regexWithPrefix = new RegExp(`^${prefix.source}\\s?${comandos.source}`, 'i')
if (regexWithPrefix.test(m.text.toLowerCase().trim())) return !0

let chat, user, bot, mensaje
chat = global.db.data.chats[m.chat]
user = global.db.data.users[m.sender]
bot = global.db.data.settings[this.user.jid] || {}

if (bot.antiPrivate && !isOwner && !isROwner) {
return await conn.reply(m.chat, mid.mAdvertencia + mid.smsprivado(m, cuentas), m, { mentions: [m.sender] })  
await this.updateBlockStatus(m.sender, 'block')
}
return !1
}
//export default handler
