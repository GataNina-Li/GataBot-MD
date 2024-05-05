const lenguaje = () => { return 'it' } //ITALIANO

//MESSAGGI NOTIZIE
const smsAvisoRG = () => { return `╰⊱✅⊱ *RISULTATI* ⊱✅⊱╮\n\n` }
const smsAvisoAG = () => { return `╰⊱⚠️⊱ *ATTENZIONE* ⊱⚠️⊱╮\n\n` }
const smsAvisoIIG = () => { return `╰⊱❕⊱ *INFORMAZIONI* ⊱❕⊱╮\n\n` }
const smsAvisoFG = () => { return `╰⊱❌⊱ *ERRORE* ⊱❌⊱╮\n\n` }
const smsAvisoMG = () => { return `╰⊱❗️⊱ *AZIONE ERRATA* ⊱❗️⊱╮\n\n` }
const smsAvisoEEG = () => { return `╰⊱📩⊱ *SEGNALAZIONE* ⊱📩⊱╮\n\n` }
const smsAvisoEG = () => { return `╰⊱💚⊱ *COMPLETATO* ⊱💚⊱╮\n\n` }


//PARAMENTRI NEI COMANDI
const smsRowner = () => { return `\`\`\`¡¡QUESTO COMANDO FUNZIONA SOLO SE INSERISCI IL NUMERO DEL BOT COME CREATORE!!\`\`\`` }//NUMERO DEL BOT
const smsOwner = () => { return `\`\`\`¡¡QUESTO COMANDO PUO' UTILIZZARLO SOLO IL MIO CREATORE!!\`\`\`` }//OWNER
const smsMods = () => { return `\`\`\`¡¡QUESTO COMANDO SOLO I MODERATORI E IL MIO CREATORE POSSONO UTILIZZARLO!!\`\`\`` }//MODERATORI
const smsPremium = () => { return `\`\`\`¡¡QUESTO COMANDO E' DISPONIBILE SOLO PER GLI UTENTI PREMIUM E IL MIO CREATORE!! PER OTTENERE IL PREMIUM ACQUISTA UN PASS UTILIZZANDO #pass premium\`\`\`` }//UTENTI PREMIUM
const smsGroup = () => { return `\`\`\`¡¡QUESTI COMANDI POSSONO ESSERE UTILIZZATI SOLO NEI GRUPPI!!\`\`\`` }//PER I GRUPPI
const smsPrivate = () => { return `\`\`\`¡¡QUESTO COMANDO PUO' ESSERE UTILIZZATO SOLO IN CHAT PRIVATA!!\`\`\`` }//IN PRIVATO
const smsAdmin = () => { return `\`\`\`¡¡QUESTO COMANDO E' SOLO PER GLI AMMINISTRATORI!!\`\`\`` }//ADMINS
const smsBotAdmin = () => { return `\`\`\`¡¡DEVO ESSERE AMMINISTRATORE PER POTER USARE QUESTO COMANDO!!\`\`\`` }//BOT CON ADMIN
const smsUnreg = () => { return `\`\`\`PER USARE QUESTO COMANDO DEVI ESSERE REGISTRATO, SCRIVI #verify PER REGISTRARTI!!\`\`\`` }//VERIFICA
const smsRestrict = () => { return `\`\`\`¡¡QUESTO COMANDO E' STATO LIMITATO DAL MIO CREATORE!!\`\`\`` }//COMANDO RESTRICT


//LISTAMENU
const smsTime = () => { return `Ora attuale`}
const smsUptime = () => { return `In esecuzione da`}
const smsVersion = () => { return `Versione di ${global.gt}`}
const smsTotalUsers = () => { return `Utenti totali`}
const smsMode = () => { return `E' in modalita'`}
const smsModePublic = () => { return `PUBBLICO`}
const smsModePrivate = () => { return `PRIVATO`}
const smsBanChats = () => { return `Chat vietate`}
const smsBanUsers = () => { return `Utenti vietati`}
const smsPareja = () => { return `Coppia`}
const smsResultPareja = () => { return `Singolo`}
const smsSaludo = () => { return `👋 CIAO! BENVENUTO 👋`}
const smsDia = () => { return `🌇 Buongiorno ⛅`}
const smsTarde = () => { return `🏙️ Buona serata 🌤️`}
const smsTarde2 = () => { return `🌆 Buona serata 🌥️`}
const smsNoche = () => { return `🌃 Buona notte 💫`}
const smsListaMenu = () => { return `⊹ LISTA MENU ⊹`}
const smsLista1 = () => { return `🌟 INFORMAZIONI GATABOT 🌟`}
const smsLista2 = () => { return `💖 CREATORE 💖`}
const smsLista3 = () => { return `🎁 DONAZIONE : SUPPORTO 🎁`}
const smsLista4 = () => { return `🚀 VELOCITA' 🚀`}
const smsLista5 = () => { return `💡 INFORMAZIONI MENU 💡`}
const smsLista6 = () => { return `🌀 MENU COMPLETO 🌀`}
const smsLista7 = () => { return `🐈 INSTALLA GATABOT 🐈`}
const smsLista8 = () => { return `🍄 DIVENTA UN SUB-BOT 🍄`}
const smsLista9 = () => { return `📄 TERMINI, CONDIZIONI E PRIVACY 📄`}
const smsLista10 = () => { return `🌟 AVVENTURA E TOP 🌟`}
const smsLista11 = () => { return `🏆 CLASSIFICA MONDIALE 🏆`}
const smsLista12 = () => { return `🏅 UTENTI PREMIUM 🏅`}
const smsLista13 = () => { return `🎟️ DIVENTA UN UTENTE PREMIUM 🎟️`}
const smsLista14 = () => { return `🛣️ MISSIONI 🛣️`}
const smsLista15 = () => { return `⚗️ MENU RPG ⚗️`}
const smsLista16 = () => { return `🏪 ACQUISTA NEL NEGOZIO 🏪`}
const smsLista17 = () => { return `🎒 INVENTARIO 🎒`}
const smsLista18 = () => { return `🌟 MULTIMEDIA 🌟`}
const smsLista19 = () => { return `📲 MENU DOWNLOAD 📲`}
const smsLista20 = () => { return `🔍 MENU DI RICERCA 🔍`}
const smsLista21 = () => { return `🛰️ MENU CONVERTITORE 🛰️`}
const smsLista22 = () => { return `🧰 MENU MODIFICATORE AUDIO 🧰`}
const smsLista22_1 = () => { return `🔩 MENU STRUMENTI 🔩`}
const smsLista23 = () => { return `🌟 DIVERTIMENTO 🌟`}
const smsLista24 = () => { return `🎡 GIOCHI DINAMICI 🎡`}
const smsLista25 = () => { return `🔊 MENU AUDIO 🔊`}
const smsLista26 = () => { return `🎈 MENU ADESIVI E FILTRI 🎈`}
const smsLista27 = () => { return `✨ MENU EFFETTI E LOGHI ✨`}
const smsLista28 = () => { return `🌅 MENU LOGHI 2 🌅`}
const smsLista29 = () => { return `⛩️ MEMI E ANIME CASUALI ⛩️`}
const smsLista30 = () => { return `🔞 COMANDI PER ADULTI +18 🔞`}
const smsLista31 = () => { return `🌟 SETTINGS 🌟`}
const smsLista32 = () => { return `🔰 MENU FOR GROUPS 🔰`}
const smsLista33 = () => { return `📑 TIPI DI LISTE 📑`}
const smsLista34 = () => { return `⚙️ CENTRO DI CONFIGURAZIONE ⚙️`}
const smsLista35 = () => { return `💎 MENU DEL PROPRIETARIO 💎`}

