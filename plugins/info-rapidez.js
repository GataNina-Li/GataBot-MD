let handler = async m => {
 let old = performance.now()
 let neww = performance.now()
 let speed = neww - old
 let txt = `${eg}*_COMENZANDO PRUEBA DE VELOCIDAD..._*\n*_STARTING SPEED TEST..._*`.trim()
  m.reply(txt)

await m.reply('🚀')
await m.reply('🚀🚀')
await m.reply('🚀🚀🚀')
await m.reply(`╰⊱✅⊱ *𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊 | 𝙍𝙀𝙎𝙐𝙇𝙏* ⊱✅⊱╮`)
 
let veloz = 
`🚄 *VELOCIDAD:*\n *${speed}* *Milisegundos*\n\n🚄 *SPEED:*\n *${speed}* *Milliseconds*`

 const templateButtonsReplyMessage = [
{index: 1, urlButton: {displayText: '𝙵𝚞𝚝𝚊𝚋𝚞𝙱𝚘𝚝-𝙼𝙳', url: 'https://github.com/ColapsusHD/FutabuBot-MD'}},
{index: 2, urlButton: {displayText: '𝙄𝙣𝙨𝙩𝙖𝙜𝙧𝙖𝙢', url: 'https://www.instagram.com/gata_dios/'}},
{index: 3, quickReplyButton: {displayText: '𝙊𝙩𝙧𝙖 𝙫𝙚𝙯 | 𝘼𝙜𝙖𝙞𝙣', id: '#ping'}},
{index: 4, quickReplyButton: {displayText: '𝙄𝙣𝙛𝙤𝙧𝙢𝙖𝙘𝙞ó𝙣 | 𝙄𝙣𝙛𝙤𝙧𝙢𝙖𝙩𝙞𝙤𝙣', id: '#infobot'}},
{index: 5, quickReplyButton: {displayText: '𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪', id: '#menu'}},
]
let tm = {
text: veloz,
footer: global.wm,
templateButtons: templateButtonsReplyMessage
}
conn.sendMessage(m.chat, tm, m)
}
// let veloz = `${rg}*VELOCIDAD:* *${speed}* *Milisegundos*\n*SPEED:* *${speed}* *Milliseconds*`.trim() 
//conn.sendButton(m.chat, `${rg}*VELOCIDAD:* *${speed}* *Milisegundos*\n*SPEED:* *${speed}* *Milliseconds*`, wm, veloz, [['Vista', /${command}]], m)
                                               
//m.reply(`${rg}*VELOCIDAD:* *${speed}* *Milisegundos*\n*SPEED:* *${speed}* *Milliseconds*`)

 

handler.help = ['ping']
handler.tags = ['info']
handler.command = /^(ping|speed|velocidad|rapidez|velocity)$/i
export default handler
