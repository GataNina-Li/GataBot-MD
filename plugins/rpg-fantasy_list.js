/*import fetch from 'node-fetch'; 

let handler = async (m, { command, usedPrefix, conn, text }) => {
  const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json';
  const response = await fetch(jsonURL);
  const data = await response.json();

  // Obtener todos los personajes
  const allCharacters = data.infoImg.map((character) => `- ${character.name}`).join('\n');

  // Obtener el número total de personajes
  const totalCharacters = data.infoImg.length;

  // Obtener personajes por clase
  const charactersByClass = {};
  data.infoImg.forEach((character) => {
    const classType = character.class;
    if (!charactersByClass[classType]) {
      charactersByClass[classType] = [];
    }
    charactersByClass[classType].push(`- ${character.name}`);
  });

  // Obtener personajes por tipo
  const charactersByType = {};
  data.infoImg.forEach((character) => {
    const types = character.type.split(',').map((type) => type.trim());
    types.forEach((type) => {
      if (!charactersByType[type]) {
        charactersByType[type] = [];
      }
      charactersByType[type].push(`- ${character.name}`);
    });
  });

  // Imprimir resultados
  await m.reply(`
Personajes Totales:
${allCharacters}

Número total de personajes: ${totalCharacters}

Personajes por Clase:
${formatCharacterList(charactersByClass)}

Personajes por Tipo:
${formatCharacterList(charactersByType)}
  `);

  // Función para formatear la lista de personajes
  function formatCharacterList(characterList) {
    return Object.entries(characterList)
      .map(([classType, characters]) => `${classType}:\n${characters.join('\n')}`)
      .join('\n\n');
  }
};

handler.command = /^(fylista)$/i;
export default handler;*/

import fetch from 'node-fetch';

let handler = async (m, { command, usedPrefix, conn, text }) => {
  const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json';
  const response = await fetch(jsonURL);
  const data = await response.json();

  // Obtener todos los personajes
  const allCharacters = data.infoImg.map((character) => `- ${character.name}`).join('\n');

  // Obtener el número total de personajes
  const totalCharacters = data.infoImg.length;

  // Obtener personajes por clase
  const charactersByClass = {};
  data.infoImg.forEach((character) => {
    const classType = character.class;
    if (!charactersByClass[classType]) {
      charactersByClass[classType] = [];
    }
    charactersByClass[classType].push(`- ${character.name}`);
  });

  // Obtener personajes por tipo
  const charactersByType = {};
  data.infoImg.forEach((character) => {
    const types = character.type.split(',').map((type) => type.trim());
    types.forEach((type) => {
      if (!charactersByType[type]) {
        charactersByType[type] = [];
      }
      charactersByType[type].push(`- ${character.name}`);
    });
  });

  // Definir la página actual y el total de páginas
  let currentPage = 1;
  let totalPages = 1;

  // Imprimir resultados
  m.reply(getFormattedReply());

  // Función para formatear la lista de personajes
  function formatCharacterList(characterList) {
    let result = '';
    for (const [classType, characters] of Object.entries(characterList)) {
      if (characters.length <= 5) {
        result += `${classType}:\n${characters.join('\n')}\n\n`;
      } else {
        const pages = chunkArray(characters, 5);
        totalPages = pages.length;
        result += `${classType} - Página ${currentPage} de ${totalPages}:\n${pages[currentPage - 1].join('\n')}\n\n`;
      }
    }
    return result.trim();
  }

  // Función para dividir un array en partes más pequeñas (páginas)
  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  // Función para obtener la respuesta formateada
  function getFormattedReply() {
    return `
Personajes Totales:
${allCharacters}

Número total de personajes: ${totalCharacters}

Personajes por Clase:
${formatCharacterList(charactersByClass)}

Personajes por Tipo:
${formatCharacterList(charactersByType)}
  `;
  }
};

handler.command = /^(fylista)$/i;
export default handler;

