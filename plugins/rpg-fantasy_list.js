import fetch from 'node-fetch'

let handler = async (m, { command, usedPrefix, conn, text }) => {
const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
const response = await fetch(jsonURL)
const data = await response.json()

const allCharacters = data.infoImg.map((character) => `- ${character.name}`).join('\n')
const totalCharacters = data.infoImg.length

const charactersByClass = {};
data.infoImg.forEach((character) => {
const classType = character.class
if (!charactersByClass[classType]) {
charactersByClass[classType] = []
}
charactersByClass[classType].push(`- ${character.name}`)
})

const charactersByType = {};
data.infoImg.forEach((character) => {
const types = character.type.split(',').map((type) => type.trim())
types.forEach((type) => {
if (!charactersByType[type]) {
charactersByType[type] = []
}
charactersByType[type].push(`- ${character.name}`)
})
})

 const lowCostCharacters = data.infoImg
.filter((character) => character.price !== undefined && character.price >= 0 && character.price <= 700)
.map((character) => `- ${character.name} (${character.price})`)
.sort((a, b) => a.price - b.price)
.map((character) => `- ${character.name} (${character.price})`)

const highCostCharacters = data.infoImg
.filter((character) => character.price !== undefined && character.price > 700)
.map((character) => `- ${character.name} (${character.price})`)
.sort((a, b) => a.price - b.price)
.map((character) => `- ${character.name} (${character.price})`)

let currentPage = text ? parseInt(text) : 1
let totalPages = 1

const maxSectionLength = Math.max(
allCharacters.split('\n').length,
...Object.values(charactersByClass).map((characters) => characters.length),
...Object.values(charactersByType).map((characters) => characters.length),
lowCostCharacters.length,
highCostCharacters.length
)

if (maxSectionLength > 5) {
totalPages = Math.ceil(maxSectionLength / 5)
}

if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
return conn.reply(m.chat, `Número de página inválido. Utiliza un número entre 1 y ${totalPages}.`, m)
}
m.reply(getFormattedReply())

 
function formatCharacterList(characterList) {
let result = ''
for (const [classType, characters] of Object.entries(characterList)) {
if (characters.length <= 5) {
result += `*${classType}:*\n${characters.join('\n')}\n\n`;
} else {
const pages = chunkArray(characters, 5);
result += `*${classType}*\n${pages[currentPage - 1].join('\n')}\n\n`;
}}
return result.trim();
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
*Número total de personajes:* ${totalCharacters}

*Personajes:*
\`\`\`Página ${currentPage} de ${totalPages}\`\`\`
*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*
${chunkArray(allCharacters.split('\n'), 5)[currentPage - 1].join('\n')}

*Personajes de Menor Costo:*
\`\`\`Página ${currentPage} de ${totalPages}\`\`\`
*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*
${chunkArray(lowCostCharacters.split('\n'), 5)[currentPage - 1].join('\n')}

*Personajes de Mayor Costo:*
\`\`\`Página ${currentPage} de ${totalPages}\`\`\`
*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*
${chunkArray(highCostCharacters.split('\n'), 5)[currentPage - 1].join('\n')}

*Personajes por Clase:*
\`\`\`Página ${currentPage} de ${totalPages}\`\`\`
*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*
${formatCharacterList(charactersByClass)}

*Personajes por Tipo:*
\`\`\`Página ${currentPage} de ${totalPages}\`\`\`
*⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯*
${formatCharacterList(charactersByType)}
`
}}

handler.command = /^(fylista)$/i
export default handler





