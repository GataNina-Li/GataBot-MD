import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false
  let username = conn.getName(m.sender)
  try {
  	
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime)) if ((q.msg || q).seconds > 11) return m.reply('╰⊱⚠️⊱ *𝘼𝘿𝙑𝙀𝙍𝙏𝙀𝙉𝘾𝙄𝘼 | 𝙒𝘼𝙍𝙉𝙄𝙉𝙂* ⊱⚠️⊱╮\n\n𝙀𝙇 𝙑𝙄𝘿𝙀𝙊 𝙉𝙊 𝘿𝙀𝘽𝙀 𝘿𝙀 𝘿𝙐𝙍𝘼𝙍 𝙈𝘼𝙎 𝘿𝙀 *7* 𝙎𝙀𝙂𝙐𝙉𝘿𝙊𝙎\n\n𝙏𝙃𝙀 𝙑𝙄𝘿𝙀𝙊 𝙎𝙃𝙊𝙐𝙇𝘿 𝙉𝙊𝙏 𝙇𝘼𝙎𝙏 𝙈𝙊𝙍𝙀 𝙏𝙃𝘼𝙉 *7* 𝙎𝙀𝘾𝙊𝙉𝘿𝙎')
      let img = await q.download?.()
      if (!img) throw `╰⊱❗️⊱ *𝙇𝙊 𝙐𝙎𝙊́ 𝙈𝘼𝙇 | 𝙐𝙎𝙀𝘿 𝙄𝙏 𝙒𝙍𝙊𝙉𝙂* ⊱❗️⊱╮\n\n𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝘼 𝘼 𝙐𝙉𝘼 𝙄𝙈𝘼𝙂𝙀𝙉, 𝙑𝙄𝘿𝙀𝙊, 𝙂𝙄𝙁 𝙊 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙏𝙄𝙋𝙊 *.jpg* 𝙋𝘼𝙍𝘼 𝙍𝙀𝘼𝙇𝙄𝙕𝘼𝙍 𝙀𝙇 𝙎𝙏𝙄𝘾𝙆𝙀𝙍 𝙐𝙎𝙀 *${usedPrefix + command}*\n\n𝙍𝙀𝙎𝙋𝙊𝙉𝘿 𝙏𝙊 𝘼𝙉 𝙄𝙈𝘼𝙂𝙀, 𝙑𝙄𝘿𝙀𝙊, 𝙂𝙄𝙁 𝙊𝙍 𝙇𝙄𝙉𝙆 𝙊𝙁 𝙏𝙔𝙋𝙀 *.jpg* 𝙏𝙊 𝙈𝘼𝙆𝙀 𝙏𝙃𝙀 𝙎𝙏𝙄𝘾𝙆𝙀𝙍 𝙐𝙎𝙀 *${usedPrefix + command}_*`
      let out
      try {
        stiker = await sticker(img, false, global.packname, global.author)
      } catch (e) {
        console.error(e)
      } finally {
      await conn.reply(m.chat, `${fg}⌛𝘾𝘼𝙇𝙈𝘼 𝘾𝙍𝘼𝘾𝙆 𝙀𝙎𝙏𝙊𝙔 𝙃𝘼𝘾𝙄𝙀𝙉𝘿𝙊 𝙏𝙐 𝙎𝙏𝙄𝘾𝙆𝙀𝙍𝙎 | 𝘾𝘼𝙇𝙈 𝘿𝙊𝙒𝙉 𝘾𝙍𝘼𝘾𝙆 𝙄 𝙈 𝙈𝘼𝙆𝙄𝙉𝙂 𝙔𝙊𝙐𝙍 𝙎𝙏𝙄𝘾𝙆𝙀𝙍 🐈`, m)
        if (!stiker) {
          if (/webp/g.test(mime)) out = await webp2png(img)
          else if (/image/g.test(mime)) out = await uploadImage(img)
          else if (/video/g.test(mime)) out = await uploadFile(img)
          if (typeof out !== 'string') out = await uploadImage(img)
          stiker = await sticker(false, out, global.packname, global.author)
        }
      }
    } else if (args[0]) {
      if (isUrl(args[0])) stiker = await sticker(false, args[0], global.packname, global.author)
      else return m.reply('URL invalido')
    }
  } catch (e) {
    console.error(e)
    if (!stiker) stiker = e
  } finally {
    if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '',m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: wm, body: `h`, mediaType: 2, sourceUrl: nn, nna, thumbnail: imagen1}}}, { quoted: m })
    else throw '𝙑𝙐𝙀𝙇𝙑𝘼 𝘼 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙍 𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝘼 𝘼 𝙐𝙉𝘼 𝙄𝙈𝘼𝙂𝙀𝙉, 𝙑𝙄𝘿𝙀𝙊, 𝙂𝙄𝙁 𝙊 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙏𝙄𝙋𝙊 *.jpg* 𝙋𝘼𝙍𝘼 𝙍𝙀𝘼𝙇𝙄𝙕𝘼𝙍 𝙀𝙇 𝙎𝙏𝙄𝘾𝙆𝙀𝙍\n\n𝙏𝙍𝙔 𝘼𝙂𝘼𝙄𝙉 𝙍𝙀𝙎𝙋𝙊𝙉𝘿 𝙏𝙊 𝘼𝙉 𝙄𝙈𝘼𝙂𝙀, 𝙑𝙄𝘿𝙀𝙊, 𝙂𝙄𝙁 𝙊𝙍 𝙇𝙄𝙉𝙆 𝙊𝙁 𝙏𝙔𝙋𝙀 *.jpg* 𝙏𝙊 𝙈𝘼𝙆𝙀 𝙏𝙃𝙀 𝙎𝙏𝙄𝘾𝙆𝙀𝙍*'
  }
}
handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker'] 

export default handler

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}
