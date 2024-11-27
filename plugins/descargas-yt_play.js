import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';
import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';

const LimitAud = 725 * 1024 * 1024; // 700MB
const LimitVid = 425 * 1024 * 1024; // 425MB

const handler = async (m, { conn, command, args, text, usedPrefix }) => {
  if (command === 'play' || command === 'musica') {
    if (!text) throw `Por favor, utiliza el comando correctamente.\nEjemplo: ${usedPrefix + command} Billie Eilish - Bellyache`;

    const yt_play = await search(args.join(' '));
    const texto1 = `🎵 *Descargando audio:*
Título: ${yt_play[0].title}
Autor: ${yt_play[0].author.name}
Duración: ${yt_play[0].duration.seconds} segundos
Vistas: ${yt_play[0].views}

🔗 Link: ${yt_play[0].url}

_Aguarde mientras se procesa el audio..._`;

    await conn.sendFile(m.chat, yt_play[0].thumbnail, 'error.jpg', texto1, m);

    try {
      const apiUrl = `https://deliriussapi-oficial.vercel.app/download/ytmp4?url=${encodeURIComponent(yt_play[0].url)}`;
      const apiResponse = await fetch(apiUrl);
      const delius = await apiResponse.json();

      if (!delius.status) {
        return m.react('❌');
      }

      const downloadUrl = delius.data.download.url;
      await conn.sendMessage(m.chat, { audio: { url: downloadUrl }, mimetype: 'audio/mpeg' }, { quoted: m });
    } catch (error) {
      console.error(error);
      await m.react('❌');
    }
  }

  if (command === 'play2' || command === 'video') {
    if (!text) throw `Por favor, utiliza el comando correctamente.\nEjemplo: ${usedPrefix + command} Billie Eilish - Bellyache`;

    const yt_play = await search(args.join(' '));
    const texto1 = `🎥 *Descargando video:*
Título: ${yt_play[0].title}
Autor: ${yt_play[0].author.name}
Duración: ${yt_play[0].duration.seconds} segundos
Vistas: ${yt_play[0].views}

🔗 Link: ${yt_play[0].url}

_Aguarde mientras se procesa el video..._`;

    await conn.sendFile(m.chat, yt_play[0].thumbnail, 'error.jpg', texto1, m);

    try {
      const apiUrl = `https://deliriussapi-oficial.vercel.app/download/ytmp4?url=${encodeURIComponent(yt_play[0].url)}`;
      const apiResponse = await fetch(apiUrl);
      const delius = await apiResponse.json();

      if (!delius.status) {
        return m.react('❌');
      }

      const downloadUrl = delius.data.download.url;
      const fileSize = await getFileSize(downloadUrl);

      if (fileSize > LimitVid) {
        await conn.sendMessage(m.chat, {
          document: { url: downloadUrl },
          fileName: `${yt_play[0].title}.mp4`,
          caption: `🎥 *Video descargado como documento.*`,
        }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, {
          video: { url: downloadUrl },
          fileName: `${yt_play[0].title}.mp4`,
          caption: `🎥 *Video descargado correctamente.*`,
          thumbnail: yt_play[0].thumbnail,
          mimetype: 'video/mp4',
        }, { quoted: m });
      }
    } catch (error) {
      console.error(error);
      await m.react('❌');
    }
  }
};

export default handler;
