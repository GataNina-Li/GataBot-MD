import fetch from 'node-fetch';
import axios from 'axios';
const timeout = 30000;
const poin = 1000;
const handler = async (m, {conn, usedPrefix}) => {
  conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {};
  const id = m.chat;
  if (id in conn.tebaklagu) {
    conn.reply(m.chat, 'Todavía hay canciones sin respuesta en este chat.', conn.tebaklagu[id][0]);
    throw false;
  } // 5LTV57azwaid7dXfz5fzJu
  const res = await fetchJson(`https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/src/JSON/tebaklagu.json`);
  const json = res[Math.floor(Math.random() * res.length)];
  const caption = `ADIVINA EL TITULO DE LA CANCION\n⎔ Tiempo ➺ ${(timeout / 1000).toFixed(2)} segundos ⏰\n⎔ Escribe *${usedPrefix}pista* Para obtener una pista 😸\n⎔ Premio: ${poin} XP⚡\n\nRESPONDE A ESTE MENSAJE CON LAS RESPUESTAS!!`.trim();
  conn.tebaklagu[id] = [
    await m.reply(caption),
    json, poin,
    setTimeout(() => {
      if (conn.tebaklagu[id]) conn.reply(m.chat, `Se acabó el tiempo!\nLa respuesta es ${json.jawaban}`, conn.tebaklagu[id][0]);
      delete conn.tebaklagu[id];
    }, timeout),
  ];
  const aa = await conn.sendMessage(m.chat, {audio: {url: json.link_song}, fileName: `error.mp3`, mimetype: 'audio/mpeg'}, {quoted: m});
  if (!aa) return conn.sendFile(m.chat, json.link_song, 'coba-lagi.mp3', '', m);
};
handler.help = ['tebaklagu'];
handler.tags = ['game'];
handler.command = /^cancion|canción$/i;
export default handler;
async function fetchJson(url, options) {
  try {
options ? options : {};
const res = await axios({method: 'GET', url: url, headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'}, ...options});
return res.data;
  } catch (err) {
    return err;
  }
}
