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

let handler = async (m, { conn, text, isOwner, usedPrefix, command}) => {
const chat = global.db.data.chats[m.chat] || { savedContent: {} };
const globalContent = loadGlobalContent();
let response = '';

if (text && text.toLowerCase().startsWith('get ')) {
const commandText = text.slice(4).trim().toLowerCase();
const commandEntry = Object.entries(global.db.data.sticker).find(([_, value]) => value.text === commandText);
if (!commandEntry) throw `${lenguajeGB['smsAvisoMG']()} 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙉𝙊 𝙀𝙓𝙄𝙎𝙏𝙀 𝙊 𝙉𝙊 𝙀𝙎𝙏Á 𝘼𝙎𝙄𝙂𝙉𝘼𝘿𝙊 𝘼 𝙐𝙉 𝙎𝙏𝙄𝘾𝙆𝙀𝙍.`
const [hash, commandData] = commandEntry;
const { data, isAnimated, chat: commandChat } = commandData;

if (commandChat !== null && commandChat !== m.chat && !isOwner) throw `${lenguajeGB['smsAvisoMG']()}𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙀𝙎 𝙇𝙊𝘾𝘼𝙇 𝘼 𝙊𝙏𝙍𝙊 𝘾𝙃𝘼𝙏 𝙔 𝙉𝙊 𝙏𝙄𝙀𝙉𝙀𝙎 𝙋𝙀𝙍𝙈𝙄𝙎𝙊 𝙋𝘼𝙍𝘼 𝙑𝙀𝙍𝙇𝙊.`
if (!data) throw `${lenguajeGB['smsAvisoMG']()}𝙉𝙊 𝙎𝙀 𝙀𝙉𝘾𝙊𝙉𝙏𝙍Ó 𝙀𝙇 𝙎𝙏𝙄𝘾𝙆𝙀𝙍 𝘼𝙎𝙊𝘾𝙸𝘼𝘿𝙊 𝘼 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊.`
const stickerBuffer = Buffer.from(data, 'base64');
await conn.sendFile(m.chat, stickerBuffer, 'sticker.webp', '', m, isAnimated || false, {
contextInfo: {
forwardingScore: 200,
isForwarded: false,
externalAdReply: {
showAdAttribution: false,
title: 'Sticker recuperado ' + gt, 
body: `Comando: ${commandText}`,
mediaType: 2,
sourceUrl: all,
thumbnail: imagen4,
}}
});
return;
}

if (chat.savedContent && Object.keys(chat.savedContent).length > 0) {
response += '📋 *𝘾𝙊𝙉𝙏𝙀𝙉𝙄𝘿𝙊 𝙂𝙐𝘼𝙍𝘿𝘼𝘿𝙊 𝙀𝙉 𝙀𝙎𝙏𝙀 𝘾𝙃𝘼𝙏:*\n\n';
Object.entries(chat.savedContent).forEach(([keyword, data], index) => {
response += `*${index + 1}.* 🗝️ *𝙋𝙖𝙡𝙖𝙗𝙧𝙖:* ${keyword}\n📦 *𝙏𝙞𝙥𝙤:* ${data.type}${data.caption ? `\n📝 *𝙋𝙞𝙚 𝙙𝙚 𝙛𝙤𝙩𝙤:* ${data.caption}` : ''}\n\n`;
});
} else {
response += `${lenguajeGB['smsAvisoMG']()}𝙉𝙊 𝙃𝘼𝙔 𝘾𝙊𝙉𝙏𝙀𝙉𝙄𝘿𝙊 𝙂𝙐𝘼𝙍𝘿𝘼𝘿𝙊 𝙀𝙉 𝙀𝙎𝙏𝙀 𝘾𝙃𝘼𝙏.\n\n`
}

const localCommands = Object.entries(global.db.data.sticker).filter(([_, value]) => value.chat === m.chat);
if (localCommands.length > 0) {
response += `ღ 𝙇𝙄𝙎𝙏𝘼 𝘿𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊/𝙏𝙀𝙓𝙏𝙊𝙎 𝘼𝙎𝙄𝙂𝙉𝘼𝘿𝙊𝙎 𝙇𝙊𝘾𝘼𝙇𝙀𝙎\n\n${localCommands.map(([key, value], index) => `*${index + 1}.-*\n*ღ 𝘾𝙊𝘿𝙄𝙂𝙊:* ${value.locked ? `_*(𝚋𝚕𝚘𝚚𝚞𝚎𝚊𝚍𝚘)*_ ${key}` : key}\n*ღ 𝘾𝙊𝙈𝘼𝙉𝘿𝙊/𝙏𝙀𝙓𝙏𝙊𝙎:* ${value.text}`).join('\n\n')}\n\n`;
}

if (isOwner) {
if (Object.keys(globalContent).length > 0) {
response += '🌐 *𝘾𝙊𝙉𝙏𝙀𝙉𝙄𝘿𝙊 𝙂𝙇𝙊𝘽𝘼𝙇:*\n\n';
Object.entries(globalContent).forEach(([keyword, data], index) => {
response += `*${index + 1}.* 🗝️ *𝙋𝙖𝙡𝙖𝙗𝙧𝙖:* ${keyword}\n📦 *𝙏𝙞𝙥𝙤:* ${data.type}${data.caption ? `\n📝 *𝙋𝙞𝙚 𝙙𝙚 𝙛𝙤𝙩𝙤:* ${data.caption}` : ''}\n\n`;
});
}
const globalCommands = Object.entries(global.db.data.sticker).filter(([_, value]) => value.chat === null);
if (globalCommands.length > 0) {
response += `ღ 𝙇𝙄𝙎𝙏𝘼 𝘿𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊/𝙏𝙀𝙓𝙏𝙊𝙎 𝘼𝙎𝙄𝙂𝙉𝘼𝘿𝙊𝙎 𝙂𝙇𝙊𝘽𝘼𝙇𝙀𝙎\n\n${globalCommands.map(([key, value], index) => `*${index + 1}.-*\n*ღ 𝘾𝙊𝘿𝙄𝙂𝙊:* ${value.locked ? `_*(𝚋𝚕𝚘𝚚𝚞𝚎𝚊𝚍𝚘)*_ ${key}` : key}\nnღ 𝘾𝙊𝙈𝘼𝙉𝘿𝙊/𝙏𝙀𝙓𝙏𝙊𝙎:* ${value.text}`).join('\n\n')}\n\n`;
}
}

response += `ℹ️ *𝙋𝙖𝙧𝙖 𝙧𝙚𝙘𝙪𝙥𝙚𝙧𝙖𝙧 𝙪𝙣 𝙨𝙩𝙞𝙘𝙠𝙚𝙧, 𝙪𝙨𝙖:* ${usedPrefix + command} get <comando> (𝙚𝙟𝙚𝙢𝙥𝙡𝙤: ${usedPrefix + command} get .help)`;
await conn.reply(m.chat, response.trim(), m)
};
handler.help = ['listcmd'];
handler.tags = ['tools'];
handler.command = /^(listas|listcmd|cmdlist)$/i;
//handler.group = true;
export default handler;