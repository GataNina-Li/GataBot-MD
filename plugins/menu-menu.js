import { xpRange } from '../lib/levelling.js'
const { levelling } = '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text }) => {
try {
let vn = './media/menu.mp3'
//let pp = './media/menus/Menuvid1.mp4'
let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
let { exp, limit, level, role } = global.db.data.users[m.sender]
let { min, xp, max } = xpRange(level, global.multiplier)
let name = await conn.getName(m.sender)
let d = new Date(new Date + 3600000)
let locale = 'es'
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
day: 'numeric',
month: 'long',
year: 'numeric'
})
let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
day: 'numeric',
month: 'long',
year: 'numeric'
}).format(d)
let time = d.toLocaleTimeString(locale, {
hour: 'numeric',
minute: 'numeric',
second: 'numeric'
})
let _uptime = process.uptime() * 1000
let _muptime
if (process.send) {
process.send('uptime')
_muptime = await new Promise(resolve => {
process.once('message', resolve)
setTimeout(resolve, 1000)
}) * 1000
}
let { money } = global.db.data.users[m.sender]
let user = global.db.data.users[m.sender]
let muptime = clockString(_muptime)
let uptime = clockString(_uptime)
let totalreg = Object.keys(global.db.data.users).length
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
let replace = {
'%': '%',
p: _p, uptime, muptime,
me: conn.getName(conn.user.jid),
npmname: _package.name,
npmdesc: _package.description,
version: _package.version,
exp: exp - min,
maxexp: xp,
totalexp: exp,
xp4levelup: max - exp,
github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
readmore: readMore
}
text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
//let user = global.db.data.users[m.sender]
//user.registered = false
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who) 


