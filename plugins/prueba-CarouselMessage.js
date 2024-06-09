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
'Lista', 
[
['Sección '],  
['Titulo'],  
'Tema',  
'Descripcion', 
'Id',
]]],
    [
        'Descripción 2',
        'Footer 2',
        'https://telegra.ph/file/b31cd03f716d362b33716.jpg',
        [['Botón 1', 'id1'], ['Botón 2', 'id2']],
        'Texto para copiar 2',
        [['Enlace 1', 'https://example.com/link1'], ['Enlace 2', 'https://example.com/link2']],
        [
            'Lista 2', [
                ['Header opción 3', 'Titulo opción 3', 'Descripción opción 3', 'id_opcion_3'],
                ['Header opción 4', 'Titulo opción 4', 'Descripción opción 4', 'id_opcion_4']
            ]
        ]
    ]
];

  
await conn.sendCarousel(m.chat, 'Texto', 'Linea', 'TEXTO', messages, m)
}

handler.command = /^(carousel)$/i
export default handler
