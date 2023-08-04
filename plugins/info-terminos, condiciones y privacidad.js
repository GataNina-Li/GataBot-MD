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
  
//let name = await conn.getName(m.sender)
let pp = './media/menus/Menu1.jpg'
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)
//let user = global.db.data.users[m.sender]
//user.registered = false

let Terminos = `*_Toda la informacion que se mencione aqui no excluye a la Propietaria del Bot, y Propietarios Acredores al uso de GataBot-MD_*
*_No Somos responsables del desconocimiento que tenga por parte de esta informacion._* 


*TERMINOS DE PRIVACIDAD*
_- Somos consciente del constante uso que le pueda dar al Bot, y tambien Garantizamos que la informaciin como (imagenes, videos, enlaces, ubicacion, Audios, Stickers, Gif, Contactos que Usted Proporcione en torno a Numero(s) Oficial(es) No son ni seran Compartido Con Nadie, ni se usaran dicho Datos fuera del entorno del BOT._

_- Lo que realice con el BOT queda solo en Usted ya que en Numero(s) Oficial(es) El Chat se Borra cada 24 Horas, segun el tiempo de Mensajes Temporales de WhatsApp._

_- Es posible que en Numero(s) Oficial(es) el Bot no este Activado las 24 Horas de los 7 dias de la Semana, eso no implica que no lo este o que Propietarios NO OFICIALES puedan Hacerlo._

_- El chat anonimo del comando #start, valga la redundancia no mostrará ningun dato de los Usuarios por parte de GataBot. Eso no implica que las personas que hagan uso de esta funcion puedan dar a conocer sus datos. en Numero(s) Oficial(es)._

_- Los Datos que Obtenga GataBot en Cuentas Oficiales de Usuarios(as), Grupos y Ajustes del Mismo puede verse Reiniciado, Modificado, y/o Retificado con el fin de que el Bot este en optimas Condiciones para su Uso. (Usuarios(as) Pueden Pedir Compensacion Por Instagram o por el comando #Reporte. Debe de Presentar Pruebas)._

_- NO somos responsable si Hay alteraciones de este Bot no siendo Numero(s) Oficial(es) y tengan de uso un Repositorio de GitHub que no corresponda al Oficial, o que implementen Usuarios de Terceros integraciones que comprometan a los(as) Usuarios(as) al utilizar Versiones no Oficiales._

_- La funcion Sub Bot Garantiza la seguridad de sus Datos aplicada a Cuentas Oficiales._


*TERMINOS DE USO* 
_- La informacion que haya en este Bot y el/la usuario/a Haga uso de las Mismas asumirán saber los Terminos y Condiciones de tal forma que no habrá incovenientes al hacer un uso Particular de las Funciones del Bot._

_- El Bot contiene Material que solo puede ser visible para mayores de 18 Años, NO somos responsable si no cumple con la edad minima para usar el Material para Adultos._

_- Las imagenes, Videos y Audios que tenga este Bot son de uso Publico, Pero se considerarse Falta de Respeto al realizar Ediciones en el Material ya exitente que porte Nombre del Bot o informacion relevante._

_- Al hacer uso de una solicitud para ingreso de grupo con Una Cuenta Oficial, es recomendable que el grupo no cuente con temas de Odio, virus, contenido indebido, temas de discriminacion u campaña sin fundamentos._

_- Si ha recibido un Comunicado Oficial siendo Numero(s) Oficial(es) Mantener el Respeto de la misma manera si recibe un Mensaje sin haber usado un Comando Mantener el Respeto ya que puede en este ultimo caso ser una Persona Real._

_- Las Cuentas Oficiales de GataBot no se hacen responsable del Uso que usted haga con la funci贸n "Sub Bot"._


*CONDICIONES DE USO*
_- NO haga ni intente Llamar o hacer Videollamada al Bot siendo Numero(s) Oficial(es) ya que obstaculiza el funcionamiento del BOT._

_- NO usar el Bot siendo Numero(s) Oficial(es) para llevar a cabo alguna accion hostil que pueda verse comprometida el Funcionamiento del BOT._

_- NO use el comando de SPAM repetidamente, ya que Provocar un Mal funcionamiento en el BOT, tampoco envie al BOT mensajes que puedan comprometer el Funcionamiento de la misma._

_- Al hacer uso de ciertos comandos que tengan como objetivo socavar la incomodidad, intranquilidad, molestia u otro termino tajante, se tomarian las respectivas sanciones o llamados de alerta para prevalecer la integridad de los/las Usuarios(as) y funcionamiento de GataBot._


*ESTE ES EL REPOSITORIO OFICIAL*
*${md}

*CUENTA OFICIAL DE ASISTENCIA - INSTAGRAM*
~ _Solo en esta Cuenta Respondo si tiene Dudas, Preguntas o Necesita Ayuda sobre GataBot, Tambien puede Comunicarse en Caso de Temas de Colaboracion_
*${ig}*

*DONAR A LA CREADORA EN ESTA CUENTA OFICIAL*
~ _Si te Agrada y valoras el Trabajo que he realizado, puedes ayudarme en Donar para que pueda continuar en este Proyecto_
*https://paypal.me/OficialGD*

*~ Muchas Gracias Por tomarte el tiempo en informate sobre GataBot*` 
await conn.sendFile(m.chat, pp, 'gata.mp4', Terminos)
/*.trim()
conn.sendHydrated(m.chat, Terminos,  `${wm}\nEstamos de acuerdo en Hacer Colaboraciones con Personas Comprometidas, manteniendo el Respeto Puedes Contactar si ese es el caso a esta Cuenta Oficial | https://www.instagram.com/gata_dios`, pp, 'https://github.com/GataNina-Li/GataBot-MD', '饾檪饾櫀饾櫓饾櫀饾樈饾櫎饾櫓-饾檲饾樋', null, null, [
['饾檲饾櫄饾櫍饾櫔虂 饾櫂饾櫎饾櫌饾櫏饾櫋饾櫄饾櫓饾櫎 | 饾檨饾櫔饾櫋饾櫋 饾檲饾櫄饾櫍饾櫔 馃挮', '.allmenu'],
['饾檲饾櫄饾櫍饾櫔 饾櫃饾櫄饾櫒饾櫏饾櫋饾櫄饾櫆饾櫀饾櫁饾櫋饾櫄 | 饾檲饾櫄饾櫍饾櫔 饾檱饾櫈饾櫒饾櫓 馃専', '/menulista'],
['饾檲饾櫄饾櫍饾櫔 饾檵饾櫑饾櫈饾櫍饾櫂饾櫈饾櫏饾櫀饾櫋 | 饾檲饾櫀饾櫈饾櫍 饾櫌饾櫄饾櫍饾櫔 鈿?', '#menu']
], m,)*/
}
handler.customPrefix = /terminos|t茅rminos|t茅rminos, condiciones y privacidad|terminos, condiciones y privacidad|t茅rminos y condiciones y privacidad|terminosycondicionesyprivacidad|terminosycondiciones|terminos y condiciones y privacidad|terminos y condiciones|terminos y condiciones|terminos de uso|Terminos de uso|Termin贸 se uso|t茅rminos de uso|T茅rminos de uso|T茅rminos y condiciones/i
handler.command = new RegExp
handler.register = true
handler.exp = 70
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}
