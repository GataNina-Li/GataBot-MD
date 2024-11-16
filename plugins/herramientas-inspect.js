// Código adaptado por https://github.com/GataNina-Li
// Código compatible con canales y comunidades de WhatsApp 

import { getUrlFromDirectPath } from "@whiskeysockets/baileys";
import _ from "lodash";
import axios from 'axios';

let handler = async (m, { conn, command, usedPrefix, args, text, groupMetadata, isOwner, isROwner }) => {
 const channelUrl = text?.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:channel\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1];
let txtBotAdminCh = '\n\n> *Verifique que el Bot sea admin en el canal, de lo contrario no funcionará el comando*';
let thumb = gataMenu.getRandom();
let pp, ch, q, mime, buffer, media, inviteUrlch, imageBuffer;

let inviteCode
if (!text) return await m.reply(`*⚠️ Ingrese un enlace de un grupo/comunidad/canal de WhatsApp para obtener información.*`)
const MetadataGroupInfo = async (res, isInviteInfo = false) => {
let nameCommunity = "no pertenece a ninguna Comunidad"
let groupPicture = "No se pudo obtener"

if (res.linkedParent) {
let linkedGroupMeta = await conn.groupMetadata(res.linkedParent).catch(e => { return null })
nameCommunity = linkedGroupMeta ? "\n" + ("`Nombre:` " + linkedGroupMeta.subject || "") : nameCommunity
}
pp = await conn.profilePictureUrl(res.id, 'image').catch(e => { return null })
inviteCode = await conn.groupInviteCode(m.chat).catch(e => { return null })
const formatParticipants = (participants) =>
participants && participants.length > 0
? participants.map((user, i) => `${i + 1}. @${user.id?.split("@")[0]}${user.admin === "superadmin" ? " (superadmin)" : user.admin === "admin" ? " (admin)" : ""}`).join("\n")
: "No encontrado"
let caption = `🆔 *Identificador del grupo:*\n${res.id || "No encontrado"}\n\n` +
`👑 *Creado por:*\n${res.owner ? `@${res.owner?.split("@")[0]}` : "No encontrado"} ${res.creation ? `el ${formatDate(res.creation)}` : "(Fecha no encontrada)"}\n\n` +
`🏷️ *Nombre:*\n${res.subject || "No encontrado"}\n\n` +
`✏️ *Nombre cambiado por:*\n${res.subjectOwner ? `@${res.subjectOwner?.split("@")[0]}` : "No encontrado"} ${res.subjectTime ? `el ${formatDate(res.subjectTime)}` : "(Fecha no encontrada)"}\n\n` +
`📄 *Descripción:*\n${res.desc || "No encontrado"}\n\n` +
`📝 *Descripción cambiado por:*\n${res.descOwner ? `@${res.descOwner?.split("@")[0]}` : "No encontrado"}\n\n` +
`🗃️ *Id de la descripción:*\n${res.descId || "No encontrado"}\n\n` +
`🖼️ *Imagen del grupo:*\n${pp ? pp : groupPicture}\n\n` +
`💫 *Autor:*\n${res.author || "No encontrado"}\n\n` +
`🎫 *Código de invitación:*\n${res.inviteCode || inviteCode || "No disponible"}\n\n` +
`⌛ *Duración:*\n${res.ephemeralDuration !== undefined ? `${res.ephemeralDuration} segundos` : "Desconocido"}\n\n` +
`🛃 *Admins:*\n` + (res.participants && res.participants.length > 0 ? res.participants.filter(user => user.admin === "admin" || user.admin === "superadmin").map((user, i) => `${i + 1}. @${user.id?.split("@")[0]}${user.admin === "superadmin" ? " (superadmin)" : " (admin)"}`).join("\n") : "No encontrado") + `\n\n` +
`🔰 *Usuarios en total:*\n${res.size || "Cantidad no encontrada"}\n\n` +
`✨ *Información avanzada* ✨\n\n🔎 *Comunidad vinculada al grupo:*\n${res.isCommunity ? "Este grupo es un chat de avisos" : `${res.linkedParent ? "`Id:` " + res.linkedParent : "Este grupo"} ${nameCommunity}`}\n\n` +
`⚠️ *Restricciones:* ${res.restrict ? "✅" : "❌"}\n` +
`📢 *Anuncios:* ${res.announce ? "✅" : "❌"}\n` +
`🏘️ *¿Es comunidad?:* ${res.isCommunity ? "✅" : "❌"}\n` +
`📯 *¿Es anuncio de comunidad?:* ${res.isCommunityAnnounce ? "✅" : "❌"}\n` +
`🤝 *Tiene aprobación de miembros:* ${res.joinApprovalMode ? "✅" : "❌"}\n` +
`🆕 *Puede Agregar futuros miembros:* ${res.memberAddMode ? "✅" : "❌"}\n\n` 
return caption.trim()
}
        
