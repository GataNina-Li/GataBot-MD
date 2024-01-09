import fetch from 'node-fetch' 
const handler = async (m, {conn, text, args}) => {   
if (!args[0]) return conn.reply(m.chat, '*Por favor ingresa una url de la página a la que se le tomará captura 🔎*', m)  
try {
const ss = await (await fetch(`https://image.thum.io/get/fullpage/${args[0]}`)).buffer()
conn.sendFile(m.chat, ss, '', '', m)
} catch { 
try {  
const ss2 = `https://api.screenshotmachine.com/?key=c04d3a&url=${args[0]}&screenshotmachine.com&dimension=720x720`  
conn.sendMessage(m.chat, { image: { url: ss2 }}, { quoted: m }) 
} catch {  
try { 
const ss3 =  `https://api.lolhuman.xyz/api/SSWeb?apikey=${lolkeysapi}&url=${text}` 
conn.sendMessage(m.chat, { image: { url: ss3 }}, { quoted: m }) 
} catch { 
const ss4 = `https://api.lolhuman.xyz/api/SSWeb2?apikey=${lolkeysapi}&url=${text}`
conn.sendMessage(m.chat, { image: { url: ss4 }}, { quoted: m })
}}}
} 

handler.command = /^ss(web)?f?$/i;   
export default handler








/*import fetch from 'node-fetch'
let handler = async (m, { conn, command, args }) => {
let full = /f$/i.test(command)
if (!args[0]) return conn.reply(m.chat, '*Por favor ingresa un url de la página a la que se le tomará captura 🔎*', m)
let krt = await ssweb(args)
//let url = /https?:\/\//.test(args[0]) ? args[0] : 'https://' + args[0]
//let ss = await (await fetch(global.API('nrtm', '/api/ssweb', { delay: 1000, url, full }))).buffer()
//conn.sendFile(m.chat, krt, 'error.png', m)
conn.sendMessage(m.chat, {image:krt.result, caption: `Resultados`}, {quoted:m})
}
handler.help = ['ss', 'ssf'].map(v => v + ' <url>')
handler.tags = ['internet']
handler.command = /^ss(web)?f?$/i
handler.money = 40
export default handler

const ssweb = (url, device = 'desktop') => {
     return new Promise((resolve, reject) => {
          const base = 'https://www.screenshotmachine.com'
          const param = {
            url: url,
            device: device,
            cacheLimit: 0
          }
          axios({url: base + '/capture.php',
               method: 'POST',
               data: new URLSearchParams(Object.entries(param)),
               headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
               }
          }).then((data) => {
               const cookies = data.headers['set-cookie']
               if (data.data.status == 'success') {
                    axios.get(base + '/' + data.data.link, {
                         headers: {
                              'cookie': cookies.join('')
                         },
                         responseType: 'arraybuffer'
                    }).then(({ data }) => {
                        result = {
                            status: 200,
                            result: data
                        }
                         resolve(result)
                    })
               } else {
                    reject({ status: 404, statuses: `Link Error`, message: data.data })
               }
          }).catch(reject)
     })
          }
*/
