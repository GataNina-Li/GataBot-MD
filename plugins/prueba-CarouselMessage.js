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
      'Lista 1',
      'Header opción 1', 'Descripción opción 1', 'id_opcion_1',
      'Header opción 2', 'Descripción opción 2', 'id_opcion_2'
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
      'Lista 2',
      'Header opción 3', 'Descripción opción 3', 'id_opcion_3',
      'Header opción 4', 'Descripción opción 4', 'id_opcion_4'
    ]
  ]
];

  
await conn.sendCarousel(m.chat, 'Texto', 'Linea', 'TEXTO', messages, m)

}

handler.command = /^(carousel)$/i
export default handler
