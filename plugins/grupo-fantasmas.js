let areJidsSameUser = (await import(global.baileys)).default;

let handler = async (m, { conn, text, participants, args, command }) => {
let member = participants.map(u => u.id);
let sum = text ? parseInt(text) : member.length;
let total = 0;
let sider = [];
for (let i = 0; i < sum; i++) {
let user = member[i];
let userData = global.db.data.users[user] || {};
if ((typeof userData.mensaje === 'undefined' || userData.mensaje[m.chat] === 0) && !participants[i].isAdmin && !participants[i].isSuperAdmin) {
if (userData.whitelist !== true) {
total++;
sider.push(user);
}}}
const delay = time => new Promise(res => setTimeout(res, time));

switch (command) {
case "fantasmas":
if (total == 0) return conn.reply(m.chat, `${lenguajeGB['smsAvisoAG']()}𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊 𝙀𝙎 𝘼𝘾𝙏𝙄𝙑𝙊 𝙉𝙊 𝙏𝙄𝙀𝙉𝙀 𝙁𝘼𝙉𝙏𝘼𝙎𝙈𝘼𝙎 :D`, m) 
m.reply(`⚠️ 𝙍𝙀𝙑𝙄𝙎𝙄𝙊𝙉 𝘿𝙀 𝙄𝙉𝘼𝘾𝙏𝙄𝙑𝙊 ⚠️\n\n𝙂𝙍𝙐𝙋𝙊: ${await conn.getName(m.chat)}\n*𝙈𝙄𝙀𝙈𝘽𝙍𝙊𝙎 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊:* ${sum}\n*𝙈𝙄𝙀𝙈𝘽𝙍𝙊𝙎 𝙄𝙉𝘼𝘾𝙏𝙄𝙑𝙊𝙎:* ${total}\n\n*[ 👻 𝙇𝙄𝙎𝙏𝘼𝙎 𝘿𝙀 𝙁𝘼𝙉𝙏𝘼𝙎𝙈𝘼𝙎 👻 ]*\n${sider.map(v => '  👉🏻 @' + v.replace(/@.+/, '')).join('\n')}\n\n*𝙉𝙊𝙏𝘼: 𝙀𝙎𝙏𝙊 𝙋𝙐𝙀𝘿𝙀 𝙉𝙊 𝙎𝙀𝙍 ℅100 𝘼𝘾𝙀𝙍𝙏𝘼𝘿𝙊 𝙀𝙇 𝘽𝙊𝙏 𝙄𝙉𝙄𝘾𝙄𝘼 𝙀𝙇 𝘾𝙊𝙉𝙏𝙀𝙊 𝘿𝙀 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝘼𝙋𝘼𝙍𝙏𝙄𝙍 𝘿𝙀 𝙌𝙐𝙀 𝙎𝙀 𝘼𝘾𝙏𝙄𝙑𝙊 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙉𝙐́𝙈𝙀𝙍𝙊*`, null, { mentions: sider });
break;
case "kickfantasmas":
if (total == 0) return conn.reply(m.chat, `${lenguajeGB['smsAvisoAG']()}𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊 𝙀𝙎 𝘼𝘾𝙏𝙄𝙑𝙊 𝙉𝙊 𝙏𝙄𝙀𝙉𝙀 𝙁𝘼𝙉𝙏𝘼𝙎𝙈𝘼𝙎 :D`, m) ;
await m.reply(`⚠️ 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝘾𝙄𝙊𝙉 𝘿𝙀 𝙄𝙉𝘼𝘾𝙏𝙄𝙑𝙊𝙎 ⚠️\n\n𝙂𝙍𝙐𝙋𝙊: ${await conn.getName(m.chat)}\n*𝙈𝙄𝙀𝙈𝘽𝙍𝙊𝙎 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊:* ${sum}\n*𝙈𝙄𝙀𝙈𝘽𝙍𝙊𝙎 𝙄𝙉𝘼𝘾𝙏𝙄𝙑𝙊𝙎:* ${total}\n\n[ 👻 𝙁𝘼𝙉𝙏𝘼𝙎𝙈𝘼𝙎 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝘿𝙊 👻 ]\n${sider.map(v => '@' + v.replace(/@.+/, '')).join('\n')}\n\n*𝙀𝙇 𝘽𝙊𝙏 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍𝘼 𝙇𝘼 𝙇𝙄𝙎𝙏𝘼 𝙈𝙀𝙉𝘾𝙄𝙊𝙉𝘼𝘿𝘼, 𝙀𝙈𝙋𝙀𝙕𝘼𝘿𝙊 𝙀𝙇 20 𝙎𝙀𝙂𝙐𝙉𝘿𝙊, 𝙔 𝘾𝘼𝘿𝘼 10 𝙎𝙀𝙂𝙐𝙉𝘿𝙊𝙎 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍𝘼 𝙐𝙉 𝙉𝙐́𝙈𝙀𝙍𝙊*`, null, { mentions: sider });
await delay(1 * 10000);
let chat = global.db.data.chats[m.chat];
chat.welcome = false;
try {
let users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id));
let kickedGhost = sider.map(v => v.id).filter(v => v !== conn.user.jid);
for (let user of users) {
if (user.endsWith('@s.whatsapp.net') && !(participants.find(v => areJidsSameUser(v.id, user)) || { admin: true }).admin) {
let res = await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
kickedGhost.concat(res);
await delay(1 * 10000);
}}} finally {
chat.welcome = true;
}
break;
}};
handler.command = /^(fantasmas|kickfantasmas)$/i;
handler.group = handler.botAdmin = handler.admin = true;
handler.fail = null;
handler.register = true;
export default handler;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//desarrollado por https://github.com/ReyEndymion
//participa en desactivacion de despedida https://github.com/BrunoSobrino/