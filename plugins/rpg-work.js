// creditos a https://github.com/FG98F
let handler = async (m, { conn, isPrems}) => {
//let hasil = Math.floor(Math.random() * 5000)
let pp = 'https://c4.wallpaperflare.com/wallpaper/991/456/22/sketch-artist-anime-anime-girls-arknights-swire-arknights-hd-wallpaper-preview.jpg'
let gata = Math.floor(Math.random() * 3000)
global.db.data.users[m.sender].exp += gata * 1  
let time = global.db.data.users[m.sender].lastwork + 600000
if (new Date - global.db.data.users[m.sender].lastwork < 600000) throw `*Ya trabajaste, espere unos ${msToTime(time - new Date())} para volver a trabajar!!*`

await conn.reply(m.chat, `*${pickRandom(global.work)}* ${gata} XP`, fkontak, pp, m)
/*conn.sendHydrated(m.chat, wm, `${pickRandom(global.work)} ${gata} XP`, pp, md, '饾檪饾櫈饾櫓饾檭饾櫔饾櫁', null, null, [
['饾棤 饾棙 饾棥 饾棬 鈽橈笍', `#menu`]
], m,) */
global.db.data.users[m.sender].lastwork = new Date * 1
}
handler.help = ['work']
handler.tags = ['xp']
handler.command = ['work', 'trabajar']
handler.fail = null
handler.exp = 0
export default handler

function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
hours = (hours < 10) ? "0" + hours : hours
minutes = (minutes < 10) ? "0" + minutes : minutes
seconds = (seconds < 10) ? "0" + seconds : seconds

return minutes + " m " + seconds + " s " 
}


function pickRandom(list) {
return list[Math.floor(list.length * Math.random())]
}

global.work = ["Trabajas como cortador de galletas y ganas", "Cuidarte el grupo cuando los admin no estaba por eso ganas", "Trabaja para una empresa militar privada, ganando", "Organiza un evento de cata de vinos y obtiene", "Moderaste el grupo cuando GATADIOS no estaba, el pago fue", "iba caminando por la calle y que encuentra con", "ayudarte con el grupo mientras los admin no estaba el pago fue", "Te secuestran y te llevan a un coliseo subterraneo donde luchaste contra monstruos con personas que nunca antes habias conocido. Ganas", "Limpias la chimenea y encuentras", "Desarrollas juegos para ganarte la vida y ganas", "Por que este comando se llama trabajo? Ni siquiera estas haciendo nada relacionado con el trabajo. Sin embargo, ganas", "Trabajaste en la oficina horas extras por", "Trabajas como secuestrador de novias y ganas", "Alguien vino y representa una obra de teatro. Por mirar te dieron", "Compraste y vendiste articulos y Ganaste", "Trabajas en el restaurante de la abuela como cocinera y ganas", "Trabajas 10 minutos en un Pizza Hut local. Ganaste", "Trabajas como escritor(a) de galletas de la fortuna y ganas", "Ves a alguien luchando por subir una caja a su auto, te apresuras a ayudarlo antes de que se lastime. Despues de ayudarlos, amablemente te dan", "Desarrollas juegos para ganarte la vida y ganas", "Ganas un concurso de comer chili picante. El premio es", "Trabajas todo el dia en la empresa por", "Ayudas a moderar el grupo de GataDios por", "Diseñaste un logo para FG por", "Moderaste el grupo cuando GataDios no estaba, el pago fue", "Trabajaste lo mejor que pudo en una imprenta que estaba contratando y gana su bien merecido!", "Trabajas como podador de arbustos para FG98 y ganas", "La demanda de juegos para dispositivos moviles ha aumentado, por lo que creas un nuevo juego lleno de micro-transacciones. Con tu nuevo juego ganas un total de", "Trabajas como actor de voz para Bob Esponja y te las arreglaste para ganar", "Estabas cultivando y Ganaste", "Trabajas como constructor de castillos de arena y ganas", "Trabajaste y Ganaste", "Trabajas como artista callejera y ganas","Hiciste trabajo social por una buena causa! por tu buena causa Recibiste"
]
