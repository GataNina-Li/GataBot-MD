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
      {
        title: 'Lista 1',
        rows: [
          {
            header: 'Header opción 1',
            title: 'Opción 1',
            description: 'Descripción opción 1',
            id: 'id_opcion_1'
          },
          {
            header: 'Header opción 2',
            title: 'Opción 2',
            description: 'Descripción opción 2',
            id: 'id_opcion_2'
          }
        ]
      },
      {
        title: 'Lista 2',
        rows: [
          {
            header: 'Header opción 3',
            title: 'Opción 3',
            description: 'Descripción opción 3',
            id: 'id_opcion_3'
          },
          {
            header: 'Header opción 4',
            title: 'Opción 4',
            description: 'Descripción opción 4',
            id: 'id_opcion_4'
          }
        ]
      }
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
      {
        title: 'Lista 3',
        rows: [
          {
            header: 'Header opción 5',
            title: 'Opción 5',
            description: 'Descripción opción 5',
            id: 'id_opcion_5'
          },
          {
            header: 'Header opción 6',
            title: 'Opción 6',
            description: 'Descripción opción 6',
            id: 'id_opcion_6'
          }
        ]
      },
      {
        title: 'Lista 4',
        rows: [
          {
            header: 'Header opción 7',
            title: 'Opción 7',
            description: 'Descripción opción 7',
            id: 'id_opcion_7'
          },
          {
            header: 'Header opción 8',
            title: 'Opción 8',
            description: 'Descripción opción 8',
            id: 'id_opcion_8'
          }
        ]
      }
    ]
  ],
  [
    'Descripción 3',
    'Footer 3',
    'https://telegra.ph/file/f689a972cfc1c5efff189.jpg',
    [['Botón E', 'idE'], ['Botón F', 'idF']],
    'Texto para copiar 3',
    [['Enlace 5', 'https://example.com/link5'], ['Enlace 6', 'https://example.com/link6']],
    [
      {
        title: 'Lista 5',
        rows: [
          {
            header: 'Header opción 9',
            title: 'Opción 9',
            description: 'Descripción opción 9',
            id: 'id_opcion_9'
          },
          {
            header: 'Header opción 10',
            title: 'Opción 10',
            description: 'Descripción opción 10',
            id: 'id_opcion_10'
          }
        ]
      },
      {
        title: 'Lista 6',
        rows: [
          {
            header: 'Header opción 11',
            title: 'Opción 11',
            description: 'Descripción opción 11',
            id: 'id_opcion_11'
          },
          {
            header: 'Header opción 12',
            title: 'Opción 12',
            description: 'Descripción opción 12',
            id: 'id_opcion_12'
          }
        ]
      }
    ]
  ]
]


await conn.sendCarousel(m.chat, 'Prueba', 'SuperBot', messages, m)

}

handler.command = /^(carousel)$/i
export default handler
