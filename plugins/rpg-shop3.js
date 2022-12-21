/*const diamantetk = 15
let handler = async (m, { conn, command, args, usedPrefix }) => {
  let count = command.replace(/^buy3|token|tokens/i, '')
  count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].limit / diamantetk) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
  count = Math.max(1, count)
  if (global.db.data.users[m.sender].limit >= diamantetk * count) {
    global.db.data.users[m.sender].limit -= diamantetk * count
    global.db.data.users[m.sender].joincount += count
    //conn.reply(m.chat, `
    let gata = `
╭━━〔 *DATOS DE COMPRA* 〕━━⬣
┃ *Compra Efectuada* : +${count} 𝙏𝙊𝙆𝙀𝙉(𝙎) 🪙 
┃ *Ha Gastado* :  -${diamantetk * count} 𝘿𝙄𝘼𝙈𝘼𝙉𝙏𝙀𝙎 💎
╰━━━━━〔 *𓃠 ${vs}* 〕━━━━⬣`.trim()
    
await conn.sendHydrated(m.chat, gata, wm, null, md, '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', null, null, [
['💎 𝘾𝙤𝙢𝙥𝙧𝙖𝙧 𝙓50', '.buy3 50'],
['💎 𝘾𝙤𝙢𝙥𝙧𝙖𝙧 𝙓100', '.buy3 100'],
['💎 𝘾𝙤𝙢𝙥𝙧𝙖 𝘼𝙗𝙨𝙤𝙡𝙪𝙩𝙖', '/buyall3']
], m,)
    
  } else //conn.reply(m.chat, `❎ Lo siento, no tienes suficientes *XP* para comprar *${count}* Diamantes💎`, m)
    await conn.sendHydrated(m.chat, `*No tiene sufuciente 𝘿𝙄𝘼𝙈𝘼𝙉𝙏𝙀𝙎 💎 para comprar ${count} 𝙏𝙊𝙆𝙀𝙉(𝙎)* 🪙\n\n*Le recomiendo que interactúe con GataBot-MD para Obtener Tokens, puede ver sus tokens con el comando ${usedPrefix}cartera o ${usedPrefix}wallet*`, wm, null, ig, '𝙄𝙣𝙨𝙩𝙖𝙜𝙧𝙖𝙢', null, null, [
['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu'],
], m,)
}
handler.help = ['Buy', 'Buyall']
handler.tags = ['xp']
handler.command = ['buy3', 'buyall3', 'token', 'tokens'] 

handler.disabled = false

export default handler*/
