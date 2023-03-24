import { xpRange } from '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, args, usedPrefix: _p, __dirname, isOwner, text, isAdmin, isROwner }) => {
try{ 
const { levelling } = '../lib/levelling.js'
let { exp, limit, level, role } = global.db.data.users[m.sender]
let { min, xp, max } = xpRange(level, global.multiplier)

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
let muptime = clockString(_muptime)
let uptime = clockString(_uptime)
let totalreg = Object.keys(global.db.data.users).length
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
let replace = {
'%': '%',
p: _p, uptime, muptime,
me: conn.getName(conn.user.jid),

exp: exp - min,
maxexp: xp,
totalexp: exp,
xp4levelup: max - exp,

level, limit, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
readmore: readMore
}
text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
 
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)
let user = global.db.data.users[m.sender]
//user.registered = false

let pp = gataVidMenu.getRandom()
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let fsizedoc = '1'.repeat(10)
let adReply = { fileLength: fsizedoc, seconds: fsizedoc, contextInfo: { forwardingScore: fsizedoc, externalAdReply: { showAdAttribution: true, title: wm, body: '👋 ' + username, mediaUrl: ig, description: 'Hola', previewType: 'PHOTO', thumbnail: await(await fetch(gataMenu.getRandom())).buffer(), sourceUrl: redesMenu.getRandom() }}}

let str = `
╭┄〔 *${wm}* 〕┄⊱
┊ *🎶 ${lenguajeGB['smsConfi2']()} ${username}*
┊დ *${week}, ${date}*
┊დ *${lenguajeGB['smsBotonM4']()} » ${Object.keys(global.db.data.users).length}* 
┊
┊დ *${lenguajeGB['smsBotonM5']()} »* ${role}
┊დ *${lenguajeGB['smsBotonM6']()} » ${level}*
┊დ *${lenguajeGB['smsBotonM7']()} »* ${user.premiumTime > 0 ? '✅' : '❌'}
╰┄┄┄┄〔 *𓃠 ${vs}* 〕┄┄┄┄⊱

⠇ *${lenguajeGB['smsTex16']()}* 🔊
⠇ ${lenguajeGB['smsTex17']()}
∘ _Noche de paz_
∘ _Buenos dias_
∘ _Audio hentai_
∘ _Fiesta del admin_
∘ _Fiesta del admin 2_
∘ _Fiesta del administrador_ 
∘ _Viernes_
∘ _Mierda de Bot_
∘ _Me olvidé_
∘ _Baneado_
∘ _Feliz navidad_
∘ _A nadie le importa_
∘ _Sexo_
∘ _Vete a la vrg_
∘ _Ara ara_
∘ _Hola_
∘ _Un pato_
∘ _Nyanpasu_
∘ _Te amo_
∘ _Yamete_
∘ _Te diagnostico con gay_
∘ _Quien es tu sempai botsito 7w7_
∘ _Bañate_
∘ _Vivan los novios_
∘ _Marica quien_
∘ _Es puto_
∘ _La biblia_
∘ _Onichan_
∘ _Bot puto_
∘ _Feliz cumpleaños_
∘ _Pasa pack Bot_
∘ _Atencion grupo_
∘ _Homero chino_
∘ _Oh me vengo_
∘ _Murio el grupo_
∘ _Siuuu_
∘ _Rawr_
∘ _UwU_
∘ _:c_
∘ _a_
∘ _Hey_
∘ _Enojado_
∘ _Enojada_
∘ _Chao_
∘ _Hentai_
∘ _Triste_
∘ _Estoy triste_
∘ _Me pican los cocos_
∘ _Contexto_
∘ _Me voy_
∘ _Tengo los calzones del admin_
∘ _Entrada épica_ 
∘ _Esto va ser épico papus_
∘ _Ingresa épicamente_
∘ _Bv_
∘ _Yoshi_
∘ _No digas eso papu_
∘ _Ma ma masivo_
∘ _Masivo_
∘ _Basado_
∘ _Basada_
∘ _Fino señores_
∘ _Verdad que te engañe_
∘ _Sus_
∘ _Ohayo_
∘ _La voz de hombre_
∘ _Pero esto_
∘ _Bien pensado Woody_
∘ _Jesucristo_
∘ _Wtf_
∘ _Una pregunta_
∘ _Que sucede_
∘ _Hablame_
∘ _Pikachu_
∘ _Niconico_
∘ _Yokese_
∘ _Omaiga_
∘ _Nadie te preguntó_
∘ _Bueno si_
∘ _Usted está detenido_
∘ _No me hables_
∘ _No chu_
∘ _El pepe_
∘ _Pokémon_
∘ _No me hagas usar esto_
∘ _Esto va para ti_
∘ _Abduzcan_
∘ _Joder_
∘ _Hablar primos_
∘ _Mmm_
∘ _Orale_
∘ _Me anda buscando anonymous_
∘ _Blackpink in your area_
∘ _Cambiate a Movistar_
∘ _Momento equisde | Momento XD_
∘ _Todo bien | 😇_
∘ _Te gusta el Pepino | 🥒_
∘ _El tóxico_
∘ _Moshi moshi_
∘ _Calla Fan de BTS_
∘ _Que tal grupo_
∘ _Muchachos_
∘ _Está Zzzz | 😴_
∘ _Goku Pervertido_
∘ _Potaxio | 🥑_
∘ _Nico nico_
∘ _El rap de Fernanfloo_
∘ _Tal vez_
∘ _Corte corte_
∘ _Buenas noches_
∘ _Porque ta tite_
∘ _Eres Fuerte_
∘ _Bueno Master | 🫂_
∘ _No Rompas más_
∘ _Traiganle una falda_
∘ _Se están riendo de mí_
∘ _Su nivel de pendejo_
∘ _Bienvenido/a 🥳 | 👋_
∘ _Elmo sabe donde vives_
∘ _tunometecabrasaramambiche_
∘ _Y este quien es_
∘ _Motivación_
∘ _En caso de una investigación_
∘ _Buen día grupo | 🙌_
∘ _Las reglas del grupo_
∘ _Oye | 🐔_
∘ _Ig de la minita_
∘ _Gaspi frase_
∘ _Vamos!!_
∘ _Se pudrio_
∘ _Gol!_

╭════• ೋ•✧๑♡๑✧•ೋ •════╮
                      🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈
         0:40 ━❍──────── -8:39
         ↻     ⊲  Ⅱ  ⊳     ↺
         VOLUMEN: ▁▂▃▄▅▆▇ 100%
╰════• ೋ•✧๑♡๑✧•ೋ •════╯`.trim()
    conn.sendFile(m.chat, pp, 'lp.jpg', str, m, false, { contextInfo: { mentionedJid }})
