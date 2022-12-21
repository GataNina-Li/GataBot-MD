/*const xpperlimit = 300
let handler = async (m, { conn, command, args, usedPrefix }) => {
  let count = command.replace(/^buyy/i, '')
  count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].exp / xpperlimit) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
  count = Math.max(1, count)
  if (global.db.data.users[m.sender].exp >= xpperlimit * count) {
    global.db.data.users[m.sender].exp -= xpperlimit * count
    global.db.data.users[m.sender].limit += count
    //conn.reply(m.chat, `
    let gata = `
╭━━〔 *DATOS DE COMPRA* 〕━━⬣
┃ *Compra Efectuada* : +${count} 💎 
┃ *Ha Gastado* :  -${xpperlimit * count} 𝙓𝙋
╰━━━━━〔 *𓃠 ${vs}* 〕━━━━⬣`.trim()
    
await conn.sendHydrated(m.chat, gata, wm, null, md, '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', null, null, [
['💵 𝘾𝙤𝙢𝙥𝙧𝙖𝙧 𝙓10', '.buy 10'],
['💸 𝘾𝙤𝙢𝙥𝙧𝙖𝙧 𝙓20', '.buy 20'],
['🐈 𝘾𝙤𝙢𝙥𝙧𝙖𝙧 𝙘𝙤𝙣 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨', '/buy2']
], m,)
    
  } else //conn.reply(m.chat, `❎ Lo siento, no tienes suficientes *XP* para comprar *${count}* Diamantes💎`, m)
  await conn.sendHydrated(m.chat, `*No tiene sufuciente 𝙓𝙋 para comprar ${count} Diamantes* 💎\n\n*Le recomiendo que interactúe con GataBot-MD para Obtener experiencia, puede ver su experiencia con el comando ${usedPrefix}exp o ${usedPrefix}experiencia. También puede comprar con GataCoins con el Comando ${usedPrefix}buy2*`, wm, null, ig, '𝙄𝙣𝙨𝙩𝙖𝙜𝙧𝙖𝙢', null, null, [
['🐈 𝘾𝙤𝙢𝙥𝙧𝙖𝙧 𝙘𝙤𝙣 𝙂𝙖𝙩𝙖𝘾𝙤𝙞𝙣𝙨', '/buy2'],
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']
], m,)
}
handler.help = ['Buy', 'Buyall']
handler.tags = ['xp']
handler.command = ['buyy', 'buyyall'] 

handler.disabled = false

export default handler*/
