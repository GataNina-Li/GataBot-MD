import fetch from 'node-fetch'
let handler = async (m, { conn }) => {
  let res = await fetch(`https://shizoapi.onrender.com/api/texts/quotes?apikey=${shizokeys}`)
  if (!res.ok) throw await res.text()
	    let json = await res.json()
  let sizo = `${json.result}`
  conn.sendMessage(m.chat, { text: sizo, mentions: [m.sender] }, { quoted: m })
}
handler.help = ['flirt']
handler.tags = ['fun']
handler.command = /^(flirt)$/i

export default handler