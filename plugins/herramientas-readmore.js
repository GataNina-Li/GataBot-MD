let handler = async (m, { conn, text }) => {
let [l, r] = text.split`|`
if (!l) l = ''
if (!r) r = ''

function insertReadMoreEverySixWords(str) {
let words = str.split(' ');
let result = [];
for (let i = 0; i < words.length; i += 6) {
result.push(words.slice(i, i + 6).join(' '));
}
return result.join(` ${readMore} `);
}

if (l.split(' ').length > 6) {
l = insertReadMoreEverySixWords(l);
}
if (r.split(' ').length > 6) {
r = insertReadMoreEverySixWords(r);
}

conn.reply(m.chat, l + readMore + r, m)
}
handler.help = ['readmore <text1>|<text2>']
handler.tags = ['tools']
handler.command = ['leermas', 'readmore']
handler.register = true 
handler.limit = 1
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
