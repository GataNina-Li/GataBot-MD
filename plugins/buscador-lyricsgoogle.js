import BuscarLetra from "../lib/lyricsgg.js";

let handler = async (m, { conn, usedPrefix, command, text }) => {
  let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : "";
  if (!teks) throw `️${lenguajeGB['smsAvisoMG']()} *𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝙇𝘼 𝘾𝘼𝙉𝘾𝙄𝙊𝙉.*`;
  try {
    let res = await BuscarLetra(text);
    let { titulo, artista, albulm, fecha, Generos, letra } = res;
    let txt = `*𝙂𝙊𝙊𝙂𝙇𝙀 𝙇𝙔𝙍𝙄𝘾𝙎 🪴*\n\n`;
    txt += ` *↬ 𝙏𝙄𝙏𝙐𝙇𝙊:* ${titulo}\n`;
    txt += ` *↬ 𝘼𝙍𝙏𝙄𝙎𝙏𝘼:* ${artista}\n`;
    txt += ` *↬ 𝘼́𝙇𝘽𝙐𝙈:* ${albulm}\n`;
    txt += ` *↬ 𝙁𝙀𝘾𝙃𝘼:* ${fecha}\n`;
    txt += ` *↬ 𝙂𝙀𝙉𝙀𝙍𝙊𝙎:* ${Generos}\n\n`;
    txt += `${letra}`;
m.reply(txt);
  } catch (e) {
    await m.reply(lenguajeGB['smsMalError3']() + '\n*' + lenguajeGB.smsMensError1() + '*\n*' + usedPrefix + `${lenguajeGB.lenguaje() == 'es' ? 'reporte' : 'report'}` + '* ' + `${lenguajeGB.smsMensError2()} ` + usedPrefix + command)
  }
};
handler.command = handler.help = [
  "google-lyrics",
  "lyricsgoogle",
  "googlelyrics",
];
export default handler;
