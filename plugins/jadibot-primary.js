import ws from 'ws';

let handler = async (m, { conn, usedPrefix, args }) => {
if (!args[0]) return m.reply(`⚠️ Etiquetas en numero de algun bot\nEjemplo: ${usedPrefix}setprimary @tag`);

const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
let botJid;
let selectedBot;

if (m.mentionedJid && m.mentionedJid.length > 0) {
botJid = m.mentionedJid[0];
if (botJid === conn.user.jid || global.conn.user.jid) {
selectedBot = conn;
} else {
selectedBot = users.find(conn => conn.user.jid === botJid);
}} 
else {
botJid = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
if (botJid === conn.user.jid) {
selectedBot = conn;
} else {
selectedBot = users.find(conn => conn.user.jid === botJid);
}}

if (!selectedBot) return m.reply("⚠️ No se encontró un bot conectado con esa mención o número. Usa /listjadibot para ver los bots disponibles.");
let chat = global.db.data.chats[m.chat];
chat.primaryBot = botJid; 
conn.sendMessage(m.chat, { text: `✅ El bot @${botJid.split('@')[0]} ha sido establecido como primario en este grupo. Los demás bots no responderán aquí.`, mentions: [botJid] }, { quoted: m });
};
handler.help = ['setprimary <@tag>'];
handler.tags = ['jadibot'];
handler.command = ['setprimary'];
handler.group = true;
handler.register = true;

export default handler;