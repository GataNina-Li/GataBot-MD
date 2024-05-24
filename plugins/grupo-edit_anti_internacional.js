import fs from 'fs'
let numerosPrefijos, contenido, reply

const handler = async (m, { conn, command, text, usedPrefix, isOwner, isROwner, isAdmin }) => {
if (!isOwner || !isROwner) return m.reply(`*No tienes permisos para usar este comando*`)

const obtenerPrefijos = async (input) => {
const regex = /^\+(\d{1,3})(?:, *\+(\d{1,3}))*$/
if (!regex.test(input)) {
m.reply('Formato inválido. Debe comenzar con "+" seguido de prefijos de países.\n\n> Si son varios prefijos, sepáralos por coma (,)')
return
}
const prefijos = input.match(/\d{1,3}/g)
if (prefijos.join('').length < 4) {
m.reply('Prefijo muy largo, verifica que el prefijo pertenezca a un país. No se acepta código de área es decir, lo que va entre paréntesis en algunos números de teléfonos.')
return
}
numerosPrefijos = prefijos.map(prefijo => parseInt(prefijo, 10)).filter((valor, indice, self) => self.indexOf(valor) === indice)
const prefijosJSON = JSON.stringify(numerosPrefijos)
fs.promises.writeFile('prefijos.json', '')
try {
await fs.promises.access('prefijos.json', fs.constants.F_OK)
contenido = await fs.promises.readFile('prefijos.json', 'utf-8')
if (contenido) {
reply = (await conn.reply(m.chat, `Hemos encontrado prefijos guardados, responde a este mensaje con una letra:\n
Opciones:
\`\`\`[A]\`\`\` \`Combinar\` *(Se juntarán los prefijos existentes con los nuevos.)*\n
\`\`\`[B]\`\`\` \`Reemplazar\` *(Se eliminarán los prefijos existentes para agregar los nuevos.)*\n
\`\`\`[C]\`\`\` \`Eliminar\` *(Se usarán los prefijos predeterminados, eliminando los existentes y nuevos)*\n
\`\`\`[D]\`\`\` \`Cancelar\` *(No se realizarán cambios)*`, m)).key.id
} else {
contenido = await fs.promises.readFile('prefijos.json', 'utf-8')
if (contenido.trim() !== '') {
fs.writeFile('prefijos.json', prefijosJSON, async (err) => {
if (err) {
console.error('Error al guardar los prefijos:', err);
return
}
const prefijosGuardados = JSON.parse(contenido)
const prefijosConSigno = prefijosGuardados.map(prefijo => `+${prefijo}`)
m.reply(`Éxito. Los prefijos guardados son: *${prefijosConSigno.join(', ')}*`)
} else {
m.reply('Los prefijos se han guardado correctamente en el archivo "prefijos.json".')
}}
} catch (error) {
if (error.code === 'ENOENT') {
m.reply('Vuelva a intentarlo. El archivo "prefijos.json" no existe.')
} else {
console.log('Error al agregar los prefijos en el archivo "prefijos.json":', error)
}}
})
}
const input = text
obtenerPrefijos(input)
}

handler.before = async function (m, { conn, isOwner, isROwner, isAdmin }) {
if (m.quoted && m.quoted.id === reply && ['a'].includes(m.text.toLowerCase())) {
if (!isOwner || !isROwner) return m.reply(`*Esta acción no te corresponde realizar*`)
try {
await fs.promises.access('prefijos.json', fs.constants.F_OK)
contenido = await fs.promises.readFile('prefijos.json', 'utf-8')
const prefijosExistentes = JSON.parse(contenido)
const prefijosActualizados = [...new Set([...prefijosExistentes, ...numerosPrefijos])]
const prefijosJSON = JSON.stringify(prefijosActualizados)
await fs.promises.writeFile('prefijos.json', prefijosJSON)
contenido = await fs.promises.readFile('prefijos.json', 'utf-8')
if (contenido.trim() !== '') {
const prefijosGuardados = JSON.parse(contenido)
const prefijosConSigno = prefijosGuardados.map(prefijo => `+${prefijo}`)
m.reply(`Éxito. Los prefijos se han combinado correctamente.\n\nLos prefijos guardados son: *${prefijosConSigno.join(', ')}*`)
} else {
m.reply('Los prefijos se han combinado correctamente.')
}} catch (error) {
if (error.code === 'ENOENT') {
m.reply('Vuelva a intentarlo. El archivo "prefijos.json" no existe.')
} else {
console.error('Error al actualizar los prefijos en el archivo "prefijos.json":', error)
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
if (contenido.trim() !== '') {
const prefijosGuardados = JSON.parse(contenido)
const prefijosConSigno = prefijosGuardados.map(prefijo => `+${prefijo}`)
m.reply(`Éxito. Los prefijos se han reemplazado correctamente.\n\nLos prefijos guardados son: *${prefijosConSigno.join(', ')}*`)
} else {
m.reply('Los prefijos se han reemplazado correctamente.')
}}
if (m.quoted && m.quoted.id === reply && ['c'].includes(m.text.toLowerCase())) {
if (!isOwner || !isROwner) return m.reply(`*Esta acción no te corresponde realizar*`)
try {
await fs.promises.access('prefijos.json', fs.constants.F_OK)
await fs.promises.unlink('prefijos.json')
m.reply('Los prefijos se han eliminado correctamente.')
} catch (error) {
if (error.code === 'ENOENT') {
console.log('El archivo "prefijos.json" no existe.')
} else {
console.error('Error al eliminar el archivo "prefijos.json":', error)
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
