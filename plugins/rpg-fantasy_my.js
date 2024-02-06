import fetch from 'node-fetch'
import fs from 'fs'
const fantasyDBPath = './fantasy.json'
let fantasyDB = []

let handler = async (m, { command, usedPrefix, conn, text }) => {
const jsonURL = 'https://raw.githubusercontent.com/GataNina-Li/module/main/imagen_json/anime.json'
const response = await fetch(jsonURL)
const data = await response.json()
  
    const userId = m.sender;
    let usuarioExistente = fantasyDB.find(user => Object.keys(user)[0] === userId);

    if (!usuarioExistente) {
        return conn.reply(m.chat, `No tienes personajes.`, m);
    }

    const idUsuario = Object.keys(usuarioExistente)[0];
    const fantasyUsuario = usuarioExistente[idUsuario].fantasy;

    // Información del usuario
    const totalPersonajes = fantasyUsuario.length;

    let tusPersonajes = `Tus personajes:\n`;
    fantasyUsuario.forEach(personaje => {
        tusPersonajes += `• ${personaje.name} (${personaje.id})\n`;
    });

    let totalLikes = 0, totalSuperlikes = 0, totalDislikes = 0;
    if (usuarioExistente[idUsuario].flow) {
        usuarioExistente[idUsuario].flow.forEach(flow => {
            if (flow.like) totalLikes++;
            if (flow.superlike) totalSuperlikes++;
            if (flow.dislike) totalDislikes++;
        });
    }

    const calificacionTotal = totalLikes + totalSuperlikes + totalDislikes;
    const personajesGustados = totalLikes > 0 ? totalLikes : 'No has dado me gusta a personajes';
    const personajesSuperlike = totalSuperlikes > 0 ? totalSuperlikes : 'No has dado me encanta a personajes';
    const personajesNoGustados = totalDislikes > 0 ? totalDislikes : 'No has dado no me gusta a personajes';

    let preciosPersonajes = fantasyUsuario.map(personaje => {
        const infoPersonaje = data.infoImg.find(img => img.name.toLowerCase() === personaje.name.toLowerCase());
        return { name: personaje.name, price: infoPersonaje ? infoPersonaje.price : Infinity };
    });

    preciosPersonajes.sort((a, b) => a.price - b.price);

    const personajeMasBarato = preciosPersonajes.length > 0 ? `• ${preciosPersonajes[0].name} » ${preciosPersonajes[0].price} 🐱` : 'No tienes personajes';
    const personajeMasCaro = preciosPersonajes.length > 0 ? `• ${preciosPersonajes[preciosPersonajes.length - 1].name} » ${preciosPersonajes[preciosPersonajes.length - 1].price} 🐱` : 'No tienes personajes';

    const clases = {};
    fantasyUsuario.forEach(personaje => {
        const infoPersonaje = data.infoImg.find(img => img.name.toLowerCase() === personaje.name.toLowerCase());
        if (infoPersonaje) {
            if (!clases[infoPersonaje.class]) clases[infoPersonaje.class] = 0;
            clases[infoPersonaje.class]++;
        }
    });

    let claseMasPersonajes = 'No tienes personajes';
    let claseMenosPersonajes = 'No tienes personajes';
    let maxCount = 0, minCount = Infinity;
    Object.entries(clases).forEach(([clase, count]) => {
        if (count > maxCount) {
            maxCount = count;
            claseMasPersonajes = `La clase ${clase} tiene ${count} personajes`;
        }
        if (count < minCount && count > 0) {
            minCount = count;
            claseMenosPersonajes = `La clase ${clase} tiene ${count} personajes`;
        }
    });

    const mensaje = `
    Información de tus personajes:
    
    Total de personajes: ${totalPersonajes}
    ${tusPersonajes}
    
    Calificación total de personajes: ${calificacionTotal}
    
    Personajes que has dado 👍: ${personajesGustados}
    
    Personajes que has dado ❤️: ${personajesSuperlike}
    
    Personajes que has dado 👎: ${personajesNoGustados}
    
    Tu personaje más barato: ${personajeMasBarato}
    
    Tu personaje más caro: ${personajeMasCaro}
    
    Clase con más personajes: ${claseMasPersonajes}
    
    Clase con menos personajes: ${claseMenosPersonajes}
    `;

    conn.reply(m.chat, mensaje.trim(), m);
}

handler.command = /^(fantasymy|fymy)$/i
export default handler;
