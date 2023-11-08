/*import { performance } from 'perf_hooks'
let handler = async (m, { conn, text }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }  
let user = global.db.data.users[m.sender]
let time = user.prue + 90000 //1 min
if (new Date - user.prue < 90000) return await conn.reply(m.chat, `🙌 HEY ALTO ESPERA UNOS MINUTOS PARA USAR OTRO COMANDO NO HAGA SPAM`, fkontak, m)
let start = `*😱 ¡¡Empezando Doxxeo!! 😱*`
let boost = `*${pickRandom(['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'])}%*`
let boost2 = `*${pickRandom(['21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40'])}%*`
let boost3 = `*${pickRandom(['41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60'])}%*`
let boost4 = `*${pickRandom(['61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80'])}%*`
let boost5 = `*${pickRandom(['81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100'])}%*`
const { key } = await conn.sendMessage(m.chat, {text: start}, {quoted: m});
await delay(1000 * 1);
await conn.sendMessage(m.chat, {text: boost, edit: key});
await delay(1000 * 1);
await conn.sendMessage(m.chat, {text: boost3, edit: key});
await delay(1000 * 1);
await conn.sendMessage(m.chat, {text: boost5, edit: key});
  
  
//DATOS FALSOS | FALSE DATA
let ip = `*${pickRandom(['233.34.229.59','245.168.75.53','59.49.9.213','203.23.8.207','110.189.95.186','17.151.187.183','30.209.37.141','67.52.216.173','161.107.62.117','89.168.137.231','48.247.249.251','135.158.198.206','170.57.189.55','252.0.180.120','254.180.198.115','85.188.238.220','196.88.207.113','57.84.238.99','50.132.72.227','92.28.211.234','33.211.234.00','122.238.1.2434','873.282.11.89','123.009.011.774','333.228.201.236'])}%*`  
let n = `*${pickRandom(['56 488543','5885 43','7533 443','662 3325','99684 4','968 483 4','8826 467241','859 47843','985 473 23','965 54 333332','67574 383 22','754 38943 3','51 362 33','8585 44','068 6554','685 584 3','588 444 3','583 7374 3','43 74625 66','66 76625','302 72','7 6654623','333.228.201.236'])}%*`  
let w = `*${pickRandom(['12.4893','54.643','84.95.0099','48.3324','9488.040','848.0409','237.0943','483.304.3','473.94.2','4.94','48.432','37.04932','47.03821','4763.4902','489.003','48.902','4847.940','473.04093','476.09940','49.3094.40','594.9594','585.059.4','584.069.5','5758.48.4','574.39.3','5884.5996.44','5884.59.4','474.593.3'])}%*`  
let ss = `*${pickRandom(['98(3220)399-64-05','599(40)854-26-49','3(9602)756-72-17','838(4290)443-19-237','23(0213)246-67-86','67(8940)055-49-57','1(6355)928-65-15','74(58)941-65-63','90(147)856-11-37','8(0832)062-62-37','139(56)418-20-27','25(347)781-04-44','1(508)645-73-78','44(0814)714-82-93','25(75)925-50-83','483(82)281-43-06','5(469)868-66-59','882(383)603-36-83','1(776)169-86-54','33(146)818-82-17','2(14)530-90-02','70(0227)971-57-92','33(146)818-82-17','316(648)019-00-54','8(0812)345-01-38','2(1583)521-98-54','599(40)854-26-49','98(3220)399-64-05'])}%*`  
let ipv6 = `*${pickRandom(['a57e:68a7:4ffe:afa8:9300:380b:8c1d:61b3','fc23:ab56:aa52:1bcc:d642:a67f:1970:aca7','c922:f1cb:dbb7:2ed7:7133:c154:a607:6412','5da4:4e7b:f680:09fc:855d:bf1a:a103:01bd','14a1:ea3d:ee5f:9b45:5499:7b11:f0a9:bbb2','ead1:458c:d48d:203c:7a69:4201:d7e5:0456','d03a:f0a9:f6ec:d638:8dde:c27c:24d2:dd40','acc8:a4f4:a2d5:60b9:563b:0048:309b:bda8','af1b:8086:9a88:bda7:99c0:e582:d7f8:96d6','5638:bfe5:4183:a3a7:aa0e:0442:31e3:0d94','a9bc:2b9e:484f:4316:d9b5:a776:fd80:1d6e','0976:4d22:b6d9:95ed:cc1d:c19a:7c01:cc61','ec38:3aba:b516:3be3:b61a:84c4:63fa:df60','4b2a:c574:25c2:f1b8:420f:b19c:0b0d:6c7a','02eb:b422:17fd:3ad6:ee43:997b:26f8:9e4f','4e8b:3afb:9a42:89be:ca63:624f:9ebb:6d5e','1569:cee2:9288:808e:0f05:a7bb:9bf3:3fa9','8259:b8e8:63b3:2c42:f5e5:c8d2:90c8:898a','a39:9f52:2d01:6d03:5bcc:9739:28fd:7188','0cee:a95b:8d80:8579:1f84:9d5c:479e:f08a','22b1:88d0:ea3d:6333:9e7b:9a30:f09c:289d','87a7:0fb9:d885:3a4c:289c:8fd1:3bf9:ebd5','af13:7c57:9748:44b0:2cd6:2c4e:a2b6:e7f1','0a59:3cb4:68d4:f611:3fe3:13db:13e7:9f51','73eb:be73:e506:8b33:9729:cec0:5669:7a0c','a174:e936:647b:8530:6fff:94fd:6005:835b','fd5b:95d7:8b12:76c9:7337:cca5:d4e2:946b','8e8a:5be3:0f25:7bbb:0ae8:b415:7d93:e64c','9755:9fa8:74b0:e1e6:3eaf:58b8:0226:4bb6','e874:0722:1c29:ed0e:83b2:482c:26fd:9fde','d8c2:c567:a53d:6f04:22e3:0f4a:56f7:94f4','0bf4:ad79:aec6:c383:3132:e649:df02:a85f','4f87:f0dc:dfaa:746d:bf16:24fc:c3a6:034d','fe80::5dcd::ef69::fb22::d9888%12','33.211.234.00','122.238.1.2434','873.282.11.89','123.009.011.774','333.228.201.236'])}%*`  
let up = `*${pickRandom(['Disabled','Enabled','Active','Enabled','Enabled','Active 1','Enabled','Disabled','Enabled','Enabled','Active 2','Enabled','Enabled','Enabled','Disabled','Enabled --','Enabled','Enabled []','Enabled [--]','Active 4','Enabled 1','Enabled','Disabled','Enabled','Enabled','Enabled ..1','Enabled','Enabled','Enabled','Active 1-1','Enabled','Enabled','Enabled','Active 1-2','Enabled','Enabled','Active 1-4','Enabled','Enabled','Disabled','Enabled','Disabled','Enabled','Active 1--','Enabled','Enabled','Active 3--','Disabled','Disabled','Active 3-2','Disabled'])}%*`  
let mz = `*${pickRandom(['224.203.192.120','51.84.22.38','72.103.181.182','11.186.197.194','2.164.37.166','3.129.51.178','94.53.50.167','41.44.23.164','64.78.36.163','166.73.184.242','166.73.184.242','242.158.79.7','48.182.253.42','117.114.38.139','78.84.196.238','226.88.134.38','77.78.36.143','27.144.217.243','178.107.23.219','11.206.86.63','61.230.110.17','151.11.183.174','231.26.192.30','87.39.53.244','23.130.164.74','8.104.149.48','197.44.247.159','52.66.10.68','1.69.145.235','246.17.58.125','17.30.238.218','81.56.254.24','169.209.121.246','63.196.114.29','61.72.0.219','28.165.107.34','71.23.2.222','113.185.196.216','57.221.120.54','49.140.83.222','126.28.62.182','143.43.30.23','245.182.13.149','179.74.0.248','32.133.120.250','63.190.245.90','157.209.181.152','5.192.240.215','234.253.96.100','61.119.204.124','209.160.161.103'])}%*`  

let old = performance.now()
let neww = performance.now()
let speed = `${neww - old}`
let doxeo = `*_✅ Persona doxxeada con éxito_*\n\n*_Tiempo: ${speed} segundos!_*

*RESULTADOS:*

*Nombre:* ${text}
*Ip:* ${ip}
*N:* ${n}
*W:* 12.4893
*SS NUMBER:* ${ss}
*IPV6:* ${ipv6} 
*UPNP:* ${up}
*DMZ:* ${mz}
*MAC:* 5A:78:3E:7E:00
*ISP:* Ucom unversal 
*DNS:* 8.8.8.8
*ALT DNS:* 1.1.1.8.1  
*DNS SUFFIX:* Dlink
*WAN:* 100.23.10.15
*WAN TYPE:* private nat
*GATEWAY:* 192.168.0.1
*SUBNET MASK:* 255.255.0.255
*UDP OPEN PORTS:* 8080.80
*TCP OPEN PORTS:* 443
*ROUTER VENDEDOR:* ERICCSON
*DEVICE VENDEDOR:* WIN32-X
*CONNECTION TYPE:* TPLINK COMPANY
*ICMPHOPS:* 192.168.0.1 192.168.1.1 100.73.43.4
host-132.12.32.167.ucom.com
host-132.12.111.ucom.com
36.134.67.189 216.239.78.11
Sof02s32inf14.1e100.net
*HTTP:* 192.168.3.1:433-->92.28.211.234:80
*Http:* 192.168.625-->92.28.211.455:80
*Http:* 192.168.817-->92.28.211.8:971
*Upd:* 192.168452-->92.28.211:7265288
*Tcp:* 192.168.682-->92.28.211:62227.7
*Tcp:* 192.168.725-->92.28.211:67wu2
*Tcp:* 192.168.629-->92.28.211.167:8615
*EXTERNAL MAC:* 6U:77:89:ER:O4
*MODEM JUMPS:* 64`
await conn.sendMessage(m.chat, {text: doxeo, edit: key});
//conn.reply(m.chat, doxeo, m)

user.prue = new Date * 1  
}
handler.help = ['doxear <nombre> | <@tag>']
handler.tags = ['fun']
handler.command = /^Doxxeo|doxxeo|doxxear|Doxxear|doxeo|doxear|doxxeame|doxeame/i
handler.fail = null
export default handler
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]}

function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

hours = (hours < 10) ? "0" + hours : hours
minutes = (minutes < 10) ? "0" + minutes : minutes
seconds = (seconds < 10) ? "0" + seconds : seconds

return minutes + " m y " + seconds + " s " 
}  */

