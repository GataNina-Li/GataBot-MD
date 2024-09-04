import fs from 'fs';
const handler = async (m, {conn, text}) => {
  m.reply('Espera Por Favor, Enviando Base de Datos');
  const db = await fs.readFileSync('./database.json');
  return await conn.sendMessage(m.chat, {document: db, mimetype: 'application/json', fileName: 'database.json'}, {quoted: m});
};
handler.help = ['getdb'];
handler.tags = ['owner'];
handler.command = /^(getdb)$/i;

handler.rowner = true;
export default handler;
