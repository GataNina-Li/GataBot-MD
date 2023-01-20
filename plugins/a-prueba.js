
import fetch from 'node-fetch'
let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `uhm.. cari apa?\n\ncontoh:\n${usedPrefix + command} mabar`
    
    let json = await fetch(`https://anabotofc.herokuapp.com/api/carigrup?apikey=AnaBot&query=${text}`)
        let jsons = await json.json()
        let caption = `*⎔┉━「 ${command} 」━┉⎔*`
        for (let x of jsons.result) {
        caption += `
*Nama* : ${x.title}
*Link :* ${x.link}
*Desc :* ${x.desc}
`}
        return m.reply(caption)
        
}
handler.help = ['prue <pencarian>']
handler.tags = ['tools']

handler.command = /^prue/i

export default handler
