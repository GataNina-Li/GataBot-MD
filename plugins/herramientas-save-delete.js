let handler = async (m, { conn, text, usedPrefix, command }) => {
const chat = global.db.data.chats[m.chat];
if (!chat?.savedContent) return m.reply('⚠️ *No hay contenido guardado en este grupo.*');

if (text) {
const keyword = text.toLowerCase().trim();
if (!chat.savedContent[keyword]) throw '⚠️ *La palabra clave no existe.*';
delete chat.savedContent[keyword];
await m.reply(`✅ *${keyword}* eliminado correctamente.`);
await m.react("✅");
} else if (m.quoted) {
const quoted = m.quoted;
const targetKeyword = Object.keys(chat.savedContent).find(key => 
chat.savedContent[key]?.url === quoted.url || 
chat.savedContent[key]?.value === quoted.text
);
    
if (!targetKeyword) throw '⚠️ *El mensaje no está guardado.*';
delete chat.savedContent[targetKeyword];
await m.reply(`✅ *${targetKeyword}* eliminado correctamente.`);
await m.react("✅");
} else {
throw `⚠️ *Uso:* ${usedPrefix + command} <palabra clave> (o responde a un mensaje guardado)`;
}};
handler.command = /^(delsave)$/i;
handler.group = true;
export default handler;