export async function before(m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
if (m.isBaileys && m.fromMe) return !0;
if (m.isGroup) return !1;
if (!m.message) return !0;
if (m.text.includes('serbot') || m.text.includes('jadibot') || m.text.includes('deletesesion') || m.text.includes('estado') || m.text.includes('bots')) return !0
const chat = global.db.data.chats[m.chat];
const bot = global.db.data.settings[this.user.jid] || {};
if (bot.antiPrivate && !isOwner && !isROwner) {
await m.reply(`*${lenguajeGB['smsCreA']()}* *@${m.sender.split`@`[0]}*, ${lenguajeGB['smsprivado']()}\n${nn}`,mentions: [m.sender] }, { quoted: fkontak })
await this.updateBlockStatus(m.chat, 'block')}
return !1
}
