import fetch from 'node-fetch';
const handler = async (m, {conn, text, usedPrefix, command}) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()} *𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙏𝙀𝙓𝙏𝙊 𝙋𝘼𝙍𝘼 𝘾𝙍𝙀𝘼𝙍 𝙐𝙉𝘼 𝙄𝙈𝘼𝙂𝙀𝙉 𝘾𝙊𝙉 𝘿𝘼𝙇𝙇-𝙀 (𝙄𝘼)\n\n*ღ 𝙀𝙅𝙀𝙈𝙋𝙇𝙊:\n*ɞ ${usedPrefix + command} gatitos llorando*\n*ɞ ${usedPrefix + command} Un gato de color morado con celeste estando en Júpiter, iluminando el cosmo con su encanto con un efecto minimalista.*`;
await conn.sendMessage(m.chat, {text: '*⌛ ESPERE UN MOMENTO POR FAVOR...*'}, {quoted: m});
try {
const tiores4 = await conn.getFile(`https://api.lolhuman.xyz/api/dall-e?apikey=${lolkeysapi}&text=${text}`);
await conn.sendMessage(m.chat, {image: {url: tiores4.data}}, {quoted: m});
} catch {
throw `${lenguajeGB['smsAvisoFG']()} 𝙀𝙍𝙍𝙊𝙍, (𝘼𝙋𝙄 𝘾𝘼𝙄𝘿𝘼) 𝙑𝙐𝙀𝙇𝙑𝘼 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙍 𝙈𝘼𝙎 𝙏𝘼𝙍𝘿𝙀𝙎.`;
}}
handler.command = ['dall-e', 'dalle', 'ia2', 'cimg', 'openai3', 'a-img', 'aimg', 'imagine'];
export default handler;

/*import fetch from 'node-fetch';
const handler = async (m, {conn, text, usedPrefix, command}) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()} *𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙏𝙀𝙓𝙏𝙊 𝙋𝘼𝙍𝘼 𝘾𝙍𝙀𝘼𝙍 𝙐𝙉𝘼 𝙄𝙈𝘼𝙂𝙀𝙉 𝘾𝙊𝙉 𝘿𝘼𝙇𝙇-𝙀 (𝙄𝘼)\n\n*ღ 𝙀𝙅𝙀𝙈𝙋𝙇𝙊:\n*ɞ ${usedPrefix + command} gatitos llorando*\n*ɞ ${usedPrefix + command} Un gato de color morado con celeste estando en Júpiter, iluminando el cosmo con su encanto con un efecto minimalista.*`;
await conn.sendMessage(m.chat, {text: '*⌛ ESPERE UN MOMENTO POR FAVOR...*'}, {quoted: m});
try {
const tiores1 = await fetch(`https://vihangayt.me/tools/imagine?q=${text}`);
const json1 = await tiores1.json();
await conn.sendMessage(m.chat, {image: {url: json1.data}}, {quoted: m});
} catch {  
try {
const tiores2 = await conn.getFile(`https://vihangayt.me/tools/midjourney?q=${text}`);
await conn.sendMessage(m.chat, {image: {url: tiores2.data}}, {quoted: m});
} catch {
 console.log('Error en la api de dall-e.');
try {
const tiores3 = await fetch(`https://vihangayt.me/tools/lexicaart?q=${text}`);
const json3 = await tiores3.json();
await conn.sendMessage(m.chat, {image: {url: json3.data[0].images[0].url}}, {quoted: m});
} catch {
console.log('Error en la api numero 2 de dall-e.');
try {
const tiores4 = await conn.getFile(`https://api.lolhuman.xyz/api/dall-e?apikey=${lolkeysapi}&text=${text}`);
await conn.sendMessage(m.chat, {image: {url: tiores4.data}}, {quoted: m});
} catch {
throw `${lenguajeGB['smsAvisoFG']()} 𝙀𝙍𝙍𝙊𝙍, (𝘼𝙋𝙄 𝘾𝘼𝙄𝘿𝘼) 𝙑𝙐𝙀𝙇𝙑𝘼 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙍 𝙈𝘼𝙎 𝙏𝘼𝙍𝘿𝙀𝙎.`;
}}}}};
handler.command = ['dall-e', 'dalle', 'ia2', 'cimg', 'openai3', 'a-img', 'aimg', 'imagine'];
export default handler;*/
