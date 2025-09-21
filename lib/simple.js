import {en, es, id, ar, pt} from './idiomas/total-idiomas.js'
import path from 'path'
import {toAudio} from './converter.js'
import chalk from 'chalk'
import fetch from 'node-fetch'
import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'
import util from 'util'
import {fileTypeFromBuffer} from 'file-type'
import {format} from 'util'
import {fileURLToPath} from 'url'
import store from './store.js'
import Jimp from 'jimp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @type {import('@adiwajshing/baileys')}
 */
const {
default: _makeWaSocket,
makeWALegacySocket,
proto,
downloadContentFromMessage,
jidDecode,
areJidsSameUser,
generateWAMessage,
generateForwardMessageContent,
generateWAMessageFromContent,
WAMessageStubType,
extractMessageContent,
makeInMemoryStore,
getAggregateVotesInPollMessage,
prepareWAMessageMedia,
WA_DEFAULT_EPHEMERAL
} = (await import('@whiskeysockets/baileys')).default

export function makeWASocket(connectionOptions, options = {}) {
/**
   * @type {import('@adiwajshing/baileys').WASocket | import('@adiwajshing/baileys').WALegacySocket}
   */
let conn = (global.opts['legacy'] ? makeWALegacySocket : _makeWaSocket)(connectionOptions)

let sock = Object.defineProperties(conn, {
chats: {
value: {...(options.chats || {})},
writable: true
},
decodeJid: {
value(jid) {
if (!jid || typeof jid !== 'string') return (!nullish(jid) && jid) || null
return jid.decodeJid()
}
},
logger: {
get() {
return {
info(...args) {
console.log(
chalk.bold.bgRgb(51, 204, 51)('INFO '),
`[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
chalk.cyan(format(...args))
)
},
error(...args) {
console.log(
chalk.bold.bgRgb(247, 38, 33)('ERROR '),
`[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
chalk.rgb(255, 38, 0)(format(...args))
)
},
warn(...args) {
console.log(
chalk.bold.bgRgb(255, 153, 0)('WARNING '),
`[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
chalk.redBright(format(...args))
)
},
trace(...args) {
console.log(chalk.grey('TRACE '), `[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`, chalk.white(format(...args)))
},
debug(...args) {
console.log(
chalk.bold.bgRgb(66, 167, 245)('DEBUG '),
`[${chalk.rgb(255, 255, 255)(new Date().toUTCString())}]:`,
chalk.white(format(...args))
)
}
}
},
enumerable: true
},
//GataBot
sendGataBot: {
async value(jid, text = '', buffer, title, body, url, quoted, options) {
if (buffer)
try {
;((type = await conn.getFile(buffer)), (buffer = type.data))
} catch {
buffer = buffer
}
let prep = generateWAMessageFromContent(
jid,
{
extendedTextMessage: {
text: text,
contextInfo: {
externalAdReply: {
title: title,
body: body,
thumbnail: buffer,
sourceUrl: url
},
mentionedJid: await conn.parseMention(text)
}
}
},
{quoted: quoted}
)
return conn.relayMessage(jid, prep.message, {messageId: prep.key.id})
}
},
sendPayment: {
async value(jid, amount, text, quoted, options) {
conn.relayMessage(
jid,
{
requestPaymentMessage: {
currencyCodeIso4217: 'PEN',
amount1000: amount,
requestFrom: null,
noteMessage: {
extendedTextMessage: {
text: text,
contextInfo: {
externalAdReply: {
showAdAttribution: true
},
mentionedJid: conn.parseMention(text)
}
}
}
}
},
{}
)
}
},
getFile: {
/**
       * getBuffer hehe
       * @param {fs.PathLike} PATH
       * @param {Boolean} saveToFile
       */
async value(PATH, saveToFile = false) {
let res, filename
const data = Buffer.isBuffer(PATH)
? PATH
: PATH instanceof ArrayBuffer
? PATH.toBuffer()
: /^data:.*?\/.*?;base64,/i.test(PATH)
? Buffer.from(PATH.split`,`[1], 'base64')
: /^https?:\/\//.test(PATH)
? await (res = await fetch(PATH)).buffer()
: fs.existsSync(PATH)
? ((filename = PATH), fs.readFileSync(PATH))
: typeof PATH === 'string'
? PATH
: Buffer.alloc(0)
if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
const type = (await fileTypeFromBuffer(data)) || {
mime: 'application/octet-stream',
ext: '.bin'
}
if (data && saveToFile && !filename)
((filename = path.join(__dirname, '../tmp/' + new Date() * 1 + '.' + type.ext)), await fs.promises.writeFile(filename, data))
return {
res,
filename,
...type,
data,
deleteFile() {
return filename && fs.promises.unlink(filename)
}
}
},
enumerable: true
},
waitEvent: {
/**
       * waitEvent
       * @param {String} eventName
       * @param {Boolean} is
       * @param {Number} maxTries
       */
value(eventName, is = () => true, maxTries = 25) {
//Idk why this exist?
return new Promise((resolve, reject) => {
let tries = 0
let on = (...args) => {
if (++tries > maxTries) reject('Max tries reached')
else if (is()) {
conn.ev.off(eventName, on)
resolve(...args)
}
}
conn.ev.on(eventName, on)
})
}
},
sendContact: {
/**
       * Send Contact
       * @param {String} jid
       * @param {String[][]|String[]} data
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
       * @param {Object} options
       */
async value(jid, data, quoted, options) {
if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
let contacts = []
for (let [number, name] of data) {
number = number.replace(/[^0-9]/g, '')
let njid = number + '@s.whatsapp.net'
let biz = (await conn.getBusinessProfile(njid).catch((_) => null)) || {}
let vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name.replace(/\n/g, '\\n')};;;
FN:${name.replace(/\n/g, '\\n')}
TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}${
            biz.description
              ? `
X-WA-BIZ-NAME:${(conn.chats[njid]?.vname || conn.getName(njid) || name).replace(/\n/, '\\n')}
X-WA-BIZ-DESCRIPTION:${biz.description.replace(/\n/g, '\\n')}
`.trim()
              : ''
          }
END:VCARD
        `.trim()
contacts.push({vcard, displayName: name})
}
return await conn.sendMessage(
jid,
{
...options,
contacts: {
...options,
displayName: (contacts.length >= 2 ? `${contacts.length} kontak` : contacts[0].displayName) || null,
contacts
}
},
{quoted, ...options}
)
},
enumerable: true
},
resize: {
value(buffer, ukur1, ukur2) {
return new Promise(async (resolve, reject) => {
var baper = await Jimp.read(buffer)
var ab = await baper.resize(ukur1, ukur2).getBufferAsync(Jimp.MIME_JPEG)
resolve(ab)
})
}
},

relayWAMessage: {
async value(pesanfull) {
if (pesanfull.message.audioMessage) {
await conn.sendPresenceUpdate('recording', pesanfull.key.remoteJid)
} else {
await conn.sendPresenceUpdate('composing', pesanfull.key.remoteJid)
}
var mekirim = await conn.relayMessage(pesanfull.key.remoteJid, pesanfull.message, {messageId: pesanfull.key.id})
conn.ev.emit('messages.upsert', {
messages: [pesanfull],
type: 'append'
})
return mekirim
}
},
/**
     * Send a list message
     * @param jid the id to send to
     * @param button the optional button text, title and description button
     * @param rows the rows of sections list message
     */
sendListM: {
async value(jid, button, rows, quoted, options = {}) {
let fsizedoc = '1'.repeat(10)
const sections = [
{
title: button.title,
rows: [...rows]
}
]
const listMessage = {
text: button.description,
footer: button.footerText,
mentions: await conn.parseMention(button.description),
ephemeralExpiration: '86400',
title: '',
buttonText: button.buttonText,
sections
}
conn.sendMessage(jid, listMessage, {
quoted,
ephemeralExpiration: fsizedoc,
contextInfo: {
forwardingScore: fsizedoc,
isForwarded: true,
mentions: await conn.parseMention(button.description + button.footerText),
...options
}
})
}
},

sendList: {
async value(jid, title, text, buttonText, listSections, quoted, options = {}) {
const sections = [...listSections]

const message = {
interactiveMessage: {
header: {title: title},
body: {text: text},
nativeFlowMessage: {
buttons: [
{
name: 'single_select',
buttonParamsJson: JSON.stringify({
title: buttonText,
sections
})
}
],
messageParamsJson: ''
}
}
}
await conn.relayMessage(jid, {viewOnceMessage: {message}}, {})
}
},
/**
     * Send Contact Array
     * @param {String} jid
     * @param {String} number
     * @param {String} name
     * @param {Object} quoted
     * @param {Object} options
     */
sendContactArray: {
async value(jid, data, quoted, options) {
if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
let contacts = []
let buttons = []
for (let [number, name, isi, isi1, isi2, isi3, isi4, isi5, ...extraLinks] of data) {
number = number.replace(/[^0-9]/g, '')
let njid = number + '@s.whatsapp.net'
let biz = (await conn.getBusinessProfile(njid).catch((_) => null)) || {}
let vcard = `
BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:${name.replace(/\n/g, '\\n')}
item.ORG:${isi}
item1.TEL;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
item1.X-ABLabel:${isi1}
${isi2 ? `item2.EMAIL;type=INTERNET:${isi2}\nitem2.X-ABLabel:📧 Email` : ''}
${isi3 ? `item3.ADR:;;${isi3};;;;\nitem3.X-ABADR:ac \nitem3.X-ABLabel:📍 Region` : ''}
${isi4 ? `item4.URL;type=pref:${isi4}\nitem4.X-ABLabel:Website` : ''}
${extraLinks.map((link, index) => (link ? `item${index + 5}.URL;type=pref:${link}\nitem${index + 5}.X-ABLabel:Extra Link ${index + 1}` : '')).join('\n')}
${isi5 ? `${extraLinks.length > 0 ? `item${extraLinks.length + 5}` : 'item5'}.X-ABLabel:${isi5}` : ''}
END:VCARD`.trim()

let newButtons = extraLinks.map((link, index) => ({
buttonId: `extra-link-${index + 1}`,
buttonText: {displayText: `Extra Link ${index + 1}`},
type: 1,
url: `http://${link}`
}))
buttons.push(...newButtons)

contacts.push({vcard, displayName: name})
}

let displayName = null
if (contacts.length === 1) {
displayName = contacts[0].displayName
} else if (contacts.length > 1) {
displayName = `${contacts.length} kontak`
}

let contactsWithButtons = []
for (let i = 0; i < contacts.length; i++) {
let contact = contacts[i]
let contactButtons = buttons.filter((button) => button.buttonId.startsWith(`extra-link-${i + 1}`))
contactsWithButtons.push({
...contact,
...{buttons: contactButtons}
})
}

return await conn.sendMessage(
jid,
{
contacts: {
displayName,
contacts: contactsWithButtons
}
},
{
quoted,
...options
}
)
}
},

sendFile: {
/**
       * Send Media/File with Automatic Type Specifier
       * @param {String} jid
       * @param {String|Buffer} path
       * @param {String} filename
       * @param {String} caption
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
       * @param {Boolean} ptt
       * @param {Object} options
       */
async value(jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) {
let type = await conn.getFile(path, true)
let {res, data: file, filename: pathFile} = type
if ((res && res.status !== 200) || file.length <= 65536) {
try {
throw {json: JSON.parse(file.toString())}
} catch (e) {
if (e.json) throw e.json
}
}
//const fileSize = fs.statSync(pathFile).size / 1024 / 1024
//if (fileSize >= 100) throw new Error('File size is too big!')
let opt = {}
if (quoted) opt.quoted = quoted
if (!type) options.asDocument = true
let mtype = '',
mimetype = options.mimetype || type.mime,
convert
if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
else if (/video/.test(type.mime)) mtype = 'video'
else if (/audio/.test(type.mime))
((convert = await toAudio(file, type.ext)),
(file = convert.data),
(pathFile = convert.filename),
(mtype = 'audio'),
(mimetype = options.mimetype || 'audio/ogg; codecs=opus'))
else mtype = 'document'
if (options.asDocument) mtype = 'document'

delete options.asSticker
delete options.asLocation
delete options.asVideo
delete options.asDocument
delete options.asImage

let message = {
...options,
caption,
ptt,
[mtype]: {url: pathFile},
mimetype,
fileName: filename || pathFile.split('/').pop()
}
/**
         * @type {import('@adiwajshing/baileys').proto.WebMessageInfo}
         */
let m
try {
m = await conn.sendMessage(jid, message, {...opt, ...options})
} catch (e) {
console.error(e)
m = null
} finally {
if (!m) m = await conn.sendMessage(jid, {...message, [mtype]: file}, {...opt, ...options})
file = null // releasing the memory
return m
}
},
enumerable: true
},

reply: {
/**
       * Reply to a message
       * @param {String} jid
       * @param {String|Buffer} text
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
       * @param {Object} options
       */

async value(jid, text = '', quoted, options) {
if (Buffer.isBuffer(text)) {
return conn.sendFile(jid, text, 'file', '', quoted, false, options)
} else {
let canalId = [
'120363160031023229@newsletter',
'120363169294281316@newsletter',
'120363203805910750@newsletter',
'120363302472386010@newsletter',
' 120363301598733462@newsletter',
'120363336642332098@newsletter'
]
let canalNombre = [
'INFINITY-WA 💫',
'GB - UPDATE 🐈',
'Tips sobre GataBot 🤩',
'𝗡𝗘𝗪 𝗣𝗥𝗢𝗝𝗘𝗖𝗧 ⟡ YartexBot-MD ✨',
'Sky Ultra Plus ☁️',
'GataBot Test'
]

async function getRandomChannel() {
let randomIndex = Math.floor(Math.random() * canalId.length)
let id = canalId[randomIndex]
let nombre = canalNombre[randomIndex]
return {id, nombre}
}

let randomChannel = await getRandomChannel()
const contextInfo = {
mentionedJid: await conn.parseMention(text),
isForwarded: true,
forwardingScore: 1,
forwardedNewsletterMessageInfo: {
newsletterJid: randomChannel.id,
newsletterName: randomChannel.nombre
}
}

const messageOptions = {...options, text, contextInfo}
return conn.sendMessage(jid, messageOptions, {quoted, ...options})
}
}
},

/** Resize Image
     *
     * @param {Buffer} Buffer (Only Image)
     * @param {Numeric} Width
     * @param {Numeric} Height
     */
resize: {
async value(image, width, height) {
let oyy = await Jimp.read(image)
let kiyomasa = await oyy.resize(width, height).getBufferAsync(Jimp.MIME_JPEG)
return kiyomasa
}
},
/** Profile Image
     *
     * @param {Buffer} Buffer (Only Image)
     * @param {Numeric} Width
     * @param {Numeric} Height
     */
generateProfilePicture: {
async value(buffer) {
const jimp_1 = await Jimp.read(buffer)
const resz = jimp_1.getWidth() > jimp_1.getHeight() ? jimp_1.resize(550, Jimp.AUTO) : jimp_1.resize(Jimp.AUTO, 650)
const jimp_2 = await Jimp.read(await resz.getBufferAsync(Jimp.MIME_JPEG))
return {
img: await resz.getBufferAsync(Jimp.MIME_JPEG)
}
}
},

/*sendAlbumMessage: {
    async value(jid, medias, options = {}) {
        let img, video;
        const caption = options.text || options.caption || "";
        
        const album =generateWAMessageFromContent(jid, {
            albumMessage: {
                expectedImageCount: medias.filter(media => media.type === "image").length,
                expectedVideoCount: medias.filter(media => media.type === "video").length,
                ...(options.quoted ? {
                    contextInfo: {
                        remoteJid: options.quoted.key.remoteJid,
                        fromMe: options.quoted.key.fromMe,
                        stanzaId: options.quoted.key.id,
                        participant: options.quoted.key.participant || options.quoted.key.remoteJid,
                        quotedMessage: options.quoted.message
                    }
                } : {})
            }
        }, { quoted: options.quoted });
        
        await conn.relayMessage(album.key.remoteJid, album.message, {
            messageId: album.key.id
        });

        for (const media of medias) {
            const { type, data } = media;
            
            if (/^https?:\/\//i.test(data.url)) {
                try {
                    const response = await fetch(data.url);
                    const contentType = response.headers.get('content-type');
                    
                    if (/^image\//i.test(contentType)) {
                        img = await prepareWAMessageMedia({ image: { url: data.url } }, { upload: conn.waUploadToServer });
                    } else if (/^video\//i.test(contentType)) {
                        video = await prepareWAMessageMedia({ video: { url: data.url } }, { upload: conn.waUploadToServer });
                    }
                } catch (error) {
                    console.error("Error al obtener el tipo MIME:", error);
                }
            }
            
            const mediaMessage = await generateWAMessage(album.key.remoteJid, {
                [type]: data,
                ...(media === medias[0] ? { caption } : {})
            }, {
                upload: conn.waUploadToServer
            });

            mediaMessage.message.messageContextInfo = {
                messageAssociation: {
                    associationType: 1,
                    parentMessageKey: album.key
                }
            };

            await conn.relayMessage(mediaMessage.key.remoteJid, mediaMessage.message, {
                messageId: mediaMessage.key.id
            });
        }

        return album;
    }
},	
*/

/**
     * send Button Img
     * @param {String} jid
     * @param {String} contentText
     * @param {String} footer
     * @param {Buffer|String} buffer
     * @param {String[]} buttons
     * @param {Object} quoted
     * @param {Object} options
     */
sendButtonImg: {
async value(jid, buffer, contentText, footerText, button1, id1, quoted, options) {
let type = await conn.getFile(buffer)
let {res, data: file} = type
if ((res && res.status !== 200) || file.length <= 65536) {
try {
throw {json: JSON.parse(file.toString())}
} catch (e) {
if (e.json) throw e.json
}
}
const buttons = [{buttonId: id1, buttonText: {displayText: button1}, type: 1}]

const buttonMessage = {
image: file,
fileLength: 800000000000000,
caption: contentText,
footer: footerText,
mentions: await conn.parseMention(contentText + footerText),
...options,
buttons: buttons,
headerType: 4
}

return conn.sendMessage(jid, buttonMessage, {
quoted,
ephemeralExpiration: 86400,
contextInfo: {
mentionedJid: conn.parseMention(contentText + footerText)
},
...options
})
}
},

/**
     * send Button Vid
     * @param {String} jid
     * @param {String} contentText
     * @param {String} footer
     * @param {Buffer|String} buffer
     * @param {String} buttons1
     * @param {String} row1
     * @param {Object} quoted
     * @param {Object} options
     */
send1ButtonVid: {
async value(jid, buffer, contentText, footerText, button1, id1, quoted, options) {
let type = await conn.getFile(buffer)
let {res, data: file} = type
if ((res && res.status !== 200) || file.length <= 65536) {
try {
throw {json: JSON.parse(file.toString())}
} catch (e) {
if (e.json) throw e.json
}
}
let buttons = [{buttonId: id1, buttonText: {displayText: button1}, type: 1}]
const buttonMessage = {
video: file,
fileLength: 800000000000000,
caption: contentText,
footer: footerText,
mentions: await conn.parseMention(contentText),
...options,
buttons: buttons,
headerType: 4
}
return conn.sendMessage(jid, buttonMessage, {
quoted,
ephemeralExpiration: 86400,
...options
})
}
},

send2ButtonVid: {
async value(jid, buffer, contentText, footerText, button1, id1, button2, id2, quoted, options) {
let type = await conn.getFile(buffer)
let {res, data: file} = type
if ((res && res.status !== 200) || file.length <= 65536) {
try {
throw {json: JSON.parse(file.toString())}
} catch (e) {
if (e.json) throw e.json
}
}
let buttons = [
{buttonId: id1, buttonText: {displayText: button1}, type: 1},
{buttonId: id2, buttonText: {displayText: button2}, type: 1}
]
const buttonMessage = {
video: file,
fileLength: 800000000000000,
caption: contentText,
footer: footerText,
mentions: await conn.parseMention(contentText + footerText),
...options,
buttons: buttons,
headerType: 4
}
return conn.sendMessage(jid, buttonMessage, {
quoted,
ephemeralExpiration: 86400,
...options
})
}
},

sendButtonLoc: {
/**
       * send Button Loc
       * @param {String} jid
       * @param {String} contentText
       * @param {String} footer
       * @param {Buffer|String} buffer
       * @param {String[]} buttons
       * @param {Object} quoted
       * @param {Object} options
       */
async value(jid, buffer, content, footer, button1, row1, quoted, options = {}) {
let type = await conn.getFile(buffer)
let {res, data: file} = type
if ((res && res.status !== 200) || file.length <= 65536) {
try {
throw {json: JSON.parse(file.toString())}
} catch (e) {
if (e.json) throw e.json
}
}
let buttons = [{buttonId: row1, buttonText: {displayText: button1}, type: 1}]

let buttonMessage = {
location: {jpegThumbnail: file},
caption: content,
footer: footer,
mentions: await conn.parseMention(content + footer),
...options,
buttons: buttons,
headerType: 6
}
return await conn.sendMessage(jid, buttonMessage, {
quoted,
upload: conn.waUploadToServer,
ephemeralExpiration: global.ephemeral,
mentions: await conn.parseMention(content + footer),
...options
})
}
},

/** This Section **/
sendButtonVid: {
async value(jid, buffer, contentText, footerText, button1, id1, button2, id2, button3, id3, quoted, options) {
let type = await conn.getFile(buffer)
let {res, data: file} = type
if ((res && res.status !== 200) || file.length <= 65536) {
try {
throw {json: JSON.parse(file.toString())}
} catch (e) {
if (e.json) throw e.json
}
}
let buttons = [
{buttonId: id1, buttonText: {displayText: button1}, type: 1},
{buttonId: id2, buttonText: {displayText: button2}, type: 1},
{buttonId: id3, buttonText: {displayText: button3}, type: 1}
]
const buttonMessage = {
video: file,
fileLength: 800000000000000,
caption: contentText,
footer: footerText,
mentions: await conn.parseMention(contentText + footerText),
...options,
buttons: buttons,
headerType: 4
}
return conn.sendMessage(jid, buttonMessage, {
quoted,
ephemeralExpiration: 86400,
...options
})
}
},

/** This Section **/
sendTemplateButtonLoc: {
async value(jid, buffer, contentText, footer, buttons1, row1, quoted, options) {
let file = await conn.resize(buffer, 300, 150)
const template = generateWAMessageFromContent(
jid,
proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
locationMessage: {jpegThumbnail: file},
hydratedContentText: contentText,
hydratedFooterText: footer,
...options,
hydratedButtons: [
{
urlButton: {
displayText: global.author,
url: global.md
}
},
{
quickReplyButton: {
displayText: buttons1,
id: row1
}
}
]
}
}
}),
{
userJid: conn.user.jid,
quoted: quoted,
contextInfo: {
mentionedJid: conn.parseMention(contentText + footer)
},
ephemeralExpiration: '86400',
...options
}
)
return conn.relayMessage(jid, template.message, {
messageId: template.key.id
})
}
},

sendGroupV4Invite: {
/**
       * sendGroupV4Invite
       * @param {String} jid
       * @param {*} participant
       * @param {String} inviteCode
       * @param {Number} inviteExpiration
       * @param {String} groupName
       * @param {String} caption
       * @param {Buffer} jpegThumbnail
       * @param {*} options
       */
async value(
jid,
participant,
inviteCode,
inviteExpiration,
groupName = 'unknown subject',
caption = 'Invitation to join my WhatsApp group',
jpegThumbnail,
options = {}
) {
const msg = proto.Message.fromObject({
groupInviteMessage: proto.GroupInviteMessage.fromObject({
inviteCode,
inviteExpiration: parseInt(inviteExpiration) || +new Date(new Date() + 3 * 86400000),
groupJid: jid,
groupName: (groupName ? groupName : await conn.getName(jid)) || null,
jpegThumbnail: Buffer.isBuffer(jpegThumbnail) ? jpegThumbnail : null,
caption
})
})
const message = generateWAMessageFromContent(participant, msg, options)
await conn.relayMessage(participant, message.message, {
messageId: message.key.id,
additionalAttributes: {...options}
})
return message
},
enumerable: true
},

sendButton: {
async value(jid, text = '', footer = '', buffer, buttons, copy, urls, list, quoted, options) {
let img, video

if (/^https?:\/\//i.test(buffer)) {
try {
// Obtener el tipo MIME de la URL
const response = await fetch(buffer)
const contentType = response.headers.get('content-type')
if (/^image\//i.test(contentType)) {
img = await prepareWAMessageMedia({image: {url: buffer}}, {upload: conn.waUploadToServer})
} else if (/^video\//i.test(contentType)) {
video = await prepareWAMessageMedia({video: {url: buffer}}, {upload: conn.waUploadToServer})
} else {
console.error('Tipo MIME no compatible:', contentType)
}
} catch (error) {
console.error('Error al obtener el tipo MIME:', error)
}
} else {
try {
const type = await conn.getFile(buffer)
if (/^image\//i.test(type.mime)) {
img = await prepareWAMessageMedia({image: {url: buffer}}, {upload: conn.waUploadToServer})
} else if (/^video\//i.test(type.mime)) {
video = await prepareWAMessageMedia({video: {url: buffer}}, {upload: conn.waUploadToServer})
}
} catch (error) {
console.error('Error al obtener el tipo de archivo:', error)
}
}

const dynamicButtons = []

// Botones de tipo quick_reply
if (buttons && Array.isArray(buttons)) {
dynamicButtons.push(
...buttons.map((btn) => ({
name: 'quick_reply',
buttonParamsJson: JSON.stringify({
display_text: btn[0],
id: btn[1]
})
}))
)
}

// Botones de copiar
if (copy && Array.isArray(copy)) {
dynamicButtons.push(
...copy.map((copyBtn) => ({
name: 'cta_copy',
buttonParamsJson: JSON.stringify({
display_text: copyBtn[0] || 'Copy',
copy_code: copyBtn[1]
})
}))
)
}

// Botones de URL
if (urls && Array.isArray(urls)) {
urls.forEach((url) => {
dynamicButtons.push({
name: 'cta_url',
buttonParamsJson: JSON.stringify({
display_text: url[0],
url: url[1],
merchant_url: url[1]
})
})
})
}

// Botones de lista
if (list && Array.isArray(list)) {
list.forEach((lister) => {
dynamicButtons.push({
name: 'single_select',
buttonParamsJson: JSON.stringify({
title: lister[0],
sections: lister[1]
})
})
})
}
const interactiveMessage = {
body: {text: text},
footer: {text: footer},
header: {
hasMediaAttachment: false,
imageMessage: img ? img.imageMessage : null,
videoMessage: video ? video.videoMessage : null
},
nativeFlowMessage: {
buttons: dynamicButtons,
messageParamsJson: ''
}
}

let msgL = generateWAMessageFromContent(
jid,
{
viewOnceMessage: {
message: {
interactiveMessage
}
}
},
{userJid: conn.user.jid, quoted}
)

conn.relayMessage(jid, msgL.message, {
messageId: msgL.key.id,
...options
})
}
},

/**
     * Send nativeFlowMessage
     */
sendNCarousel: {
async value(jid, text = '', footer = '', buffer, buttons, copy, urls, list, quoted, options) {
let img, video
if (buffer) {
if (/^https?:\/\//i.test(buffer)) {
try {
const response = await fetch(buffer)
const contentType = response.headers.get('content-type')
if (/^image\//i.test(contentType)) {
img = await prepareWAMessageMedia(
{
image: {
url: buffer
}
},
{
upload: conn.waUploadToServer,
...options
}
)
} else if (/^video\//i.test(contentType)) {
video = await prepareWAMessageMedia(
{
video: {
url: buffer
}
},
{
upload: conn.waUploadToServer,
...options
}
)
} else {
console.error('Incompatible MIME type:', contentType)
}
} catch (error) {
console.error('Failed to get MIME type:', error)
}
} else {
try {
const type = await conn.getFile(buffer)
if (/^image\//i.test(type.mime)) {
img = await prepareWAMessageMedia(
{
image: /^https?:\/\//i.test(buffer)
? {
url: buffer
}
: type && type?.data
},
{
upload: conn.waUploadToServer,
...options
}
)
} else if (/^video\//i.test(type.mime)) {
video = await prepareWAMessageMedia(
{
video: /^https?:\/\//i.test(buffer)
? {
url: buffer
}
: type && type?.data
},
{
upload: conn.waUploadToServer,
...options
}
)
}
} catch (error) {
console.error('Failed to get file type:', error)
}
}
}
const dynamicButtons = buttons.map((btn) => ({
name: 'quick_reply',
buttonParamsJson: JSON.stringify({
display_text: btn[0],
id: btn[1]
})
}))
dynamicButtons.push(
copy && (typeof copy === 'string' || typeof copy === 'number')
? {
name: 'cta_copy',
buttonParamsJson: JSON.stringify({
display_text: 'Copy',
copy_code: copy
})
}
: null
)

urls?.forEach((url) => {
dynamicButtons.push({
name: 'cta_url',
buttonParamsJson: JSON.stringify({
display_text: url[0],
url: url[1],
merchant_url: url[1]
})
})
})
list?.forEach((lister) => {
dynamicButtons.push({
name: 'single_select',
buttonParamsJson: JSON.stringify({
title: lister[0],
sections: lister[1]
})
})
})
const interactiveMessage = {
body: {
text: text || ''
},
footer: {
text: footer || wm
},
header: {
hasMediaAttachment: img?.imageMessage || video?.videoMessage ? true : false,
imageMessage: img?.imageMessage || null,
videoMessage: video?.videoMessage || null
},
nativeFlowMessage: {
buttons: dynamicButtons.filter(Boolean),
messageParamsJson: ''
},
...Object.assign(
{
mentions: typeof text === 'string' ? conn.parseMention(text || '@0') : [],
contextInfo: {
mentionedJid: typeof text === 'string' ? conn.parseMention(text || '@0') : []
}
},
{
...(options || {}),
...(conn.temareply?.contextInfo && {
contextInfo: {
...(options?.contextInfo || {}),
...conn.temareply?.contextInfo,
externalAdReply: {
...(options?.contextInfo?.externalAdReply || {}),
...conn.temareply?.contextInfo?.externalAdReply
}
}
})
}
)
}
const messageContent = proto.Message.fromObject({
viewOnceMessage: {
message: {
messageContextInfo: {
deviceListMetadata: {},
deviceListMetadataVersion: 2
},
interactiveMessage
}
}
})
const msgs = await generateWAMessageFromContent(jid, messageContent, {
userJid: conn.user.jid,
quoted: quoted,
upload: conn.waUploadToServer,
ephemeralExpiration: WA_DEFAULT_EPHEMERAL
})
await conn.relayMessage(jid, msgs.message, {
messageId: msgs.key.id
})
}
},

/**
     * Send carouselMessage
     */
sendCarousel: {
async value(jid, text = '', footer = '', text2 = '', messages, quoted, options) {
if (messages.length > 1) {
const cards = await Promise.all(
messages.map(async ([text = '', footer = '', buffer, buttons, copy, urls, list]) => {
let img, video
if (/^https?:\/\//i.test(buffer)) {
try {
const response = await fetch(buffer)
const contentType = response.headers.get('content-type')
if (/^image\//i.test(contentType)) {
img = await prepareWAMessageMedia(
{
image: {
url: buffer
}
},
{
upload: conn.waUploadToServer,
...options
}
)
} else if (/^video\//i.test(contentType)) {
video = await prepareWAMessageMedia(
{
video: {
url: buffer
}
},
{
upload: conn.waUploadToServer,
...options
}
)
} else {
console.error('Incompatible MIME types:', contentType)
}
} catch (error) {
console.error('Failed to get MIME type:', error)
}
} else {
try {
const type = await conn.getFile(buffer)
if (/^image\//i.test(type.mime)) {
img = await prepareWAMessageMedia(
{
image: /^https?:\/\//i.test(buffer)
? {
url: buffer
}
: type && type?.data
},
{
upload: conn.waUploadToServer,
...options
}
)
} else if (/^video\//i.test(type.mime)) {
video = await prepareWAMessageMedia(
{
video: /^https?:\/\//i.test(buffer)
? {
url: buffer
}
: type && type?.data
},
{
upload: conn.waUploadToServer,
...options
}
)
}
} catch (error) {
console.error('Failed to get file type:', error)
}
}
const dynamicButtons = buttons.map((btn) => ({
name: 'quick_reply',
buttonParamsJson: JSON.stringify({
display_text: btn[0],
id: btn[1]
})
}))
copy = Array.isArray(copy) ? copy : [copy]
copy.map((copy) => {
dynamicButtons.push({
name: 'cta_copy',
buttonParamsJson: JSON.stringify({
display_text: 'Copy',
copy_code: copy[0]
})
})
})
urls?.forEach((url) => {
dynamicButtons.push({
name: 'cta_url',
buttonParamsJson: JSON.stringify({
display_text: url[0],
url: url[1],
merchant_url: url[1]
})
})
})

list?.forEach((lister) => {
dynamicButtons.push({
name: 'single_select',
buttonParamsJson: JSON.stringify({
title: lister[0],
sections: lister[1]
})
})
})

return {
body: proto.Message.InteractiveMessage.Body.fromObject({
text: text || ''
}),
footer: proto.Message.InteractiveMessage.Footer.fromObject({
text: footer || wm
}),
header: proto.Message.InteractiveMessage.Header.fromObject({
title: text2,
subtitle: text || '',
hasMediaAttachment: img?.imageMessage || video?.videoMessage ? true : false,
imageMessage: img?.imageMessage || null,
videoMessage: video?.videoMessage || null
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: dynamicButtons.filter(Boolean),
messageParamsJson: ''
}),
...Object.assign(
{
mentions: typeof text === 'string' ? conn.parseMention(text || '@0') : [],
contextInfo: {
mentionedJid: typeof text === 'string' ? conn.parseMention(text || '@0') : []
}
},
{
...(options || {}),
...(conn.temareply?.contextInfo && {
contextInfo: {
...(options?.contextInfo || {}),
...conn.temareply?.contextInfo,
externalAdReply: {
...(options?.contextInfo?.externalAdReply || {}),
...conn.temareply?.contextInfo?.externalAdReply
}
}
})
}
)
}
})
)
const interactiveMessage = proto.Message.InteractiveMessage.create({
body: proto.Message.InteractiveMessage.Body.fromObject({
text: text || ''
}),
footer: proto.Message.InteractiveMessage.Footer.fromObject({
text: footer || wm
}),
header: proto.Message.InteractiveMessage.Header.fromObject({
title: text || '',
subtitle: text || '',
hasMediaAttachment: false
}),
carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
cards
}),
...Object.assign(
{
mentions: typeof text === 'string' ? conn.parseMention(text || '@0') : [],
contextInfo: {
mentionedJid: typeof text === 'string' ? conn.parseMention(text || '@0') : []
}
},
{
...(options || {}),
...(conn.temareply?.contextInfo && {
contextInfo: {
...(options?.contextInfo || {}),
...conn.temareply?.contextInfo,
externalAdReply: {
...(options?.contextInfo?.externalAdReply || {}),
...conn.temareply?.contextInfo?.externalAdReply
}
}
})
}
)
})
const messageContent = proto.Message.fromObject({
viewOnceMessage: {
message: {
messageContextInfo: {
deviceListMetadata: {},
deviceListMetadataVersion: 2
},
interactiveMessage
}
}
})
const msgs = await generateWAMessageFromContent(jid, messageContent, {
userJid: conn.user.jid,
quoted: quoted,
upload: conn.waUploadToServer,
ephemeralExpiration: WA_DEFAULT_EPHEMERAL
})
await conn.relayMessage(jid, msgs.message, {
messageId: msgs.key.id
})
} else {
await conn.sendNCarousel(jid, ...messages[0], quoted, options)
}
}
},

/*  sendCarousel: {
      async value(jid, text = '', footer = '', text2 = '', messages, quoted, options) {
        if (messages.length > 1) {
          const cards = await Promise.all(messages.map(async ([text = '', footer = '', buffer, buttons, copy,
            urls, list
          ]) => {
            let img, video;
            if (/^https?:\/\//i.test(buffer)) {
              try {
                const response = await fetch(buffer);
                const contentType = response.headers.get('content-type');
                if (/^image\//i.test(contentType)) {
                  img = await prepareWAMessageMedia({
                    image: {
                      url: buffer
                    }
                  }, {
                    upload: conn.waUploadToServer,
                    ...options
                  });
                } else if (/^video\//i.test(contentType)) {
                  video = await prepareWAMessageMedia({
                    video: {
                      url: buffer
                    }
                  }, {
                    upload: conn.waUploadToServer,
                    ...options
                  });
                } else {
                  console.error("Incompatible MIME types:", contentType);
                }
              } catch (error) {
                console.error("Failed to get MIME type:", error);
              }
            } else {
              try {
                const type = await conn.getFile(buffer);
                if (/^image\//i.test(type.mime)) {
                  img = await prepareWAMessageMedia({
                    image: (/^https?:\/\//i.test(buffer)) ? {
                      url: buffer
                    } : (type && type?.data)
                  }, {
                    upload: conn.waUploadToServer,
                    ...options
                  });
                } else if (/^video\//i.test(type.mime)) {
                  video = await prepareWAMessageMedia({
                    video: (/^https?:\/\//i.test(buffer)) ? {
                      url: buffer
                    } : (type && type?.data)
                  }, {
                    upload: conn.waUploadToServer,
                    ...options
                  });
                }
              } catch (error) {
                console.error("Failed to get file type:", error);
              }
            }
            const dynamicButtons = buttons.map(btn => ({
              name: 'quick_reply',
              buttonParamsJson: JSON.stringify({
                display_text: btn[0],
                id: btn[1]
              }),
            }));
	    copy = Array.isArray(copy) ? copy : [copy]
	    copy.map(copy => {
                dynamicButtons.push({
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                        display_text: 'Copy',
                        copy_code: copy[0]
                    })
                });
            });
            urls?.forEach(url => {
              dynamicButtons.push({
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                  display_text: url[0],
                  url: url[1],
                  merchant_url: url[1]
                })
              });
            });

	          list?.forEach(lister => {
              dynamicButtons.push({
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                  title: lister[0],
                  sections: lister[1]
                })
              });
            })

            return {
              body: proto.Message.InteractiveMessage.Body.fromObject({
                text: text || ''
              }),
              footer: proto.Message.InteractiveMessage.Footer.fromObject({
                text: footer || wm
              }),
              header: proto.Message.InteractiveMessage.Header.fromObject({
                title: text2,
                subtitle: text || '',
                hasMediaAttachment: img?.imageMessage || video?.videoMessage ? true : false,
                imageMessage: img?.imageMessage || null,
                videoMessage: video?.videoMessage || null
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: dynamicButtons.filter(Boolean),
                messageParamsJson: ''
              }),
              ...Object.assign({
                mentions: typeof text === 'string' ? conn.parseMention(text || '@0') : [],
                contextInfo: {
                  mentionedJid: typeof text === 'string' ? conn.parseMention(text || '@0') : [],
                }
              }, {
                ...(options || {}),
                ...(conn.temareply?.contextInfo && {
                  contextInfo: {
                    ...(options?.contextInfo || {}),
                    ...conn.temareply?.contextInfo,
                    externalAdReply: {
                      ...(options?.contextInfo?.externalAdReply || {}),
                      ...conn.temareply?.contextInfo?.externalAdReply,
                    },
                  },
                })
              })
            };
          }));
          const interactiveMessage = proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.fromObject({
              text: text || ''
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({
              text: footer || wm
            }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
              title: text || '',
              subtitle: text || '',
              hasMediaAttachment: false
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards,
            }),
            ...Object.assign({
              mentions: typeof text === 'string' ? conn.parseMention(text || '@0') : [],
              contextInfo: {
                mentionedJid: typeof text === 'string' ? conn.parseMention(text || '@0') : [],
              }
            }, {
              ...(options || {}),
              ...(conn.temareply?.contextInfo && {
                contextInfo: {
                  ...(options?.contextInfo || {}),
                  ...conn.temareply?.contextInfo,
                  externalAdReply: {
                    ...(options?.contextInfo?.externalAdReply || {}),
                    ...conn.temareply?.contextInfo?.externalAdReply,
                  },
                },
              })
            })
          });
          const messageContent = proto.Message.fromObject({
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadata: {},
                  deviceListMetadataVersion: 2
                },
                interactiveMessage
              }
            }
          });
          const msgs = await generateWAMessageFromContent(jid, messageContent, {
            userJid: conn.user.jid,
            quoted: quoted,
            upload: conn.waUploadToServer,
            ephemeralExpiration: WA_DEFAULT_EPHEMERAL
          });
          await conn.relayMessage(jid, msgs.message, {
            messageId: msgs.key.id
          });
        } else {
          await conn.sendNCarousel(jid, ...messages[0], quoted, options);
        }
      }
    }, */

ctaButton: {
get() {
class Button {
constructor() {
this._title = ''
this._subtitle = ''
this._body = ''
this._footer = ''
this._buttons = []
this._data = null
this._contextInfo = {}
this._currentSelectionIndex = -1
this._currentSectionIndex = -1
}
setType(type) {
this._type = type
return this
}
contextInfo(info) {
this._contextInfo = info
return this
}
setBody(body) {
this._body = body
return this
}
setFooter(footer) {
this._footer = footer
return this
}
makeRow(header = '', title = '', description = '', id = '') {
if (this._currentSelectionIndex === -1 || this._currentSectionIndex === -1) {
throw new Error('You need to create a selection and a section first')
}
const buttonParams = JSON.parse(this._buttons[this._currentSelectionIndex].buttonParamsJson)
buttonParams.sections[this._currentSectionIndex].rows.push({
header: header,
title: title,
description: description,
id: id
})
this._buttons[this._currentSelectionIndex].buttonParamsJson = JSON.stringify(buttonParams)
return this
}
makeSections(title = '') {
if (this._currentSelectionIndex === -1) {
throw new Error('You need to create a selection first')
}
const buttonParams = JSON.parse(this._buttons[this._currentSelectionIndex].buttonParamsJson)
buttonParams.sections.push({
title: title,
rows: []
})
this._currentSectionIndex = buttonParams.sections.length - 1
this._buttons[this._currentSelectionIndex].buttonParamsJson = JSON.stringify(buttonParams)
return this
}
addSelection(title) {
this._buttons.push({
name: 'single_select',
buttonParamsJson: JSON.stringify({
title: title,
sections: []
})
})
this._currentSelectionIndex = this._buttons.length - 1
this._currentSectionIndex = -1
return this
}
addReply(display_text = '', id = '') {
this._buttons.push({
name: 'quick_reply',
buttonParamsJson: JSON.stringify({
display_text: display_text,
id: id
})
})
return this
}
addCopy(display_text = '', id = '') {
this._buttons.push({
name: 'cta_copy',
buttonParamsJson: JSON.stringify({
display_text: display_text,
copy_code: id
})
})
return this
}
addUrl(display_text = '', url = '') {
this._buttons.push({
name: 'cta_url',
buttonParamsJson: JSON.stringify({
display_text: display_text,
url: url,
merchant_url: url
})
})
return this
}
setVideo(path, options = {}) {
if (!path) throw new Error('URL or buffer needed')
this._data = Buffer.isBuffer(path)
? {
video: path,
...options
}
: {
video: {
url: path
},
...options
}
return this
}
setImage(path, options = {}) {
if (!path) throw new Error('URL or buffer needed')
this._data = Buffer.isBuffer(path)
? {
image: path,
...options
}
: {
image: {
url: path
},
...options
}
return this
}
setDocument(path, options = {}) {
if (!path) throw new Error('URL or buffer needed')
this._data = Buffer.isBuffer(path)
? {
document: path,
...options
}
: {
document: {
url: path
},
...options
}
return this
}
setTitle(title) {
this._title = title
return this
}
setSubtitle(subtitle) {
this._subtitle = subtitle
return this
}
async run(jid, conn, quoted = {}) {
const message = {
body: proto.Message.InteractiveMessage.Body.create({
text: this._body
}),
footer: proto.Message.InteractiveMessage.Footer.create({
text: this._footer
}),
header: proto.Message.InteractiveMessage.Header.create({
title: this._title,
subtitle: this._subtitle,
hasMediaAttachment: !!this._data,
...(this._data
? await prepareWAMessageMedia(this._data, {
upload: conn.waUploadToServer
})
: {})
})
}
const msg = await generateWAMessageFromContent(
jid,
{
viewOnceMessage: {
message: {
interactiveMessage: proto.Message.InteractiveMessage.create({
...message,
contextInfo: this._contextInfo,
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons: this._buttons,
messageParamsJson: ''
})
})
}
}
},
{
userJid: conn.user.jid,
quoted: quoted,
upload: conn.waUploadToServer,
ephemeralExpiration: WA_DEFAULT_EPHEMERAL
}
)
await conn.relayMessage(msg.key.remoteJid, msg.message, {
messageId: msg.key.id
})
return msg
}
}
const button = new Button()
return button
},
enumerable: true
},