//main.js
const smsWelcome = () => { return `*╭┈⊰* @subject *⊰┈ ✦*\n*┊✨ BENVENUTO!!*\n┊💖 @user\n┊📄 *LEGGI LA DESCRIZIONE DEL GRUPPO*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ ✦*\n${String.fromCharCode(8206).repeat(850)}\n@desc`}
const smsBye = () => { return '*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*\n┊ @user\n┊ *HA LASCIATO IL GRUPPO, TORNA PRESTO* 😎\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*'}
const smsSpromote = () => { return '*@user ORA SEI ADMIN IN QUESTO GRUPPO!!*'}
const smsSdemote = () => { return `*@user NON E' PIU' ADMIN IN QUESTO GRUPPO!!*`}
const smsSdesc = () => { return `*LA NUOVA DESCRIZIONE DEL GRUPPO E':*\n\n@desc`}
const smsSsubject = () => { return `*IL NUOVO NOME DEL GRUPPO E':*\n\n@subject`}
const smsSicon = () => { return `*LA FOTO DI QUESTO GRUPPO E' STATA CAMBIATA!!*`}
const smsSrevoke = () => { return `*QUESTO E' IL NUOVO LINK DI QUESTO GRUPPO!!*\n\n*@revoke*`}
const smsConexion = () => { return `\n𓃠 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈✦ 🟢 CONNESSIONE ✦┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓃠\n│\n│★ CONNESSIONE RIESCITA CON WHATSAPP 😺\n│\n𓃠 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈✦ ✅ ✦┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓃠`}
const smsCargando = () => { return `😸 CARICAMENTO...\n`}
const smsCodigoQR = () => { return `\n✅ SCANSIONA IL CODICE QR, SCADRA TRA 45 SECONDI ✅`}
const smsConexionOFF = () => { return `\n⚠️ NESSUNA CONNESSIONE, ELIMINA LA CARTELLA ${global.authFile} E SCANSIONA IL CODICE QR ⚠️`}
const smsClearTmp = () => { return `\n╭» 🟢 MULTIMEDIA 🟢\n│→ FILE DALLA CARTELLA TMP ELIMINATI\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️♻️`} 
const smspurgeSession = () => { return `\n╭» 🔵 ${global.authFile} 🔵\n│→ SESSIONI NON ESSENZIALI ELIMINATE\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️♻️`} 
const smspurgeOldFiles = () => { return `\n╭» 🟠 FILE 🟠\n│→ FILE RESIDUI ELIMINATI\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️♻️`} 
const smspurgeSessionSB1 = () => { return `\n╭» 🟡 GataJadiBot 🟡\n│→ NON CE' NULLA DA ELIMINARE\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️♻️`} 
const smspurgeSessionSB2 = () => { return `\n╭» ⚪ GataJadiBot ⚪\n│→ FILE NON ESSENZIALI ELIMINATI\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️♻️`} 
const smspurgeSessionSB3 = () => { return `\n╭» 🔴 GataJadiBot 🔴\n│→ SI E' VERIFICATO UN ERRORE\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️♻️\n`} 
const smspurgeOldFiles1 = () => { return `\n╭» 🟣 ARCHIVE 🟣\n│→`} 
const smspurgeOldFiles1 = () => { return `\n╭» 🟣 ARCHIVIO 🟣\n│→`} 
const smspurgeOldFiles2 = () => { return `ELIMINAZIONE AVVENUTA CON SUCCESSO\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️♻️`} 
const smspurgeOldFiles3 = () => { return `\n╭» 🔴 ARCHIVIO 🔴\n│→`} 
const smspurgeOldFiles4 = () => { return `ELIMINAZIONE FALLITA\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️❌\n`}
const smsConexioncerrar = () => { return `\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☹\n┆ ⚠️ CONNESSIONE CHIUSA, RICONNESSIONE IN CORSO....\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☹`}
const smsConexionperdida = () => { return `\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☂\n┆ ⚠️ CONNESSIONE PERSA CON IL SERVER, RICONNESSIONE IN CORSO....\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☂`}
const smsConexionreem = () => { return `\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✗\n┆ ⚠️ CONNESSIONE SOSTITUITA, E' STATA APERTA UN'ALTRA NUOVA SESSIONE, CHIUDI PRIMA LA SESSIONE CORRENTE.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✗`}
const smsConexionreinicio = () => { return `\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✓\n┆ ❇️ CONNESSIONE AL SERVER IN CORSO....\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✓`}
const smsConexiontiem = () => { return `\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ▸\n┆ ⌛ TIMEOUT DELLA CONNESSIONE, RICONNESSIONE IN CORSO....\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ▸`}
const smsConexiondescon = (reason, connection) => { return `\n⚠️❗ MOTIVO SCONOSCIUTO: ${reason || ''} >> ${connection || ''}`}
const smsMainBot = () => { return "'main.js' E' STATO AGGIORNATO CON SUCCESSO"}

//_allantilink.js
const smsTextoYT = () => { return '😻 Super GataBot-MD - WhatsApp '}
const smsApagar = () => { return '❌ DISATTIVATO'}
const smsEncender = () => { return '✅ ATTIVATO'}
const smsEnlaceTik = () => { return `*E' STATO RILEVATO UN LINK TIKTOK BANNATO IN QUESTO GRUPPO*\n\n*PROSEGUO CON L'ELIMINAZIONE*`}
const smsEnlaceYt = () => { return `*E' STATO RILEVATO UN LINK YOUTUBE BANNATO IN QUESTO GRUPPO*\n\n*PROSEGUO CON L'ELIMINAZIONE*`}
const smsEnlaceTel = () => { return `*E' STATO RILEVATO UN LINK TELEGRAM BANNATO IN QUESTO GRUPPO*\n\n*PROSEGUO CON L'ELIMINAZIONE*`}
const smsEnlaceFb = () => { return `*E' STATO RILEVATO UN LINK FACEBOOK BANNATO IN QUESTO GRUPPO*\n\n*PROSEGUO CON L'ELIMINAZIONE*`}
const smsEnlaceIg = () => { return `*E' STATO RILEVATO UN LINK INSTAGRAM BANNATO IN QUESTO GRUPPO*\n\n*PROSEGUO CON L'ELIMINAZIONE*`}
const smsEnlaceTw = () => { return `*E' STATO RILEVATO UN LINK TWITTER BANNATO IN QUESTO GRUPPO*\n\n*PROSEGUO CON L'ELIMINAZIONE*`}
const smsAllAdmin = () => { return `*DEVO ESSERE AMMINISTRATORE PER POTER RIMUOVERE GLI INTRUSI*`}
const smsSoloOwner = () => { return `*IL MIO CREATORE DEVE ATTIVARE LA FUNZIONE*\n*#on restrict*`}

//handler.js
const smsCont1 = () => { return `*🔴 COMANDO FALLITO 🔴*`}
const smsCont2 = () => { return `*⚠️ PLUGIN:*`}
const smsCont3 = () => { return `*⚠️ UTENTE:*`}
const smsCont4 = () => { return `*⚠️ COMANDO:*`}
const smsCont5 = () => { return `*⚠️ ERRORE:*`}
const smsCont6 = () => { return `*❗ SEGNA QUESTO MESSAGGIO UTILIZZANDO IL COMANDO #reporte PER RISOLVERE IL PROBLEMA*`}
const smsCont7 = () => { return `${global.lenguajeGB['smsAvisoAG']()}*NON HA DIAMANTI!! 💎 PUOI ANDARE AL NEGOZIO CON IL COMANDO*`}
const smsCont8 = () => { return ` *DIAMANTE 💎 UTILIZZATO*`}
const smsCont9 = () => { return `${global.lenguajeGB['smsAvisoAG']()}*NECESSITA IL LIVELLO ➡️*`}
const smsCont10 = () => { return `*PER UTILIZZARE QUESTO COMANDO. IL TUO LIVELLO ATTUALE E' ➡️*`}
const smsCont11 = () => { return `*AGGIORNARE CON IL COMANDO*`}
const smsCont12 = () => { return `UN GRANDE GRUPPO!! 😼`}
const smsCont13 = () => { return `QUALCUNO SI E' UNITO!! 🥳`}
const smsCont14 = () => { return `QUALCUNO HA LASCIATO IL GRUPPO!! 🧐`}
const smsCont15 = () => { return `*CIAO*`}
const smsCont16 = () => { return `*LE VIDEOCHIAMATE* 📲`}
const smsCont17 = () => { return `*LE CHIAMATE* 📞`}
const smsCont18 = () => { return `*NON SONO AUTORIZZATE QUINDI TI BLOCCHERÒ*\n\n*SE HAI CHIAMATO PER ERRORE CONTATTA IL CREATORE DI QUESTO BOT*`}
const smsCont19 = () => { return `ANTI ELIMINA`}
const smsCont20 = () => { return `*┃✤ Nome:*`}
const smsCont21 = () => { return `*┃✤ Invio del messaggio eliminato...*`}

//_anti-internacional.js
const smsInt1 = () => { return `*QESTO NUMERO*`}
const smsInt2 = () => { return `*NON E' AMMESSO IN QUESTO GRUPPO!!*`}

