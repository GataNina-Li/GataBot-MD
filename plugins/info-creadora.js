let { MessageType } = (await import('@adiwajshing/baileys')).default

let handler  = async (m, { conn, command, args, usedPrefix, DevMode }) => {
  let type = (args[0] || '').toLowerCase()
  let _type = (args[0] || '').toLowerCase()

//------- NOMOR
  let nowner = `${nomorown.split`@`[0]}@s.whatsapp.net`
  let teksnomor = `${htki} *OWNER* ${htka}
✦ @${nomorown.split`@`[0]} ✦
------- ${wm} -------

📮 *Nomre:*
• h`

//------------ BIO
let ppown = 'https://telegra.ph/file/02a2903c1e25228285740.jpg'
let teksbio = `*BIO*
*Instagram:* ${ig}
*Github:* ${gt}
•·––––––––––––––––––––––––––·•
`
  let teks = 'hola selecciones aqui'
const sections = [
   {
	title: `OWNER –––––––––·•`,
	rows: [
	    {title: "📱 • Numero", rowId: ".owner"},
	{title: "🌎 • Script", rowId: ".sc"},
	]
    },{
	title: `apoyos –––––––·•`,
	rows: [
	    {title: "💹 • Donar", rowId: ".donar"},
	{title: "🔖 • Grupos", rowId: ".grupos"}
	]
  },
]

const listMessage = {
  text: teks,
  footer: null,
  title: `*OWNER*`,
  buttonText: "Click !",
  sections
}

  try {
    if (/(contacto|owner|creator|propietario|dueño|dueña|propietaria|dueño|creadora|creador)/i.test(command)) {
      const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
        switch (type) {
          case 'owner':
          conn.reply(m.chat, wm, m, { contextInfo: { mentionedJid: [nowner] }})
            break
            
          default:
            return await conn.sendMessage(m.chat, listMessage, m, { contextInfo: { mentionedJid: [m.sender] }})
        }
    } else if (/enchant|enchan/i.test(command)) {
      const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 :Math.min(1, count)
      switch (_type) {
        case 't':
          break
        case '':
          break

        default:
          return conn.sendButton( m.chat, caption, wm, null, [`⋮☰ Menu`, `.menu`], m)
      }
    }
  } catch (err) {
    m.reply("Error\n\n\n" + err.stack)
  }
}

handler.help = ['owner', 'creator']
handler.tags = ['info']
handler.command = /^(contacto|owner|creator|propietario|dueño|dueña|propietaria|dueño|creadora|creador)$/i
export default handler 

/*
import fs from 'fs'
let handler = async (m, { conn, usedPrefix }) => {
var doc = ['pdf','zip','vnd.openxmlformats-officedocument.presentationml.presentation','vnd.openxmlformats-officedocument.spreadsheetml.sheet','vnd.openxmlformats-officedocument.wordprocessingml.document']
var document = doc[Math.floor(Math.random() * doc.length)]    
let text = `
𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿 💖🐈
*Wa.me/593993684821*

𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿 *2* 💖🐈
*Wa.me/56977775697*

*---------------------*
*CENTER GATABOT*
*centergatabot@gmail.com*

𝙂𝘼𝙏𝘼 𝘿𝙄𝙊𝙎 - 𝘼𝙎𝙄𝙎𝙏𝙀𝙉𝘾𝙄𝘼
*${asistencia}*

*Sr. Pablo* - 𝘼𝙎𝙄𝙎𝙏𝙀𝙉𝘾𝙄𝘼
*Wa.me/51993042301*

🧡 *Eso son los contactos para ti.*\n💜 *That's the contacts for you.*`.trim()   
let buttonMessage= {
'document': { url: `${md}` },
'mimetype': `application/${document}`,
'fileName': `✦ 𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿 ༄`,
'fileLength': 99999999999999,
'pageCount': 200,
'contextInfo': {
'forwardingScore': 200,
'isForwarded': true,
'externalAdReply': {
'mediaUrl': `${md}`,
'mediaType': 2,
'previewType': 'pdf',
'title': 'Super Bot WhatsApp',
'body': wm,
'thumbnail': fs.readFileSync('./media/menus/Menu3.jpg'),
'sourceUrl': yt }},
'caption': text,
'footer': wm,
'buttons':[
{buttonId: `${usedPrefix}donar`, buttonText: {displayText: '🎁 𝘿𝙤𝙣𝙖𝙧 | 𝘿𝙤𝙣𝙖𝙩𝙚'}, type: 1}, 
{buttonId: `${usedPrefix}infobot`, buttonText: {displayText: '🐈 𝙄𝙣𝙛𝙤𝙧𝙢𝙖𝙘𝙞𝙤𝙣 | 𝙄𝙣𝙛𝙤𝙧𝙢𝙖𝙩𝙞𝙤𝙣'}, type: 1}, 
{buttonId: `${usedPrefix}allmenu`, buttonText: {displayText: '💫 𝙈𝙚𝙣𝙪́ 𝙘𝙤𝙢𝙥𝙡𝙚𝙩𝙤 | 𝙁𝙪𝙡𝙡 𝙈𝙚𝙣𝙪'}, type: 1}],
'headerType': 6 }

await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
const data = global.owner.filter(([id, isCreator]) => id && isCreator)
await conn.sendContact(m.chat, data.map(([id, name]) => [id, name]), m)
//await conn.sendContact(m.chat, `${owner[0][0]}`, m)//, 
//await conn.sendContact(m.chat, conn.getName(owner[0][0]+'@s.whatsapp.net', m)
  
let pp = './media/menus/Menu2.jpg'
let str = `${wm}`
let oficial = `Comunícate con Mí Creadora por Instagram!!, Solo por ese medio puede ayudarte sobre Temas de GataBot\n\nCommunicate with My Creator on Instagram!!, Only by that means can help you on GataBot Themes`

await conn.sendHydrated2(m.chat, str, oficial, pp, 'https://github.com/GataNina-Li/GataBot-MD', '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', 'https://www.instagram.com/gata_dios', '𝙄𝙣𝙨𝙩𝙖𝙜𝙧𝙖𝙢', [
['☘ 𝙄𝙧 𝙖𝙡 𝙞𝙣𝙞𝙘𝙞𝙤 | 𝙂𝙤 𝙩𝙤 𝙨𝙩𝙖𝙧𝙩', '/menu'],
], m,)
}
handler.help = ['owner', 'creator']
handler.tags = ['info']
handler.command = /^(contacto|owner|creator|propietario|dueño|dueña|propietaria|dueño|creadora|creador)$/i
export default handler 
*/
