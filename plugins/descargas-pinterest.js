import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `${lenguajeGB['smsAvisoMG']()} ${mid.smsMalused7}\n*${usedPrefix + command} gata | cat*` 

  m.react('🔎')

  if (/^https?:\/\/[^\s]+$/i.test(text)) {
    try {
      let { data } = await axios.get(`https://api.stellarwa.xyz/dow/pinterest?url=${text}`)
      if (!data?.data) throw null

      const file = {
        type: data.data.format.includes('mp4') ? 'video' : 'image',
        url: data.data.dl,
        caption: `🪸 *${data.data.title}*\n💖 ${lenguajeGB.tipo || 'Tipo'}: ${data.data.format.includes('mp4') ? 'Video' : 'Imagen'}`
      }

      await conn.sendMessage(m.chat, { [file.type]: { url: file.url }, caption: file.caption }, { quoted: m })
      return m.react("✅")
    } catch {
      return conn.reply(m.chat, lenguajeGB.smsAvisoFallo || '❌ No se pudo procesar ese enlace.', m)
    }
  }

  const apis = [
    `https://api.stellarwa.xyz/search/pinterest?query=`,
    `https://api.dorratz.com/v2/pinterest?q=`,
    `https://api.siputzx.my.id/api/s/pinterest?query=`,
    `https://api.betabotz.eu.org/api/search/pinterest?query=`,
  ]

  let results = null
  for (const api of apis) {
    try {
      const res = await axios.get(api + encodeURIComponent(text))
      const data = res.data?.data || res.data
      if (Array.isArray(data) && data.length) {
        results = data.slice(0, 6).map(r => [
          r.title || r.fullname || text,
          `🧑 ${lenguajeGB.autor || 'Autor'}: ${r.full_name || r.upload_by || r.name || 'Desconocido'}\n❤️ Likes: ${r.likes || '-'}\n📅 ${r.created || '-'}`,
          r.hd || r.image || r.images_url
        ])
        break
      }
    } catch {
      continue
    }
  }

  if (!results) return conn.reply(m.chat, `${lenguajeGB.smsAvisoFallo || '❌ No se encontraron resultados.'}`, m)

  await conn.sendCarousel(
    m.chat,
    `${lenguajeGB.smsAvisoEG?.() || '✅'} 💞 ${mid?.buscador || 'Resultados'}: ${text}`,
    lenguajeGB.tituloBusqueda || '🔍 Pinterest',
    results,
    m
  )
  m.react('✅')
}

handler.help = ['pinterest <query|link>']
handler.tags = ['internet']
handler.command = /^(pinterest(dl)?|dlpinterest)$/i
handler.money = 30

export default handler