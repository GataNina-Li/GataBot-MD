const lenguaje = () => { return 'id' } //Bahasa Indonesia

//PEMBERITAHUAN PESAN
const smsAvisoRG = () => { return `╰⊱✅⊱ *HASIL* ⊱✅⊱╮\n\n` }
const smsAvisoAG = () => { return `╰⊱⚠️⊱ *PERINGATAN* ⊱⚠️⊱╮\n\n` }
const smsAvisoIIG = () => { return `╰⊱❕⊱ *INFORMASI* ⊱❕⊱╮\n\n` }
const smsAvisoFG = () => { return `╰⊱❌⊱ *KESALAHAN* ⊱❌⊱╮\n\n` }
const smsAvisoMG = () => { return `╰⊱❗️⊱ *TINDAKAN BURUK* ⊱❗️⊱╮\n\n` }
const smsAvisoEEG = () => { return `╰⊱📩⊱ *LAPORAN* ⊱📩⊱╮\n\n` }
const smsAvisoEG = () => { return `╰⊱💚⊱ *KESUKSESAN* ⊱💚⊱╮\n\n` }

//PARAMETER DALAM PERINTAH
const smsRowner = () => { return `${global.lenguajeGB['smsAvisoAG']()}\`\`\`¡¡PERINTAH INI HANYA SAYA SEBAGAI PENCIPTA BOT YANG BISA MENGGUNAKANNYA!!\`\`\`` }
const smsOwner = () => { return `${global.lenguajeGB['smsAvisoAG']()}\`\`\`¡¡PERINTAH INI HANYA KREATOR SAYA YANG BISA MENGGUNAKANNYA!!\`\`\`` }
const smsMods = () => { return `${global.lenguajeGB['smsAvisoAG']()}\`\`\`¡¡PERINTAH INI HANYA MODERATOR DAN PENCIPTA SAYA YANG BISA MENGGUNAKANNYA!!\`\`\`` }
const smsPremium = () => { return `${global.lenguajeGB['smsAvisoAG']()}\`\`\`¡¡PERINTAH INI HANYA TERSEDIA UNTUK PENGGUNA PREMIUM DAN PENCIPTA SAYA!! UNTUK MENDAPATKAN PREMIUM, BELI PASS MENGGUNAKAN #pass premium\`\`\`` }
const smsGroup = () => { return `${global.lenguajeGB['smsAvisoAG']()}\`\`\`¡¡PERINTAH INI HANYA DAPAT DIGUNAKAN DALAM GRUP!!\`\`\`` }
const smsPrivate = () => { return `${global.lenguajeGB['smsAvisoAG']()}\`\`\`¡¡COMMAND INI HANYA DAPAT DIGUNAKAN UNTUK PRIVATE!!\`\`\`` }
const smsAdmin = () => { return `${global.lenguajeGB['smsAvisoAG']()}\`\`\`¡¡PERINTAH INI HANYA UNTUK ADMIN!!\`\`\`` }
const smsBotAdmin = () => { return `${global.lenguajeGB['smsAvisoAG']()}\`\`\`¡¡SAYA PERLU MENJADI ADMIN SEHINGGA ANDA BISA MENGGUNAKAN COMMAND INI!!\`\`\`` }
const smsUnreg = () => { return `${global.lenguajeGB['smsAvisoAG']()}\`\`\`¡¡ANDA HARUS DAFTAR UNTUK MENGGUNAKAN COMMAND INI, KETIK #verify UNTUK DAFTAR!!\`\`\`` }
const smsRestrict = () => { return `${global.lenguajeGB['smsAvisoAG']()}\`\`\`¡¡PERINTAH INI DIBATASI OLEH PENCIPTA SAYA!!\`\`\`` }

//DAFTAR MENU
const smsTime = () => { return `Waktu saat ini`}
const smsUptime = () => { return `Berjalan Selama`}
const smsVersion = () => { return `Versi dari ${global.packname}`}
const smsTotalUsers = () => { return `Jumlah Pengguna`}
const smsMode = () => { return `Sedang dalam mode`}
const smsModePublic = () => { return `PUBLIK`}
const smsModePrivate = () => { return `PRIBADI`}
const smsBanChats = () => { return `Obrolan Terlarang`}
const smsBanUsers = () => { return `Pengguna yang Diblokir`}
const smsPareja = () => { return `Pasangan`}
const smsResultPareja = () => { return `Lajang`}
const smsSaludo = () => { return `👋 HALO! SELAMAT DATANG 👋`}
const smsDia = () => { return `🌇 Selamat pagi ⛅`}
const smsTarde = () => { return `🏙️ Selamat malam 🌤️`}
const smsTarde2 = () => { return `🌆 Selamat malam 🌥️`}
const smsNoche = () => { return `🌃 Selamat malam 💫`}
const smsListaMenu = () => { return `⊹ DAFTAR MENU ⊹`}
const smsLista1 = () => { return `🌟 INFORMASI GATABOT 🌟`}
const smsLista2 = () => { return `💖 PENCIPTA 💖`}
const smsLista3 = () => { return `🎁 DONASI: DUKUNGAN 🎁`}
const smsLista4 = () => { return `🚀 KECEPATAN 🚀`}
const smsLista5 = () => { return `💡 INFORMASI MENU 💡`}
const smsLista6 = () => { return `🌀 MENU LENGKAP 🌀`}
const smsLista7 = () => { return `🐈 PASANG GATABOT 🐈`}
const smsLista8 = () => { return `🍄 JADILAH SUBBOT 🍄`}
const smsLista9 = () => { return `📄 SYARAT, KETENTUAN DAN PRIVASI 📄`}
const smsLista10 = () => { return `🌟 PETUALANGAN DAN TOP 🌟`}
const smsLista11 = () => { return `🏆 TOP DUNIA 🏆`}
const smsLista12 = () => { return `🏅 PENGGUNA PREMIUM 🏅`}
const smsLista13 = () => { return `🎟️ JADILAH PENGGUNA PREMIUM 🎟️`}
const smsLista14 = () => { return `🛣️ MISI 🛣️`}
const smsLista15 = () => { return `⚗️ MENU RPG ⚗️`}
const smsLista16 = () => { return `🏪 PEMBELIAN TOKO 🏪`}
const smsLista17 = () => { return `🎒 INVENTARIS 🎒`}
const smsLista18 = () => { return `🌟 MULTIMEDIA 🌟`}
const smsLista19 = () => { return `📲 UNDUH MENU 📲`}
const smsLista20 = () => { return `🔍 MENU CARI 🔍`}
const smsLista21 = () => { return `🛰️ MENU KONVERTER 🛰️`}
const smsLista22 = () => { return `🧰 MENU PENGUBAH AUDIO 🧰`}
const smsLista22_1 = () => { return `🔩 MENU ALAT 🔩`}
const smsLista23 = () => { return `🌟 SERU 🌟`}
const smsLista24 = () => { return `🎡 GAME DINAMIS 🎡`}
const smsLista25 = () => { return `🔊 MENU AUDIO 🔊`}
const smsLista26 = () => { return `🎈 MENU STIKER DAN FILTER 🎈`}
const smsLista27 = () => { return `✨ MENU EFEK DAN LOGO ✨`}
const smsLista28 = () => { return `🌅 LOGO MENU 2 🌅`}
const smsLista29 = () => { return `⛩️ MEME DAN ANIME RANDOM ⛩️`}
const smsLista30 = () => { return `🔞 PERINTAH UNTUK DEWASA +18 🔞`}
const smsLista31 = () => { return `🌟 PENGATURAN 🌟`}
const smsLista32 = () => { return `🔰 MENU UNTUK GRUP 🔰`}
const smsLista33 = () => { return `📑 JENIS DAFTAR 📑`}
const smsLista34 = () => { return `⚙️ PUSAT KONFIGURASI ⚙️`}
const smsLista35 = () => { return `💎 PEMILIK MENU 💎`}

