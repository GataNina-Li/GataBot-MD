// plugins/downloader-mediafire.js
import fetch from 'node-fetch'

let handler = async (m, {conn, args, usedPrefix, command}) => {
if (!args[0]) throw `${lenguajeGB['smsAvisoMG']()}${mid.smsFire}`

// Validar URL de MediaFire
const url = args[0]
if (!/^https?:\/\/(www\.)?mediafire\.com/i.test(url)) {
throw `${lenguajeGB['smsAvisoMG']()} *Enlace no válido.*\n📌 Asegúrate de ingresar una URL de MediaFire válida.\n\nEjemplo: \`${usedPrefix + command} https://www.mediafire.com/file/ejemplo/file.zip\``
}

await m.react('📥')

try {
const api = `https://delirius-apiofc.vercel.app/download/mediafire?url=${encodeURIComponent(url)}`
const res = await fetch(api)
if (!res.ok) throw new Error(`Error de la API: ${res.status} ${res.statusText}`)

const json = await res.json()

// Normalizar posibles formatos de respuesta
const data = json?.data || json?.result || json

// Campos típicos que puede devolver la API
const fileUrl = data?.url || data?.link || data?.download || data?.dl || data?.download_url
const fileTitle = data?.title || data?.filename || data?.name || 'archivo'
const fileSize = data?.size || data?.filesize || 'Desconocido'
const fileMime = data?.mime || data?.mimetype || 'application/octet-stream'

if (!fileUrl) throw new Error('No se pudo obtener el enlace de descarga.')

const caption = `${eg}
> ┃ 𓃠 *${gt} ${vs}* 
> ┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
> ┃ 💫 ${mid.name}
> ┃  ${fileTitle}
> ┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
> ┃ 💪 ${mid.smsYT11}
> ┃ ${fileSize}
> ┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
> ┃ 🚀 ${mid.smsYT12}
> ┃  ${fileMime}`.trim()

// Enviar archivo como documento (mismo patrón que usabas)
await conn.sendFile(m.chat, fileUrl, fileTitle, caption, m, null, {mimetype: fileMime, asDocument: true})

await m.react('✅')
} catch (e) {
console.error('❌ Error en mediafire:', e)
await conn.reply(
m.chat,
`${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${String(e.message || e)}\n\n${wm}`,
m
)
await m.react('❌')
}
}

handler.help = ['mediafire'].map((v) => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(mediafire|mediafiredl|dlmediafire)$/i
handler.register = true
handler.limit = true

export default handler
