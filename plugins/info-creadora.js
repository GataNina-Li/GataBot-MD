var handler  = async (m, { conn, command, args, usedPrefix, DevMode }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let pp = gataImg.getRandom()	
const cat = `𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿 💖🐈
*Wa.me/573026191480*

𝙂𝙖𝙩𝙖𝘽𝙤𝙩𝙇𝙞𝙩𝙚-𝙈𝘿 💖🐈
*wa.me/593993684821*
*---------------------*

*CENTER GATABOT*
*centergatabot@gmail.com*

𝙂𝘼𝙏𝘼 𝘿𝙄𝙊𝙎 - 𝘼𝙎𝙄𝙎𝙏𝙀𝙉𝘾𝙄𝘼
*${asistencia}*`

await conn.sendFile(m.chat, pp, 'gata.mp4', cat, fkontak)
}
handler.help = ['owner', 'creator']
handler.tags = ['info']
handler.command = /^(owner|creator|propietario|dueño|dueña|propietaria|dueño|creadora|creador)$/i

export default handler

/*let MessageType =  (await import(global.baileys)).default
let handler  = async (m, { conn, command, args, usedPrefix, DevMode }) => {
  let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
let bot = global.db.data.settings[conn.user.jid] || {}
let name = await conn.getName(m.sender)
  let type = (args[0] || '').toLowerCase()
  let _type = (args[0] || '').toLowerCase()
  let pp = gataVidMenu.getRandom()
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

//------- Nombre
  let nowner = `${wm.split`@`[0]}@s.whatsapp.net`
  let insta = `https://www.instagram.com/gata_dios`
  let teksnomor = `
• @${wm.split`@`[0]} •
------- ${wm} -------
`
conn.reply(m.chat, 'Mario.js', fkontak,  m)
//------------ BIO
let ppown = await conn.profilePictureUrl(nomorown + '@s.whatsapp.net', 'image').catch(_ => imagen1[1]) 
let teksbio = `𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿 💖🐈
*Wa.me/573136855110*

𝙂𝙖𝙩𝙖𝘽𝙤𝙩𝙇𝙞𝙩𝙚-𝙈𝘿 💖🐈
*wa.me/593993684821*
*---------------------*

*CENTER GATABOT*
*centergatabot@gmail.com*

𝙂𝘼𝙏𝘼 𝘿𝙄𝙊𝙎 - 𝘼𝙎𝙄𝙎𝙏𝙀𝙉𝘾𝙄𝘼
*${asistencia}*`
  let teks = ' '
const sections = [
   {
	title: `PROPIETARIO/OWNER`,
	rows: [
	    {title: "📱 • NOMBRE", rowId: ".owner nombre"},
	{title: "🙌 • NUMERO", rowId: ".owner bio"},
	{title: "🌐 • CUENTAS OFICIALES", rowId: ".cuentasgb"},
	{title: "😸 • GRUPOS", rowId: ".grupos"},
	{title: "🌎 • SCRIPT", rowId: ".sc"},
	]
    },{
	title: `–––––––·• APOYA AL BOT –––––––·•`,
	rows: [
	    {title: "💹 • DONAS", rowId: ".paypal"},
	{title: "🤖 • INSTALARBOT", rowId: ".instalarbot"},
	{title: "🌟 • PREMIUM", rowId: ".pasepremium"},
	]
  },
]

const listMessage = {
  text: teks,
  footer: null,
  title: `╭━━━✦ *OWNER ✦━━━━⬣
┃დ HOLA 👋 ${name}
┃≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋
┃${wm}
╰━━━━━✦ *${vs}* ✦━━━━⬣`,
  buttonText: "HAGA CLICK AQUI",
  sections
}

  try {
    if (/(contacto|owner|creator|propietario|dueño|dueña|propietaria|dueño|creadora|creador)/i.test(command)) {
      const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
        switch (type) {
          case 'nombre':
          await conn.reply(m.chat, `𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀𝙇 𝘽𝙊𝙏 : ${gt} 🐈`, fkontak, m)
         // conn.reply(m.chat, "Nombre del bot : GataBot-MD 🐈", m, { contextInfo: { mentionedJid: [nowner] }})
            break
            case 'bio':
             await conn.sendFile(m.chat, gataImg.getRandom(), 'gata.jpg', teksbio, fkontak)
         // conn.sendButton(m.chat, teksbio, fkontak, pp, [`☘️ 𝗠 𝗘 𝗡 𝗨`, `.menu`], m)
            break
          default:
            return await conn.sendMessage(m.chat, listMessage, { quoted: m, contextInfo: { mentionedJid: [m.sender] }})
        }
    } else if (/aoaooaoaooaoa/i.test(command)) {
      const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 :Math.min(1, count)
      switch (_type) {
        case 't':
          break
        case '':
          break

        default:
          return  await conn.sendFile(m.chat, gataImg.getRandom(), 'gata.jpg', teksbio, fkontak)
      }
    }
  } catch (err) {
    m.reply("Error\n\n\n" + err.stack)
  }
}

handler.help = ['owner', 'creator']
handler.tags = ['info']
handler.command = /^(contacto|owner|creator|propietario|dueño|dueña|propietaria|dueño|creadora|creador)$/i

export default handler*/
