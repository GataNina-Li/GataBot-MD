import { xpRange } from '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
let handler = async (m, { conn, usedPrefix, command, args, usedPrefix: _p, __dirname, isOwner, text, isAdmin, isROwner }) => {
  
  
const { levelling } = '../lib/levelling.js'
//let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text }) => {

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
//let pp = './media/menus/Menuvid3.mp4'
//let user = global.db.data.users[m.sender]
//user.registered = false
  
 let str = `
╭━━〔 🐈⚡️🐈⚡️🐈⚡️🐈 〙━━⬣   
┃ 💖 ¡Hola! ${username} 💖
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *𝙈𝙀𝙉𝙐 𝘿𝙀 𝘼𝙐𝘿𝙄𝙊𝙎*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *No es necesario el prefijo*
┃ *Puede solo escribir la*
┃ *Palabra o Frase.*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
⎪➫🔊 _A-_
⎪➫🔊 _Aaa es demasiado sexo_
⎪➫🔊 _Alabado sea el sexooo_
⎪➫🔊 _Anashe | 😏🍔_
⎪➫🔊 _🚨_
⎪➫🔊 _Atencion grupo_
⎪➫🔊 _Audio hentai_
⎪➫🔊 _A nadie le importa_
⎪➫🔊 _Ara ara_
⎪➫🔊 _Among us_
⎪➫🔊 _Abduzcan_
⎪➫🔊 _Buenos dias_
⎪➫🔊 _Baneado_
⎪➫🔊 _Bañate_
⎪➫🔊 _Bot puto_
⎪➫🔊 _Bv_
⎪➫🔊 _Basado_
⎪➫🔊 _Basada_
⎪➫🔊 _Bien pensado Woody_
⎪➫🔊 _Bueno si_
⎪➫🔊 _Buenas noches_
⎪➫🔊 _Bueno Master | 🫂_
⎪➫🔊 _Bienvenido/a | 🤗_
⎪➫🔊 _Buen día grupo | 🙌_
⎪➫🔊 _Blackpink in your area_
⎪➫🔊 _Chichotas asi de grandes peter_
⎪➫🔊 _Corte corte_
⎪➫🔊 _Calla Fan de BTS_
⎪➫🔊 _Cambiate a Movistar_
⎪➫🔊 _Contexto_
⎪➫🔊 _Callate | 🤫_
⎪➫🔊 _Chau | 👋_
⎪➫🔊 _DIVINO | 💋_
⎪➫🔊 _Depresion_
⎪➫🔊 _Diablos Señorita | 😈_
⎪➫🔊 _En caso de una investigación_
⎪➫🔊 _Elmo sabe donde vives_
⎪➫🔊 _Eres Fuerte_
⎪➫🔊 _El rap de Fernanfloo_
⎪➫🔊 _Está Zzzz_
⎪➫🔊 _El tóxico_
⎪➫🔊 _Esto va para ti_
⎪➫🔊 _El pepe_
⎪➫🔊 _Esto va ser épico papus_
⎪➫🔊 _Entrada épica_ 
⎪➫🔊 _Estoy triste_
⎪➫🔊 _Enojada_
⎪➫🔊 _Enojado_
⎪➫🔊 _Es puto_
⎪➫🔊 _Fino señores_
⎪➫🔊 _Feliz cumpleaños | 🥳 | 🎉_
⎪➫🔊 _Feliz navidad_
⎪➫🔊 _Fiesta del admin_
⎪➫🔊 _Fiesta del admin 2_
⎪➫🔊 _Fiesta del administrador_
⎪➫🔊 _Hasta la proxima_
⎪➫🔊 _Hablar primos_
⎪➫🔊 _Hmm rico_
⎪➫🔊 _Hablame_
⎪➫🔊 _Hentai_
⎪➫🔊 _Hey_
⎪➫🔊 _Homero chino_
⎪➫🔊 _Hola_
⎪➫🔊 _Ingresa épicamente_
⎪➫🔊 _Jaja el pendejo | 🤣_
⎪➫🔊 _Jijija | 😂_
⎪➫🔊 _Joder esas tetas no dejan de mirarme_
⎪➫🔊 _Jesucristo_
⎪➫🔊 _Los que se pelean se aman_
⎪➫🔊 _Leche | 🥛_
⎪➫🔊 _La roca | 🤨_
⎪➫🔊 _Las reglas del grupo_
⎪➫🔊 _La voz de hombre_
⎪➫🔊 _La biblia_
⎪➫🔊 _LESS GO_
⎪➫🔊 _Motivación_
⎪➫🔊 _Muchachos_
⎪➫🔊 _Moshi moshi_
⎪➫🔊 _Momento equisde | Momento XD_
⎪➫🔊 _Me anda buscando anonymous_
⎪➫🔊 _Ma ma masivo_
⎪➫🔊 _Miedo_
⎪➫🔊 _Masivo_
⎪➫🔊 _Me voy_
⎪➫🔊 _Me pican los cocos_
⎪➫🔊 _Murio el grupo_
⎪➫🔊 _Marica quien_
⎪➫🔊 _Me olvidé_
⎪➫🔊 _Nya | 🐱_
⎪➫🔊 _Noche de paz_
⎪➫🔊 _Noche de paz_
⎪➫🔊 _No Rompas más | 💔_
⎪➫🔊 _Nico nico_
⎪➫🔊 _No me hagas usar esto_
⎪➫🔊 _No chu_
⎪➫🔊 _No me hables_
⎪➫🔊 _Nadie te preguntó_
⎪➫🔊 _Niconico_
⎪➫🔊 _No digas eso papu_
⎪➫🔊 _Nyanpasu_
⎪➫🔊 _Orale_
⎪➫🔊 _🚬🐛_
⎪➫🔊 _Omaiga_
⎪➫🔊 _Ohayo_
⎪➫🔊 _Oh me vengo_
⎪➫🔊 _Onichan_
⎪➫🔊 _Porque me excita tanto | 🥵_
⎪➫🔊 _Porque ta tite_
⎪➫🔊 _Potaxio | 🥑_
⎪➫🔊 _Pasen furras_
⎪➫🔊 _Pokémon_
⎪➫🔊 _Pikachu_
⎪➫🔊 _Pero esto_
⎪➫🔊 _Pasa pack Bot_
⎪➫🔊 _Puta que rico | 🍑_
⎪➫🔊 _Que ricas tetas_
⎪➫🔊 _Que linda que estas hija de puta_
⎪➫🔊 _Que dice? | 😐_
⎪➫🔊 _Que tal grupo_
⎪➫🔊 _Que sucede_
⎪➫🔊 _Quien es tu sempai botsito 7w7_
⎪➫🔊 _Rawr_
⎪➫🔊 _🕺_
⎪➫🔊 _Salimo en caravana_
⎪➫🔊 _Si o no pendejo_
⎪➫🔊 _Sexo_
⎪➫🔊 _Su nivel de pendejo_
⎪➫🔊 _Se están riendo de mí_
⎪➫🔊 _Siuuu_
⎪➫🔊 _Troleado_
⎪➫🔊 _Toy Chica_
⎪➫🔊 _Turi ip ip ip | 🐶_
⎪➫🔊 _Traiganle una falda_
⎪➫🔊 _Tal vez_
⎪➫🔊 _Te gusta el Pepino | 🥒_
⎪➫🔊 _Todo bien_
⎪➫🔊 _Tengo los calzones del admin_
⎪➫🔊 _Triste_
⎪➫🔊 _Te diagnostico con gay_
⎪➫🔊 _Te amo_
⎪➫🔊 _Tunometecabrasaramambiche_
⎪➫🔊 _UwU_
⎪➫🔊 _Un pato_
⎪➫🔊 _Una pregunta_
⎪➫🔊 _Usted está detenido_
⎪➫🔊 _Viernes_
⎪➫🔊 _Viernes de la jungla_
⎪➫🔊 _Vete a la vrg_
⎪➫🔊 _Verdad que te engañe_
⎪➫🔊 _Vivan los novios_
⎪➫🔊 _Wenomechainsama | 🐹_
⎪➫🔊 _Wtf_
⎪➫🔊 _Wtf y este random?_
⎪➫🔊 _Yumbi yumbi | 🤠_
⎪➫🔊 _Y Digo Wo_
⎪➫🔊 _Yamete_
⎪➫🔊 _Yoshi_
⎪➫🔊 _Yokese_
⎪➫🔊 _Ya antojaron_
⎪➫🔊 _Y este quien es_
⎪➫🔊 _:c_
╰━━━━━━〔 *𓃠 ${vs}* 〕━━━━━━⬣
`.trim()
await conn.sendHydrated(m.chat, str, wm, null, md, '𝙵𝚞𝚝𝚊𝚋𝚞𝙱𝚘𝚝-𝙼𝙳', null, null, [
['𝙈𝙚𝙣𝙪́ 𝙘𝙤𝙢𝙥𝙡𝙚𝙩𝙤 | 𝙁𝙪𝙡𝙡 𝙈𝙚𝙣𝙪 💫', '.allmenu'],
['𝙈𝙚𝙣𝙪 𝙙𝙚𝙨𝙥𝙡𝙚𝙜𝙖𝙗𝙡𝙚 | 𝙈𝙚𝙣𝙪 𝙇𝙞𝙨𝙩 🌟', '/menulista'],
['𝙈𝙚𝙣𝙪 𝙋𝙧𝙞𝙣𝙘𝙞𝙥𝙖𝙡 | 𝙈𝙖𝙞𝙣 𝙢𝙚𝙣𝙪 ⚡', '#menu']
], m)  
  
  

const sections = [
{
title: `𝙇𝙄𝙎𝙏𝘼 𝘿𝙀𝙎𝙋𝙇𝙀𝙂𝘼𝘽𝙇𝙀 | 𝘿𝙍𝙊𝙋-𝘿𝙊𝙒𝙉 𝙇𝙄𝙎𝙏`,
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

{title: "❇️ 𝙈𝙚𝙣𝙪 𝙋𝙧𝙞𝙣𝙘𝙞𝙥𝙖𝙡 |  𝘿𝙖𝙨𝙝𝙗𝙤𝙖𝙧𝙙 ❇️", description: null, rowId: `${usedPrefix}menu`},
{title: "✳️ 𝙈𝙚𝙣𝙪 𝘾𝙤𝙢𝙥𝙡𝙚𝙩𝙤 | 𝙁𝙪𝙡𝙡 𝙈𝙚𝙣𝙪 ✳️", description: null, rowId: `${usedPrefix}allmenu`},
{title: "✅ 𝘾𝙪𝙚𝙣𝙩𝙖𝙨 𝙊𝙛𝙞𝙘𝙞𝙖𝙡𝙚𝙨 | 𝘼𝙘𝙘𝙤𝙪𝙣𝙩𝙨 ✅", description: null, rowId: `${usedPrefix}cuentasgatabot`},  
]}, ]
//let name = await conn.getName(m.sender)

const listMessage = {
text: `𝙵𝚞𝚝𝚊𝚋𝚞𝙱𝚘𝚝-𝙼𝙳 | 𝘼𝙐𝘿𝙄𝙊𝙎`,
footer: `*╭━━━〔 𝙈𝙀𝙉𝙐 𝘿𝙄𝙉𝘼𝙈𝙄𝘾𝙊 〕━━━⬣*
*┃ 𝙃𝙚𝙮! 𝙖𝙦𝙪𝙞 𝙥𝙪𝙚𝙙𝙚 𝙚𝙡𝙚𝙜𝙞𝙧*
*┃ 𝙚𝙡 𝘼𝙪𝙙𝙞𝙤 𝙖 𝙨𝙚𝙧 𝙪𝙩𝙞𝙡𝙞𝙯𝙖𝙙𝙤.*
*╰━━━━━━━━━━━━━━━━━⬣*
${wm}`,
title: null,
buttonText: "𝙎𝙀𝙇𝙀𝘾𝘾𝙄𝙊𝙉𝘼𝙍 𝘼𝙐𝘿𝙄𝙊", 
sections }

 conn.sendMessage(m.chat, listMessage)

}

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
