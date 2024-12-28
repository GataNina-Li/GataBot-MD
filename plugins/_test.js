let handler = async (m, { conn, args, usedPrefix, command }) => {
let txt = `Nose?`
conn.sendMessage(m.chat, { text: txt, caption: "1234", footer: wm, buttons: [
  {
    buttonId: ".menu", 
    buttonText: { 
      displayText: 'test' 
    }
  }, {
    buttonId: ".s", 
    buttonText: {
      displayText: "Hola"
    }
  }
],
  viewOnce: true,
  headerType: 1,
}, { quoted: m })
}
handler.command = ['test']
export default handler