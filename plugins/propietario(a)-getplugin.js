import fs from 'fs';
import fuzzysort from 'fuzzysort';  

let handler = async (m, { usedPrefix, command, text }) => {
  let ar = Object.keys(plugins);
  let ar1 = ar.map(v => v.replace('.js', ''));

  if (!text) throw `*${mg}\nINGRESA EL TEXTO DEL PLUGIN\nejemplo:\n${usedPrefix + command} menu`

  let results = fuzzysort.go(text, ar1);

  if (results.length === 0) {
    return m.reply(`'${text}' no encontrado.\n\nSugerencias:\n${ar1.map(v => ' ' + v).join`\n`}`);
  }

  let match = results[0].target;
  m.reply(fs.readFileSync('./plugins/' + match + '.js', 'utf-8'));
};

handler.help = ['getplugin'].map(v => v + ' <texto>');
handler.tags = ['owner'];
handler.command = /^(getplugin|gp)$/i;
handler.rowner = true;
export default handler;
