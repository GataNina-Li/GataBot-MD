let handler = async (m, { conn, participants, groupMetadata }) => {

    let ppch = await conn.profilePictureUrl(m.sender, 'image').catch(_ => gataMenu)
   
let text =`*╭─── ✨ ¡Bienvenido(a) al Grupo! ✨ ───╮*\n`
text += `*│*\n`
text += `*├─ 👋 ¡Hola @${m.sender.split('@')[0]}⁨⁩!*\n`
text += `*├─ *${groupMetadata.subject}\n`
text += `*├─ 🎉 Nos alegra tenerte aquí. ¡Esperamos que disfrutes tu estadía!*\n`
text += `*├─ 📜 No olvides revisar la descripción del grupo para más detalles.*\n`
text += `*│*\n`
text += `*╰─── 🐈 𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿 🐈 ───╯*\n\n`
text += `${groupMetadata.desc?.toString() || '¡SIN DESCRIPCIÓN!\n> *Gata Bot - MD* 🌻🐈'}`

    conn.sendFile(m.chat, ppch, 'pp.jpg', text, null, true, { mentions: m.sender})
}

handler.command = ['welcome','bienvenido'] 
handler.group = true
handler.admin = true

export default handler
