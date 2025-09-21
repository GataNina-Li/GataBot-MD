import ws from 'ws'
const comandos =
/piedra|papel|tijera|estado|verificar|code|jadibot --code|--code|creadora|bottemporal|grupos|instalarbot|términos|bots|deletebot|eliminarsesion|serbot|verify|register|registrar|reg|reg1|nombre|name|nombre2|name2|edad|age|edad2|age2|genero|género|gender|identidad|pasatiempo|hobby|identify|finalizar|pas2|pas3|pas4|pas5|registroc|deletesesion|registror|jadibot/i

export async function before(m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender] || {}
let setting = global.db.data.settings[this.user.jid]
const settingsREAD = global.db.data.settings[this.user.jid] || {}
if (!setting.prefix) return
let prefixRegex = new RegExp('^[' + setting.prefix.replace(/[|\\{}()[\]^$+*.\-\^]/g, '\\$&') + ']')
const users = [
...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])
]
const participants = m.isGroup ? (await conn.groupMetadata(m.chat).catch(() => ({participants: []}))).participants : []
let numBot = typeof conn.user?.lid === 'string' ? conn.user.lid.replace(/:.*/, '') : (conn.user?.jid || '').replace(/:.*/, '')
let numBot2 = typeof global.conn.user?.lid === 'string' ? global.conn.user.lid.replace(/:.*/, '') : (global.conn.user?.jid || '').replace(/:.*/, '')
const detectwhat = m.sender.includes('@lid') ? `${numBot2}@lid` : global.conn.user.jid
const detectwhat2 = m.sender.includes('@lid') ? `${numBot}@lid` : conn.user.jid

const mainBotInGroup = participants.some((p) => p.id === detectwhat)
const primaryBot = chat.primaryBot
const primaryBotConnected = users.some((conn) => detectwhat2 === primaryBot)
const primaryBotInGroup = participants.some((p) => p.id === primaryBot)

//contando de mensaje
if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}
if (!global.db.data.users[m.sender].mensaje) global.db.data.users[m.sender].mensaje = {}
if (!global.db.data.users[m.sender].mensaje[m.chat]) global.db.data.users[m.sender].mensaje[m.chat] = 0
global.db.data.users[m.sender].mensaje[m.chat]++

if (m.isGroup) {
if (primaryBot) {
if (primaryBotConnected && primaryBotInGroup) {
if (detectwhat2 !== primaryBot) throw !1
} else if (mainBotInGroup) {
if (detectwhat2 !== detectwhat) throw !1
}
}
}

if (m.fromMe) return
if (m.isGroup) return !1
if (!m.message) return !0
if (m.chat === '120363336642332098@newsletter') return
const regexWithPrefix = new RegExp(`^${prefixRegex.source}\\s?${comandos.source}`, 'i')
if (regexWithPrefix.test(m.text.toLowerCase().trim())) return !0
if (!user.warnPv) user.warnPv = false

//antipv
if (setting.antiPrivate && !isOwner && !isROwner) {
if (user.warnPv) {
console.log('[ANTIPRIVATE]')
throw !0
}

if (!user.warnPv) {
await conn.sendPresenceUpdate('composing', m.chat)
await conn.readMessages([m.key])
await conn.reply(m.chat, mid.mAdvertencia + mid.smsprivado(m, cuentas), m, {mentions: [m.sender]})
user.warnPv = true
throw !0
}
}

//autoread
if (m.text && prefixRegex.test(m.text)) {
//this.sendPresenceUpdate('composing', m.chat)
this.readMessages([m.key])

let usedPrefix = m.text.match(prefixRegex)[0]
let command = m.text.slice(usedPrefix.length).trim().split(' ')[0]
}
}
