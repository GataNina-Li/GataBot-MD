let handler = async (m, { conn, command, text, usedPrefix }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

const sections = [{
title: comienzo + ' 🗂️ 𝙏𝙄𝙋𝙊𝙎 𝘿𝙀 𝙇𝙄𝙎𝙏𝘼𝙎 ' + fin,
rows: [
{title: "📛 𝗕𝗟𝗢𝗤𝗨𝗘𝗔𝗗𝗢𝗦 : 𝗕𝗟𝗢𝗖𝗞𝗘𝗗", rowId: `${usedPrefix}listablock`, description: `𝑼𝒔𝒖𝒂𝒓𝒊𝒐𝒔 𝑩𝒍𝒐𝒒𝒖𝒆𝒂𝒅𝒐𝒔 𝒑𝒐𝒓 𝒍𝒍𝒂𝒎𝒂𝒓.`},
{title: "⚠️ 𝗔𝗗𝗩𝗘𝗥𝗧𝗜𝗗𝗢𝗦 : 𝗪𝗔𝗥𝗡𝗘𝗗", rowId: `${usedPrefix}listadv`, description: `𝑼𝒔𝒖𝒂𝒓𝒊𝒐𝒔 𝑨𝒅𝒗𝒆𝒓𝒕𝒊𝒅𝒐𝒔 𝒑𝒐𝒓 𝑴𝒂𝒍𝒂𝒔 𝑷𝒂𝒍𝒂𝒃𝒓𝒂𝒔.`},
{title: "📵 𝗖𝗛𝗔𝗧 𝗕𝗔𝗡𝗘𝗔𝗗𝗢𝗦 : 𝗕𝗔𝗡𝗡𝗘𝗗 𝗖𝗛𝗔𝗧𝗦", rowId: `${usedPrefix}chatsbaneados`, description: `𝑪𝒉𝒂𝒕𝒔 𝒅𝒐𝒏𝒅𝒆 𝒏𝒐 𝒑𝒖𝒆𝒅𝒆𝒏 𝒖𝒔𝒂𝒓 𝒂 𝑮𝒂𝒕𝒂𝑩𝒐𝒕`},
{title: "🚷 𝗨𝗦𝗨𝗔𝗥𝗜𝗢𝗦 𝗕𝗔𝗡𝗘𝗔𝗗𝗢𝗦 : 𝗕𝗔𝗡𝗡𝗘𝗗 𝗨𝗦𝗘𝗥𝗦", rowId: `${usedPrefix}listbanuser`, description: `𝑼𝒔𝒖𝒂𝒓𝒊𝒐𝒔 𝒒𝒖𝒆 𝒏𝒐 𝒑𝒖𝒆𝒅𝒆𝒏 𝒖𝒔𝒂𝒓 𝒂 𝑮𝒂𝒕𝒂𝑩𝒐𝒕`},
{title: "🎟️ 𝗨𝗦𝗨𝗔𝗥𝗜𝗢𝗦 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 : 𝗩𝗜𝗣 𝗨𝗦𝗘𝗥𝗦", rowId: `${usedPrefix}listapremium`, description: `𝑼𝒔𝒖𝒂𝒓𝒊𝒐𝒔 𝒄𝒐𝒏 𝑷𝒂𝒔𝒆 𝑷𝒓𝒆𝒎𝒊𝒖𝒎`},
{title: "💞 𝗨𝗦𝗨𝗔𝗥𝗜𝗢𝗦 𝗘𝗡 𝗥𝗘𝗟𝗔𝗖𝗜𝗢𝗡 : 𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡𝗦𝗛𝗜𝗣", rowId: `${usedPrefix}listaparejas`, description: `𝑼𝒔𝒖𝒂𝒓𝒊𝒐𝒔 𝒒𝒖𝒆 𝒆𝒔𝒕á𝒏 𝒆𝒏 𝒖𝒏𝒂 𝑹𝒆𝒍𝒂𝒄𝒊ó𝒏 𝑹𝒐𝒎á𝒏𝒕𝒊𝒄𝒂.`}]}]

const listMessage = {
  text: `𝙏𝙄𝙋𝙊𝙎 𝘿𝙀 𝙇𝙄𝙎𝙏𝘼𝙎 𝘿𝙀 𝙐𝙎𝙐𝘼𝙍𝙄𝙊𝙎\n𝙏𝙔𝙋𝙀𝙎 𝙊𝙁 𝙐𝙎𝙀𝙍 𝙇𝙄𝙎𝙏𝙎`,
  footer: wm,
  title: `${htki} 𝙇𝙄𝙎𝙏𝘼 𝙑𝘼𝙍𝙄𝘼𝘿𝘼𝙎 📃`,
  buttonText: `📑 𝙑𝙀𝙍 𝙇𝙄𝙎𝙏𝘼𝙎 📑`,
  sections
}
await conn.sendMessage(m.chat, listMessage, {quoted: fkontak})}
handler.command = /^listas|lists?$/i
export default handler
