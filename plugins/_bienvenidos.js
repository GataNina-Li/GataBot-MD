import fetch from 'node-fetch';

let handler = async (m, { conn, participants, groupMetadata }) => {
    let ppch = await conn.profilePictureUrl(m.sender, 'image').catch(_ => gataMenu);
    let name = conn.getName(m.sender);
    let senderId = m.sender.split('@')[0];

    let txt = `*╭┈⊰* ${groupMetadata.subject} *⊰┈ ✦*\n*┊ 👋 ¡Hola @${senderId}!*\n*┊ 📜 No olvides revisar la descripción del grupo para más detalles.*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰ ✦*\n\n${groupMetadata.desc?.toString() || '¡SIN DESCRIPCIÓN!\n> _*Gata Bot - MD*_ 🌻🐈'}`;

    let but = [
        { buttonId: "/menu", buttonText: { displayText: 'Menú. 🐈' }, type: 1 },
        { buttonId: "/serbot code", buttonText: { displayText: 'SerBot. 🐱' }, type: 1 }
    ];

    let fk = {
        contextInfo: {
            mentionedJid: [m.sender], 
            isForwarded: true,
            externalAdReply: {
                showAdAttribution: true,
                title: name,
                body: gt,
                mediaUrl: null,
                description: null,
                previewType: "PHOTO",
                thumbnailUrl: ppch,
                sourceUrl: `https://github.com/GataNina-Li`,
                mediaType: 1,
                renderLargerThumbnail: false,
                mentionedJid: [m.sender] 
            }
        },
        mentionedJid: [m.sender] 
    };

    let gata = {
        image: { url: ppch },
        caption: txt,
        footer: gt,
        buttons: but,
        viewOnce: true,
        headerType: 4,
        mentions: [m.sender], 
        ...fk
    };

    await conn.sendMessage(m.chat, gata, { quoted: null, mentions: [m.sender] });
}

handler.command = ['welcome', 'bienvenido'];
handler.group = true;

export default handler;