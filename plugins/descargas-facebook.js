import { igdl } from 'ruhend-scraper'

const handler = async (m, { text, conn, args }) => {

if (!args[0]) return conn.reply(m.chat, `${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} https://www.facebook.com/watch?v=636541475139*\n\n𝙀𝙉𝙏𝙀𝙍 𝘼 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 𝙇𝙄𝙉𝙆 𝙏𝙊 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 𝙏𝙃𝙀 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} https://fb.watch/dcXq_0CaHi/*`, fkontak, m)

if (!args[0].match(/www.facebook.com|fb.watch/g)) return conn.reply(m.chat, `${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} https://www.facebook.com/watch?v=636541475139*\n\n𝙀𝙉𝙏𝙀𝙍 𝘼 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 𝙇𝙄𝙉𝙆 𝙏𝙊 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 𝙏𝙃𝙀 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} https://fb.watch/dcXq_0CaHi/*`, fkontak, m)

let res;
try {
// m.reply('⏰ *𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙉𝘿𝙊 𝙎𝙐 𝙑𝙄𝘿𝙀𝙊 𝘿𝙀 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆...*')
m.react('⏱️')

res = await igdl(args[0]);
} catch (e) {
return conn.reply(m.chat, 'Error al obtener datos. Verifica el enlace.', m)
}

let result = res.data;
if (!result || result.length === 0) {
return conn.reply(m.chat, 'No se encontraron resultados.', m)
}

let data;
try {
data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
} catch (e) {
return conn.reply(m.chat, 'Error al procesar los datos.', m)
}

if (!data) {
return conn.reply(m.chat, 'No se encontró una resolución adecuada.', m)
}

let video = data.url;
try {
await conn.sendFile(m.chat, video, 'video.mp4', `✅ 𝙑𝙄𝘿𝙀𝙊 𝘿𝙀 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆\n${wm}`, m, null, fake);
m.react('✅');
} catch (e) {
return conn.reply(m.chat, '❌ Ocurrió un error inesperado: ' + e, m)
m.react('❌');
}}

handler.help = ['facebook', 'fb']
handler.tags = ['downloader']
handler.command = ['facebook', 'fb']

export default handler