import fetch from 'node-fetch'
import axios from 'axios'
let handler = async (m, { conn, isPrems }) => {

let user = global.db.data.users[m.sender]
let premium = user.premium

const getRandomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

let exp = getRandomInRange(1500, 5000)
let exppremium = getRandomInRange(5001, 10000)

let money = getRandomInRange(800, 4000)
let moneypremium = getRandomInRange(4001, 7500)

let potion = getRandomInRange(1, 3)
let potionpremium = getRandomInRange(4, 5)

let tiketcoin = getRandomInRange(1, 2)
let tiketcoinpremium = getRandomInRange(3, 5)

let eleksirb = getRandomInRange(1, 4)
let eleksirbpremium = getRandomInRange(5, 8)

let umpan = getRandomInRange(10, 50)
let umpanpremium = getRandomInRange(51, 100)

const recompensas = {	
  exp: premium ? exppremium : exp,
  money: premium ? moneypremium : money,
  potion: premium ? potionpremium : potion,
  tiketcoin: premium ? tiketcoinpremium : tiketcoin,	
  eleksirb: premium ? eleksirbpremium : eleksirb,
  umpan: premium ? umpanpremium : umpan,
}
	
let time = user.lastclaim + 1800000 // 30 min
if (new Date - user.lastclaim < 1800000) return await conn.reply(m.chat, `\`Ya reclamaste tú regalo navideño.\`\nPróximo regalo navideño en *${msToTime(time - new Date())}*`, m, null, fake)

let texto = ''
for (let reward of Object.keys(recompensas)) {
if (!(reward in user)) continue
user[reward] += recompensas[reward]
texto += `*+${recompensas[reward]}* ${global.rpgshop.emoticon(reward)}\n`}
let text = `☃️🎁 *REGALO NAVIDEÑO* 🎁🎄\n> ${premium ? '🎟️ Recompensa Premium' : '🆓 Recompensa Gratis'}\n\n_${messagesNav}_\n`

// Imágenes de GataBot especial mes de navidad
let img = ['https://qu.ax/AAXbK.jpg', 'https://qu.ax/KQCkB.jpeg', 'https://qu.ax/Ubiaj.jpeg', 'https://qu.ax/QDqWy.jpeg', 'https://qu.ax/PXewx.jpeg', 'https://qu.ax/xxJLu.jpeg'].getRandom()

await conn.sendFile(m.chat, img, 'navidad.jpg', `${text}\n${texto}`, m, null, fake)
user.lastclaim = new Date * 1
}
handler.command = ['navidad', 'navidad2', 'christmas'] 
handler.level = 3
handler.register = true
export default handler

global.messagesNav = [
  "🎄 ¡Feliz Navidad! Que cada momento esté lleno de alegría y amor.",
  "🎅 Deseándote una temporada llena de luz, paz y armonía.",
  "🎁 Que el espíritu navideño ilumine tu camino y te colme de felicidad.",
  "✨ En esta Navidad, agradecemos tu apoyo y te enviamos nuestros mejores deseos.",
  "❄️ ¡Buena suerte, salud y éxito para el próximo año!",
  "🌟 Que la magia de la Navidad brille en tu hogar y en tu corazón.",
  "❤️ Gracias por ser parte de nuestras vidas. ¡Felicidades en estas fiestas!",
  "🎄 En esta época de amor, que todos tus sueños se hagan realidad.",
  "🎅 Que recibas tantas bendiciones como estrellas hay en el cielo navideño.",
  "🎁 ¡Gracias por un año increíble! Que la Navidad traiga paz y esperanza.",
  "✨ Te enviamos un abrazo lleno de cariño en estas fiestas.",
  "❄️ ¡Nunca pierdas la ilusión! Feliz Navidad y próspero Año Nuevo.",
  "🌟 Que compartas momentos únicos con quienes amas en estas fiestas.",
  "❤️ Agradecemos cada instante contigo este año. ¡Feliz Navidad!",
  "🎄 Que el sonido de las campanas llene tu vida de alegría.",
  "🎅 Recibe este mensaje como un pequeño obsequio de felicidad.",
  "🎁 La Navidad es mejor cuando la compartes con personas especiales. ¡Gracias por estar aquí!",
  "✨ Que esta temporada sea el comienzo de grandes cosas para ti.",
  "❄️ ¡Disfruta, ríe y celebra con los tuyos! Feliz Navidad.",
  "🌟 Gracias por tu apoyo este año. ¡Te deseamos lo mejor para estas fiestas!"
].getRandom()

function msToTime(duration) {
let seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
      
hours = (hours < 10) ? "0" + hours : hours;
minutes = (minutes < 10) ? "0" + minutes : minutes;
seconds = (seconds < 10) ? "0" + seconds : seconds;

return `${hours}h ${minutes}min ${seconds}seg`;
}