//main.js
const smsWelcome = () => { return `*╭┈⊰* @subject *⊰┈ ✦*\n*┊✨ SELAMAT DATANG!!*\n┊💖 @user\n┊📄 *BACA DESKRIPSI GRUP*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ ✦*\n${String.fromCharCode(8206).repeat(850)}\n@desc`}
const smsBye = () => { return '*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*\n┊ @user\n┊ *DIA MENINGGALKAN GRUP, SEGERA KEMBALI* 😎\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*'}
const smsSpromote = () => { return '*@user ANDA SEKARANG ADMIN DI GRUP INI!!*'}
const smsSdemote = () => { return '*@user TIDAK ADA LAGI ADMIN DI GRUP INI!!*'}
const smsSdesc = () => { return '*DESKRIPSI BARU GRUP ADALAH:*\n\n@desc'}
const smsSsubject = () => { return '*NAMA BARU GRUP ADALAH:*\n\n@subject'}
const smsSicon = () => { return '*FOTO GRUP INI SUDAH DIUBAH!!*'}
const smsSrevoke = () => { return '*SEKARANG INI LINK BARU DARI GRUP INI!!*\n\n*@revoke*'}
const smsConexion = () => { return `\n𓃠 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈✦ 🟢 KONEKSI ✦┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓃠\n│\n│★ SUKSES KONEKSI DENGAN WHATSAPP  😺\n│\n𓃠 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈✦ ✅ ✦┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓃠`}
const smsClearTmp = () => { return `\n𓃠 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈✦ TMP BERSIH OTOMATIS ✦┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓃠\n│\n│★ FILE DALAM FOLDER TMP SUDAH DIHAPUS 😼✨\n│\n𓃠 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈✦ ✅ ✦┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓃠`}
const smsCargando = () => { return `😸 MEMUAT...\n`}
const smsCodigoQR = () => { return `\n✅ PINDAI KODE QR BERAKHIR DALAM 45 DETIK ✅`}
const smsConexionOFF = () => { return `\n⚠️ TIDAK ADA KONEKSI, HAPUS FOLDER ${global.authFile} DAN PINDAI KODE QR ⚠️`}

//_allantilink.js
const smsTextoYT = () => { return '😻 Super GataBot-MD - WhatsApp '}
const smsApagar = () => { return '❌ MENONAKTIFKAN'}
const smsEncender = () => { return '✅ MENGAKTIFKAN'}
const smsEnlaceTik = () => { return `*LINK TIKTOK YANG DILARANG TERDETEKSI DI GRUP INI*\n\n*SAYA LANJUTKAN UNTUK MENGHAPUS ANDA*`}
const smsEnlaceYt = () => { return `*LINK YOUTUBE YANG DILARANG TERDETEKSI DI GRUP INI*\n\n*SAYA LANJUTKAN UNTUK MENGHAPUS ANDA*`}
const smsEnlaceTel = () => { return `*LINK TELEGRAM YANG DILARANG TERDETEKSI DI GRUP INI*\n\n*SAYA LANJUTKAN UNTUK MENGHAPUS ANDA*`}
const smsEnlaceFb = () => { return `*LINK FACEBOOK TERBANNED TERDETEKSI DI GRUP INI*\n\n*SAYA LANJUTKAN UNTUK MENGHAPUS ANDA*`}
const smsEnlaceIg = () => { return `*LINK INSTAGRAM TERBANNED TERDETEKSI DI GRUP INI*\n\n*SAYA LANJUTKAN UNTUK MENGHAPUS ANDA*`}
const smsEnlaceTw = () => { return `*TAUTAN TWITTER YANG DILARANG TERDETEKSI DI GRUP INI*\n\n*SAYA LANJUTKAN UNTUK MENGHAPUS ANDA*`}
const smsAllAdmin = () => { return `*SAYA PERLU MENJADI ADMIN UNTUK DAPAT MENGHAPUS PENYUSU*`}
const smsSoloOwner = () => { return `*KREATOR SAYA HARUS MENGAKTIFKAN FUNGSINYA*\n*#on restrict*`}