//_antilink.js
const smsAdwa = () => { return `${global.lenguajeGB['smsAvisoEG']()}*POICHÉ SEI UN AMMINISTRATORE IN QUESTO GRUPPO NON SARAI RIMOSSO*`}
const smsEnlaceWat = () => { return `${global.lenguajeGB['smsAvisoAG']()}*E' STATO RILEVATO UN LINK WHATSAPP BANNATO IN QUESTO GRUPPO*\n\n*PROCEDO A ELIMINARTI*`}


//_antilink2.js
const smsEnlaceWatt = () => { return `${global.lenguajeGB['smsAvisoAG']()}E' STATO RILEVATO UN LINK VIETATO CONTENENTE HTTPS IN QUESTO GRUPPO\n\nPROCEDO A ELIMINARTI`}

//_antispam.js
const smsNoSpam = () => { return `🤨 NON FARE SPAM, NON POTRAI USARE ${global.packname} PER ${60000 / 1000 - 59} MINUTI`}

//_antispam_.js
const smsNoSpam2 = () => { return `E' STATO SBLOCCATO DOPO ${60000 / 1000 - 59} MINUTI. TI PREGO DI NON FARE SPAM!!`}

//Texto
const smsConMenu = () => { return `☘️ MENU`}

//Error
const smsMalError = () => { return `${global.lenguajeGB['smsAvisoFG']()}\`\`\`SI E' VERIFICATO UN ERRORE IMPREVISTO.\`\`\``}
const smsMalError2 = () => { return `${global.lenguajeGB['smsAvisoFG']()}\`\`\`SI E' VERIFICATO UN INCONVENIENTE. RIPROVA.\`\`\``}
const smsMalError3 = () => { return `${global.lenguajeGB['smsAvisoFG']()}\`\`\`QUALCOSA E' ANDATO STORTO, SEGNALA QUESTO COMANDO UTILIZZANDO:\`\`\`\n`}

// _antitoxic.js
const smsToxic1 = () => { return `NOO!!! 🤬 NON DIRE QUESTA PAROLA`}
const smsToxic2 = () => { return `E' VIETATO, NON ESSERE TOSSICO`}
const smsToxic3 = () => { return `*AVVISO*\n⚠️`}
const smsToxic4 = () => { return `😭 MI DISPIACE`}
const smsToxic5 = () => { return `☢️ DISATTIVA ANTITOXIC`}
const smsToxic6 = () => { return `TI HO AVVISATO DIVERSE VOLTE!!`}
const smsToxic7 = () => { return `HAI SUPERATO TUTTI E 4 GLI AVVERTIMENTI ORA SARAI ELIMINATO 🙄`}

//Tienda
const eExp = () => { return '⚡ Esperienza' } 
const eDiamante = () => { return '💎 Diamanti' } 
const eDiamantePlus = () => { return '💎+ Diamanti+' }
const eToken = () => { return '🪙 Gettoni' } 
const eEsmeralda = () => { return '💚 Smeraldi' } 
const eJoya = () => { return '♦️ Gioelli' }
const eMagia = () => { return '🌀 Magia' } 
const eOro = () => { return '👑 Oro' } 
const eGataCoins = () => { return '🐱 GataCoins' }
const eGataTickers = () => { return '🎫 Gata Tickets' } 
const eEnergia = () => { return '✨ Energia' }

const ePocion = () => { return '🥤 Pozioni' }
const eAgua = () => { return '💧 Acqua' }
const eBasura = () => { return '🗑 Rifiuti' }
const eMadera = () => { return '🪵 Legno' }
const eRoca = () => { return '🪨 Roccie' }
const ePiedra = () => { return '🥌 Pietra' }
const eCuerda = () => { return '🕸️ Stringhe' }
const eHierro = () => { return '⛓️ Ferro' }
const eCarbon = () => { return '⚱️ Carbone' }
const eBotella = () => { return '🍶 Bottiglie' }
const eLata = () => { return '🥫 Barattoli' }
const eCarton = () => { return '🪧 Cartone' } 

const eEletric = () => { return `💡 Elettricita'` }
const eBarraOro = () => { return `〽️ Lingotti d'oro` }
const eOroComun = () => { return '🧭 Oro comune' }
const eZorroG = () => { return '🦊🌫️ Grande volpi' }
const eBasuraG = () => { return '🗑🌫️ Super Rifiuti' }
const eLoboG = () => { return '🐺🌫️ Super Lupi' }
const eMaderaG = () => { return '🛷🌫️ Super Legno' }
const eEspada = () => { return '⚔️ Spade' }
const eCarnada = () => { return '🪱 Corde' }
const eBillete = () => { return '💵 Banconote'}
const ePinata = () => { return '🪅 Pignatte'}
const eGancho = () => { return '🪝 Ganci' }
const eCanaPescar = () => { return '🎣 Canne da pesca' } 

const eCComun = () => { return '📦 Cassa Comune' }
const ePComun = () => { return '🥡 Cassa Misteriosa' }
const eCMistica = () => { return '🗳️ Cassa Mistica' }
const eCMascota = () => { return '📫 Scatola Per Animali' }
const eCJardineria = () => { return '💐 Scatola Da Giardinaggio' }
const eClegendaria = () => { return '🎁 Scatola Leggendaria' } 

const eUva = () => { return '🍇 Uva' }
const eManzana = () => { return '🍎 Mele' }
const eNaranja = () => { return '🍊 Arance'}
const eMango = () => { return '🥭 Mango' }
const ePlatano = () => { return '🍌 Banane' } 

const eSUva = () => { return `🌾🍇 Semi d' Uva` }
const eSManzana = () => { return '🌾🍎 Semi Di Mela' }
const eSNaranja = () => { return '🌾🍊 Semi Di Arance' }
const eSMango = () => { return '🌾🥭 Semi Di Mango' }
const eSPlatano = () => { return '🌾🍌 Semi Di Banane' } 

const eCentauro = () => { return '🐐 Centauro' }
const eAve = () => { return '🦅 Uccello' }
const eGato = () => { return '🐈 Gatto' }
const eDragon = () => { return '🐉 Drago' }
const eZorro = () => { return '🦊 Volpe' }
const eCaballo = () => { return '🐎 Cavallo' }
const eFenix = () => { return '🕊️ Fenice' }
const eLobo = () => { return '🐺 Lupo' }
const ePerro = () => { return '🐶 Cane' } 

const eAMascots = () => { return '🍖 Cibo per gli animali' }
const eCCentauro = () => { return '🐐🥩 Cibo per i centauri' }
const eCAve = () => { return '🦅🥩 Cibo per i volatili' }
const eCMagica = () => { return '🌀🥩 Cibo Magico' }
const eCDragon = () => { return '🐉🥩 Cibo per i Draghi' }
const eACaballo = () => { return '🐎🥩 Cibo per i Cavalli' }
const eCFenix = () => { return '🕊️🥩 Cibo per le Fenici' } 


