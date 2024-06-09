let handler = async (m, { conn, usedPrefix, command, text }) => {

/*const messages = [
['Descripción 1', 'Footer 1', 'https://telegra.ph/file/b31cd03f716d362b33716.jpg', [], '', [], []],
['Descripción 2', 'Footer 2', 'https://telegra.ph/file/98c672926fbc35a4b9948.jpg', [], '', [], []],
['Descripción 3', 'Footer 3', 'https://telegra.ph/file/f689a972cfc1c5efff189.jpg', [], '', [], []],
]*/

const messages = [
  [
    'Descripción 1',
    [
      [
        'Header opción 1', // Título del elemento
        'id_opcion_1', // ID de la fila
        'Descripción opción 1' // Descripción de la fila
      ],
      [
        'Header opción 2', // Título del elemento
        'id_opcion_2', // ID de la fila
        'Descripción opción 2' // Descripción de la fila
      ]
    ]
  ],
  [
    'Descripción 2',
    [
      [
        'Header opción 3', // Título del elemento
        'id_opcion_3', // ID de la fila
        'Descripción opción 3' // Descripción de la fila
      ],
      [
        'Header opción 4', // Título del elemento
        'id_opcion_4', // ID de la fila
        'Descripción opción 4' // Descripción de la fila
      ]
    ]
  ]
];




  
await conn.sendCarousel(m.chat, 'Texto', 'Linea', 'TEXTO', messages, m)

}

handler.command = /^(carousel)$/i
export default handler
