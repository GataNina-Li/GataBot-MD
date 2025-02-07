import axios from 'axios';
import fetch from 'node-fetch';

class Spotify {
  constructor() {
    this.baseUrl = 'https://api.fabdl.com';

    process.env['SPOTIFY_CLIENT_ID'] = '4c4fc8c3496243cbba99b39826e2841f';
    process.env['SPOTIFY_CLIENT_SECRET'] = 'd598f89aba0946e2b85fb8aefa9ae4c8';
  }

  async spotifyCreds() {
    return new Promise(async resolve => {
      await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
        headers: { Authorization: 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64') }
      }).then(({ data }) => resolve(data)).catch(resolve);
    });
  }

  async search(query, type = 'track', limit = 20) {
    return new Promise(async (resolve, reject) => {
      const creds = await this.spotifyCreds();
      if (!creds.access_token) return reject(creds);
      await axios.get('https://api.spotify.com/v1/search?query=' + query + '&type=' + type + '&offset=0&limit=' + limit, {
        headers: { Authorization: 'Bearer ' + creds.access_token }
      }).then(async ({ data: { tracks: { items } } }) => {
        let result = [];
        items.map(async (data) => result.push({
          id: data.id,
          name: data.name,
          duration: data.duration_ms,
          popularity: data.popularity + '%',
          thumbnail: data.album.images.filter(({ height }) => height === 640).map(({ url }) => url)[0],
          album: data.album.name,
          date: data.album.release_date,
          artists: data.artists ? data.artists.map(({ name, type, id }) => ({ name, type, id })) : [],
          url: data.external_urls.spotify
        }));
        resolve(result);
      }).catch(err => reject({ status: false, error: err }));
    });
  }

  async download(url) {
    return new Promise((resolve, reject) => {
      axios.get(this.baseUrl + `/spotify/get?url=${url}`).then(async ({ data: { result: get } }) => {
        axios.get(this.baseUrl + `/spotify/mp3-convert-task/${get.gid}/${get.id}`).then(({ data: { result: download } }) => {
          if (!download) return reject({ status: false });
          resolve({
            id: get.id,
            type: get.type,
            name: get.name,
            image: get.image,
            artists: get.artists,
            duration: get.duration_ms,
            download: `https://api.fabdl.com${download.download_url}`
          });
        }).catch(err => reject({ status: false, error: err }));
      }).catch(err => reject({ status: false, error: err }));
    });
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `⊱ *${usedPrefix + command} Bellyache*`;

  try {
    m.react('⌛️');

    const spotify = new Spotify();
    const songInfo = await spotify.search(text);
    if (!songInfo.length) throw '❌ No se encontraron resultados, intente nuevamente.';

    const song = songInfo[0];
    const data = await spotify.download(song.url);
    if (!data || !data.download) throw "No se pudo obtener el enlace de descarga.";

    const info = `🪼 *Título:* ${data.name}\n\n🪩 *Artista:* ${data.artists.map(artist => artist.name).join(', ')}\n\n🦋 *Álbum:* ${song.album}\n\n⏳ *Duración:* ${timestamp(data.duration)}\n\n🔗 *Enlace:* ${song.url}\n\n${wm}`;

    await conn.sendMessage(m.chat, { text: info, contextInfo: { forwardingScore: 9999999, isForwarded: true, externalAdReply: {
      showAdAttribution: true,
      containsAutoReply: true,
      renderLargerThumbnail: true,
      title: 'Spotify Music',
      mediaType: 1,
      thumbnailUrl: data.image,
      mediaUrl: data.download,
      sourceUrl: data.download,
    }}}, { quoted: m });

    await conn.sendMessage(m.chat, { audio: { url: data.download }, fileName: `${data.name}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m });
    m.react('✅');

  } catch (e1) {
    m.react('❌');
    m.reply(`❌ No se encontraron resultados, intente nuevamente. Error: ${e1.message || e1}`);
    console.error(`Error: ${e1}`);
  }
};

handler.command = ['spotify', 'music'];
export default handler;

function timestamp(time) {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

/*import axios from 'axios';
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {

    if (!text) throw `${lenguajeGB.smsMalused2()} ⊱ *${usedPrefix + command} Bellyache*`;

    try {
        m.react('⌛️');

        let songInfo = await spotifyxv(text);
        if (!songInfo.length) throw `❌ No se encontraron resultados, intente nuevamente.`;
        let song = songInfo[0];
        const res = await fetch(`https://apis-starlights-team.koyeb.app/starlight/spotifydl?url=${song.url}`);
        const data = await res.json();

        if (!data || !data.music) throw "No se pudo obtener el enlace de descarga.";

        const info = `🪼 *Titulo:* ${data.title}\n\n🪩 *Artista:* ${data.artist}\n\n🦋 *Álbum:* ${song.album}\n\n⏳ *Duración:* ${song.duracion}\n\n🔗 *Enlace:* ${data.spotify}\n\n${wm}`;

        await conn.sendMessage(m.chat, { text: info, contextInfo: { forwardingScore: 9999999, isForwarded: true, 
        externalAdReply: {
            showAdAttribution: true,
            containsAutoReply: true,
            renderLargerThumbnail: true,
            title: 'Spotify Music',
            mediaType: 1,
            thumbnailUrl: data.thumbnail,
            mediaUrl: data.music,
            sourceUrl: data.music
        }}}, { quoted: m });

        await conn.sendMessage(m.chat, { audio: { url: data.music }, fileName: `${data.title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m });
        m.react('✅');

    } catch (e1) {
        m.react('❌');
        m.reply(`❌ No se encontraron resultados, intente nuevamente. Error: ${e1.message || e1}`);
        console.error(`Error: ${e1}`);
    }
};

handler.command = ['spotify', 'music'];
export default handler;

async function spotifyxv(query) {
    let token = await tokens();
    try {
        let response = await axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/search?q=' + encodeURIComponent(query) + '&type=track',
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });
        const tracks = response.data.tracks.items;
        const results = tracks.map((track) => ({
            name: track.name,
            artista: track.artists.map((artist) => artist.name),
            album: track.album.name,
            duracion: timestamp(track.duration_ms),
            url: track.external_urls.spotify,
            imagen: track.album.images.length ? track.album.images[0].url : '',
        }));
        return results;
    } catch (error) {
        console.error(`Error en spotifyxv: ${error}`);
        return [];
    }
}

async function tokens() {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from('acc6302297e040aeb6e4ac1fbdfd62c3:0e8439a1280a43aba9a5bc0a16f3f009').toString('base64'),
            },
            data: 'grant_type=client_credentials',
        });
        return response.data.access_token;
    } catch (error) {
        console.error(`Error en tokens: ${error}`);
        throw new Error('No se pudo obtener el token de acceso');
    }
}

function timestamp(time) {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}*/