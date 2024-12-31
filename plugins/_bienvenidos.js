let handler = async (m, { conn, participants, groupMetadata }) => {

    let ppch = await conn.profilePictureUrl(m.sender, 'image').catch(_ => gataMenu);

    let text = `*╭┈⊰* ${groupMetadata.subject} *⊰┈ ✦*\n`;
    text += `*┊ 👋 ¡Hola @${m.sender.split('@')[0]}!*\n`;
    text += `*┊ 📜 No olvides revisar la descripción del grupo para más detalles.*\n`;
    text += `*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰ ✦*\n\n`;
    text += `${groupMetadata.desc?.toString() || '¡SIN DESCRIPCIÓN!\n> *Gata Bot - MD* 🌻🐈'}`;

    conn.sendFile(m.chat, ppch, 'pp.jpg', text, null, true, { mentions: [m.sender] });
}

handler.command = ['welcome', 'bienvenido'];
handler.group = true;
//handler.admin = true;

export default handler;