/** Send Button Gif
     *
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} Gif
     * @param [*] button
     * @param {*} options
     * @returns
     */
sendButtonGif: {
async value(jid, text = '', footer = '', gif, but = [], buff, options = {}) {
let file = await conn.resize(buff, 300, 150)
let a = [1, 2]
let b = a[Math.floor(Math.random() * a.length)]
conn.sendMessage(jid, {
video: gif,
gifPlayback: true,
gifAttribution: b,
caption: text,
footer: footer,
jpegThumbnail: file,
templateButtons: but,
...options
})
}
},

sendHydrated: {
/**
       *
       * @param {String} jid
       * @param {String} text
       * @param {String} footer
       * @param {fs.PathLike} buffer
       * @param {String|string[]} url
       * @param {String|string[]} urlText
       * @param {String|string[]} call
       * @param {String|string[]} callText
       * @param {String[][]} buttons
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
       * @param {Object} options
       */
async value(jid, text = '', footer = '', buffer, url, urlText, call, callText, buttons, quoted, options) {
let type
if (buffer)
try {
;((type = await conn.getFile(buffer)), (buffer = type.data))
} catch {
buffer = buffer
}
if (buffer && !Buffer.isBuffer(buffer) && (typeof buffer === 'string' || Array.isArray(buffer)))
((options = quoted),
(quoted = buttons),
(buttons = callText),
(callText = call),
(call = urlText),
(urlText = url),
(url = buffer),
(buffer = null))
if (!options) options = {}
let templateButtons = []
if (url || urlText) {
if (!Array.isArray(url)) url = [url]
if (!Array.isArray(urlText)) urlText = [urlText]
templateButtons.push(
...(url
.map((v, i) => [v, urlText[i]])
.map(([url, urlText], i) => ({
index: templateButtons.length + i + 1,
urlButton: {
displayText: (!nullish(urlText) && urlText) || (!nullish(url) && url) || '',
url: (!nullish(url) && url) || (!nullish(urlText) && urlText) || ''
}
})) || [])
)
}
if (call || callText) {
if (!Array.isArray(call)) call = [call]
if (!Array.isArray(callText)) callText = [callText]
templateButtons.push(
...(call
.map((v, i) => [v, callText[i]])
.map(([call, callText], i) => ({
index: templateButtons.length + i + 1,
callButton: {
displayText: (!nullish(callText) && callText) || (!nullish(call) && call) || '',
phoneNumber: (!nullish(call) && call) || (!nullish(callText) && callText) || ''
}
})) || [])
)
}
if (buttons.length) {
if (!Array.isArray(buttons[0])) buttons = [buttons]
templateButtons.push(
...(buttons.map(([text, id], index) => ({
index: templateButtons.length + index + 1,
quickReplyButton: {
displayText: (!nullish(text) && text) || (!nullish(id) && id) || '',
id: (!nullish(id) && id) || (!nullish(text) && text) || ''
}
})) || [])
)
}
let message = {
...options,
[buffer ? 'caption' : 'text']: text || '',
footer,
templateButtons,
...(buffer
? options.asLocation && /image/.test(type.mime)
? {
location: {
...options,
jpegThumbnail: buffer
}
}
: {
[/video/.test(type.mime) ? 'video' : /image/.test(type.mime) ? 'image' : 'document']: buffer
}
: {})
}
return await conn.sendMessage(jid, message, {
quoted,
upload: conn.waUploadToServer,
...options
})
},
enumerable: true
},
sendHydrated2: {
/**
       *
       * @param {String} jid
       * @param {String} text
       * @param {String} footer
       * @param {fs.PathLike} buffer
       * @param {String|string[]} url
       * @param {String|string[]} urlText
       * @param {String|string[]} call
       * @param {String|string[]} callText
       * @param {String[][]} buttons
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
       * @param {Object} options
       */
async value(jid, text = '', footer = '', buffer, url, urlText, url2, urlText2, buttons, quoted, options) {
let type
if (buffer)
try {
;((type = await conn.getFile(buffer)), (buffer = type.data))
} catch {
buffer = buffer
}
if (buffer && !Buffer.isBuffer(buffer) && (typeof buffer === 'string' || Array.isArray(buffer)))
((options = quoted),
(quoted = buttons),
(buttons = callText),
(callText = call),
(call = urlText),
(urlText = url),
(url = buffer),
(buffer = null))
if (!options) options = {}
let templateButtons = []
if (url || urlText) {
if (!Array.isArray(url)) url = [url]
if (!Array.isArray(urlText)) urlText = [urlText]
templateButtons.push(
...(url
.map((v, i) => [v, urlText[i]])
.map(([url, urlText], i) => ({
index: templateButtons.length + i + 1,
urlButton: {
displayText: (!nullish(urlText) && urlText) || (!nullish(url) && url) || '',
url: (!nullish(url) && url) || (!nullish(urlText) && urlText) || ''
}
})) || [])
)
}
if (url2 || urlText2) {
if (!Array.isArray(url2)) url2 = [url2]
if (!Array.isArray(urlText2)) urlText2 = [urlText2]
templateButtons.push(
...(url2
.map((v, i) => [v, urlText2[i]])
.map(([url2, urlText2], i) => ({
index: templateButtons.length + i + 1,
urlButton: {
displayText: (!nullish(urlText2) && urlText2) || (!nullish(url2) && url2) || '',
url: (!nullish(url2) && url2) || (!nullish(urlText2) && urlText2) || ''
}
})) || [])
)
}
if (buttons.length) {
if (!Array.isArray(buttons[0])) buttons = [buttons]
templateButtons.push(
...(buttons.map(([text, id], index) => ({
index: templateButtons.length + index + 1,
quickReplyButton: {
displayText: (!nullish(text) && text) || (!nullish(id) && id) || '',
id: (!nullish(id) && id) || (!nullish(text) && text) || ''
}
})) || [])
)
}
let message = {
...options,
[buffer ? 'caption' : 'text']: text || '',
footer,
templateButtons,
...(buffer
? options.asLocation && /image/.test(type.mime)
? {
location: {
...options,
jpegThumbnail: buffer
}
}
: {
[/video/.test(type.mime) ? 'video' : /image/.test(type.mime) ? 'image' : 'document']: buffer
}
: {})
}
return await conn.sendMessage(jid, message, {
quoted,
upload: conn.waUploadToServer,
...options
})
},
enumerable: true
},
cMod: {
/**
       * cMod
       * @param {String} jid
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} message
       * @param {String} text
       * @param {String} sender
       * @param {*} options
       * @returns
       */
value(jid, message, text = '', sender = conn.user.jid, options = {}) {
if (options.mentions && !Array.isArray(options.mentions)) options.mentions = [options.mentions]
let copy = message.toJSON()
delete copy.message.messageContextInfo
delete copy.message.senderKeyDistributionMessage
let mtype = Object.keys(copy.message)[0]
let msg = copy.message
let content = msg[mtype]
if (typeof content === 'string') msg[mtype] = text || content
else if (content.caption) content.caption = text || content.caption
else if (content.text) content.text = text || content.text
if (typeof content !== 'string') {
msg[mtype] = {...content, ...options}
msg[mtype].contextInfo = {
...(content.contextInfo || {}),
mentionedJid: options.mentions || content.contextInfo?.mentionedJid || []
}
}
if (copy.participant) sender = copy.participant = sender || copy.participant
else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
copy.key.remoteJid = jid
copy.key.fromMe = areJidsSameUser(sender, conn.user.id) || false
return proto.WebMessageInfo.fromObject(copy)
},
enumerable: true
},
copyNForward: {
/**
       * Exact Copy Forward
       * @param {String} jid
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} message
       * @param {Boolean|Number} forwardingScore
       * @param {Object} options
       */
async value(jid, message, forwardingScore = true, options = {}) {
let vtype
if (options.readViewOnce && message.message.viewOnceMessage?.message) {
vtype = Object.keys(message.message.viewOnceMessage.message)[0]
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message = proto.Message.fromObject(JSON.parse(JSON.stringify(message.message.viewOnceMessage.message)))
message.message[vtype].contextInfo = message.message.viewOnceMessage.contextInfo
}
let mtype = Object.keys(message.message)[0]
let m = generateForwardMessageContent(message, !!forwardingScore)
let ctype = Object.keys(m)[0]
if (forwardingScore && typeof forwardingScore === 'number' && forwardingScore > 1) m[ctype].contextInfo.forwardingScore += forwardingScore
m[ctype].contextInfo = {
...(message.message[mtype].contextInfo || {}),
...(m[ctype].contextInfo || {})
}
m = generateWAMessageFromContent(jid, m, {
...options,
userJid: conn.user.jid
})
await conn.relayMessage(jid, m.message, {
messageId: m.key.id,
additionalAttributes: {...options}
})
return m
},
enumerable: true
},

