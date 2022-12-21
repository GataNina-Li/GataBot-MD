let handler = async (m, { command, usedPrefix, DevMode, args, conn }) => {
const valoracion = { valorar1: 'Muy Alta 80% - 100%', valorar2: 'Alta 60% - 79%', valorar3: 'Media 40% - 59%', valorar4: 'Baja 20% - 39%', valorar5: 'Muy Baja 0% - 19%' }

const categorias = {
exp: {
categoria: 'Categoria 1',
descripcion: 'Experiencia',
ataque: '',
defensa: '',
utilidad: valoracion.valorar1,
abundancia: valoracion[0]
},
stamina: {
categoria: 'Categoria 2',
descripcion: 'Energia',
ataque: '',
defensa: '',
utilidad: 'Medianamente alta',
abundancia: 'Medianamente poca' 
}
}
m.reply(categorias.exp.utilidad)
}
handler.command = /^(colección|coleccion|inforpg|set|collection)$/i

export default handler
