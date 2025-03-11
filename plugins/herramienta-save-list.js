let handler = async (m, { conn }) => {
const chat = global.db.data.chats[m.chat];
if (!chat?.savedContent || Object.keys(chat.savedContent).length === 0) return m.reply('⚠️ *No hay contenido guardado en este grupo.*');

let list = '📋 *LISTA DE CONTENIDO GUARDADO:*\n\n';
Object.entries(chat.savedContent).forEach(([keyword, data], index) => {
list += `*${index + 1}.* 🗝️ *Palabra:* ${keyword}\n📦 *Tipo:* ${data.type}\n${data.caption ? `📝 *Pie de foto:* ${data.caption}\n` : ''}\n`;
});

await conn.sendMessage(m.chat, { text: list,mentions: Object.values(chat.savedContent).map(x => x.mentions).flat() }, { quoted: m });
};
handler.command = /^(listar|listacmd|lista)$/i;
handler.group = true;
export default handler;