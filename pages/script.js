const test = {
  "AJUSTES/INFO - GRUPO": {
    "configuracion": { "brief": "Muestra o cambia la configuración del bot", "usage": ".configuracion" },
    "settings": { "brief": "Accede a los ajustes del bot", "usage": ".settings" },
    "vergrupo": { "brief": "Muestra información del grupo", "usage": ".vergrupo" }
  },
  "COMANDOS DE GRUPO": {
    "Administración": {
      "add": { "brief": "Agrega un número al grupo", "usage": ".add numero" },
      "sacar": { "brief": "Expulsa o banea un usuario", "usage": ".sacar | ban | kick @tag" },
      "mute": { "brief": "Silencia a un usuario", "usage": ".mute | unmute @tag" },
      "daradmin": { "brief": "Promueve a admin", "usage": ".daradmin | promote @tag" },
      "quitar": { "brief": "Quita el rol de admin", "usage": ".quitar | demote @tag" },
      "grupo": { "brief": "Abre o cierra grupo", "usage": ".grupo abrir o cerrar | group open o close" },
      "banchat": { "brief": "Bloquea el chat", "usage": ".banchat" },
      "unbanchat": { "brief": "Desbloquea el chat", "usage": ".unbanchat" },
      "banuser": { "brief": "Banea un usuario", "usage": ".banuser @tag" },
      "unbanuser": { "brief": "Desbanea un usuario", "usage": ".unbanuser @tag" },
      "admins": { "brief": "Muestra admins del grupo", "usage": ".admins texto" },
      "invocar": { "brief": "Invoca un usuario", "usage": ".invocar texto" },
      "tagall": { "brief": "Etiqueta a todos los miembros", "usage": ".tagall texto" },
      "hidetag": { "brief": "Etiqueta sin notificación", "usage": ".hidetag texto" },
      "infogrupo": { "brief": "Información del grupo", "usage": ".infogrupo | infogroup" },
      "grupotiempo": { "brief": "Tiempo de actividad del grupo", "usage": ".grupotiempo | grouptime Cantidad" },
      "advertencia": { "brief": "Gestiona advertencias", "usage": ".advertencia @tag" },
      "deladvertencia": { "brief": "Elimina advertencia", "usage": ".deladvertencia @tag" },
      "delwarn": { "brief": "Elimina advertencia", "usage": ".delwarn @tag" },
      "enlace": { "brief": "Obtiene el enlace del grupo", "usage": ".enlace | link" },
      "newnombre": { "brief": "Cambia el nombre del grupo", "usage": ".newnombre | nuevonombre texto" },
      "newdesc": { "brief": "Cambia la descripción del grupo", "usage": ".newdesc | descripcion texto" },
      "setwelcome": { "brief": "Configura mensaje de bienvenida", "usage": ".setwelcome | bienvenida texto" },
      "setbye": { "brief": "Configura mensaje de despedida", "usage": ".setbye | despedida texto" },
      "nuevoenlace": { "brief": "Genera un nuevo enlace de grupo", "usage": ".nuevoenlace | resetlink" },
      "on": { "brief": "Activa funciones", "usage": ".on" },
      "off": { "brief": "Desactiva funciones", "usage": ".off" }
    },
    "Votaciones": {
      "crearvoto": { "brief": "Inicia votación", "usage": ".crearvoto | startvoto texto" },
      "sivotar": { "brief": "Votar a favor", "usage": ".sivotar | upvote" },
      "novotar": { "brief": "Votar en contra", "usage": ".novotar | devote" },
      "vervotos": { "brief": "Muestra votos", "usage": ".vervotos | cekvoto" },
      "delvoto": { "brief": "Elimina votación", "usage": ".delvoto | deletevoto" }
    }
  },
  "DESCARGAS": {
    "imagen": { "brief": "Descarga una imagen", "usage": ".imagen | image texto" },
    "pinterest": { "brief": "Descarga Pinterest", "usage": ".pinterest | dlpinterest texto" },
    "wallpaper": { "brief": "Descarga wallpaper", "usage": ".wallpaper | wp texto" },
    "play": { "brief": "Reproduce audio o link", "usage": ".play | play2 texto o link" },
    "play1": { "brief": "Reproduce audio 1", "usage": ".play.1 texto o link" },
    "play2": { "brief": "Reproduce audio 2", "usage": ".play.2 texto o link" },
    "ytmp3": { "brief": "Descarga YouTube MP3", "usage": ".ytmp3 | yta link" },
    "ytmp4": { "brief": "Descarga YouTube MP4", "usage": ".ytmp4 | ytv link" },
    "pdocaudio": { "brief": "Descarga documento audio", "usage": ".pdocaudio | ytadoc link" },
    "pdocvieo": { "brief": "Descarga documento video", "usage": ".pdocvieo | ytvdoc link" },
    "tw": { "brief": "Descarga Twitter", "usage": ".tw | twdl | twitter link" },
    "facebook": { "brief": "Descarga Facebook", "usage": ".facebook | fb link" },
    "instagram": { "brief": "Descarga Instagram", "usage": ".instagram link video o imagen" },
    "verig": { "brief": "Ver perfil IG", "usage": ".verig | igstalk usuario(a)" },
    "ighistoria": { "brief": "Ver historia IG", "usage": ".ighistoria | igstory usuario(a)" },
    "tiktok": { "brief": "Descarga TikTok", "usage": ".tiktok link" },
    "tiktokimagen": { "brief": "Descarga imagen TikTok", "usage": ".tiktokimagen | ttimagen link" },
    "tiktokfoto": { "brief": "Descarga foto TikTok", "usage": ".tiktokfoto | tiktokphoto usuario(a)" },
    "vertiktok": { "brief": "Ver perfil TikTok", "usage": ".vertiktok | tiktokstalk usuario(a)" },
    "mediafire": { "brief": "Descarga Mediafire", "usage": ".mediafire | dlmediafire link" },
    "clonarepo": { "brief": "Clona repositorio", "usage": ".clonarepo | gitclone link" },
    "drive": { "brief": "Descarga Drive", "usage": ".drive | dldrive link" },
    "clima": { "brief": "Consulta clima", "usage": ".clima país ciudad" },
    "consejo": { "brief": "Muestra consejo", "usage": ".consejo" },
    "morse_codificar": { "brief": "Codifica a morse", "usage": ".morse codificar texto" },
    "morse_decodificar": { "brief": "Decodifica morse", "usage": ".morse decodificar morse" },
    "fraseromantica": { "brief": "Muestra frase romántica", "usage": ".fraseromantica" },
    "historia": { "brief": "Cuenta historia", "usage": ".historia" }
  },
  "CHAT ANONIMO": {
    "chatanonimo": { "brief": "Inicia chat anónimo", "usage": ".chatanonimo | anonimochat" },
    "anonimoch": { "brief": "Chat anónimo alternativo", "usage": ".anonimoch" },
    "start": { "brief": "Comienza sesión anónima", "usage": ".start" },
    "next": { "brief": "Siguiente conversación", "usage": ".next" },
    "leave": { "brief": "Salir del chat", "usage": ".leave" }
  },
  "PAREJAS": {
    "listaparejas": { "brief": "Lista parejas", "usage": ".listaparejas | listship" },
    "mipareja": { "brief": "Muestra mi pareja", "usage": ".mipareja | mylove" },
    "pareja": { "brief": "Información de pareja", "usage": ".pareja | couple @tag" },
    "aceptar": { "brief": "Acepta pareja", "usage": ".aceptar | accept @tag" },
    "rechazar": { "brief": "Rechaza pareja", "usage": ".rechazar | decline @tag" },
    "terminar": { "brief": "Termina pareja", "usage": ".terminar | finish @tag" }
  }

  ,
  "CONTENIDO": {
    "hornymenu": { "brief": "Contenido para adultos", "usage": ".hornymenu" }
  },
  "CONVERTIDORES": {
    "toimg": { "brief": "Convierte a imagen", "usage": ".toimg | img | jpg sticker" },
    "toanime": { "brief": "Convierte a anime", "usage": ".toanime | jadianime foto" },
    "tomp3": { "brief": "Convierte a mp3", "usage": ".tomp3 | mp3 video o nota de voz" },
    "tovn": { "brief": "Convierte a vn", "usage": ".tovn | vn video o audio" },
    "tovideo": { "brief": "Convierte audio a video", "usage": ".tovideo audio" },
    "tourl": { "brief": "Convierte a URL", "usage": ".tourl video, imagen" },
    "toenlace": { "brief": "Convierte a enlace", "usage": ".toenlace video, imagen o audio" },
    "tts": { "brief": "Texto a voz", "usage": ".tts es texto" }
  },
  "LOGOS / EFECTOS VISUALES": {
    "logos": { "brief": "Efecto de texto en logo", "usage": ".logos efecto texto" },
    "menulogos2": { "brief": "Otro estilo de logo", "usage": ".menulogos2" },
    "simpcard": { "brief": "Efecto Simp Card", "usage": ".simpcard @tag" },
    "hornycard": { "brief": "Efecto Horny Card", "usage": ".hornycard @tag" },
    "lolice": { "brief": "Efecto Lolice", "usage": ".lolice @tag" },
    "ytcomment": { "brief": "Comentario en YouTube", "usage": ".ytcomment texto" },
    "itssostupid": { "brief": "Efecto tonto", "usage": ".itssostupid" },
    "pixelar": { "brief": "Pixelar imagen", "usage": ".pixelar" },
    "blur": { "brief": "Aplicar blur", "usage": ".blur" }
  },
  "RANDOM / ANIME": {
    "chica": { "brief": "Personaje chica", "usage": ".chica" },
    "chico": { "brief": "Personaje chico", "usage": ".chico" },
    "cristianoronaldo": { "brief": "Cristiano Ronaldo", "usage": ".cristianoronaldo" },
    "messi": { "brief": "Messi", "usage": ".messi" },
    "meme": { "brief": "Meme 1", "usage": ".meme" },
    "meme2": { "brief": "Meme 2", "usage": ".meme2" },
    "itzy": { "brief": "Grupo ITZY", "usage": ".itzy" },
    "blackpink": { "brief": "Grupo Blackpink", "usage": ".blackpink" },
    "kpop": { "brief": "Grupo Kpop", "usage": ".kpop" },
    "lolivid": { "brief": "Lolivid", "usage": ".lolivid" },
    "loli": { "brief": "Loli", "usage": ".loli" },
    "navidad": { "brief": "Navidad", "usage": ".navidad" },
    "ppcouple": { "brief": "Pareja", "usage": ".ppcouple" },
    "neko": { "brief": "Neko", "usage": ".neko" },
    "waifu": { "brief": "Waifu", "usage": ".waifu" },
    "akira": { "brief": "Personaje Akira", "usage": ".akira" },
    "akiyama": { "brief": "Personaje Akiyama", "usage": ".akiyama" },
    "anna": { "brief": "Personaje Anna", "usage": ".anna" },
    "asuna": { "brief": "Personaje Asuna", "usage": ".asuna" },
    "ayuzawa": { "brief": "Personaje Ayuzawa", "usage": ".ayuzawa" },
    "boruto": { "brief": "Personaje Boruto", "usage": ".boruto" },
    "chiho": { "brief": "Personaje Chiho", "usage": ".chiho" },
    "chitoge": { "brief": "Personaje Chitoge", "usage": ".chitoge" },
    "deidara": { "brief": "Personaje Deidara", "usage": ".deidara" },
    "erza": { "brief": "Personaje Erza", "usage": ".erza" },
    "elaina": { "brief": "Personaje Elaina", "usage": ".elaina" },
    "eba": { "brief": "Personaje Eba", "usage": ".eba" },
    "emilia": { "brief": "Personaje Emilia", "usage": ".emilia" },
    "hestia": { "brief": "Personaje Hestia", "usage": ".hestia" },
    "hinata": { "brief": "Personaje Hinata", "usage": ".hinata" },
    "inori": { "brief": "Personaje Inori", "usage": ".inori" },
    "isuzu": { "brief": "Personaje Isuzu", "usage": ".isuzu" },
    "itachi": { "brief": "Personaje Itachi", "usage": ".itachi" },
    "itori": { "brief": "Personaje Itori", "usage": ".itori" },
    "kaga": { "brief": "Personaje Kaga", "usage": ".kaga" },
    "kagura": { "brief": "Personaje Kagura", "usage": ".kagura" },
    "kaori": { "brief": "Personaje Kaori", "usage": ".kaori" },
    "keneki": { "brief": "Personaje Keneki", "usage": ".keneki" },
    "kotori": { "brief": "Personaje Kotori", "usage": ".kotori" },
    "kurumi": { "brief": "Personaje Kurumi", "usage": ".kurumi" },
    "madara": { "brief": "Personaje Madara", "usage": ".madara" },
    "mikasa": { "brief": "Personaje Mikasa", "usage": ".mikasa" },
    "miku": { "brief": "Personaje Miku", "usage": ".miku" },
    "minato": { "brief": "Personaje Minato", "usage": ".minato" },
    "naruto": { "brief": "Personaje Naruto", "usage": ".naruto" },
    "nezuko": { "brief": "Personaje Nezuko", "usage": ".nezuko" },
    "sagiri": { "brief": "Personaje Sagiri", "usage": ".sagiri" },
    "sasuke": { "brief": "Personaje Sasuke", "usage": ".sasuke" },
    "sakura": { "brief": "Personaje Sakura", "usage": ".sakura" },
    "cosplay": { "brief": "Cosplay", "usage": ".cosplay" }
  }

,
"EFECTOS DE AUDIO": {
    "bass": { "brief": "Efecto Bass", "usage": ".bass" },
    "blown": { "brief": "Efecto Blown", "usage": ".blown" },
    "deep": { "brief": "Efecto Deep", "usage": ".deep" },
    "earrape": { "brief": "Efecto Earrape", "usage": ".earrape" },
    "fast": { "brief": "Efecto Fast", "usage": ".fast" },
    "fat": { "brief": "Efecto Fat", "usage": ".fat" },
    "nightcore": { "brief": "Efecto Nightcore", "usage": ".nightcore" },
    "reverse": { "brief": "Efecto Reverse", "usage": ".reverse" },
    "robot": { "brief": "Efecto Robot", "usage": ".robot" },
    "slow": { "brief": "Efecto Slow", "usage": ".slow" },
    "smooth": { "brief": "Efecto Smooth", "usage": ".smooth" },
    "tupai": { "brief": "Efecto Tupai", "usage": ".tupai" }
},
"HERRAMIENTAS": {
    "afk": { "brief": "Mensaje AFK", "usage": ".afk motivo" },
    "acortar": { "brief": "Acorta URL", "usage": ".acortar url" },
    "calc": { "brief": "Calculadora", "usage": ".calc operacion math" },
    "del": { "brief": "Responder a mensaje del bot", "usage": ".del respondre a mensaje del Bot" },
    "qrcode": { "brief": "Generar QR", "usage": ".qrcode texto" },
    "readmore": { "brief": "Texto oculto", "usage": ".readmore texto1|texto2" },
    "spamwa": { "brief": "Enviar spam", "usage": ".spamwa numero|texto|cantidad" },
    "styletext": { "brief": "Estilo de texto", "usage": ".styletext texto" },
    "traducir": { "brief": "Traducir texto", "usage": ".traducir texto" },
    "encuesta": { "brief": "Crear encuesta", "usage": ".encuesta | poll Motivo" },
    "horario": { "brief": "Consultar horario", "usage": ".horario" }
},
"RPG / MINIJUEGOS": {
    "botemporal": { "brief": "Bot temporal", "usage": ".botemporal enlace cantidad" },
    "addbot": { "brief": "Agregar bot", "usage": ".addbot enlace cantidad" },
    "pase": { "brief": "Pase premium", "usage": ".pase premium" },
    "pass": { "brief": "Pass premium", "usage": ".pass premium" },
    "listapremium": { "brief": "Lista premium", "usage": ".listapremium | listprem" },
    "transfer": { "brief": "Transferir recursos", "usage": ".transfer tipo cantidad @tag" },
    "dar": { "brief": "Dar recursos", "usage": ".dar tipo cantidad @tag" },
    "enviar": { "brief": "Enviar recursos", "usage": ".enviar tipo cantidad @tag" },
    "balance": { "brief": "Balance", "usage": ".balance" },
    "cartera": { "brief": "Cartera / Wallet", "usage": ".cartera | wallet" },
    "experiencia": { "brief": "Experiencia / Exp", "usage": ".experiencia | exp" },
    "top": { "brief": "Ranking", "usage": ".top | lb | leaderboard" },
    "nivel": { "brief": "Nivel / Level", "usage": ".nivel | level | lvl" },
    "rol": { "brief": "Rol / Rango", "usage": ".rol | rango" },
    "inventario": { "brief": "Inventario", "usage": ".inventario | inventory" },
    "aventura": { "brief": "Aventura", "usage": ".aventura | adventure" },
    "caza": { "brief": "Cazar", "usage": ".caza | cazar | hunt" },
    "pescar": { "brief": "Pescar", "usage": ".pescar | fishing" },
    "animales": { "brief": "Animales", "usage": ".animales" },
    "alimentos": { "brief": "Alimentos", "usage": ".alimentos" },
    "curar": { "brief": "Curar / Heal", "usage": ".curar | heal" },
    "buy": { "brief": "Comprar", "usage": ".buy" },
    "sell": { "brief": "Vender", "usage": ".sell" },
    "verificar": { "brief": "Verificar / Registrar", "usage": ".verificar | registrar" },
    "perfil": { "brief": "Perfil", "usage": ".perfil | profile" },
    "myns": { "brief": "Myns", "usage": ".myns" },
    "unreg": { "brief": "Desregistrar", "usage": ".unreg numero de serie" },
    "minardiamantes": { "brief": "Minar diamantes", "usage": ".minardiamantes | minargemas" },
    "minargatacoins": { "brief": "Minar Gatacoins", "usage": ".minargatacoins | minarcoins" },
    "minarexperiencia": { "brief": "Minar experiencia", "usage": ".minarexperiencia | minarexp" },
    "minar": { "brief": "Minar", "usage": ".minar : minar2 : minar3" },
    "rob": { "brief": "Robar", "usage": "_.rob | robar" },
    "crime": { "brief": "Crime", "usage": "_.crime" },
    "reclamar": { "brief": "Reclamar regalo", "usage": ".reclamar | regalo | claim" },
    "cadahora": { "brief": "Cadahora / Hourly", "usage": ".cadahora | hourly" },
    "cadasemana": { "brief": "Cadasemana / Semanal / Weekly", "usage": ".cadasemana | semanal | weekly" },
    "cadames": { "brief": "Cadames / Mensual / Monthly", "usage": ".cadames | mes | monthly" },
    "cofre": { "brief": "Abrir cofre", "usage": ".cofre | abrircofre | coffer" },
    "trabajar": { "brief": "Trabajar / Work", "usage": ".trabajar | work" }
}
,
"RPG Fantasy": {
    "fantasy": { "brief": "RPG Fantasy", "usage": ".fantasy | fy" },
    "fyguia": { "brief": "Guía Fantasy", "usage": ".fyguia | fyguide" },
    "fantasyinfo": { "brief": "Info Fantasy", "usage": ".fantasyinfo | fyinfo" },
    "fyagregar": { "brief": "Agregar Fantasy", "usage": ".fyagregar | fyadd" },
    "fycambiar": { "brief": "Cambiar Fantasy", "usage": ".fycambiar | fychange" },
    "fylista": { "brief": "Lista Fantasy", "usage": ".fylista | fyl" },
    "fantasymy": { "brief": "Fantasy My", "usage": ".fantasymy | fymy" },
    "fyentregar": { "brief": "Entregar Fantasy", "usage": ".fyentregar | fytransfer" }
},
"TOP RPG Fantasy": {
    "fytendencia": { "brief": "Tendencia Fantasy", "usage": ".fytendencia | fyranking" }
},
"STICKERS": {
    "sticker": { "brief": "Sticker general", "usage": ".sticker | s imagen o video" },
    "stickerurl": { "brief": "Sticker URL", "usage": ".sticker | s url de tipo jpg" },
    "emojimix": { "brief": "Emojimix", "usage": ".emojimix 😺+😆" },
    "scircle": { "brief": "Sticker circular", "usage": ".scircle | círculo imagen" },
    "semoji": { "brief": "Sticker emoji", "usage": ".semoji | emoji tipo emoji" },
    "attp": { "brief": "ATT Texto", "usage": ".attp texto" },
    "attp2": { "brief": "ATT2 Texto", "usage": ".attp2 texto" },
    "ttp": { "brief": "TTP Texto", "usage": ".ttp texto" },
    "ttp2": { "brief": "TTP2 Texto", "usage": ".ttp2 texto" },
    "ttp3": { "brief": "TTP3 Texto", "usage": ".ttp3 texto" },
    "ttp4": { "brief": "TTP4 Texto", "usage": ".ttp4 texto" },
    "ttp5": { "brief": "TTP5 Texto", "usage": ".ttp5 texto" },
    "ttp6": { "brief": "TTP6 Texto", "usage": ".ttp6 texto" },
    "dado": { "brief": "Dado", "usage": ".dado" },
    "stickermarker": { "brief": "Sticker Marker", "usage": ".stickermarker efecto : responder a imagen" },
    "stickerfilter": { "brief": "Sticker Filter", "usage": ".stickerfilter efecto : responder a imagen" },
    "cs": { "brief": "CS2", "usage": ".cs | cs2" },
    "wm": { "brief": "Watermark", "usage": ".wm packname|author / .wm texto1|texto2" },
    "palmaditas": { "brief": "Palmaditas", "usage": ".palmaditas | pat @tag" },
    "bofetada": { "brief": "Bofetada", "usage": ".bofetada | slap @tag" },
    "golpear": { "brief": "Golpear", "usage": ".golpear @tag" },
    "besar": { "brief": "Besar", "usage": ".besar | kiss @tag" },
    "alimentar": { "brief": "Alimentar", "usage": ".alimentar | food @tag" }
},
"CREADOR/A": {
    "join": { "brief": "Unirse", "usage": ".join | unete enlace" },
    "dardiamantes": { "brief": "Dar diamantes", "usage": ".dardiamantes cantidad" },
    "darxp": { "brief": "Dar XP", "usage": ".darxp cantidad" },
    "dargatacoins": { "brief": "Dar Gatacoins", "usage": ".dargatacoins cantidad" },
    "addprem": { "brief": "Agregar premium", "usage": ".addprem | addprem2 | addprem3 | addprem4 @tag cantidad" },
    "idioma": { "brief": "Cambiar idioma", "usage": ".idioma | language" },
    "cajafuerte": { "brief": "Caja fuerte", "usage": ".cajafuerte" },
    "comunicar": { "brief": "Comunicar a todos", "usage": ".comunicar | broadcastall | bc texto" },
    "broadcastchats": { "brief": "Broadcast chats", "usage": ".broadcastchats | bcc texto" },
    "comunicarpv": { "brief": "Comunicar privado", "usage": ".comunicarpv texto" },
    "broadcastgc": { "brief": "Broadcast grupos", "usage": ".broadcastgc texto" },
    "comunicargrupos": { "brief": "Comunicar grupos", "usage": ".comunicargrupos texto" },
    "borrartmp": { "brief": "Borrar temporal", "usage": ".borrartmp | cleartmp" },
    "delexp": { "brief": "Eliminar experiencia", "usage": ".delexp @tag" },
    "delgatacoins": { "brief": "Eliminar Gatacoins", "usage": ".delgatacoins @tag" },
    "deldiamantes": { "brief": "Eliminar diamantes", "usage": ".deldiamantes @tag" },
    "reiniciar": { "brief": "Reiniciar bot", "usage": ".reiniciar | restart" },
    "ctualizar": { "brief": "Actualizar bot", "usage": ".ctualizar | update" },
    "addpremTag": { "brief": "Agregar +prem", "usage": ".addprem | +prem @tag" },
    "delprem": { "brief": "Eliminar -prem", "usage": ".delprem | -prem @tag" },
    "listapremium": { "brief": "Lista premium", "usage": ".listapremium | listprem" },
    "añadirdiamantes": { "brief": "Añadir diamantes", "usage": ".añadirdiamantes @tag cantidad" },
    "añadirxp": { "brief": "Añadir XP", "usage": ".añadirxp @tag cantidad" },
    "añadirgatacoins": { "brief": "Añadir Gatacoins", "usage": ".añadirgatacoins @tag cantidad" }
}











}










