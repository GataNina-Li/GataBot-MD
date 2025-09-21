import axios from 'axios'

let handler = async (m, {conn, text, usedPrefix, command}) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()} ${mid.smsMalused7}\n*${usedPrefix + command} gata | cat*`

m.react('🔎')

if (/^https?:\/\/[^\s]+$/i.test(text)) {
try {
let {data} = await axios.get(`${global.APIs.stellar.url}/dow/pinterest?url=${text}&apikey=${global.APIs.stellar.key}`)
if (!data?.data) throw null

const file = {
type: data.data.format.includes('mp4') ? 'video' : 'image',
url: data.data.dl,
caption: `💞 *${data.data.title || '-'}*\n💖 ${lenguajeGB.tipo || 'Tipo'}: ${data.data.format.includes('mp4') ? 'Video' : 'Imagen'}`
}

await conn.sendMessage(m.chat, {[file.type]: {url: file.url}, caption: file.caption}, {quoted: m})
return m.react('✅')
} catch {
return conn.reply(m.chat, lenguajeGB.smsAvisoFallo || '❌ No se pudo procesar ese enlace.', m)
}
}

const apis = [
`${global.APIs.stellar.url}/search/pinterest?query=${text}&apikey=${global.APIs.stellar.key}`,
`https://api.dorratz.com/v2/pinterest?q=${text}`,
`https://api.siputzx.my.id/api/s/pinterest?query=${text}`,
`https://api.betabotz.eu.org/api/search/pinterest?query=${text}`
]

for (const api of apis) {
try {
const res = await axios.get(api)
const data = res.data?.data || res.data
if (Array.isArray(data) && data.length > 0) {
const r = data[0]
const url = r.hd || r.image || r.images_url
if (!url) continue
const caption = `🐞 ${r.title || r.fullname || text}\n🎋 ${lenguajeGB.autor || 'Autor'}: ${r.full_name || r.upload_by || r.name || 'Desconocido'}`
await conn.sendMessage(m.chat, {image: {url}, caption}, {quoted: m})
return m.react('✅')
}
} catch {
continue
}
}

return conn.reply(m.chat, lenguajeGB.smsAvisoFallo || '❌ No se encontraron resultados.', m)
}

handler.help = ['pinterest <consulta|enlace>']
handler.tags = ['internet']
handler.command = /^(pinterest(dl)?|dlpinterest)$/i
handler.money = 30

export default handler
