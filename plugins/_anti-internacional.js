/*let handler = m => m;

handler.before = async function (m, { conn, isAdmin, isOwner, isROwner, isBotAdmin }) {
if (!m.isGroup) return
if (m.fromMe) return
if (isAdmin || isOwner || m.fromMe || isROwner || !isBotAdmin) return

let delet = m.key.participant
let bang = m.key.id

let chat = global.db.data.chats[m.chat]
if (!chat || !chat.antifake) return

let texto = mid.mAdvertencia + mid.mFake(m)
let prefijos = chat.sCondition && Array.isArray(chat.sCondition) ? chat.sCondition : [];

if (prefijos.length > 0) {
const comienzaConPrefijo = prefijos.some(prefijo => m.sender.startsWith(`+${prefijo}`));
if (comienzaConPrefijo) {
await conn.sendMessage(m.chat, { text: texto, mentions: [m.sender] }, { quoted: m })
if (m.key.participant && m.key.id) {
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
}
let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
if (responseb[0].status === "404") return
        }
    } else {
        // Método de respaldo cuando no hay prefijos en `chat.sCondition`
        if (m.sender.startsWith('+6') || m.sender.startsWith('+9') ||  
            m.sender.startsWith('+7') || m.sender.startsWith('+4') ||  
            m.sender.startsWith('+2')) {
            await conn.sendMessage(m.chat, { text: texto, mentions: [m.sender] }, { quoted: m });
            await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }});
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            if (responseb[0].status === "404") return;
        }
    }
};

export default handler;
*/