//handler.js
const smsCont1 = () => { return `*🔴 PERINTAH GAGAL 🔴*`}
const smsCont2 = () => { return `*⚠️ PLUGIN:*`}
const smsCont3 = () => { return `*⚠️ PENGGUNA:*`}
const smsCont4 = () => { return `*⚠️ MEMERINTAH:*`}
const smsCont5 = () => { return `*⚠️ KESALAHAN:*`}
const smsCont6 = () => { return `*❗ LAPORAN PESAN INI MENGGUNAKAN COMMAND #reporte UNTUK MEMECAHKANNYA*`}
const smsCont7 = () => { return `${global.lenguajeGB['smsAvisoAG']()}*TIDAK MEMILIKI BERLIAN!! 💎 ANDA DAPAT PERGI KE TOKO DENGAN PERINTAH*`}
const smsCont8 = () => { return ` *BERLIAN 💎 DIGUNAKAN*`}
const smsCont9 = () => { return `${global.lenguajeGB['smsAvisoAG']()}*BUTUH TINGKATNYA ➡️*`}
const smsCont10 = () => { return `*UNTUK MENGGUNAKAN PERINTAH INI. TINGKAT ANDA SAAT INI ADALAH ➡️*`}
const smsCont11 = () => { return `*PERBARUI DENGAN PERINTAH*`}
const smsCont12 = () => { return `GRUP BESAR!! 😼`}
const smsCont13 = () => {return `ADA YANG BERGABUNG!! 🥳`}
const smsCont14 = () => { return `SESEORANG TINGGAL!! 🧐`}
const smsCont15 = () => { return `*HALO*`}
const smsCont16 = () => { return `*PANGGILAN VIDEO* 📲`}
const smsCont17 = () => { return `*PANGGILAN* 📞`}
const smsCont18 = () => { return `*MEREKA TIDAK BERWENANG JADI SAYA AKAN MEMBLOKIR ANDA*\n\n*JIKA ANDA TERPANGGIL SECARA KECELAKAAN HUBUNGI ORANG PENCIPTA BOT INI*`}
const smsCont19 = () => { return `ANTI HAPUS`}
const smsCont20 = () => { return `*┃✤ Nama:*`}
const smsCont21 = () => { return `*┃✤ Mengirim pesan yang dihapus...*`}

//_anti-internacional.js
const smsInt1 = () => { return `*NOMOR INI*`}
const smsInt2 = () => { return `*TIDAK DIPERBOLEHKAN DI GRUP INI!!*`}

//_antilink.js
const smsAdwa = () => { return `${global.lenguajeGB['smsAvisoEG']()}*SEBAGAI ANDA ADMIN DI GRUP INI ANDA TIDAK AKAN DIHAPUS*`}
const smsEnlaceWat = () => { return `${lenguajeGB['smsAvisoAG']()}*LINK WHATSAPP TERBANNED TERDETEKSI DI GRUP INI*\n\n*SAYA LANJUTKAN UNTUK MENGHAPUS ANDA*`}

//_antilink2.js
const smsEnlaceWatt = () => { return `${lenguajeGB['smsAvisoAG']()}LINK TERLARANG MENGANDUNG HTTPS TERDETEKSI DI GRUP INI\n\nSAYA LANJUTKAN UNTUK MENGHAPUS ANDA`}

//_antispam.js
const smsNoSpam = () => { return `🤨 JANGAN SPAM, ANDA TIDAK AKAN DAPAT MENGGUNAKAN ${global.packname} UNTUK ${60000 / 1000 - 59} MENIT`}

//_antispam_.js
const smsNoSpam2 = () => { return `DIBATALKAN SETELAH ${60000 / 1000 - 59} MENIT. TOLONG JANGAN SPAM!!`}

//teks
const smsConMenu = () => { return `☘️ MENU`}

//Kesalahan
const smsMalError = () => { return `${lenguajeGB['smsAvisoFG']()}\`\`\`SEBUAH KESALAHAN YANG TIDAK TERDUGA TELAH TERJADI.\`\`\``}
const smsMalError2 = () => { return `${lenguajeGB['smsAvisoFG']()}\`\`\`KENYAMANAN TELAH TIMBUL. COBA LAGI.\`\`\``}
const smsMalError3 = () => { return `${lenguajeGB['smsAvisoFG']()}\`\`\`ADA YANG SALAH, LAPORAN PERINTAH INI MENGGUNAKAN:\`\`\`\n`}

//_antitoxic.js
const smsToxic1 = () => { return `TIDAK!!! 🤬 KATAKAN KATA INI`}
const smsToxic2 = () => { return `DILARANG JANGAN TOXIC`}
const smsToxic3 = () => { return `*PERINGATAN*\n⚠️`}
const smsToxic4 = () => { return `😭 SAYA MINTA MAAF`}
const smsToxic5 = () => { return `☢️ NONAKTIFKAN ANTITOXIC`}
const smsToxic6 = () => { return `SAYA PERINGATKAN KALIAN BEBERAPA KALI!!`}
const smsToxic7 = () => { return `ANDA LULUS SEMUA 4 PERINGATAN SEKARANG ANDA AKAN DIHAPUS 🙄`}

//Toko
const eExp = () => { return '⚡ Experience' } 
const eDiamante = () => { return '💎 Diamond' } 
const eDiamantePlus = () => { return '💎+ Diamond+' }
const eToken = () => { return '🪙 Token' } 
const eEsmeralda = () => { return '💚 Emerald' } 
const eJoya = () => { return '♦️ Jewel' }
const eMagia = () => { return '🌀 Magic' } 
const eOro = () => { return '👑 Gold' } 
const eGataCoins = () => { return '🐱 GataCoins' }
const eGataTickers = () => { return '🎫 Gata Tickers' } 
const eEnergia = () => { return '✨ Energy' }

const ePocion = () => { return '🥤 Potion' }
const eAgua = () => { return '💧 Water' }
const eBasura = () => { return '🗑 Trash' }
const eMadera = () => { return '🪵 Wood' }
const eRoca = () => { return '🪨 Rock' }
const ePiedra = () => { return '🥌 Stone' }
const eCuerda = () => { return '🕸️ String' }
const eHierro = () => { return '⛓️ Iron' }
const eCarbon = () => { return '⚱️ Coal' }
const eBotella = () => { return '🍶 Bottle' }
const eLata = () => { return '🥫 Can' }
const eCarton = () => { return '🪧 Paperboard' } 

const eEletric = () => { return '💡 Electricity' }
const eBarraOro = () => { return '〽️ Gold bar' }
const eOroComun = () => { return '🧭 Common Gold' }
const eZorroG = () => { return '🦊🌫️ Big Fox' }
const eBasuraG = () => { return '🗑🌫️ Super Trash' }
const eLoboG = () => { return '🐺🌫️ Super Wolf' }
const eMaderaG = () => { return '🛷🌫️ Super Wood' }
const eEspada = () => { return '⚔️ Sword' }
const eCarnada = () => { return '🪱 Bait' }
const eBillete = () => { return '💵 Banknotes' }
const ePinata = () => { return '🪅 Pinata' }
const eGancho = () => { return '🪝 Hook' }
const eCanaPescar = () => { return '🎣 Fishing Rod' } 

