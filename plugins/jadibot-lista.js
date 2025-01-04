import ws from 'ws'
async function handler(m, { conn: _envio, usedPrefix, command }) {
const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]

const message = users.map((v, index) => `👤 \`[${index + 1}]\` *${v.user.name || global.db.data.users[v.user.jid]?.name || 'Anónimo' }*
⏱️ \`\`\`${v.uptime ? convertirMs(Date.now() - v.uptime) : "Desconocido"}\`\`\`
🐈 wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}serbot%20code`).join('\n\n∵ ∵ ∵ ∵ ∵ ∵ ∵ ∵ ∵ ∵\n\n')
const replyMessage = message.length === 0 ? '*NO HAY SUB BOTS DISPONIBLE. VERIFIQUE MÁS TARDE.*' : message
const totalUsers = users.length;
const responseMessage = `😺 𝙇𝙄𝙎𝙏𝘼 𝘿𝙀 𝙎𝙐𝘽𝘽𝙊𝙏𝙎 (𝙎𝙀𝙍𝘽𝙊𝙏/𝙅𝘼𝘿𝙄𝘽𝙊𝙏) 𝘼𝘾𝙏𝙄𝙑𝙊𝙎\n\n🙌 𝙋𝙐𝙀𝘿𝙀𝙎 𝘾𝙊𝙉𝙏𝘼𝘾𝙏𝘼𝙍𝙇𝙊𝙎 𝙋𝘼𝙍𝘼 𝙋𝙀𝘿𝙄𝙍 𝙌𝙐𝙀 𝙎𝙀 𝙐𝙉𝘼𝙉 𝘼 𝙏𝙐 𝙂𝙍𝙐𝙋𝙊, 𝙎𝙀 𝙍𝙀𝙎𝙋𝙀𝙏𝙐𝙊𝙎𝙊\n\n❕ 𝙎𝙄 𝙀𝙇 𝙏𝙀𝙓𝙏𝙊 𝘼𝙋𝘼𝙍𝙀𝘾𝙀 𝙀𝙉 𝘽𝙇𝘼𝙉𝘾𝙊 𝙎𝙄𝙂𝙉𝙄𝙁𝙄𝘾𝘼 𝙌𝙐𝙀 𝙉𝙊 𝙃𝘼𝙔 𝙎𝙐𝘽𝘽𝙊𝙏𝙎 𝘼𝘾𝙏𝙄𝙑𝙊𝙎\n\n❗ 𝘾𝘼𝘿𝘼 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 𝙎𝙐𝘽 𝘽𝙊𝙏 𝙈𝘼𝙉𝙀𝙅𝘼 𝙇𝘼 𝙁𝙐𝙉𝘾𝙄𝙊𝙉 𝘾𝙊𝙈𝙊 𝙌𝙐𝙄𝙀𝙍𝘼, 𝙀𝙇 𝙉𝙐𝙈𝙀𝙍𝙊 𝙋𝙍𝙄𝙉𝘾𝙄𝙋𝘼𝙇 𝙉𝙊 𝙎𝙀 𝙃𝘼𝘾𝙀 𝙍𝙀𝙎𝙋𝙊𝙉𝙎𝘼𝘽𝙇𝙀\n\n🤖 𝙎𝙐𝘽 𝘽𝙊𝙏𝙎 𝘾𝙊𝙉𝙀𝘾𝙏𝘼𝘿𝙊 : ${totalUsers || '0'}\n\n${replyMessage.trim()}`.trim();
await _envio.sendMessage(m.chat, {text: responseMessage, mentions: _envio.parseMention(responseMessage)}, {quoted: m})}

handler.command = /^(listjadibots|bots|subsbots)$/i
export default handler

function convertirMs(ms) {
const s = Math.floor(ms / 1000) % 60
const m = Math.floor(ms / 60000) % 60
const h = Math.floor(ms / 3600000) % 24
const d = Math.floor(ms / 86400000)
return [
d > 0 ? `${d}d` : "",
h > 0 ? `${h}h` : "",
m > 0 ? `${m}m` : "",
s > 0 ? `${s}s` : ""
].filter(Boolean).join(" ") || "0s"
}
