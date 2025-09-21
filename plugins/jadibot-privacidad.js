let handler = async (m, {conn, usedPrefix, text, isBotAdmin}) => {
const isBot = global.conns.some((bot) => bot.user.jid === m.sender)
if (!isBot) return m.reply('⚠️ Este comando solo puede ser usado por Sub-Bot.')
const bot = global.conns.find((bot) => bot.user.jid === m.sender)
if (!bot) return m.reply('⚠️ No se pudo identificar el bot.')
const botConfig = global.db.data.users[bot.user.jid] || {}
const [option, value] = text.split(' ')
if (!option || !value)
return m.reply(
`⚠️ Uso: *${usedPrefix}setconfig <opción> <valor>*\n\nOpciones disponibles:\n- *privacy*: 1 (activar) / 0 (desactivar)\n- *prestar*: 1 (activar) / 0 (desactivar)`
)

if (option === 'privacy') {
if (value === '1') {
botConfig.privacy = true
await conn.sendMessage(m.chat, {text: '✅ *Privacidad activada.*\n> Tu número no se mostrará en la lista de bots.'}, {quoted: m})
} else if (value === '0') {
botConfig.privacy = false
await conn.sendMessage(m.chat, {text: '✅ *Privacidad desactivada.*\n> Tu número se mostrará en la lista de bots.'}, {quoted: m})
} else {
await conn.sendMessage(m.chat, {text: '⚠️ Valor no válido. Usa: *1* (activar) o *0* (desactivar).'}, {quoted: m})
}
} else if (option === 'prestar') {
if (value === '1') {
botConfig.prestar = true
await conn.sendMessage(m.chat, {text: '✅ *Prestar bot activado.*\n> Los usuarios pueden usar el bot para unirlo a grupos.'}, {quoted: m})
} else if (value === '0') {
botConfig.prestar = false
await conn.sendMessage(m.chat, {text: '✅ *Prestar bot desactivado.*\n> Los usuarios no podran unir el bot a grupos.'}, {quoted: m})
} else {
await conn.sendMessage(m.chat, {text: '⚠️ Valor no válido. Usa: *1* (activar) o *0* (desactivar).'}, {quoted: m})
}
}
global.db.data.users[bot.user.jid] = botConfig
}
handler.command = handler.help = ['setconfig']
handler.tags = ['jadibot']
handler.register = true
export default handler
