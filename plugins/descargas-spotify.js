import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `${lenguajeGB.smsMalused2()} ⊱ *${usedPrefix + command} Bellyache*`;

  try {
    m.react('⌛️');

    let songInfo = await spotifyxv(text);
    if (!songInfo.length) throw 'No se encontró la canción.';
    let song = songInfo[0];

    const res = await axios.get(`https://api.stellarwa.xyz/dow/spotify?url=${song.url}`);
    const data = res.data?.data;
    if (!data?.download) throw 'No se pudo obtener el enlace de descarga.';

    const info = `🪼 *Título:*\n${data.title}\n🪩 *Artista:*\n${data.artist}\n🦋 *Álbum:*\n${song.album}\n⏳ *Duración:*\n${data.duration}\n🔗 *Enlace:*\n${song.url}\n\n${wm}`;

    await conn.sendMessage(m.chat, {
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
          thumbnailUrl: data.image,
          mediaUrl: data.download,
          sourceUrl: data.download
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: data.download },
      fileName: `${data.title}.mp3`,
      mimetype: 'audio/mpeg'
    }, { quoted: m });

    m.react('✅');
  } catch (e) {
    m.react('❌');
    m.reply(`❌ Ocurrió un error inesperado: ${e.message || e}`);
  }
};

handler.command = ['spotify', 'music'];
export default handler;

async function spotifyxv(query) {
  const res = await axios.get(`https://api.stellarwa.xyz/search/spotify?query=${query}`);
  if (!res.data?.status || !res.data?.data?.length) return [];

  const randomTrack = res.data.data[Math.floor(Math.random() * res.data.data.length)];

  return [{
    name: randomTrack.title,
    artista: [randomTrack.artist],
    album: randomTrack.album,
    duracion: randomTrack.duration,
    url: randomTrack.url,
    imagen: randomTrack.image || ''
  }];
}