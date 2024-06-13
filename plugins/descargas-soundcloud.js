import axios from 'axios'
let handler = async (m,{ command, args, text, usedPrefix}) => {
if (!text) throw `Ingresa el nombre de la canción a buscar`;
    try{
        if(command.toLowerCase() !=="soundcloudr"){
            let response = await axios.get(`https://m.soundcloud.com/search/sounds?q=${text}`);
            let data=response.data
            let regex = /(?<="permalink_url":")[^"]*/g;
            let urls = data.match(regex);
            
            let regex2 = /(?<="permalink":")[^"]*/g
            let nombres = data.match(regex2);
            
            
            let listSections = [];
            for (let index = 0; index< urls.length; index++) {	
                let counts = urls[index].split('/').length - 1;
                if(counts>3){
                    listSections.push({
                        rows: [
                            {
                                header: `Music ${index+1}`,
                                title: "",
                                description: `${nombres[index]}\n`, 
                                id: `${usedPrefix}soundcloudr ${urls[index]}`
                            }
                        ]
                    });
                }
            }
        
        return await conn.sendList(m.chat, `${htki} *𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊𝙎* ${htka}\n`, `\n𝘽𝙪𝙨𝙦𝙪𝙚𝙙𝙖 𝙙𝙚: ${text}`, `𝗕 𝗨 𝗦 𝗖 𝗔 𝗥`, listSections, fkontak);
        }
           
        let dddata = await axios.get(`https://api.erdwpe.com/api/dowloader/soundcloud?url=${text}`)
        let ddlink=dddata.data.result.download
        let ddname=dddata.data.result.title
        let portada=dddata.data.result.thumbnail
        await delay(2000)
        conn.sendMessage(m.chat, {image: {url: portada}, caption: `Espera por favor...\n\nEnviando: ${ddname}\n\n${wm}`}, {quoted: m});
        await delay(15000)
        conn.sendMessage(m.chat, { audio: { url: ddlink }, fileName: `${ddname}`,mimetype: 'audio/mpeg'},{ quoted: m })   
    }catch(e){
    return m.reply("Error")
    }}

handler.command = /^(soundcloud|soundcloudr)$/i
handler.limit = 1
handler.register = true
export default handler

const delay = time => new Promise(res => setTimeout(res, time))
