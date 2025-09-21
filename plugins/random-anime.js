import axios from 'axios'
import cheerio from 'cheerio'
import hispamemes from 'hispamemes'
const handler = async (m, {command, conn, usedPrefix}) => {
  const apikey = global.keysxxx
  const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  const name = await conn.getName[who]
  const fgif = m

  if (
    command == 'akira' ||
    command == 'akiyama' ||
    command == 'anna' ||
    command == 'asuna' ||
    command == 'ayuzawa' ||
    command == 'boruto' ||
    command == 'chiho' ||
    command == 'chitoge' ||
    command == 'deidara' ||
    command == 'erza' ||
    command == 'elaina' ||
    command == 'eba' ||
    command == 'emilia' ||
    command == 'hestia' ||
    command == 'hinata' ||
    command == 'inori' ||
    command == 'isuzu' ||
    command == 'itachi' ||
    command == 'itori' ||
    command == 'kaga' ||
    command == 'kagura' ||
    command == 'kaori' ||
    command == 'keneki' ||
    command == 'kotori' ||
    command == 'kurumi' ||
    command == 'madara' ||
    command == 'mikasa' ||
    command == 'miku' ||
    command == 'minato' ||
    command == 'naruto' ||
    command == 'nezuko' ||
    command == 'sagiri' ||
    command == 'sasuke' ||
    command == 'sakura' ||
    command == 'cosplay'
  ) {
    const res = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/anime-${command}.json`)).data
    const haha = await res[Math.floor(res.length * Math.random())]
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
    //conn.sendButton(m.chat, `_${command}_`, botname, haha, [['🔄 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'blackpink') {
    fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/kpop/blackpink.txt')
      .then((res) => res.text())
      .then((body) => {
        const randomkpop = body.split('\n')
        const randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]
        conn.sendFile(m.chat, randomkpopx, 'error.jpg', `_${command}_`, m, null, fake)
        //  conn.sendButton(m.chat, `_${command}_`, botname, randomkpopx, [['🔄 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 🔄', `/${command}`]], null, null, m)
      })
  }

  if (command == 'cristianoronaldo' || command == 'cr7') {
    const cristiano = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/CristianoRonaldo.json`)).data
    const ronaldo = await cristiano[Math.floor(cristiano.length * Math.random())]
    conn.sendFile(m.chat, ronaldo, 'error.jpg', `_*Siiiuuuuuu*_`, m, null, fake)
    //conn.sendButton(m.chat, '*Siiiuuuuuu*', botname, ronaldo, [['🔄 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'cat') {
    const res = await fetch('https://api.thecatapi.com/v1/images/search')
    const img = await res.json()
    conn.sendFile(m.chat, img[0].url, 'error.jpg', `🐱`, m, null, fake)
    // conn.sendButton(m.chat, '🐱', botname, img[0].url, [['🔄 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'itzy' || command == 'kpopitzy') {
    const res = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/itzy.json`)).data
    const loli = await res[Math.floor(res.length * Math.random())]
    conn.sendFile(m.chat, loli, 'error.jpg', `_${command}_`, m, null, fake)
    //conn.sendButton(m.chat, `_${command}_`, botname, mystic, [['🔄 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'kpop') {
    if (args.length == 0)
      return conn.reply(
        m.chat,
        `Usar ${usedPrefix}kpop\nPor favor escribe: ${usedPrefix}kpop [buscar]\nEjemplo:: ${usedPrefix}kpop bts\n\nBusquedas disponibles:\nblackpink, exo, bts`,
        m
      )
    if (args[0] == 'blackpink' || args[0] == 'exo' || args[0] == 'bts') {
      fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/kpop/' + args[0] + '.txt')
        .then((res) => res.text())
        .then((body) => {
          const randomkpop = body.split('\n')
          const randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]
          conn.sendFile(m.chat, randomkpopx, '', 'Dasar Kpopers', m, null, fake)
        })
        .catch(() => {
          conn.reply(m.chat, 'Ocurrio un error, vuelve a intentar, si el fallo continua avisar a mi creador', m)
        })
    } else {
      conn.reply(
        m.chat,
        `Lo sentimos, la busqueda no está disponible. Por favor escribe ${usedPrefix}kpop para ver la lista de busquedas disponibles`,
        m
      )
    }
  }

  if (command == 'loli') {
    const yh = global.loli
    const url = yh[Math.floor(Math.random() * yh.length)]
    conn.sendFile(m.chat, url, 'error.jpg', `💕💕💕💕`, m, null, fake)
    // conn.sendButton(m.chat, `💕💕💕💕`.trim(), wm, url, [['𝙎𝙄𝙂𝙐𝙄𝙀𝙉𝙏𝙀 | 𝙉𝙀𝙓𝙏 🆕', `/${command}`]], null, null, m)
  }

  if (command == 'lolivid' || command == 'lolivideos' || command == 'lolívid') {
    const res = await lolivid[Math.floor(Math.random() * lolivid.length)]
    conn.sendFile(m.chat, res, 'error.jpg', `💕💕💕💕`, m, null, fake)
    //conn.sendButton(m.chat, `*Yo soy tu loli uwu 😍*`, botname, res, [['🔄 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'meme' || command == 'memes') {
    const url = await hispamemes.meme()
    conn.sendFile(m.chat, url, 'error.jpg', `😂🤣🤣`, m, null, fake)
    //conn.sendButton(m.chat, `_🤣 ${command} 🤣_`, botname, url, [['😂 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 😂', `/${command}`]], null, null, m)
  }

  if (command == 'meme2' || command == 'memes2') {
    const meme = hispamemes.meme()
    conn.sendFile(m.chat, meme, 'error.jpg', `😂😆`, m, null, fake)
    //conn.sendButton(m.chat, '😂🤣🤣', botname, meme, [['😂 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 😂', `/${command}`]], null, null, m)
  }

  if (command == 'messi') {
    const res = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/Messi.json`)).data
    const url = await res[Math.floor(res.length * Math.random())]
    conn.sendFile(m.chat, url, 'error.jpg', `*🇦🇷 Messi*`, m, null, fake)
    //conn.sendButton(m.chat, '*🇦🇷 Messi*', botname, url, [['🔄 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 🔄', `/${command}`]], null, null, m)
  }

  /*if (command == 'navidad') {  
 const res = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/navidad.json`)).data;
  const tee = await res[Math.floor(res.length * Math.random())];
conn.sendFile(m.chat, tee, 'error.jpg', `*_Navidad 🧑‍🎄*`, m, null, fake);  
//conn.sendButton(m.chat, '_Navidad 🧑‍🎄_', botname, tee, [['🔄 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 🔄', `/${command}`]], null, null, m)   
}*/

  if (command == 'neko') {
    const ne = await (await fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/anime/neko.txt')).text()
    const nek = ne.split('\n')
    const neko = await nek[Math.floor(Math.random() * nek.length)]
    if (neko == '') throw 'Error'
    conn.sendFile(m.chat, neko, 'error.jpg', `Nyaww~ 🐾💗`, m, null, fake)
    //conn.sendButton(m.chat, '*💖 Nyaww 💖*', botname, neko, [['🔄 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'ppcp' || command == 'ppcouple') {
    const res = await fetch(`https://api.lolhuman.xyz/api/random/ppcouple?apikey=${lolkeysapi}`)
    if (res.status != 200) throw await res.text()
    const json = await res.json()
    if (!json.status) throw json
    conn.sendFile(m.chat, json.result.female, 'error.jpg', `*𝘾𝙃𝙄𝘾𝘼 ✨*`, m, null, fake)
    //conn.sendButton(m.chat, '𝘾𝙃𝙄𝘾𝘼 ✨', wm, json.result.female, [['𝙎𝙄𝙂𝙐𝙄𝙀𝙉𝙏𝙀 | 𝙉𝙀𝙓𝙏 🆕', `/${command}`]], null, null, m)
    conn.sendFile(m.chat, json.result.male, 'error.jpg', `𝘾𝙃𝙄𝘾𝙊 ✨`, m, null, fake)
    //conn.sendButton(m.chat, '𝘾𝙃𝙄𝘾𝙊 ✨', wm, json.result.male, [['𝙎𝙄𝙂𝙐𝙄𝙀𝙉𝙏𝙀 | 𝙉𝙀𝙓𝙏 🆕', `/${command}`]], null, null, m)
  }

  if (command == 'waifu') {
    const res = await fetch('https://api.waifu.pics/sfw/waifu')
    if (!res.ok) throw await res.text()
    const json = await res.json()
    if (!json.url) throw 'Error!'
    conn.sendFile(m.chat, json.url, 'error.jpg', `_*💖 A-ara ara sempai 💖*_`, m, null, fake)
    //conn.sendButton(m.chat, `*💖 A-ara ara sempai 💖*`, botname, json.url, [['🔄 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'wpmontaña') {
    const anu = await wallpaper('mountain')
    const result = anu[Math.floor(Math.random() * anu.length)]
    const haha = result.image[0]
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
  }

  if (command == 'pies') {
    if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `${lenguajeGB['smsContAdult']()}`
    let url = pies[Math.floor(Math.random() * pies.length)]
    conn.sendFile(m.chat, url, 'error.jpg', `🥵 ♥ PIES ♥  🥵`, m, null, fake)
    //conn.sendButton(m.chat, `🥵 ♥ PIES ♥  🥵`, author, url, [['𝙎𝙄𝙂𝙐𝙄𝙀𝙉𝙏𝙀 | 𝙉𝙀𝙓𝙏 🆕', `/${command}`]], null, null, m)
  }

  if (command == 'pubg') {
    const pug = ['pubg', 'playerunknowns battlegrounds', 'pubg mobile']
    const pug2 = pug[Math.floor(Math.random() * pug.length)]
    const anu = await wallpaper(pug2)
    const result = anu[Math.floor(Math.random() * anu.length)]
    const haha = result.image[0]
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
    //conn.sendButton(m.chat, `_${command}_`, botname, haha, [['🔄 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'wpgaming') {
    const ga = ['gaming', 'gamers', 'video game']
    const ga2 = ga[Math.floor(Math.random() * ga.length)]
    const anu = await wallpaper(ga2)
    const result = anu[Math.floor(Math.random() * anu.length)]
    const haha = result.image[0]
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
    //conn.sendButton(m.chat, `_${command}_`, botname, haha, [['🔄 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'wpaesthetic') {
    const anu = await wallpaper('aesthetic')
    const result = anu[Math.floor(Math.random() * anu.length)]
    const haha = result.image[0]
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
    // conn.sendButton(m.chat, `_${command}_`, botname, haha, [['🔄 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'wprandom') {
    const res = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/wprandom.json`)).data
    const res2 = await res[Math.floor(res.length * Math.random())]
    conn.sendFile(m.chat, res2, 'error.jpg', `_${command}_`, m, null, fake)
    //conn.sendButton(m.chat, `_${command}_`, botname, res2, [['🔄 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'coffee') {
    const haha = await conn.getFile(`https://coffee.alexflipnote.dev/random`)
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
    //conn.sendButton(m.chat, `_${command}_`, botname, haha, [['🔄 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'pentol') {
    const anu = await wallpaper('milk y mocha')
    const result = anu[Math.floor(Math.random() * anu.length)]
    const haha = result.image[0]
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
  }

  if (command == 'caricatura') {
    const anu = await wallpaper('cartoon network')
    const result = anu[Math.floor(Math.random() * anu.length)]
    const haha = result.image[0]
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
    //conn.sendButton(m.chat, `_${command}_`, botname, haha, [['🔄 𝐒𝐈𝐆𝐔𝐈𝐄𝐍𝐓𝐄𝙴 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'ciberespacio') {
    const anu = await wallpaper('cyberspace')
    const result = anu[Math.floor(Math.random() * anu.length)]
    const haha = result.image[0]
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
    //conn.sendButton(m.chat, `_${command}_`, botname, haha, [['🔄 𝚂𝙸𝙶𝚄𝙸𝙴𝙽𝚃𝙴 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'technology') {
    const anu = await wallpaper('technology')
    const result = anu[Math.floor(Math.random() * anu.length)]
    const haha = result.image[0]
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
    //conn.sendButton(m.chat, `_${command}_`, botname, haha, [['🔄 𝚂𝙸𝙶𝚄𝙸𝙴𝙽𝚃𝙴 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'doraemon') {
    const anu = await wallpaper('doraemon')
    const result = anu[Math.floor(Math.random() * anu.length)]
    const haha = result.image[0]
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
    // conn.sendButton(m.chat, `_${command}_`, botname, haha, [['🔄 𝚂𝙸𝙶𝚄𝙸𝙴𝙽𝚃𝙴 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'hacker') {
    const anu = await wallpaper('hacker')
    const result = anu[Math.floor(Math.random() * anu.length)]
    const haha = result.image[0]
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
    //conn.sendButton(m.chat, `_${command}_`, botname, haha, [['🔄 𝚂𝙸𝙶𝚄𝙸𝙴𝙽𝚃𝙴 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'planeta') {
    const anu = await wallpaper('planet')
    const result = anu[Math.floor(Math.random() * anu.length)]
    const haha = result.image[0]
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
    //conn.sendButton(m.chat, `_${command}_`, botname, haha, [['🔄 𝚂𝙸𝙶𝚄𝙸𝙴𝙽𝚃𝙴 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'randomprofile') {
    const haha = await conn.getFile(`https://api.zahwazein.xyz/randomimage/profil?apikey=${apikey}`)
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
    //conn.sendButton(m.chat, `_${command}_`, botname, haha, [['🔄 𝚂𝙸𝙶𝚄𝙸𝙴𝙽𝚃𝙴 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'wpaesthetic2') {
    const haha = await conn.getFile(`https://api.zahwazein.xyz/randomimage/aesthetic?apikey=${apikey}`)
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
    //conn.sendButton(m.chat, `_${command}_`, botname, haha, [['🔄 𝚂𝙸𝙶𝚄𝙸𝙴𝙽𝚃𝙴 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'wpvehiculo') {
    const haha = await conn.getFile(`https://api.zahwazein.xyz/randomimage/mobil?apikey=${apikey}`)
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
    // conn.sendButton(m.chat, `_${command}_`, botname, haha, [['🔄 𝚂𝙸𝙶𝚄𝙸𝙴𝙽𝚃𝙴 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'wallhp') {
    const haha = await conn.getFile(`https://api.zahwazein.xyz/randomimage/wallhp?apikey=${apikey}`)
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
    //conn.sendButton(m.chat, `_${command}_`, botname, haha, [['🔄 𝚂𝙸𝙶𝚄𝙸𝙴𝙽𝚃𝙴 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'wpmoto') {
    const haha = await conn.getFile(`https://api.zahwazein.xyz/randomimage/motor?apikey=${apikey}`)
    await conn.reply(m.chat, global.wait, m)
    conn.sendFile(m.chat, haha, 'error.jpg', `_${command}_`, m, null, fake)
    //conn.sendButton(m.chat, `_${command}_`, botname, haha, [['🔄 𝚂𝙸𝙶𝚄𝙸𝙴𝙽𝚃𝙴 🔄', `/${command}`]], null, null, m)
  }

  if (command == 'chica') {
    let pp = 'https://source.unsplash.com/featured/?girl,woman'
    conn.sendFile(m.chat, pp, 'error.jpg', m, null, fake)
    //conn.sendButton(m.chat, wm, null, pp, [['😻 𝙎𝙄𝙂𝙐𝙄𝙀𝙉𝙏𝙀 | 𝙉𝙀𝙓𝙏', `.chica`],['✨ 𝘾𝙃𝙄𝘾𝙊 | 𝘽𝙊𝙔', `.chico`],['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']], null, null, m)
  }

  if (command == 'chico') {
    let pp = 'https://source.unsplash.com/featured/?boy,man'
    conn.sendFile(m.chat, pp, 'error.jpg', m, null, fake)
    //conn.sendButton(m.chat, wm, null, pp, [['😻 𝙎𝙄𝙂𝙐𝙄𝙀𝙉𝙏𝙀 | 𝙉𝙀𝙓𝙏', `.chico`],['✨ 𝘾𝙃𝙄𝘾𝘼 | 𝙂𝙄𝙍𝙇', `.chica`],['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']], null, null, m)
  }

  if (command == 'clima') {
    if (!text)
      return conn.reply(
        m.chat,
        `${mg}𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙋𝘼𝙄𝙎 𝙔 𝘾𝙄𝙐𝘿𝘼𝘿 𝙋𝘼𝙍𝘼 𝙎𝘼𝘽𝙀𝙍 𝙀𝙇 𝘾𝙇𝙄𝙈𝘼\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} Ecuador Quito*\n\n𝙒𝙍𝙄𝙏𝙀 𝙏𝙃𝙀 𝘾𝙊𝙐𝙉𝙏𝙍𝙔 𝘼𝙉𝘿 𝘾𝙄𝙏𝙔 𝙏𝙊 𝙆𝙉𝙊𝙒 𝙏𝙃𝙀 𝙒𝙀𝘼𝙏𝙃𝙀𝙍\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} Francia París*`,
        m
      )
    //const clima = await axios.get(`https://es.wttr.in/${text}?format=Cidade%20=%20%l+\n\nEstado%20=%20%C+%c+\n\nTemperatura%20=%20%t+\n\nUmidade%20=%20%h\n\nVento%20=%20%w\n\nLua agora%20=%20%m\n\nNascer%20do%20Sol%20=%20%S\n\nPor%20do%20Sol%20=%20%s`)

    let pp = `https://image.thum.io/get/width/800/crop/580/https://es.wttr.in/${text}?m`
    //let pp = `https://api.screenshotmachine.com/?key=c04d3a&url=https://es.wttr.in/${text}&screenshotmachine.com&dimension=1000x600`
    conn.sendFile(m.chat, pp, 'error.jpg', `✨ *AQUÍ TIENE EL CLIMA EN ESPAÑOL*`, m, null, fake)
    //conn.sendButton(m.chat, `✨ *AQUÍ TIENE EL CLIMA EN ESPAÑOL*`, wm, pp, [['💜 𝙀𝙣𝙜𝙡𝙞𝙨𝙝 𝙫𝙚𝙧𝙨𝙞𝙤𝙣', `.clima2 ${text}`],['💚 𝙑𝙚𝙧𝙨ã𝙤 𝙚𝙢 𝙋𝙤𝙧𝙩𝙪𝙜𝙪ê𝙨', `.clima3 ${text}`],['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']], [['𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', md]], m)
  }

  if (command == 'clima2') {
    if (!text)
      return conn.reply(
        m.chat,
        `${mg}𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙋𝘼𝙄𝙎 𝙔 𝘾𝙄𝙐𝘿𝘼𝘿 𝙋𝘼𝙍𝘼 𝙎𝘼𝘽𝙀𝙍 𝙀𝙇 𝘾𝙇𝙄𝙈𝘼\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} Ecuador Quito*\n\n𝙒𝙍𝙄𝙏𝙀 𝙏𝙃𝙀 𝘾𝙊𝙐𝙉𝙏𝙍𝙔 𝘼𝙉𝘿 𝘾𝙄𝙏𝙔 𝙏𝙊 𝙆𝙉𝙊𝙒 𝙏𝙃𝙀 𝙒𝙀𝘼𝙏𝙃𝙀𝙍\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} Francia París*`,
        m
      )
    let pp = `https://image.thum.io/get/width/800/crop/580/https://en.wttr.in/${text}?m`
    //let pp = `https://api.screenshotmachine.com/?key=c04d3a&url=https://en.wttr.in/${text}&screenshotmachine.com&dimension=1000x600`
    conn.sendFile(m.chat, pp, 'error.jpg', `✨ *HERE IS THE WEATHER IN ENGLISH*`, m, null, fake)
    //conn.sendButton(m.chat, `✨ *HERE IS THE WEATHER IN ENGLISH*`, wm, pp, [['💙 𝙑𝙚𝙧𝙨𝙞𝙤𝙣 𝙀𝙨𝙥𝙖𝙣𝙤𝙡', `.clima ${text}`],['💚 𝙑𝙚𝙧𝙨ã𝙤 𝙚𝙢 𝙋𝙤𝙧𝙩𝙪𝙜𝙪ê𝙨', `.clima3 ${text}`],['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']], [['𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', md]], m)
  }

  if (command == 'clima3') {
    if (!text)
      return conn.reply(
        m.chat,
        `${mg}𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙋𝘼𝙄𝙎 𝙔 𝘾𝙄𝙐𝘿𝘼𝘿 𝙋𝘼𝙍𝘼 𝙎𝘼𝘽𝙀𝙍 𝙀𝙇 𝘾𝙇𝙄𝙈𝘼\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n*${usedPrefix + command} Ecuador Quito*\n\n𝙒𝙍𝙄𝙏𝙀 𝙏𝙃𝙀 𝘾𝙊𝙐𝙉𝙏𝙍𝙔 𝘼𝙉𝘿 𝘾𝙄𝙏𝙔 𝙏𝙊 𝙆𝙉𝙊𝙒 𝙏𝙃𝙀 𝙒𝙀𝘼𝙏𝙃𝙀𝙍\n𝙀𝙓𝘼𝙈𝙋𝙇𝙀\n*${usedPrefix + command} Francia París*`,
        m
      )

    let pp = `https://image.thum.io/get/width/800/crop/580/https://pt.wttr.in/${text}?m`
    //let pp = `https://api.screenshotmachine.com/?key=c04d3a&url=https://pt.wttr.in/${text}&screenshotmachine.com&dimension=1000x600`
    conn.sendFile(m.chat, pp, 'error.jpg', `✨ *AQUI ESTÁ O TEMPO EM PORTUGUÊS*`, m, null, fake)
    //conn.sendButton(m.chat, `✨ *AQUI ESTÁ O TEMPO EM PORTUGUÊS*`, wm, pp, [['💙 𝙑𝙚𝙧𝙨𝙞𝙤𝙣 𝙀𝙨𝙥𝙖𝙣𝙤𝙡', `.clima ${text}`],['💜 𝙀𝙣𝙜𝙡𝙞𝙨𝙝 𝙫𝙚𝙧𝙨𝙞𝙤𝙣', `.clima2 ${text}`],  ['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']], [['𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', md]], m)
  }
}
handler.command = handler.help = [
  'akira',
  'akiyama',
  'anna',
  'asuna',
  'ayuzawa',
  'boruto',
  'chiho',
  'chitoge',
  'deidara',
  'erza',
  'elaina',
  'eba',
  'emilia',
  'hestia',
  'hinata',
  'inori',
  'isuzu',
  'itachi',
  'itori',
  'kaga',
  'kagura',
  'kaori',
  'keneki',
  'kotori',
  'kurumi',
  'madara',
  'mikasa',
  'miku',
  'minato',
  'naruto',
  'nezuko',
  'sagiri',
  'sasuke',
  'sakura',
  'cosplay',
  'blackpink',
  'cristianoronaldo',
  'cr7',
  'cat',
  'itzy',
  'kpopitzy',
  'kpop',
  'loli',
  'lolivid',
  'lolivideos',
  'lolívid',
  'meme',
  'memes',
  'meme2',
  'memes2',
  'messi',
  'neko',
  'ppcp',
  'ppcouple',
  'waifu',
  'wpmontaña',
  'pubg',
  'wpgaming',
  'wpaesthetic',
  'wprandom',
  'coffee',
  'pentol',
  'caricatura',
  'ciberespacio',
  'technology',
  'doraemon',
  'hacker',
  'planeta',
  'randomprofile',
  'wpaesthetic2',
  'wpvehiculo',
  'wallhp',
  'wpmoto',
  'pies',
  'chica',
  'chico',
  'clima',
  'clima2',
  'clima3'
]
handler.tags = ['randow']
handler.register = true
handler.limit = 1
export default handler

