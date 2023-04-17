/*import { numero } from './reporte-conversacion.js';
async function handler(m, { conn, command, text }) {
    

   // let analiztxt = m.quoted && 'text' in m.quoted ? m.quoted.text : `${text}: ${m.text}`
 //   console.log(analiztxt);
   // let regex = /wa\.me\/(\d+)/;
   // let match = analiztxt.match(regex);
  //  if (!match || !match[1]) {
   //     return conn.sendMessage(m.sender, 'No se ha encontrado el número de cliente en el mensaje citado.');
   // }
    //let num = global.db.data.users[m.sender].reporte
    let clin = global.db.data.users[m.sender].reporte = numero
    let clientNumber = clin
    //let clientJID = `${numero}@s.whatsapp.net`;
    
    let txt = ''
    let count = 0;
    for (const c of text) {
        await new Promise(resolve => setTimeout(resolve, 50));
        txt += c;
        count++;

        if (count % 10 === 0) {
            conn.sendPresenceUpdate('composing', m.chat);
        }
    }
    //await conn.reply('972529277026@s.whatsapp.net', txt.trim(), m)
    const quote = {
  key: {
    fromMe: false,
    remoteJid: "972529277026@s.whatsapp.net",
    id: "mensaje-1234567890" 
  },
  message: {
    conversation: "Mensaje personalizado"
  },
  messageTimestamp: new Date() / 1000
};
await conn.sendMessage("972529277026@s.whatsapp.net", { 
  text: txt.trim(), 
  quote: quote 
})

    global.db.data.users[m.sender].reporte = 0
       // await conn.sendMessage(`${numero}@s.whatsapp.net`, { text: txt.trim(), mentions: conn.parseMention(txt) }, { userJid: conn.user.jid, quoted: m, ephemeralExpiration: 1 * 100, disappearingMessagesInChat: true });
    
}

handler.command = ['responder']
handler.private = true
handler.owner = true

export default handler*/
