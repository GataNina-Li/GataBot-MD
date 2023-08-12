import { performance } from 'perf_hooks'

let handler = async (m, { conn }) => {

 let start = `Aceleración de inicio... Espere un momento`
 let boost = `${pickRandom(['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'])}%`
 let boost2 = `${pickRandom(['21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40'])}%`
 let boost3 = `${pickRandom(['41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60'])}%`
 let boost4 = `${pickRandom(['61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80'])}%`
 let boost5 = `${pickRandom(['81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100'])}%`
const { key } = await conn.sendMessage(m.chat, {text: start}, {quoted: m});
await delay(1000 * 1);
await conn.sendMessage(m.chat, {text: boost, edit: key});
await delay(1000 * 2);
await conn.sendMessage(m.chat, {text: boost2, edit: key});
await delay(1000 * 2);
await conn.sendMessage(m.chat, {text: boost3, edit: key});
await delay(1000 * 2);
await conn.sendMessage(m.chat, {text: boost4, edit: key});
await delay(1000 * 2);
await conn.sendMessage(m.chat, {text: boost5, edit: key});
   let old = performance.now()
   let neww = performance.now()
   let speed = `${neww - old}`
   let finish = `*_✔️ Bot acelerado con exito_*\n\n*_Velocidad: ${speed} milisegundos!_*`
await conn.sendMessage(m.chat, {text: finish, edit: key});
//conn.reply(m.chat, finish, m)
}
handler.help = ['boost', 'refresh']
handler.tags = ['info']
handler.command = /^boost|refresh/i
handler.owner = true
handler.fail = null
export default handler 
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
