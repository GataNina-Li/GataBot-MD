let handler = async (m, { conn }) => {
m.reply(global.mc)
}
handler.command = /^(MC-SERVER|MC-SERVER|mc-server)$/i

export default handler

global.mc =

`┏━━━━━━━━━━━━━┓
┃ *<MINECRAFT SERVER/>*
║≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋
┣ • *IP: nodo5.boxmineworld.com*
┣ • *PUERTO: 4003*
┣ • *BEDROCK Y JAVA*
┗━━━━━━━━━━━━━┛`