global.loli = [
  'https://i.pinimg.com/736x/cf/7d/74/cf7d741fecb5e2c6abe1b9b237b30b04.jpg',
  'https://i.pinimg.com/736x/b5/b2/62/b5b2620e392e74139487c209c3b03dc2.jpg',
  'https://i.pinimg.com/736x/b6/b4/0b/b6b40b6ae0e0123adc040d16d4b05348.jpg',
  'https://i.pinimg.com/originals/e3/30/66/e33066f3cdbddd7ba3e37d2d576e8b66.jpg',
  'https://i.pinimg.com/474x/7a/72/eb/7a72ebd743f1aa0df55965e6856d02c6.jpg',
  'https://i.pinimg.com/originals/9b/2d/65/9b2d652e8f9742d6e6767a5eb3424df6.png',
  'https://i.pinimg.com/originals/ee/c1/d8/eec1d883e44ef0a61d11fc6fe3c6d827.jpg',
  'https://i.pinimg.com/736x/d0/2f/49/d02f4926e0f7b32685fcce4203752532.jpg',
  'https://i.pinimg.com/564x/b4/3d/64/b43d641d0a624008996a01bf64f411d1.jpg',
  'https://i.pinimg.com/236x/a4/ad/52/a4ad52b80ea5538d0cc743c95ecca40f.jpg',
  'https://i.pinimg.com/originals/de/d4/61/ded461956b110d610f1190dcae5cd59f.jpg',
  'https://i.pinimg.com/564x/8e/5c/f0/8e5cf0a7026d0a8b2e94693d5bcf9321.jpg',
  'https://i.pinimg.com/originals/b5/02/bc/b502bc59d17ae464560202d1e000a11a.jpg',
  'https://i.pinimg.com/originals/49/6e/4b/496e4b7de7edaa6e03c45250f4f516fc.jpg',
  'https://i.pinimg.com/originals/4e/dd/43/4edd430da39fb3f969865fb377878879.jpg',
  'https://i.pinimg.com/originals/82/8c/5c/828c5c9543010265c82cb3e9a7e22539.jpg',
  'https://i.pinimg.com/236x/2d/87/0f/2d870ffe100b76810577f90fe8f4c121.jpg',
  'https://i.pinimg.com/564x/c7/9c/69/c79c6998a87196995b8370bc45344ffd.jpg',
  'https://i.pinimg.com/474x/ca/5f/70/ca5f708da44d1e5b74d604f91d2940b9.jpg',
  'https://i.pinimg.com/originals/3c/4f/fb/3c4ffbb99fda42f0cb0bd8a5a8407298.jpg',
  'https://i.pinimg.com/originals/c6/73/13/c67313758a2eda2cb063c419b20c4065.jpg',
  'https://i.pinimg.com/736x/37/74/13/3774139f776a42d59d28f56a783fa3dc.jpg',
  'https://i.pinimg.com/736x/b6/1e/2d/b61e2d7cdd166b63c0e0f29a90ccdca2.jpg',
  'https://i.pinimg.com/736x/c9/14/e6/c914e6d3e52c218348a2e0b9581a5d9a.jpg',
  'https://i.pinimg.com/originals/7d/cd/4e/7dcd4eedebe7da3d4e9567ede11439e8.jpg',
  'https://i.pinimg.com/736x/30/3a/db/303adb62a2e5fe179f698ff992520420.jpg',
  'https://i.pinimg.com/736x/db/86/c6/db86c635ac3ae10373ff460eea4ec7fe.jpg',
  'https://i.pinimg.com/564x/aa/d0/89/aad089b60695808ef7f3d86550907410.jpg',
  'https://i.pinimg.com/736x/d9/fb/a8/d9fba8e7ae331cbe83bd0dbb8697e15f.jpg',
  'https://i.pinimg.com/originals/05/58/b4/0558b44e6fb2afaaa22db18adcbc5f30.jpg',
  'https://i.pinimg.com/736x/97/5c/dd/975cdd87fe34a5832f07b8e17d5edd1d.jpg',
  'https://i.pinimg.com/originals/f0/46/e0/f046e0147179103d0d6c42bb0a77e8e6.png',
  'https://i.pinimg.com/originals/9a/76/8b/9a768b08d31d07e30db78ee24be8ea62.jpg',
  'https://i.pinimg.com/originals/42/ca/20/42ca20ce567b97ac89eec4e7ed79f1e1.png',
  'https://i.pinimg.com/236x/37/a7/33/37a7333ff01f4691a23fbaee1abffb58.jpg',
  'https://i.pinimg.com/736x/06/4a/7f/064a7ff14a04fd8bb624e075568213ba.jpg',
  'https://i.pinimg.com/originals/7c/a0/66/7ca0669c73078cad874e27e7e20e2d14.jpg',
  'https://i.pinimg.com/originals/6f/1b/3f/6f1b3fa3dcde574df7836d2e8a295a9f.jpg',
  'https://i.pinimg.com/originals/bd/43/d1/bd43d1beba3c9888707ca91d0ac8ed85.png',
  'https://i.pinimg.com/474x/62/65/a3/6265a32d6e32fcfd0231e1a1ada10016.jpg',
  'https://i.pinimg.com/originals/67/e0/87/67e0879eac574ea3290ecbde629adb37.jpg',
  'https://i.pinimg.com/originals/a5/bb/d5/a5bbd57f5b1b884f27aff0890de43216.jpg',
  'https://i.pinimg.com/564x/9a/36/94/9a3694a6bd14e2294706b619b7879d41.jpg',
  'https://i.pinimg.com/736x/f6/71/7d/f6717d0dffda72a01a51b8d437e05eba.jpg',
  'https://i.pinimg.com/originals/9f/4c/50/9f4c508e6ff5f7a6f790980239a18497.png',
  'https://i.pinimg.com/originals/1e/25/7f/1e257fd78c54bf3de6129d8ad38d39b6.png',
  'https://i.pinimg.com/originals/13/c5/77/13c57739ad0cdc60fc8ff065f00ee9aa.png',
  'https://i.pinimg.com/originals/c9/5e/03/c95e038b17d47a05289b1e951817fd04.jpg',
  'https://i.pinimg.com/originals/82/e3/59/82e359ea27b9acf90359f6a2234af06d.jpg',
  'https://i.pinimg.com/originals/8d/71/9d/8d719d260e8bb1ef1ac8c2db6f9ca301.jpg',
  'https://i.pinimg.com/736x/72/f4/eb/72f4eb5b28e89035c10007125d67e7c3.jpg',
  'https://i.pinimg.com/originals/b4/fe/35/b4fe35474c76728474d2ef6d92493a7e.jpg',
  'https://i.pinimg.com/originals/b3/1b/50/b31b50676592389319594e04ab1cc54a.jpg',
  'https://i.pinimg.com/originals/41/72/a3/4172a3f2212bd8fb33b12a39e1e5bcde.jpg',
  'https://i.pinimg.com/originals/15/53/e3/1553e31681b77be72dd4dfe34e7ef5ff.jpg',
  'https://i.pinimg.com/originals/4a/c6/64/4ac66497c0ef2ad7788be3042e45a418.jpg',
  'https://i.pinimg.com/originals/ab/ff/e7/abffe7475bab7d1a91d2f45742f7753b.jpg',
  'https://i.pinimg.com/474x/12/30/23/123023de1c90d7391356aa291226b3df.jpg',
  'https://i.pinimg.com/originals/a3/eb/51/a3eb51e91236feeb47b6a192bc501edc.jpg',
  'https://i.pinimg.com/originals/f0/7a/3e/f07a3e338ad35cad89254f81f430793a.jpg',
  'https://i.pinimg.com/originals/52/c9/d1/52c9d1662b9980ea5828c15c6f2f40bc.jpg',
  'https://i.pinimg.com/originals/e6/35/f0/e635f0a968870cfa1f61fe7c54294ebe.jpg',
  'https://i.pinimg.com/originals/e1/58/5b/e1585bda44f7c2f53651188438883eca.jpg',
  'https://i.pinimg.com/736x/07/1e/93/071e93d9e922000826e5b97c0125f3f3.jpg',
  'https://i.pinimg.com/originals/75/a6/6a/75a66aa75bbbc5943de0982b28ce3a7d.png',
  'https://i.pinimg.com/originals/81/c2/68/81c268fe66221cf4262b8596acce22bd.jpg',
  'https://i.pinimg.com/originals/b9/f8/8c/b9f88c6b29df1bb69704164f9a1f71f0.jpg',
  'https://i.pinimg.com/736x/bb/e4/9b/bbe49bc932cb327ebf32a4f09099a3f5.jpg',
  'https://i.pinimg.com/originals/82/3d/c5/823dc5924e67e90e2c18f9388667f83d.jpg',
  'https://i.pinimg.com/236x/75/d6/f4/75d6f4c8773e43d190597ce4fba88d08.jpg',
  'https://i.pinimg.com/236x/ef/46/6b/ef466bdbb29a3b441afeb795f2e54c9a.jpg',
  'https://i.pinimg.com/564x/8e/44/88/8e448838113866ee507bf57d4ebebedd.jpg',
  'https://i.pinimg.com/originals/1f/f8/d7/1ff8d799952c720cb7e78aa058ac41f7.jpg',
  'https://i.pinimg.com/originals/83/de/b7/83deb7d5108736a3703a21fbb574daa6.jpg',
  'https://i.pinimg.com/originals/6a/ae/04/6aae043bd88448a6302ae0322053faee.jpg',
  'https://i.pinimg.com/originals/4e/0b/62/4e0b62b3d42e3f2b4b021ebc60b12023.jpg',
  'https://i.pinimg.com/originals/e3/55/3c/e3553cde950d823a5862b301df9adc29.png',
  'https://i.pinimg.com/originals/53/a2/79/53a279fb4a12b715beee319a0c1343d6.png',
  'https://i.pinimg.com/originals/4a/3d/01/4a3d0165a5d1a1ef2577a09057377184.jpg',
  'https://i.pinimg.com/originals/df/aa/2c/dfaa2cb28ab4353732a2dfe2c20932eb.jpg',
  'https://i.pinimg.com/564x/2e/3a/6c/2e3a6cd9e819e888d38cf70d0a117dbf.jpg',
  'https://i.pinimg.com/originals/c4/32/7d/c4327df2c6d37f8426d93d352c48bd99.png',
  'https://i.pinimg.com/originals/54/35/d6/5435d61e1811e8ae1f364095c3eb32ad.jpg',
  'https://i.pinimg.com/736x/42/2d/05/422d05e07268257dbf0602f8417a16a1.jpg',
  'https://i.pinimg.com/236x/f3/05/ce/f305ce7aa1e8622cb6634dea461a278a.jpg',
  'https://i.pinimg.com/originals/e3/49/94/e34994b4aeec15a025cf95b622e286f8.png',
  'https://i.pinimg.com/originals/30/1d/27/301d27cd014867f80c851877fa3a8bcc.jpg',
  'https://i.pinimg.com/originals/cf/bb/4a/cfbb4a669cadaab18b19f5522722f3cb.jpg',
  'https://i.pinimg.com/originals/cb/b2/0b/cbb20bf3a92499982daa0d1059d17790.jpg',
  'https://i.pinimg.com/474x/fe/aa/22/feaa22b7f776fc988fb4ccbf2c539549.jpg',
  'https://i.pinimg.com/originals/c9/ea/f7/c9eaf78967ed514f730e6d161b9ee1f9.png',
  'https://i.pinimg.com/736x/26/ba/79/26ba79102b971a2da11349d7fd84fdc1.jpg',
  'https://i.pinimg.com/736x/72/2c/9b/722c9bb59f65d1d3148f1b751c8ca7d5.jpg',
  'https://i.pinimg.com/736x/6c/f3/04/6cf3041ebf6a8f7e4836c98837ea9609.jpg',
  'https://i.pinimg.com/736x/86/80/77/8680778b298641c65d81dd0d1c0ee280.jpg',
  'https://i.pinimg.com/originals/25/24/22/2524225fc756bc17f98f26d50ef342fa.jpg',
  'https://i.pinimg.com/280x280_RS/dc/6e/53/dc6e53b48dd3de659bd43257056147a6.jpg',
  'https://i.pinimg.com/736x/73/e0/fb/73e0fb7a2f1ab8a7216f076da3574d0f.jpg',
  'https://i.pinimg.com/originals/d7/a4/ac/d7a4ac159dfac1fa0ac5b0d9114a025a.jpg',
  'https://i.pinimg.com/originals/cd/ef/fc/cdeffc0bf155fe2c8c63561b437c6864.jpg'
]

