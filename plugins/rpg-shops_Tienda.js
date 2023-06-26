const xpperlimit = 300
import fetch from 'node-fetch'
let handler = async (m, { command, conn, usedPrefix, args }) => {
let user = global.db.data.users[m.sender]
let time = user.lastmiming + 150000 //5 min
if (new Date - user.lastmiming < 150000) return await conn.reply(m.chat, `⏱️ 𝙑𝙪𝙚𝙡𝙫𝙖 𝙚𝙣 ${msToTime(time - new Date())} 𝙉𝙊 𝙃𝘼𝙂𝘼 𝙎𝙋𝘼𝙈`, m)
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" 
}
let grupos = [nna, nn, nnn, nnnt]
let gata = [img5, img6, img7, img8, img9]
let enlace = { contextInfo: { externalAdReply: {title: wm + ' 🐈', body: 'support group' , sourceUrl: grupos.getRandom(), thumbnail: await(await fetch(gata.getRandom())).buffer() }}}
let enlace2 = { contextInfo: { externalAdReply: { showAdAttribution: true, mediaUrl: yt, mediaType: 'VIDEO', description: '', title: wm, body: '😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 ', thumbnailUrl: await(await fetch(global.img)).buffer(), sourceUrl: yt }}}
let dos = [enlace, enlace2]

