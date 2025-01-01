import fetch from 'node-fetch';

let handler = async (m, { conn, participants, groupMetadata }) => {

let ppch = await conn.profilePictureUrl(m.sender, 'image').catch(_ => gataMenu);
let name = conn.getName(m.sender);
let senderId = m.sender.split('@')[0];

let txt = `*╭┈⊰* ${groupMetadata.subject} *⊰┈ ✦*\n*┊ 👋 ¡Hola @${senderId}!*\n*┊ 📜 No olvides revisar la descripción del grupo para más detalles.*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰ ✦*\n\n${groupMetadata.desc?.toString() || '¡SIN DESCRIPCIÓN!\n> _*Gata Bot - MD*_ 🌻🐈'}`;

let buttons = [
{ buttonId: "/menu", buttonText: { displayText: 'Menu. 🐈' }, type: 1 },
{ buttonId: "/serbot code", buttonText: { displayText: 'SerBot. 🐱' }, type: 1 }
];

let fake = { contextInfo: { isForwarded: true, externalAdReply: { showAdAttribution: true, title: name, body: gt, mediaUrl: null, description: null, previewType: "PHOTO", thumbnailUrl: ppch, sourceUrl: 'https://github.com/GataNina-Li', mediaType: 1, renderLargerThumbnail: false }}};

let buttonMessage = { image: { url: ppch }, caption: welcomeMessage, footer: gt, buttons: buttons, viewOnce: true, headerType: 4, mentions: [m.sender],  ...fake };

await conn.sendMessage(m.chat, buttonMessage, { quoted: null });
}

handler.command = ['welcome', 'bienvenido'];
handler.group = true;
//handler.admin = true;

export default handler;