global.lolivid = [
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli1.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli2.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli3.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli4.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli5.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli6.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli7.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli8.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli9.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli10.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli11.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli12.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli13.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli14.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli15.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli16.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli17.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli18.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli19.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli20.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli21.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli22.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli23.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli24.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli25.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli26.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli27.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli28.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli29.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli30.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli31.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli32.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli33.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli34.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli35.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli36.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli37.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli38.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli39.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli40.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli41.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli42.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli43.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli44.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli45.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli46.mp4',
  'https://raw.githubusercontent.com/NurFy/txt/main/asupan-loli/loli47.mp4'
]

async function wallpaper(title, page = '1') {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`).then(({data}) => {
      const $ = cheerio.load(data)
      const hasil = []
      $('div.grid-item').each(function (a, b) {
        hasil.push({
          title: $(b).find('div.info > a > h3').text(),
          type: $(b).find('div.info > a:nth-child(2)').text(),
          source: 'https://www.besthdwallpaper.com/' + $(b).find('div > a:nth-child(3)').attr('href'),
          image: [
            $(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'),
            $(b).find('picture > source:nth-child(1)').attr('srcset'),
            $(b).find('picture > source:nth-child(2)').attr('srcset')
          ]
        })
      })
      resolve(hasil)
    })
  })
}
