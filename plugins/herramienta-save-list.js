import fs from 'fs';
import path from 'path';

const globalContentFile = path.join(process.cwd(), './database/globalContent.json');
const localContentFile = path.join(process.cwd(), './database/localContent.json');

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

function loadLocalContent() {
  try {
    if (fs.existsSync(localContentFile)) {
      const data = fs.readFileSync(localContentFile, 'utf8');
      return JSON.parse(data);
    }
    return {};
  } catch (e) {
    console.error(`Error al cargar localContent.json: ${e}`);
    return {};
  }
}

let handler = async (m, { conn, text, isOwner, usedPrefix, command }) => {
const localContent = loadLocalContent();
const chat = localContent[m.chat] || { savedContent: {} };
const globalContent = loadGlobalContent();
let response = '';

const itemsPerPage = 30;
let page = 1;
if (text && !text.toLowerCase().startsWith('get ')) {
const pageNum = parseInt(text.trim());
if (!isNaN(pageNum) && pageNum > 0) page = pageNum;
}

if (text && text.toLowerCase().startsWith('get ')) {
const commandText = text.slice(4).trim().toLowerCase();
const commandEntry = Object.entries(global.db.data.sticker).find(([_, value]) => value.text === commandText);

if (!commandEntry) throw `${lenguajeGB['smsAvisoMG']()} 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙉𝙊 𝙀𝙓𝙄𝙎𝙏𝙀 𝙊 𝙉𝙊 𝙀𝙎𝙏𝘼 𝘼𝙎𝙄𝙂𝙉𝘼𝘿𝙊 𝘼 𝙐𝙉 𝙎𝙏𝙄𝘾𝙆𝙀𝙍.`
const [hash, commandData] = commandEntry;
const { data, isAnimated, chat: commandChat } = commandData;

if (commandChat !== null && commandChat !== m.chat && !isOwner) throw `${lenguajeGB['smsAvisoMG']()}𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙀𝙎 𝙇𝙊𝘾𝘼𝙇 𝘼 𝙊𝙏𝙍𝙊 𝘾𝙃𝘼𝙏 𝙔 𝙉𝙊 𝙏𝙄𝙀𝙉𝙀𝙎 𝙋𝙀𝙍𝙈𝙄𝙎𝙊 𝙋𝘼𝙍𝘼 𝙑𝙀𝙍𝙇𝙊.`
if (!data) throw `${lenguajeGB['smsAvisoMG']()}𝙉𝙊 𝙎𝙀 𝙀𝙉𝘾𝙊𝙉𝙏𝙍Ó 𝙀𝙇 𝙎𝙏𝙄𝘾𝙆𝙀𝙍 𝘼𝙎𝙊𝘾𝙄𝘼𝘿𝙊 𝘼 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊.`
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
thumbnail: imagen4
}}}); 
await m.react("✅");
return;
}

const isGlobalCommand = /^(listasglobal|globalcmd|cmdlist)$/i.test(command);