const inviteGroupInfo = async (groupData) => {
const { id, subject, subjectOwner, subjectTime, size, creation, owner, desc, descId, linkedParent, restrict, announce, isCommunity, isCommunityAnnounce, joinApprovalMode, memberAddMode, ephemeralDuration } = groupData
let nameCommunity = "no pertenece a ninguna Comunidad"
let groupPicture = "No se pudo obtener"
if (linkedParent) {
let linkedGroupMeta = await conn.groupMetadata(linkedParent).catch(e => { return null })
nameCommunity = linkedGroupMeta ? "\n" + ("`Nombre:` " + linkedGroupMeta.subject || "") : nameCommunity
}
pp = await conn.profilePictureUrl(id, 'image').catch(e => { return null })
const formatParticipants = (participants) =>
participants && participants.length > 0
? participants.map((user, i) => `${i + 1}. @${user.id?.split("@")[0]}${user.admin === "superadmin" ? " (superadmin)" : user.admin === "admin" ? " (admin)" : ""}`).join("\n")
: "No encontrado"

let caption = `🆔 *Identificador del grupo:*\n${id || "No encontrado"}\n\n` +
`👑 *Creado por:*\n${owner ? `@${owner?.split("@")[0]}` : "No encontrado"} ${creation ? `el ${formatDate(creation)}` : "(Fecha no encontrada)"}\n\n` +
`🏷️ *Nombre:*\n${subject || "No encontrado"}\n\n` +
`✏️ *Nombre cambiado por:*\n${subjectOwner ? `@${subjectOwner?.split("@")[0]}` : "No encontrado"} ${subjectTime ? `el ${formatDate(subjectTime)}` : "(Fecha no encontrada)"}\n\n` +
`📄 *Descripción:*\n${desc || "No encontrada"}\n\n` +
`💠 *ID de la descripción:*\n${descId || "No encontrado"}\n\n` +
`🖼️ *Imagen del grupo:*\n${pp ? pp : groupPicture}\n\n` +
`🏆 *Miembros destacados:*\n${formatParticipants(groupData.participants)}\n\n` +
`👥 *Destacados total:*\n${size || "Cantidad no encontrada"}\n\n` +
`✨ *Información avanzada* ✨\n\n🔎 *Comunidad vinculada al grupo:*\n${isCommunity ? "Este grupo es un chat de avisos" : `${linkedParent ? "`Id:` " + linkedParent : "Este grupo"} ${nameCommunity}`}\n\n` +
`📢 *Anuncios:* ${announce ? "✅ Si" : "❌ No"}\n` +
`🏘️ *¿Es comunidad?:* ${isCommunity ? "✅ Si" : "❌ No"}\n` +
`📯 *¿Es anuncio de comunidad?:* ${isCommunityAnnounce ? "✅" : "❌"}\n` +
`🤝 *Tiene aprobación de miembros:* ${joinApprovalMode ? "✅" : "❌"}\n`
return caption.trim()
}

