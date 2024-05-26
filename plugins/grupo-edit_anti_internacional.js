import fs from 'fs'
let numerosPrefijos, contenido, reply

const handler = async (m, { conn, command, text, usedPrefix, isOwner, isROwner, isAdmin }) => {
if (!isOwner || !isROwner) return m.reply(mid.mAdvertencia + `*No tienes permisos para usar este comando*`)

if (!text) {
m.reply(mid.mInfo + `Agrega prefijos. Debe comenzar con *"+"* seguido del código de país.\n\n> Si son varios prefijos, sepáralos por coma (,)\n\n*Ejemplo:*\n- *${usedPrefix +command}* +57\n- *${usedPrefix +command}* +57, +212, +55\n\n${mid.mAdvertencia}> *Al configurar esto, se eliminarán los usuarios con prefijos configurados ya sea cuando alguien ingrese o cuando se escriba en el grupo*`)
return
}
  
const obtenerPrefijos = async (input) => {
const prefijos = input.match(/\d{1,3}/g)
if (prefijos.some(prefijo => prefijo.length < 1 || prefijo.length > 3)) {
m.reply(mid.mInfo + `Prefijo muy largo, verifica que el prefijo pertenezca a un país. No se acepta código de área es decir, lo que va entre paréntesis en algunos números de teléfonos.\n\n*Ejemplo:*\n- *${usedPrefix + command}* +57\n- *${usedPrefix + command}* +57, +212, +55`);
return
} else {
const prefijosLimpios = prefijos.map(prefijo => {
let prefijoLimpio = prefijo.replace(/[^0-9]/g, '')
if (prefijoLimpio.length > 6) {
return prefijoLimpio
}
return prefijo
})
const prefijosConSigno = prefijosLimpios.map(prefijo => {
return prefijo.startsWith('+') ? prefijo : `+${prefijo}`
})
numerosPrefijos = prefijosConSigno.map(prefijo => parseInt(prefijo.replace(/\D/g, ''), 10)).filter((valor, indice, self) => self.indexOf(valor) === indice)

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
m.reply(mid.mExito + `Prefijos guardados: *${prefijosConSigno.join(', ')}*`)
} else {
const prefijosGuardados = JSON.parse(contenido)
const prefijosConSigno = prefijosGuardados.map(prefijo => `+${prefijo}`)
reply = (await conn.reply(m.chat, mid.mInfo + `> *Hemos encontrado prefijos guardados*
*Reciente:* \`${numerosPrefijos.map(prefijo => `+${prefijo}`).join(', ')}\`
*Existente:* \`${prefijosConSigno.join(', ')}\`\n 
*Responde a este mensaje eligiendo una letra para:*
\`\`\`[A]\`\`\` \`Combinar\` *(Se juntarán los prefijos existentes con los recientes.)*\n
\`\`\`[B]\`\`\` \`Reemplazar\` *(Se eliminarán los prefijos existentes para agregar los recientes.)*\n
\`\`\`[C]\`\`\` \`Eliminar\` *(Se usarán los prefijos predeterminados, eliminando los existentes y recientes)*\n
\`\`\`[D]\`\`\` \`Cancelar\` *(No se realizarán cambios)*`, m)).key.id
}} catch (error) {
if (error.code === 'ENOENT') {
m.reply(mid.mError + 'El archivo "prefijos.json" no existe.')
} else {
console.error('Error al agregar los prefijos en el archivo "prefijos.json": ', error)
}}
}
await obtenerPrefijos(text)
}

handler.before = async function (m, { conn, isOwner, isROwner, isAdmin }) {
if (m.quoted && m.quoted.id === reply && ['a'].includes(m.text.toLowerCase())) {
if (!isOwner || !isROwner) return m.reply(mid.mError + `*Esta acción no te corresponde realizar*`)
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
m.reply(mid.mExito + `Los prefijos se han *combinado* correctamente.\n\nLos prefijos guardados son: *${prefijosConSigno.join(', ')}*`)
} catch (error) {
if (error.code === 'ENOENT') {
m.reply(mid.mError + 'El archivo "prefijos.json" no existe.')
} else {
console.log('Error al actualizar los prefijos en el archivo "prefijos.json":', error)
}}
}
if (m.quoted && m.quoted.id === reply && ['b'].includes(m.text.toLowerCase())) {
if (!isOwner || !isROwner) return m.reply(`*Esta acción no te corresponde realizar*`)
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
m.reply(mid.mExito + `Los prefijos se han *reemplazado* correctamente.\n\nLos prefijos guardados son: *${prefijosConSigno.join(', ')}*`)
}
if (m.quoted && m.quoted.id === reply && ['c'].includes(m.text.toLowerCase())) {
if (!isOwner || !isROwner) return m.reply(`*Esta acción no te corresponde realizar*`)
try {
await fs.promises.access('prefijos.json', fs.constants.F_OK)
await fs.promises.unlink('prefijos.json')
m.reply(mid.mExito + 'Los prefijos se han eliminado correctamente.')
} catch (error) {
if (error.code === 'ENOENT') {
m.reply(mid.mError + 'El archivo "prefijos.json" no existe.')
} else {
console.log('Error al eliminar el archivo "prefijos.json":', error)
}}
}
if (m.quoted && m.quoted.id === reply && ['d'].includes(m.text.toLowerCase())) {
if (!isOwner || !isROwner) return m.reply(`*Esta acción no te corresponde realizar*`)
m.reply('No se realizaron cambios.')
return
}
  
}
handler.command = /^(editarnum|editnum)$/i
handler.register = true
export default handler
