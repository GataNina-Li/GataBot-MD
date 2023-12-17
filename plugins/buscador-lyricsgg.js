import BuscarLetra from "../lib/lyricsgg.js";

let handler = async (m, { conn, usedPrefix, command, text }) => {
  let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : "";
  if (!teks) throw `⚠️️ *Ingrese el nombre de la canción.*`;
  try {
    let res = await BuscarLetra(text);
    let { titulo, artista, albulm, fecha, Generos, letra } = res;
    let txt = `*Google Lyrics 🪴*\n\n`;
    txt += ` *↬ Título:* ${titulo}\n`;
    txt += ` *↬ Artista:* ${artista}\n`;
    txt += ` *↬ Álbum:* ${albulm}\n`;
    txt += ` *↬ Fecha:* ${fecha}\n`;
    txt += ` *↬ Géneros:* ${Generos}\n\n`;
    txt += `${letra}`;

    m.reply(txt);
  } catch (e) {
    m.reply("No se encontraron resultados");
  }
};
handler.command = handler.help = [
  "google-lyrics",
  "lyricsgoogle",
  "googlelyrics",
];
export default handler;