const eCComun = () => { return '📦 Common Box' }
const ePComun = () => { return '🥡 Uncommon Box' }
const eCMistica = () => { return '🗳️ Mythic Box' }
const eCMascota = () => { return '📫 Pet Box' }
const eCJardineria = () => { return '💐 Gardening Box' }
const eClegendaria = () => { return '🎁 Legendary Box' } 

const eUva = () => { return '🍇 Grape' }
const eManzana = () => { return '🍎 Apple' }
const eNaranja = () => { return '🍊 Orange' }
const eMango = () => { return '🥭 Mango' }
const ePlatano = () => { return '🍌 Banana' } 

const eSUva = () => { return '🌾🍇 Grape seeds' }
const eSManzana = () => { return '🌾🍎 Apple seeds' }
const eSNaranja = () => { return '🌾🍊 Orange seeds' }
const eSMango = () => { return '🌾🥭 Mango Seeds' }
const eSPlatano = () => { return '🌾🍌 Banana seeds' } 

const eCentauro = () => { return '🐐 Centaur' }
const eAve = () => { return '🦅 Bird' }
const eGato = () => { return '🐈 Cat' }
const eDragon = () => { return '🐉 Dragon' }
const eZorro = () => { return '🦊 Fox' }
const eCaballo = () => { return '🐎 Horse' }
const eFenix = () => { return '🕊️ Phoenix' }
const eLobo = () => { return '🐺 Wolf' }
const ePerro = () => { return '🐶 Dog' } 

const eAMascots = () => { return '🍖 Pet Food' }
const eCCentauro = () => { return '🐐🥩 Centaur Food' }
const eCAve = () => { return '🦅🥩 Bird Food' }
const eCMagica = () => { return '🌀🥩 Magic Food' }
const eCDragon = () => { return '🐉🥩 Dragon Food' }
const eACaballo = () => { return '🐎🥩 Horse Food' }
const eCFenix = () => { return '🕊️🥩 Phoenix Food' } 

//config-on y off.js
const smsWel1 = () => { return `🎉 SELAMAT DATANG`}
const smsWel2 = () => { return `Pesan Selamat Datang untuk Anggota baru di Grup`}
const smsDete1 = () => { return `🔔 PEMBERITAHUAN`}
const smsDete2 = () => { return `Pemberitahuan tindakan dalam Grup`}
const smsANivel1 = () => { return `🆙 TINGKAT OTOMATIS`}
const smsANivel2 = () => { return `Tingkatkan semua orang secara otomatis; (Berlaku hadiah untuk naik level)`}
const smsRestri1 = () => { return `⛔ UNTUK MEMBATASI`}
const smsRestri2 = () => { return `Aktifkan fungsi untuk menambah atau menghapus orang di Grup`}
const smsLlamar1 = () => { return `🚫 ANTI PANGGILAN`}
const smsLlamar2 = () => { return `Blokir orang yang melakukan panggilan`}
const smsAntiSp1 = () => { return `🚯 ANTI SPAM`}
const smsAntiSp2 = () => { return `Larangan Penggunaan Perintah ketika seseorang melakukan beberapa jenis Spam`}
const smsModP1 = () => { return `🌐 MODE PUBLIK`}
const smsModP2 = () => { return `Aktifkan fungsi agar semua orang dapat menggunakan GataBot`}
const smsModAd1 = () => { return `🛂 MODE ADMIN`}
const smsModAd2 = () => { return `Hanya Admin yang dapat menggunakan GataBot di Grup`}
const smsLect1 = () => { return `✅ BACAAN OTOMATIS`}
const smsLect2 = () => { return `Tinggalkan pesan atau obrolan sebagai Dibaca`}
const smsTempo1 = () => { return `🐈 BOT SEMENTARA`}
const smsTempo2 = () => { return `Fungsi yang memungkinkan tinggal sementara di Grup`}
const smsStik1 = () => { return `🎠 STIKER`}
const smsStik2 = () => { return `Aktifkan pengiriman Stiker otomatis ke semua orang`}
const smsStickA1 = () => { return `🪄 STIKER OTOMATIS`}
const smsStickA2 = () => { return `Video, Gif, gambar, jpg atau tautan jpeg; Mereka akan diubah menjadi Stiker Secara Otomatis`}
const smsReacc1 = () => { return `🤡 REAKSI `}
const smsReacc2 = () => { return `Aktifkan pengiriman otomatis Reaksi ke pesan`}
const smsAudi1 = () => { return `🔊 AUDIO`}
const smsAudi2 = () => { return `Aktifkan pengiriman Audio secara otomatis ke semua orang`}
const smsModHor1 = () => { return `🔞 MODE TANDA`}
const smsModHor2 = () => { return `Tampilkan konten Dewasa di Obrolan`}
const smsAntitoc1 = () => { return `☢️ ANTI TOKSIK`}
const smsAntitoc2 = () => { return `Kirim Peringatan orang-orang yang menghina`}
const smsModOb1 = () => { return `👀 MODE PERHATIKAN`}
const smsModOb2 = () => { return `Jadikan Gambar, Gif, dan Video Dapat Dilihat untuk Semua Orang`}
const smsAntiEli1 = () => { return `🗑️ ANTI HAPUS`}
const smsAntiEli2 = () => { return `Semua pesan yang dihapus akan diteruskan ke Obrolan atau Grup`}
const smsAntiInt1 = () => { return `🌏 ANTI INTERNASIONAL`}
const smsAntiInt2 = () => { return `Hilangkan Nomor Internasional yang dianggap palsu`}
const smsAntiE1 = () => { return `🔗 ANTI LINK`}
const smsAntiE2 = () => { return `Hapus Orang yang mengirim tautan dari Grup WhatsApp`}
const smsAntiEE1 = () => { return `🔗 ANTI LINK 2`}
const smsAntiEE2 = () => { return `Hapus Orang yang mengirim tautan yang berisi https`}
const smsAntiTT1 = () => { return `🔗 ANTI TIK TOK`}
const smsAntiTT2 = () => { return `Hapus Orang yang Mengirim Tautan TikTok`}
const smsAntiYT1 = () => { return `🔗 ANTI YOUTUBE`}
const smsAntiYT2 = () => { return `Hapus Orang yang Mengirim Tautan YouTube`}
const smsAntiTEL1 = () => { return `🔗 ANTI TELEGRAM`}
const smsAntiTEL2 = () => { return `Hapus Orang yang Mengirim Tautan Telegram`}
const smsAntiFB1 = () => { return `🔗 ANTI FACEBOOK`}
const smsAntiFB2 = () => { return `Hapus Orang yang Mengirim Tautan Facebook`}
const smsAntiIG1 = () => { return `🔗 ANTI INSTAGRAM`}
const smsAntiIG2 = () => { return `Hapus Orang yang Mengirim Tautan Instagram`}
const smsAntiTW1 = () => { return `🔗 ANTI TWITTER `}
const smsAntiTW2 = () => { return `Hapus Orang yang Mengirim Tautan Twitter`}
const smsSOLOP1 = () => { return `⚜️ HANYA PRIBADI`}
const smsSOLOP2 = () => { return `Izinkan untuk digunakan hanya di Obrolan Pribadi`}
const smsSOLOG1 = () => { return `⚜️ HANYA GRUP`}
const smsSOLOG2 = () => { return `Izinkan untuk hanya digunakan di Obrolan Grup`}
const smsConfi1 = () => { return `PENGATURAN`}
const smsConfi2 = () => { return `*Halo!*`}
const smsConfi3 = () => { return `┃ *Pilih opsi dari daftar*`}
const smsConfi4 = () => { return `┃ *Untuk mulai mengonfigurasi*`}
const smsConfi5 = () => { return `┃● *Pemberitahuan Konfigurasi:*`}
const smsConfi6 = () => { return `┃ ✅ ⇢ *Fungsi Diaktifkan*`}
const smsConfi7 = () => { return `┃ ❌ ⇢ *Fungsi dinonaktifkan*`}
const smsConfi8 = () => { return `┃ ⚠️ ⇢ *Obrolan ini bukan Grup*`}
const smsConfi9 = () => { return `┃ *Rekomendasi: Untuk melihat konfigurasi*\n┃ *Selesaikan gunakan Menu Grup ini*\n┃`}
const smsConfi10 = () => { return `*~ PUSAT KONFIGURASI*`}
const smsParaAdmins = () => { return `UNTUK ADMIN DAN CREATOR: GRUP`}
const smsParaAdYOw = () => { return `UNTUK ADMIN DAN CREATOR : CHATS`}
const smsParaOw = () => { return `UNTUK CREATOR : CHAT`}
const smsNoGg = () => { return ` | ⚠️`}
const smsMens1 = () => { return `MEMERINTAH`} 
const smsMens2 = () => { return `SAAT INI`} 
const smsMens3 = () => { return `DI DALAM`} 
const smsMens4 = () => { return `BOT`} 
const smsMens5 = () => { return `CHAT`} 

