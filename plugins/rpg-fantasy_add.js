import fetch from 'node-fetch';
import fs from 'fs';

let handler = async (m, { command, usedPrefix, conn, text }) => {
const helpMessage = `
*Comando Fantasy Add*

Este comando te permite agregar nuevos personajes a un archivo Json llamado *"fantasyAdd.json"*.

*Uso:*
*${usedPrefix + command}* enlace, nombre, descripción, clase, tipo

*Parámetros:*
*- url:* Enlace de la imagen (debe comenzar con 'https://telegra.ph/file/').\n
*- name:* Nombre del anime o personaje (primera letra de cada palabra en mayúscula).\n
*- desp:* Descripción del anime o personaje o de donde proviene (primera letra de cada palabra en mayúscula).\n
*- class:* Clase del personaje (Común, Poco Común, Raro, Épico, Legendario, Sagrado, Supremo, o Transcendental).\n
*- type:* Etiquetas del personaje, separadas por ":" o ";" o "/" (primera letra de cada etiqueta en mayúscula).

*Nota*
_Para obtener el enlace a la imagen puedes usar el coamndo *${usedPrefix}tourl* respondiendo a la imgen, también puedes mejorar la calidad de imagen respondiendo a la imagen *${usedPrefix}hd*_

*Ejemplo:*
*${usedPrefix + command}* https://telegra.ph/file/abcd1234.jpg, Son Goku, Dragon Ball, Épico, Aventura / Acción
`.trim()
if (!text) return conn.reply(m.chat, helpMessage, m)
  
try {
const fantasyAddPath = './fantasyAdd.json'
let fantasyAddData = []
if (fs.existsSync(fantasyAddPath)) {
const data = fs.readFileSync(fantasyAddPath, 'utf8')
fantasyAddData = JSON.parse(data)
}
const [url, name, desp, classInput, typeInput] = text.split(',').map((item) => item.trim())
if (!url || !name || !desp || !classInput || !typeInput) {
return conn.reply(m.chat, 'Faltan parámetros. Asegúrate de proporcionar todos los datos requeridos.', m)
}

if (!url.startsWith('https://telegra.ph/file/')) {
return conn.reply(m.chat, '¡Por favor, ingresa un enlace de imagen válido!\n\n*Ejemplo:*\nhttps://telegra.ph/file/13739fe030f0a5c8cdd9c.jpg', m)
}

const formattedName = name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
const formattedDesp = desp.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

const validClasses = ['Común', 'Poco Común', 'Raro', 'Épico', 'Legendario', 'Sagrado', 'Supremo', 'Transcendental']
const formattedClass = classInput.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
if (validClasses.some(c => formattedClass.includes(c.toLowerCase()))) {
return conn.reply(m.chat, '¡Solo puedes ingresar una clase a la vez!', m)
}
if (!validClasses.includes(formattedClass)) {
return conn.reply(m.chat, '¡Clase no válida! Solo se aceptan las siguientes:\nComún, Poco Común, Raro, Épico, Legendario, Sagrado, Supremo, Transcendental', m)
}
const formattedType = typeInput.split(/[:;/]/).map((item) => item.trim()).map((item) => item.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())).join(', ')

const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
const response = await fetch(jsonURL)
const data = await response.json()
const nextIndex = data.infoImg.length + 1

let price
switch (formattedClass) {
case 'Común':
price = Math.floor(Math.random() * (200 - 100 + 1) + 100)
break
case 'Poco Común':
price = Math.floor(Math.random() * (500 - 300 + 1) + 300)
break
case 'Raro':
price = Math.floor(Math.random() * (700 - 600 + 1) + 600)
break
case 'Épico':
price = Math.floor(Math.random() * (1500 - 800 + 1) + 800)
break
case 'Legendario':
price = Math.floor(Math.random() * (3000 - 1600 + 1) + 1600)
break
case 'Sagrado':
price = Math.floor(Math.random() * (9999 - 3100 + 1) + 3100)
break
case 'Supremo':
price = Math.floor(Math.random() * (30000 - 10000 + 1) + 10000)
break
case 'Transcendental':
price = Math.floor(Math.random() * (999999 - 30000 + 1) + 30000)
break
default:
break
}

const codigoImagen = generarCodigo()
//for (const info of data.infoImg) {
//fantasyAddData.push({
//index: info.index,
//url: info.url,
//name: info.name,
//desp: info.desp,
//class: info.class,
//type: info.type,
//price: info.price,
//code: info.code,
//})
//}

fantasyAddData.push({
index: nextIndex,
url,
name: formattedName,
desp: formattedDesp,
class: formattedClass,
type: formattedType,
price,
code: codigoImagen,
})

fs.writeFileSync(fantasyAddPath, JSON.stringify(fantasyAddData, null, 2), 'utf8')
conn.reply(m.chat, '¡Imagen añadida exitosamente!', m)
} catch (error) {
console.error('Error al procesar la solicitud: ', error)
conn.reply(m.chat, '¡Ocurrió un error al procesar la solicitud!', m)
}}

function generarCodigo() {
const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const numeros = '0123456789';
const caracteresEspeciales = '$#@%_*&+!:^/'
let codigo = ''
for (let i = 0; i < 4; i++) {
codigo += letras.charAt(Math.floor(Math.random() * letras.length))
}
for (let i = 0; i < 3; i++) {
codigo += numeros.charAt(Math.floor(Math.random() * numeros.length))
}
for (let i = 0; i < 3; i++) {
codigo += caracteresEspeciales.charAt(Math.floor(Math.random() * caracteresEspeciales.length))
}
codigo = codigo.split('').sort(() => Math.random() - 0.5).join('');
return codigo
}
handler.command = /^(fantasyadd|fyadd)$/i
export default handler
