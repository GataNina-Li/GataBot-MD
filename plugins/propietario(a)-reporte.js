//Código elaborado por: https://github.com/elrebelde21 

const OWNER1 = "5214774444444@s.whatsapp.net";
const OWNER2 = "593968263524@s.whatsapp.net";
const ACTIVE_CONVERSATIONS = {};

let handler = async (m, { conn, text, command }) => {
let activeConversation = Object.entries(ACTIVE_CONVERSATIONS).find(([id, convo]) => convo.active && convo.userId === m.sender && convo.chatId === m.chat);

if (activeConversation) {
let [reportId, conversation] = activeConversation;

await conn.sendMessage(OWNER1, {text: `📩 *Mensaje del usuario @${m.sender.split("@")[0]} (ID: ${reportId}):*\n${text}`, mentions: [m.sender]}, { quoted: m });
await delay(1000)
await conn.sendMessage(OWNER2, {text: `📩 *Mensaje del usuario @${m.sender.split("@")[0]} (ID: ${reportId}):*\n${text}`, mentions: [m.sender]}, { quoted: m });
return; 
}

if (command === 'report' || command === 'reporte') {
if (!text && !m.quoted) return m.reply(`${mg}*𝙀𝙨𝙘𝙧𝙞𝙗𝙖 𝙚𝙡 𝙧𝙚𝙥𝙤𝙧𝙩𝙚*\n\n*𝙀𝙅𝙀𝙈𝙋𝙇𝙊:*\n*${usedPrefix + command} el comando ${usedPrefix}infobot no funciona.*\n\n*𝙒𝙧𝙞𝙩𝙚 𝙩𝙝𝙚 𝙧𝙚𝙥𝙤𝙧𝙩*\n\n*𝙀𝙓𝘼𝙈𝙋𝙇𝙀:*\n*${usedPrefix + command} the command ${usedPrefix}owner it does not work.*`);
if (text.length < 8) throw `${fg} ✨ *Mínimo 10 caracteres para hacer El Reporte.*\n\n✨ *Minimum 10 characters to make the Report.*`
if (text.length > 1000) throw `${fg} 😼 *Máximo 1000 caracteres para hacer El Reporte.*\n\n😼 *Maximum 1000 characters to make the Report.*`
    
let reportId = Math.floor(Math.random() * 901);

ACTIVE_CONVERSATIONS[reportId] = {
userId: m.sender,
userName: m.pushName || 'Usuario desconocido',
active: true,
chatId: m.chat };

let reportText = text || (m.quoted && m.quoted.text);
let ownerMessage = `*╭━━[ 𝙍𝙀𝙋𝙊𝙍𝙏𝙀 | 𝙍𝙀𝙋𝙊𝙍𝙏 ]━━━⬣*\n*┃*\n*┃* *𝙉𝙐𝙈𝙀𝙍𝙊 | 𝙉𝙐𝙈𝘽𝙀𝙍*\n┃ ✦ Wa.me/${m.sender.split("@")[0]}\n*┃*\n*┃* *𝙈𝙀𝙉𝙎𝘼𝙅𝙀 | 𝙈𝙀𝙎𝙎𝘼𝙂𝙀*\n*┃* ✦ ${reportText}\n*┃*\n*╰━━━━━━━━━━━━━━━━━━⬣*\n\n> Responde al mensaje con: *"responder ${reportId} [mensaje]"* para interactuar con el usuarios.\n> Usa *.fin ${reportId}* para finalizar la conversación.`;

await conn.sendMessage(OWNER1, { text: ownerMessage, mentions: [m.sender] }, { quoted: m });
await delay(1000)
await conn.sendMessage(OWNER2, { text: ownerMessage, mentions: [m.sender] }, { quoted: m });
await conn.reply(m.chat, `╰⊱💚⊱ *𝙀́𝙓𝙄𝙏𝙊 | 𝙎𝙐𝘾𝘾𝙀𝙎𝙎* ⊱💚⊱╮\n\n*El reporte ha sido enviado a mí Creadora. Tendrá una respuesta pronto. De ser Falso será Ignorado el reporte.*\n\n*The report has been sent to my Creator. You will have an answer soon. If false, the report will be ignored.*`);
return;
}};

