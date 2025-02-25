let handler = async (m, { conn, command }) => {
if (!m.quoted) return m.reply(`⚠️ Responde a un mensaje para ${command === 'pin' ? 'fijarlo' : 'desfijarlo'}.`);
try {
let messageKey = {
remoteJid: m.chat,
fromMe: m.quoted.fromMe,
id: m.quoted.id,
participant: m.quoted.sender
};

if (command === 'pin' || command === 'fijar') {
await conn.sendMessage(m.chat, {pin: {type: 1, time: 604800, key: messageKey }});
m.reply('✅ Mensaje fijado correctamente.');
}
   
if (command === 'unpin' || command === 'desfijar') {
await conn.sendMessage(m.chat, { pin: { type: 0, key: messageKey }});
m.reply('✅ Mensaje desfijado correctamente.');
}} catch (error) {
console.error(error);
}};
handler.command = ['pin', 'fijar', 'unpin', 'desfijar'];
handler.admin = true; 
handler.group = true;
handler.botAdmin = true; 
export default handler;
