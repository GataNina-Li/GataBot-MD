const { generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default
var handler = async(m, { conn, text, usedPrefix, command }) => {
  
 let msg = await generateWAMessageFromContent(m.chat, { locationMessage: {
  degreesLatitude: 0,
  degreesLongitude: 0,
  name: 'Yutu del bot',
  address: wm,
  url: yt,
  isLive: true,
  accuracyInMeters: 0,
  speedInMps: 0,
  degreesClockwiseFromMagneticNorth: 2,
  comment: 'ni funciona esta cosa',
  jpegThumbnail: imagen1
}}, { quoted: m })
conn.relayMessage(m.chat, msg.message, {})

} 
handler.command = /^((bug|bugg))$/i
handler.owner = true

export default handler
  
