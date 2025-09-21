let handler = async (m, {conn, command, text, usedPrefix, args}) => {
if (!db.data.chats[m.chat].game)
throw `${lenguajeGB['smsAvisoAG']()}𝙇𝙊𝙎 𝙅𝙐𝙀𝙂𝙊𝙎 𝙀𝙎𝙏𝘼𝙎 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝙊 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊, 𝙎𝙄 𝙀𝙍𝙀𝙎 𝘼𝘿𝙈𝙄𝙉𝙎 𝙋𝙐𝙀𝘿𝙀 𝘼𝘾𝙏𝙄𝙑𝘼𝙍𝙇𝙊 𝘾𝙊𝙉 : #on juegos`

if (command == 'piropo') {
let query = 'Cuéntame un piropo, solo di el piropo no agregue mas texto.'
let username = m.sender
let logic = 'piropo'
let result
try {
result = await luminsesi(query, username, logic)
if (!result || result.trim() === '') throw new Error('Respuesta vacía')
} catch (error) {
result = pickRandom(global.piropo)
}
await m.reply(`╭┄〔 *${wm}* 〕┄⊱\n┊\nდ ${result}\n┊\n*╰━━━⊰ 𓃠 ${vs} ⊱━━━━დ*`)
}

if (command == 'chiste') {
let query =
'Cuéntame un chiste, puede ser de cualquier tipo de humor, no repita los chiste haz chiste como jaimito, yayo, solo di el chiste no agregue mas texto y haz chiste nuevo 2024 no repitan los mismo chiste pasado xD.'
let username = m.sender
let logic = 'chiste'
let result
try {
result = await luminsesi(query, username, logic)
if (!result || result.trim() === '') throw new Error('Respuesta vacía')
} catch (error) {
result = pickRandom(global.chiste)
}
await m.reply(`╭┄〔 *${wm}* 〕┄⊱\n┊\n${result}\n┊\n*╰━━━⊰ 𓃠 ${vs} ⊱━━━━დ*`)
}

if (command == 'reto') {
let query = 'Dame un reto interesante para hacer, solo di el reto no agregue mas texto y no repitan los reto, que sea diferentes y divertido.'
let username = m.sender
let logic = 'reto'
let result
try {
result = await luminsesi(query, username, logic)
if (!result || result.trim() === '') throw new Error('Respuesta vacía')
} catch (error) {
result = pickRandom(global.bucin)
}
await conn.reply(m.chat, `╭━━━━━[ 𝙍𝙀𝙏𝙊 😏 ]━━━━⬣\n${result}\n╰━━━━━━[ ${vs} ]━━━━━⬣`, m)
}

if (command == 'verdad') {
let query = 'Dame una pregunta de verdad intrigante'
let username = m.sender
let logic = 'verdad'
let result
try {
result = await luminsesi(query, username, logic)
if (!result || result.trim() === '') throw new Error('Respuesta vacía')
} catch (error) {
result = pickRandom(global.bucin)
}
await conn.reply(m.chat, `╭━━━━[ 𝙑𝙀𝙍𝘿𝘼𝘿 🤔 ]━━━━⬣\n${result}\n╰━━━━━━[ ${vs} ]━━━━━⬣`, m)
}

if (command == 'frases') {
const ejemplo = '*Asmaul Husna*'
const organizar = `Desde Abu Hurairah radhiallahu anhu, Rasulullah SAW dijo: "Tengo noventa y nueve nombres, cien menos 1. Quien los memorice entrará en el Paraíso, y él es un acorde que ama el acorde."
Significado: "De hecho, yo tengo noventa y nueve nombres, también conocido como cien menos uno. Quien los cuente, entrará en el cielo; Él es Witr y ama a Witr".`
let json = JSON.parse(JSON.stringify(global.asmaulhusna))
let data = json.map((v, i) => `${i + 1}. ${v.latin}\n${v.arabic}\n${v.translation_id}`).join('\n\n')
if (isNaN(args[0])) throw `Ejemplo:\n${usedPrefix + command} 1`
if (args[0]) {
if (args[0] < 1 || args[0] > 99) throw 'mínimo 1 y máximo 99!'
let {index, latin, arabic, translation_id, translation_en} = json.find((v) => v.index == args[0].replace(/[^0-9]/g, ''))
return m.reply(
`🔢 *Número:* ${index}
${arabic}
 
${latin}

${translation_id}

${translation_en}
`.trim()
)
}
m.reply(ejemplo + data + organizar)
}
}
handler.tags = ['fun']
handler.command = ['piropo', 'chiste', 'reto', 'verdad', 'frases']
handler.register = true
export default handler

async function luminsesi(q, username, logic) {
try {
const response = await axios.post('https://luminai.my.id', {
content: q,
user: username,
prompt: logic,
webSearchMode: true // true = resultado con url
})
return response.data.result
} catch (error) {
console.error(error)
}
}

function pickRandom(list) {
return list[Math.floor(list.length * Math.random())]
}

global.piropo = [
'Me gustaría ser papel para poder envolver ese bombón.',
'Eres como wifi sin contraseña, todo el mundo te busca',
'Quién fuera bus para andar por las curvas de tu corazón.',
'Quiero volar sin alas y salir de este universo, entrar en el tuyo y amarte en silencio.',
'Quisiera ser mantequilla para derretirme en tu arepa.',
'Si la belleza fuera pecado vos ya estarías en el infierno.',
'Me Gustaría Ser Un Gato Para Pasar 7 Vidas A Tu Lado.',
'Robar Está Mal Pero Un Beso De Tu Boca Sí Me Lo Robaría.',
'Qué Hermoso Es El Cielo Cuando Está Claro Pero Más Hermoso Es El Amor Cuando Te Tengo A Mi Lado.',
'Bonita, Camina Por La Sombra, El Sol Derrite Los Chocolates.',
'Si Fuera Un Correo Electrónico Serías Mi Contraseña.',
'Quisiera que fueses monte para darte machete',
'Perdí mi número de teléfono ¿Me das el tuyo?',
'¿Cómo te llamas para pedirte de regalo a Santa Claus?',
' En el cielo hay muchas estrellas, pero la más brillante está en la Tierra y eres tú.',
'¿Acaba de salir el sol o es la sonrisa que me regalas hoy?',
'No es el ron ni la cerveza, eres tú quien se me ha subido a la cabeza',
'Si hablamos de matemáticas eres la suma de todos mis deseos.',
'Pareces Google porque tienes todo lo que yo busco.',
'Mi café favorito, es el de tus ojos.',
'Quiero ser photoshop para retocarte todo el cuerpo.',
'Quisiera que fueras cereal, para cucharearte en las mañanas.',
'Quien fuera hambre, para darte tres veces al día.'
]

global.chiste = [
'¿Cuál es el último animal que subió al arca de Noé? El del-fin..',
'¿Cómo se dice pañuelo en japonés? Saka-moko',
'¿Cómo se dice disparo en árabe? Ahí-va-la-bala..',
'¿Qué le dice un gusano a otro gusano? Voy a dar una vuelta a la manzana.',
'Un gato empieza a ladrar en el tejado de una casa. Otro gato, sorprendido, le dice: Estás loco gato, ¿por qué ladras en vez de maullar? El gatito le responde: ¿A caso no puedo aprender otro idioma?',
'El doctor le dice al paciente: respire profundo que lo voy a auscultar. El paciente le responde: doctor, ¿de quién me va a ocultar si no le debo a nadie?\nSale el doctor después de un parto y el padre de la criatura le pregunta: ¿Doctor cómo salió todo? El doctor le dice: todo salió bien, pero tuvimos que colocarle oxígeno al bebé. El padre, horrorizado, le dice: pero doctor, nosotros queríamos ponerle Gabriel..',
'Un pez le pregunta a otro pez: ¿qué hace tu mamá? Este le contesta: Nada, ¿y la tuya qué hace? Nada también.',
'¿Cuál es el colmo de Aladdín? Tener mal genio',
'El profesor le dice al estudiante después de haberle corregido la tarea: Tu trabajo me ha conmovido. El estudiante, sorprendido, le pregunta: ¿Y eso por qué profesor? El profesor con cara de burla le dice: Porque me dio mucha pena.',
'Le dice el niño a la madre: Mamá, no quiero jugar más con Pedrito. La madre le pregunta al niño: ¿Por qué no quieres jugar más con él? Porque cuando jugamos a los tacos de madera y le pego con uno en la cabeza, de repente se pone a llorar.',
'A Juanito le dice la maestra: Juanito, ¿qué harías si te estuvieses ahogando en la piscina? Juanito le responde: Me pondría a llorar mucho para desahogarme.',
'Hijo, me veo gorda, fea y vieja. ¿Qué tengo hijo, qué tengo? Mamá, tienes toda la razón.',
'¿Cómo se dice pelo sucio en chino? Chin cham pu.',
'Había una vez un niño tan, tan, tan despistado que... ¡da igual, me he olvidado del chiste!',
'Una amiga le dice a otra amiga: ¿Qué tal va la vida de casada? Pues no me puedo quejar, dice ella. ¿O sea que va muy bien, no? No, no me puedo quejar porque mi marido está aquí al lado.',
'¿Por qué las focas miran siempre hacia arriba? ¡Porque ahí están los focos!',
'Camarero, ese filete tiene muchos nervios. Pues normal, es la primera vez que se lo comen.',
'¿Cómo se llama el primo de Bruce Lee? Broco Lee.',
'Una madre le dice a su hijo: Jaimito, me ha dicho un pajarito que te drogas. La que te drogas eres tú, que hablas con pajaritos.'
]