//config-on y off.js
const smsWel1 = () => { return `🎉 BENVENUTO`}
const smsWel2 = () => { return `Messaggio di benvenuto per i nuovi membri nei gruppi`}
const smsDete1 = () => { return `🔔 NOTIFICHE`}
const smsDete2 = () => { return `Avvisi delle azioni all'interno del gruppo`}
const smsANivel1 = () => { return `🆙 AUTO LIVELLO`}
const smsANivel2 = () => { return `Livella automaticamente tutti; (Applica ricompense per il livello)`}
const smsRestri1 = () => { return `⛔ PER LIMITARE`}
const smsRestri2 = () => { return `Abilita la funzione per aggiungere o rimuovere persone nei gruppi`}
const smsLlamar1 = () => { return `🚫 ANTI CHIAMATE`}
const smsLlamar2 = () => { return `Blocca le persone che effettuano chiamate`}
const smsAntiSp1 = () => { return `🚯 ANTI SPAM`}
const smsAntiSp2 = () => { return `Banna l'uso dei comandi quando qualcuno esegue un tipo di spam`}
const smsModP1 = () => { return `🌐 MODALITA' PUBBLICA`}
const smsModP2 = () => { return `Abilita la funzione in modo che tutti possano usare GataBot`}
const smsModAd1 = () => { return `🛂 MODALITA' AMMINISTRATORE`}
const smsModAd2 = () => { return `Solo gli amministratori potranno usare GataBot nei gruppi`}
const smsLect1 = () => { return `✅ LETTURA AUTOMATICA`}
const smsLect2 = () => { return `Lascia messaggi o chat come letti`}
const smsTempo1 = () => { return `🐈 BOT TEMPORANEO`}
const smsTempo2 = () => { return `Funzione che consente una permanenza temporanea nei gruppi`}
const smsStik1 = () => { return `🎠 ADESIVI`}
const smsStik2 = () => { return `Abilita l'invio automatico di adesivi a tutti`}
const smsStickA1 = () => { return `🪄 ADESIVI AUTOMATICI`}
const smsStickA2 = () => { return `Video, GIF, immagini, collegamenti jpg o jpeg; saranno convertiti automaticamente in adesivi`}
const smsReacc1 = () => { return `🤡 REAZIONE`}
const smsReacc2 = () => { return `Abilita l'invio automatico di reazioni ai messaggi`}
const smsAudi1 = () => { return `🔊 AUDIO`}
const smsAudi2 = () => { return `Abilita l'invio automatico di audio a tutti`}
const smsModHor1 = () => { return `🔞 MODALITA' HOT`}
const smsModHor2 = () => { return `Mostra contenuti per adulti nelle chat`}
const smsAntitoc1 = () => { return `☢️ ANTI TOSSICO`}
const smsAntitoc2 = () => { return `Invia avvisi a coloro che insultano`}
const smsModOb1 = () => { return `👀 MODALITA' OSSERVA`}
const smsModOb2 = () => { return `Rendi visibili immagini, GIF e video per tutti`}
const smsAntiEli1 = () => { return `🗑️ ANTI CANCELLAZIONE`}
const smsAntiEli2 = () => { return `Tutti i messaggi eliminati saranno inoltrati nella chat o nel gruppo`}
const smsAntiInt1 = () => { return `🌏 ANTI INTERNAZIONALE`}
const smsAntiInt2 = () => { return `Elimina le numeri internazionali considerati falsi`}
const smsAntiE1 = () => { return `🔗 ANTI LINK`}
const smsAntiE2 = () => { return `Elimina persone che inviano link da gruppi WhatsApp`}
const smsAntiEE1 = () => { return `🔗 ANTI LINK 2`}
const smsAntiEE2 = () => { return `Elimina le le persone che inviano link contenenti https`}
const smsAntiTT1 = () => { return `🔗 ANTI TIK TOK`}
const smsAntiTT2 = () => { return `Elimina le le persone che inviano link da TikTok`}
const smsAntiYT1 = () => { return `🔗 ANTI YOUTUBE`}
const smsAntiYT2 = () => { return `Elimina le persone che inviano link da YouTube`}
const smsAntiTEL1 = () => { return `🔗 ANTI TELEGRAM`}
const smsAntiTEL2 = () => { return `Elimina le persone che inviano link da Telegram`}
const smsAntiFB1 = () => { return `🔗 ANTI FACEBOOK`}
const smsAntiFB2 = () => { return `Elimina le persone che inviano link da Facebook`}
const smsAntiIG1 = () => { return `🔗 ANTI INSTAGRAM`}
const smsAntiIG2 = () => { return `Elimina le persone che inviano link da Instagram`}
const smsAntiTW1 = () => { return `🔗 ANTI TWITTER `}
const smsAntiTW2 = () => { return `Elimina le persone che inviano link da Twitter`}
const smsSOLOP1 = () => { return `⚜️ SOLO PRIVATO`}
const smsSOLOP2 = () => { return `Consenti di utilizzarlo solo in chat private`}
const smsSOLOG1 = () => { return `⚜️ SOLO GRUPPI`}
const smsSOLOG2 = () => { return `Consenti di utilizzarlo solo nei gruppi`}
const smsConfi1 = () => { return `IMPOSTAZIONI`}
const smsConfi2 = () => { return `*Ciao!*`}
const smsConfi3 = () => { return `┃ *Seleziona un'opzione dalla lista*`}
const smsConfi4 = () => { return `┃ *Per iniziare a configurare*`}
const smsConfi5 = () => { return `┃● *Avvisi di configurazione:*`}
const smsConfi6 = () => { return `┃ ✅ ⇢ *Funzione attivata*`}
const smsConfi7 = () => { return `┃ ❌ ⇢ *Funzione disattivata*`}
const smsConfi8 = () => { return `┃ ⚠️ ⇢ *Questa chat non e' un gruppo*`}
const smsConfi9 = () => { return `┃ *Consiglio: Per vedere la configurazione*\n┃ *Completa utilizza questo Menu Gruppo*\n┃`}
const smsConfi10 = () => { return `*~ CENTRO DI CONFIGURAZIONE*`}
const smsParaAdmins = () => { return `PER AMMINISTRATORI E CREATORE : GRUPPI`}
const smsParaAdYOw = () => { return `PER AMMINISTRATORI E CREATORE : CHAT`}
const smsParaOw = () => { return `PER CREATORE : CHAT`}
const smsNoGg = () => { return ` | ⚠️`}
const smsMens1 = () => { return `COMANDO`} 
const smsMens2 = () => { return `ATTUALMENTE`} 
const smsMens3 = () => { return `IN QUESTO`} 
const smsMens4 = () => { return `BOT`} 
const smsMens5 = () => { return `CHAT`}

//Error2
const smsMensError1 = () => { return `❕ AVVISO COMANDO ❕`} 
const smsMensError2 = () => { return `Il comando non riesce ad essere eseguito correttamente`} 

//_antiviewonce.js
const smsAntiView = () => { return `*NULLA PUO' ESSERE NASCOSTO* 😎`} 

//_autolevelup.js
const smsAutoLv1 = () => { return `🎖️ NUOVO LIVELLO 🎖️`} 
const smsAutoLv2 = () => { return `LIVELLO PRECEDENTE:`} 
const smsAutoLv3 = () => { return `LIVELLO ATTUALE:`} 
const smsAutoLv4 = () => { return `RAGGIO:`} 
const smsAutoLv5 = () => { return `DATA:`} 
const smsAutoLv6 = () => { return `Hai raggiunto un nuovo livello!!!`} 
const smsAutoLv7 = () => { return `🥳 RICOMPENSA PER IL TUO NUOVO LIVELLO`} 

//_autosticker.js
const smsAutoStik = () => { return `${lenguajeGB['smsAvisoFG']()}*IL VIDEO NON DEVE DURARE PIU' DI 7 SECONDI.*`} 

//_expired.js
const smsBottem1 = () => { return `*LASCIA IL GRUPPO!!! 🤝 SE VUOI CHE TORNI, UTILIZZA IL COMANDO _#bottemporal_ PER FARLO TORNARE NEL GRUPPO!!*`} 
const smsBottem2 = () => { return `*💕 ASSISTENZA DELL'UTENTE*\n*_${global.ig}_*\n`} 
const smsBottem3 = () => { return `A PRESTO 💖`}

//_premium.js
const smsPremI = () => { return `*¡IL TUO PREMIUM E' SCADUTO!* 🎟️\n*PER OTTENERE UN NUOVO PASS PREMIUM USA IL COMANDO:*\n*#pass prem*`} 

//afk-_afk.js
const smsAfkM1 = () => { return `*HAI SMETTO DI ESSERE INATTIVO AFK*`} 
const smsAfkM2 = () => { return `\n*IL MOTIVO DELL'INATTIVITA' ERA:*\n`} 
const smsAfkM3 = () => { return `⏳ *TEMPO DI INATTIVITA':*`} 
const smsAfkM4 = () => { return `*NON TAGGARE QUESTO UTENTE!! E' INATTIVO*\n`} 
const smsAfkM5 = () => { return `*MOTIVO PER L'INATTIVITA' AFK:*\n`} 
const smsAfkM6 = () => { return `*MOTIVO PER L'INATTIVITA' AFK: Nessun motivo specificato per l'inattivita'*`} 
const smsAfkTime = () => { return [['giorno(i)'], ['ore'], ['minuti'], ['secondi']] }
const smsAfkResultTime = smsAfkTime()

//afk-afk.js
const smsAfkQ1 = (usedPrefix, command) => { return `${lenguajeGB['smsAvisoMG']()}*SCRIVI IL MOTIVO PER CUI SEI INATTIVO (AFK)*\n\n*ESEMPIO:*\n*${usedPrefix + command}* Sto facendo i compiti`} 
const smsAfkQ2 = () => { return `${lenguajeGB['smsAvisoMG']()}*IL MOTIVO DEVE AVERE ALMENO 10 CARATTERI*`} 
const smsAfkM1A = () => { return `*NON TAGGARE*`} 
const smsAfkM1B = () => { return `*SARA' INATTIVO AFK*\n\n*MOTIVO PER L'INATTIVITA' AFK:*`}

