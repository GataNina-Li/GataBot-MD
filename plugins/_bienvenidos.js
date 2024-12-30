let handler = async (m, { conn, participants, groupMetadata }) => {

    const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => gataMenu)
   
    let text =`*╭─* ${groupMetadata.subject} *─╮*
*│*
*├─ ✨ @${m.sender.split('@')[0]}⁨⁩, nos alegra tenerte aquí!*
*├─ 📄 ¡No olvides revisar la descripción del grupo!*
*│*
*╰── ✨️ Atte: Gata Dios ✨️ ──╯*


${groupMetadata.desc?.toString() || 'desconocido'}`.trim()
const mentionedJid = groupMetadata.participants.map(v => v.id);
    conn.sendFile(m.chat, pp, 'pp.jpg', text, null, true, { mentions: m.sender})
}

handler.command = ['welcome','bienvenidos','bienbenidos'] 
handler.group = true
handler.admin = true

export default handler