global.bucin = [
'Pasa el pack de una hormiga',
'Dile a tus amigos que te vas a vivir a EU y mándame una captura de lo que te haya dicho',
'Grita desde la ventana que quieres mamar y mándame el vídeo',
'Escribe el nombre de tu crush',
'Debes de poner el nombre de mi creador en tu estado de WhatsApp, sin dar contexto',
'Envíame una fotografía tuya',
'Debes de dibujar en alguna parte de tu cuerpo el nombre de algún integrante del grupo, luego realiza una foto y envíala',
'Hazte una foto dándole un beso a una Televisión',
'Mándame una fotografía en ropa interior',
'Escribe en tu estado de WhatsApp que te gusta comer tierra',
'Debes de poner la fotografía de un participante del grupo que sea del sexo opuesto al tuyo en tu perfil de WhatsApp durante 3 días 📸📸',
'Tienes que mandar un audio cantando la canción: Un pato que va cantando alegremente cua cua 🦆',
'Envía un mensaje a tu ex y dile todavía me gustas',
'Envía un audio diciendo amo a The Shadow Brokers - Bot',
'Dile a tu crush que la amas y pasa captura al grupo',
'Envía un audio cantando',
'Envía una foto en la que salgas tu sin taparte la cara ni nada',
'Envía un video bailando',
'Invita a personas que no conoces a tomarse una selfi contigo y luego envíalo al grupo',
"Elija algunos números aleatorios de sus contactos y envíeles un mensaje de texto con el mensaje 'Estoy embarazad@'.",
'¡Tome cualquier bebida que esté cerca de usted, luego mézclela con chile y beba!',
"Tome un número aleatorio de sus contactos, llámelo y dígale 'te amo' ",
"Compre la comida más barata en la cafetería (o compre una botella de agua) y diga entre sollozos a sus compañeros de clase: 'Esta ... es la comida más cara que he comprado)' ",
' Compre una botella de coca cola y salpique flores con ella frente a la multitud.',
' Párese cerca del refrigerador, cierre los ojos, elija alimentos al azar en él, incluso cuando coma, sus ojos deben estar cerrados.',
" De pie en medio de la cancha de baloncesto y gritando: 'TE AMO MI PRÍNCIPE / PRINCESA' ",
"Presenta tus respetos a alguien de la clase y luego di: 'Estoy a su servicio, Majestad' ",
" Caminando aplaudiendo y cantando la canción 'Feliz cumpleaños' de la clase al pasillo.",
" Arrodíllate sobre una rodilla y di '¿Cásate conmigo?' la primera persona en entrar a la habitación.",
' Haz un tocado absurdo con tejido, sea lo que sea, sigue pidiendo poses frente a la cámara, sigue subiendo',
"Dile 'ERES HERMOSA / MUY HERMOSA, NO MIENTES' a la chica que crees que es la más bonita de esta clase.",
" Dile a alguien en clase: 'Primero me dijeron que era tu gemelo, nos separamos y luego me sometí a una cirugía plástica. Y esto es lo más serio que he dicho' ",
" Tirar el cuaderno de alguien a la basura, frente a sus ojos, diciendo 'Este libro nadie puede entender' ",
' ¡Arranca el pelo de tu propia pierna 3 veces!',
' Chatea con tus padres, diles que los extrañas con emoticonos tristes.',
' Intente buscar en Google cosas aterradoras o ridículas como tripofobia, etc.',
' Siéntese relajado en medio de la cancha de baloncesto mientras finge que es una playa para tomar el sol.',
' Llena tu boca de agua y tienes que aguantar hasta dos rondas, si te ríes y derramas o bebes, entonces tienes que volver a llenar y agregar una ronda más.',
" Salude a la primera persona que entre en esta sala y diga '¡Bienvenido a Quién quiere ser millonario!' ",
"Envía un mensaje de texto a tus padres '¡Hola, hermano! ¡Acabo de comprar el último número de la revista Playboy!' ",
"Envíales un mensaje de texto a tus padres: 'Mamá, papá, ya sé que soy un niño adoptado del orfanato. No ocultes esto más'.",
" Envía tres números aleatorios en tus contactos y escribe 'Me acabo de convertir en modelo de la revista Playboy' ",
' ¡Come una cucharada de salsa de soja dulce y salsa de soja!',
' Come algo pero no uses las manos.',
" Enojarse con sus amigos que no vienen a pesar de que tienen una cita para jugar 'Verdad o Reto' juntos",
'¡Rompe el huevo con la cabeza!',
'Coma alimentos que se hayan mezclado y tendrán un sabor extraño, pero asegúrese de que los alimentos no sean dañinos para la salud a largo o corto plazo.',
"Baila como Girls 'Generation para los niños frente a la clase, o baila como Super Junior para las niñas.",
'Izar el asta de la bandera sin la bandera.',
'Hablando de la persona que te gusta, de tus amigos más cercanos, del sexo opuesto que no conoces en absoluto y cosas por el estilo.',
'Copia los peinados de todos tus amigos.',
'Cantando la canción HAI TAYO frente a mucha gente mientras baila',
'Cante la canción Baby Shark en voz alta en el aula.',
'Pedir prestado algo a los vecinos',
"Pide la firma de uno de los profesores más feroces mientras dices 'Eres verdaderamente la persona que más admiro en el mundo' ",
" Pídale dinero a alguien (al azar ) en la calle diciendo 'No tengo dinero para tomar un angkot'.",
' Beba algo que haya sido preparado / acordado, pero asegúrese de que no sea peligroso, puede ser como beber jarabe mezclado con salsa de soja.',
' Hablando con el emoticono-miedo de la persona que te gusta, está bien conversar con lo que quieras, a través de cualquier medio que puedas.',
' Canta tu película de Disney favorita fuera de casa mientras gritas.',
' Nombra de 1 azul a 20 azules rápidamente y no debes cometer ningún error. Si está mal, debe repetirse desde el principio.',
" Póngase una corona de papel de copia y diga a todos en la habitación 'HONOR AL REY' mientras señala a cada persona con una regla.",
' Vuelve a ponerte los pantalones hasta la mañana siguiente.',
" Abraza a la persona que NO te agrada en clase y di: 'Muchas gracias por ser la mejor persona para mí' ",
" Ve a un campo amplio, luego corre lo más rápido posible mientras dices 'Estoy loco, estoy loco' ",
' Elija una flor y luego conéctela a alguien que no conoce (debe ser del sexo opuesto)',
" Elige a una persona al azar en la calle, luego di 'No sabes que eres hermosa' (ala One Direction)",
' Fingir estar poseído ejm: poseído por un tigre, etc.',
' Pídale que silbe ya que su boca está nuevamente llena de comida.',
' Pide ser un mesero para que te sirva con tus amigos para el almuerzo.',
' Dígales que usen calcetines para hacer guantes.',
'Dígales que usen el sombrero más extraño / el casco más absurdo durante la próxima ronda.',
"Llama a tu mamá y dile 'mamá, quiero casarme lo antes posible' ",
"Llama a tu ex y di 'te extraño' ",
'Cambia de ropa con la persona más cercana hasta la siguiente ronda.',
"Actualice el estado en WhatsApp lo que sea con palabras que comiencen con 'S' ",
'Sube un video de canto a YouTube que esté cantando canciones populares.',
'Colorea tus uñas de las manos y de los pies de diferentes colores durante una semana.',
'come 2 cucharadas de arroz sin guarniciones',
"Envie el emoji '🦄💨' cada vez que escriba en un grupo 1 día",
"diga '¡Bienvenido a Quién quiere ser millonario!' a todos los grupos que tienes",
'canta el coro de la última canción que tocaste',
'Envia un audio de voz a tu ex / enamorado / novia, dile hola (nombre), quiero llamar, solo un momento. Te Extraño🥺👉🏼👈🏼 ',
'Dile a la gente al azar: Primero me dijeron que era tu gemelo, nos separamos y luego me sometí a una cirugía plástica. Y esto',
'¡Haz 1 rima para el primer jugador!',
'cuenta tu propia versión de cosas vergonzosas',
"cambiar el nombre a 'Gay' durante 24 horas",
'¡Menciona tu tipo de novia!',
"Di 'Estoy enamorado de ti, ¿quieres ser mi novio o no?' al último sexo opuesto con el que conversaste en WhatsApp, espera a que responda",
"Háblale a tu ex por WhatsApp y dile 'te amo, por favor vuelve'. Manda una captura de pantalla como evidencia de reto cumplido!"
]

