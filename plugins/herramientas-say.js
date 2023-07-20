let handler = async (m, {conn, text, usedPrefix, command}) => {
  if (!text) throw `*❕ Ingresa en texto, ejemplo:*\n${usedPrefix + command} Hola`
  let textfilter = text.replace(listkatakotor, "(*kata kotor*)")
  conn.reply(m.chat, textfilter, null)
};
handler.help = ["say <teks>"]
handler.tags = ["tools"];
handler.command = /^(say)$/i

export default handler