//anonymous_chat.js
const smsChatAn1 = () => { return `${lenguajeGB['smsAvisoFG']()}*NON SEI IN UNA CHAT ANONIMA*`} 
const smsChatAn2 = () => { return `*SE VUOI INIZIARE UNA CHAT ANONIMA USA IL COMANDO #start O UTILIZZA IL PULSANTE QUI SOTTO*\n`} 
const smsChatAn3 = () => { return `⚡ INIZIA CHAT ANONIMA`} 
const smsChatAn4 = () => { return `${lenguajeGB['smsAvisoRG']()}🪐 *HAI LASCIATO LA CHAT ANONIMA*`} 
const smsChatAn5 = () => { return `${lenguajeGB['smsAvisoAG']()}*L'ALTRO UTENTE HA LASCIATO LA CHAT ANONIMA*`}  
const smsChatAn6 = () => { return `*SE VUOI PASSARE A UN'ALTRA CHAT ANONIMA USA IL COMANDO #start O UTILIZZA IL PULSANTE QUI SOTTO*\n`} 
const smsChatAn7 = () => { return `${lenguajeGB['smsAvisoAG']()}*SEI ANCORA IN UNA CHAT ANONIMA O IN ATTESA CHE QUALCUNO SI UNISCA PER CHATTARE*`} 
const smsChatAn8 = () => { return `*SE VUOI USCIRE DALLA CHAT ANONIMA USA IL COMANDO #leave O PUOI UTILIZZARE IL PULSANTE QUI SOTTO*\n`} 
const smsChatAn9 = () => { return `🍁 ESCI DALLA CHAT ANONIMA`} 
const smsChatAn10 = () => { return `${lenguajeGB['smsAvisoEG']()}✨ *ORAI POSSONO CHATTARE*`} 
const smsChatAn11 = () => { return `*QUALCUNO SI E' UNITO ALLA CHAT ANONIMA!!*`} 
const smsChatAn12 = () => { return `❇️ ALTRO UTENTE`} 
const smsChatAn13 = () => { return `${lenguajeGB['smsAvisoRG']()}🐈 *IN ATTESA CHE QUALCUNO SI UNISCA ALLA CHAT ANONIMA, PER FAVORE SII PAZIENTE*`}

//Botones de Menú 
const smsBotonM1 = () => { return `⚡ AVVIA MENU ⚡`} 
const smsBotonM2 = () => { return `💫 MENU COMPLETO 💫`} 
const smsBotonM3 = () => { return `🎒 INVENTARIO 🎒`} 
const smsBotonM4 = () => { return `UTENTI`}
const smsBotonM5 = () => { return `RANGO`}
const smsBotonM6 = () => { return `LIVELLO`}
const smsBotonM7 = () => { return `PREMIUM`}
const smsTex1 = () => { return '*CERCA MENU*'}
const smsTex2 = () => { return '*MODIFICATORE AUDIO*'}
const smsTex3 = () => { return '*MENU +18*'}
const smsTex4 = () => { return '*CONTENUTO DINAMICO*'}
const smsTex5 = () => { return '*CERCA E SCARICA*'}
const smsTex6 = () => { return '*MENU +18 PREMIUM*'}
const smsTex7 = () => { return `⠇ *Immagini +18 qualita' e varieta'*\n⠇ *Video +18 solo per te*\n⠇ *Adesivi +18 disponibili*`}
const smsTex8 = () => { return '*MENU CONVERTITORE*'}
const smsTex9 = () => { return '*MENU DOWNLOADS*'}
const smsTex10 = () => { return '*MENU GIOCHI DINAMICI*'}
const smsTex11 = () => { return '*MENU PER GRUPPI*'}
const smsTex12 = () => { return '*MENU STRUMENTI*'}
const smsTex13 = () => { return '*MENU INFORMAZIONI*'}
const smsTex14 = () => { return '*MENU EFFETTI E LOGHI*'}
const smsTex15 = () => { return '*LOGHI MENU 2*'}
const smsTex16 = () => { return 'MENU AUDIO'}
const smsTex17 = () => { return `*NON E' NECESSARIO UTILIZZARE IL PREFISSO NEGLI AUDIO*`}
const smsTex18 = () => { return 'LISTA SUONI'}
const smsTex19 = () => { return '*PUOI SELEZIONARE L\'AUDIO!!*'}
const smsTex20 = () => { return '*MENU CREATORE*'}
const smsTex21 = () => { return '*MENU RPG*'}
const smsTex22 = () => { return '*MENU ADESIVI E FILTRI*'}
const smsTex23 = () => { return '*MENU MEME E ANIME CASUALI*'}

//info-grupos-lista.js
const smsLisA = () => { return '_*SEI IN QUESTI GRUPPI:*_'}
const smsLisB = () => { return '*⭔ Gruppi totali:*'}
const smsLisC = () => { return '*⋄ Gruppo:*'}
const smsLisD = () => { return '*⋄ ID:*'}
const smsLisE = () => { return '*⋄ Partecipanti:*'}

//ad
const smsMalused = () => { return '⚡ *USA IL COMANDO COME SEGUE:*\n'}
const smsMalused2 = () => { return `${lenguajeGB['smsAvisoMG']()}🐈 *DEVI USARE IL COMANDO COME NELL'ESEMPIO SEGUENTE:*\n`}
const smsMalused3 = () => { return `${lenguajeGB['smsAvisoMG']()}🐈 *DEVI USARE IL COMANDO O RISPONDERE AL MESSAGGIO DI QUALCUNO COME NELL'ESEMPIO SEGUENTE:*\n`}

//gc-config_time.js
const smsGrupoTime1 = () => { return '🔓 *_GRUPPO APERTO IN UN' + smsGrupoTime11() + '_*'}
const smsGrupoTime2 = () => { return '🔒 *_GRUPPO CHIUSO IN UN' + smsGrupoTime11() + '_*'}
const smsGrupoTime3 = () => { return '*GRUPPO'}
const smsGrupoTime4 = () => { return 'CHIUSO'}
const smsGrupoTime5 = () => { return 'APERTO'}
const smsGrupoTime6 = () => { return '*DURANTE'}
const smsGrupoTime7 = () => { return `🔒 *IL GRUPPO E' CHIUSO, SOLO GLI AMMINISTRATORI POSSONO INVIARE MESSAGGI*`}
const smsGrupoTime8 = () => { return `🔓 *IL GRUPPO E' APERTO, TUTTI POSSONO INVIARE MESSAGGI*`}
const smsGrupoTime9 = () => { return '🔓 GRUPPO APERTO PER '}
const smsGrupoTime10 = () => { return '🔒 GRUPPO CHIUSO PER '}
const smsGrupoTime11 = () => { return ' ORA'}
const smsGrupoTime12 = () => { return 'PERMETTE DI AVERE IL GRUPPO APERTO PER '}
const smsGrupoTime13 = () => { return 'PERMETTE DI CHIUDERE IL GRUPPO PER '}
//grupo-add.js
const smsAddB1 = () => { return `${lenguajeGB['smsAvisoFG']()}*NON POSSO AGGIUNGERE IL NUMERO, VERIFICA CHE SIA CORRETTO, FORSE E' STATO AGGIUNTO RECENTEMENTE O LA TUA PRIVACY E' IMPOSTATA.*`}
const smsAddB2 = () => { return `${lenguajeGB['smsAvisoFG']()}*NON POSSO AGGIUNGERE IL NUMERO, VERIFICA CHE SIA CORRETTO, O AGGIUNGILO MANUALMENTE.*`}

//grupo-admins.js
const smsAddB3 = () => { return `*NOTIFICA PER GLI AMMINISTRATORI*`}
const smsAddB4 = () => { return `*PRESENZA AMMINISTRATIVA*`}
const smsAddB5 = () => { return `*MESSAGGIO:*`}
const smsAddB6 = () => { return `Chiedo gentilmente agli amministratori.`}