fakeReply: {
/**
       * Fake Replies
       * @param {String} jid
       * @param {String|Object} text
       * @param {String} fakeJid
       * @param {String} fakeText
       * @param {String} fakeGroupJid
       * @param {String} options
       */
value(jid, text = '', fakeJid = this.user.jid, fakeText = '', fakeGroupJid, options) {
return conn.reply(jid, text, {
key: {
fromMe: areJidsSameUser(fakeJid, conn.user.id),
participant: fakeJid,
...(fakeGroupJid ? {remoteJid: fakeGroupJid} : {})
},
message: {conversation: fakeText},
...options
})
}
},
downloadM: {
/**
       * Download media message
       * @param {Object} m
       * @param {String} type
       * @param {fs.PathLike | fs.promises.FileHandle} saveToFile
       * @returns {Promise<fs.PathLike | fs.promises.FileHandle | Buffer>}
       */
async value(m, type, saveToFile) {
let filename
if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
const stream = await downloadContentFromMessage(m, type)
let buffer = Buffer.from([])
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
if (saveToFile) ({filename} = await conn.getFile(buffer, true))
return saveToFile && fs.existsSync(filename) ? filename : buffer
},
enumerable: true
},
parseMention: {
/**
       * Parses string into mentionedJid(s)
       * @param {String} text
       * @returns {Array<String>}
       */
value(text = '') {
if (!text) {
//console.error('El valor de text es inválido o falsy:', text)
return []
}

const matches = text.match(/@([0-9]{5,16}|0)/g)
if (!matches) return []

return matches.map((v) => v.slice(1) + '@s.whatsapp.net')
},
enumerable: true
},
getName: {
value(jid = '', withoutContact = false) {
jid = conn.decodeJid(jid)
withoutContact = conn.withoutContact || withoutContact
let v

// Para grupos
if (jid.endsWith('@g.us')) {
v = conn.chats[jid] || {}
if (!(v.name || v.subject)) {
return conn
.groupMetadata(jid)
.then((metadata) => metadata || store?.fetchGroupMetadata(jid, conn.groupMetadata))
.then((metadata) => metadata || {})
.then((metadata) => metadata.name || metadata.subject || PhoneNumber('+' + Number(parseInt(jid))).getNumber('international'))
}
return v.name || v.subject || PhoneNumber('+' + Number(parseInt(jid))).getNumber('international')
}

// Para newsletters (canales)
if (jid.endsWith('@newsletter')) {
v = conn.chats[jid] || {}
if (!(v.name || v.subject)) {
return conn
.newsletterMetadata('jid', jid)
.then((metadata) => metadata || {})
.then((metadata) => metadata.name || metadata.subject || PhoneNumber('+' + Number(parseInt(jid))).getNumber('international'))
}
return v.name || v.subject || PhoneNumber('+' + Number(parseInt(jid))).getNumber('international')
}

// Para usuarios
v = jid === '0@s.whatsapp.net' ? {jid: jid, vname: 'WhatsApp'} : areJidsSameUser(jid, conn.user.id) ? conn.user : conn.chats[jid] || {}

// Asegurar nombre de usuario
let userName = global.db.data.users[jid.replace('@s.whatsapp.net', '')]?.name
if (!userName) {
userName = PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

return withoutContact
? ''
: v.name
? v.name
: v.subject
? v.subject
: v.vname
? v.vname
: v.notify
? v.notify
: v.verifiedName
? v.verifiedName
: userName
},
enumerable: true
},
loadMessage: {
/**
       *
       * @param {String} messageID
       * @returns {import('@adiwajshing/baileys').proto.WebMessageInfo}
       */
value(messageID) {
return Object.entries(conn.chats)
.filter(([_, {messages}]) => typeof messages === 'object')
.find(([_, {messages}]) => Object.entries(messages).find(([k, v]) => k === messageID || v.key?.id === messageID))?.[1].messages?.[messageID]
},
enumerable: true
},
sendGroupV4Invite: {
/**
       * sendGroupV4Invite
       * @param {String} jid
       * @param {*} participant
       * @param {String} inviteCode
       * @param {Number} inviteExpiration
       * @param {String} groupName
       * @param {String} caption
       * @param {Buffer} jpegThumbnail
       * @param {*} options
       */
async value(
jid,
participant,
inviteCode,
inviteExpiration,
groupName = 'unknown subject',
caption = 'Invitation to join my WhatsApp group',
jpegThumbnail,
options = {}
) {
const msg = proto.Message.fromObject({
groupInviteMessage: proto.GroupInviteMessage.fromObject({
inviteCode,
inviteExpiration: parseInt(inviteExpiration) || +new Date(new Date() + 3 * 86400000),
groupJid: jid,
groupName: (groupName ? groupName : await conn.getName(jid)) || null,
jpegThumbnail: Buffer.isBuffer(jpegThumbnail) ? jpegThumbnail : null,
caption
})
})
const message = generateWAMessageFromContent(participant, msg, options)
await conn.relayMessage(participant, message.message, {
messageId: message.key.id,
additionalAttributes: {...options}
})
return message
},
enumerable: true
},
processMessageStubType: {
/**
       * to process MessageStubType
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} m
       */
async value(m) {
if (!m.messageStubType) return
const chat = conn.decodeJid(m.key.remoteJid || m.message?.senderKeyDistributionMessage?.groupId || '')
if (!chat || chat === 'status@broadcast') return

const emitGroupUpdate = (update) => {
conn.ev.emit('groups.update', [{id: chat, ...update}])
}

switch (m.messageStubType) {
case WAMessageStubType.REVOKE:
case WAMessageStubType.GROUP_CHANGE_INVITE_LINK:
if (Array.isArray(m.messageStubParameters) && m.messageStubParameters.length > 0) {
emitGroupUpdate({revoke: m.messageStubParameters[0]})
}
break
case WAMessageStubType.GROUP_CHANGE_ICON:
if (Array.isArray(m.messageStubParameters) && m.messageStubParameters.length > 0) {
emitGroupUpdate({icon: m.messageStubParameters[0]})
}
break
default: {
console.log({
messageStubType: m.messageStubType,
messageStubParameters: m.messageStubParameters || [],
type: WAMessageStubType[m.messageStubType]
})
break
}
}

const isGroup = chat.endsWith('@g.us')
if (!isGroup) return

let chats = conn.chats[chat]
if (!chats) chats = conn.chats[chat] = {id: chat}
chats.isChats = true

const metadata = await conn.groupMetadata(chat).catch(() => null)
if (!metadata) return

chats.subject = metadata.subject
chats.metadata = metadata
}
},
insertAllGroup: {
async value() {
const groups = (await conn.groupFetchAllParticipating().catch((_) => null)) || {}
for (const group in groups)
conn.chats[group] = {
...(conn.chats[group] || {}),
id: group,
subject: groups[group].subject,
isChats: true,
metadata: groups[group]
}
return conn.chats
}
},
pushMessage: {
/**
       * pushMessage
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo[]} m
       */
async value(m) {
if (!m) return
if (!Array.isArray(m)) m = [m]
for (const message of m) {
try {
// if (!(message instanceof proto.WebMessageInfo)) continue // https://github.com/adiwajshing/Baileys/pull/696/commits/6a2cb5a4139d8eb0a75c4c4ea7ed52adc0aec20f
if (!message) continue
if (message.messageStubType && message.messageStubType != WAMessageStubType.CIPHERTEXT)
conn.processMessageStubType(message).catch(console.error)
const _mtype = Object.keys(message.message || {})
const mtype =
(!['senderKeyDistributionMessage', 'messageContextInfo'].includes(_mtype[0]) && _mtype[0]) ||
(_mtype.length >= 3 && _mtype[1] !== 'messageContextInfo' && _mtype[1]) ||
_mtype[_mtype.length - 1]
const chat = conn.decodeJid(message.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || '')
if (message.message?.[mtype]?.contextInfo?.quotedMessage) {
/**
               * @type {import('@adiwajshing/baileys').proto.IContextInfo}
               */
let context = message.message[mtype].contextInfo
let participant = conn.decodeJid(context.participant)
const remoteJid = conn.decodeJid(context.remoteJid || participant)
/**
               * @type {import('@adiwajshing/baileys').proto.IMessage}
               *
               */
let quoted = message.message[mtype].contextInfo.quotedMessage
if (remoteJid && remoteJid !== 'status@broadcast' && quoted) {
let qMtype = Object.keys(quoted)[0]
if (qMtype == 'conversation') {
quoted.extendedTextMessage = {text: quoted[qMtype]}
delete quoted.conversation
qMtype = 'extendedTextMessage'
}
if (!quoted[qMtype].contextInfo) quoted[qMtype].contextInfo = {}
quoted[qMtype].contextInfo.mentionedJid = context.mentionedJid || quoted[qMtype].contextInfo.mentionedJid || []
const isGroup = remoteJid.endsWith('g.us')
if (isGroup && !participant) participant = remoteJid
const qM = {
key: {
remoteJid,
fromMe: areJidsSameUser(conn.user.jid, remoteJid),
id: context.stanzaId,
participant
},
message: JSON.parse(JSON.stringify(quoted)),
...(isGroup ? {participant} : {})
}
let qChats = conn.chats[participant]
if (!qChats)
qChats = conn.chats[participant] = {
id: participant,
isChats: !isGroup
}
if (!qChats.messages) qChats.messages = {}
if (!qChats.messages[context.stanzaId] && !qM.key.fromMe) qChats.messages[context.stanzaId] = qM
let qChatsMessages
if ((qChatsMessages = Object.entries(qChats.messages)).length > 40)
qChats.messages = Object.fromEntries(qChatsMessages.slice(30, qChatsMessages.length)) // maybe avoid memory leak
}
}
if (!chat || chat === 'status@broadcast') continue
const isGroup = chat.endsWith('@g.us')
let chats = conn.chats[chat]
if (!chats) {
if (isGroup) await conn.insertAllGroup().catch(console.error)
chats = conn.chats[chat] = {
id: chat,
isChats: true,
...(conn.chats[chat] || {})
}
}
let metadata, sender
if (isGroup) {
if (!chats.subject || !chats.metadata) {
metadata = (await conn.groupMetadata(chat).catch((_) => ({}))) || {}
if (!chats.subject) chats.subject = metadata.subject || ''
if (!chats.metadata) chats.metadata = metadata
}
sender = conn.decodeJid((message.key?.fromMe && conn.user.id) || message.participant || message.key?.participant || chat || '')
if (sender !== chat) {
let chats = conn.chats[sender]
if (!chats) chats = conn.chats[sender] = {id: sender}
if (!chats.name) chats.name = message.pushName || chats.name || ''
}
} else if (!chats.name) chats.name = message.pushName || chats.name || ''
if (['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype)) continue
chats.isChats = true
if (!chats.messages) chats.messages = {}
const fromMe = message.key.fromMe || areJidsSameUser(sender || chat, conn.user.id)
if (!['protocolMessage'].includes(mtype) && !fromMe && message.messageStubType != WAMessageStubType.CIPHERTEXT && message.message) {
delete message.message.messageContextInfo
delete message.message.senderKeyDistributionMessage
chats.messages[message.key.id] = JSON.parse(JSON.stringify(message, null, 2))
let chatsMessages
if ((chatsMessages = Object.entries(chats.messages)).length > 40)
chats.messages = Object.fromEntries(chatsMessages.slice(30, chatsMessages.length))
}
} catch (e) {
console.error(e)
}
}
}
},
serializeM: {
/**
       * Serialize Message, so it easier to manipulate
       * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} m
       */
value(m) {
return smsg(conn, m)
}
},
...(typeof conn.chatRead !== 'function'
? {
chatRead: {
/**
             * Read message
             * @param {String} jid
             * @param {String|undefined|null} participant
             * @param {String} messageID
             */
value(jid, participant = conn.user.jid, messageID) {
return conn.sendReadReceipt(jid, participant, [messageID])
},
enumerable: true
}
}
: {}),
...(typeof conn.setStatus !== 'function'
? {
setStatus: {
/**
             * setStatus bot
             * @param {String} status
             */
value(status) {
return conn.query({
tag: 'iq',
attrs: {
to: S_WHATSAPP_NET,
type: 'set',
xmlns: 'status'
},
content: [
{
tag: 'status',
attrs: {},
content: Buffer.from(status, 'utf-8')
}
]
})
},
enumerable: true
}
}
: {})
})
if (sock.user?.id) sock.user.jid = sock.decodeJid(sock.user.id)
store.bind(sock)
return sock
}