const container = document.getElementById("commands-container");

function createCommandCard(commandName, brief, usage) {
  const card = document.createElement("div");
  card.classList.add("command-card");

  const nameEl = document.createElement("h4");
  nameEl.textContent = commandName;
  nameEl.classList.add("command-name");

  const briefEl = document.createElement("p");
  briefEl.textContent = brief;
  briefEl.classList.add("command-brief");

  const usageEl = document.createElement("code");
  usageEl.textContent = usage;
  usageEl.classList.add("command-usage");

  card.appendChild(nameEl);
  card.appendChild(briefEl);
  card.appendChild(usageEl);

  return card;
}function renderCommands(commandsJson) {
  for (const sectionName in commandsJson) {
    // Crear título de sección
    const sectionTitle = document.createElement("h2");
    sectionTitle.textContent = sectionName;
    sectionTitle.classList.add("section-title");
    container.appendChild(sectionTitle);

    const categories = commandsJson[sectionName];

    for (const categoryName in categories) {
      const commandsOrSubcategories = categories[categoryName];

      // Si es un objeto de comandos (con brief y usage)
      if (commandsOrSubcategories.brief && commandsOrSubcategories.usage) {
        const card = createCommandCard(
          categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
          commandsOrSubcategories.brief,
          commandsOrSubcategories.usage
        );
        container.appendChild(card);
      } else {
        // Crear título de categoría
        const categoryTitle = document.createElement("h3");
        categoryTitle.textContent = categoryName;
        categoryTitle.classList.add("category-title");
        container.appendChild(categoryTitle);

        // Iterar sobre los comandos
        for (const commandName in commandsOrSubcategories) {
          const cmd = commandsOrSubcategories[commandName];
          const card = createCommandCard(
            commandName.charAt(0).toUpperCase() + commandName.slice(1),
            cmd.brief ?? "(sin descripción)",
            cmd.usage ?? "(sin uso)"
          );
          container.appendChild(card);
        }
      }
    }
  }
}

renderCommands(test);