let str = 
`*╭━━━〔 𝙈𝙀𝙉𝙐 𝘾𝙊𝙈𝙋𝙇𝙀𝙏𝙊 〕━━━⬣*
*┆⦒ 𓃠 𝙑𝙀𝙍𝙎𝙄𝙊𝙉 » ${vs}*
*┆⦒ 𝙁𝙀𝘾𝙃𝘼 » ${week}, ${date}*
*┆⦒ 𝙏𝙄𝙀𝙈𝙋𝙊 𝘼𝘾𝙏𝙄𝙑𝙊 » ${uptime}*
*┆⦒ 𝙐𝙎𝙐𝘼𝙍𝙄𝙊𝙎 » ${Object.keys(global.db.data.users).length}*
*╰*┅┅┅┅┅┅┅┅┅┅┅┅┅ *✧* 

*╭━〔* ${username} *〕━━⬣*
*┆🧰 EXPERIENCIA ➟ ${exp}*
*┆🎖️ NIVEL ➟ ${level} || ${user.exp - min}/${xp}*
*┆⚓ RANGO ➟* ${role}
*┆💎 DIAMANTES ➟ ${limit}*
*┆🐈 GATACOINS ➟ ${money}*
*┆🎟️ PREMIUM ➟* ${global.prem ? '✅' : '❌'}
*╰*┅┅┅┅┅┅┅┅┅┅┅┅┅ *✧*
${readMore}
*╭━〔 INFORMACIÓN DE GATABOT 〕━⬣*
┃💫➺ _${usedPrefix}cuentasgatabot | cuentasgb_
┃💫➺ _${usedPrefix}gruposgb | grupos | groupgb_
┃💫➺ _${usedPrefix}donar | donate_
┃💫➺ _${usedPrefix}listagrupos | grouplist_
┃💫➺ _${usedPrefix}estado | heygata | status_
┃💫➺ _${usedPrefix}infogata | infobot_
┃💫➺ _${usedPrefix}creadora | owner_
┃💫➺ _${usedPrefix}velocidad | ping_
┃💫➺ _Bot_ 
┃💫➺ _términos y condiciones_
*╰━━━━━━━━━━━━⬣*

*╭━〔 REPORTAR COMANDO 〕━⬣*
┃ *Reporta con este comando de haber*
┃ *Fallas para poder Solucionar!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ 💌 _${usedPrefix}reporte *texto*_
┃ 💌 _${usedPrefix}report *texto*_
*╰━━━━━━━━━━━━⬣*

*╭━〔 ÚNETE AL GRUPO 〕━⬣*
┃ *Une a GataBot en Grupos!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃🪅 _${usedPrefix}join *enlace*_
┃🪅 _${usedPrefix}unete *enlace*_
*╰━━━━━━━━━━━━⬣*

*╭━〔 JUEGOS - MULTI JUEGOS 〕━⬣*
┃🎡➺ _${usedPrefix}mates | matemáticas | math_
┃🎡➺ _${usedPrefix}ppt *piedra : papel : tijera*_
┃🎡➺ _${usedPrefix}topgays_
┃🎡➺ _${usedPrefix}topotakus_
┃🎡➺ _${usedPrefix}topintegrantes | topintegrante_
┃🎡➺ _${usedPrefix}toplagrasa | topgrasa_
┃🎡➺ _${usedPrefix}toppanafrescos | toppanafresco_
┃🎡➺ _${usedPrefix}topshiposters | topshipost_
┃🎡➺ _${usedPrefix}toppajeros | toppajer@s_
┃🎡➺ _${usedPrefix}toplindos | toplind@s_
┃🎡➺ _${usedPrefix}topputos | topput@s_
┃🎡➺ _${usedPrefix}topfamosos | topfamos@s_
┃🎡➺ _${usedPrefix}topparejas | top5parejas_
┃🎡➺ _${usedPrefix}gay | gay *@tag*_
┃🎡➺ _${usedPrefix}gay2 *nombre : @tag*_
┃🎡➺ _${usedPrefix}lesbiana *nombre : @tag*_
┃🎡➺ _${usedPrefix}manca *nombre : @tag*_
┃🎡➺ _${usedPrefix}manco *nombre : @tag*_
┃🎡➺ _${usedPrefix}pajero *nombre : @tag*_
┃🎡➺ _${usedPrefix}pajera *nombre : @tag*_
┃🎡➺ _${usedPrefix}puto *nombre : @tag*_
┃🎡➺ _${usedPrefix}puta *nombre : @tag*_
┃🎡➺ _${usedPrefix}rata *nombre : @tag*_
┃🎡➺ _${usedPrefix}love *nombre : @tag*_
┃🎡➺ _${usedPrefix}doxear *nombre : @tag*_
┃🎡➺ _${usedPrefix}doxxeame_
┃🎡➺ _${usedPrefix}pregunta *texto*_
┃🎡➺ _${usedPrefix}apostar | slot *cantidad*_
┃🎡➺ _${usedPrefix}formarpareja_
┃🎡➺ _${usedPrefix}dado_
┃🎡➺ _${usedPrefix}verdad_
┃🎡➺ _${usedPrefix}reto_
┃🎡➺ _${usedPrefix}multijuegos_
┃🎡➺ _${usedPrefix}juegos_
*╰━━━━━━━━━━━━⬣*

*╭━〔 IA 〕━⬣*
┃ *Tienes la Ocasión de*
┃ *Conversar con GataBot!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃🪄➺ _${usedPrefix}simi | okgoogle *texto*_
┃🪄➺ _${usedPrefix}alexa | siri | cortana *texto*_
┃🪄➺ _${usedPrefix}simsimi | bixby *texto*_
*╰━━━━━━━━━━━━⬣*

*╭━━━[ AJUSTES - CHATS ]━━━⬣*
┃ *Configura si eres Propietario(a) y/o*
┃ *Admin!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃⚙️ _${usedPrefix}on *:* off *welcome*_
┃⚙️ _${usedPrefix}on *:* off *public*_
┃⚙️ _${usedPrefix}on *:* off *modohorny*_
┃⚙️ _${usedPrefix}on *:* off *antilink*_
┃⚙️ _${usedPrefix}on *:* off *antilink2*_
┃⚙️ _${usedPrefix}on *:* off *detect*_
┃⚙️ _${usedPrefix}on *:* off *restrict*_
┃⚙️ _${usedPrefix}on *:* off *pconly*_
┃⚙️ _${usedPrefix}on *:* off *gconly*_
┃⚙️ _${usedPrefix}on *:* off *autoread*_
┃⚙️ _${usedPrefix}on *:* off *audios*_
┃⚙️ _${usedPrefix}on *:* off *autosticker*_
*╰━━━━━━━━━━━━⬣*

*╭━[ DESCARGAS | DOWNLOADS ]━⬣*
┃🚀➺ _${usedPrefix}imagen | image *texto*_
┃🚀➺ _${usedPrefix}pinterest | dlpinterest *texto*_
┃🚀➺ _${usedPrefix}wallpaper|wp *texto*_
┃🚀➺ _${usedPrefix}play | play2 *texto o link*_
┃🚀➺ _${usedPrefix}play.1 *texto o link*_
┃🚀➺ _${usedPrefix}play.2 *texto o link*_ 
┃🚀➺ _${usedPrefix}ytmp3 | yta *link*_
┃🚀➺ _${usedPrefix}ytmp4 | ytv *link*_
┃🚀➺ _${usedPrefix}facebook | fb *link*_
┃🚀➺ _${usedPrefix}instagram *link video o imagen*_
┃🚀➺ _${usedPrefix}verig | igstalk *usuario(a)*_
┃🚀➺ _${usedPrefix}ighistoria | igstory *usuario(a)*_
┃🚀➺ _${usedPrefix}tiktok *link*_
┃🚀➺ _${usedPrefix}tiktokfoto | tiktokphoto *usuario(a)*_
┃🚀➺ _${usedPrefix}vertiktok | tiktokstalk *usuario(a)*_
┃🚀➺ _${usedPrefix}mediafire | dlmediafire *link*_
┃🚀➺ _${usedPrefix}clonarepo | gitclone *link*_
*╰━━━━━━━━━━━━⬣*

*╭━[ CONFIGURACIÓN - GRUPOS ]━⬣*
┃ *Mejora tú Grupo con GataBot!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃🌐➺ _${usedPrefix}add *numero*_
┃🌐➺ _${usedPrefix}sacar | ban | kick  *@tag*_
┃🌐➺ _${usedPrefix}grupo *abrir : cerrar*_
┃🌐➺ _${usedPrefix}group *open : close*_
┃🌐➺ _${usedPrefix}daradmin | promote *@tag*_
┃🌐➺ _${usedPrefix}quitar | demote *@tag*_
┃🌐➺ _${usedPrefix}banchat_
┃🌐➺ _${usedPrefix}unbanchat_
┃🌐➺ _${usedPrefix}banuser *@tag*_
┃🌐➺ _${usedPrefix}unbanuser *@tag*_
┃🌐➺ _${usedPrefix}admins *texto*_
┃🌐➺ _${usedPrefix}invocar *texto*_
┃🌐➺ _${usedPrefix}tagall *texto*_
┃🌐➺ _${usedPrefix}hidetag *texto*_
┃🌐➺ _${usedPrefix}infogrupo | infogroup_
┃🌐➺ _${usedPrefix}enlace | link_
┃🌐➺ _${usedPrefix}newnombre | setname *texto*_
┃🌐➺ _${usedPrefix}newdesc | setdesc *texto*_
┃🌐➺ _${usedPrefix}setwelcome *texto*_
┃🌐➺ _${usedPrefix}setbye *texto*_
┃🌐➺ _${usedPrefix}on_
┃🌐➺ _${usedPrefix}off_
*╰━━━━━━━━━━━━⬣*

*╭━━━[ CONTENIDO 🔞 ]━━⬣*
┃ *Visita el Menú de Comandos*
┃ *Para Adultos!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃🔞➺ _${usedPrefix}hornymenu_
*╰━━━━━━━━━━━━⬣*

*╭━[ CONVERTIDORES 🛰️ ]━⬣*
┃ *Convierte sticker en imagen!!*
┃ *Crea enlace de archivos!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃🛰️➺ _${usedPrefix}toimg | img | jpg *sticker*_
┃🛰️➺ _${usedPrefix}tomp3 | mp3 *video o nota de voz*_
┃🛰️➺ _${usedPrefix}tovn | vn *video o audio*_
┃🛰️➺ _${usedPrefix}tovideo *audio*_
┃🛰️➺ _${usedPrefix}tourl *video, imagen*_
┃🛰️➺ _${usedPrefix}toenlace  *video, imagen o audio*_
┃🛰️➺ _${usedPrefix}tts es *texto*_
*╰━━━━━━━━━━━━⬣*

*╭━━━[ LOGOS 🔆 ]━━⬣*
┃ *Crea Logos o personaliza*
┃ *la información del Logo!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃🔆 _${usedPrefix}logos *efecto texto*_
*╰━━━━━━━━━━━━⬣*

*╭━━━[ EFECTOS ⛺ ]━━⬣*
┃⛺ _${usedPrefix}simpcard *@tag*_
┃⛺ _${usedPrefix}hornycard *@tag*_
┃⛺ _${usedPrefix}lolice *@tag*_
┃⛺ _${usedPrefix}ytcomment *texto*_
┃⛺ _${usedPrefix}itssostupid_
┃⛺ _${usedPrefix}pixelar_
┃⛺ _${usedPrefix}blur_
*╰━━━━━━━━━━━━⬣*

*╭━[ RANDOM | ANIME 🧩 ]━⬣*
┃🧩 _${usedPrefix}cristianoronaldo_
┃🧩 _${usedPrefix}messi_
┃🧩 _${usedPrefix}meme_
┃🧩 _${usedPrefix}itzy_
┃🧩 _${usedPrefix}blackpink_
┃🧩 _${usedPrefix}kpop *blackpink : exo : bts*_
┃🧩 _${usedPrefix}lolivid_
┃🧩 _${usedPrefix}loli_
┃🧩 _${usedPrefix}navidad_
┃🧩 _${usedPrefix}ppcouple_
┃🧩 _${usedPrefix}neko_
┃🧩 _${usedPrefix}waifu_
┃🧩 _${usedPrefix}akira_
┃🧩 _${usedPrefix}akiyama_
┃🧩 _${usedPrefix}anna_
┃🧩 _${usedPrefix}asuna_
┃🧩 _${usedPrefix}ayuzawa_
┃🧩 _${usedPrefix}boruto_
┃🧩 _${usedPrefix}chiho_
┃🧩 _${usedPrefix}chitoge_
┃🧩 _${usedPrefix}deidara_
┃🧩 _${usedPrefix}erza_
┃🧩 _${usedPrefix}elaina_
┃🧩 _${usedPrefix}eba_
┃🧩 _${usedPrefix}emilia_
┃🧩 _${usedPrefix}hestia_
┃🧩 _${usedPrefix}hinata_
┃🧩 _${usedPrefix}inori_
┃🧩 _${usedPrefix}isuzu_
┃🧩 _${usedPrefix}itachi_
┃🧩 _${usedPrefix}itori_
┃🧩 _${usedPrefix}kaga_
┃🧩 _${usedPrefix}kagura_
┃🧩 _${usedPrefix}kaori_
┃🧩 _${usedPrefix}keneki_
┃🧩 _${usedPrefix}kotori_
┃🧩 _${usedPrefix}kurumi_
┃🧩 _${usedPrefix}madara_
┃🧩 _${usedPrefix}mikasa_
┃🧩 _${usedPrefix}miku_
┃🧩 _${usedPrefix}minato_
┃🧩 _${usedPrefix}naruto_
┃🧩 _${usedPrefix}nezuko_
┃🧩 _${usedPrefix}sagiri_
┃🧩 _${usedPrefix}sasuke_
┃🧩 _${usedPrefix}sakura_
┃🧩 _${usedPrefix}cosplay_
*╰━━━━━━━━━━━━⬣*

*╭━[ MODIFICAR AUDIO 🧰 ]━⬣*
┃ *Realiza Modificaciones*
┃ *al Audio o Nota de Voz!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃🧰 _${usedPrefix}bass_
┃🧰 _${usedPrefix}blown_
┃🧰 _${usedPrefix}deep_
┃🧰 _${usedPrefix}earrape_
┃🧰 _${usedPrefix}fast_
┃🧰 _${usedPrefix}fat_
┃🧰 _${usedPrefix}nightcore_
┃🧰 _${usedPrefix}reverse_
┃🧰 _${usedPrefix}robot_
┃🧰 _${usedPrefix}slow_
┃🧰 _${usedPrefix}smooth_
┃🧰 _${usedPrefix}tupai_
*╰━━━━━━━━━━━━⬣*

*<ℂℍ𝔸𝕋 𝔸ℕ𝕆ℕ𝕀𝕄𝕆/>*

° ඬ⃟📳 _${usedPrefix}start_
° ඬ⃟📳 _${usedPrefix}next_
° ඬ⃟📳 _${usedPrefix}leave_

*╭━━[ BÚSQUEDAS 🔍 ]━━⬣*
┃ *Busca lo que quieres con GataBot!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃🔍➺ _${usedPrefix}animeinfo *texto*_
┃🔍➺ _${usedPrefix}mangainfo *texto*_
┃🔍➺ _${usedPrefix}google *texto*_
┃🔍➺ _${usedPrefix}letra | lirik *texto*_
┃🔍➺ _${usedPrefix}ytsearch | yts *texto*_
┃🔍➺ _${usedPrefix}wiki | wikipedia *texto*_
*╰━━━━━━━━━━━━⬣*

*╭━━━[ AUDIOS 🔊 ]━━⬣*
┃ *Visita el Menú de Audios!!*
┃ *Disfruta de una Gran Variedad*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃➫🔊 _${usedPrefix}audios_
*╰━━━━━━━━━━━━⬣*

*╭━━[ HERRAMIENTAS 🛠️ ]━━⬣*
┃🛠️ _${usedPrefix}afk *motivo*_
┃🛠️ _${usedPrefix}acortar *url*_
┃🛠️ _${usedPrefix}calc *operacion math*_
┃🛠️ _${usedPrefix}del *respondre a mensaje del Bot*_
┃🛠️ _${usedPrefix}qrcode *texto*_
┃🛠️ _${usedPrefix}readmore *texto1|texto2*_
┃🛠️ _${usedPrefix}spamwa *numero|texto|cantidad*_
┃🛠️ _${usedPrefix}styletext *texto*_
┃🛠️ _${usedPrefix}traducir *texto*_
*╰━━━━━━━━━━━━⬣*

*╭━━━[ FUNCIÓN RPG ]━━⬣*
┃ *Compra, Adquiere Recuersos*
┃ *Mejora Tú Nivel y Rango!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃⚗️➺ _${usedPrefix}dardiamantes *cantidad*_
┃⚗️➺ _${usedPrefix}darxp *cantidad*_
┃⚗️➺ _${usedPrefix}dargatacoins *cantidad*_
┃⚗️➺ _${usedPrefix}transfer *tipo cantidad @user*_
┃⚗️➺ _${usedPrefix}balance_
┃⚗️➺ _${usedPrefix}experiencia | exp_
┃⚗️➺ _${usedPrefix}nivel | level | lvl_
┃⚗️➺ _${usedPrefix}rol | rango_
┃⚗️➺ _${usedPrefix}minardiamantes | minargemas_
┃⚗️➺ _${usedPrefix}minargatacoins | minarcoins_
┃⚗️➺ _${usedPrefix}minarexperiencia | minarexp_
┃⚗️➺ _${usedPrefix}minar *:* minar2 *:* minar3_
┃⚗️➺ _${usedPrefix}buy *cantidad*_
┃⚗️➺ _${usedPrefix}buyall_
┃⚗️➺ _${usedPrefix}buy2 *cantidad*__
┃⚗️➺ _${usedPrefix}buyall2_
┃⚗️➺ _${usedPrefix}verificar | registrar_
┃⚗️➺ _${usedPrefix}perfil | profile_
┃⚗️➺ _${usedPrefix}myns_
┃⚗️➺ _${usedPrefix}unreg *numero de serie*_
┃⚗️➺ _${usedPrefix}claim_
┃⚗️➺ _${usedPrefix}trabajar | work_
*╰━━━━━━━━━━━━⬣*

*╭━━━[ TOP EN GATABOT ]━━⬣*
┃ *Averigua en que Top te encuentras!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃🏆➺ _${usedPrefix}top | lb | leaderboard_
*╰━━━━━━━━━━━━⬣*

*╭━[ STICKERS Y FILTROS ]━⬣*
┃ *Realiza stickers o crea*
┃ *stickers con filtros!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃🎐 _${usedPrefix}sticker | s *imagen o video*_
┃🎐 _${usedPrefix}sticker | s *url de tipo jpg*_
┃🎐 _${usedPrefix}emojimix *😺+😆*_
┃🎐 _${usedPrefix}scircle | círculo *imagen*_
┃🎐 _${usedPrefix}semoji | emoji *tipo emoji*_
┃🎐 _${usedPrefix}attp *texto*_
┃🎐 _${usedPrefix}attp2 *texto*_
┃🎐 _${usedPrefix}ttp *texto*_
┃🎐 _${usedPrefix}ttp2 *texto*_
┃🎐 _${usedPrefix}ttp3 *texto*_
┃🎐 _${usedPrefix}ttp4 *texto*_
┃🎐 _${usedPrefix}ttp5 *texto*_
┃🎐 _${usedPrefix}ttp6 *texto*_
┃🎐 _${usedPrefix}dado_
┃🎐 _${usedPrefix}stickermarker *efecto : responder a imagen*_
┃🎐 _${usedPrefix}stickerfilter *efecto : responder a imagen*_
┃🎐 _${usedPrefix}cs *:* cs2_
*╰━━━━━━━━━━━━⬣*

*╭━[ MODIFICAR STICKERS ]━⬣*
┃ *Personaliza la información del Sticker!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃💡 _${usedPrefix}wm *packname|author*_
┃💡 _${usedPrefix}wm *texto1|texto2*_
*╰━━━━━━━━━━━━⬣*

*╭━[ STICKERS DINÁMICOS ]━⬣*
┃ *Realiza acciones con Stickers*
┃ *Etiquetando a alguien!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃⛱️ _${usedPrefix}palmaditas | pat *@tag*_
┃⛱️ _${usedPrefix}bofetada | slap *@tag*_
┃⛱️ _${usedPrefix}golpear *@tag*_
┃⛱️ _${usedPrefix}besar | kiss *@tag*_
┃⛱️ _${usedPrefix}alimentar | food *@tag*_
*╰━━━━━━━━━━━━⬣*

*╭━[ MENU PARA PROPIETARIO/A ]━⬣*
┃ *Comandos solo para Propietario/a!!*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃💎➺ _${usedPrefix}cajafuerte_
┃💎➺ _${usedPrefix}comunicar | broadcastall | bc *texto*_
┃💎➺ _${usedPrefix}broadcastchats | bcc *texto*_
┃💎➺ _${usedPrefix}comunicarpv *texto*_
┃💎➺ _${usedPrefix}broadcastgc *texto*_
┃💎➺ _${usedPrefix}comunicargrupos *texto*_
┃💎➺ _${usedPrefix}borrartmp | cleartmp_
┃💎➺ _${usedPrefix}reiniciar | restart_
┃💎➺ _${usedPrefix}ctualizar | update_
┃💎➺ _${usedPrefix}addprem | +prem *@tag*_
┃💎➺ _${usedPrefix}delprem | -prem *@tag*_
┃💎➺ _${usedPrefix}listapremium | listprem_
┃💎➺ _${usedPrefix}añadirdiamantes *@tag cantidad*_
┃💎➺ _${usedPrefix}añadirxp *@tag cantidad*_
┃💎➺ _${usedPrefix}añadirgatacoins *@tag cantidad*_
*╰━━━━━━━━━━━━⬣*
`.trim()
await conn.sendHydrated2(m.chat, str, wm, null, 'https://github.com/GataNina-Li/GataBot-MD', '𝙂𝙖𝙩𝙖𝘽𝙤𝙩-𝙈𝘿', ig, '𝙄𝙣𝙨𝙩𝙖𝙜𝙧𝙖𝙢', [
['💖 𝘿𝙤𝙣𝙖𝙧 | 𝘿𝙤𝙣𝙖𝙩𝙚', '.donar'],
['💗 𝙈𝙚𝙣𝙪 𝘼𝙫𝙚𝙣𝙩𝙪𝙧𝙖 | 𝙍𝙋𝙂 💗', '.rpgmenu'],
['💝 𝙈𝙚𝙣𝙪 𝘼𝙪𝙙𝙞𝙤𝙨 💝', '.audios']

], m,)
await conn.sendFile(m.chat, vn, 'menu.mp3', null, m, true, {
type: 'audioMessage', 
ptt: true})
} catch (e) {
conn.reply(m.chat, `${fg}𝙀𝙍𝙍𝙊𝙍 𝙀𝙉 𝙀𝙇 𝙈𝙀𝙉𝙐, 𝙍𝙀𝙋𝙊𝙍𝙏𝘼 𝘾𝙊𝙉 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 *#reporte*\n\n𝙀𝙍𝙍𝙊𝙍 𝙄𝙉 𝙏𝙃𝙀 𝙈𝙀𝙉𝙐, 𝙍𝙀𝙋𝙊𝙍𝙏 𝙏𝙃𝙄𝙎 𝙒𝙄𝙏𝙃 𝙏𝙃𝙀 𝘾𝙊𝙈𝙈𝘼𝙉𝘿 *#report*`, m)
throw e
}}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(menucompleto|allmenu|allm\?)$/i
//handler.register = true
handler.exp = 50
handler.fail = null
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}