/*let menuA = `🎶 ${lenguajeGB['smsConfi2']()} *${username}*`.trim()
let menuB = `
╭┄〔 *${wm}* 〕┄⊱
┊დ *${week}, ${date}*
┊დ *${lenguajeGB['smsBotonM4']()} » ${Object.keys(global.db.data.users).length}* 
┊
┊დ *${lenguajeGB['smsBotonM5']()} »* ${role}
┊დ *${lenguajeGB['smsBotonM6']()} » ${level}*
┊დ *${lenguajeGB['smsBotonM7']()} »* ${user.premiumTime > 0 ? '✅' : '❌'}
╰┄┄┄┄〔 *𓃠 ${vs}* 〕┄┄┄┄⊱
⠇ *${lenguajeGB['smsTex16']()}* 🔊
⠇ ${lenguajeGB['smsTex17']()}
∘ _A-_
∘ _Aaa es demasiado sexo_
∘ _Alabado sea el sexooo_
∘ _Anashe | 😏🍔_
∘ _🚨_
∘ _Atencion grupo_
∘ _Audio hentai_
∘ _A nadie le importa_
∘ _Ara ara_
∘ _Among us_
∘ _Abduzcan_
∘ _Buenos dias_
∘ _Baneado_
∘ _Bañate_
∘ _Bot puto_
∘ _Bv_
∘ _Basado_
∘ _Basada_
∘ _Bien pensado Woody_
∘ _Bueno si_
∘ _Buenas noches_
∘ _Bueno Master | 🫂_
∘ _Bienvenido/a | 🤗_
∘ _Buen día grupo | 🙌_
∘ _Blackpink in your area_
∘ _Chichotas asi de grandes peter_
∘ _Corte corte_
∘ _Calla Fan de BTS_
∘ _Cambiate a Movistar_
∘ _Contexto_
∘ _Callate | 🤫_
∘ _Chau | 👋_
∘ _DIVINO | 💋_
∘ _Depresion_
∘ _Diablos Señorita | 😈_
∘ _En caso de una investigación_
∘ _Elmo sabe donde vives_
∘ _Eres Fuerte_
∘ _El rap de Fernanfloo_
∘ _Está Zzzz_
∘ _El tóxico_
∘ _Esto va para ti_
∘ _El pepe_
∘ _Esto va ser épico papus_
∘ _Entrada épica_ 
∘ _Estoy triste_
∘ _Enojada_
∘ _Enojado_
∘ _Es puto_
∘ _Fino señores_
∘ _Feliz cumpleaños | 🥳 | 🎉_
∘ _Feliz navidad_
∘ _Fiesta del admin_
∘ _Fiesta del admin 2_
∘ _Fiesta del administrador_
∘ _Hasta la proxima_
∘ _Hablar primos_
∘ _Hmm rico_
∘ _Hablame_
∘ _Hentai_
∘ _Hey_
∘ _Homero chino_
∘ _Hola_
∘ _Ingresa épicamente_
∘ _Jaja el pendejo | 🤣_
∘ _Jijija | 😂_
∘ _Joder esas tetas no dejan de mirarme_
∘ _Jesucristo_
∘ _Los que se pelean se aman_
∘ _Leche | 🥛_
∘ _La roca | 🤨_
∘ _Las reglas del grupo_
∘ _La voz de hombre_
∘ _La biblia_
∘ _LESS GO_
∘ _Motivación_
∘ _Muchachos_
∘ _Moshi moshi_
∘ _Momento equisde | Momento XD_
∘ _Me anda buscando anonymous_
∘ _Ma ma masivo_
∘ _Miedo_
∘ _Masivo_
∘ _Me voy_
∘ _Me pican los cocos_
∘ _Murio el grupo_
∘ _Marica quien_
∘ _Me olvidé_
∘ _Nya | 🐱_
∘ _Noche de paz_
∘ _Noche de paz_
∘ _No Rompas más | 💔_
∘ _Nico nico_
∘ _No me hagas usar esto_
∘ _No chu_
∘ _No me hables_
∘ _Nadie te preguntó_
∘ _Niconico_
∘ _No digas eso papu_
∘ _Nyanpasu_
∘ _Orale_
∘ _🚬🐛_
∘ _Omaiga_
∘ _Ohayo_
∘ _Oh me vengo_
∘ _Onichan_
∘ _Porque me excita tanto | 🥵_
∘ _Porque ta tite_
∘ _Potaxio | 🥑_
∘ _Pasen furras_
∘ _Pokémon_
∘ _Pikachu_
∘ _Pero esto_
∘ _Pasa pack Bot_
∘ _Puta que rico | 🍑_
∘ _Que ricas tetas_
∘ _Que linda que estas hija de puta_
∘ _Que dice? | 😐_
∘ _Que tal grupo_
∘ _Que sucede_
∘ _Quien es tu sempai botsito 7w7_
∘ _Rawr_
∘ _🕺_
∘ _Salimo en caravana_
∘ _Si o no pendejo_
∘ _Sexo_
∘ _Su nivel de pendejo_
∘ _Se están riendo de mí_
∘ _Siuuu_
∘ _Troleado_
∘ _Toy Chica_
∘ _Turi ip ip ip | 🐶_
∘ _Traiganle una falda_
∘ _Tal vez_
∘ _Te gusta el Pepino | 🥒_
∘ _Todo bien_
∘ _Tengo los calzones del admin_
∘ _Triste_
∘ _Te diagnostico con gay_
∘ _Te amo_
∘ _Tunometecabrasaramambiche_
∘ _UwU_
∘ _Un pato_
∘ _Una pregunta_
∘ _Usted está detenido_
∘ _Viernes_
∘ _Viernes de la jungla_
∘ _Vete a la vrg_
∘ _Verdad que te engañe_
∘ _Vivan los novios_
∘ _Wenomechainsama | 🐹_
∘ _Wtf_
∘ _Wtf y este random?_
∘ _Yumbi yumbi | 🤠_
∘ _Y Digo Wo_
∘ _Yamete_
∘ _Yoshi_
∘ _Yokese_
∘ _Ya antojaron_
∘ _Y este quien es_
∘ _:c_
∘ _Bienvenido/a 🥳 | 👋_
∘ _Elmo sabe donde vives_
∘ _tunometecabrasaramambiche_
∘ _Y este quien es_
∘ _Motivación_
∘ _En caso de una investigación_
∘ _Buen día grupo | 🙌_
∘ _Las reglas del grupo_
∘ _Oye | 🐔_
∘ _Ig de la minita_
∘ _Gaspi frase_
∘ _Vamos!!_
∘ _Se pudrio_
∘ _Gol!_`.trim()
  
await conn.sendButtonVid(m.chat, pp, menuA, menuB, lenguajeGB.smsBotonM1(), '.menu', lenguajeGB.smsBotonM2(), '/allmenu', lenguajeGB.smsBotonM3(), '#inventario', fkontak, adReply)
*/
const sections = [
{
title: `${lenguajeGB.smsTex18()}`,
rows: [
{title: "➥🔊 A-", description: null, rowId: `A-`},
{title: "➥🔊 Aaa es demasiado sexo", description: null, rowId: `Aaa es demasiado sexo`},
{title: "➥🔊 Alabado sea el sexooo", description: null, rowId: `Alabado sea el sexooo`},
{title: "➥🔊 Anashe", description: null, rowId: `😏🍔`},
{title: "➥🔊 🚨", description: null, rowId: `🚨`},
{title: "➥🔊 Atencion grupo", description: null, rowId: `Atencion grupo`},
{title: "➥🔊 Audio hentai", description: null, rowId: `Audio hentai`},
{title: "➥🔊 A nadie le importa", description: null, rowId: `A nadie le importa`},
{title: "➥🔊 Ara ara", description: null, rowId: `Ara ara`},
{title: "➥🔊 Among us", description: null, rowId: `Among us`},
{title: "➥🔊 Abduzcan", description: null, rowId: `Abduzcan`},
{title: "➥🔊 Buenos dias", description: null, rowId: `Buenos dias`},
{title: "➥🔊 Baneado", description: null, rowId: `Baneado`},
{title: "➥🔊 Bañate", description: null, rowId: `Bañate`},
{title: "➥🔊 Bot puto", description: null, rowId: `Bot puto`},
{title: "➥🔊 Bv", description: null, rowId: `Bv`},
{title: "➥🔊 Basado", description: null, rowId: `Basado`},
{title: "➥🔊 Bien pensado Woody", description: null, rowId: `Bien pensado Woody`},
{title: "➥🔊 Bueno si", description: null, rowId: `Bueno si`},
{title: "➥🔊 Buenas noches", description: null, rowId: `Buenas noches`},
{title: "➥🔊 Bueno Master", description: null, rowId: `🫂`},
{title: "➥🔊 Bienvenido/a", description: null, rowId: `🤗`},
{title: "➥🔊 Buen día grupo", description: null, rowId: `🙌`},
{title: "➥🔊 Blackpink in your area", description: null, rowId: `Blackpink in your area`},
{title: "➥🔊 Chichotas asi de grandes peter", description: null, rowId: `Chichotas asi de grandes peter`},
{title: "➥🔊 Corte corte", description: null, rowId: `Corte corte`},
{title: "➥🔊 Calla Fan de BTS", description: null, rowId: `Calla Fan de BTS`},
{title: "➥🔊 Cambiate a Movistar", description: null, rowId: `Cambiate a Movistar`},
{title: "➥🔊 Contexto", description: null, rowId: `Contexto`},
{title: "➥🔊 Callate", description: null, rowId: `🤫`},
{title: "➥🔊 Chau", description: null, rowId: `👋`},
{title: "➥🔊 DIVINO", description: null, rowId: `💋`},
{title: "➥🔊 Depresion", description: null, rowId: `Depresion`},
{title: "➥🔊 Diablos Señorita", description: null, rowId: `😈`},
{title: "➥🔊 En caso de una investigación", description: null, rowId: `En caso de una investigación`},
{title: "➥🔊 Elmo sabe donde vives", description: null, rowId: `Elmo sabe donde vives`},
{title: "➥🔊 Eres Fuerte", description: null, rowId: `Eres Fuerte`},
{title: "➥🔊 El rap de Fernanfloo", description: null, rowId: `El rap de Fernanfloo`},
{title: "➥🔊 Está Zzzz", description: null, rowId: `😴`},
{title: "➥🔊 El tóxico", description: null, rowId: `El tóxico`},
{title: "➥🔊 Esto va para ti", description: null, rowId: `Esto va para ti`},
{title: "➥🔊 El pepe", description: null, rowId: `El pepe`},
{title: "➥🔊 Esto va ser épico papu", description: null, rowId: `Esto va ser épico papu`},
{title: "➥🔊 Entrada épica", description: null, rowId: `Entrada épica`},
{title: "➥🔊 Estoy triste", description: null, rowId: `Estoy triste`},
{title: "➥🔊 Enojado", description: null, rowId: `Enojado`},
{title: "➥🔊 Enojada", description: null, rowId: `Enojada`},
{title: "➥🔊 Es puto", description: null, rowId: `Es puto`},
{title: "➥🔊 Fino señores", description: null, rowId: `Fino señores`},
{title: "➥🔊 Feliz cumpleaños", description: null, rowId: `🎉`},
{title: "➥🔊 Feliz navidad", description: null, rowId: `Estoy triste`},
{title: "➥🔊 Fiesta del admin", description: null, rowId: `Fiesta del admin`},
{title: "➥🔊 Fiesta del admin 2", description: null, rowId: `Fiesta del admin 2`},
{title: "➥🔊 Fiesta del administrador", description: null, rowId: `Fiesta del administrador`},
{title: "➥🔊 Hablar primos", description: null, rowId: `Hablar primos`},
{title: "➥🔊 Hmm rico", description: null, rowId: `Hmm rico`},
{title: "➥🔊 Hablame", description: null, rowId: `Hablame`},
{title: "➥🔊 Hentai", description: null, rowId: `Hentai`},
{title: "➥🔊 Hey", description: null, rowId: `Hey`},
{title: "➥🔊 Hasta la proxima", description: null, rowId: `Hasta la proxima`},
{title: "➥🔊 Homero chino", description: null, rowId: `Homero chino`},
{title: "➥🔊 Hola", description: null, rowId: `Hola`},
{title: "➥🔊 Ingresa épicamente", description: null, rowId: `Ingresa épicamente`},
{title: "➥🔊 Jaja el pendejo", description: null, rowId: `🤣`},
{title: "➥🔊 Jijija", description: null, rowId: `😂`},
{title: "➥🔊 Joder esas tetas no dejan de mirarme", description: null, rowId: `Joder esas tetas no dejan de mirarme`},
{title: "➥🔊 Jesucristo", description: null, rowId: `Jesucristo`},
{title: "➥🔊 Los que se pelean se aman", description: null, rowId: `Los que se pelean se aman`},
{title: "➥🔊 Leche", description: null, rowId: `🥛`},
{title: "➥🔊 La roca", description: null, rowId: `🤨`},
{title: "➥🔊 Las reglas del grupo", description: null, rowId: `Las reglas del grupo`},
{title: "➥🔊 La voz de hombre", description: null, rowId: `La voz de hombre`},
{title: "➥🔊 La biblia", description: null, rowId: `La biblia`},
{title: "➥🔊 LESS GO", description: null, rowId: `LESS GO`},
{title: "➥🔊 Motivación", description: null, rowId: `Motivación`},
{title: "➥🔊 Muchachos", description: null, rowId: `Muchachos`},
{title: "➥🔊 Moshi moshi", description: null, rowId: `Moshi moshi`},
{title: "➥🔊 Momento equisde", description: null, rowId: `Momento XD`},
{title: "➥🔊 Me anda buscando anonymous", description: null, rowId: `Me anda buscando anonymous`},
{title: "➥🔊 Ma ma masivo", description: null, rowId: `Ma ma masivo`},
{title: "➥🔊 Miedo", description: null, rowId: `Miedo`},
{title: "➥🔊 Masivo", description: null, rowId: `Masivo`},
{title: "➥🔊 Me voy", description: null, rowId: `Me voy`},
{title: "➥🔊 Me pican los cocos", description: null, rowId: `Me pican los cocos`},
{title: "➥🔊 Murio el grupo", description: null, rowId: `Murio el grupo`},
{title: "➥🔊 Marica quien", description: null, rowId: `Marica quien`},
{title: "➥🔊 Me olvidé", description: null, rowId: `Me olvidé`},
{title: "➥🔊 Nya", description: null, rowId: `🐱`},
{title: "➥🔊 Noche de paz", description: null, rowId: `Noche de paz`},
{title: "➥🔊 No Rompas más", description: null, rowId: `💔`},
{title: "➥🔊 Nico nico", description: null, rowId: `Nico nico`},
{title: "➥🔊 No me hagas usar esto", description: null, rowId: `No me hagas usar esto`},
{title: "➥🔊 No chu", description: null, rowId: `No chu`},
{title: "➥🔊 No me hables", description: null, rowId: `No me hables`},
{title: "➥🔊 Nadie te preguntó", description: null, rowId: `Nadie te preguntó`},
{title: "➥🔊 Niconico", description: null, rowId: `Niconico`},
{title: "➥🔊 No digas eso papu", description: null, rowId: `No digas eso papu`},
{title: "➥🔊 Nyanpasu", description: null, rowId: `Nyanpasu`},
{title: "➥🔊 Orale", description: null, rowId: `Orale`},
{title: "➥🔊 🚬🐛", description: null, rowId: `🚬🐛`},
{title: "➥🔊 Omaiga", description: null, rowId: `Omaiga`},
{title: "➥🔊 Ohayo", description: null, rowId: `Ohayo`},
{title: "➥🔊 Oh me vengo", description: null, rowId: `Oh me vengo`},
{title: "➥🔊 Onichan", description: null, rowId: `Onichan`},
{title: "➥🔊 Porque me excita tanto", description: null, rowId: `🥵`},
{title: "➥🔊 Porque ta tite", description: null, rowId: `Porque ta tite`},
{title: "➥🔊 Pasen furras", description: null, rowId: `Pasen furras`},
{title: "➥🔊 Potaxio", description: null, rowId: `🥑`},
{title: "➥🔊 Pokémon", description: null, rowId: `Pokémon`},
{title: "➥🔊 Pikachu", description: null, rowId: `Pikachu`},
{title: "➥🔊 Pero esto", description: null, rowId: `Pero esto`},
{title: "➥🔊 Pasa pack Bot", description: null, rowId: `Pasa pack Bot`},
{title: "➥🔊 Puta que rico", description: null, rowId: `🍑`},
{title: "➥🔊 Que ricas tetas", description: null, rowId: `Que ricas tetas`},
{title: "➥🔊 Que linda que estas hija de puta", description: null, rowId: `Que linda que estas hija de puta`},
{title: "➥🔊 Que dice?", description: null, rowId: `😐`},
{title: "➥🔊 Que tal grupo", description: null, rowId: `Que tal grupo`},
{title: "➥🔊 Que sucede", description: null, rowId: `Que sucede`},
{title: "➥🔊 Quien es tu sempai botsito 7w7", description: null, rowId: `Quien es tu sempai botsito 7w7`},
{title: "➥🔊 Rawr", description: null, rowId: `Rawr`},
{title: "➥🔊 🕺", description: null, rowId: `🕺`},
{title: "➥🔊 Salimo en caravana", description: null, rowId: `Salimo en caravana`},
{title: "➥🔊 Si o no pendejo", description: null, rowId: `Si o no pendejo`},
{title: "➥🔊 Sexo", description: null, rowId: `Sexo`},
{title: "➥🔊 Su nivel de pendejo", description: null, rowId: `Su nivel de pendejo`},
{title: "➥🔊 Se están riendo de mí", description: null, rowId: `Se están riendo de mí`},
{title: "➥🔊 Siuuu", description: null, rowId: `Siuuu`},
{title: "➥🔊 Troleado", description: null, rowId: `Troleado`},
{title: "➥🔊 Toy Chica", description: null, rowId: `Toy Chica`},
{title: "➥🔊 Turi ip ip ip", description: null, rowId: `🐶`},
{title: "➥🔊 Traiganle una falda", description: null, rowId: `Traiganle una falda`},
{title: "➥🔊 Tal vez", description: null, rowId: `Tal vez`},
{title: "➥🔊 Te gusta el Pepino", description: null, rowId: `🥒`},
{title: "➥🔊 Todo bien", description: null, rowId: `Todo bien`},
{title: "➥🔊 Tengo los calzones del admin", description: null, rowId: `Tengo los calzones del admin`},
{title: "➥🔊 Triste", description: null, rowId: `Triste`},
{title: "➥🔊 Te diagnostico con gay", description: null, rowId: `Te diagnostico con gay`},
{title: "➥🔊 Te amo", description: null, rowId: `Te amo`},
{title: "➥🔊 Tunometecabrasaramambiche", description: null, rowId: `Tunometecabrasaramambiche`},
{title: "➥🔊 UwU", description: null, rowId: `UwU`},
{title: "➥🔊 Un pato", description: null, rowId: `Un pato`},
{title: "➥🔊 Una pregunta", description: null, rowId: `Una pregunta`},
{title: "➥🔊 Usted está detenido", description: null, rowId: `Usted está detenido`},
{title: "➥🔊 Viernes", description: null, rowId: `Viernes`},
{title: "➥🔊 Viernes de la junga", description: null, rowId: `Viernes de la jungla`},
{title: "➥🔊 Vete a la verga", description: null, rowId: `Vete a la verga`},
{title: "➥🔊 Verdad que te engañe", description: null, rowId: `Verdad que te engañe`},
{title: "➥🔊 Vivan los novios", description: null, rowId: `Vivan los novios`},
{title: "➥🔊 Wenomechainsama", description: null, rowId: `🐹`},
{title: "➥🔊 Wtf", description: null, rowId: `Wtf`},
{title: "➥🔊 Wtf y este random?", description: null, rowId: `Wtf y este random`},
{title: "➥🔊 Yumbi yumbi", description: null, rowId: `🤠`},
{title: "➥🔊 Y Digo Wo", description: null, rowId: `Y Digo Wo`},
{title: "➥🔊 Yamete", description: null, rowId: `Yamete`},
{title: "➥🔊 Yoshi", description: null, rowId: `Yoshi`},
{title: "➥🔊 Yokese", description: null, rowId: `Yokese`},
{title: "➥🔊 Ya antojaron", description: null, rowId: `Ya antojaron`},
{title: "➥🔊 Y este quien es", description: null, rowId: `Y este quien es`},
{title: "➥🔊 :c", description: null, rowId: `:c`},

{title: lenguajeGB['smsLista2'](), description: null, rowId: `${usedPrefix}creadora`},
{title: lenguajeGB['smsLista5'](), description: null, rowId: `${usedPrefix}infomenu`},
{title: lenguajeGB['smsLista6'](), description: null, rowId: `${usedPrefix}allmenu`},  
{title: "➥🔊 Bienvenido/a", description: null, rowId: `Bienvenido`},
{title: "➥🔊 🥳", description: null, rowId: `🥳`},
{title: "➥🔊 👋", description: null, rowId: `👋`},
{title: "➥🔊 Elmo sabe donde vives", description: null, rowId: `Elmo sabe donde vives`},
{title: "➥🔊 tunometecabrasaramambiche", description: null, rowId: `tunometecabrasaramambiche`},
{title: "➥🔊 Y este quien es", description: null, rowId: `Y este quien es`},
{title: "➥🔊 Motivación", description: null, rowId: `Motivación`},
{title: "➥🔊 En caso de una investigación", description: null, rowId: `En caso de una investigación`},
{title: "➥🔊 Buen día grupo", description: null, rowId: `Buen día grupo`},
{title: "➥🔊 🙌", description: null, rowId: `🙌`},
{title: "➥🔊 Oye", description: null, rowId: `Oye`},
{title: "➥🔊 Ig de la minita", description: null, rowId: `Ig de la minita`},
{title: "➥🔊 Gaspi frase", description: null, rowId: `Gaspi frase`},
{title: "➥🔊 Vamos!!", description: null, rowId: `Vamos`},
{title: "➥🔊 Se pudrio", description: null, rowId: `Se pudrio`},
{title: "➥🔊 Gol!", description: null, rowId: `Gol`},
{title: "➥🔊 Las reglas del grupo", description: null, rowId: `Las reglas del grupo`},
]}, ]

const listMessage = {
text: `${wm}`,
footer: `*${lenguajeGB['smsTex16']()}*
${lenguajeGB['smsTex19']()}`,
title: null,
buttonText: `🔊 ${lenguajeGB['smsTex16']()} 🔊`, 
sections }
await conn.sendMessage(m.chat, listMessage)	

} catch (e) {
await conn.sendButton(m.chat, `\n${wm}`, lenguajeGB['smsMalError3']() + '#report ' + usedPrefix + command, null, [[lenguajeGB.smsMensError1(), `#reporte ${lenguajeGB['smsMensError2']()} *${usedPrefix + command}*`]], m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)	
}}

handler.help = ['infomenu'].map(v => v + 'able <option>')
handler.tags = ['group', 'owner']
handler.command = /^(menu2|audios|menú2|memu2|menuaudio|menuaudios|memuaudios|memuaudio|audios|audio)$/i
handler.exp = 60
//handler.register = true
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}