let info
try {
let res = text ? null : await conn.groupMetadata(m.chat)
info = await MetadataGroupInfo(res) // Si el bot esta en el grupo
console.log('Método de metadatos')
} catch {
const inviteUrl = text?.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:invite\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1]
//if (!inviteUrl &&) return await conn.reply(m.chat, "*Verifique que sea un enlace de grupo o comunidad de WhatsApp.*", m)
let inviteInfo
if (inviteUrl) {
try {
inviteInfo = await conn.groupGetInviteInfo(inviteUrl)
info = await inviteGroupInfo(inviteInfo) // Para cualquier enlace de grupo/comunidad
console.log(info)
console.log('Método de enlace')    
} catch (e) {
m.reply('Grupo no encontrado')
return
}}}
if (info) {
await conn.sendMessage(m.chat, { text: info, contextInfo: {
mentionedJid: conn.parseMention(info),
externalAdReply: {
title: "🔰 Inspector de Grupos",
body: packname,
thumbnailUrl: pp ? pp : thumb,
sourceUrl: args[0] ? args[0] : inviteCode ? `https://chat.whatsapp.com/${inviteCode}` : md,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: fkontak })
} else {
// Manejo de enlaces de canales
let newsletterInfo
if (!channelUrl) return await conn.reply(m.chat, "*Verifique que sea un enlace de canal de WhatsApp.*", m)
if (channelUrl) {
try {
newsletterInfo = await conn.newsletterMetadata("invite", channelUrl).catch(e => { return null })
if (!newsletterInfo) return await conn.reply(m.chat, "*No se encontró información del canal.* Verifique que el enlace sea correcto.", m)       
let caption = "*Inspector de enlaces de Canales*\n\n" + processObject(newsletterInfo, "", newsletterInfo?.preview)
if (newsletterInfo?.preview) {
pp = getUrlFromDirectPath(newsletterInfo.preview)
} else {
pp = thumb
}
if (channelUrl && newsletterInfo) {
await conn.sendMessage(m.chat, { text: caption, contextInfo: {
mentionedJid: conn.parseMention(caption),
externalAdReply: {
title: "📢 Inspector de Canales",
body: packname,
thumbnailUrl: pp,
sourceUrl: args[0],
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: fkontak })}
newsletterInfo.id ? conn.sendMessage(m.chat, { text: newsletterInfo.id }, { quoted: null }) : ''
} catch (e) {
reportError(e)
}}}}
handler.help = ["superinspect", "inspect"]
handler.tags = ['tools'];
handler.command = /^(superinspect|inspect|revisar|inspeccionar)$/i;
handler.register = true;

export default handler;

function formatDate(n, locale = "es", includeTime = true) {
if (n > 1e12) {
n = Math.floor(n / 1000)  // Convertir de milisegundos a segundos
} else if (n < 1e10) {
n = Math.floor(n * 1000)  // Convertir de segundos a milisegundos
}
const date = new Date(n)
if (isNaN(date)) return "Fecha no válida"
// Formato de fecha: día/mes/año
const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' }
const formattedDate = date.toLocaleDateString(locale, optionsDate)
if (!includeTime) return formattedDate
// horas, minutos y segundos
const hours = String(date.getHours()).padStart(2, '0')
const minutes = String(date.getMinutes()).padStart(2, '0')
const seconds = String(date.getSeconds()).padStart(2, '0')
const period = hours < 12 ? 'AM' : 'PM'
const formattedTime = `${hours}:${minutes}:${seconds} ${period}`
return `${formattedDate}, ${formattedTime}`
}

function formatValue(key, value, preview) {
switch (key) {
case "subscribers":
return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "No hay suscriptores"
case "creation_time":
case "nameTime":
case "descriptionTime":
return formatDate(value)
case "description": 
case "name":
return value || "No hay información disponible"
case "state":
switch (value) {
case "ACTIVE": return "Activo"
case "GEOSUSPENDED": return "Suspendido por región"
case "SUSPENDED": return "Suspendido"
default: return "Desconocido"
}
case "reaction_codes":
switch (value) {
case "ALL": return "Todas las reacciones permitidas"
case "BASIC": return "Reacciones básicas permitidas"
case "NONE": return "No se permiten reacciones"
default: return "Desconocido"
}
case "verification":
switch (value) {
case "VERIFIED": return "Verificado"
case "UNVERIFIED": return "No verificado"
default: return "Desconocido"
}
case "mute":
switch (value) {
case "ON": return "Silenciado"
case "OFF": return "No silenciado"
case "UNDEFINED": return "Sin definir"
default: return "Desconocido"
}
case "view_role":
switch (value) {
case "ADMIN": return "Administrador"
case "OWNER": return "Propietario"
case "SUBSCRIBER": return "Suscriptor"
case "GUEST": return "Invitado"
default: return "Desconocido"
}
case "picture":
if (preview) {
return getUrlFromDirectPath(preview)
} else {
return "No hay imagen disponible"
}
default:
return value !== null && value !== undefined ? value.toString() : "No hay información disponible"
}}

function newsletterKey(key) {
return _.startCase(key.replace(/_/g, " "))
.replace("Id", "🆔 Identificador")
.replace("State", "📌 Estado")
.replace("Creation Time", "📅 Fecha de creación")
.replace("Name Time", "✏️ Fecha de modificación del nombre")
.replace("Name", "🏷️ Nombre")
.replace("Description Time", "📝 Fecha de modificación de la descripción")
.replace("Description", "📜 Descripción")
.replace("Invite", "📩 Invitación")
.replace("Handle", "👤 Alias")
.replace("Picture", "🖼️ Imagen")
.replace("Preview", "👀 Vista previa")
.replace("Reaction Codes", "😃 Reacciones")
.replace("Subscribers", "👥 Suscriptores")
.replace("Verification", "✅ Verificación")
.replace("Viewer Metadata", "🔍 Datos avanzados")
}

function processObject(obj, prefix = "", preview) {
let caption = ""
Object.keys(obj).forEach(key => {
const value = obj[key]
if (typeof value === "object" && value !== null) {
if (Object.keys(value).length > 0) {
const sectionName = newsletterKey(prefix + key)
caption += `\n*\`${sectionName}\`*\n`
caption += processObject(value, `${prefix}${key}_`)
}} else {
const shortKey = prefix ? prefix.split("_").pop() + "_" + key : key
const displayValue = formatValue(shortKey, value, preview)
const translatedKey = newsletterKey(shortKey)
caption += `- *${translatedKey}:*\n${displayValue}\n\n`
}})
return caption.trim()
}

/*//import * as baileys from '@adiwajshing/baileys'
let baileys = (await import(global.baileys)).default

let handler = async (m, { conn, text }) => {
	let [, code] = text.match(/chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i) || []
	if (!code) throw `${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝙇𝙄𝙉𝙆 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊`
	let res = await conn.query({ tag: 'iq', attrs: { type: 'get', xmlns: 'w:g2', to: '@g.us' }, content: [{ tag: 'invite', attrs: { code } }] }),
		data = extractGroupMetadata(res),
		txt = Object.keys(data).map(v => `*${v.capitalize()}:* ${data[v]}`).join('\n'),
		pp = await conn.profilePictureUrl(data.id, 'image').catch(console.error)
let groupinfo = `*┏━━━━━━━━━━━━━━━┓*
*┃☂️ ⫹⫺ ID:* ${data.id}◞
*┃🧪 ⫹⫺ Nombre:* ${data.subject}
*┃📅 ⫹⫺ Creado:* ${data.creation}
*┃👑 ⫹⫺ Owner:* ${data.owner}
*┗━━━━━━━━━━━━━━━┛*`
//await conn.reply(m.chat, groupinfo, m)
await await conn.sendButton(m.chat, groupinfo, `*Copiar Descripción 👇*`, pp, [['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪', '/menu']], `https://www.whatsapp.com/otp/copy/${data.desc}`, null, null, m)
//conn.sendMessage(m.chat, { text: `*┏━━━━━━━━━━━━━━┓*\n┃¿Desa copiar la desc? •🌷\n*┗━━━━━━━━━━━━━━┛*`, templateButtons: botones, footer: wm })
}
handler.command = /^(inspect)$/i

export default handler
handler.owner = false

const extractGroupMetadata = (result) => {
	const group = baileys.getBinaryNodeChild(result, 'group')
	const descChild = baileys.getBinaryNodeChild(group, 'description')
	let desc
	if (descChild) desc = baileys.getBinaryNodeChild(descChild, 'body')?.content
	const metadata = {
		id: group.attrs.id.includes('@') ? group.attrs.id : baileys.jidEncode(group.attrs.id, 'g.us'),
		subject: group.attrs.subject,
		creation: new Date(+group.attrs.creation * 1000).toLocaleString('id', { timeZone: 'America/Los_Angeles' }),
		owner: group.attrs.creator ? 'wa.me/' + baileys.jidNormalizedUser(group.attrs.creator).split('@')[0] : undefined,
		desc
	}
	return metadata
}*/