//Error2
const smsMensError1 = () => { return `❕ PERINTAH LAPORAN ❕`} 
const smsMensError2 = () => { return `Perintah berikut gagal`} 

//_antiviewonce.js
const smsAntiView = () => { return `*TIDAK ADA YANG BISA DISEMBUNYIKAN* 😎`} 

//_autolevelup.js
const smsAutoLv1 = () => { return `🎖️ TINGKAT BARU 🎖️`} 
const smsAutoLv2 = () => { return `TINGKAT SEBELUMNYA:`} 
const smsAutoLv3 = () => { return `LEVEL SAAT INI:`} 
const smsAutoLv4 = () => { return `JANGKAUAN:`} 
const smsAutoLv5 = () => { return `TANGGAL:`} 
const smsAutoLv6 = () => { return `Anda telah mencapai level baru!!!`} 
const smsAutoLv7 = () => { return `🥳 HADIAH UNTUK TINGKAT BARU ANDA`} 

//_autosticker.js
const smsAutoStik = () => { return `${lenguajeGB['smsAvisoFG']()}*VIDEO TIDAK HARUS BERAKHIR LEBIH DARI 7 DETIK.*`} 

//_expired.js
const smsBottem1 = () => { return `*KELUAR DARI GRUP!!! 🤝 JIKA ANDA INGIN KEMBALI, GUNAKAN PERINTAH _#bottemporal_ UNTUK KEMBALI KE GRUP!!*`} 
const smsBottem2 = () => { return `*💕 BANTUAN PENGGUNA*\n*_${global.ig}_*\n`} 
const smsBottem3 = () => { return `SAMPAI BERJUMPA LAGI 💖`} 

//_premium.js
const smsPremI = () => { return `*¡WAKTU PREMIUM ANDA HABIS!* 🎟️\n*UNTUK MENDAPATKAN PREMIUM PASS BARU GUNAKAN PERINTAH:*\n*#pass prem*`} 

//afk-_afk.js
const smsAfkM1 = () => { return `${lenguajeGB['smsAvisoEG']()}*ANDA BERHENTI MENJADI IDLE AFK*`} 
const smsAfkM2 = () => { return `*ALASAN TIDAK AKTIF ADALAH:*`} 
const smsAfkM3 = () => { return `*WAKTU TIDAK AKTIF:*`} 
const smsAfkM4 = () => { return `${lenguajeGB['smsAvisoAG']()}*JANGAN TAG PENGGUNA INI!! TIDAK AKTIF*`} 
const smsAfkM5 = () => { return `*ALASAN TIDAK AKTIF AFK:*`} 
const smsAfkM6 = () => { return `*ALASAN TIDAK AKTIF AFK: TIDAK MENYEBUTKAN ALASAN TIDAK AKTIF*`} 

//afk-afk.js
const smsAfkM1A = () => { return `${lenguajeGB['smsAvisoAG']()}*JANGAN TAG*`} 
const smsAfkM1B = () => { return `*AKAN AFK TIDAK AKTIF*\n\n*ALASAN TIDAK AKTIF AFK*`} 

