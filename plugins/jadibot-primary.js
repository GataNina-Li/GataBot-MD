import ws from 'ws';

let handler = async (m, { conn, usedPrefix, args }) => {
if (!args[0] && !m.quoted) 
return m.reply(`⚠️ Menciona el número de un bot o responde al mensaje de un bot.\n> • Ejemplo: *${usedPrefix}setprimary @tag*`);

const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
let botJid;
let selectedBot;

if (m.mentionedJid && m.mentionedJid.length > 0) {
botJid = m.mentionedJid[0];
} else if (m.quoted) {
botJid = m.quoted.sender;
} else {
botJid = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
} if (botJid === conn.user.jid || global.conn.user.jid) {
selectedBot = conn;
} else {
selectedBot = users.find(conn => conn.user.jid === botJid);
}

if (!selectedBot) 
return m.reply("⚠️ El bot no es un bot de la misma sessión, verifica los bots conectados, usando */bots*.");

let chat = global.db.data.chats[m.chat];
chat.primaryBot = botJid; 
conn.sendMessage(m.chat, { text: `✅ El bot @${botJid.split('@')[0]} ha sido establecido como primario en este grupo. Los demás bots no responderán aquí.`, mentions: [botJid]}, { quoted: m });
};

handler.help = ['setprimary <@tag>'];
handler.tags = ['jadibot'];
handler.command = ['setprimary'];
handler.group = true;

export default handler;