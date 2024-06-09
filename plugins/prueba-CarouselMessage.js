let handler = async (m, { conn, usedPrefix, command, text }) => {



const messages = [
[
null, null,
'https://telegra.ph/file/b31cd03f716d362b33716.jpg',
[['Buscar con Google', 'id1'], ['Botón 2', 'id2']],
null,
[['Enlace', 'https://example.com/link1'], [null, null]],
[
            [[['Lista'], [ 'Sección'], ['Título]', ['[Tema'], ['Descripción', 'Id']]]],
            [['Sección 1', 'Título 1', 'Tema 1', 'Descripción 1', 'Id 1']],
            [['Sección 2', 'Título 2', 'Tema 2', 'Descripción 2', 'Id 2']]
        ]
    ],
[
'Descripción 2',
'Footer 2',
'https://telegra.ph/file/b31cd03f716d362b33716.jpg',
[['Botón 1', 'id1'], ['Botón 2', 'id2']],
'Texto para copiar 2',
[['Enlace 1', 'https://example.com/link1'], ['Enlace 2', 'https://example.com/link2']],
[[
'Lista', 
'Sección ',  
'Titulo',  
'Tema',  
'Descripcion', 
'Id',
]]]]
  
await conn.sendCarousel(m.chat, 'Texto', 'Linea', 'TEXTO', messages, m)
}

handler.command = /^(carousel)$/i
export default handler