//anonymous_chat.js
const smsChatAn1 = () => { return `${lenguajeGB['smsAvisoFG']()}*ANDA TIDAK DALAM CHAT ANONIM*`} 
const smsChatAn2 = () => { return `*JIKA ANDA INGIN MEMULAI CHAT ANONIM GUNAKAN PERINTAH #start ATAU GUNAKAN TOMBOL DI BAWAH INI*\n`} 
const smsChatAn3 = () => { return `⚡ MULAI CHAT ANONIM`} 
const smsChatAn4 = () => { return `${lenguajeGB['smsAvisoRG']()}🪐 *ANDA MENINGGALKAN CHAT ANONIM*`} 
const smsChatAn5 = () => { return `${lenguajeGB['smsAvisoAG']()}*PENGGUNA LAIN MENINGGALKAN CHAT ANONIM*`}  
const smsChatAn6 = () => { return `*JIKA INGIN KE CHAT ANONIM LAIN GUNAKAN PERINTAH #start ATAU GUNAKAN TOMBOL DI BAWAH INI*\n`} 
const smsChatAn7 = () => { return `${lenguajeGB['smsAvisoAG']()}*ANDA MASIH DALAM CHAT ANONIM ATAU MENUNGGU SESEORANG UNTUK BERGABUNG KE CHAT*`} 
const smsChatAn8 = () => { return `*JIKA INGIN KELUAR DARI CHAT ANONIM GUNAKAN PERINTAH #leave ATAU BISA MENGGUNAKAN TOMBOL DI BAWAH INI*\n`} 
const smsChatAn9 = () => { return `🍁 KELUAR DARI CHAT ANONIM`} 
const smsChatAn10 = () => { return `${lenguajeGB['smsAvisoEG']()}✨ *MEREKA BISA CHAT SEKARANG*`} 
const smsChatAn11 = () => { return `*SESEORANG BERGABUNG DENGAN CHAT ANONIM!!*`} 
const smsChatAn12 = () => { return `❇️ PENGGUNA LAIN`} 
const smsChatAn13 = () => { return `${lenguajeGB['smsAvisoRG']()}🐈 *MENUNGGU SESEORANG UNTUK BERGABUNG DENGAN CHAT ANONIM, HARAP SABAR*`} 

//Tombol Menu
const smsBotonM1 = () => { return `⚡ MULAI MENU ⚡`} 
const smsBotonM2 = () => { return `💫 MENU LENGKAP 💫`} 
const smsBotonM3 = () => { return `🎒 INVENTARIS 🎒`} 
const smsBotonM4 = () => { return `PENGGUNA`}
const smsBotonM5 = () => { return `JANGKAUAN`}
const smsBotonM6 = () => { return `TINGKAT`}
const smsBotonM7 = () => { return `PREMIUM`}
const smsTex1 = () => { return '*MENU CARI*'}
const smsTex2 = () => { return '*PENGUBAH AUDIO*'}
const smsTex3 = () => { return '*TIDAK BISA +18*'}
const smsTex4 = () => { return '*KONTEN DINAMIS*'}
const smsTex5 = () => { return '*CARI DAN UNDUH*'}
const smsTex6 = () => { return '*MENU +18 PREMIUM*'}
const smsTex7 = () => { return '⠇ *Gambar +18 kualitas dan variasi*\n⠇ *Video +18 hanya untuk Anda*\n⠇ *Stiker +18 tersedia*'}
const smsTex8 = () => { return '*MENU KONVERTER*'}
const smsTex9 = () => { return '*DOWNLOAD MENU*'}
const smsTex10 = () => { return '*MENU GAME DINAMIS*'}
const smsTex11 = () => { return '*MENU UNTUK KELOMPOK*'}
const smsTex12 = () => { return '*MENU ALAT*'}
const smsTex13 = () => { return '*MENU INFORMASI*'}
const smsTex14 = () => { return '*MENU EFEK DAN LOGOS*'}
const smsTex15 = () => { return '*MENU LOGO 2*'}
const smsTex16 = () => { return 'MENU AUDIO'}
const smsTex17 = () => { return '*TIDAK PERLU MENGGUNAKAN PREFIX DALAM AUDIO*'}
const smsTex18 = () => { return 'DAFTAR SUARA'}
const smsTex19 = () => { return '*ANDA DAPAT MEMILIH AUDIO!!*'}
const smsTex20 = () => { return '*OWNER MENU*'}
const smsTex21 = () => { return '*MENU RPG*'}
const smsTex22 = () => { return '*MENU STIKER DAN FILTER*'}
const smsTex23 = () => { return '*MEME ACAK DAN MENU ANIME*'}

//ad
const smsMalused = () => { return '⚡ *GUNAKAN PERINTAH SEPERTI INI:*\n'}
const smsMalused2 = () => { return `${lenguajeGB['smsAvisoMG']()}🐈 *ANDA HARUS MENGGUNAKAN PERINTAH SEPERTI CONTOH INI:*\n`}
const smsMalused3 = () => { return `${lenguajeGB['smsAvisoMG']()}🐈 *ANDA HARUS MENGGUNAKAN PERINTAH ATAU MERESPON PESAN SESEORANG SEPERTI CONTOH INI:*\n`}

//gc-config_time.js
const smsGrupoTime1 = () => { return '🔓 *_GROUP TERBUKA DALAM SATU JAM_*'}
const smsGrupoTime2 = () => { return '🔒 *_TUTUP GRUP DALAM SATU JAM_*'}
const smsGrupoTime3 = () => { return '*KELOMPOK'}
const smsGrupoTime4 = () => { return 'TERTUTUP'}
const smsGrupoTime5 = () => { return 'MEMBUKA'}
const smsGrupoTime6 = () => { return '*SELAMA'}
const smsGrupoTime7 = () => { return '🔒 *GRUP DITUTUP, HANYA ADMIN YANG BISA KIRIM PESAN*'}
const smsGrupoTime8 = () => { return '🔓 *GROUP TERBUKA, SEMUA BISA KIRIM PESAN*'}
const smsGrupoTime9 = () => { return '🔓 GRUP TERBUKA SELAMA '}
const smsGrupoTime10 = () => { return '🔒 TUTUP GRUP SELAMA '}
const smsGrupoTime11 = () => { return ' JAM'}
const smsGrupoTime12 = () => { return 'IZINKAN KELOMPOK TELAH DIKUNJUNGI '}
const smsGrupoTime13 = () => { return 'IZINKAN GROUP UNTUK DITUTUP '}

//grupo-add.js
const smsAddB1 = () => { return `${lenguajeGB['smsAvisoFG']()}*TIDAK BISA MENAMBAH NOMOR, HARAP VERIFIKASI BENAR, MUNGKIN BARU KELUAR ATAU PRIVASI ANDA SUDAH DITETAPKAN.*`}
const smsAddB2 = () => { return `${lenguajeGB['smsAvisoFG']()}*TIDAK DAPAT MENAMBAHKAN NOMOR, MEMVERIFIKASI BENAR, ATAU MENAMBAHKANNYA SECARA MANUAL.*`}

