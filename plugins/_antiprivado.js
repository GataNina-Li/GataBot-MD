export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, usedPrefix }) {
//if ( owner[0][0] == 593993684821 ) {
if (m.isBaileys && m.fromMe) return !0
if (m.isGroup) return !1
if (!m.message) return !0
if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') 
    ||  m.text.includes('bots') || m.text.includes('serbot') || m.text.includes('jadibot') 
    || m.text.includes('creadora') || m.text.includes('ping') || m.text.includes('bottemporal') || m.text.includes('gruposgb') 
    || m.text.includes('instalarbot') || m.text.includes('términos') || m.text.includes('donar')) return !0
let chat = global.db.data.chats[m.chat]
let bot = global.db.data.settings[this.user.jid] || {}
let user = global.db.data.users[m.sender]

if (user.registered === true) return !0 
if (!m.isGroup && user.registered === false) return !1
if (bot.antiPrivate && !isOwner && !isROwner) {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

let text1 = `✅ *BIENVENIDO(A) @${m.sender.split`@`[0]} : CUENTA OFICIAL ${gt}*

😽 *Únete al Grupo Oficial y use el comando #verificar para tener acceso a todos los Comandos además de poder usar al Chat Privado!!!*

*Join the Official Group and use the #verify command to have access to all the Commands as well as being able to use the Private Chat!!!*`
let text2 = `🐈 *GRUPO UPDATE* 🐈 
*Infórmate de las últimas novedades!!!*
⁘ _${nna}_

💕 *GRUPOS DISPONIBLES* 💕
⁘ _${nn}_

⁘ _${nnn}_

⁘ _${nnnt}_

⁘ _${nnntt}_

⁘ _${nnnttt}_

⁘ _${nnnttt2}_

⁘ _${nnnttt3}_

👇 *COMANDOS DISPONIBLE* 👇
#creadora #gruposgb #donar #ping #bottemporal #jadibot #bots #instalarbot #términos`

conn.sendButton(m.chat, text1, text2, null, [[lenguajeGB.smsConMenu(), `#menu`]], fkontak, m)
//handler.group = true
return !1
}}

/*}else{

if (m.isBaileys && m.fromMe) return !0
if (m.isGroup) return !1
if (!m.message) return !0
if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA')
    ||  m.text.includes('bots') || m.text.includes('serbot') || m.text.includes('jadibot') 
    || m.text.includes('creadora') || m.text.includes('ping') || m.text.includes('bottemporal') || m.text.includes('gruposgb') 
    || m.text.includes('instalarbot') || m.text.includes('términos') || m.text.includes('donar')) return !0
let chat = global.db.data.chats[m.chat]
let bot = global.db.data.settings[this.user.jid] || {}
let user = global.db.data.users[m.sender]

if (user.registered === true) return !0 
if (bot.antiPrivate && !isOwner && !isROwner) {
await m.reply(`*[❗] 𝙃𝙊𝙇𝘼 @${m.sender.split`@`[0]}*, 𝙀𝙎𝙏𝘼 𝙋𝙍𝙊𝙃𝙄𝘽𝙄𝘿𝙊 𝙃𝘼𝘽𝙇𝘼 𝘼𝙇 𝙋𝙍𝙄𝙑𝘼𝘿𝙊 𝘿𝙀𝙇 𝘽𝙊𝙏\n𝙎𝙊𝙇𝙊 𝙎𝙄 𝙌𝙐𝙄𝙀𝙍𝙀 𝙃𝘼𝘾𝙀𝙍𝙏𝙀 𝙐𝙉 𝘽𝙊𝙏.\n𝙈𝘼𝙉𝘿𝘼 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 .serbot\n𝘼𝙎𝙄𝙎𝙏𝙀𝙉𝘾𝙄𝘼 𝙋𝘼𝙍𝘼 𝙐𝙎𝙐𝘼𝙍𝙄𝙊: https://instagram.com/gata_dios\n\n*𝙐𝙉𝙀𝙏𝙀 𝘼𝙇 𝙂𝙍𝙐𝙋𝙊 𝙋𝘼𝙍𝘼 𝙐𝙎𝘼𝙍 𝘼𝙇 𝙂𝘼𝙏𝘼𝘽𝙊𝙏 ${nn}*`, false, { mentions: [m.sender] })
handler.group = true
return !1
}}*/