const items = {
   buy: {
        exp: { eleksirb: 3 },
        limit: { money: 400 },
        diamond: { berlian: 5 },
        joincount: { limit: 15 },
        emerald: { emasbatang: 5 },
        berlian: { kyubi: 25 },
        kyubi: { trash: 15 },  
        gold: {  diamond: 35 },
        money: { kaleng: 2 },
        tiketcoin: { joincount: 3 },
        stamina: { potion: 2 },
        
        potion: { money: 550 },
        aqua: { botol: 2 },
        trash: { eleksirb: 5 },
        wood: { string: 5 },
        rock: { kardus: 6 },
        batu: { coal: 25 },
        string: { kaleng: 4 },
        iron: { kyubi: 20 },
        coal: { trash: 20 },
        botol: { wood: 4 },
        kaleng: { potion: 2 },
        kardus: { trash: 20 },
        
        eleksirb: { healtmonster: 2},
        emasbatang: { kayu: 30},
        emasbiasa: { diamond: 18 },
        rubah: { berlian: 40 },
        sampah: { trash: 70 },
        serigala: { kaleng: 125 },
        kayu: { wood: 40 },
        sword: { gold: 2 },
        umpan: { aqua: 2 },
        healtmonster: { kyubi: 19 },
        pancingan: { trash: user.pancingan == 0 ? 5 : '' || user.pancingan == 1 ? 10 : '' || user.pancingan == 2 ? 15 : '' || user.pancingan == 3 ? 20 : '' || user.pancingan >= 4 ? 25 : '' },
        emas: { berlian: 20 },
        pancing: { tiketcoin: user.pancing == 0 ? 1 : '' || user.pancing == 1 ? 2 : '' || user.pancing == 2 ? 3 : '' || user.pancing == 3 ? 4 : '' || user.pancing >= 4 ? 7 : '' },
        
        common: { aqua: 40 },
        uncoommon: { kyubi: 55 },
        mythic: { tiketcoin: 17 },
        pet: { kayu: 45 },
        gardenboxs: { healtmonster: 25 },
        legendary: { emerald: 75 },
        
        anggur: { emerald: 3 },
        apel: { emerald: 3 },
        jeruk: { emerald: 3 },
        mangga: { emerald: 3 },
        pisang: { emerald: 3 },
        
        bibitanggur: { aqua: 15 },
        bibitapel: { aqua: 15 },
        bibitjeruk: { aqua: 15 },
        bibitmangga: { aqua: 15 },
        bibitpisang: { aqua: 15 },
        
        centaur: { limit:45 },
        griffin: { limit: 55 },
        kucing: { limit: 70 },
        naga: { limit: 85 },
        fox: { limit: 100 },
        kuda: { limit: 125 },
        phonix: { limit: 140 },
        wolf: { limit: 155 },
        
        petFood: { tiketcoin: 4 },
        makanancentaur: { tiketcoin: 6 },
        makanangriffin: { tiketcoin: 8 },
        makanankyubi: { tiketcoin: 10 },
        makanannaga: { tiketcoin: 12 },
        makananpet: { tiketcoin: 14 },
        makananphonix: { tiketcoin: 16 }
    },
   
    sell: {
        exp: { trash: pickRandom([1, 1, 2]) },
        limit: { eleksirb: pickRandom([1, 4, 1]) },
        diamond: { tiketcoin: pickRandom([1, 1, 2]) },
        joincount: { emasbatang: pickRandom([1, 1, 2]) },
        emerald: { money: pickRandom([10, 500, 1]) },
        berlian: { sword: pickRandom([1, 1, 2]) },
        kyubi: { aqua: pickRandom([1, 1, 2]) },
        gold: { exp: pickRandom([1, 20, 800]) },
        money: { aqua: pickRandom([1, 1, 2]) },
        tiketcoin: { kyubi: pickRandom([1, 1, 2]) },
        
        potion: { botol: pickRandom([1, 1, 3]) },
        aqua: { kaleng: pickRandom([1, 1, 2]) },
        trash: { umpan: pickRandom([1, 1, 2]) },
        wood: { coal: pickRandom([1, 1, 2]) },
        rock: { string: pickRandom([1, 1, 2]) },
        batu: { joincount: pickRandom([1, 1, 2]) },
        string: { kardus: pickRandom([1, 1, 2]) },
        iron: { healtmonster: pickRandom([1, 1, 3]) },
        coal: { money: pickRandom([1, 3, 30]) },
        botol: { aqua: pickRandom([1, 1, 2]) },
        kaleng: { batu: pickRandom([1, 1, 2]) },
        kardus: { pancingan: pickRandom([1, 1, 2]) },
        
        eleksirb: { rubah: pickRandom([1, 1, 2]) },
        emasbatang: { emasbiasa: pickRandom([1, 1, 3]) },
        emasbiasa: { potion: pickRandom([1, 1, 2]) },
        rubah: { petFood: pickRandom([1, 1, 4]) },
        sampah: { trash: pickRandom([1, 2, 20]) },
        serigala: { petFood: pickRandom([1, 2, 22]) },
        kayu: { wood: pickRandom([1, 3, 5]) },
        sword: { berlian: pickRandom([1, 1, 2]) },
        umpan: { exp: pickRandom([1, 5, 40, 0]) },
        healtmonster: { diamond: pickRandom([1, 1, 2]) },
        pancingan: { money: pickRandom([1, 10, 30]) },
        emas: { berlian: pickRandom([1, 1, 3]) },
        
        common: { limit: pickRandom([1, 3, 10]) },
        uncoommon: { diamond: pickRandom([1, 4, 15]) },
        mythic: { berlian: pickRandom([1, 3, 13]) },
        pet: { money: pickRandom([1, 500, 1500]) },
        gardenboxs: { gold: pickRandom([1, 1, 3]) },
        legendary: { emerald: pickRandom([1, 4, 20]) },
        
        anggur: { joincount: pickRandom([1, 1, 2]) },
        apel: { tiketcoin: pickRandom([1, 1, 2]) },
        jeruk: { berlian: pickRandom([1, 1, 2]) },
        mangga: { gold: pickRandom([1, 1, 2]) },
        pisang: { diamond: pickRandom([1, 1, 2]) },
        
        bibitanggur: { potion: pickRandom([1, 1, 2]) },
        bibitapel: { umpan: pickRandom([1, 1, 3]) },
        bibitjeruk: { healtmonster: pickRandom([1, 1, 2]) },
        bibitmangga: { pancingan: pickRandom([1, 1, 3]) },
        bibitpisang: { wood: pickRandom([1, 2, 4]) },
        
        centaur: { anggur: pickRandom([1, 3, 5]) },
        griffin: { apel: pickRandom([1, 2, 4]) },
        kucing: { jeruk: pickRandom([1, 3, 6]) },
        naga: { mangga: pickRandom([1, 4, 8]) },
        fox: { pisang: pickRandom([1, 5, 9]) },
        kuda: { anggur: pickRandom([1, 6, 10]) },
        phonix: { apel: pickRandom([1, 7, 12]) },
        wolf: { jeruk: pickRandom([1, 8, 15]) },
        
        petFood: { money: pickRandom([1, 400, 1400]) },
        makanancentaur: { diamond: pickRandom([1, 1, 2]) },
        makanangriffin: { diamond: pickRandom([1, 1, 3]) },
        makanankyubi: { diamond: pickRandom([1, 2, 4]) },
        makanannaga: { diamond: pickRandom([1, 2, 4]) },
        makananpet: { diamond: pickRandom([1, 3, 5]) },
        makananphonix: { diamond: pickRandom([1, 3, 5]) },
    }
}   
   
