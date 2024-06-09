let handler = async (m, { conn, usedPrefix, command, text }) => {

let listSections = [
    ['Sección 1', [
        ['Título 1', 'ID1', 'Descripción 1', 'id_opcion_1'],
        ['Título 2', 'ID2', 'Descripción 2', 'id_opcion_2']
    ]],
    ['Sección 2', [
        ['Título 3', 'ID3', 'Descripción 3', 'id_opcion_3'],
        ['Título 4', 'ID4', 'Descripción 4', 'id_opcion_4']
    ]]
];

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
            
                ['Sección', 'Titulo', 'Tema', 'Descripcion', 'Id']
            
        ]
    ]],
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
        sections
    ],
    
]

  
await conn.sendCarousel(m.chat, 'Texto', 'Linea', 'TEXTO', messages, sections, m)
}

handler.command = /^(carousel)$/i
export default handler
