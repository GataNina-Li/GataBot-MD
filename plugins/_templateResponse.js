/**
 * @type {import('@whiskeysockets/baileys')}
 */
const {proto, generateWAMessage, areJidsSameUser} = (await import('@whiskeysockets/baileys')).default

export async function all(m, chatUpdate) {
if (m.isBaileys || !m.message) return

const interactiveMsg =
m.message.buttonsResponseMessage || m.message.templateButtonReplyMessage || m.message.listResponseMessage || m.message.interactiveResponseMessage

if (!interactiveMsg) return

let id = null

try {
if (m.message.buttonsResponseMessage) {
id = m.message.buttonsResponseMessage.selectedButtonId
} else if (m.message.templateButtonReplyMessage) {
id = m.message.templateButtonReplyMessage.selectedId
} else if (m.message.listResponseMessage) {
id = m.message.listResponseMessage.singleSelectReply?.selectedRowId
} else if (m.message.interactiveResponseMessage) {
const paramsJson = m.message.interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson || '{}'
const params = JSON.parse(paramsJson)
id = params.id || params.cmd || params.command || null
}
} catch (e) {
return
}

if (!id) return

const text =
m.message.buttonsResponseMessage?.selectedDisplayText ||
m.message.templateButtonReplyMessage?.selectedDisplayText ||
m.message.listResponseMessage?.title ||
''

let isIdMessage = false
let usedPrefix = null

for (const name in global.plugins) {
const plugin = global.plugins[name]
if (!plugin || plugin.disabled) continue
if (!opts['restrict'] && plugin.tags?.includes('admin')) continue
if (typeof plugin !== 'function' || !plugin.command) continue

const str2Regex = (str) => {
if (typeof str !== 'string') return ''
return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
}

const _prefix = plugin.customPrefix || this.prefix || global.prefix || '.'
const prefixes = Array.isArray(_prefix) ? _prefix : [_prefix]

for (const p of prefixes) {
const prefixRegex = p instanceof RegExp ? p : new RegExp(`^${str2Regex(p)}`)
if (!prefixRegex.test(id)) continue

const noPrefix = id.replace(prefixRegex, '').trim()
const [command] = noPrefix.split(/\s+/)
const cmd = (command || '').toLowerCase()

let isMatch = false
if (plugin.command instanceof RegExp) {
isMatch = plugin.command.test(cmd)
} else if (Array.isArray(plugin.command)) {
isMatch = plugin.command.some((c) => (c instanceof RegExp ? c.test(cmd) : c === cmd))
} else if (typeof plugin.command === 'string') {
isMatch = plugin.command === cmd
}

if (isMatch) {
isIdMessage = true
break
}
}

if (isIdMessage) break
}

if (!isIdMessage) return

const messages = await generateWAMessage(
m.chat,
{text: id, mentions: m.mentionedJid},
{
userJid: this.user.id,
quoted: m.quoted && m.quoted.fakeObj
}
)

messages.key.fromMe = areJidsSameUser(m.sender, this.user.id)
messages.key.id = m.key.id
messages.pushName = m.name

if (m.isGroup) {
messages.key.participant = messages.participant = m.sender
}

const msg = {
...chatUpdate,
messages: [proto.WebMessageInfo.fromObject(messages)].map((v) => ((v.conn = this), v)),
type: 'append'
}

this.ev.emit('messages.upsert', msg)
}