//grupo-admins.js
const smsAddB3 = () => { return `*PEMBERITAHUAN UNTUK ADMIN*`}
const smsAddB4 = () => { return `*KEHADIRAN ADMIN*`}
const smsAddB5 = () => { return `*PESAN:*`}
const smsAddB6 = () => { return `Saya mohon kepada admin.`}

//grupo-advertencia.js
const smsAdveu1 = () => { return `${lenguajeGB['smsAvisoAG']()}*HANYA DAPAT DIGUNAKAN JIKA FUNGSI DIAKTIFKAN:*\n`}
const smsAdveu2 = () => { return 'Alasan'}
const smsAdveu3 = () => { return `${lenguajeGB['smsAvisoMG']()}*INGAT UNTUK MENULIS ALASAN UNTUK PERINGATAN*\n`}
const smsAdveu4 = () => { return '*MENERIMA PERINGATAN DI GRUP INI!!*'}
const smsAdveu5 = () => { return 'PERINGATAN'}
const smsAdveu6 = () => { return '🎒 INVENTARIS'}
const smsAdveu7 = () => { return '*SAYA PERINGATKAN ANDA BEBERAPA KALI!!*'}
const smsAdveu8 = () => { return '*SEKARANG ANDA AKAN DIHAPUS* 🙄'}
const smsAdveu9 = () => { return '😇 TERIMA KASIH'}
const smsAdveu10 = () => { return '*PERINGATAN DIHAPUS DI GRUP INI!!*'}
const smsAdveu11 = () => { return 'Sebelum:'}
const smsAdveu12 = () => { return 'Sekarang:'}

//grupo-demote.js || grupo-promote.js 
const smsDemott = () => { return `*NOMORNYA INVALID, COBA LAGI BALAS PESAN ORANG ATAU GUNAKAN CONTOH SEPERTI INI:*\n`}
const smsDemott2 = () => { return '*SEKARANG MEMILIKI KEKUATAN DI GRUP!!*'}
const smsDemott3 = () => { return '*TIDAK LAGI MEMILIKI KEKUATAN DI GRUP!!*'}

//grupo-info.js
const smsGI1 = () => { return '*INFORMASI KELOMPOK*'}
const smsGI2 = () => { return '*ID GRUP*'}
const smsGI3 = () => { return '*NAMA GRUP*'}
const smsGI4 = () => { return '*DESKRIPSI KELOMPOK*'}
const smsGI5 = () => { return '*TIDAK ADA DESKRIPSI*'}
const smsGI6 = () => { return '*JUMLAH PENGGUNA*'}
const smsGI7 = () => { return '*Pengguna*'}
const smsGI8 = () => { return '*PENCIPTA GRUP*'}
const smsGI9 = () => { return '*ADMIN GRUP*'}
const smsGI10 = () => { return '⚙️ PENGATURAN GRUP'}


//grupo-kick.js
const smskick1 = () => { return `${lenguajeGB['smsAvisoAG']()}*TAG ORANG ATAU BALAS PESAN ORANG YANG INGIN ANDA HAPUS*\n\n*CONTOH: `}
const smskick2 = () => { return `DIHAPUS 😼🫵`}
const smskick3 = () => { return `SAYA TIDAK BISA MENGHAPUS PENCIPTA GRUP 😆🫵`}
const smskick4 = () => { return `TIDAK DI GRUP INI 👻`}

//grupo-tagall.js
const smstagaa = () => { return `⚡ MEMANGGIL GRUP ⚡`}

//grupo-setbye.js
const smsSetB = () => { return `${lenguajeGB['smsAvisoEG']()}*PERPISAHAN GRUP TELAH DIKONFIGURASI*`}
const smsSetB2 = () => { return `${lenguajeGB['smsAvisoIIG']()}🙌 *_TULIS PESAN PERPISAHAN_*\n*_OPSIONAL, ANDA DAPAT MENGGUNAKAN APA DENGAN "@" UNTUK MENAMBAHKAN INFORMASI LEBIH LANJUT:_*\n\n*⚡ @user (Sebutkan kepada pengguna)*\n\n*INGAT BAHWA "@" ITU OPSIONAL*`}

//grupo-setwelcome.js
const smsSetW = () => { return `${lenguajeGB['smsAvisoEG']()}*SAMBUTAN GRUP TELAH DIATUR*`}
const smsSetW2 = () => { return `${lenguajeGB['smsAvisoIIG']()}🙌 *_TULIS PESAN SELAMAT DATANG_*\n*_OPSIONAL, ANDA DAPAT MENGGUNAKAN APA DENGAN "@" UNTUK MENAMBAHKAN INFORMASI LEBIH LANJUT:_*\n\n*⚡ @user (Sebutkan kepada pengguna)*\n*⚡ @subject (Nama grup)*\n*⚡ @desc (Deskripsi grup)*\n\n*INGAT BAHWA "@" ADALAH OPSIONAL*`}

//grupo-setdesc.js
const smsDest = () => { return `${lenguajeGB['smsAvisoEG']()}*DESKRIPSI GRUP TELAH DIKONFIGURASI*`}

//grupo-setname.js
const smsNam1 = () => { return `${lenguajeGB['smsAvisoEG']()}*NAMA GRUP TELAH DITETAPKAN*`}
const smsNam2 = () => { return `${lenguajeGB['smsAvisoMG']()}*🙌 TULIS NAMA GRUP BARU*`}
const smsNam3 = () => { return `${lenguajeGB['smsAvisoFG']()}*NAMA GRUP TIDAK BOLEH MEMILIKI LEBIH DARI 25 KARAKTER*`}

//grupo-restaurarEnlace.js
const smsRestGp = () => { return `${lenguajeGB['smsAvisoEG']()}*TAUTAN GROUP TELAH DIRESET*`}


