import fetch from 'node-fetch';

let handler = async (m, { command, usedPrefix, conn, text }) => {
  const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json';
  const response = await fetch(jsonURL);
  const data = await response.json();

  // Obtener todos los personajes
  const allCharacters = data.infoImg.map((character) => character.name);

  // Obtener el número total de personajes
  const totalCharacters = data.infoImg.length;

  // Obtener personajes por clase
  const charactersByClass = {};
  data.infoImg.forEach((character) => {
    const classType = character.class;
    if (!charactersByClass[classType]) {
      charactersByClass[classType] = [];
    }
    charactersByClass[classType].push(character.name);
  });

  // Obtener personajes por tipo
  const charactersByType = {};
  data.infoImg.forEach((character) => {
    const types = character.type.split(',').map((type) => type.trim());
    types.forEach((type) => {
      if (!charactersByType[type]) {
        charactersByType[type] = [];
      }
      charactersByType[type].push(character.name);
    });
  });

  // Imprimir resultados
  m.reply(`
Personajes Totales: ${allCharacters.join(', ')}
Número total de personajes: ${totalCharacters}
Personajes por Clase: ${formatCharacterList(charactersByClass)}
Personajes por Tipo: ${formatCharacterList(charactersByType)}
  `);

  // Función para formatear la lista de personajes
  function formatCharacterList(characterList) {
    return Object.entries(characterList)
      .map(([classType, characters]) => `*${classType}:* ${characters.join(', ')}`)
      .join(' | ');
  }
};

handler.command = /^(fantasylist|fylist)$/i;
export default handler;