//grupo-advertencia.js
const smsAdveu1 = () => { return `${lenguajeGB['smsAvisoAG']()}*PUOI UTILIZZARLO SOLO SE LA FUNZIONE E' ATTIVATA:*\n`}
const smsAdveu2 = () => { return 'Motivo'}
const smsAdveu3 = () => { return `${lenguajeGB['smsAvisoMG']()}*RICORDATI DI SCRIVERE IL MOTIVO DELL'AVVERTIMENTO*\n`}
const smsAdveu4 = () => { return '*HAI RICEVUTO UN AVVERTIMENTO IN QUESTO GRUPPO!!*'}
const smsAdveu5 = () => { return 'AVVERTIMENTO'}
const smsAdveu6 = () => { return '🎒 INVENTARIO'}
const smsAdveu7 = () => { return '*TI HO AVVISATO DIVERSE VOLTE!!*'}
const smsAdveu8 = () => { return '*ORA SARAI ELIMINATO* 🙄'}
const smsAdveu9 = () => { return '😇 GRAZIE'}
const smsAdveu10 = () => { return `*UN AVVERTIMENTO E' STATO RIMOSSO DA QUESTO GRUPPO!!*`}
const smsAdveu11 = () => { return 'Prima:'}
const smsAdveu12 = () => { return 'Ora:'}

//grupo-demote.js || grupo-promote.js 
const smsDemott = () => { return `*IL NUMERO NON E' VALIDO, RIPROVA RISPONDENDO AL MESSAGGIO DI QUALCUNO O UTILIZZA COME NELL'ESEMPIO SEGUENTE:*\n`}
const smsDemott2 = () => { return '*ORA HA POTERE NEL GRUPPO!!*'}
const smsDemott3 = () => { return `*NON HA PIU' POTERE NEL GRUPPO!!*`}

//grupo-info.js
const smsGI1 = () => { return '*INFORMAZIONI DEL GRUPPO*'}
const smsGI2 = () => { return '*ID DEL GRUPPO*'}
const smsGI3 = () => { return '*NOME DEL GRUPPO*'}
const smsGI4 = () => { return '*DESCRIZIONE DEL GRUPPO*'}
const smsGI5 = () => { return '*NESSUNA DESCRIZIONE*'}
const smsGI6 = () => { return '*NUMERO DI UTENTI*'}
const smsGI7 = () => { return '*Utenti*'}
const smsGI8 = () => { return '*CREATORE DEL GRUPPO*'}
const smsGI9 = () => { return '*AMMINISTRATORI DEL GRUPPO*'}
const smsGI10 = () => { return '⚙️ IMPOSTAZIONI DEL GRUPPO'}


//grupo-kick.js
const smskick1 = () => { return `${lenguajeGB['smsAvisoAG']()}*MENZIONA LA PERSONA O RISPONDI AL MESSAGGIO DELLA PERSONA CHE VUOI RIMUOVERE*\n\n*ESEMPIO: `}
const smskick2 = () => { return `RIMOSSO 😼🫵`}
const smskick3 = () => { return `NON POSSO ELIMINARE IL CREATORE DEL GRUPPO 😆🫵`}
const smskick4 = () => { return `NON IN QUESTO GRUPPO 👻`}

//grupo-tagall.js
const smstagaa = () => { return `⚡ MENZIONE DI GRUPPO ⚡`}

//grupo-setbye.js
const smsSetB = () => { return `${lenguajeGB['smsAvisoEG']()}*IL MESSAGGIO DI ADDIO DEL GRUPPO E' STATO CONFIGURATO*`}
const smsSetB2 = () => { return `${lenguajeGB['smsAvisoIIG']()}🙌 *_SCRIVI IL MESSAGGIO DI ADDIO_*\n*_OPZIONALE PUOI USARE QUELLO CON "@" PER AGGIUNGERE PIU' INFORMAZIONI:_*\n\n*⚡ @user (Menzione all'utente)*\n\n*RICORDATI CHE "@" E' OPZIONALE*`}

//grupo-setwelcome.js
const smsSetW = () => { return `${lenguajeGB['smsAvisoEG']()}*IL MESSAGGIO DI BENVENUTO DEL GRUPPO E' STATO CONFIGURATO*`}
const smsSetW2 = () => { return `${lenguajeGB['smsAvisoIIG']()}🙌 *_SCRIVI IL MESSAGGIO DI BENVENUTO_*\n*_OPZIONALE PUOI USARE QUELLO CON "@" PER AGGIUNGERE PIU' INFORMAZIONI:_*\n\n*⚡ @utente (Menzione all'utente)*\n*⚡ @subject (Nome del gruppo)*\n*⚡ @desc (Descrizione del gruppo)*\n\n*RICORDATI CHE "@" SONO OPZIONALI*`}

//grupo-setdesc.js
const smsDest = () => { return `${lenguajeGB['smsAvisoEG']()}*LA DESCRIZIONE DEL GRUPPO E' STATA CONFIGURATA*`}

//grupo-setname.js
const smsNam1 = () => { return `${lenguajeGB['smsAvisoEG']()}*IL NOME DEL GRUPPO E' STATO IMPOSTATO*`}
const smsNam2 = () => { return `${lenguajeGB['smsAvisoMG']()}*🙌 SCRIVI IL NUOVO NOME DEL GRUPPO*`}
const smsNam3 = () => { return `${lenguajeGB['smsAvisoFG']()}*IL NOME DEL GRUPPO NON DEVE SUPERARE I 25 CARATTERI*`}

//grupo-restaurarEnlace.js
const smsRestGp = () => { return `${lenguajeGB['smsAvisoEG']()}*IL LINK DEL GRUPPO E' STATO RIPRISTINATO*`}

//Button 
const smsSig = () => { return `➡️ AVANTI ➡️`}
const smsSigPrem = () => { return `❤️‍🔥 AVANTI ❤️‍🔥`}
const smsCont18Porn = () => { return `🔞 *CONTENUTI* 🔞`} // testo
const smsCont18Porn2 = () => { return `🔞 CONTENUTI 🔞`} // testo
const smsCont18PornP = () => { return `🌟 *CONTENUTI ❤️‍🔥 PREMIUM* 🌟`} // testo
const smsCont18PornP2 = () => { return `CONTENUTI ❤️‍🔥 PREMIUM`} // testo  

//propietario(a).js
const smsJoin = (user) => { return `${packname}\n*QUESTO E' UN BOT DI WHATSAPP CHE TI AIUTA A FARE DIVERSE ATTIVITA'🪄 CHE SIA IN PRIVATO O IN GRUPPO TI DIVERTITAI 🎈 CON LE SUE MOLTEPLICI FUNZIONALITA', GODITI GATABOT!!! 😸\n\n💖 GATABOT E' STATO INVITATO DA*:\n@${user}`}
const smsJoin1 = (usedPrefix, command) => { return lenguajeGB['smsAvisoMG']() + `*INSERISCI IL LINK DI UN GRUPPO*\n*ESEMPIO:*\n*${usedPrefix + command}* ${nna}`}
const smsJoin2 = () => { return lenguajeGB['smsAvisoEG']() + `${packname}\n*SI E' UNITO AL GRUPPO ✅*`}

//propietario(a).js
const smsBCMensaje = (usedPrefix, command) => { return `*Rispondi al messaggio o scrivi il messaggio utilizzato ${usedPrefix + command}*`}
const smsBCMensaje2 = () => { return `*Messaggio ufficiale inviato, attendi un momento...*`}
const smsBCMensaje3 = (totalPri, time) => { return `✅ *Il messaggio e' stato inviato ${totalPri} a chat Private*\n\n*Tempo totale di invio : ${time}*\n${totalPri >= 3000 ? '\n*Non sono stati inviati a tutte le chat per evitare la saturazione*' : ''}`}
 
//propietario(a.js
const smsPropban1 = (usedPrefix, command, bot) => { return `${lenguajeGB['smsAvisoMG']()}*TAGGA QUALCUNO O RISPONDI AL MESSAGGIO DELL'UTENTE O SCRIVI IL NUMERO CHE VUOI BANNARE DAI COMANDI*\n\n*ESEMPIO:*\n*${usedPrefix + command} @${bot}*`}
const smsPropban2 = (bot) => { return `${lenguajeGB['smsAvisoFG']()}*@${bot} NON PUÒ ESSERE BANNATO CON QUESTO COMANDO* 😹`}
const smsPropban3 = (ownerNumber) => { return `${lenguajeGB.smsAvisoIIG()}😳 *NON POSSO BANNARE IL PROPRIETARIO @${ownerNumber} DI ${packname}*`}
const smsPropban4 = (number) => { return `${lenguajeGB.smsAvisoIIG()}*NON E' NECESSARIO BANNARE DI NUOVO @${number} GIA' E' STATO BANNATO* 😊`}
const smsPropban5 = () => { return `${lenguajeGB['smsAvisoEG']()}*UTENTE BANNATO CON SUCCESSO* 🙀`}
const smsPropban6 = (number, usr) => { return `${lenguajeGB.smsAvisoAG()}*@${number} SEI STATO BANNATO DA @${usr} NON PUOI USARE I COMANDI FINO A CHE QUALCUNO RIMUOVE IL BAN* 😿`}
const smsPropban7 = (usedPrefix, command, number) => { return `${lenguajeGB['smsAvisoFG']()}*E' SORTO UN ERRORE, PUÒ ESSERE CHE L'UTENTE NON SIA NEL MIO DATABASE CERCA DI SCRIVERE ${usedPrefix + command} ${number}*\n\`\`\`SE L'ERRORE CONTINUA, SEGNALA QUESTO COMANDO\`\`\``}