export default { lenguaje, smsAvisoRG, smsAvisoAG, smsAvisoIIG, smsAvisoFG, smsAvisoMG, smsAvisoEEG, smsAvisoEG, smsRowner, smsOwner, smsMods, smsPremium, smsGroup, smsPrivate, smsAdmin, smsBotAdmin, smsUnreg, smsRestrict, smsTime, smsUptime, smsVersion, smsTotalUsers, smsMode, smsModePublic, smsModePrivate, smsBanChats, smsBanUsers, smsPareja, smsResultPareja, smsSaludo, smsDia, smsTarde, smsTarde2, smsNoche, smsListaMenu, smsLista1, smsLista2, smsLista3, smsLista4, smsLista5, smsLista6, smsLista7, smsLista8, smsLista9, smsLista10, smsLista11, smsLista12, smsLista13, smsLista14, smsLista15, smsLista16, smsLista17, smsLista18, smsLista19, smsLista20, smsLista21, smsLista22, smsLista23, smsLista24, smsLista25, smsLista26, smsLista27, smsLista28, smsLista29, smsLista30, smsLista31, smsLista32, smsLista33, smsLista34, smsLista35, smsWelcome, smsBye, smsSpromote, smsSdemote, smsSdesc, smsSsubject, smsSicon, smsSrevoke, smsConexion, smsClearTmp, smsCargando, smsTextoYT, smsApagar, smsEncender, smsEnlaceTik, smsEnlaceYt, smsEnlaceTel, smsEnlaceFb, smsEnlaceIg, smsEnlaceTw, smsAllAdmin, smsSoloOwner, smsCont1, smsCont2, smsCont3, smsCont4, smsCont5, smsCont6, smsCont7, smsCont8, smsCont9, smsCont10, smsCont11, smsCont12, smsCont13, smsCont14, smsCont15, smsCont16, smsCont17, smsCont18, smsCont19, smsCont20, smsCont21, smsInt1, smsInt2, smsAdwa, smsEnlaceWat, smsEnlaceWatt, smsNoSpam, smsNoSpam2, smsConMenu, smsMalError, smsMalError2, smsMalError3, smsToxic1, smsToxic2, smsToxic3, smsToxic4, smsToxic5, smsToxic6, smsToxic7, eExp, eDiamante, eDiamantePlus, eToken, eEsmeralda, eJoya, eMagia, eOro, eGataCoins, eGataTickers, eEnergia, ePocion, eAgua, eBasura, eMadera, eRoca, ePiedra, eCuerda, eHierro, eCarbon, eBotella, eLata, eCarton, eEletric, eBarraOro, eOroComun, eZorroG, eBasuraG, eLoboG, eMaderaG, eEspada, eCarnada, eBillete, ePinata, eGancho, eCanaPescar, eCComun, ePComun, eCMistica, eCMascota, eCJardineria, eClegendaria, eUva, eManzana, eNaranja, eMango, ePlatano, eSUva, eSManzana, eSNaranja, eSMango, eSPlatano, eCentauro, eAve, eGato, eDragon, eZorro, eCaballo, eFenix, eLobo, ePerro, eAMascots, eCCentauro, eCAve, eCMagica, eCDragon, eACaballo, eCFenix, smsWel1, smsWel2, smsParaAdmins, smsDete1, smsDete2, smsANivel1, smsANivel2, smsParaAdYOw, smsParaOw, smsRestri1, smsRestri2, smsLlamar1, smsLlamar2, smsModP1, smsModP2, smsModAd1, smsModAd2, smsLect1, smsLect2, smsTempo1, smsTempo2, smsStik1, smsStik2, smsStickA1, smsStickA2, smsReacc1, smsReacc2, smsAudi1, smsAudi2, smsModHor1, smsModHor2, smsAntitoc1, smsAntitoc2, smsModOb1, smsModOb2,
smsAntiEli1, smsAntiEli2, smsAntiInt1, smsAntiInt2, smsAntiE1, smsAntiE2, smsAntiEE1, smsAntiEE2, smsAntiTT1, smsAntiTT2, smsAntiYT1, smsAntiYT2, smsAntiTEL1, smsAntiTEL2, smsAntiFB1, smsAntiFB2, smsAntiIG1, smsAntiIG2, smsAntiTW1, smsAntiTW2, smsSOLOP1, smsSOLOP2, smsSOLOG1, smsSOLOG2, smsNoGg, smsConfi1, smsConfi2, smsConfi3, smsConfi4, smsConfi5, smsConfi6, smsConfi7, smsConfi8, smsConfi9, smsConfi10, smsMens1, smsMens2, smsMens3, smsMens4, smsMens5, smsMensError1, smsMensError2, smsAntiView, smsAutoLv1, smsAutoLv2, smsAutoLv3, smsAutoLv4, smsAutoLv5, smsAutoLv6, smsAutoLv7, smsAntiSp1, smsAntiSp2, smsAutoStik, smsBottem1, smsBottem2, smsBottem3, smsPremI,
smsAfkM1, smsAfkM2, smsAfkM3, smsAfkM4, smsAfkM5, smsAfkM6, smsAfkM1A, smsAfkM1B, smsChatAn1, smsChatAn2, smsChatAn3, smsChatAn4, smsChatAn5, smsChatAn6, smsChatAn7, smsChatAn8, smsChatAn9, smsChatAn10, smsChatAn11, smsChatAn12, smsChatAn13, smsBotonM1, smsBotonM2, smsBotonM3, smsBotonM4, smsBotonM5, smsBotonM6, smsBotonM7, smsTex1, smsTex2, smsTex3, smsTex4, smsTex5, smsTex6, smsTex7, smsTex8, smsTex9, smsTex10, smsTex11, smsTex12, smsTex13, smsTex14, smsTex15, smsTex16, smsTex17, smsTex18, smsTex19, smsTex20, smsTex21, smsTex22, smsTex23, smsMalused, smsGrupoTime1, smsGrupoTime2, smsGrupoTime3, smsGrupoTime4, smsGrupoTime5, smsGrupoTime6, smsGrupoTime7, smsGrupoTime8, smsGrupoTime9, smsGrupoTime10, smsGrupoTime11, smsGrupoTime12, smsGrupoTime13, smsAddB1, smsAddB2, smsAddB3, smsAddB4, smsAddB5, smsAddB6, smsAdveu1, smsMalused2, smsAdveu2, smsAdveu3, smsAdveu4, smsAdveu5, smsAdveu6, smsAdveu7, smsAdveu8, smsAdveu9, smsMalused3, smsAdveu10, smsAdveu11, smsAdveu12, smsDemott, smsDemott2, smsDemott3,
smsGI1, smsGI2, smsGI3, smsGI4, smsGI5, smsGI6, smsGI7, smsGI8, smsGI9, smsGI10, smsLista22_1, smsCodigoQR, smsConexionOFF, smskick1, smskick2, smskick3, smskick4, smstagaa,
smsSetB, smsSetB2, smsSetW, smsSetW2, smsDest, smsNam1, smsNam2, smsNam3, smsRestGp};