/**
 * Serialize Message
 * @param {ReturnType<typeof makeWASocket>} conn
 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} m
 * @param {Boolean} hasParent
 */
export function smsg(conn, m, hasParent) {
if (!m) return m
/**
   * @type {import('@adiwajshing/baileys').proto.WebMessageInfo}
   */
let M = proto.WebMessageInfo
m = M.fromObject(m)
m.conn = conn
let protocolMessageKey
if (m.message) {
if (m.mtype == 'protocolMessage' && m.msg.key) {
protocolMessageKey = m.msg.key
if (protocolMessageKey == 'status@broadcast') protocolMessageKey.remoteJid = m.chat
if (!protocolMessageKey.participant || protocolMessageKey.participant == 'status_me') protocolMessageKey.participant = m.sender
protocolMessageKey.fromMe = conn.decodeJid(protocolMessageKey.participant) === conn.decodeJid(conn.user.id)
if (!protocolMessageKey.fromMe && protocolMessageKey.remoteJid === conn.decodeJid(conn.user.id)) protocolMessageKey.remoteJid = m.sender
}
if (m.quoted) if (!m.quoted.mediaMessage) delete m.quoted.download
}
if (!m.mediaMessage) delete m.download

if (m.msg?.contextInfo?.mentionedJid?.length) {
const mentioned = m.msg.contextInfo.mentionedJid
if (!mentioned.length) return []

const group = conn?.chats?.[m.chat]
if (!group?.participants) return mentioned

const normalizedMentionedJid = mentioned.map((id) => {
const found = group.participants.find((p) => p.id === id)
return conn.decodeJid(found?.phoneNumber || id)
})

// Aquí haces la redefinición solo si aún no existe:
if (!Object.getOwnPropertyDescriptor(m, 'mentionedJid')) {
Object.defineProperty(m, 'mentionedJid', {
configurable: true,
enumerable: true,
get() {
return normalizedMentionedJid
}
})
}
}

try {
if (protocolMessageKey && m.mtype == 'protocolMessage') conn.ev.emit('message.delete', protocolMessageKey)
} catch (e) {
console.error(e)
}
return m
}

