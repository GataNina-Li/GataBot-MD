import { igdl } from 'ruhend-scraper'

const handler = async (m, { text, conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `${lenguajeGB['smsAvisoAG']()}🐈 𝗘𝗻𝘃𝗶́𝗮 𝗲𝗹 𝗹𝗶𝗻𝗸 𝗱𝗲𝗹 𝘃𝗶𝗱𝗲𝗼 𝗱𝗲 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸.`, m)
  }

  let res;
  try {
    await m.react('⏱️')
    res = await igdl(args[0]);
  } catch (e) {
    return conn.reply(m.chat, `${lenguajeGB['smsAvisoFG']()}⚠️ 𝗘𝗹 𝗲𝗻𝗹𝗮𝗰𝗲 𝗻𝗼 𝗲𝘀 𝘃𝗮́𝗹𝗶𝗱𝗼, 𝘃𝗲𝗿𝗶𝗳𝗶𝗾𝘂𝗲 𝘀𝗶 𝗲𝘀 𝘂𝗻 𝗲𝗻𝗹𝗮𝗰𝗲 𝗱𝗲 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸.`, m)
    await m.react('❎️')
  }

  let result = res.data;
  if (!result || result.length === 0) {
    return conn.reply(m.chat, `${lenguajeGB['smsAvisoFG']()}⚠️ 𝗡𝗼 𝘀𝗲 𝗲𝗻𝗰𝗼𝗻𝘁𝗿𝗮𝗿𝗼𝗻 𝗿𝗲𝘀𝘂𝗹𝘁𝗮𝗱𝗼𝘀 𝗱𝗲𝗹 𝘃𝗶𝗱𝗲𝗼.`, m)
    await m.react('❎️')
  }

  let data;
  try {
    data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
  } catch (e) {
    return conn.reply(m.chat, `${lenguajeGB['smsAvisoFG']()}⚠️ 𝗗𝗮𝘁𝗼𝘀 𝗻𝗼 𝗲𝗻𝗰𝗼𝗻𝘁𝗿𝗮𝗱𝗼𝘀.`, m)
    await m.react('❎️')
  }

  if (!data) {
    return conn.reply(m.chat, `${lenguajeGB['smsAvisoFG']()}⚠️ 𝗡𝗼 𝘀𝗲 𝗲𝗻𝗰𝗼𝗻𝘁𝗿𝗼́ 𝗿𝗲𝘀𝘂𝗹𝘁𝗮𝗱𝗼𝘀 𝗱𝗲𝗹 𝘃𝗶𝗱𝗲𝗼.`, m)
    await m.react('❎️')
  }

  let video = data.url;
  try {
    await conn.sendMessage(m.chat, { video: { url: video }, caption: `${lenguajeGB['smsAvisoEG']()}🏖 𝘼𝙦𝙪𝙞́ 𝙩𝙞𝙚𝙣𝙚𝙨 𝙩𝙪 𝙫𝙞𝙙𝙚𝙤 𝙙𝙚 𝙁𝙖𝙘𝙚𝙗𝙤𝙤𝙠.\n${wm}`, fileName: 'fb.mp4', mimetype: 'video/mp4' }, { quoted: m })
    await m.react('✅️')
  } catch (e) {
    return conn.reply(m.chat, `${lenguajeGB['smsAvisoFG']()}❎️ 𝗢𝗰𝘂𝗿𝗿𝗶𝗼́ 𝘂𝗻 𝗲𝗿𝗿𝗼𝗿 𝗮𝗹 𝗱𝗲𝘀𝗰𝗮𝗿𝗴𝗮𝗿 𝗲𝗹 𝘃𝗶𝗱𝗲𝗼.`, m)
    await m.react('❎️')
  }
}

handler.help = ['facebook', 'fb']
handler.tags = ['descargas']
handler.command = ['facebook', 'fb']
handler.register = true
handler.limit = true

export default handler