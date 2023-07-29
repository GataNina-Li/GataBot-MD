import fetch from 'node-fetch'
let handler = async (m, { conn }) => {
  let res = await fetch(`https://shizoapi.onrender.com/api/texts/dare?apikey=${shizokeys}`)
  if (!res.ok) throw await res.text()
	    let json = await res.json()
  let sizo = `${json.result}`
  conn.sendMessage(m.chat, { text: sizo, mentions: [m.sender] }, { dared: m })
}
handler.help = ['dare']
handler.tags = ['fun']
handler.command = /^(dare|dares)$/i

export default handler