//propietario(a).js
const smsBCbot1 = () => { return `✅ *Messaggio:*`}
const smsBCbot2 = () => { return `Privato `}
const smsBCbot3 = () => { return `Cluster`}
const smsBCbot4 = () => { return `Totale`}
const smsBCbot5 = () => { return `Tempo totale di invio :`}
const smsBCbot6 = () => { return `Non sono stati inviati a tutte le chat per evitare la saturazione`}
const smsBCbot7 = () => { return `✅ *Comunicato ufficiale* ✅`}

//propietario(a).js
const smsChatGP1 = () => { return "*Messaggio inviato, attendi un momento...*"}
const smsChatGP2 = (readMS, dia, mes, año, fecha, tiempo) => { return `✅ *Comunicato ufficiale* ✅\n${readMS}\n\`\`\`${dia}, ${mes} ${año}\`\`\`\n\`\`\`${fecha} || ${tiempo}\`\`\`\n\n`}
const smsChatGP3 = (totalGP) => { return `✅ *Il messaggio e' stato inviato a ${totalGP} gruppi*`}

//jadibot-serbot.js
const smsIniJadi = () => { return `*⊹ • • • ミ★ ${global.packname} ミ★• • • ⊹*\n\n*ღ Versione di ${global.packname} » _${global.vs}_*\n*ღ Versione di JadiBot » _${global.vsJB}_*\n\n🟢 *_FUNZIONE PER DIVENTARE UN SOTTO BOT_* 🟢\n\n*➡️ Con un altro cellulare o PC, scannerizza questo QR per diventare un Sotto Bot*\n\n*1️⃣ Vai alle tre linee in alto a destra*\n*2️⃣ Vai all'opzione Dispositivi abbinati*\n*3️⃣ Scannerizza questo codice QR per effettuare il login*\n\n📢 *Questo codice QR scade in 45 secondi!*`}
const smsSoloOwnerJB = () => { return `${lenguajeGB['smsAvisoAG']()}*QUESTO COMANDO E' DISABILITATO DAL MIO PROPRIETARIO*`}
const smsIniJadi2 = () => { return `*⊹ • • • ミ★ ${global.packname} ミ★• • • ⊹*

*ღ Versione di ${global.packname} » _${global.vs}_*
*ღ Versione di JadiBot » _${global.vsJB}_*

🟢 *_NUOVA FUNZIONE PER DIVENTARE UN SOTTO BOT_* 🟢

*1️⃣ Vai alle tre linee in alto a destra*\n*2️⃣ Vai all'opzione Dispositivi abbinati*
*3️⃣ Fai clic sul link con il codice del telefono*
*4️⃣ incolla il codice qui sotto*`}
const smsJBConexionClose2 = () => { return `${lenguajeGB['smsAvisoFG']()}🔴 *IL TUO DISPOSITIVO E' CONNESSO*\n\n*DEVI RICONNETTERTI PER UTILIZZARE:\n#deletesesion`}
const smsreenvia = () => { return `*🟢 RINVIA COMANDO...*`}
const smsJBPrincipal = () => { return `${lenguajeGB['smsAvisoAG']()}🔵 *PER ESSERE UN SOTTO BOT VAI AL NUMERO PRINCIPALE*\n*ღ Inserisci il seguente link:*\n`}
const smsJBConexion = () => { return `${lenguajeGB['smsAvisoFG']()}🟡 *LA CONNESSIONE E' STATA CHIUSA IN MODO IMPREVISTO, PROVEREMO A RICONNETTERCI...*`}
const smsJBConexionClose = () => { return `${lenguajeGB['smsAvisoFG']()}🔴 *LA CONNESSIONE E' STATA CHIUSA, DEVI CONNETTERTI MANUALMENTE UTILIZZANDO IL COMANDO #jadibot E RISCANNE IL NUOVO CODICE QR*`}
const smsJBConexionTrue = () => { return `${lenguajeGB['smsAvisoEG']()}🟢 *CONNESSIONE RIUSCITA!!!*`}
const smsJBConexionTrue2 = () => { return `${lenguajeGB['smsAvisoEG']()}🟢 *CONNESSIONE RIUSCITA!!! PUOI CONNETTERTI UTILIZZANDO:*`}
const smsJBCargando = () => { return `${lenguajeGB['smsAvisoIIG']()}⚪ *E' CONNESSO!! PER FAVORE, ATTENDI IL CARICAMENTO DEI MESSAGGI...*\n\n♻️ *OPZIONI DISPONIBILI:*\n*» #stop _(Arresta la funzione di Sotto Bot)_*\n*» #deletesesion _(Elimina tutte le tracce del Sotto Bot)_*\n*» #jadibot _(Ottieni un nuovo codice QR per essere Sotto Bot)_*`}
const smsJBInfo1 = () => { return `💖 *LINK UTILI*`}
const smsJBInfo2 = () => { return `💖 *La funzione e' stabile, se presenta qualche inconveniente Contatta la mail: centergatabot@gmail.com*\n💝 *Puoi fare una donazione volontaria tramite PayPal: ${global.paypal}*\n\n*Grazie mille per il supporto ${global.packname}*`}

//jadibot-deleteSesion.js
const smsJBDel = () => { return `${lenguajeGB['smsAvisoAG']()}*UTILIZZA QUESTO COMANDO PER IL BOT PRINCIPALE*`}
const smsJBAdios = () => { return `${lenguajeGB['smsAvisoEG']()}*MI MANCHERAI ${global.packname} CIAO!! 🥹*`}
const smsJBCerrarS = () => { return `${lenguajeGB['smsAvisoEG']()}*TI SEI DISCONNESSO ED HAI ELIMINATO TUTTE LE TRACCE*`}
const smsJBErr = () => { return `*TI SEI DISCONNESSO COME SOTTO BOT* ♻️`}

//comandos+18-adult.js
const smsContAdult = () => { return `${lenguajeGB['smsAvisoAG']()}*LE COMANDI 🔞 SONO DISABILITATI, SE SEI IL MIO CREATORE UTILIZZA #on modohorny*`}

//comandos+18-menu.js
const smsList1 = () => { return `Non hai abbastanza `}
const smsList2 = () => { return `\nClicca qui per acquistare `}
const smsList3 = () => { return `Contenuti disponibili 😸`}
const smsList4 = () => { return `Contenuto non disponibile 😿\nClicca qui per acquistare `}
const smsList5 = () => { return `*Seleziona un'opzione*\n*dalla lista per vedere i*\n*contenuti* 😋`}
const smsList6 = () => { return `👀 VEDI LISTA 👀`}

//descargas-consejos.js
const smsConj = () => { return `🍃 NUOVO CONSIGLIO`}
const smsFras = () => { return `🍃 NUOVA FRASE`}

//info-contacto.js
const smsContacto1 = () => { return 'Sono ' + packname + ', un Bot WhatsApp dedicato ad aiutarti con qualsiasi cosa tu chieda 😎'}
const smsContacto2 = () => { return 'Sono il Proprietario di ' + packname + ', se hai domande puoi chiedermi ✌️'}
const smsContacto3 = () => { return '👑 Proprietario'}
const smsContacto4 = () => { return 'Contatto Ufficiale GataBot 🐈'}
const smsContacto5 = () => { return '🐣 Come posso aiutarti?'}
const smsContacto6 = () => { return 'Non ho una mail 🙏'}
const smsContacto7 = () => { return '🌎 Globale'}
const smsContacto8 = () => { return `Questo Account e' un Bot 👀`}


