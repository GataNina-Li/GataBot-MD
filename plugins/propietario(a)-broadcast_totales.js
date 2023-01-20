import { randomBytes } from 'crypto'

let handler = async (m, { conn, text }) => {
  let chats = Object.entries(conn.chats).filter(([_, chat]) => chat.isChats).map(v => v[0])
  let cc = conn.serializeM(text ? m : m.quoted ? await m.getQuotedObj() : false || m)
  let teks = text ? text : cc.text
  conn.reply(m.chat, `*[❕] ᴍᴇɴsᴀᴊᴇ ᴇɴᴠɪᴀᴅᴏ ᴀ ${chats.length} ᴄʜᴀᴛs ᴛᴏᴛᴀʟᴇs*`, m)
  await delay(5 * 5000)
  conn.sendButton(id, `*┌───⊷ 𝘾𝙤𝙢𝙪𝙣𝙞𝙘𝙖𝙙𝙤*\n*┆*\n*┆💌* ${text}\n*┆*\n*╰──────────────────*`, '✅ *𝑪𝒐𝒎𝒖𝒏𝒊𝒄𝒂𝒅𝒐 𝒐𝒇𝒊𝒄𝒊𝒂𝒍*\n' + wm, fs.readFileSync('./src/avatar_contact.png'), [['🎁 𝙄𝙣𝙛𝙤 𝙊𝙛𝙞𝙘𝙞𝙖𝙡', '.cuentasgb'],['🐈 𝙈𝙚𝙣𝙪', '.menu']], false, {
contextInfo: { externalAdReply: {
title: '𝑻𝒉𝒆 𝑳𝒐𝒍𝒊𝑩𝒐𝒕-𝑴𝑫',
body: '𝑺𝒖𝒑𝒆𝒓 𝒃𝒐𝒕 𝑾𝒉𝒂𝒕𝒔𝑨𝒑𝒑', 
sourceUrl: `https://github.com/elrebelde21/The-LoliBot-MD`, 
thumbnail: fs.readFileSync('./media/menus/Menu3.jpg') }}})}
  m.reply('se envio con éxitos ✅️')
}
handler.help = ['broadcast', 'bc'].map(v => v + ' <teks>')
handler.tags = ['owner']
handler.command = /^(comunicar|comunicado|broadcastall|bc)$/i

handler.owner = true

export default handler
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

const randomID = length => randomBytes(Math.ceil(length * .5)).toString('hex').slice(0, length)


//
/*
import { randomBytes } from 'crypto'

let handler = async (m, { conn, text }) => {
  let chats = Object.entries(conn.chats).filter(([_, chat]) => chat.isChats).map(v => v[0])
  let cc = conn.serializeM(text ? m : m.quoted ? await m.getQuotedObj() : false || m)
  let teks = text ? text : cc.text
  conn.reply(m.chat, `*[❕] ᴍᴇɴsᴀᴊᴇ ᴇɴᴠɪᴀᴅᴏ ᴀ ${chats.length} ᴄʜᴀᴛs ᴛᴏᴛᴀʟᴇs*`, m)
  for (let id of chats) await conn.copyNForward(id, conn.cMod(m.chat, cc, /bc|broadcast/i.test(teks) ? `*𝘾𝙊𝙈𝙐𝙉𝙄𝘾𝘼𝘿𝙊 𝙊𝙁𝙄𝘾𝙄𝘼𝙇 ✅*\n` + teks : `*𝘾𝙊𝙈𝙐𝙉𝙄𝘾𝘼𝘿𝙊 𝙊𝙁𝙄𝘾𝙄𝘼𝙇 ✅*\n` + teks + '\n' + readMore + '\n\n' + botdate), true).catch(_ => _)
  await delay(5 * 5000)
  m.reply('se envio con éxitos ✅️')
}
handler.help = ['broadcast', 'bc'].map(v => v + ' <teks>')
handler.tags = ['owner']
handler.command = /^(comunicar|comunicado|broadcastall|bc)$/i

handler.owner = true

export default handler
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

const randomID = length => randomBytes(Math.ceil(length * .5)).toString('hex').slice(0, length)
*/ 
