import fetch from 'node-fetch'
let numPersonaje = 10
let currentPage = null
let handler = async (m, { command, usedPrefix, conn, text }) => {
const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
const response = await fetch(jsonURL)
const data = await response.json()

const allCharacters = data.infoImg.map((character) => `• ${character.name}`).join('\n')
const totalCharacters = data.infoImg.length

const classOrder = ['Común', 'Poco Común', 'Raro', 'Épico', 'Legendario', 'Sagrado', 'Supremo', 'Transcendental']
const charactersByClass = {}
data.infoImg.forEach((character) => {
const classType = character.class;
if (!charactersByClass[classType]) {
charactersByClass[classType] = []
}
charactersByClass[classType].push(`• ${character.name}`)
})
const sortedCharactersByClass = Object.fromEntries(
Object.entries(charactersByClass).sort(
(a, b) => classOrder.indexOf(a[0]) - classOrder.indexOf(b[0])
))

const charactersByType = {};
data.infoImg.forEach((character) => {
const types = character.type.split(',').map((type) => type.trim())
types.forEach((type) => {
if (!charactersByType[type]) {
charactersByType[type] = []
}
charactersByType[type].push(`• ${character.name}`)
})
})

const lowCostCharacters = data.infoImg
.filter((character) => character.price !== undefined && character.price >= 0 && character.price <= 700)
.map((character) => ({ name: character.name, price: character.price }))
.sort((a, b) => a.price - b.price)
.map((character) => `• ${character.name} » \`\`\`${character.price}\`\`\` *${rpgshopp.emoticon('money')}*`)

const highCostCharacters = data.infoImg
.filter((character) => character.price !== undefined && character.price > 700)
.map((character) => ({ name: character.name, price: character.price }))
.sort((a, b) => a.price - b.price)
.map((character) => `• ${character.name} » \`\`\`${character.price}\`\`\` *${rpgshopp.emoticon('money')}*`)

currentPage = text ? parseInt(text) : 1
let totalPages = 1

const maxSectionLength = Math.max(
allCharacters.split('\n').length,
...Object.values(sortedCharactersByClass).map((characters) => characters.length),
...Object.values(charactersByType).map((characters) => characters.length),
lowCostCharacters.length,
highCostCharacters.length
)

if (maxSectionLength > numPersonaje) {
totalPages = Math.ceil(maxSectionLength / numPersonaje)
}

if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
return conn.reply(m.chat, `Número de página inválido. Utiliza un número entre 1 y ${totalPages}.`, m)
}
  
let pp = 'https://telegra.ph/file/343d26ea0d2621d47539c.jpg'
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
await conn.sendFile(m.chat, pp, 'error.jpg', getFormattedReply(), fkontak, true, {
contextInfo: {
'forwardingScore': 200,
'isForwarded': false,
externalAdReply: {
showAdAttribution: false,
title: `🌟 FANTASÍA RPG`,
body: `🎈 Lista de personajes`,
mediaType: 1,
sourceUrl: accountsgb.getRandom(),
thumbnailUrl: 'https://telegra.ph/file/feb1553dffb7410556c8f.jpg'
}}})

function formatCharacterList(characterList) {
let result = ''
for (const [classType, characters] of Object.entries(characterList)) {
if (characters.length <= numPersonaje) {
result += `*${classType}:*\n${characters.join('\n')}\n\n`
} else {
const pages = chunkArray(characters, numPersonaje)
const currentPageContent = pages[currentPage - 1]
if (currentPageContent) {
result += `*${classType}*\n${currentPageContent.join('\n')}\n\n`
}}}
return result.trim()
}

function chunkArray(array, size) {
const result = [];
for (let i = 0; i < array.length; i += size) {
result.push(array.slice(i, i + size));
}
return result
}

function getFormattedReply() {
return `
${totalPages !== 1 ? `_Para ir a la siguiente página escriba *${usedPrefix +command} 2*_\n\n` : ''}
*❱❱ Número total de personajes:* ${totalCharacters}

*❱❱ Personajes:*
\`\`\`Página ${currentPage} de ${totalPages}\`\`\`
*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*
${chunkArray(allCharacters.split('\n'), numPersonaje)[currentPage - 1].join('\n')}

*❱❱ Personajes de Menor Costo:*
\`\`\`Página ${currentPage} de ${totalPages}\`\`\`
*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*
${chunkArray(lowCostCharacters, numPersonaje)[currentPage - 1] ? chunkArray(lowCostCharacters, numPersonaje)[currentPage - 1].join('\n') : lowCostCharacters.join('\n')}

*❱❱ Personajes de Mayor Costo:*
\`\`\`Página ${currentPage} de ${totalPages}\`\`\`
*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*
${chunkArray(highCostCharacters, numPersonaje)[currentPage - 1] ? chunkArray(highCostCharacters, numPersonaje)[currentPage - 1].join('\n') : highCostCharacters.join('\n')}

*❱❱ Personajes por Clase:*
\`\`\`Página ${currentPage} de ${totalPages}\`\`\`
*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*
${formatCharacterList(sortedCharactersByClass)}

*❱❱ Personajes por Tipo:*
\`\`\`Página ${currentPage} de ${totalPages}\`\`\`
*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*
${formatCharacterList(charactersByType)}
`.trim()
}}

handler.command = /^(fylista|fylist|fyl)$/i
export default handler