import { performance } from 'perf_hooks'

var handler = async (m, { conn, text }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }  
let user = global.db.data.users[m.sender]
let time = user.prue + 90000 //1 min
if (new Date - user.prue < 90000) return await conn.reply(m.chat, `🙌 HEY ALTO ESPERA UNOS MINUTOS PARA USAR OTRO COMANDO NO HAGA SPAM`, fkontak, m)
if (!text) throw `${lenguajeGB['smsAvisoMG']()} 𝙄𝙉𝙂𝙍𝙀𝙎𝘼 𝙀𝙇 @tag 𝘿𝙀 𝘼𝙇𝙂𝙐𝙉 𝙐𝙎𝙐𝘼𝙍𝙄𝙊*`
let who
if (m.isGroup) who = m.mentionedJid[0]
else who = m.chat
if (!who) throw `${lenguajeGB['smsAvisoMG']()} 𝙄𝙉𝙂𝙍𝙀𝙎𝘼 𝙀𝙇 @tag 𝘿𝙀 𝘼𝙇𝙂𝙐𝙉 𝙐𝙎𝙐𝘼𝙍𝙄𝙊*`
let start = `*😱 ¡¡Empezando Doxxeo!! 😱*`
let ala = `😨`
let boost = `*${pickRandom(['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'])}%*`
let boost2 = `*${pickRandom(['21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40'])}%*`
let boost3 = `*${pickRandom(['41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60'])}%*`
let boost4 = `*${pickRandom(['61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80'])}%*`
let boost5 = `*${pickRandom(['81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100'])}%*`