global.verdad = [
'¿Alguna vez te ha gustado alguien? ¿Cuánto tiempo?',
'Si es posible o si quieres, en gc / fuera de gc, ¿con quién harás amistad? (Puede ser diferente / del mismo tipo)',
'¿cual es tu mas grande miedo?',
'¿Alguna vez te ha gustado alguien y has sentido a esa persona como tú también?',
'¿Cuál es el nombre del exnovio de tu amiga que una vez te gustó en secreto?',
'¿Alguna vez has robado el dinero de tu madre o de tu padre? ¿La razón?',
'lo que te hace feliz cuando estás triste',
'¿Alguna vez has sido amor no correspondido? ¿Si has estado con quién? ¿Cómo se siente brou?',
'¿Alguna vez has tenido una aventura con alguien?',
'lo más temido',
'quién es la persona más influyente en tu vida',
'qué orgullo tienes este año',
'quién es la persona que puede enfermarte',
'quien es la persona que alguna vez te puso cachondo',
'(para los musulmanes) ¿nunca has rezado en todo el día?',
'¿Quién es el más cercano a su tipo de pareja ideal aquí',
'¿Con quién te gusta jugar?',
'¿Alguna vez has rechazado a alguien? ¿Por qué?',
'Menciona el incidente que te hizo daño y que aún recuerdas',
'¿Qué logros has obtenido este año?',
'¿Cuál es tu peor hábito en la escuela?',
'¿Qué programa de televisión odias más? ¡Da la razón!',
'¿Cuál es el vestido más feo (en su opinión) que ha usado y cuándo lo usó?',
'¿Qué es lo peor (chisme) que has dicho sobre tu amigo?',
'¿Qué es lo más vergonzoso de ti?',
' ¿Qué es lo primero que ves cuando miras a otra persona (del sexo opuesto)?',
'¿Qué es lo primero que te viene a la mente cuando te miras al espejo?',
'¿Que es lo mas tonto que has hecho en tu vida?',
' ¿Cuál es el peor sueño que has tenido?',
' ¿Cuál es el sueño más loco que puedes recordar hasta ahora?',
' ¿Cuál es tu peor rasgo en tu opinión?',
' ¿Qué rasgo te gustaría cambiar de ti mismo?',
' ¿Qué rasgo te gustaría cambiar en tu amigo?',
' ¿Qué harías si tu novio te dijera que tienes mala nariz o dedos?',
' ¿En qué piensas antes de dormir? ej .: fantasear con una pareja, etc.',
'¿Qué crees que se destaca más de ti?',
' ¿Qué parte del cuerpo de tu amigo te gusta más y desearías tener?',
'¿Qué parte de tu cuerpo odias más?',
' De todas las clases de la escuela, ¿a qué clase le gustaría ingresar y qué clase le gustaría evitar?',
'¡Describe a tu amigo más cercano!',
' ¡Descríbete en una palabra!',
' ¿Qué películas y canciones te han hecho llorar?',
' ¿Qué es algo que has mantenido en secreto hasta ahora y nadie lo ha descubierto?',
' ¿Qué es lo más romántico que alguien (del sexo opuesto) te ha hecho o regalado?',
'¿Qué es lo más desagradable que has experimentado?',
' Si nacieras de nuevo y tuvieras que ser uno de tus amigos, ¿a quién elegirías ser?',
' Si tienes superpoder / superpoder, ¿qué quieres hacer?',
' Si el apocalipsis llega pronto, ¿qué haces?',
' Si te pidieran que te sometieras a una cirugía plástica con una muestra de rostro de tu compañero de clase, ¿a quién imitarías?',
' Alguna vez has robado algo?',
' ¿Tiene miedo a morir? ¿Por qué?',
' ¿Cuándo fue la última vez que lloraste y por qué?',
' ¿Cuáles son tus habilidades especiales?',
' ¿Cómo te puede gustar la persona que te gusta?',
' ¿Cuál crees que es un buen rasgo de tu amigo más cercano que él o ella no conozca?',
' ¿Con qué tipo de persona te gustaría casarte algún día?',
' En tu opinión, ¿cuál es el trabajo más atractivo para el amigo que está sentado a tu lado? ¿Y por qué?',
' ¿Con quién quieres intercambiar por un día? (amigos más cercanos que ambos conocen) y por qué',
' ¿Alguna vez has esperado en secreto que la relación de alguien con su novia se rompiera? ¿Quién?',
' ¿Prefiere AMIGAS o AMIGOS? ¿Por qué?',
' ¿Qué cita recuerdas más y te gusta?',
' ¿Qué secretos nunca les has contado a tus amigos hasta ahora?',
' ¿Quiénes son sus verdaderos modelos a seguir?',
' ¿Cuál de tus amigos crees que es matre?',
' ¿Cuál de tus amigos crees que tiene menos corte de pelo?',
' ¿Cuál de tus amigos es el más fotogénico? ',
' ¿Quién es tu mejor ex? ¡¿Y por qué rompieron ?!',
' ¿Cómo se llama el artista con el que hablaste en secreto?',
' ¿Cómo se llamaba el profesor que te gustaba?',
' ¿Cuál es el nombre de la exnovia de tu amigo que te ha gustado en secreto?',
' ¿Cuál es el nombre de la persona (del sexo opuesto) que crees que sería divertido ser novia?',
' ¿Cuál es el nombre de la persona que odias, pero crees que le gustas a esa persona (no necesariamente del sexo opuesto)?',
' ¿Cuál es el nombre de la persona a la que has estado señalando en secreto?',
' ¿Quién es la persona (del sexo opuesto) que más se te pasa por la cabeza?',
' ¿Quién es la persona más molesta entre tus amigos? ¡la razón!',
' ¿A quién de tus amigos crees que debería renovarse?',
' ¿Quién está más cerca de tu pareja ideal aquí?',
'Padre o madre',
'La parte del cuerpo que no te gusta',
'¿Alguna vez has hecho trampa?',
'¿Alguna vez te han besado?',
'¿Qué es lo primero que harías si te despertaras como del sexo opuesto?',
'¿Alguna vez has dejado que alguien más se meta en problemas por algo que hiciste?',
'¿Qué es lo más embarazoso que has hecho en tu vida?',
' ¿Cuál es la razón más ridícula por la que has roto con alguien?',
' ¿Cuál es el peor hábito que tienes?',
' ¿Cuál crees que es tu mejor característica? ¿Y que es lo peor?',
' ¿Cuál es la cosa más valiente que has hecho?',
' ¿Cuándo fue la última vez que mojaste la cama?',
' ¿Con qué sueñas más sobre dormir?',
' Si va a ganar dinero ilegalmente, ¿cómo lo hace?',
' ¿Qué cosas infantiles sigues haciendo?',
' Si fueras ciego, ¿quién sería tu perro guía?',
' ¿Qué es lo que más te impresiona?',
' Si se le permitiera usar solo 3 palabras durante el resto de la noche a partir de ahora, ¿cuál sería?',
' Si fueras un dictador, ¿qué ley promulgarías primero?',
'Si vivieras durante la era nazi, ¿quién serías?',
'¿Cuál fue la experiencia más vergonzosa en la escuela / tiempo de estudio / educación / el año pasado?',
'¿Cuál es el mayor error de tu vida?',
'¿Qué no harías nunca, incluso si supieras que solo te quedan 12 horas de vida?',
' ¿Qué delitos ha cometido?',
' Cuéntame un secreto de tu infancia.',
' ¿Cuál es su mayor representante (secreto)?',
' ¿Qué quieres hacer conmigo… ( x persona), si luego puedes borrar su memoria (él,…)?',
' ¿Qué es lo peor que le has hecho a alguien?',
' ¿Quién te gusta más?',
'¿Alguna vez te has enamorado de alguno de los presentes?',
' Si fueras un vampiro, ¿a cuál de nosotros morderías ahora?',
' ¿Ha defecado alguna vez en público?',
' ¿Cuál es tu fantasía más oscura?',
' ¿Qué es lo mejor que has tenido con alguien más?',
' ¿Cuál es el mayor desvío para ti?',
' ¿Qué es lo que más te gusta de tu cuerpo y qué es lo más feo?',
' ¿A quien te gustaría ver desnuda?',
' ¿Quién en esta ronda puede enamorarte?',
' ¿Alguna vez has tenido un sueño erótico donde sucedió alguien de este grupo?',
' Si te vas a tatuar en el área genital, ¿que habrá allí?',
' ¿Qué es más importante en una relación: el sexo o el amor?',
' ¿Crees que el sexo es genial, bueno, bueno, divertido a veces, o realmente no te importa?',
' ¿Qué te hace realmente amar?',
'¿Cuántas veces a la semana / mes tiene relaciones sexuales y con qué frecuencia desea tener relaciones sexuales?',
' ¿Con cuántas parejas sexuales te has acostado?',
' ¿Qué parte del cuerpo te hace más?',
' ¿Cómo, dónde y con quién estuviste primero?',
' ¿Qué importancia tienen para ti los juegos previos prolongados?',
' ¿Qué debe hacer un hombre o una mujer para seducirte?',
' ¿Alguna vez has tenido sexo con un buen amigo?',
' ¿Alguna vez ha tenido relaciones sexuales con alguno de estos grupos, excepto con su pareja?',
'¿Qué animal se adapta mejor a ti y por qué?',
' ¿Cuál es tu peor cita?',
' ¿A quién quieres besar ahora?',
' ¿Cuál es tu oscura fantasía secreta?',
' ¿Prefieres tatuarte el culo o perforarte la lengua?',
' ¿Eres siempre leal?',
' ¿Tienes un enamoramiento adolescente?',
' ¿De qué persona te enamoraste?',
' ¿Con qué celebridad te gustaría salir?',
' ¿Cuál fue el momento más embarazoso de tu vida?',
' ¿Qué boca te gusta más del grupo de aquí?',
' ¿Qué jugador tiene la mano más hermosa?',
' ¿Dónde fue tu primer beso?',
' ¿A quién del grupo te gustaría besar más?',
' ¿Quién en la mesa es quizás el más divertido?',
' ¿Cuál es el mayor error de tu vida?',
' ¿Te pasó algo vergonzoso en una cita?',
' ¿Ha estado alguna vez en contacto con drogas?',
' ¿A qué persona quieres besar ahora?',
' ¿Cuándo fue la última vez que estuvo borracho?',
' ¿Alguna vez has hecho trampa en un examen escolar?',
' ¿Has robado algo en el pasado?',
' ¿Roncas por la noche?',
' ¿Cuales tu cancion favorita?',
' ¿Con qué jugadores comerciará durante 1 semana y por qué?',
' Te mudaste a una isla desierta, ¿a quién te llevaste de aquí?',
' ¿A que temes más?',
' ¿Dónde te afeitas en todas partes?',
'¿Tienes un apodo?',
' ¿Miras en el baño antes de lavarte?',
'¿Quién te dio la peor angustia?',
' Cuantas veces te has besado',
'¿Qué es lo más embarazoso que te ha pasado?',
'¿Cuántos chicos / chicas has besado?',
'¿De quien estas enamorado(a) ?',
'Que estrella te gusta',
'¿Empezaste algo con XY (insertar nombre)?',
'Alguna vez has robado algo?'
]

