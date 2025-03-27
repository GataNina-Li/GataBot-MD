import { proto, generateWAMessage, areJidsSameUser } from '@whiskeysockets/baileys';
import { webp2png } from '../lib/webp2mp4.js';
import fs from 'fs';
import path from 'path';

const globalContentFile = path.join(process.cwd(), './database/globalContent.json');

function loadGlobalContent() {
  try {
    if (fs.existsSync(globalContentFile)) {
      const data = fs.readFileSync(globalContentFile, 'utf8');
      return JSON.parse(data);
    }
    return {};
  } catch (e) {
    console.error(`Error al cargar globalContent.json: ${e}`);
    return {};
  }
}

export async function all(m, chatUpdate) {
if (m.isBaileys) return;
global.db.data = global.db.data || {};
global.db.data.chats = global.db.data.chats || {};
global.db.data.sticker = global.db.data.sticker || {};

if (!global.db.data.chats[m.chat]) {
global.db.data.chats[m.chat] = { savedContent: {} };
}
const chat = global.db.data.chats[m.chat];
const globalContent = loadGlobalContent();

if (m.text && !m.isCommand && m.mtype !== 'protocolMessage' && !m.text.startsWith('.')) {
const keyword = m.text.toLowerCase().trim();
const content = chat.savedContent?.[keyword] || globalContent?.[keyword];

if (!content || typeof content !== 'object') return;
if (!content.type) return;
console.log(`🔥 Palabra clave detectada: "${keyword}"`);
try {
const options = { quoted: m };
switch (content.type) {
case 'sticker':
if (content.data) {
const stickerBuffer = Buffer.from(content.data, 'base64');
await this.sendFile(m.chat, stickerBuffer, 'sticker.webp', '', m, content.isAnimated || false, { contextInfo: { forwardingScore: 200, isForwarded: false, externalAdReply: { showAdAttribution: false, title: gt, body: vs, mediaType: 2, sourceUrl: all, thumbnail: imagen }}})
}
break;
case 'image': case 'video': case 'audio':
if (content.data) {
const buffer = Buffer.from(content.data, 'base64');
await this.sendMessage(m.chat, { [content.type]: buffer, caption: content.caption || '' }, options);
}
break;
case 'text':
if (content.value) {
await m.reply(content.value);
}
break;
default:
return;
}} catch (e) {
console.error(`Error al procesar contenido: ${e}`);
}
return;
}

  if (m.message && m.msg?.fileSha256) {
    const hash = Buffer.from(m.msg.fileSha256).toString('base64');
    if (global.db.data.sticker?.[hash]) {
      const commandData = global.db.data.sticker[hash];
      const { text, mentionedJid, chat: commandChat } = commandData || {};

      if (commandChat === undefined || commandChat === m.chat) {
        const messages = await generateWAMessage(m.chat, { text, mentions: mentionedJid }, {
          userJid: m.conn.user.id,
          quoted: m.quoted && m.quoted.fakeObj,
        });
        messages.key.fromMe = areJidsSameUser(m.sender, m.conn.user.jid);
        messages.key.id = m.key.id;
        messages.pushName = m.pushName;
        if (m.isGroup) messages.participant = m.sender;
        const msg = {
          ...chatUpdate,
          messages: [proto.WebMessageInfo.fromObject(messages)],
          type: 'append',
        };
        m.conn.ev.emit('messages.upsert', msg);
      }
    }
  }
}
