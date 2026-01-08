import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import acrcloud from 'acrcloud'

const TMP_DIR = './tmp'
const CLIP_SECONDS = 19
const MIN_SECONDS = 10
const MAX_SECONDS = 300 // 5 minutos

let acr = new acrcloud({
  host: 'identify-us-west-2.acrcloud.com',
  access_key: '644ba30c9f6690e4e1879088b6615972',
  access_secret: '0hm9apQ6vpzwNserRdSuCryDjXuxTjwrBWqtQU1M'
})

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  let seconds = (q.msg || q).seconds || 0

  if (!/audio|video/.test(mime)) return await m.react('❌')

  // ✅ Reglas que pediste
  if (seconds && seconds < MIN_SECONDS) {
    return await m.reply(`No se puede: el audio/video dura menos de ${MIN_SECONDS} segundos.`)
  }
  if (seconds && seconds > MAX_SECONDS) {
    return await m.reply('El audio/video es muy largo. Máximo 5 minutos.')
  }

  await m.react('⌛')

  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true })

  const ext = (mime.split('/')[1] || 'bin').split(';')[0]
  const base = `${m.sender.replace(/[@:]/g, '')}_${Date.now()}`
  const inFile = path.join(TMP_DIR, `${base}.${ext}`)
  const clipFile = path.join(TMP_DIR, `${base}.clip.mp3`) // sacamos audio a mp3

  try {
    // Descargar media
    const media = await q.download()
    fs.writeFileSync(inFile, media)

    // ✅ Calcular inicio del recorte: del medio para mejor reconocimiento
    // (si no tenemos seconds, recortamos desde 0)
    let startAt = 0
    if (seconds && seconds > CLIP_SECONDS) {
      startAt = Math.max(0, Math.floor(seconds / 2 - CLIP_SECONDS / 2))
    }

    // ✅ Recortar/extraer a 19s (audio) con ffmpeg
    await ffmpegClipToMp3(inFile, clipFile, startAt, CLIP_SECONDS)

    // ✅ Identificar con ACRCloud usando el clip
    const buf = fs.readFileSync(clipFile)
    const res = await acr.identify(buf)

    const { code, msg } = res?.status || {}
    if (code !== 0) throw new Error(msg || 'ACRCloud error')

    const music = res?.metadata?.music?.[0]
    if (!music) throw new Error('No se encontró coincidencia.')

    const { title, artists, album, genres, release_date } = music
    const id = music?.external_metadata?.spotify?.track?.id

    let txt = `╔═.✵.══════════╗
┃✫彡 *ミ★ 𝘌𝘯𝘪𝘨𝘮𝘢-𝘉𝘰𝘵 ★彡*
═ *Resultados de la busqueda:* ═
┃✫彡 Título: ${title || 'No encontrado'}
┃✫彡 Artista: ${artists?.map(v => v.name).join(', ') || 'No encontrado'}
┃✫彡 Álbum: ${album?.name || 'No encontrado'}
┃✫彡 Género: ${genres?.map(v => v.name).join(', ') || 'No encontrado'}
┃✫彡 Fecha de lanzamiento: ${release_date || 'No encontrado'}
╚══════════.✵.═╝`

    await m.reply(txt)
    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.reply('No se pudo reconocer. Intenta con otro fragmento o mejor calidad de audio.')
    await m.react('❌')
  } 
}

handler.command = /^quemusica|quemusicaes|whatmusic$/i
export default handler

function ffmpegClipToMp3(input, output, startSec, durationSec) {
  return new Promise((resolve, reject) => {
    const args = [
      '-y',
      '-ss', String(startSec || 0),
      '-i', input,
      '-t', String(durationSec || CLIP_SECONDS),
      '-vn',              // sin video
      '-ac', '1',         // mono
      '-ar', '44100',     // sample rate
      '-b:a', '128k',
      output
    ]

    const p = spawn('ffmpeg', args, { stdio: 'ignore' })

    p.on('error', reject)
    p.on('close', (code) => {
      if (code === 0 && fs.existsSync(output)) resolve()
      else reject(new Error('ffmpeg failed'))
    })
  })
}
