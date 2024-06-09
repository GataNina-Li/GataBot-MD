let handler = async (m, { conn, usedPrefix, command, text }) => {

/*const messages = [
[
'Descripción 1',
'Footer 1',
'https://telegra.ph/file/b31cd03f716d362b33716.jpg',
[['Botón 1', 'id1'], ['Botón 2', 'id2']],
'Texto para copiar 1',
[['Enlace 1', 'https://example.com/link1'], ['Enlace 2', 'https://example.com/link2']],
[[
'Lista',
'Sección ',  
'Titulo',  
'Tema',  
'Descripcion', 
'Id',
[
'Sección ',  
'Titulo',  
'Tema',  
'Descripcion', 
'Id'
]]],
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
]]]]*/

const messages = [
    [
        'Descripción 1',
        'Footer 1',
        'https://telegra.ph/file/b31cd03f716d362b33716.jpg',
        [['Botón 1', 'id1'], ['Botón 2', 'id2']],
        'Texto para copiar 1',
        [['Enlace 1', 'https://example.com/link1'], ['Enlace 2', 'https://example.com/link2']],
        [
            {
                title: 'Sección 1',
                rows: [
                    ['Título 1', 'Tema 1', 'Descripción 1', 'Id 1'],
                    ['Título 2', 'Tema 2', 'Descripción 2', 'Id 2']
                ]
            },
            {
                title: 'Sección 2',
                rows: [
                    ['Título 3', 'Tema 3', 'Descripción 3', 'Id 3'],
                    ['Título 4', 'Tema 4', 'Descripción 4', 'Id 4']
                ]
            }
        ]
    ],
    [
        'Descripción 2',
        'Footer 2',
        'https://telegra.ph/file/b31cd03f716d362b33716.jpg',
        [['Botón 1', 'id1'], ['Botón 2', 'id2']],
        'Texto para copiar 2',
        [['Enlace 1', 'https://example.com/link1'], ['Enlace 2', 'https://example.com/link2']],
        [
            {
                title: 'Sección 1',
                rows: [
                    ['Título 5', 'Tema 5', 'Descripción 5', 'Id 5'],
                    ['Título 6', 'Tema 6', 'Descripción 6', 'Id 6']
                ]
            }
        ]
    ]
];

  
await conn.sendCarousel(m.chat, 'Texto', 'Linea', 'TEXTO', messages, m)
}

handler.command = /^(carousel)$/i
export default handler