global.asmaulhusna = [
{
index: 1,
latin: '💐 *Autor:* *John Maxwell*',
arabic: '💐 *Frase:* _En la vida algunas veces se gana, otras veces se aprende._',
translation_id:
'💐 *Opinión:* Hay que aprender de esos momentos desagradables, para de esta manera seguir creciendo como individuos. En otras palabras, no importa cómo caes, sino cómo te levantas.',
translation_en: 'En otras palabras, no importa cómo caes, sino cómo te levantas.'
},
{
index: 2,
latin: '💐 *Autor:* *Paulo Coelho*',
arabic: '💐 *Frase:* _No midas tu riqueza por el dinero que tienes, mídela por aquellas cosas que tienes y que no cambiarías por dinero._',
translation_id:
'💐 *Opinión:* En una sociedad materialista es fácil autoevaluarse en función de las posesiones que tenemos, y este tipo de valoraciones son muy negativas para la autoestima.',
translation_en: 'Además, lo que realmente te hará feliz en el día a día, son esas pequeñas cosas y esos momentos agradables.'
},
{
index: 3,
latin: '💐 *Autor:* *Anónimo*',
arabic: '💐 *Frase:* _Pedir perdón es de inteligentes, perdonar es de nobles y perdonarse es de sabios._',
translation_id:
'💐 *Opinión:* El perdón es una de las mejores terapias emocionales. Si pides perdón y si perdonas, demuestra tu grandeza como individuo. Pero más grande eres, y mejor vas a estar emocionalmente, si también te perdonas a ti mismo. Algo que parece fácil en la teoría, pero que se vuelve complicado en la práctica.',
translation_en:
"Si te identificas con esta frase porque te cuesta perdonarte a ti mismo, el Mindfulness te puede ser de gran utilidad. También existe una filosofía hawaiana llamada Ho'oponopono que basa su efectividad en el perdón espiritual."
},
{
index: 4,
latin: '💐 *Autor:* *Anónimo*',
arabic: '💐 *Frase:* _Si quieres algo que nunca tuviste, debes hacer algo que nunca hiciste._',
translation_id: '💐 *Opinión:* Si haces siempre lo mismo, seguramente siempre tendrás las mismas consecuencias. ',
translation_en:
'Si lo que quieres es tener nuevas experiencias, conocer a gente interesante o crecer en el trabajo, mejor que empieces a plantearte nuevas actividades y hagas cosas que habitualmente no haces.'
},
{
index: 5,
latin: '💐 *Autor:* *Proverbio turco*',
arabic: '💐 *Frase:* _El que busca un amigo sin defectos se queda sin amigos._',
translation_id:
'💐 *Opinión:* La intención esta frase es hacernos notar que todos tenemos defectos y cometemos muchos errores, no hay persona perfecta en este mundo. ',
translation_en: 'Ser una persona demasiado perfeccionista provoca consecuencias negativas para uno mismo.'
},
{
index: 6,
latin: '💐 *Autor:* *Proverbio escocés*',
arabic: '💐 *Frase:* _La sonrisa cuesta menos que la electricidad y da más luz._',
translation_id:
'💐 *Opinión:* Esta frase es una de esas frases inspiradoras, pero también es una frase sabia. Sonreír ayuda a mantener el buen humor, embellece el rostro y despierta buenos pensamientos.  ',
translation_en:
'No es lo mismo pedirle algo a alguien fríamente, que pedirlo con una sonrisa, pues la sonrisa no solamente produce un efecto muy positivo en nosotros mismos, también en la otra persona.'
},
{
index: 7,
latin: '💐 *Autor:* *Henry Ford*',
arabic: '💐 *Frase:* _No encuentres la falta, encuentra el remedio._',
translation_id:
'💐 *Opinión:* Esta frase me recuerda a una que un buen amigo siempre me decía: “ Si no formas parte de la solución, pasas a formar parte del problema.',
translation_en:
'Ambas frases no nos quieren decir que no debemos buscar el origen del problema, pues es necesario hacerlo. Pero en lugar de quedarnos lamentando la falla de manera eterna, debemos solucionar lo antes posible lo que ha ocurrido mal. Esta es la clave para mejorar.'
},
{
index: 8,
latin: '💐 *Autor:* *William George Ward*',
arabic: '💐 *Frase:* _El pesimista se queja del viento; el optimista espera que cambie; el realista ajusta las velas._',
translation_id: '💐 *Opinión:* Tanto ser un pesimista como demasiado optimista puede traer consecuencias negativas para uno mismo.',
translation_en:
'El pesimista todo lo va a ver mal y no existirá nada para que ese mal cambie. El optimista todo lo va a ver bien y distorsiona la realidad para que encaje con sus pensamientos. En cambio, una persona realista trata de solucionar los problemas pese a saber que es complicado en muchas ocasiones. Es decir, mantiene los pies en el suelo y actúa de manera sensata.'
},
{
index: 9,
latin: '💐 *Autor:* *Madre Teresa de Calcuta*',
arabic: '💐 *Frase:* _A veces sentimos que lo que hacemos es tan solo una gota en el mar, pero el mar sería mucho menos si le faltara una gota._',
translation_id:
'💐 *Opinión:* Significa que aunque sintamos que lo que hacemos no sirve para nada, cada cosa que hacemos tiene una consecuencia.',
translation_en:
'A veces no somos capaces de ver esa consecuencia inmediatamente, o a veces es solamente un paso más en un camino que estamos recorriendo. Se trata de ir construyendo y al final llegará la recompensa.'
},
{
index: 10,
latin: '💐 *Autor:* *Buddha*',
arabic: '💐 *Frase:* _La reflexión es el camino hacia la inmortalidad; la falta de reflexión, el camino hacia la muerte._',
translation_id:
'💐 *Opinión:* Esta frase extraída de la filosofía budista hace referencia a la importancia de la reflexión en el desarrollo personal y en el aprendizaje por y para la vida.',
translation_en:
'Todos hemos aprendido de los errores, pero cada uno vive las experiencias de manera única. Para poder retener estas experiencias, es necesario un proceso de pensamiento activo sobre lo que vivimos, para, de esta manera, cuestionarnos el sentido que tienen estas experiencias para nosotros.'
},
{
index: 11,
latin: '💐 *Autor:* *Francis Bacon*',
arabic: '💐 *Frase:* _La ocasión hay que crearla, no esperar a que llegue._',
translation_id: '💐 *Opinión:* Esta frase se refiere a que las oportunidades hay que buscarlas, no van a venir solas.',
translation_en: 'Es decir, si queremos algo, hay que luchar por ello. Un antídoto contra la Parálisis del análisis.'
},
{
index: 12,
latin: '💐 *Autor:* *Napoleón*',
arabic: '💐 *Frase:* _Los sabios son los que buscan la sabiduría; los necios piensan haberla encontrado._',
translation_id: '💐 *Opinión:* Esta frase se refiere a que las oportunidades hay que buscarlas, no van a venir solas.',
translation_en: 'Es decir, si queremos algo, hay que luchar por ello. Un antídoto contra la Parálisis del análisis.'
},
{
index: 13,
latin: '💐 *Autor:* *Séneca*',
arabic: '💐 *Frase:* _No es pobre el que tiene poco, sino el que mucho desea._',
translation_id:
'💐 *Opinión:* Esta frase es igual a la frase “No es más rico el que más tiene, sino el que menos necesita”, y se refiere a que las personas que menos cosas materiales desean o necesitan, son las que definitivamente van a ser más felices en la vida.',
translation_en: 'Tener mucho no significa ser más feliz, pues si uno se contenta con poco, no necesita tener mucha riqueza.'
},
{
index: 14,
latin: '💐 *Autor:* *William Shakespeare*',
arabic: '💐 *Frase:* _Si no recuerdas la más ligera locura en que el amor te hizo caer, no has amado._',
translation_id:
'💐 *Opinión:* Esta frase del autor de Romeo y Julieta nos recuerda que el enamoramiento es una de las sensaciones más extraordinarias de las que puede disfrutar el ser humano.',
translation_en:
'El amor es como una droga que te puede hacer sentir en pleno subidón y te puede hacer cometer locuras increíbles que jamás hayas pensado.'
},
{
index: 15,
latin: '💐 *Autor:* *Anónimo*',
arabic: '💐 *Frase:* _Cuando el sabio señala la luna, el tonto se fija en el dedo._',
translation_id: '💐 *Opinión:* Los necios no quieren ver más allá de lo que sus ojos pueden ver.',
translation_en:
'En cambio, los sabios expanden su mente, son creativos y reflexionan. Mientras el sabio es un explorador, el necio es conformista.'
},
{
index: 16,
latin: '💐 *Autor:* *Ralph Waldo Emerson*',
arabic: '💐 *Frase:* _Un amigo es una persona con la que se puede pensar en voz alta._',
translation_id: '💐 *Opinión:* Un auténtico amigo es esa persona que no te va a fallar y a la que le puedes confiar tus mayores secretos.',
translation_en:
'Esta frase define el significado de amistad y resalta la importancia de la confianza plena en alguien. Sin duda, quien tiene un amigo tiene un tesoro y debemos valorar esta conexión con otras personas.'
},
{
index: 17,
latin: '💐 *Autor:* *Buddha*',
arabic: '💐 *Frase:* _El dolor es inevitable pero el sufrimiento es opcional._',
translation_id:
'💐 *Opinión:* Todos podemos vivir experiencias que nos hagan sufrir y pasarlo mal, y esto tiene un proceso para superarlo pues es parte de la vida.',
translation_en:
'Pero nosotros tenemos la posibilidad de hacer cosas para no quedarnos estancados en el sufrimiento. Por tanto, es decisión nuestra superar las malas experiencias lo antes posible.'
},
{
index: 18,
latin: '💐 *Autor:* *David Abernathy*',
arabic: '💐 *Frase:* _Se puede matar al soñador, pero no al sueño._',
translation_id: '💐 *Opinión:* Una frase que nos explica que la carne es finita, pero no así las ideas.',
translation_en: 'Incluso lo intagible es finito.'
},
{
index: 19,
latin: '💐 *Autor:* *Benjamin Franklin*',
arabic: '💐 *Frase:* _Quien tiene paciencia, obtendrá lo que desea._',
translation_id: '💐 *Opinión:* Uno de los primeros presidentes de los Estados Unidos nos informa sobre la gran virtud que es la paciencia.',
translation_en: 'Dicha virtud que no todos tienen.'
},
{
index: 20,
latin: '💐 *Autor:* *Pitágoras*',
arabic: '💐 *Frase:* _Educad a los niños, y no será necesario castigar a los hombres._',
translation_id: '💐 *Opinión:* Pitágoras el griego sobre la gran trascendencia de la educación en una sociedad.',
translation_en: 'Hacer el mal a alguien en su plena etapa de cremiento no es bueno.'
},
{
index: 21,
latin: '💐 *Autor:* *Confucio*',
arabic: '💐 *Frase:* _Aprender sin reflexionar es malgastar la energía._',
translation_id:
'💐 *Opinión:* El sabio pensador chino Confucio, sobre la necesidad de llevar a cabo un estilo de aprendizaje basado en la reflexión.',
translation_en: 'Saber no gastar el tiempo.'
},
{
index: 22,
latin: '💐 *Autor:* *Maquiavelo*',
arabic: '💐 *Frase:* _Las personas ofenden antes a los que aman que a los que temen._',
translation_id:
'💐 *Opinión:* Las personas que son obstinadas pueden causarnos cierto miedo, es por eso que vamos con pies de plomo a la hora de tratar con ellas.',
translation_en: 'Tener cuidado con ese tipo de personas.'
},
{
index: 23,
latin: '💐 *Autor:* *Francis Bacon*',
arabic: '💐 *Frase:* _La amistad duplica las alegrías y divide las angustias por la mitad._',
translation_id:
'💐 *Opinión:* Una verdad innegable; la vida es menos cruda cuando la pasamos cerca de personas que nos quieren de forma genuina.',
translation_en: 'La amistad puede ser buena dependiendo de las personas.'
},
{
index: 24,
latin: '💐 *Autor:* *Friedrich Nietzsche*',
arabic: '💐 *Frase:* _Solamente aquel que construye el futuro tiene derecho a juzgar el pasado._',
translation_id:
'💐 *Opinión:* Nietzsche nos dejó muchas citas célebres, como por ejemplo esta, que nos indica la relevancia de tomar el control de nuestras vidas.',
translation_en: 'Recuerda tomar Agua. 👀'
},
{
index: 25,
latin: '💐 *Autor:* *Johann Kaspar Lavater*',
arabic:
'💐 *Frase:* _Si quieres ser sabio, aprende a interrogar razonablemente, a escuchar con atención, a responder serenamente y a callar cuando no tengas nada que decir._',
translation_id: '💐 *Opinión:* Unos consejos prácticos para alcanzar altas cotas de inteligencia y sabiduría.',
translation_en: 'Consejos que salvan vidas.'
},
{
index: 26,
latin: '💐 *Autor:* *Jorge Luis Borges*',
arabic: '💐 *Frase:* _He cometido el peor pecado que uno puede cometer. No he sido feliz._',
translation_id: '💐 *Opinión:* Borges nos dejó esta reflexión, que demuestra que no estuvo suficientemente atento a gozar de la vida.',
translation_en: 'Vivela, tal vez sea la ultima.'
},
{
index: 27,
latin: '💐 *Autor:* *Platón*',
arabic: '💐 *Frase:* _La libertad está en ser dueños de nuestra propia vida._',
translation_id: '💐 *Opinión:* La libertad es uno de los conceptos más ampliamente estudiados por los filósofos.',
translation_en: 'Aquí, Platón nos explica cuál es la clave para ser libre.'
},
{
index: 28,
latin: '💐 *Autor:* *René Descartes*',
arabic: '💐 *Frase:* _Daría todo lo que sé, por la mitad de lo que ignoro._',
translation_id:
'💐 *Opinión:* El francés René Descartes también era totalmente consciente de que, a pesar de ser uno de los más brillantes pensadores modernos, ignoraba mucho más de lo que conocía.',
translation_en: 'Ignorar las cosas, no es bueno.'
},
{
index: 29,
latin: '💐 *Autor:* *Baltasar Gracián*',
arabic: '💐 *Frase:* _Saber y saberlo demostrar es valer dos veces._',
translation_id: '💐 *Opinión:* Una de las diferencias entre el conocimiento superficial y el conocimiento profundo, según Baltasar Gracián.',
translation_en: 'Poner en práctica lo que sabes.'
},
{
index: 30,
latin: '💐 *Autor:* *Lao-tsé*',
arabic: '💐 *Frase:* _Saber que no se sabe, eso es humildad. Pensar que uno sabe lo que no sabe, eso es enfermedad._',
translation_id:
'💐 *Opinión:* Lao-tsé ahonda en el asunto de la ignorancia y la percepción de sabiduría, en la línea de otros pensadores que pronunciaron frases similares.',
translation_en: 'No ser ignorante.'
},
{
index: 31,
latin: '💐 *Autor:* *Epicteto de Frigia*',
arabic:
'💐 *Frase:* _La persona sabia no debe abstenerse de participar en el gobierno del Estado, pues es un delito renunciar a ser útil a los necesitados y un cobardía ceder el paso a los indignos._',
translation_id:
'💐 *Opinión:* Una reflexión de corte político; los ciudadanos sabios deben intentar participar en la gestión de la polis, para aportar su granito de arena a una administración que debe ser justa con todos.',
translation_en: 'Recuerda tener tiempo para todo.'
},
{
index: 32,
latin: '💐 *Autor:* *Confucio*',
arabic: '💐 *Frase:* _La vida es muy simple, pero insistimos en hacerla complicada._',
translation_id:
'💐 *Opinión:* El filósofo Confucio creía que la vida se rige por principios simples que debemos adoptar como normas para nuestro día a día.',
translation_en: 'Es tan simple...'
},
{
index: 33,
latin: '💐 *Autor:* *Abraham Lincoln*',
arabic: '💐 *Frase:* _Al final, no son los años en nuestra vida lo que cuenta, sino la vida en nuestros años._',
translation_id: '💐 *Opinión:* Lincoln, sobre el criterio de calidad que según él deberíamos aplicar a la hora de valorar nuestras vidas.',
translation_en: 'Todos omiten el hecho que cada vez se acercan la muerte con el pasar del tiempo, pero si vives plenamente habrá valido la pena'
},
{
index: 34,
latin: '💐 *Autor:* *Voltaire*',
arabic: '💐 *Frase:* _Cada persona es una criatura del tiempo en el que vive._',
translation_id: '💐 *Opinión:* Voltaire creía que no podemos considerarnos seres independizados del contexto histórico que nos toca vivir.',
translation_en: 'Nuestras ideas y nuestro modo de vida están siempre condicionados por la fecha de nuestro nacimiento.'
},
{
index: 35,
latin: '💐 *Autor:* *Aristóteles*',
arabic: '💐 *Frase:* _Somos lo que hacemos repetidamente._',
translation_id:
'💐 *Opinión:* Aristóteles se distanció del idealismo de Platón; para él importaban más los hechos y el entorno, y esto queda claro en esta frase de la vida eminentemente filosófica.',
translation_en: 'Repetir nos hace mejor.'
},
{
index: 36,
latin: '💐 *Autor:* *Charlie Chaplin*',
arabic: '💐 *Frase:* _La vida es una tragedia cuando se ve en primer plano, pero en plano general pasa a ser una comedia._',
translation_id:
'💐 *Opinión:* Chaplin, como director de cine, sabía que un mismo hecho, o incluso la vida de una persona, cambia dependiendo del modo en el que se presente.',
translation_en: 'Malos y buenos momentos.'
},
{
index: 37,
latin: '💐 *Autor:* *Albert Camus*',
arabic: '💐 *Frase:* _El hombre es la única criatura que se niega a ser quien es._',
translation_id:
'💐 *Opinión:* Albert Camus, en una de sus frases filosóficas acerca de la lucha que el ser humano mantiene con la creación de un sentido para su existencia.',
translation_en: 'Aprende aceptar lo que eres.'
},
{
index: 38,
latin: '💐 *Autor:* *Cassandra Clare*',
arabic: '💐 *Frase:* _Todo conocimiento resulta hiriente._',
translation_id:
'💐 *Opinión:* Una frase sabia referida al modo en el que cada nueva pieza de conocimiento trastoca los cimientos de lo que creíamos que sabíamos.',
translation_en: 'Siempre hay algo por aprender'
},
{
index: 39,
latin: '💐 *Autor:* *Pablo Picasso*',
arabic: '💐 *Frase:* _Lleva mucho tiempo llegar a ser joven._',
translation_id:
'💐 *Opinión:* El reputado pintor invierte el orden temporal en el que se ubica la juventud para dar a entender que es, más que una fase biológica, algo aprendido.',
translation_en: 'Recuerda ser buena persona 😸'
},
{
index: 40,
latin: '💐 *Autor:* *Hannah Arendt*',
arabic: '💐 *Frase:* _El tiempo es aquello que más queremos y también lo que peor utilizamos._',
translation_id: '💐 *Opinión:* La filósofa Hannah Arendt, sobre el riesgo que conlleva la simple actividad de pensar.',
translation_en: 'Pensar nos hace mas autosuficientes.'
},
{
index: 41,
latin: '💐 *Autor:* *William Penn*',
arabic: '💐 *Frase:* _No hay pensamientos peligrosos; pensar es, en sí mismo, algo peligroso._',
translation_id:
'💐 *Opinión:* Una paradoja planteada por el filósofo inglés William Penn. Para ser conscientes de que la vida está para saberla aprovechar al máximo.',
translation_en: 'Si fuera posible cambiarlo, es probable el resultado de la paradoja del abuelo.'
},
{
index: 42,
latin: '💐 *Autor:* *David Ben-Gurión*',
arabic: '💐 *Frase:* _Alguien que no cree en los milagros no es realista._',
translation_id: '💐 *Opinión:* Acerca de las anomalías y hechos inexplicables contenidos en la realidad.',
translation_en: 'Si nunca has estado enfrente de una anomalía, tal vez pienses que no existe.'
},
{
index: 43,
latin: '💐 *Autor:* *Francis Bacon*',
arabic: '💐 *Frase:* _La esperanza es un buen desayuno, pero una mala cena._',
translation_id: '💐 *Opinión:* La esperanza como algo que tiene doble filo. ',
translation_en: 'Resulta positiva cuando todo un mundo de posibilidades se abre ante nosotros, pero no tanto cuando es el último recurso.'
},
{
index: 44,
latin: '💐 *Autor:* *Allan Bloom*',
arabic: '💐 *Frase:* _La educación es el movimiento de la oscuridad a la luz._',
translation_id: '💐 *Opinión:* Una imagen potente para explica lo que es la educación.',
translation_en: 'Imagen que dependiendo de como lo imaginas puede tener la verdad sobre ti'
},
{
index: 45,
latin: '💐 *Autor:* *Erich Fromm*',
arabic: '💐 *Frase:* _La creatividad requiere que la valentía se desprenda de las certezas._',
translation_id: '💐 *Opinión:* El padre del psicoanálisis humanista, sobre la relación entre la valentía y la incertidumbre.',
translation_en: 'Ser valiente te hace creativo/a'
},
{
index: 46,
latin: '💐 *Autor:* *Edmund Burke*',
arabic: '💐 *Frase:* _Aquellos que no conocen la historia están condenados a repetirla._',
translation_id: '💐 *Opinión:* El filósofo conservador Edmund Burke, sobre la necesidad de conocer el pasado.',
translation_en: 'Conoce el Pasado, te ahorra tiempo a un Futuro.'
},
{
index: 47,
latin: '💐 *Autor:* *Cicerón*',
arabic: '💐 *Frase:* _Nada es tan increíble como para que la oratoria no lo pueda transformar en aceptable._',
translation_id: '💐 *Opinión:* Cicerón habla sobre el poder de los discursos bien diseñados.',
translation_en: 'Un discurso puede convencer a muchos.'
},
{
index: 48,
latin: '💐 *Autor:* *Dante*',
arabic: '💐 *Frase:* _De una pequeña chispa puede prender una llama._',
translation_id: '💐 *Opinión:* Una frase sabia en la que se entrevé, mediante una imagen poética.',
translation_en: 'Modos insospechados en los que pueden aparecer fenómenos muy importantes y significativos.'
},
{
index: 49,
latin: '💐 *Autor:* *Dante*',
arabic: '💐 *Frase:* _El liderazgo no depende de estar en lo cierto._',
translation_id:
'💐 *Opinión:* Uno de los pensadores sobre la educación más importantes habla aquí sobre el modo en el que tenemos que interpretar la legitimidad del liderazgo.',
translation_en: 'Recuerda, si dices saberlo todo, eres un ignorante.'
},
{
index: 50,
latin: '💐 *Autor:* *B. F. Skinner*',
arabic: '💐 *Frase:* _El entorno da forma a las acciones del individuo._',
translation_id:
'💐 *Opinión:* El referente más importante de la psicología conductista habla sobre lo relativo de esa línea que separa individuo y entorno.',
translation_en: 'El entorno determina tus acciones.'
},
{
index: 51,
latin: '💐 *Autor:* *Stanislaw Jerzy Lec*',
arabic: '💐 *Frase:* _La juventud es un reglo de la naturaleza, pero la edad es una obra de arte._',
translation_id: '💐 *Opinión:* Un modo optimista de valorar la edad y el paso hacia la vejez.',
translation_en: 'La edad no determina tu forma de ver el mundo.'
},
{
index: 52,
latin: '💐 *Autor:* *Stanislaw Jerzy Lec*',
arabic: '💐 *Frase:* _Nadie puede herirme sin mi permiso._',
translation_id: '💐 *Opinión:* El influyente líder pacifista se refiere en esta frase sabia al poder de la propia voluntad.',
translation_en: 'Tener el agrado hacia lo que haces permitira que tu voluntad no se obstruya.'
},
{
index: 53,
latin: '💐 *Autor:* *David Carradine*',
arabic: '💐 *Frase:* _Si no puedes ser poeta, sé el poema._',
translation_id: '💐 *Opinión:* Una perspectiva diferente para ver el modo en el que nuestra vida puede tener carácter artístico.',
translation_en: 'Aprender a tener varias habilidades.'
},
{
index: 54,
latin: '💐 *Autor:* *Eurípides*',
arabic: '💐 *Frase:* _Nada tiene más fuerza que la extrema necesidad._',
translation_id:
'💐 *Opinión:* El poeta griego Eurípides habla sobre cómo, en última instancia , el poder de nuestros actos nace cuando nuestra libertad y situación para tomar decisiones se ven reducidas.',
translation_en: 'La necesidad puede ser un peligro.'
},
{
index: 55,
latin: '💐 *Autor:* *San Agustín*',
arabic: '💐 *Frase:* _La soberbia no es grandeza sino hinchazón; y lo que está hinchado parece grande pero no está sano._',
translation_id: '💐 *Opinión:* Uno de los problemas de la soberbia es que, tras la apariencia, esconde a alguien herido e inseguro.',
translation_en: 'La inseguridad hace que te veas menos.'
},
{
index: 56,
latin: '💐 *Autor:* *William Shakespeare*',
arabic: '💐 *Frase:* _Es mejor ser rey de tu silencio que esclavo de tus palabras._',
translation_id: '💐 *Opinión:* Nunca digas cosas de las que te puedas arrepentir en el futuro.',
translation_en: 'Cuando sucede eso, estas pensando de manera irracional.'
},
{
index: 57,
latin: '💐 *Autor:* *William Shakespeare*',
arabic: '💐 *Frase:* _La belleza es poder; una sonrisa es su espada._',
translation_id: '💐 *Opinión:* Una reflexión sobre la belleza y sus principales atributos.',
translation_en: 'Atributos que pueden ser arma de doble filo.'
},
{
index: 58,
latin: '💐 *Autor:* *Ogden Nash*',
arabic: '💐 *Frase:* _La edad adulta es cuando te has encontrado con tanta gente que cada nueva persona te recuerda a otra._',
translation_id: '💐 *Opinión:* Entonces, nada te sorprende.',
translation_en: 'La sabiduría de la edad adulta comporta unos ciertos problemas, como este que retrata Ogden Nash.'
},
{
index: 59,
latin: '💐 *Autor:* *Severo Ochoa*',
arabic: '💐 *Frase:* _En principio, la investigación necesita más cabezas que medios._',
translation_id: '💐 *Opinión:* Una frase de la vida y la ciencia que nos muestra la importancia del talento humano.',
translation_en: 'Talento humano, todos tienen almenos uno.'
},
{
index: 60,
latin: '💐 *Autor:* *Maquiavelo*',
arabic: '💐 *Frase:* _El que es elegido príncipe con el favor popular debe conservar al pueblo como amigo._',
translation_id: '💐 *Opinión:* Una reflexión de corte político según el mítico historiador italiano.',
translation_en: 'Una frase un tanto medieval.'
},
{
index: 61,
latin: '💐 *Autor:* *Camilo José Cela*',
arabic:
'💐 *Frase:* _La Historia nos enseña dos cosas: que jamás los poderosos coincidieron con los mejores, y que jamás la política fue tejida por los políticos._',
translation_id: '💐 *Opinión:* Sobre la política y la hegemonía, del gran escritor Camilo José Cela.',
translation_en: 'Poderosos que tal vez esten solos.'
},
{
index: 62,
latin: '💐 *Autor:* *José Ortega y Gasset*',
arabic: '💐 *Frase:* _Con la moral corregimos los errores de nuestros instintos, y con el amor los errores de nuestra moral._',
translation_id: '💐 *Opinión:* El ensayista español realiza una disquisición que cada uno debe interpretar.',
translation_en: 'Aprender a equivocarse. Irónico.'
},
{
index: 63,
latin: '💐 *Autor:* *Novalis*',
arabic: '💐 *Frase:* _Cuando veas un gigante, examina antes la posición del sol; no vaya a ser la sombra de un pigmeo._',
translation_id: '💐 *Opinión:* El engañarse ante su entorno.',
translation_en: 'Nuestra percepción puede engañarnos, por tanto tómate tu tiempo para reflexionar sobre las pequeñas cosas de la vida.'
},
{
index: 64,
latin: '💐 *Autor:* *Platón*',
arabic: '💐 *Frase:* _La pobreza no viene por la disminución de las riquezas, sino por la multiplicación de los deseos._',
translation_id: '💐 *Opinión:* Una reflexión del filósofo griego en que resalta el vicio de la avaricia.',
translation_en: 'Avaricia abunda en las personas sin caminos.'
},
{
index: 65,
latin: '💐 *Autor:* *Ovidio*',
arabic: '💐 *Frase:* _No os entreguéis por demasiado a la ira; una ira prolongada engendra odio._',
translation_id: '💐 *Opinión:* La rabia puede traernos consecuencias nefastas en nuestra vida.',
translation_en: 'No darle importancia al odio.'
},
{
index: 66,
latin: '💐 *Autor:* *Kant*',
arabic: '💐 *Frase:* _La educación es el desarrollo sobre la persona de toda la perfección de que su naturaleza es capaz._',
translation_id:
'💐 *Opinión:* Para concluir la selección de frases, esta reflexión del filósofo alemán para evidenciar la importancia de la educación.',
translation_en: 'La educación lo es todo.'
},
{
index: 67,
latin: '💐 *Autor:* *Arturo Pérez-Reverte*',
arabic:
'💐 *Frase:* _El problema de las palabras es que, una vez echadas, no pueden volverse solas a su dueño. De modo que a veces te las vuelven en la punta de un acero._',
translation_id: '💐 *Opinión:* El literato español, sobre la crueldad de lo dicho.',
translation_en: 'Recuerda decir bien las cosas, sin arrepentimientos.'
},
{
index: 68,
latin: '💐 *Autor:* *Winston Churchill*',
arabic: '💐 *Frase:* _El esfuerzo constante – no la fuerza o la inteligencia – es la clave para liberar nuestro potencial._',
translation_id: '💐 *Opinión:* Mítica reflexión sobre la constancia y la perseverancia.',
translation_en: 'Todo esfuerzo tiene su recompensa.'
},
{
index: 69,
latin: '💐 *Autor:* *Ernesto Sábato*',
arabic: '💐 *Frase:* _Ser original es en cierto modo estar poniendo de manifiesto la mediocridad de los demás._',
translation_id: '💐 *Opinión:* Una de esas frases sabias no aptas para mentes cerradas.',
translation_en: 'Hay que saber ser Original en base a ideas que existen con un estilo propio.'
},
{
index: 70,
latin: '💐 *Autor:* *Mark Twain*',
arabic: '💐 *Frase:* _No hay nada tan grotesco o increíble que el ser humano medio no pueda creer._',
translation_id: '💐 *Opinión:* La imaginación no tiene límites, para bien o para mal.',
translation_en: 'Recuerda imaginar paera bien.'
},
{
index: 71,
latin: '💐 *Autor:* *Napoleón*',
arabic: '💐 *Frase:* _Nunca interrumpas a tu enemigo cuanto está cometiendo una equivocación._',
translation_id: '💐 *Opinión:* Un consejo táctico de este famoso militar.',
translation_en: 'Recuerda siempre tener ventajas.'
},
{
index: 72,
latin: '💐 *Autor:* *Lao-Tsé*',
arabic: '💐 *Frase:* _Conocer a los demás es sabiduría; conocerse a uno mismo es iluminación._',
translation_id: '💐 *Opinión:* El auto-conocimiento como aspecto fundamental de la vida.',
translation_en: 'Hay que tener iniciativa para aprender en el camino por cuenta propia.'
},
{
index: 73,
latin: '💐 *Autor:* *Charles Bukowski*',
arabic: '💐 *Frase:* _Estamos aquí para vivir nuestras vidas tan bien que la Muerte tiemble al arrebatárnoslas._',
translation_id: '💐 *Opinión:* Una credencia del vitalismo.',
translation_en: 'Vive como si fuera el último día.'
},
{
index: 74,
latin: '💐 *Autor:* *B.F. Skinner*',
arabic: '💐 *Frase:* _No deberíamos instruir en la lectura de libros, sino enseñar a amar los libros._',
translation_id: '💐 *Opinión:* Un aprendizaje de tipo emocional.',
translation_en: 'Un mundo de letras...'
},
{
index: 75,
latin: '💐 *Autor:* *Martin Luther King*',
arabic: '💐 *Frase:* _Tu verdad aumentará en la medida que sepas escuchar la verdad de los otros._',
translation_id: '💐 *Opinión:* La sabiduría no está compuesta de descubrimientos realizados individualmente.',
translation_en: 'Sino que incluye lo que aprendemos de los demás.'
},
{
index: 76,
latin: '💐 *Autor:* *Mario Benedetti*',
arabic: '💐 *Frase:* _No te rindas, porque cada día es un comienzo nuevo, porque esta es la hora y el mejor momento._',
translation_id: '💐 *Opinión:* Una manera de ver el ahora que además nos sirve como fuente de motivación.',
translation_en: 'La paz se puede si todos están de acuerdo.'
},
{
index: 77,
latin: '💐 *Autor:* *Erasmo de Rotterdam*',
arabic: '💐 *Frase:* _La paz más desventajosa es mejor que la guerra más justa._',
translation_id: '💐 *Opinión:* Una apreciación moral acerca del valor de la paz.',
translation_en: 'En la guerra nadie gana, solo hay dolor.'
},
{
index: 78,
latin: '💐 *Autor:* *Baruch Spinoza*',
arabic: '💐 *Frase:* _Si no quieres repetir el pasado, estúdialo._',
translation_id: '💐 *Opinión:* La memoria nos permite aprender de nuestros errores, y eso es algo que hay que aprovechar.',
translation_en: 'Es la mejor manera de no volver a caer.'
},
{
index: 79,
latin: '💐 *Autor:* *Anselmo de Canterbury*',
arabic: '💐 *Frase:* _Los desastres nos enseñan humildad._',
translation_id: '💐 *Opinión:* Incluso las crisis tienen algo bueno, pues nos recuerdan nuestro escaso poder frente al mundo.',
translation_en: 'El ser humano no puede con todo.'
},
{
index: 80,
latin: '💐 *Autor:* *Nelson Mandela*',
arabic: '💐 *Frase:* _No hay nada como volver a un lugar que permanece sin cambiar para encontrar las formas en las que tú mismo has cambiado._',
translation_id: '💐 *Opinión:* La interacción con el entorno nos permite conocernos mejor.',
translation_en: 'Recordar que todo sigue igual... Es un buen sentimiento.'
},
{
index: 81,
latin: '💐 *Autor:* *Epícuro*',
arabic: '💐 *Frase:* _Cuanto más grande es la dificultad, más gloria hay en superarla._',
translation_id: '💐 *Opinión:* El filósofo griego, fundador epicureísmo, nos deja esta gran frase motivadora para la historia.',
translation_en: 'Saberse superar....'
},
{
index: 82,
latin: '💐 *Autor:* *Friedrich Hegel*',
arabic: '💐 *Frase:* _Ser independiente de la opinión pública es la primera condición formal para lograr algo grande._',
translation_id: '💐 *Opinión:* Pensar nos hace ver las cosas de una manera alterna.',
translation_en: 'Una frase que habla del pensamiento propio.'
},
{
index: 83,
latin: '💐 *Autor:* *Leibniz*',
arabic: '💐 *Frase:* _Vivimos en el mejor de los posibles mundos._',
translation_id: '💐 *Opinión:* Al menos éste es el único que conocemos.',
translation_en: 'Con sus cosas buenas y sus cosas malas.'
},
{
index: 84,
latin: '💐 *Autor:* *Benjamin Franklin*',
arabic: '💐 *Frase:* _El que es bueno para poner excusas rara vez es bueno para cualquier otra cosa._',
translation_id: '💐 *Opinión:* Los cobardes ponen excusas en vez de afrontar la realidad.',
translation_en: 'Solo sabe evadir, y no afrontar.'
},
{
index: 85,
latin: '💐 *Autor:* *Noam Chomsky*',
arabic: '💐 *Frase:* _Si no creemos en la libertad de expresión de las personas que despreciamos, no creemos en ella en absoluto._',
translation_id: '💐 *Opinión:* Una frase que nos recuerda la importancia de la libertad de expresión.',
translation_en: 'La libertad es buena cuando somos libre de manera educada.'
},
{
index: 86,
latin: '💐 *Autor:* *Tales*',
arabic: '💐 *Frase:* _La cosa más difícil en la vida es conocerte a ti mismo._',
translation_id: '💐 *Opinión:* El autoconocimiento es clave para tener una vida emocional sana.',
translation_en: 'Siempre es bueno no dejar de aprender.'
},
{
index: 87,
latin: '💐 *Autor:* *Epíteto*',
arabic: '💐 *Frase:* _No es lo que te ocurre, sino cómo reaccionas lo que importa._',
translation_id: '💐 *Opinión:* Sobre la importancia de evaluar de forma positiva los hechos.',
translation_en: 'Hasta lo malo puede ser bueno.'
},
{
index: 88,
latin: '💐 *Autor:* *George Savile*',
arabic: '💐 *Frase:* _La persona que es una maestra en la paciencia puede con todo lo demás._',
translation_id: '💐 *Opinión:* Una frase del personaje célebre George Savile que hablar del poder de la paciencia.',
translation_en: 'Si te consideras una persona paciente, vales mucho como persona.'
},
{
index: 89,
latin: '💐 *Autor:* *Mark Twain*',
arabic: '💐 *Frase:* _No hay una visión más triste que la de un joven pesimista._',
translation_id: '💐 *Opinión:* Mark Twain habla sobre el valor asociado a la juventud y el error de desperdiciar esta etapa de la vida.',
translation_en: 'Es muy joven el mundo como para estar triste.'
},
{
index: 90,
latin: '💐 *Autor:* *Umberto Eco*',
arabic: '💐 *Frase:* _Nada es más nocivo para la creatividad que el furor de la inspiración._',
translation_id: '💐 *Opinión:* Una gran frase del siempre recordado, Umberto Eco.',
translation_en: 'Todos tenemos una idea de la vida.'
},
{
index: 91,
latin: '💐 *Autor:* *Emerson*',
arabic: '💐 *Frase:* _El éxito consiste en obtener lo que se desea. La felicidad, en disfrutar lo que se obtiene._',
translation_id: '💐 *Opinión:* Una frase que deberíamos tener siempre en nuestra cabeza.',
translation_en: 'Disfrutar del esfuerzo...'
},
{
index: 92,
latin: '💐 *Autor:* *Henry David Thoreau*',
arabic: '💐 *Frase:* _Casi todas las personas viven la vida en una silenciosa desesperación._',
translation_id: '💐 *Opinión:* Una frase que pretende explicar la complejidad de la vida y los malos momentos que uno puede experimentar.',
translation_en: 'Experimentar la vida y ver como nos sorprende.'
},
{
index: 93,
latin: '💐 *Autor:* *D. Pire*',
arabic: '💐 *Frase:* _Andaríamos mejor si no fuera porque hemos construido demasiados muros y no suficientes puentes._',
translation_id: '💐 *Opinión:* Una frase sobre lo peor del ser humano. Los muros nunca han sido buenos.',
translation_en: 'Divider el mundo solo hace ser menos fuerte todo.'
},
{
index: 94,
latin: '💐 *Autor:* *Jairo Fowbier Pabón*',
arabic: '💐 *Frase:* _La experiencia no es cuanto se vive sino todo el bien que se aprende._',
translation_id: '💐 *Opinión:* La experiencia nos sirve para aprender.',
translation_en: 'Aprender es saber asumir que no lo sabes todo.'
},
{
index: 95,
latin: '💐 *Autor:* *Chamfort*',
arabic: '💐 *Frase:* _La falsa modestia es la más decente de todas las mentiras._',
translation_id: '💐 *Opinión:* Hace referencia a la falsa modestia. Pues, dentro de las mentiras, es la menos mala.',
translation_en: 'Hay que ser directo(a) en todo.'
},
{
index: 96,
latin: '💐 *Autor:* *C.G. Jung*',
arabic: '💐 *Frase:* _Tú eres aquello que haces, no aquello que dices que harás._',
translation_id: '💐 *Opinión:* Tus acciones determinan aquello que eres, no tus palabras.',
translation_en: 'Si vas a decirlo demuestra que lo puedes cumplir.'
},
{
index: 97,
latin: '💐 *Charles Dickens*',
arabic:
'💐 *Frase:* _El corazón humano es un instrumento de muchas cuerdas; el perfecto conocedor de personas, las sabe hacer vibrar todas, como un buen músico._',
translation_id: '💐 *Opinión:* La persona que se conoce es una persona poderosa.',
translation_en: 'Siempre hay algo nuevo por conocer.'
},
{
index: 98,
latin: '💐 *Solomon Asch*',
arabic: '💐 *Frase:* _La mayoría de actos sociales deben ser entendidos en su contexto, ya que pierden significado si son aislados._',
translation_id: '💐 *Opinión:* Las personas somos seres biopsicosociales.',
translation_en: 'Es decir, el contexto es importante en influye en cómo actuamos.'
},
{
index: 99,
latin: '💐 *Erich Fromm*',
arabic:
'💐 *Frase:* _Si una persona ama solo a una persona y es indiferente ante todos los demás, su amor no es amor, sino apego simbiótico o egoísmo ampliada._',
translation_id: '💐 *Opinión:* Cuando estamos enamorados de alguien, daríamos la vida por esa persona.',
translation_en:
'Podemos engañarnos y creer que somos buenas personas, pero hasta los más egoístas pueden perder la cabeza por alguien y parecer personas entregadas.'
}
]
