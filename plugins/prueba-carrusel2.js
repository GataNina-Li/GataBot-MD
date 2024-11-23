let handler = async (m, { conn, usedPrefix, command, text }) => {

// DEFINIR LAS SECCIONES DEL MENÚ
const sections = [{
  title: `Menú Principal`,
  rows: [
    { header: 'Inicio', title: "Inicio", description: 'Ve a la pantalla de inicio', id: usedPrefix + "menu" },
    { header: 'Perfil', title: "Perfil", description: 'Gestiona tu información de usuario', id: "perfil" },
    { header: 'Configuraciones', title: "Configuraciones", description: 'Personaliza tus preferencias', id: "configuraciones" },
    { header: 'Ayuda', title: "Ayuda", description: 'Obtén asistencia', id: "ayuda" }
  ],
}];

// MENSAJES DEL CARRUSEL
const messages = [
  [ // CARRUSEL 1
    'Descripción del Carrusel 1',
    'Pie de página del Carrusel 1',
    'https://telegra.ph/file/imagen1.jpg', // URL de la imagen
    [['Botón 1', usedPrefix + 'menu'], ['Botón 2', 'perfil']],
    [['Texto para copiar 1'], ['Texto para copiar 2']],
    [['Enlace 1', 'https://link1.com'], ['Enlace 2', 'https://link2.com']],
    [['Botón Lista 1', sections], ['Botón Lista 2', sections]]
  ],
  [ // CARRUSEL 2
    'Descripción del Carrusel 2',
    'Pie de página del Carrusel 2',
    'https://telegra.ph/file/imagen2.jpg', // URL de la imagen
    [['Botón 3', 'configuraciones'], ['Botón 4', 'ayuda']],
    [['Texto para copiar 3'], ['Texto para copiar 4']],
    [['Enlace 3', 'https://link3.com'], ['Enlace 4', 'https://link4.com']],
    [['Botón Lista 3', sections], ['Botón Lista 4', sections]]
  ]
];

// ENVIAR EL CARRUSEL
await conn.sendCarousel(m.chat, 'Texto que acompañará al carrusel', 'Pie de página', 'Título del Carrusel', messages, m);
}

handler.command = /^(carousel2)$/i;
export default handler;
