let handler = m => m;

handler.before = async function (m, { conn, isAdmin, isOwner, isROwner }) {
const prefijosProhibidos = ['91', '92', '222', '93', '265', '61', '62', '966', '229', '40', '49', '20', '963', '967', '234', '210', '212'];
let chat = global.db.data.chats[m.chat];
let bot = global.db.data.settings[conn.user.jid] || {};
const senderNumber = m.sender.split('@')[0];
let user = global.db.data.users[m.sender];
if (!user) {
user = global.db.data.users[m.sender] = {
warn: 0,
banned: false
}}

if (m.chat === "120363297379773397@newsletter") return; 
if (m.chat === "120363355261011910@newsletter") return;
if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') ||  m.text.includes('menu') ||  m.text.includes('estado') || m.text.includes('bots') ||  m.text.includes('serbot') || m.text.includes('jadibot')) return !0

if (bot.anticommand) return 
if (user.banned) return !1;

if (prefijosProhibidos.some(prefijo => senderNumber.startsWith(prefijo))) {
await conn.reply(m.chat, mid.mAdvertencia + `@${m.sender.split`@`[0]} ha sido baneado, por orden de mi propietaria no pueden usar el bot.\n\n⚠️ \`\`\`Serás Bloqueado(a)\`\`\` ⚠️`, m);
user.banned = true;

return !1; 
}

return !0; 
};

export default handler;