handler.before = async (m, { conn }) => {
let activeConversation = Object.entries(ACTIVE_CONVERSATIONS).find(([id, convo]) => convo.active && convo.userId === m.sender && convo.chatId === m.chat );

if (activeConversation && m.text) {
let [reportId] = activeConversation;

await conn.sendMessage(OWNER1, { text: `*📩 Respuesta del usuario @${m.sender.split("@")[0]} (ID: ${reportId}):*\n${m.text}`, mentions: [m.sender] }, { quoted: m });
await delay(1000)
await conn.sendMessage(OWNER2, { text: `*📩 Respuesta del usuario @${m.sender.split("@")[0]} (ID: ${reportId}):*\n${m.text}`, mentions: [m.sender] }, { quoted: m });
return false; 
}

let matchResponder = m.text.match(/^responder (\S+) (.+)/i);
if (matchResponder) {
let [_, reportId, ownerMessage] = matchResponder;

if (!ACTIVE_CONVERSATIONS[reportId] || !ACTIVE_CONVERSATIONS[reportId].active) return await conn.reply(m.chat, `⚠️ No se encontró ninguna conversación activa con ese ID.`, m);

let { userId } = ACTIVE_CONVERSATIONS[reportId];
await conn.reply(userId, `💬 *Respuesta de staff:*\n${ownerMessage}`);
return;
}

if (m.quoted && m.quoted.text) {
let quotedTextMatch = m.quoted.text.match(/ID: (\d+)/); 
if (quotedTextMatch) {
let reportId = quotedTextMatch[1];
if (ACTIVE_CONVERSATIONS[reportId] && ACTIVE_CONVERSATIONS[reportId].active) {
let { userId } = ACTIVE_CONVERSATIONS[reportId];
await conn.reply(userId, `💬 *Respuesta de staff:*\n${m.text}`);
return;
}}}

let matchFin = m.text.match(/^\.fin (\S+)/i);
if (matchFin) {
let [_, reportId] = matchFin;

if (!ACTIVE_CONVERSATIONS[reportId]) return await conn.reply(m.chat, `⚠️ No se encontró ninguna conversación activa con ese ID.`, m);

let { userId } = ACTIVE_CONVERSATIONS[reportId];
ACTIVE_CONVERSATIONS[reportId].active = false;
await conn.reply(userId, `🔒 *La conversación ha sido cerrada por el propietario.*`);
await conn.reply(m.chat, `✔️ Conversación ${reportId} cerrada.`);
return;
}};

handler.help = ['reporte', 'request'].map(v => v + ' <teks>')
handler.tags = ['info']
handler.exp = 25 
handler.command = /^(report|request|reporte|bugs|bug|report-owner|reportes|reportar)$/i 
export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/*
let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw `${mg}*𝙀𝙨𝙘𝙧𝙞𝙗𝙖 𝙚𝙡 𝙧𝙚𝙥𝙤𝙧𝙩𝙚*\n\n*𝙀𝙅𝙀𝙈𝙋𝙇𝙊:*\n*${usedPrefix + command} el comando ${usedPrefix}infobot no funciona.*\n\n*𝙒𝙧𝙞𝙩𝙚 𝙩𝙝𝙚 𝙧𝙚𝙥𝙤𝙧𝙩*\n\n*𝙀𝙓𝘼𝙈𝙋𝙇𝙀:*\n*${usedPrefix + command} the command ${usedPrefix}owner it does not work.*`
if (text.length < 8) throw `${fg} ✨ *Mínimo 10 caracteres para hacer El Reporte.*\n\n✨ *Minimum 10 characters to make the Report.*`
if (text.length > 1000) throw `${fg} 😼 *Máximo 1000 caracteres para hacer El Reporte.*\n\n😼 *Maximum 1000 characters to make the Report.*`
let teks = `*╭━━[ 𝙍𝙀𝙋𝙊𝙍𝙏𝙀 | 𝙍𝙀𝙋𝙊𝙍𝙏 ]━━━⬣*\n*┃*\n*┃* *𝙉𝙐𝙈𝙀𝙍𝙊 | 𝙉𝙐𝙈𝘽𝙀𝙍*\n┃ ✦ Wa.me/${m.sender.split`@`[0]}\n*┃*\n*┃* *𝙈𝙀𝙉𝙎𝘼𝙅𝙀 | 𝙈𝙀𝙎𝙎𝘼𝙂𝙀*\n*┃* ✦ ${text}\n*┃*\n*╰━━━━━━━━━━━━━━━━━━⬣*`
conn.reply('593968263524@s.whatsapp.net', m.quoted ? teks + m.quoted.text : teks, null, {
contextInfo: { mentionedJid: [m.sender] }})
conn.reply('573147616444@s.whatsapp.net', m.quoted ? teks + m.quoted.text : teks, null, {
contextInfo: { mentionedJid: [m.sender] }})
m.reply(`╰⊱💚⊱ *𝙀́𝙓𝙄𝙏𝙊 | 𝙎𝙐𝘾𝘾𝙀𝙎𝙎* ⊱💚⊱╮\n\n*El reporte ha sido enviado a mí Creadora. Tendrá una respuesta pronto. De ser Falso será Ignorado el reporte.*\n\n*The report has been sent to my Creator. You will have an answer soon. If false, the report will be ignored.*`)
}
handler.help = ['reporte', 'request'].map(v => v + ' <teks>')
handler.tags = ['info']
handler.exp = 25 
handler.command = /^(report|request|reporte|bugs|bug|report-owner|reportes|reportar)$/i 
export default handler
*/