import axios from "axios"
let handler = async (m, { conn, text, args, usedPrefix, command}) => {
if (!text) return conn.reply(m.chat, `${lenguajeGB['smsAvisoMG']()}${mid.smsTikTok2}\n*${usedPrefix + command} https://vm.tiktok.com/ZM6n8r8Dk/*`, fkontak,  m)
if (!/(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok.com\/([^\s&]+)/gi.test(text)) return conn.reply(m.chat, `${lenguajeGB['smsAvisoFG']()}${mid.smsTikTok3}`, fkontak,  m)  
await conn.reply(m.chat, `${lenguajeGB['smsAvisoEG']()}${mid.smsTikTok4}`, fkontak,  m) 
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
  try {
      const response = await axios.get(`https://api.dorratz.com/v2/tiktok-dl?url=${text}`);
      if (response.data.status && response.data.data) {
        const videoData = response.data.data.media;
       const videoUrl = videoData.org; 
        const videoDetails = `*Título*: ${response.data.data.title}\n` +
                             `*Autor*: ${response.data.data.author.nickname}\n` +
                             `*Duración*: ${response.data.data.duration}s
` +
                             `*Likes*: ${response.data.data.like}\n` +
                             `*Comentarios*: ${response.data.data.comment}`;
        await conn.sendMessage(
          m.chat,
          {
            video: { url: videoUrl },
            caption: videoDetails
          },
          { quoted: m }
        );
      } else {
        await conn.sendMessage(m.chat, "No se pudo obtener el video. Verifica la URL.", { quoted: m });
      }
    } catch (error) {
      console.error(error);
      await conn.sendMessage(m.chat, "Se produjo un error al intentar descargar el video.", { quoted: m });
  }}
handler.limit = false
handler.help = ['tiktok']
handler.tags = ['dl']
handler.command = /^(tt|tiktok)(dl|nowm)?$/i
//handler.limit = 2
export default handler

