import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, text = '', args, command }) => {
try {
let contact, number, ofc, nombre, description, correo, lugar, enlace, biog;
let pp = gataImg;
const cat = `𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿 💖🐈\n* ${bot}\n\n*---------------------*\n\n*CENTER GATABOT*\n*centergatabot@gmail.com*\n\n𝙂𝘼𝙏𝘼 𝘿𝙄𝙊𝙎 - 𝘼𝙎𝙄𝙎𝙏𝙀𝙉𝘾𝙄𝘼\n*${asistencia}*\n\n*---------------------*\n\nᵃ ᶜᵒⁿᵗᶦⁿᵘᵃᶜᶦᵒ́ⁿ ˢᵉ ᵉⁿᵛᶦᵃʳᵃⁿ ˡᵒˢ ᶜᵒⁿᵗᵃᶜᵗᵒˢ ᵈᵉ ᵐᶦ ᵖʳᵒᵖᶦᵉᵗᵃʳᶦᵒ / ᵈᵉˢᵃʳʳᵒˡˡᵃᵈᵒʳᵉˢ`;
let biografiaBot = await conn.fetchStatus(conn.user.jid.split('@')[0] + '@s.whatsapp.net').catch(_ => 'undefined');
let bioBot = biografiaBot.status?.toString() || `${desc2 == '' ? lenguajeGB.smsContacto1() : desc2}`;

let contacts = global.official.filter(c => c[2] === 1);
let lista = [];
for (let i = 0; i < contacts.length; i++) {
contact = contacts[i];
number = String(contact[0]);
ofc = await conn.getName(number + '@s.whatsapp.net');
let biografia = await conn.fetchStatus(number + '@s.whatsapp.net').catch(_ => 'undefined');
let bio = biografia.status?.toString() || `${desc2 == '' ? lenguajeGB.smsContacto2() : desc2}`;

nombre = official[0][0] == String(contact[0]) ? official[0][1] : official[1][0] == String(contact[0]) ? official[1][1] : official[2][0] == String(contact[0]) ? official[2][1] : official[3][0] == String(contact[0]) ? official[3][1] : lenguajeGB.smsContacto3();
description = official[0][0] == String(contact[0]) ? 'Solo temas de GataBot' : official[1][0] == String(contact[0]) ? lenguajeGB.smsContacto4() : official[2][0] == String(contact[0]) ? lenguajeGB.smsContacto4() : official[3][0] == String(contact[0]) ? lenguajeGB.smsContacto4() : desc === '' ? lenguajeGB.smsContacto5() : desc;
correo = official[0][0] == String(contact[0]) ? 'socialplus.gata@gamil.com' : official[1][0] == String(contact[0]) ? 'thelolibotm@gmail.com' : official[2][0] == String(contact[0]) ? 'alexismaldonado90700@gmail.com' : mail === '' ? lenguajeGB.smsContacto6() : mail;
lugar = official[0][0] == String(contact[0]) ? '🇪🇨 Ecuador' : official[1][0] == String(contact[0]) ? '🇦🇷 Argentina' : official[2][0] == String(contact[0]) ? '🇲🇽 México' : official[3][0] == String(contact[0]) ? '🇧🇷 Brazil' : country === '' ? lenguajeGB.smsContacto7() : country;
enlace = official[0][0] == String(contact[0]) ? 'https://github.com/GataNina-Li' : official[1][0] == String(contact[0]) ? 'https://github.com/elrebelde21' : official[2][0] == String(contact[0]) ? 'https://github.com/Azami19' : official[3][0] == String(contact[0]) ? 'https://github.com/Abiguelreyes75' : md;

lista.push([number, ofc, nombre, description, official[3][0] == String(contact[0]) ? null : correo, lugar, enlace, bio, official[1][0] == String(contact[0]) ? 'https://www.youtube.com/@elrebelde.21' : null]);
}
        lista.push([conn.user.jid.split('@')[0], await conn.getName(conn.user.jid), packname, lenguajeGB.smsContacto8(), mail === '' ? 'centergatabot@gmail.com' : mail, lenguajeGB.smsContacto7(), md, bioBot, yt, ig, fb, paypal, nna]);

await conn.sendFile(m.chat, pp, 'lp.jpg', cat, fkontak, false, { contextInfo: { externalAdReply: { mediaUrl: null, mediaType: 1, description: null, title: gt, body: ' 😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 ', previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb.getRandom()}}});
await conn.sendContactArray(m.chat, lista, null, { quoted: fkontak });

    } catch (e) {
await m.reply(lenguajeGB['smsMalError3']() + '\n*' + lenguajeGB.smsMensError1() + '*\n*' + usedPrefix + `${lenguajeGB.lenguaje() == 'es' ? 'reporte' : 'report'}` + '* ' + `${lenguajeGB.smsMensError2()} ` + usedPrefix + command);
await m.reply(e);
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`);
console.log(e);
}};

handler.help = ['owner', 'creator'];
handler.tags = ['info'];
handler.command = /^(owner|creator|propietario|dueño|dueña|propietaria|dueño|creadora|creador|contactos?|contacts?)$/i;

export default handler;