const { key } = await conn.sendMessage(m.chat, {text: `${start}`}, {quoted: m})
await delay(1000 * 1)
await conn.sendMessage(m.chat, {text: `${boost2}`, edit: key})
await delay(1000 * 1)
await conn.sendMessage(m.chat, {text: `${boost3}`, edit: key})
await delay(1000 * 1)
await conn.sendMessage(m.chat, {text: `${boost4}`, edit: key})
await delay(1000 * 1)
await conn.sendMessage(m.chat, {text: `${boost5}`, edit: key})

let old = performance.now()
let neww = performance.now()
let speed = `${neww - old}`
let doxeo = `*_✅ Persona doxxeada con éxito_*\n\n*_Tiempo: ${speed} segundos!_*

*RESULTADOS:*
*Nombre:* ${text}
*Ip:* 92.28.211.234
*N:* 43 7462
*W:* 12.4893
*SS NUMBER:* 6979191519182016
*IPV6:* fe80::5dcd::ef69::fb22::d9888%12 
*UPNP:* Enabled
*DMZ:* 10.112.42.15
*MAC:* 5A:78:3E:7E:00
*ISP:* Ucom unversal 
*DNS:* 8.8.8.8
*ALT DNS:* 1.1.1.8.1  
*DNS SUFFIX:* Dlink
*WAN:* 100.23.10.15
*WAN TYPE:* private nat
*GATEWAY:* 192.168.0.1
*SUBNET MASK:* 255.255.0.255
*UDP OPEN PORTS:* 8080.80
*TCP OPEN PORTS:* 443
*ROUTER VENDEDOR:* ERICCSON
*DEVICE VENDEDOR:* WIN32-X
*CONNECTION TYPE:* TPLINK COMPANY
*ICMPHOPS:* 192.168.0.1 192.168.1.1 100.73.43.4
host-132.12.32.167.ucom.com
host-132.12.111.ucom.com
36.134.67.189 216.239.78.11
Sof02s32inf14.1e100.net
*HTTP:* 192.168.3.1:433-->92.28.211.234:80
*Http:* 192.168.625-->92.28.211.455:80
*Http:* 192.168.817-->92.28.211.8:971
*Upd:* 192.168452-->92.28.211:7265288
*Tcp:* 192.168.682-->92.28.211:62227.7
*Tcp:* 192.168.725-->92.28.211:67wu2
*Tcp:* 192.168.629-->92.28.211.167:8615
*EXTERNAL MAC:* 6U:77:89:ER:O4
*MODEM JUMPS:* 64`
m.reply(doxeo, null, { mentions: conn.parseMention(doxeo) })
user.prue = new Date * 1  
}
handler.help = ['doxear']
handler.tags = ['juegos']
handler.command = /^Doxxeo|doxxeo|doxxear|Doxxear|doxeo|doxear|doxxeame|doxeame/i
handler.group = true
handler.register = true
export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
