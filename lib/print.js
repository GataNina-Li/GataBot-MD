import {WAMessageStubType} from '@whiskeysockets/baileys';
import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import { watchFile } from 'fs'

const terminalImage = global.opts['img'] ? require('terminal-image') : ''
const urlRegex = (await import('url-regex-safe')).default({ strict: false })
export default async function (m, conn = { user: {} }) {
let name_user
let _name = await conn.getName(m.sender)
let sender = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international') + (_name ? ' ~' + _name : '')
let chat = await conn.getName(m.chat)
let img
try {
if (global.opts['img'])
img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false
} catch (e) {
console.error(e)
}
let filesize = (m.msg ?
m.msg.vcard ?
m.msg.vcard.length :
m.msg.fileLength ?
m.msg.fileLength.low || m.msg.fileLength :
m.msg.axolotlSenderKeyDistributionMessage ?
m.msg.axolotlSenderKeyDistributionMessage.length :
m.text ?
m.text.length :
0
: m.text ? m.text.length : 0) || 0
let user = global.db.data.users[m.sender]
let me = PhoneNumber('+' + (conn.user?.jid).replace('@s.whatsapp.net', '')).getNumber('international')
try{
let usuario_info = conn.decodeJid(jid)
let name_info = conn.getName(jid)
name_user = `${name_info ? '(' + name_info + ') ' : 'Alguien'}[${PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')}]`
} catch {
name_user = 'Alguien'
}
console.log(`
╭━━━━━━━━━━━━━━𖡼
┃ ❖ ${chalk.white.bold('Bot:')} ${chalk.cyan.bold('%s')} 
┃ ❖ ${chalk.white.bold('Horario:')} ${chalk.black.bgGreen('%s')}
┃ ❖ ${chalk.white.bold('Acción:')} ${formatMessageStubType(m.messageStubType, name_user)}
┃ ❖ ${chalk.white.bold('Usuario:')} ${chalk.white('%s')} / ${chalk.bgMagentaBright.bold(user.role.replace(/\*/g, ''))} / Premium » ${user?.premiumTime > 0 ? '✅' : '❌'}
┃ ❖ ${chalk.white.bold('Recuersos:')} ${chalk.yellow('%s%s')}
┃ ❖ %s
┃ ❖ ${chalk.white.bold('Peso del mensaje:')} ${chalk.red('%s (%s %sB)')}
┃ ❖ ${chalk.white.bold('Tipo de mensaje:')} ${chalk.bgBlueBright.bold('[%s]')}
╰━━━━━━━━━━━━━━𖡼`.trim(),

//╭──» ${vs} 𓃠 «───✦ 
//┊ ${chalk.cyan.bold('%s')} ${chalk.black(chalk.cyan('%s'))}ㅤ${chalk.black(chalk.cyan('%s'))} ${chalk.magenta('%s [%s %sB]')}
//┊ ${chalk.white('%s')} ${chalk.yellow('%s%s')} ${chalk.magenta('%s')} ${chalk.black(chalk.red('%s'))}
//╰────────────✦`.trim(),            
me + ' / ~' + conn.user.name + `${conn.user.jid == global.conn.user.jid ? '' : ' 【𝗚𝗕 - 𝗦𝗨𝗕 𝗕𝗢𝗧】'}`,
(m.messageTimestamp ? new Date(1000 * (m.messageTimestamp.low || m.messageTimestamp)) : new Date).toTimeString(),
//m.messageStubType ? WAMessageStubType[m.messageStubType] : '',
//'Acción:' + formatMessageStubType(WAMessageStubType[m.messageStubType], name_user),
sender,
m ? '' : '',
`🆙 ${user.level} / ❇️ ${user.exp} / 💎 ${user.limit} / 🐱 ${user.money}`,
//user ? '|' + user.exp + '|' + user.money + '|' + user.limit : '' + ('|' + user.level),
//m.chat + (chat ? ' ~' + chat : ''),
(m.chat.includes("@g.us") ? `${chalk.white.bold('Grupo:')} ${chalk.magenta(`${m.chat} / ~${chat}`)}` : `${chalk.white.bold('Privado:')} ${chalk.magenta(`${m.sender} / ~${user.name ? user.name : conn.getName(m.sender)}`)} `),
filesize,
filesize === 0 ? 0 : (filesize / 1009 ** Math.floor(Math.log(filesize) / Math.log(1000))).toFixed(1),
['', ...'KMGTP'][Math.floor(Math.log(filesize) / Math.log(1000))] || '',
m.mtype ? m.mtype : 'No especificado'  //? m.mtype.replace(/message$/i, '').replace('audio', m.msg.ptt ? 'PTT' : 'audio').replace(/^./, v => v.toUpperCase()) : ''
)
if (img) console.log(img.trimEnd())
if (typeof m.text === 'string' && m.text) {
let log = m.text.replace(/\u200e+/g, '')
let mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~`])(?!`)(.+?)\1|```((?:.|[\n\r])+?)```|`([^`]+?)`)(?=\S?(?:[\s\n]|$))/g
let mdFormat = (depth = 4) => (_, type, text, monospace) => {
let types = {
'_': 'italic',
'*': 'bold',
'~': 'strikethrough',
'`': 'bgGray'
}
text = text || monospace
let formatted = !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(/`/g, '').replace(mdRegex, mdFormat(depth - 1)))
return formatted
}               
log = log.replace(mdRegex, mdFormat(4))
log = log.split('\n').map(line => {
if (line.trim().startsWith('>')) {
return chalk.bgGray.dim(line.replace(/^>/, '┃'))
} else if (/^([1-9]|[1-9][0-9])\./.test(line.trim())) {
return line.replace(/^(\d+)\./, (match, number) => {
const padding = number.length === 1 ? '  ' : ' '
return padding + number + '.'
})
} else if (/^[-*]\s/.test(line.trim())) {
return line.replace(/^[*-]/, '  •')
}
return line
}).join('\n')
if (log.length < 1024)
log = log.replace(urlRegex, (url, i, text) => {
let end = url.length + i
return i === 0 || end === text.length || (/^\s$/.test(text[end]) && /^\s$/.test(text[i - 1])) ? chalk.blueBright(url) : url
})
log = log.replace(mdRegex, mdFormat(4))
if (m.mentionedJid) for (let user of m.mentionedJid) log = log.replace('@' + user.split`@`[0], chalk.blueBright('@' +await conn.getName(user)))
console.log(m.error != null ? chalk.red(log) : m.isCommand ? chalk.yellow(log) : log == undefined ? '💬 Mensaje no encontrado' : log)
}
if (m.messageStubParameters) console.log(m.messageStubParameters.map(jid => {
jid = conn.decodeJid(jid)
let name = conn.getName(jid)
return chalk.gray(PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international') + (name ? ' ~' + name : '')) || '💬 Mensaje no encontrado'
}).join(', '))
if (/document/i.test(m.mtype)) console.log(`🗂️ ${m.msg.fileName || m.msg.displayName || 'Document'}`)
else if (/ContactsArray/i.test(m.mtype)) console.log(`👨‍👩‍👧‍👦 ${' ' || ''}`)
else if (/contact/i.test(m.mtype)) console.log(`👨 ${m.msg.displayName || ''}`)
else if (/audio/i.test(m.mtype)) {
const duration = m.msg.seconds
console.log(`${m.msg.ptt ? '🎤ㅤ(PTT ' : '🎵ㅤ('}AUDIO) ${Math.floor(duration / 60).toString().padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)}`)
}
console.log()
}
let file = global.__filename(import.meta.url)
watchFile(file, () => {
console.log(chalk.redBright("Update 'lib/print.js'"))})

function formatMessageStubType(messageStubType, name_user) {
switch (messageStubType) {
case 0:
return 'Desconocido'
case 1:
return 'Revocado'
case 2:
return 'Texto cifrado'
case 20:
return 'Se ha creado un grupo'
case 21:
return 'Nombre del grupo modificado'
case 22:
return 'Imagen del grupo modificada'
case 23:
return 'Nuevo enlace del grupo'
case 24:
return 'Nueva descripción del grupo'
case 25:
return 'Restricciones del grupo cambiada'
case 26:
return 'Anuncios del grupo cambiado'
case 27:
return `${name_user} se ha unido al grupo`
case 28:
return `${name_user} ha sido eliminado del grupo`
case 29:
return `${name_user} Nuevo admin. del grupo`
case 30:
return `${name_user} dejó de ser admin. del grupo`
case 31:
return `${name_user} se ha unido al grupo`
case 32:
return `Se ha invitado a ${name_user} al grupo`
default:
return messageStubType //'Ninguna'
}}