export default { lenguaje, smsConexioncerrar, smsConexionperdida, smsConexionreem, smsConexionreinicio, smsConexiontiem, smsConexiondescon, smsAvisoRG, smsJoin, smsJoin1, smsJoin2, smsPropban1, smsPropban2, smsPropban3, smsPropban4, smsPropban5, smsPropban6, smsPropban7, smsLisA, smsLisB, smsLisC, smsLisD, smsLisE, smsChatGP1, smsChatGP2, smsChatGP3, smsBCMensaje, smsBCMensaje2, smsBCMensaje3, smsAvisoAG, smsAvisoIIG, smsBCbot1, smsBCbot2, smsBCbot3, smsBCbot4, smsBCbot5, smsBCbot6, smsBCbot7, smsAvisoFG, smsAvisoMG, smsAvisoEEG, smsAvisoEG, smsRowner, smsOwner, smsMods, smsPremium, smsGroup, smsPrivate, smsAdmin, smsBotAdmin, smsUnreg, smsRestrict, smsTime, smsUptime, smsVersion, smsTotalUsers, smsMode, smsModePublic, smsModePrivate, smsBanChats, smsBanUsers, smsPareja, smsResultPareja, smsSaludo, smsDia, smsTarde, smsTarde2, smsNoche, smsListaMenu, smsLista1, smsLista2, smsLista3, smsLista4, smsLista5, smsLista6, smsLista7, smsLista8, smsLista9, smsLista10, smsLista11, smsLista12, smsLista13, smsLista14, smsLista15, smsLista16, smsLista17, smsLista18, smsLista19, smsLista20, smsLista21, smsLista22, smsLista23, smsLista24, smsLista25, smsLista26, smsLista27, smsLista28, smsLista29, smsLista30, smsLista31, smsLista32, smsLista33, smsLista34, smsLista35, smsWelcome, smsBye, smsSpromote, smsSdemote, smsSdesc, smsSsubject, smsSicon, smsSrevoke, smsConexion, smsClearTmp, smsCargando, smspurgeSession, smspurgeOldFiles, smspurgeSessionSB1, smspurgeSessionSB2, smspurgeSessionSB3, smspurgeOldFiles1, smspurgeOldFiles2, smspurgeOldFiles3, smspurgeOldFiles4, smsTextoYT, smsApagar, smsEncender, smsEnlaceTik, smsEnlaceYt, smsEnlaceTel, smsEnlaceFb, smsEnlaceIg, smsEnlaceTw, smsAllAdmin, smsSoloOwner, smsCont1, smsCont2, smsCont3, smsCont4, smsCont5, smsCont6, smsCont7, smsCont8, smsCont9, smsCont10, smsCont11, smsCont12, smsCont13, smsCont14, smsCont15, smsCont16, smsCont17, smsCont18, smsCont19, smsCont20, smsCont21, smsInt1, smsInt2, smsAdwa, smsEnlaceWat, smsEnlaceWatt, smsNoSpam, smsNoSpam2, smsConMenu, smsMalError, smsMalError2, smsMalError3, smsToxic1, smsToxic2, smsToxic3, smsToxic4, smsToxic5, smsToxic6, smsToxic7, eExp, eDiamante, eDiamantePlus, eToken, eEsmeralda, eJoya, eMagia, eOro, eGataCoins, eGataTickers, eEnergia, ePocion, eAgua, eBasura, eMadera, eRoca, ePiedra, eCuerda, eHierro, eCarbon, eBotella, eLata, eCarton, eEletric, eBarraOro, eOroComun, eZorroG, eBasuraG, eLoboG, eMaderaG, eEspada, eCarnada, eBillete, ePinata, eGancho, eCanaPescar, eCComun, ePComun, eCMistica, eCMascota, eCJardineria, eClegendaria, eUva, eManzana, eNaranja, eMango, ePlatano, eSUva, eSManzana, eSNaranja, eSMango, eSPlatano, eCentauro, eAve, eGato, eDragon, eZorro, eCaballo, eFenix, eLobo, ePerro, eAMascots, eCCentauro, eCAve, eCMagica, eCDragon, eACaballo, eCFenix, smsWel1, smsWel2, smsParaAdmins, smsDete1, smsDete2, smsANivel1, smsANivel2, smsParaAdYOw, smsParaOw, smsRestri1, smsRestri2, smsLlamar1, smsLlamar2, smsModP1, smsModP2, smsModAd1, smsModAd2, smsLect1, smsLect2, smsTempo1, smsTempo2, smsStik1, smsStik2, smsStickA1, smsStickA2, smsReacc1, smsReacc2, smsAudi1, smsAudi2, smsModHor1, smsModHor2, smsAntitoc1, smsAntitoc2, smsModOb1, smsModOb2,
smsAntiEli1, smsAntiEli2, smsAntiInt1, smsAntiInt2, smsAntiE1, smsAntiE2, smsAntiEE1, smsAntiEE2, smsAntiTT1, smsAntiTT2, smsAntiYT1, smsAntiYT2, smsAntiTEL1, smsAntiTEL2, smsAntiFB1, smsAntiFB2, smsAntiIG1, smsAntiIG2, smsAntiTW1, smsAntiTW2, smsSOLOP1, smsSOLOP2, smsSOLOG1, smsSOLOG2, smsNoGg, smsConfi1, smsConfi2, smsConfi3, smsConfi4, smsConfi5, smsConfi6, smsConfi7, smsConfi8, smsConfi9, smsConfi10, smsMens1, smsMens2, smsMens3, smsMens4, smsMens5, smsMensError1, smsMensError2, smsAntiView, smsAutoLv1, smsAutoLv2, smsAutoLv3, smsAutoLv4, smsAutoLv5, smsAutoLv6, smsAutoLv7, smsAntiSp1, smsAntiSp2, smsAutoStik, smsBottem1, smsBottem2, smsBottem3, smsPremI,
smsAfkM1, smsAfkM2, smsAfkM3, smsAfkM4, smsAfkM5, smsAfkM6, smsAfkM1A, smsAfkM1B, smsChatAn1, smsChatAn2, smsChatAn3, smsChatAn4, smsChatAn5, smsChatAn6, smsChatAn7, smsChatAn8, smsChatAn9, smsChatAn10, smsChatAn11, smsChatAn12, smsChatAn13, smsBotonM1, smsBotonM2, smsBotonM3, smsBotonM4, smsBotonM5, smsBotonM6, smsBotonM7, smsTex1, smsTex2, smsTex3, smsTex4, smsTex5, smsTex6, smsTex7, smsTex8, smsTex9, smsTex10, smsTex11, smsTex12, smsTex13, smsTex14, smsTex15, smsTex16, smsTex17, smsTex18, smsTex19, smsTex20, smsTex21, smsTex22, smsTex23, smsMalused, smsGrupoTime1, smsGrupoTime2, smsGrupoTime3, smsGrupoTime4, smsGrupoTime5, smsGrupoTime6, smsGrupoTime7, smsGrupoTime8, smsGrupoTime9, smsGrupoTime10, smsGrupoTime11, smsGrupoTime12, smsGrupoTime13, smsAddB1, smsAddB2, smsAddB3, smsAddB4, smsAddB5, smsAddB6, smsAdveu1, smsMalused2, smsAdveu2, smsAdveu3, smsAdveu4, smsAdveu5, smsAdveu6, smsAdveu7, smsAdveu8, smsAdveu9, smsMalused3, smsAdveu10, smsAdveu11, smsAdveu12, smsDemott, smsDemott2, smsDemott3,
smsGI1, smsGI2, smsGI3, smsGI4, smsGI5, smsGI6, smsGI7, smsGI8, smsGI9, smsGI10, smsLista22_1, smsCodigoQR, smsConexionOFF, smskick1, smskick2, smskick3, smskick4, smstagaa,
smsSetB, smsSetB2, smsSetW, smsSetW2, smsDest, smsNam1, smsNam2, smsNam3, smsRestGp, smsSig, smsSigPrem, smsCont18Porn, smsCont18Porn2, smsCont18PornP, smsCont18PornP2,
smsIniJadi, smsSoloOwnerJB, smsJBPrincipal, smsJBConexion, smsJBConexionClose, smsJBConexionTrue, smsJBConexionTrue2, smsJBCargando, smsJBInfo1, smsJBInfo2, smsJBDel, smsJBAdios, 
smsJBCerrarS, smsJBErr, smsContAdult, smsList1, smsList2, smsList3, smsList4, smsList5, smsList6, smsConj, smsFras, smsContacto1, smsContacto2, smsContacto3, smsContacto4,
smsContacto5, smsContacto6, smsContacto7, smsContacto8, smsAfkQ1, smsAfkQ2, smsAfkTime, smsAfkResultTime, smsMainBot, smsreenvia, smsJBConexionClose2, smsIniJadi2}