let imgr = flaaa.getRandom()
    const listItems = Object.fromEntries(Object.entries(items[command.toLowerCase()]).filter(([v]) => v && v in user))
    
    let text = ''
    let footer = ''
    let image = ''
    let buttons = ''
    text = (command.toLowerCase() == 'buy' ?
(`
${htki} *COMPRAR : BUY* ${htka}`.trim()) : 
(`
${htki} *VENDER : SELL* ${htka}
`.trim())
)
    footer = (command.toLowerCase() == 'buy' ?
(`
🔖 𝙇𝙄𝙎𝙏𝘼 𝘿𝙀 𝘼𝙍𝙏𝙄𝘾𝙐𝙇𝙊𝙎 : 𝙇𝙄𝙎𝙏 𝙊𝙁 𝘼𝙍𝙏𝙄𝘾𝙇𝙀𝙎
${Object.keys(listItems).map((v) => {
        let paymentMethod = Object.keys(listItems[v]).find(v => v in user) 
        return `*» 1 ⇢ ${global.rpgshop.emoticon(v)}*\n*Cuesta:* ${listItems[v][paymentMethod]} ${global.rpgshop.emoticon(paymentMethod)}\n*Compra* ${global.rpgshopp.emoticon(v)} Usando ${usedPrefix + command} ${v} *Cantidad*\n*---------------------------------------------------*\n`.trim()
    }).join('\n')}
✨ 𝙀𝙅𝙀𝙈𝙋𝙇𝙊 𝙋𝘼𝙍𝘼 𝘾𝙊𝙈𝙋𝙍𝘼𝙍 : 𝙎𝘼𝙈𝙋𝙇𝙀 𝙏𝙊 𝘽𝙐𝙔
*Use el comando de la siguiente forma:*
*» ${usedPrefix}${command} (articulo) (cantidad)*
*» ${usedPrefix}${command} (item) (quantity)*

*★ Ejemplo : Example*
*» ${usedPrefix}${command} potion 5*
`.trim()) : 
(`
🔖 𝙇𝙄𝙎𝙏𝘼 𝘿𝙀 𝘼𝙍𝙏𝙄𝘾𝙐𝙇𝙊𝙎 : 𝙇𝙄𝙎𝙏 𝙊𝙁 𝘼𝙍𝙏𝙄𝘾𝙇𝙀𝙎
${Object.keys(listItems).map((v) => {
        let paymentMethod = Object.keys(listItems[v]).find(v => v in user)
        return `*» 1 ⇢ ${global.rpgshop.emoticon(v)}*\n*Ganancia:* ${listItems[v][paymentMethod]} ${global.rpgshop.emoticon(paymentMethod)}\n*Venda* ${global.rpgshopp.emoticon(v)} Usando ${usedPrefix + command} ${v} *Cantidad*\n*---------------------------------------------------*\n`.trim()
    }).join('\n')}
✨ 𝙀𝙅𝙀𝙈𝙋𝙇𝙊 𝙋𝘼𝙍𝘼 𝙑𝙀𝙉𝘿𝙀𝙍 : 𝙎𝘼𝙈𝙋𝙇𝙀 𝙏𝙊 𝙎𝙀𝙇𝙇
*Use el comando de la siguiente forma:*
*» ${usedPrefix}${command} (articulo) (cantidad)*
*» ${usedPrefix}${command} (item) (quantity)*

*★ Ejemplo : Example*
*» ${usedPrefix}${command} potion 5*
`.trim())
)
    image = (command.toLowerCase() == 'buy' ?
(imgr + 'COMPRAR : BUY') : 
(imgr + 'VENDER : SELL')
)
   /*buttons = (command.toLowerCase() == 'buy' ?
([
[`🏪 𝙏𝙄𝙀𝙉𝘿𝘼 𝙋𝘼𝙍𝘼 𝙑𝙀𝙉𝘿𝙀𝙍`, `${usedPrefix}sell`],
[`🎒 𝙄𝙉𝙑𝙀𝙉𝙏𝘼𝙍𝙄𝙊 | 𝙄𝙉𝙑𝙀𝙉𝙏𝙊𝙍𝙔`, `${usedPrefix}inventory`]
]) : 
([
[`🏪 𝙏𝙄𝙀𝙉𝘿𝘼 𝙋𝘼𝙍𝘼 𝘾𝙊𝙈𝙋𝙍𝘼𝙍`, `${usedPrefix}buy`],
[`🎒 𝙄𝙉𝙑𝙀𝙉𝙏𝘼𝙍𝙄𝙊 | 𝙄𝙉𝙑𝙀𝙉𝙏𝙊𝙍𝙔`, `${usedPrefix}inventory`]
])
)*/
const item = (args[0] || '').toLowerCase()
const total = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
let premium = user.premium

