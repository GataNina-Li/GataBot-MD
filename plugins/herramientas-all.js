// Código elaborado por: https://github.com/elrebelde21

import { webp2png } from '../lib/webp2mp4.js';

export async function all(m) {
if (m.isCommand || !m.text || m.mtype === 'protocolMessage') return;
 
const chat = global.db.data.chats[m.chat];
if (!chat?.savedContent) return;
const keyword = m.text.toLowerCase().trim();
const content = chat.savedContent[keyword];

if (content) {
console.log(`🔥 Palabra clave detectada: "${keyword}"`);
try {
const options = { quoted: m };

switch (content.type) {
case 'sticker':
const stickerBuffer = Buffer.from(content.data, 'base64');         

await this.sendFile(m.chat, stickerBuffer, 'sticker.webp', '', m, content.isAnimated || false, {contextInfo: { forwardingScore: 200, isForwarded: false, externalAdReply: { showAdAttribution: false, title: gt, body: vs, mediaType: 2, sourceUrl: accountsgb, thumbnail: imagen1 }}});
break;

case 'image': case 'video': case 'audio':
const buffer = Buffer.from(content.data, 'base64');
await this.sendMessage(m.chat, { [content.type]: buffer, caption: content.caption }, options);
break;

case 'text':
await m.reply(content.value);
break;
}} catch (e) {
console.error(e);
}}
}