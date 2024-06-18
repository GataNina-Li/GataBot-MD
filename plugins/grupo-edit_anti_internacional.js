import fs from 'fs'
let numerosPrefijos, contenido, reply

const handler = async (m, { conn, command, text, usedPrefix, isOwner, isROwner, isAdmin }) => {
if (!isOwner || !isROwner || !isAdmin) return m.reply(mid.mAdvertencia + `*No tienes permisos para usar este comando*`)

if (!text || !/\d/.test(text)) {
m.reply(mid.mInfo + `Agrega el prefijo del código de país, etiqueta o escribe el número de un usuario específico.\n\n> Si son varios, sepáralos por coma (,)\n\n*Ejemplo:*\n- *${usedPrefix +command}* +57\n- *${usedPrefix +command}* +57, +212, @tag, +num\n\n${mid.mAdvertencia}> *Al configurar esto, se eliminarán los usuarios con prefijos configurados o números específicos; ya sea cuando alguien ingrese o cuando escriba en el grupo*`)
return
}
await obtenerPrefijos(text)  
async function obtenerPrefijos(input) {
const prefijos = input.split(',').map(prefijo => prefijo.trim())
const prefijosLimpios = prefijos.map(prefijo => {
let prefijoLimpio = prefijo.replace(/[^0-9+]/g, '')
if (prefijoLimpio.startsWith('+')) {
prefijoLimpio = prefijoLimpio.slice(1)
}
return `+${prefijoLimpio}`
})
numerosPrefijos = prefijosLimpios.map(prefijo => parseInt(prefijo.replace(/\D/g, ''), 10)).filter((valor, indice, self) => self.indexOf(valor) === indice)
  
const prefijosJSON = JSON.stringify(numerosPrefijos)
if (!fs.existsSync('./prefijos.json')) {
await fs.promises.writeFile('prefijos.json', 'false')
}
  
try {
await fs.promises.access('prefijos.json', fs.constants.F_OK)
contenido = await fs.promises.readFile('prefijos.json', 'utf-8')
if (contenido === 'false') {
await fs.promises.writeFile('prefijos.json', prefijosJSON)
const prefijosGuardados = JSON.parse(prefijosJSON)
const prefijosConSigno = prefijosGuardados.map(prefijo => `+${prefijo}`);
m.reply(mid.mExito + `Configuración guardada: *${prefijosConSigno.join(', ')}*\n\n> Puede agregar más si desea`)
} else {
const prefijosGuardados = JSON.parse(contenido)
const prefijosConSigno = prefijosGuardados.map(prefijo => `+${prefijo}`)
reply = (await conn.reply(m.chat, mid.mInfo + `> *Hemos encontrado prefijos/números ya configurados*
*Reciente:* \`\`\`${numerosPrefijos.map(prefijo => `+${prefijo}`).join(', ')}\`\`\`
*Existente:* \`\`\`${prefijosConSigno.join(', ')}\`\`\`\n 
*Responde a este mensaje eligiendo un número para:*
\`\`\`[A]\`\`\` \`Combinar\` _Se juntarán los prefijos existentes con los recientes._\n
\`\`\`[B]\`\`\` \`Reemplazar\` _Se eliminarán los prefijos existentes para agregar los recientes._\n
\`\`\`[C]\`\`\` \`Eliminar\` _Se usarán los prefijos predeterminados, eliminando los existentes y recientes._\n
\`\`\`[D]\`\`\` \`Cancelar\` _No se realizarán cambios._`, m)).key.id
}} catch (error) {
if (error.code === 'ENOENT') {
m.reply(mid.mError + 'El archivo `"prefijos.json"` no existe.')
} else {
console.error('Error al agregar los prefijos en el archivo "prefijos.json": ', error)
}}
}}
  
handler.before = async function (m, { conn, isOwner, isROwner, isAdmin }) {
if (m.quoted && m.quoted.id === reply && ['a', '1', 'combinar'].includes(m.text.toLowerCase())) {
if (!isOwner || !isROwner || !isAdmin) return m.reply(mid.mError + `*Esta acción no te corresponde realizar*`)
try {
await fs.promises.access('prefijos.json', fs.constants.F_OK)
contenido = await fs.promises.readFile('prefijos.json', 'utf-8')
const prefijosExistentes = JSON.parse(contenido)
const prefijosActualizados = [...new Set([...prefijosExistentes, ...numerosPrefijos])]
const prefijosJSON = JSON.stringify(prefijosActualizados)
await fs.promises.writeFile('prefijos.json', prefijosJSON)
contenido = await fs.promises.readFile('prefijos.json', 'utf-8')
const prefijosGuardados = JSON.parse(contenido)
const prefijosConSigno = prefijosGuardados.map(prefijo => `+${prefijo}`)
m.reply(mid.mExito + `Los prefijos se han *combinado* correctamente.\n\n*Nueva configuración:* \`\`\`${prefijosConSigno.join(', ')}\`\`\``)
} catch (error) {
if (error.code === 'ENOENT') {
m.reply(mid.mError + 'El archivo `"prefijos.json"` no existe.')
} else {
console.log('Error al actualizar los prefijos en el archivo "prefijos.json":', error)
}}
}
if (m.quoted && m.quoted.id === reply && ['b', '2', 'reemplazar'].includes(m.text.toLowerCase())) {
if (!isOwner || !isROwner || !isAdmin) return m.reply(`*Esta acción no te corresponde realizar*`)
try {
await fs.promises.access('prefijos.json', fs.constants.F_OK)
await fs.promises.unlink('prefijos.json')
} catch (error) {
if (error.code !== 'ENOENT') {
console.error('Error al eliminar el archivo "prefijos.json":', error)
return
}}
const prefijosJSON = JSON.stringify(numerosPrefijos)
await fs.promises.writeFile('prefijos.json', prefijosJSON)
contenido = await fs.promises.readFile('prefijos.json', 'utf-8')
const prefijosGuardados = JSON.parse(contenido)
const prefijosConSigno = prefijosGuardados.map(prefijo => `+${prefijo}`)
m.reply(mid.mExito + `Los prefijos se han *reemplazado* correctamente.\n\n*Nueva configuración:* \`\`\`${prefijosConSigno.join(', ')}\`\`\``)
}
if (m.quoted && m.quoted.id === reply && ['c', '3', 'eliminar'].includes(m.text.toLowerCase())) {
if (!isOwner || !isROwner || !isAdmin) return m.reply(`*Esta acción no te corresponde realizar*`)
try {
await fs.promises.access('prefijos.json', fs.constants.F_OK)
await fs.promises.unlink('prefijos.json')
m.reply(mid.mExito + 'La configuración personalizada se ha 🗑️ *eliminado* correctamente.\n\n> *Se utilizará la configuración predeterminada*')
} catch (error) {
if (error.code === 'ENOENT') {
m.reply(mid.mError + 'El archivo `prefijos.json` no existe.')
} else {
console.log('Error al eliminar el archivo "prefijos.json":', error)
}}
}
if (m.quoted && m.quoted.id === reply && ['d', '4', 'cancelar'].includes(m.text.toLowerCase())) {
if (!isOwner || !isROwner || !isAdmin) return m.reply(`*Esta acción no te corresponde realizar*`)
m.reply('*No se realizaron cambios.*')
return
}
  
}
handler.command = /^(editarantifake|editarfake|editantifake|editfake)$/i
handler.register = true
handler.group = true
export default handler
