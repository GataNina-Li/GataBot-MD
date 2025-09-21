import axios from 'axios'

const SEARCH_API = 'https://delirius-apiofc.vercel.app/search/spotify?q='
const DL_API = 'https://delirius-apiofc.vercel.app/download/spotifydl?url='

let handler = async (m, {conn, text, usedPrefix, command}) => {
if (!text) {
throw (
`${lenguajeGB.smsMalused2?.() || 'Uso:'} ⊱ *${usedPrefix + command}* <texto o url>\n` +
'Ejemplos:\n' +
`• *${usedPrefix + command}* TWICE TT\n` +
`• *${usedPrefix + command}* https://open.spotify.com/track/60jFaQV7Z4boGC4ob5B5c6`
)
}

try {
m.react?.('⌛️')

const isSpotifyUrl = /https?:\/\/open\.spotify\.com\/(track|album|playlist|episode)\/[A-Za-z0-9]+/i.test(text)

let trackUrl = text.trim()
let picked = null

if (!isSpotifyUrl) {
const sURL = `${SEARCH_API}${encodeURIComponent(text.trim())}`
const {data: sRes} = await axios.get(sURL, {timeout: 25_000})

if (!sRes?.status || !Array.isArray(sRes?.data) || sRes.data.length === 0) throw new Error('No se encontraron resultados para tu búsqueda.')

picked = sRes.data[0]
trackUrl = picked.url
}

const dURL = `${DL_API}${encodeURIComponent(trackUrl)}`
const {data: dRes} = await axios.get(dURL, {timeout: 25_000})

if (!dRes?.status || !dRes?.data?.url) {
throw new Error('No se pudo obtener el enlace de descarga.')
}

const {
title = picked?.title || 'Desconocido',
author = picked?.artist || 'Desconocido',
image = picked?.image || '',
duration = 0,
url: download
} = dRes.data || {}

const toMMSS = (ms) => {
const totalSec = Math.floor((+ms || 0) / 1000)
const mm = String(Math.floor(totalSec / 60)).padStart(2, '0')
const ss = String(totalSec % 60).padStart(2, '0')
return `${mm}:${ss}`
}
const mmss = duration && Number.isFinite(+duration) ? toMMSS(duration) : picked?.duration || '—:—'

const cover = image || picked?.image || ''

const info = `🪼 *Título:*
${title}
🪩 *Artista:*
${author}
⏳ *Duración:*
${mmss}
🔗 *Enlace:*
${trackUrl}

${wm}`

await conn.sendMessage(
m.chat,
{
text: info,
contextInfo: {
forwardingScore: 9999999,
isForwarded: true,
externalAdReply: {
showAdAttribution: true,
containsAutoReply: true,
renderLargerThumbnail: true,
title: 'Spotify Music',
mediaType: 1,
thumbnailUrl: cover,
mediaUrl: download,
sourceUrl: download
}
}
},
{quoted: m}
)

await conn.sendMessage(
m.chat,
{
audio: {url: download},
fileName: `${title}.mp3`,
mimetype: 'audio/mpeg'
},
{quoted: m}
)

m.react?.('✅')
} catch (e) {
console.log('❌ Error spotify-combinado:', e?.message || e)
m.react?.('❌')
m.reply('❌ Ocurrió un error al procesar tu solicitud.')
}
}

handler.command = ['spotify', 'music']
export default handler
