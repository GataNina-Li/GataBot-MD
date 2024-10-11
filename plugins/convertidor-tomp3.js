import { toAudio } from '../lib/converter.js' 
let handler = async (m, { conn, usedPrefix, command }) => {
let q = m.quoted ? m.quoted : m
let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
if (!/video|audio/.test(mime)) throw `${lenguajeGB['smsAvisoMG']()}${mid.smsconvert4}`
await conn.sendPresenceUpdate('recording', m.chat)
let media = await q.download?.()
if (!media && !/video/.test(mime)) throw `${lenguajeGB['smsAvisoFG']()}${mid.smsconvert5}`
if (!media && !/audio/.test(mime)) throw `${lenguajeGB['smsAvisoFG']()}${mid.smsconvert5}`
let audio = await toAudio(media, 'mp4')
if (!audio.data && !/audio/.test(mime)) throw `${lenguajeGB['smsAvisoFG']()}${mid.smsconvert6}`
if (!audio.data && !/video/.test(mime)) throw `${lenguajeGB['smsAvisoFG']()}${mid.smsconvert6}`
conn.sendFile(m.chat, audio.data, 'error.mp3', '', m, null, { mimetype: 'audio/mp4' })
}
handler.help = ['tomp33 (reply)']
handler.tags = ['audio']
handler.command = /^(tomp3|toaudio)$/i
 // ['toomp3', 'toaudio', 'mmp3']   
export default handler
