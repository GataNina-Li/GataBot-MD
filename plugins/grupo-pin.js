let handler = async (m, { conn, command }) => {
if (!m.quoted) return m.reply(`⚠️ Responde a un mensaje para ${command === 'pin' ? 'fijarlo' : 'desfijarlo'}.`);
try {
let messageKey = {remoteJid: m.chat,
fromMe: m.quoted.fromMe,
id: m.quoted.id,
participant: m.quoted.sender
};

if (command === 'pin' || command === 'fijar') {
await conn.sendMessage(m.chat, { pin: messageKey,type: 1, time: 604800 })
//conn.sendMessage(m.chat, {pin: {type: 1, time: 604800, key: messageKey }});
m.react("✅️")
}
   
if (command === 'unpin' || command === 'desfijar') {
await conn.sendMessage(m.chat, { pin: messageKey,type: 2, time: 86400 })
//conn.sendMessage(m.chat, { pin: { type: 0, key: messageKey }});
m.react("✅️")
}

if (command === 'destacar') {
conn.sendMessage(m.chat, {keep: messageKey, type: 1, time: 15552000 })
m.react("✅️")
}

if (command === 'desmarcar') {
conn.sendMessage(m.chat, {keep: messageKey, type: 2, time: 86400 })
m.react("✅️")
}
} catch (error) {
console.error(error);
}};
handler.help = ['pin']
handler.tags = ['group']
handler.command = ['pin', 'fijar', 'unpin', 'desfijar', 'destacar', 'desmarcar'] 
handler.admin = true
handler.group = true
handler.botAdmin = true
handler.register = true 
export default handler