// https://github.com/Nurutomo/wabot-aq/issues/490
export function serialize() {
const MediaType = ['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage']
return Object.defineProperties(proto.WebMessageInfo.prototype, {
conn: {
value: undefined,
enumerable: false,
writable: true
},
id: {
get() {
return this.key?.id
}
},
isBaileys: {
get() {
return (
(this.key.fromMe && this.id.startsWith('3EB0') && this.id.length === 12) ||
(this.key.fromMe && this.id.startsWith('3EB0') && (this.id.length === 20 || this.id.length === 22)) ||
false
)
// return this.id?.length === 16 || this.id?.startsWith('3EB0') && this.id?.length === 12 || false
}
},
chat: {
get() {
const senderKeyDistributionMessage = this.message?.senderKeyDistributionMessage?.groupId
return (this.key?.remoteJid || (senderKeyDistributionMessage && senderKeyDistributionMessage !== 'status@broadcast') || '').decodeJid()
}
},
isGroup: {
get() {
return this.chat.endsWith('@g.us')
},
enumerable: true
},
sender: {
get() {
return this.conn?.decodeJid((this.key?.fromMe && this.conn?.user.id) || this.participant || this.key.participant || this.chat || '')
},
enumerable: true
},
fromMe: {
get() {
return this.key?.fromMe || areJidsSameUser(this.conn?.user.id, this.sender) || false
}
},
mtype: {
get() {
if (!this.message) return ''
const type = Object.keys(this.message)
return (
(!['senderKeyDistributionMessage', 'messageContextInfo'].includes(type[0]) && type[0]) || // Sometimes message in the front
(type.length >= 3 && type[1] !== 'messageContextInfo' && type[1]) || // Sometimes message in midle if mtype length is greater than or equal to 3
type[type.length - 1]
) // common case
},
enumerable: true
},
msg: {
get() {
if (!this.message) return null
return this.message[this.mtype]
}
},
mediaMessage: {
get() {
if (!this.message) return null
const Message = (this.msg?.url || this.msg?.directPath ? {...this.message} : extractMessageContent(this.message)) || null
if (!Message) return null
const mtype = Object.keys(Message)[0]
return MediaType.includes(mtype) ? Message : null
},
enumerable: true
},
mediaType: {
get() {
let message
if (!(message = this.mediaMessage)) return null
return Object.keys(message)[0]
},
enumerable: true
},
quoted: {
get() {
/**
         * @type {ReturnType<typeof makeWASocket>}
         */
const self = this
const msg = self.msg
const contextInfo = msg?.contextInfo
const quoted = contextInfo?.quotedMessage
if (!msg || !contextInfo || !quoted) return null
const type = Object.keys(quoted)[0]
let q = quoted[type]
const text = typeof q === 'string' ? q : q.text
return Object.defineProperties(JSON.parse(JSON.stringify(typeof q === 'string' ? {text: q} : q)), {
mtype: {
get() {
return type
},
enumerable: true
},
mediaMessage: {
get() {
const Message = (q.url || q.directPath ? {...quoted} : extractMessageContent(quoted)) || null
if (!Message) return null
const mtype = Object.keys(Message)[0]
return MediaType.includes(mtype) ? Message : null
},
enumerable: true
},
mediaType: {
get() {
let message
if (!(message = this.mediaMessage)) return null
return Object.keys(message)[0]
},
enumerable: true
},
id: {
get() {
return contextInfo.stanzaId
},
enumerable: true
},
chat: {
get() {
return contextInfo.remoteJid || self.chat
},
enumerable: true
},
isBaileys: {
get() {
return this.id?.length === 16 || (this.id?.startsWith('3EB0') && this.id.length === 12) || false
},
enumerable: true
},
sender: {
get() {
return (contextInfo.participant || this.chat || '').decodeJid()
},
enumerable: true
},
fromMe: {
get() {
return areJidsSameUser(this.sender, self.conn?.user.jid)
},
enumerable: true
},
text: {
get() {
return text || this.caption || this.contentText || this.selectedDisplayText || ''
},
enumerable: true
},
mentionedJid: {
get() {
return q.contextInfo?.mentionedJid || self.getQuotedObj()?.mentionedJid || []
},
enumerable: true
},
name: {
get() {
const sender = this.sender
return sender ? self.conn?.getName(sender) : null
},
enumerable: true
},
vM: {
get() {
return proto.WebMessageInfo.fromObject({
key: {
fromMe: this.fromMe,
remoteJid: this.chat,
id: this.id
},
message: quoted,
...(self.isGroup ? {participant: this.sender} : {})
})
}
},
fakeObj: {
get() {
return this.vM
}
},
download: {
value(saveToFile = false) {
const mtype = this.mediaType
return self.conn?.downloadM(this.mediaMessage[mtype], mtype.replace(/message/i, ''), saveToFile)
},
enumerable: true,
configurable: true
},
reply: {
/**
             * Reply to quoted message
             * @param {String|Object} text
             * @param {String|false} chatId
             * @param {Object} options
             */
value(text, chatId, options) {
return self.conn?.reply(chatId ? chatId : this.chat, text, this.vM, options)
},
enumerable: true
},
copy: {
/**
             * Copy quoted message
             */
value() {
const M = proto.WebMessageInfo
return smsg(conn, M.fromObject(M.toObject(this.vM)))
},
enumerable: true
},
forward: {
/**
             * Forward quoted message
             * @param {String} jid
             *  @param {Boolean} forceForward
             */
value(jid, force = false, options) {
return self.conn?.sendMessage(
jid,
{
forward: this.vM,
force,
...options
},
{...options}
)
},
enumerable: true
},
copyNForward: {
/**
             * Exact Forward quoted message
             * @param {String} jid
             * @param {Boolean|Number} forceForward
             * @param {Object} options
             */
value(jid, forceForward = false, options) {
return self.conn?.copyNForward(jid, this.vM, forceForward, options)
},
enumerable: true
},
cMod: {
/**
             * Modify quoted Message
             * @param {String} jid
             * @param {String} text
             * @param {String} sender
             * @param {Object} options
             */
value(jid, text = '', sender = this.sender, options = {}) {
return self.conn?.cMod(jid, this.vM, text, sender, options)
},
enumerable: true
},
delete: {
/**
             * Delete quoted message
             */
value() {
return self.conn?.sendMessage(this.chat, {
delete: this.vM.key
})
},
enumerable: true
},
react: {
value(text) {
return self.conn?.sendMessage(this.chat, {
react: {
text,
key: this.vM.key
}
})
},
enumerable: true
}
})
},
enumerable: true
},
_text: {
value: null,
writable: true
},
text: {
get() {
const msg = this.msg
const text = (typeof msg === 'string' ? msg : msg?.text) || msg?.caption || msg?.contentText || ''
return typeof this._text === 'string'
? this._text
: '' || (typeof text === 'string' ? text : text?.selectedDisplayText || text?.hydratedTemplate?.hydratedContentText || text) || ''
},
set(str) {
return (this._text = str)
},
enumerable: true
},
mentionedJid: {
get() {
return (this.msg?.contextInfo?.mentionedJid?.length && this.msg.contextInfo.mentionedJid) || []
},
enumerable: true
},
name: {
get() {
return (!nullish(this.pushName) && this.pushName) || this.conn?.getName(this.sender)
},
enumerable: true
},
download: {
value(saveToFile = false) {
const mtype = this.mediaType
return this.conn?.downloadM(this.mediaMessage[mtype], mtype.replace(/message/i, ''), saveToFile)
},
enumerable: true,
configurable: true
},
reply: {
value(text, chatId, options) {
return this.conn?.reply(chatId ? chatId : this.chat, text, this, options)
}
},
copy: {
value() {
const M = proto.WebMessageInfo
return smsg(this.conn, M.fromObject(M.toObject(this)))
},
enumerable: true
},
forward: {
value(jid, force = false, options = {}) {
return this.conn?.sendMessage(
jid,
{
forward: this,
force,
...options
},
{...options}
)
},
enumerable: true
},
copyNForward: {
value(jid, forceForward = false, options = {}) {
return this.conn?.copyNForward(jid, this, forceForward, options)
},
enumerable: true
},
cMod: {
value(jid, text = '', sender = this.sender, options = {}) {
return this.conn?.cMod(jid, this, text, sender, options)
},
enumerable: true
},
getQuotedObj: {
value() {
if (!this.quoted.id) return null
const q = proto.WebMessageInfo.fromObject(this.conn?.loadMessage(this.quoted.id) || this.quoted.vM)
return smsg(this.conn, q)
},
enumerable: true
},
getQuotedMessage: {
get() {
return this.getQuotedObj
}
},
delete: {
value() {
return this.conn?.sendMessage(this.chat, {delete: this.key})
},
enumerable: true
},
react: {
value(text) {
return this.conn?.sendMessage(this.chat, {
react: {
text,
key: this.key
}
})
},
enumerable: true
}
})
}

