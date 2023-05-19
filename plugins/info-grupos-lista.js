import PhoneNumber from 'awesome-phonenumber'
let handler = async (m, { conn, __dirname, isRowner, isOwner, isBotAdmin, usedPrefix, groupMetadata, groups, _package, participants }) => { 
const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net"
}

let txt
const chats = Object.entries(conn.chats).filter(([jid, data]) => jid && data.isChats)
groups = Object.values(await conn.groupFetchAllParticipating())
txt = `${packname} ${lenguajeGB.smsLisA()}
${lenguajeGB.smsLisB()} ${groups.length}\n`

for (let i = 0; i < groups.length; i++) {
txt += ` 
${lenguajeGB.smsLisC()} ${groups[i].subject}
${lenguajeGB.smsLisD()} ${groups[i].id}
${isOwner ? `${lenguajeGB.smsLisE()} ${groups[i].participants.length}` : ''}\n\n`
}
m.reply(txt.trim())
}
handler.help = ['groups', 'grouplist']
handler.tags = ['info']
handler.command = /^(groups|grouplist|listadegrupo|gruposlista|listagrupos|listadegrupos|grupolista|listagrupo)$/i
handler.exp = 30
export default handler
