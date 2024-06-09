let handler = async (m, { conn, usedPrefix, command, text }) => {

/*const messages = [
['Descripción 1', 'Footer 1', 'https://telegra.ph/file/b31cd03f716d362b33716.jpg', [], '', [], []],
['Descripción 2', 'Footer 2', 'https://telegra.ph/file/98c672926fbc35a4b9948.jpg', [], '', [], []],
['Descripción 3', 'Footer 3', 'https://telegra.ph/file/f689a972cfc1c5efff189.jpg', [], '', [], []],
]*/

const messages = [
['Descripción 1', 'Footer 1', 'https://telegra.ph/file/b31cd03f716d362b33716.jpg', [['Botón A', 'idA'], ['Botón B', 'idB']], 'Texto para copiar 1', [['Lista 1', ['Opción 1', 'Opción 2']], ['Lista 2', ['Opción 3', 'Opción 4']]]],
['Descripción 2', 'Footer 2', 'https://telegra.ph/file/98c672926fbc35a4b9948.jpg', [['Botón C', 'idC'], ['Botón D', 'idD']], 'Texto para copiar 2', [['Enlace 3', 'https://example.com/link3'], ['Enlace 4', 'https://example.com/link4']], [['Lista 3', ['Opción 5', 'Opción 6']], ['Lista 4', ['Opción 7', 'Opción 8']]]],
['Descripción 3', 'Footer 3', 'https://telegra.ph/file/f689a972cfc1c5efff189.jpg', [['Botón E', 'idE'], ['Botón F', 'idF']], 'Texto para copiar 3', [['Enlace 5', 'https://example.com/link5'], ['Enlace 6', 'https://example.com/link6']], [['Lista 5', ['Opción 9', 'Opción 10']], ['Lista 6', ['Opción 11', 'Opción 12']]]],
['Descripción 4', 'Footer 4', 'https://telegra.ph/file/f689a972cfc1c5efff189.jpg', [['Botón G', 'idG'], ['Botón H', 'idH']], 'Texto para copiar 4', [['Enlace 7', 'https://example.com/link7'], ['Enlace 8', 'https://example.com/link8']], [['Lista 7', ['Opción 13', 'Opción 14']], ['Lista 8', ['Opción 15', 'Opción 16']]]],
['Descripción 5', 'Footer 5', 'https://telegra.ph/file/f689a972cfc1c5efff189.jpg', [['Botón I', 'idI'], ['Botón J', 'idJ']], 'Texto para copiar 5', [['Enlace 9', 'https://example.com/link9'], ['Enlace 10', 'https://example.com/link10']], [['Lista 9', ['Opción 17', 'Opción 18']], ['Lista 10', ['Opción 19', 'Opción 20']]]]
]

await conn.sendCarousel(m.chat, 'Prueba', 'SuperBot', messages, m)

}

handler.command = /^(carousel)$/i
export default handler
