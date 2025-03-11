// Código elaborado por: https://github.com/elrebelde21

import uploadFile from '../lib/uploadFile.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw `⚠️ *Uso:*\n${usedPrefix + command} <palabra clave> (responde a contenido)\n${usedPrefix + command} <texto> - <palabra clave>`;

let content = {}, keyword, caption; 
const q = m.quoted;
const splitText = text.split(/[-|,]/).map(s => s.trim());
const hasSeparator = splitText.length > 1;

if (q) {
const isMedia = ['image', 'video', 'sticker', 'audio'].some(type => q.mimetype?.startsWith(type));
keyword = hasSeparator ? splitText[1] : text;
caption = hasSeparator ? splitText[0] : q.caption || '';

if (isMedia) {
const buffer = await q.download();
content = { type: (q.mtype === 'stickerMessage' || (q.mimetype === 'image/webp' && typeof q.isAnimated !== 'undefined')) ? 'sticker' : 
q.mimetype.startsWith('image') ? 'image' : 
q.mimetype.startsWith('video') ? 'video' : 
q.mimetype.startsWith('audio') ? 'audio' : 'sticker',
data: buffer.toString('base64'),
caption: caption,
isAnimated: q.mimetype === 'image/webp' ? q.isAnimated || false : false
};      
} else if (q.text) {
content = { type: 'text',
value: hasSeparator ? splitText[0] : q.text,
mentions: q.mentionedJid || []
};
keyword = hasSeparator ? splitText[1] : text;
}
} else {
if (!hasSeparator) throw `⚠️ Formato incorrecto: ${usedPrefix}guardar <texto> - <palabra clave>`;
content = { type: 'text',
value: splitText[0],
mentions: []
};
keyword = splitText[1];
}

if (!content.type) throw '⚠️ Tipo de contenido no soportado';
if (!global.db.data.chats[m.chat].savedContent) global.db.data.chats[m.chat].savedContent = {};
  global.db.data.chats[m.chat].savedContent[keyword.toLowerCase()] = content;

await m.reply(`✅ *${keyword}* guardado. Úsalo en el chat.`);
await m.react("✅");
};
handler.command = /^(guardar|save)$/i;
handler.group = true;
export default handler;