if (!listItems[item]) return conn.sendFile(m.chat, image, 'gata.jpg', footer, fkontak)
//conn.sendButton(m.chat, text, footer, image, buttons, m)
if (command.toLowerCase() == 'buy') {
let paymentMethod = Object.keys(listItems[item]).find(v => v in user)
if (user[paymentMethod] < listItems[item][paymentMethod] * total) return await conn.reply(m.chat, `*–--『 𝙄𝙉𝙎𝙐𝙁𝙄𝘾𝙄𝙀𝙉𝙏𝙀𝙎 𝙍𝙀𝘾𝙐𝙍𝙎𝙊𝙎 』--–*\n\n*Necesitas ${(listItems[item][paymentMethod] * total) - user[paymentMethod]}* *${global.rpgshop.emoticon(paymentMethod)} Para Comprar ${total} ${global.rpgshop.emoticon(item)}.*\n\n*Solo tienes ${user[paymentMethod]} ${global.rpgshop.emoticon(paymentMethod)}.*\n*–––––––––––––––––––––––––*\n*Misiones para Obtener Recursos*\n*Quests to Obtain Resources*\n*⛰️ Aventura : Adventure : » ${new Date - user.lastadventure < 1500000 ? '❌' : `✅ _${usedPrefix}aventura_`}*\n*♻️ Cada hora : Hourly » ${new Date - user.lasthourly < 3600000 ? '❌' : `✅ _${usedPrefix}cadahora_`}*\n*💫 Semanalmente : Weekly ${new Date - user.lastweekly < 259200000 ? '❌' : `✅ _${usedPrefix}cadasemana_`}*\n*🏅 Mensual : Monthly ${new Date - user.lastmonthly < 432000000 ? '❌' : `✅ _${usedPrefix}cadames_`}*\n\n*RECURSOS BAJOS : LOW RESOURCES*\n${wm}`, fkontak, m)
/*conn.sendButton(m.chat,
`*–--『 𝙄𝙉𝙎𝙐𝙁𝙄𝘾𝙄𝙀𝙉𝙏𝙀𝙎 𝙍𝙀𝘾𝙐𝙍𝙎𝙊𝙎 』--–*`, 
`*Necesitas ${(listItems[item][paymentMethod] * total) - user[paymentMethod]} ${global.rpgshop.emoticon(paymentMethod)} Para Comprar ${total} ${global.rpgshop.emoticon(item)}.*

*Solo tienes ${user[paymentMethod]} ${global.rpgshop.emoticon(paymentMethod)}.*
*–––––––––––––––––––––––––*
*Misiones para Obtener Recursos*
*Quests to Obtain Resources*
*⛰️ Aventura : Adventure : » ${new Date - user.lastadventure < 1500000 ? '❌' : `✅ _${usedPrefix}aventura_`}*
*♻️ Cada hora : Hourly » ${new Date - user.lasthourly < 3600000 ? '❌' : `✅ _${usedPrefix}cadahora_`}*
*💫 Semanalmente : Weekly ${new Date - user.lastweekly < 259200000 ? '❌' : `✅ _${usedPrefix}cadasemana_`}*
*🏅 Mensual : Monthly ${new Date - user.lastmonthly < 432000000 ? '❌' : `✅ _${usedPrefix}cadames_`}*`.trim(), imgr + 'RECURSOS BAJOS : LOW RESOURCES', [
[`𝗖𝗼𝗺𝗽𝗿𝗮𝗿 : 𝗕𝘂𝘆 ${(listItems[item][paymentMethod] * total) - user[paymentMethod]} ${global.rpgshopp.emoticon(paymentMethod)}`, `${usedPrefix}buy ${paymentMethod} ${(listItems[item][paymentMethod] * total) - user[paymentMethod]}`],
[`𝙋𝙚𝙙𝙞𝙧 𝘼𝙮𝙪𝙙𝙖 | 𝘼𝙨𝙠 𝙛𝙤𝙧 𝙝𝙚𝙡𝙥 ☘️`, `${usedPrefix}pedirayuda *Por Favor alguien ayudeme con *${(listItems[item][paymentMethod] * total) - user[paymentMethod]} ${global.rpg.emoticon(paymentMethod)}.*
*» AYUDA TRANSFIRIENDO:*
*${usedPrefix}transfer ${paymentMethod} ${(listItems[item][paymentMethod] * total) - user[paymentMethod]} @${conn.getName(m.sender)}*`]], m)*/
user[paymentMethod] -= listItems[item][paymentMethod] * total
user[item] += total
 
 await conn.reply(m.chat, `*––『 COMPRADO | BOUGHT 』––*\n\n${conn.getName(m.sender)}\n*𝙃𝙖𝙨 𝘾𝙤𝙢𝙥𝙧𝙖𝙙𝙤 ${item} » ${total} ${global.rpgshop.emoticon(item)}*.\n*--------------------------------------------*\n*𝙂𝙖𝙨𝙩𝙤𝙨: ${(listItems[item][paymentMethod] * total)} ${global.rpgshop.emoticon(paymentMethod)}*\n*𝘼𝙝𝙤𝙧𝙖 𝙩𝙞𝙚𝙣𝙚: ${user[item]} ${global.rpgshopp.emoticon(item)}\n\n*COMPRA EXITOSA : DONE*\n${wm}`, fkontak, m)
/*conn.sendButton(m.chat,
`*––『 COMPRADO | BOUGHT 』––*`,
`${conn.getName(m.sender)} 
*𝙃𝙖𝙨 𝘾𝙤𝙢𝙥𝙧𝙖𝙙𝙤 ${item} » ${total} ${global.rpgshop.emoticon(item)}*.
*--------------------------------------------*
*𝙂𝙖𝙨𝙩𝙤𝙨: ${(listItems[item][paymentMethod] * total)} ${global.rpgshop.emoticon(paymentMethod)}*
*𝘼𝙝𝙤𝙧𝙖 𝙩𝙞𝙚𝙣𝙚: ${user[item]} ${global.rpgshopp.emoticon(item)}*
`.trim(), imgr + 'COMPRA EXITOSA : DONE', [
[`👝 𝘾𝘼𝙍𝙏𝙀𝙍𝘼 | 𝙒𝘼𝙇𝙇𝙀𝙏`, `${usedPrefix}cartera`],
[`🎒 𝙄𝙉𝙑𝙀𝙉𝙏𝘼𝙍𝙄𝙊 | 𝙄𝙉𝙑𝙀𝙉𝙏𝙊𝙍𝙔`, `${usedPrefix}inventory`]
], fkontak, time, m)*/
} else {
if (user[item] < total) return await conn.reply(m.chat, `🎟️ 𝗣 𝗥 𝗘 𝗠 𝗜 𝗨 𝗠 ⇢ ${premium ? '✅' : '❌'}\n${wm}\n\n*No tienes suficiente ${global.rpgshop.emoticon(item)} para vender solo tienes ${user[item]} ${global.rpgshopp.emoticon(item)}*\n\n*You dont have enough ${global.rpgshop.emoticon(item)} to sell, you only have ${user[item]} ${global.rpgshopp.emoticon(item)}*`, fkontak, m)
//conn.sendButton(m.chat, `🎟️ 𝗣 𝗥 𝗘 𝗠 𝗜 𝗨 𝗠 ⇢ ${premium ? '✅' : '❌'}\n${wm}`, `*No tienes suficiente ${global.rpgshop.emoticon(item)} para vender solo tienes ${user[item]} ${global.rpgshopp.emoticon(item)}*\n\n*You don't have enough ${global.rpgshop.emoticon(item)} to sell, you only have ${user[item]} ${global.rpgshopp.emoticon(item)}*`, gata.getRandom(), [[`🎒 𝙄𝙉𝙑𝙀𝙉𝙏𝘼𝙍𝙄𝙊 | 𝙄𝙉𝙑𝙀𝙉𝙏𝙊𝙍𝙔`, `${usedPrefix}inventory`], ['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪 ☘️', '/menu']], m, enlace)
       
let paymentMethod = Object.keys(listItems[item]).find(v => v in user)
user[item] -= total
user[paymentMethod] += listItems[item][paymentMethod] * total
    
await conn.reply(m.chat, `*––『 VENDIDO | SOLD 』––*\n\n${conn.getName(m.sender)}\n*𝙃𝙖𝙨 𝙑𝙚𝙣𝙙𝙞𝙙𝙤 ${item} » ${total} ${global.rpgshop.emoticon(item)}*.\n*--------------------------------------------*\n*𝙂𝙖𝙣𝙖𝙣𝙘𝙞𝙖𝙨: ${(listItems[item][paymentMethod] * total)} ${global.rpgshop.emoticon(paymentMethod)}*\n*𝘼𝙝𝙤𝙧𝙖 𝙩𝙞𝙚𝙣𝙚: ${user[paymentMethod]} ${global.rpgshopp.emoticon(paymentMethod)}*\n\n*VENTA EXITOSA : DONE*\n${wm}`, fkontak, m)
/*conn.sendButton(m.chat,
`*––『 VENDIDO | SOLD 』––*`,
`${conn.getName(m.sender)} 
*𝙃𝙖𝙨 𝙑𝙚𝙣𝙙𝙞𝙙𝙤 ${item} » ${total} ${global.rpgshop.emoticon(item)}*.
*--------------------------------------------*
*𝙂𝙖𝙣𝙖𝙣𝙘𝙞𝙖𝙨: ${(listItems[item][paymentMethod] * total)} ${global.rpgshop.emoticon(paymentMethod)}*
*𝘼𝙝𝙤𝙧𝙖 𝙩𝙞𝙚𝙣𝙚: ${user[paymentMethod]} ${global.rpgshopp.emoticon(paymentMethod)}*
`.trim(), imgr + 'VENTA EXITOSA : DONE', [
[`👝 𝘾𝘼𝙍𝙏𝙀𝙍𝘼 | 𝙒𝘼𝙇𝙇𝙀𝙏`, `${usedPrefix}cartera`],
[`🎒 𝙄𝙉𝙑𝙀𝙉𝙏𝘼𝙍𝙄𝙊 | 𝙄𝙉𝙑𝙀𝙉𝙏𝙊𝙍𝙔`, `${usedPrefix}inventory`]
], fkontak, time, m)*/
}
user.lastmiming = new Date * 1  
}
handler.help = ['buy', 'sell'].map(v => v + ' [item] [count]')
handler.tags = ['rpg']
handler.command = /^(buy|sell)$/i
handler.disabled = false
handler.register = true

export default handler

function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

hours = (hours < 10) ? "0" + hours : hours
minutes = (minutes < 10) ? "0" + minutes : minutes
seconds = (seconds < 10) ? "0" + seconds : seconds

return minutes + " m y " + seconds + " s " 
}  

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function isNumber(number) {
    if (!number) return number
    number = parseInt(number)
    return typeof number == 'number' && !isNaN(number)
}