export function logic(check, inp, out) {
if (inp.length !== out.length) throw new Error('Input and Output must have same length')
for (let i in inp) if (util.isDeepStrictEqual(check, inp[i])) return out[i]
return null
}

export function protoType() {
Buffer.prototype.toArrayBuffer = function toArrayBufferV2() {
const ab = new ArrayBuffer(this.length)
const view = new Uint8Array(ab)
for (let i = 0; i < this.length; ++i) {
view[i] = this[i]
}
return ab
}
/**
   * @returns {ArrayBuffer}
   */
Buffer.prototype.toArrayBufferV2 = function toArrayBuffer() {
return this.buffer.slice(this.byteOffset, this.byteOffset + this.byteLength)
}
/**
   * @returns {Buffer}
   */
ArrayBuffer.prototype.toBuffer = function toBuffer() {
return Buffer.from(new Uint8Array(this))
}
// /**
  //  * @returns {String}
  //  */
// Buffer.prototype.toUtilFormat = ArrayBuffer.prototype.toUtilFormat = Object.prototype.toUtilFormat = Array.prototype.toUtilFormat = function toUtilFormat() {
//     return util.format(this)
// }
Uint8Array.prototype.getFileType =
ArrayBuffer.prototype.getFileType =
Buffer.prototype.getFileType =
async function getFileType() {
return await fileTypeFromBuffer(this)
}
/**
   * @returns {Boolean}
   */
String.prototype.isNumber = Number.prototype.isNumber = isNumber
/**
   *
   * @returns {String}
   */
String.prototype.capitalize = function capitalize() {
return this.charAt(0).toUpperCase() + this.slice(1, this.length)
}
/**
   * @returns {String}
   */
String.prototype.capitalizeV2 = function capitalizeV2() {
const str = this.split(' ')
return str.map((v) => v.capitalize()).join(' ')
}
String.prototype.decodeJid = function decodeJid() {
if (/:\d+@/gi.test(this)) {
const decode = jidDecode(this) || {}
return ((decode.user && decode.server && decode.user + '@' + decode.server) || this).trim()
} else return this.trim()
}
/**
   * number must be milliseconds
   * @returns {string}
   */
Number.prototype.toTimeString = function toTimeString() {
// const milliseconds = this % 1000
const seconds = Math.floor((this / 1000) % 60)
const minutes = Math.floor((this / (60 * 1000)) % 60)
const hours = Math.floor((this / (60 * 60 * 1000)) % 24)
const days = Math.floor(this / (24 * 60 * 60 * 1000))
return (
(days ? `${days} day(s) ` : '') +
(hours ? `${hours} hour(s) ` : '') +
(minutes ? `${minutes} minute(s) ` : '') +
(seconds ? `${seconds} second(s)` : '')
).trim()
}
Number.prototype.getRandom = String.prototype.getRandom = Array.prototype.getRandom = getRandom
}

function isNumber() {
const int = parseInt(this)
return typeof int === 'number' && !isNaN(int)
}

function getRandom() {
if (Array.isArray(this) || this instanceof String) return this[Math.floor(Math.random() * this.length)]
return Math.floor(Math.random() * this)
}

/**
 * ??
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
 * @returns {boolean}
 */
function nullish(args) {
return !(args !== null && args !== undefined)
}
