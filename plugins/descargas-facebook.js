
 import { igdl } from 'ruhend-scraper';

const handler = async (m, { text, conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, 'Ingresa Un Link De Facebook', m);
  }

  let res;
  try {
    res = await igdl(args[0]);
  } catch (error) {
    return conn.reply(m.chat, 'Error al obtener datos. Verifica el enlace.', m);
  }

  let result = res.data;
  if (!result || result.length === 0) {
    return conn.reply(m.chat, 'No se encontraron resultados.', m);
  }

  let data;
  try {
    data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
  } catch (error) {
    return conn.reply(m.chat, 'Error al procesar los datos.', m);
  }

  if (!data) {
    return conn.reply(m.chat, 'No se encontró una resolución adecuada.', m);
  }

  let video = data.url;
  try {
    await conn.sendMessage(m.chat, { video: { url: video }, caption: null, fileName: 'fb.mp4', mimetype: 'video/mp4' }, { quoted: m });
  } catch (error) {
    return conn.reply(m.chat, 'Error al enviar el video.', m);
  }
};

handler.command = /^(facebook)$/i;

export default handler;       
