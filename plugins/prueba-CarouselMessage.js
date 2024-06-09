let handler = async (m, { conn, usedPrefix, command, text }) => {

/*const messages = [
['Descripción 1', 'Footer 1', 'https://telegra.ph/file/b31cd03f716d362b33716.jpg', [], '', [], []],
['Descripción 2', 'Footer 2', 'https://telegra.ph/file/98c672926fbc35a4b9948.jpg', [], '', [], []],
['Descripción 3', 'Footer 3', 'https://telegra.ph/file/f689a972cfc1c5efff189.jpg', [], '', [], []],
]*/

const messages = [
    [
        'Descripción 1',
        'Footer 1',
        'https://telegra.ph/file/b31cd03f716d362b33716.jpg',
        [['Botón A', 'idA'], ['Botón B', 'idB']],
        'Texto para copiar 1',
        [['Enlace 1', 'https://example.com/link1'], ['Enlace 2', 'https://example.com/link2']],
[
            'Lista 1',  // lister[6][0]
            [
                'Header opción 1',  // lister[6][1][0]
                'Opción 1',  // lister[6][1][1]
                'Descripción opción 1',  // lister[6][1][2]
                'id_opcion_1',  // lister[6][1][3]
                'Header opción 2',  // lister[6][1][4]
                'Opción 2',  // lister[6][1][5]
                'Descripción opción 2',  // lister[6][1][6]
                'id_opcion_2'  // lister[6][1][7]
            ]
        ]
    ],
            [
                'Header opción 2',  // Header de la segunda fila
                'Opción 2',         // Título de la segunda fila
                'Descripción opción 2',  // Descripción de la segunda fila
                'id_opcion_2'       // ID de la segunda fila
            ]
        ]
    ],

    [
        'Descripción 2',
        'Footer 2',
        'https://telegra.ph/file/98c672926fbc35a4b9948.jpg',
        [['Botón C', 'idC'], ['Botón D', 'idD']],
        'Texto para copiar 2',
        [['Enlace 3', 'https://example.com/link3'], ['Enlace 4', 'https://example.com/link4']],
        [
            ['Lista 2'], 
            [
                ['Header opción 3', 'Opción 3', 'Descripción opción 3', 'id_opcion_3']
            ]
        ]
    ]
];

  
await conn.sendCarousel(m.chat, 'Texto', 'Linea', 'TEXTO', messages, m)

}

handler.command = /^(carousel)$/i
export default handler