if (isGlobalCommand) {
const globalSaved = Object.entries(globalContent);
const globalCommands = isOwner ? Object.entries(global.db.data.sticker).filter(([_, value]) => value.chat === null) : [];
const hasGlobalContent = globalSaved.length > 0;
const hasGlobalCommands = globalCommands.length > 0;

if (!hasGlobalContent && (!isOwner || !hasGlobalCommands)) {
response = `${lenguajeGB['smsAvisoMG']()}𝙉𝙊 𝙃𝘼𝙔 𝘾𝙊𝙉𝙏𝙀𝙉𝙄𝘿𝙊 𝙂𝙐𝘼𝙍𝘿𝘼𝘿𝙊 𝙀𝙉 𝙀𝙎𝙏𝙀 𝘾𝙃𝘼𝙏`
await conn.reply(m.chat, response, m);
return;
}

if (hasGlobalContent) {
response += '*\`🌐 𝘾𝙊𝙉𝙏𝙀𝙉𝙄𝘿𝙊 𝙈𝙐𝙇𝙏𝙄𝙈𝙀𝘿𝙄𝘼 𝙂𝙇𝙊𝘽𝘼𝙇\`*\n';
response += '═══════════════════════\n';
const start = (page - 1) * itemsPerPage;
const end = start + itemsPerPage;
const paginatedGlobal = globalSaved.slice(start, end);

paginatedGlobal.forEach(([keyword, data], index) => {
response += `🔹 *${start + index + 1}. ${keyword}*\n`;
response += `   └─ *Tipo:* ${data.type}${data.caption ? `\n   └─ *Caption:* ${data.caption}` : ''}\n\n`;
});
response += '═══════════════════════\n';
}

if (isOwner && hasGlobalCommands) {
response += '*\`🔧 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎 𝙂𝙇𝙊𝘽𝘼𝙇𝙀𝙎 (𝙎𝙊𝙇𝙊 𝙊𝙒𝙉𝙀𝙍)\`*\n';
response += '═══════════════════════\n';
const start = (page - 1) * itemsPerPage;
const end = start + itemsPerPage;
const paginatedGlobalCommands = globalCommands.slice(start, end);

paginatedGlobalCommands.forEach(([key, value], index) => {
response += `🔹 *${start + index + 1}. ${value.text}*\n`;
response += `   └─ *Código:* ${value.locked ? `*(bloqueado)* ${key}` : key}\n\n`;
});
response += '═══════════════════════\n';
}

const totalPagesGlobal = hasGlobalContent ? Math.ceil(globalSaved.length / itemsPerPage) : 0;
const totalPagesCommands = hasGlobalCommands ? Math.ceil(globalCommands.length / itemsPerPage) : 0;
const maxPages = Math.max(totalPagesGlobal, totalPagesCommands);
if (maxPages > 0) {
response += `> 📖 *Página ${page} de ${maxPages}*\n`;
response += `> ✧ Usa *${usedPrefix + command} <número>* para ver más\n`;
}
response += `\n> 💡 *Tip:* Usa la palabra clave para reproducir el contenido\n`;
} else {
const localSaved = Object.entries(chat.savedContent);
const localCommands = Object.entries(global.db.data.sticker).filter(([_, value]) => value.chat === m.chat);
const hasLocalContent = localSaved.length > 0;
const hasLocalCommands = localCommands.length > 0;

if (!hasLocalContent && !hasLocalCommands) {
response = `${lenguajeGB['smsAvisoMG']()}𝙉𝙊 𝙃𝘼𝙔 𝘾𝙊𝙉𝙏𝙀𝙉𝙄𝘿𝙊 𝙂𝙐𝘼𝙍𝘿𝘼𝘿𝙊 𝙀𝙉 𝙀𝙎𝙏𝙀 𝘾𝙃𝘼𝙏`
await conn.reply(m.chat, response, m);
return;
}

if (hasLocalContent) {
response += `${lenguajeGB['smsAvisoIIG']()} *\`📍𝘾𝙊𝙉𝙏𝙀𝙉𝙄𝘿𝙊 𝙈𝙐𝙇𝙏𝙄𝙈𝙀𝘿𝙄𝘼 𝙇𝙊𝘾𝘼𝙇\`*\n`
response += '═══════════════════════\n';
const start = (page - 1) * itemsPerPage;
const end = start + itemsPerPage;
const paginatedLocal = localSaved.slice(start, end);

paginatedLocal.forEach(([keyword, data], index) => {
response += `🔹 *${start + index + 1}. ${keyword}*\n`;
response += `   └─ *Tipo:* ${data.type}${data.caption ? `\n   └─ *Caption:* ${data.caption}` : ''}\n\n`;
});
response += '═══════════════════════\n';
}

if (hasLocalCommands) {
response += '*\`🛠️ 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎 𝙇𝙊𝘾𝘼𝙇𝙀𝙎 🛠️\`*';
response += '\n═══════════════════════\n\n';
const start = (page - 1) * itemsPerPage;
const end = start + itemsPerPage;
const paginatedCommands = localCommands.slice(start, end);

paginatedCommands.forEach(([key, value], index) => {
response += `🔹 *${start + index + 1}. ${value.text}*\n`;
response += `   └─ *Código:* ${value.locked ? `*(bloqueado)* ${key}` : key}\n\n`;
});
response += '═══════════════════════\n';
}

const totalPagesLocal = hasLocalContent ? Math.ceil(localSaved.length / itemsPerPage) : 0;
const totalPagesCommands = hasLocalCommands ? Math.ceil(localCommands.length / itemsPerPage) : 0;
const maxPages = Math.max(totalPagesLocal, totalPagesCommands);
if (maxPages > 0) {
response += `> 📖 *Página ${page} de ${maxPages}*\n`;
response += `> ✧ Usa *${usedPrefix + command} <número>* para ver más\n`;
}
response += `═══════════════════════\n*💡 \`Tips:\`*\n`;
response += `> ✧ Usa la palabra clave para reproducir contenido\n`;
response += `> ✧ Recupera stickers con *${usedPrefix + command} get <comando>* (ej: ${usedPrefix + command} get .help)\n`;
response += `> ✧ Mira el contenido global con *${usedPrefix}cmdlist*\n`;
}
await conn.reply(m.chat, response.trim(), m);
};
handler.help = ['listcmd', 'cmdlist'];
handler.tags = ['tools'];
handler.command = /^(listas|listcmd|cmdlist|listasglobal|globalcmd|cmdglobal)$/i;
handler.register = true 
export default handler;