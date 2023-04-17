async function handler(m, { conn, command, text }) {
    let analiztxt = m.quoted && m.quoted.text ? m.quoted.text : `${text}: ${m.text}`;
    console.log(analiztxt);
    let regex = /wa\.me\/(\d+)/;
    let match = analiztxt.match(regex);
    if (!match || !match[1]) {
        return conn.sendMessage(m.sender, 'No se ha encontrado el número de cliente en el mensaje citado.');
    }

    let clientNumber = match[1];
    let clientJID = `${clientNumber}@s.whatsapp.net`;

    let txt = '';
    let count = 0;
    for (const c of text) {
        await new Promise(resolve => setTimeout(resolve, 50));
        txt += c;
        count++;

        if (count % 10 === 0) {
            conn.sendPresenceUpdate('composing', m.chat);
        }
    }
        await conn.sendMessage(clientJID, { text: txt.trim(), mentions: conn.parseMention(txt) }, { userJid: conn.user.jid, quoted: m, ephemeralExpiration: 1 * 100, disappearingMessagesInChat: true });
    
}

handler.command = ['responder']
handler.private = true
handler.owner = true

export default handler
