import fetch from 'node-fetch'
let handler = async (m, { conn }) => {
  let res = await fetch(`https://shizoapi.onrender.com/api/texts/truth?apikey=${shizokeys}`)
  if (!res.ok) throw await res.text()
	    let json = await res.json()
  let sizo = `${json.result}`
  conn.sendMessage(m.chat, { text: sizo, mentions: [m.sender] }, { truthd: m })
}
handler.help = ['truth']
handler.tags = ['fun']
handler.command = /^(truth|truths)$/i

export default handler