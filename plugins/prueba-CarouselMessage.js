// COMBINACIÓN DE MENSAJES

let handler = async (m, { conn, usedPrefix, command, text }) => {

// MENSAJE CARUSEL CON TODOS LOS BOTONES DISPONIBLES
const sections = [{
title: `Título de la sección`,
rows: [
{ header: 'Encabezado1', title: "Título1", description: 'Descripción1', id: "Id1" }, 
{ header: 'Encabezado2', title: "Título2", description: 'Descripción2', id: "Id2" }, 
{ header: 'Encabezado3', title: "Título3", description: 'Descripción3', id: "Id3" }, 
{ header: 'Encabezado4', title: "Título4", description: 'Descripción4', id: "Id4" }, 
]},]  
const messages = [[ // CARUSEL 1
'Descripción de Carusel 1', 
'Footer de Carusel 1',
'https://telegra.ph/file/24b24c495b5384b218b2f.jpg',
[['Botón1', 'Id1'], ['Botón2', 'Id2'] /* etc... */],
'Copiar texto',
[['Enlace1', 'https://'], ['Enlace2', 'https://'] /* etc... */],
[['Botón Lista 1', sections], ['Botón Lista 2', sections] /* etc... */]
], [ // CAROUSEL 2
'Descripción de Carusel 2',
'Footer de Carusel 2',
'https://telegra.ph/file/e9239fa926d3a2ef48df2.jpg',
[['Botón1', 'Id1'], ['Botón2', 'Id2']],
'Copiar texto 2',
[['Enlace1', 'https://example.com/link1'], ['Enlace2', 'https://example.com/link2']],
[['Botón Lista 1', sections], ['Botón Lista 2', sections]]
], [ // CAROUSEL 3
'Descripción de Carusel 3',
'Footer de Carusel 3',
'https://telegra.ph/file/ec725de5925f6fb4d5647.jpg',
[['Botón1', 'Id1'], ['Botón2', 'Id2']],
'Copiar texto 3',
[['Enlace1', 'https://example.com/link1'], ['Enlace2', 'https://example.com/link2']],
[['Botón Lista 1', sections], ['Botón Lista 2', sections]]
], [ // CAROUSEL 4
'Descripción de Carusel 4',
'Footer de Carusel 4',
'https://telegra.ph/file/7acad0975febb71446da5.jpg',
[['Botón1', 'Id1'], ['Botón2', 'Id2']],
'Copiar texto 4',
[['Enlace1', 'https://example.com/link1'], ['Enlace2', 'https://example.com/link2']],
[['Botón Lista 1', sections], ['Botón Lista 2', sections]]
]] /* etc... */
await conn.sendCarousel(chat, 'Texto', 'Footer', 'Titulo de Carusel', messages)            

}

handler.command = /^(carousel)$/i
export default handler
