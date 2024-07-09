const lenguaje = () => { return 'ar' } //عرب

//إشعارات الرسائل
const smsAvisoRG = () => { return `╰⊱✅⊱ *نتيجة* ⊱✅⊱╮\n\n` }
const smsAvisoAG = () => { return `╰⊱⚠️⊱ *تنبيه قضائي* ⊱⚠️⊱╮\n\n` }
const smsAvisoIIG = () => { return `╰⊱❕⊱ *معلومة* ⊱❕⊱╮\n\n` }
const smsAvisoFG = () => { return `╰⊱❌⊱ *خطأ* ⊱❌⊱╮\n\n` }
const smsAvisoMG = () => { return `╰⊱❗️⊱ *عمل سيء* ⊱❗️⊱╮\n\n` }
const smsAvisoEEG = () => { return `╰⊱📩⊱ *أبلغ عن* ⊱📩⊱╮\n\n` }
const smsAvisoEG = () => { return `╰⊱💚⊱ *النجاح* ⊱💚⊱╮\n\n` }

//المعلمات في الأوامر
const smsRowner = () => { return `\`\`\`¡¡هذا الأمر أنا فقط بصفتي صانع الروبوت يمكنه استخدامه!!\`\`\`` }
const smsOwner = () => { return `\`\`\`¡¡هذا الأمر فقط منشئ المحتوى الخاص بي يمكنه استخدامه!!\`\`\`` }
const smsMods = () => { return `\`\`\`¡¡هذا الأمر فقط للمنسقين ومنشئ المحتوى الخاص بي يمكنهم استخدامه!!\`\`\`` }
const smsPremium = () => { return `\`\`\`¡¡يتوفر هذا الأمر فقط للمستخدمين المتميزين ومنشئ المحتوى الخاص بي!! للحصول على قسط شراء تذكرة باستخدام #pass premium\`\`\`` }
const smsGroup = () => { return `\`\`\`¡¡لا يمكن استخدام هذا الأمر إلا في مجموعات!!\`\`\`` }
const smsPrivate = () => { return `\`\`\`¡¡لا يمكن استخدام هذا الأمر إلا في الخاص!!\`\`\`` }
const smsAdmin = () => { return `\`\`\`¡¡هذا الأمر مخصص فقط للمشرفين!!\`\`\`` }
const smsBotAdmin = () => { return `\`\`\`¡¡أنا بحاجة إلى أن أكون مشرفًا حتى تتمكن من استخدام هذا الأمر!!\`\`\`` }
const smsUnreg = () => { return `\`\`\`¡¡أنت بحاجة إلى التسجيل لاستخدام هذا الأمر ، نوع #verify للتسجيل!!\`\`\`` }
const smsRestrict = () => { return `\`\`\`¡¡هذا الأمر مقيد من قِبل مطوري!!\`\`\`` }

//قائمة القائمة
const smsTime = () => { return `الوقت الحالي`}
const smsUptime = () => { return `أثناء الجري`}
const smsVersion = () => { return `إصدار ${global.gt}`}
const smsTotalUsers = () => { return `إجمالي المستخدمين`}
const smsMode = () => { return `إنه في الوضع`}
const smsModePublic = () => { return `عام`}
const smsModePrivate = () => { return `خاص`}
const smsBanChats = () => { return `الدردشات المحظورة`}
const smsBanUsers = () => { return `المستخدمون المحظورون`}
const smsPareja = () => { return `شريك`}
const smsResultPareja = () => { return `غير مرتبطة`}
const smsSaludo = () => { return `👋 أهلا! أهلا بك 👋`}
const smsDia = () => { return `🌇 صباح الخير ⛅`}
const smsTarde = () => { return `🏙️ مساء الخير 🌤️`}
const smsTarde2 = () => { return `🌆 مساء الخير 🌥️`}
const smsNoche = () => { return `🌃 طاب مساؤك 💫`}
const smsListaMenu = () => { return `⊹ قائمة القائمة ⊹`}
const smsLista1 = () => { return `🌟 معلومات GATABOT 🌟`}
const smsLista2 = () => { return `💖 المنشئ 💖`}
const smsLista3 = () => { return `🎁 تبرع: الدعم 🎁`}
const smsLista4 = () => { return `🚀 سرعة 🚀`}
const smsLista5 = () => { return `💡 معلومات القائمة 💡`}
const smsLista6 = () => { return `🌀 قائمة كاملة 🌀`}
const smsLista7 = () => { return `🐈 تثبيت GATABOT 🐈`}
const smsLista8 = () => { return `🍄 كن SUB BOT 🍄`}
const smsLista9 = () => { return `📄 الشروط والأحكام والخصوصية 📄`}
const smsLista10 = () => { return `🌟 المغامرة والأعلى 🌟`}
const smsLista11 = () => { return `🏆 قمة العالم 🏆`}
const smsLista12 = () => { return `🏅 المستخدمون المتميزون 🏅`}
const smsLista13 = () => { return `🎟️ كن مستخدمًا متميزًا 🎟️`}
const smsLista14 = () => { return `🛣️ البعثات 🛣️`}
const smsLista15 = () => { return `⚗️ قائمة آر بي جي ⚗️`}
const smsLista16 = () => { return `🏪 شراء شراء 🏪`}
const smsLista17 = () => { return `🎒 المخزون 🎒`}
const smsLista18 = () => { return `🌟 الوسائط المتعددة 🌟`}
const smsLista19 = () => { return `📲 تنزيل القائمة 📲`}
const smsLista20 = () => { return `🔍 قائمة البحث 🔍`}
const smsLista21 = () => { return `🛰️ قائمة المحول 🛰️`}
const smsLista22 = () => { return `🧰 قائمة تعديل الصوت 🧰`}
const smsLista22_1 = () => { return `🔩 قائمة الأدوات 🔩`}
const smsLista23 = () => { return `🌟 مرح 🌟`}
const smsLista24 = () => { return `🎡 الألعاب الديناميكية 🎡`}
const smsLista25 = () => { return `🔊 قائمة الصوت 🔊`}
const smsLista26 = () => { return `🎈 قائمة الملصقات والمرشحات 🎈`}
const smsLista27 = () => { return `✨ قائمة التأثيرات والشعارات ✨`}
const smsLista28 = () => { return `🌅 قائمة الشعارات 2 🌅`}
const smsLista29 = () => { return `⛩️ ذكريات و انمي عشوائية ⛩️`}
const smsLista30 = () => { return `🔞 أوامر للبالغين +18 🔞`}
const smsLista31 = () => { return `🌟 الإعدادات 🌟`}
const smsLista32 = () => { return `🔰 قائمة المجموعات 🔰`}
const smsLista33 = () => { return `📑 أنواع القوائم 📑`}
const smsLista34 = () => { return `⚙️ مركز التكوين ⚙️`}
const smsLista35 = () => { return `💎 قائمة المالك 💎`}

//main.js
const smsWelcome = () => { return `*╭┈⊰* @subject *⊰┈ ✦*\n*┊✨ أهلا بك!!*\n┊💖 @user\n┊📄 *اقرأ وصف المجموعة*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ ✦*\n${String.fromCharCode(8206).repeat(850)}\n@desc`}
const smsBye = () => { return '*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*\n┊ @user\n┊ *غادر المجموعة ، سيعود قريبًا* 😎\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*'}
const smsSpromote = () => { return '*@user أنت الآن مسؤول في هذه المجموعة!!*'}
const smsSdemote = () => { return '*@user لم يعد هناك مشرف في هذه المجموعة!!*'}
const smsSdesc = () => { return '*الوصف الجديد للمجموعة هو:*\n\n@desc'}
const smsSsubject = () => { return '*الاسم الجديد للمجموعة هو:*\n\n@subject'}
const smsSicon = () => { return '*تم تغيير صورة هذه المجموعة!!*'}
const smsSrevoke = () => { return '*الآن هذا هو الرابط الجديد لهذه المجموعة!!*\n\n*@revoke*'}
const smsConexion = () => { return `\n𓃠 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈✦ 🟢 الإتصال ✦┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓃠\n│\n│★ اتصال ناجح مع WhatsApp  😺\n│\n𓃠 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈✦ ✅ ✦┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 𓃠`}
const smsCargando = () => { return `😸 جار التحميل...\n`}
const smsCodigoQR = () => { return `\n✅ تنتهي صلاحية رمز QR في 45 ثانية ✅`}
const smsConexionOFF = () => { return `\n⚠️ لا يوجد اتصال ، احذف المجلد ${global.authFile} وامسح رمز الاستجابة السريعة ⚠️`}
const smsClearTmp = () => { return `\n╭» 🟢 الوسائط المتعددة 🟢\n│→ تم حذف الملفات من مجلد TMP\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️♻️`} 
const smspurgeSession = () => { return `\n╭» 🔵 ${global.authFile} 🔵\n│→ إنهاء الجلسات غير الأساسية\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️♻️`} 
const smspurgeOldFiles = () => { return `\n╭» 🟠 ملفات 🟠\n│→ تم حذف الملفات المتبقية\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️♻️`} 
const smspurgeSessionSB1 = () => { return `\n╭» 🟡 GataJadiBot 🟡\n│→ لا شيء لحذفه \n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️♻️`} 
const smspurgeSessionSB2 = () => { return `\n╭» ⚪ GataJadiBot ⚪\n│→ تم حذف الملفات غير الأساسية\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️♻️`} 
const smspurgeSessionSB3 = () => { return `\n╭» 🔴 GataJadiBot 🔴\n│→ حدث خطأ\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️♻️\n`} 
const smspurgeOldFiles1 = () => { return `\n╭» 🟣 أرشيف 🟣\n│→`} 
const smspurgeOldFiles2 = () => { return `احذفها بنجاح\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️♻️`} 
const smspurgeOldFiles3 = () => { return `\n╭» 🔴 أرشيف 🔴\n│→`} 
const smspurgeOldFiles4 = () => { return `فشل في الحذف\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️❌\n`}
const smsConexioncerrar = () => { return `\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☹\n┆ ⚠️ تم إغلاق الاتصال، جارٍ إعادة الاتصال....\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☹`}
const smsConexionperdida = () => { return `\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☂\n┆ ⚠️ تم فقدان الاتصال بالخادم، جارٍ إعادة الاتصال....\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☂`}
const smsConexionreem = () => { return `\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✗\n┆ ⚠️ تم استبدال الاتصال، وتم فتح جلسة جديدة أخرى، يرجى إغلاق الجلسة الحالية أولاً.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✗`}
const smsConexionreinicio = () => { return `\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✓\n┆ ❇️ جاري التوصيل بالخادم...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✓`}
const smsConexiontiem = () => { return `\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ▸\n┆ ⌛ انتهت مهلة الاتصال، جارٍ إعادة الاتصال....\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ▸`}
const smsConexiondescon = (reason, connection) => { return `\n⚠️❗ سبب قطع الاتصال غير معروف: ${reason || ''} >> ${connection || ''}`}
const smsMainBot = () => { return "تم تحديث 'main.js' بنجاح"}

//_allantilink.js
const smsTextoYT = () => { return '😻 ممتاز GataBot-MD - WhatsApp '}
const smsApagar = () => { return '❌ تعطيل'}
const smsEncender = () => { return '✅ تفعيل'}
const smsEnlaceTik = () => { return `*تم اكتشاف رابط TIKTOK محظور في هذه المجموعة*\n\n*لقد شرعت في حذفك*`}
const smsEnlaceYt = () => { return `*تم اكتشاف رابط YOUTUBE محظور في هذه المجموعة*\n\n*لقد شرعت في حذفك*`}
const smsEnlaceTel = () => { return `*تم اكتشاف رابط TELEGRAM محظور في هذه المجموعة*\n\n*لقد شرعت في حذفك*`}
const smsEnlaceFb = () => { return `*تم اكتشاف رابط FACEBOOK محظور في هذه المجموعة*\n\n*لقد شرعت في حذفك*`}
const smsEnlaceIg = () => { return `*تم اكتشاف رابط INSTAGRAM محظور في هذه المجموعة*\n\n*لقد شرعت في حذفك*`}
const smsEnlaceTw = () => { return `*تم اكتشاف رابط TWITTER محظور في هذه المجموعة*\n\n*لقد شرعت في حذفك*`}
const smsAllAdmin = () => { return `*أحتاج إلى أن أكون مشرفًا لأكون قادرًا على إزالة المتطفلين*`}
const smsSoloOwner = () => { return `*يجب على خالقي تنشيط الوظيفة*\n*#on restrict*`}

//handler.js
const smsCont1 = () => { return `*🔴 فشل الأمر 🔴*`}
const smsCont2 = () => { return `*⚠️ PLUGIN:*`}
const smsCont3 = () => { return `*⚠️المستعمل:*`}
const smsCont4 = () => { return `*⚠️ أمر:*`}
const smsCont5 = () => { return `*⚠️ خطأ:*`}
const smsCont6 = () => { return `*❗ أبلغ عن هذه الرسالة باستخدام الأمر #reporte من أجل حلها*`}
const smsCont7 = () => { return `${global.lenguajeGB['smsAvisoAG']()}*ليس لديها ماسات!! 💎 يمكنك الذهاب إلى المتجر باستخدام الأمر*`}
const smsCont8 = () => { return ` *الماس 💎 تستخدم*`}
const smsCont9 = () => { return `${global.lenguajeGB['smsAvisoAG']()}*بحاجة إلى المستوى ➡️*`}
const smsCont10 = () => { return `*لاستخدام هذا الأمر. المستوى الحالي الخاص بك هو ➡️*`}
const smsCont11 = () => { return `*التحديث باستخدام الأمر*`}
const smsCont12 = () => { return `مجموعة كبيرة!! 😼`}
const smsCont13 = () => { return `انضم شخص ما!! 🥳`}
const smsCont14 = () => { return `بقي شخص ما!! 🧐`}
const smsCont15 = () => { return `*أهلا*`}
const smsCont16 = () => { return `*مكالمات الفيديو* 📲`}
const smsCont17 = () => { return `*المكالمات* 📞`}
const smsCont18 = () => { return `*غير مصرح لهم بذلك ، لذا سأقوم بمنعك*\n\n*إذا تم الاتصال بك عن طريق حادث ، فاتصل بمنشئ هذا الروبوت*`}
const smsCont19 = () => { return `منع الحذف`}
const smsCont20 = () => { return `*┃✤ اسم:*`}
const smsCont21 = () => { return `*┃✤ إرسال الرسالة المحذوفة ...*`}

//_anti-internacional.js
const smsInt1 = () => { return `*هذا العدد*`}
const smsInt2 = () => { return `*غير مسموح به في هذه المجموعة !!*`}

//_antilink.js
const smsAdwa = () => { return `${global.lenguajeGB['smsAvisoEG']()}*نظرًا لأنك ادمن فق المجموعة لا يمكنني طردك*`}
const smsEnlaceWat = () => { return `${lenguajeGB['smsAvisoAG']()}*تم اكتشاف رابط WHATSAPP محظور في هذه المجموعة*\n\n*لقد شرعت في حذفك*`}

//_antilink2.js
const smsEnlaceWatt = () => { return `${lenguajeGB['smsAvisoAG']()}تم اكتشاف ارتباط محظور يحتوي على HTTPS في هذه المجموعة\n\nلقد شرعت في حذفك`}

//_antispam.js
const smsNoSpam = () => { return `🤨 لا تزعجك ، فلن تكون قادرًا على الاستخدام ${global.packname} إلى عن على ${60000 / 1000 - 59} اللحظة`}

//_antispam_.js
const smsNoSpam2 = () => { return `كان غير محظور بعد ${60000 / 1000 - 59} اللحظة. من فضلك لا تزعج !!`}

//نص
const smsConMenu = () => { return `☘️ MENU`}

//خطأ
const smsMalError = () => { return `${lenguajeGB['smsAvisoFG']()}\`\`\`لقد حدث خطأ غير متوقع.\`\`\``}
const smsMalError2 = () => { return `${lenguajeGB['smsAvisoFG']()}\`\`\`لقد نشأ إزعاج. حاول مرة أخرى.\`\`\``}
const smsMalError3 = () => { return `${lenguajeGB['smsAvisoFG']()}\`\`\`حدث خطأ ما ، أبلغ عن هذا الأمر باستخدام:\`\`\`\n`}

//_antitoxic.js
const smsToxic1 = () => { return `لا !!! 🤬 قل هذه الكلمة`}
const smsToxic2 = () => { return `ممنوع ألا تكون سامة`}
const smsToxic3 = () => { return `*تحذير*\n⚠️`}
const smsToxic4 = () => { return `😭 أنا اسف`}
const smsToxic5 = () => { return `☢️ تعطيل مضاد للسموم`}
const smsToxic6 = () => { return `لقد حذرتك عدة مرات !!`}
const smsToxic7 = () => { return `لقد تجاوزت جميع تحذيرات 4 الآن سيتم التخلص منك 🙄`}

//متجر
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

//info-grupos-lista.js
const smsLisA = () => { return '_*يوجد في هذه المجموعات:*_'}
const smsLisB = () => { return '*⭔ إجمالي المجموعات:*'}
const smsLisC = () => { return '*⋄ تَجَمَّع:*'}
const smsLisD = () => { return '*⋄ ID:*'}
const smsLisE = () => { return '*⋄ مشاركون:*'}

//config-on y off.js
const smsWel1 = () => { return `🎉 أهلا بك`}
const smsWel2 = () => { return `رسالة ترحيب للأعضاء الجدد في المجموعات`}
const smsDete1 = () => { return `🔔 إشعارات`}
const smsDete2 = () => { return `إشعارات الإجراءات داخل المجموعة`}
const smsANivel1 = () => { return `🆙 مستوى ذاتي`}
const smsANivel2 = () => { return `رفع مستوى الجميع تلقائيًا ؛ (يطبق المكافآت على رفع المستوى)`}
const smsRestri1 = () => { return `⛔ لتقييد`}
const smsRestri2 = () => { return `قم بتمكين وظيفة إضافة أو إزالة الأشخاص في المجموعات`}
const smsLlamar1 = () => { return `🚫 المكالمات المضادة`}
const smsLlamar2 = () => { return `حظر الأشخاص الذين يجرون المكالمات`}
const smsAntiSp1 = () => { return `🚯 مكافحة البريد المزعج`}
const smsAntiSp2 = () => { return `حظر استخدام الأوامر عندما يقوم شخص ما بتنفيذ نوع من البريد العشوائي`}
const smsModP1 = () => { return `🌐 الوضع العام`}
const smsModP2 = () => { return `تمكين الوظيفة حتى يتمكن الجميع من استخدام GataBot`}
const smsModAd1 = () => { return `🛂 وضع المشرف`}
const smsModAd2 = () => { return `سيتمكن المسؤولون فقط من استخدام GataBot في المجموعات`}
const smsLect1 = () => { return `✅ القراءة التلقائية`}
const smsLect2 = () => { return `اترك الرسائل أو الدردشات كـ "مقروءة"`}
const smsTempo1 = () => { return `🐈 بوت مؤقت`}
const smsTempo2 = () => { return `وظيفة تسمح بالبقاء المؤقت في المجموعات`}
const smsStik1 = () => { return `🎠 ملصقات`}
const smsStik2 = () => { return `تفعيل الإرسال التلقائي للملصقات للجميع`}
const smsStickA1 = () => { return `🪄 ملصقات تلقائية`}
const smsStickA2 = () => { return `مقاطع فيديو أو صور متحركة أو صور أو روابط jpg أو jpeg ؛ سيتم تحويلها إلى ملصقات تلقائيًا`}
const smsReacc1 = () => { return `🤡 تفاعل `}
const smsReacc2 = () => { return `تمكين الإرسال التلقائي للردود على الرسائل`}
const smsAudi1 = () => { return `🔊 صوتي`}
const smsAudi2 = () => { return `تمكين الإرسال التلقائي للتسجيلات الصوتية للجميع`}
const smsModHor1 = () => { return `🔞 الوضع الساخن`}
const smsModHor2 = () => { return `عرض محتوى للبالغين في الدردشات`}
const smsAntitoc1 = () => { return `☢️ مضاد للسموم`}
const smsAntitoc2 = () => { return `إرسال تحذيرات لأولئك الذين يهينون`}
const smsModOb1 = () => { return `👀 وضع المراقبة`}
const smsModOb2 = () => { return `اجعل الصور والصور المتحركة ومقاطع الفيديو قابلة للعرض للجميع`}
const smsAntiEli1 = () => { return `🗑️ منع الحذف`}
const smsAntiEli2 = () => { return `ستتم إعادة توجيه جميع الرسائل المحذوفة إلى الدردشة أو المجموعة`}
const smsAntiInt1 = () => { return `🌏 مضاد دولي`}
const smsAntiInt2 = () => { return `حذف الأرقام الدولية التي تعتبر وهمية`}
const smsAntiE1 = () => { return `🔗 الروابط المضادة`}
const smsAntiE2 = () => { return `احذف الأشخاص الذين يرسلون روابط من مجموعات WhatsApp`}
const smsAntiEE1 = () => { return `🔗 الروابط المضادة 2`}
const smsAntiEE2 = () => { return `قم بإزالة الأشخاص الذين يرسلون روابط تحتوي على https`}
const smsAntiTT1 = () => { return `🔗 أنتي تيك توك`}
const smsAntiTT2 = () => { return `إزالة الأشخاص الذين يرسلون روابط TikTok`}
const smsAntiYT1 = () => { return `🔗 يوتيوب ممنوع`}
const smsAntiYT2 = () => { return `إزالة الأشخاص الذين يرسلون روابط YouTube`}
const smsAntiTEL1 = () => { return `🔗 أنتي تليغرام`}
const smsAntiTEL2 = () => { return `إزالة الأشخاص الذين يرسلون روابط Telegram`}
const smsAntiFB1 = () => { return `🔗 الفيسبوك محظور`}
const smsAntiFB2 = () => { return `قم بإزالة الأشخاص الذين يرسلون روابط Facebook`}
const smsAntiIG1 = () => { return `🔗 مضاد إنستغرام`}
const smsAntiIG2 = () => { return `قم بإزالة الأشخاص الذين يرسلون روابط Instagram`}
const smsAntiTW1 = () => { return `🔗 مضاد للتويتر `}
const smsAntiTW2 = () => { return `إزالة الأشخاص الذين يرسلون روابط Twitter`}
const smsSOLOP1 = () => { return `⚜️ خاص فقط`}
const smsSOLOP2 = () => { return `السماح باستخدامه فقط في الدردشات الخاصة`}
const smsSOLOG1 = () => { return `⚜️ المجموعات فقط`}
const smsSOLOG2 = () => { return `السماح باستخدامه فقط في الدردشات الجماعية`}
const smsConfi1 = () => { return `الإعدادات`}
const smsConfi2 = () => { return `*مرحبا!*`}
const smsConfi3 = () => { return `┃ *حدد خيارًا من القائمة*`}
const smsConfi4 = () => { return `┃ *للبدء في التكوين*`}
const smsConfi5 = () => { return `┃● *إشعارات التكوين:*`}
const smsConfi6 = () => { return `┃ ✅ ⇢ *تم تفعيل الوظيفة*`}
const smsConfi7 = () => { return `┃ ❌ ⇢ *وظيفة معطلة*`}
const smsConfi8 = () => { return `┃ ⚠️ ⇢ *هذه الدردشة ليست مجموعة*`}
const smsConfi9 = () => { return `┃ *توصية: لمعرفة التكوين*\n┃ *أكمل استخدام قائمة المجموعة هذه*\n┃`}
const smsConfi10 = () => { return `*~ مركز التكوين*`}
const smsParaAdmins = () => { return `للمشرفين والمبدعين: المجموعات`}
const smsParaAdYOw = () => { return `للمشرفين والمبدعين: الدردشات`}
const smsParaOw = () => { return `لمنشئ المحتوى: محادثات`}
const smsNoGg = () => { return ` | ⚠️`}
const smsMens1 = () => { return `تفعيل`} 
const smsMens2 = () => { return `في الوقت الحالي`} 
const smsMens3 = () => { return `في هذا`} 
const smsMens4 = () => { return `بوت`} 
const smsMens5 = () => { return `محادثة`} 

//Error2
const smsMensError1 = () => { return `❕ تقرير الأمر ❕`} 
const smsMensError2 = () => { return `الأمر التالي يفشل`} 

//_antiviewonce.js
const smsAntiView = () => { return `*لا يمكن إخفاء أي شيء* 😎`} 

//_autolevelup.js
const smsAutoLv1 = () => { return `🎖️ مستوى جديد 🎖️`} 
const smsAutoLv2 = () => { return `المستوى السابق:`} 
const smsAutoLv3 = () => { return `المستوى الحالي:`} 
const smsAutoLv4 = () => { return `نطاق:`} 
const smsAutoLv5 = () => { return `تاريخ:`} 
const smsAutoLv6 = () => { return `لقد وصلت إلى مستوى جديد!!!`} 
const smsAutoLv7 = () => { return `🥳 مكافأة لمستواك الجديد`} 

//_autosticker.js
const smsAutoStik = () => { return `${lenguajeGB['smsAvisoFG']()}*يجب ألا يزيد الفيديو عن 7 ثوانٍ.*`} 

//_expired.js
const smsBottem1 = () => { return `*يترك المجموعة!!! 🤝 إذا كنت تريد أن تعود ، استخدم الأمر _#bottemporal_ للرجوع إلى المجموعة!!*`} 
const smsBottem2 = () => { return `*💕 مساعدة المستخدم*\n*_${global.ig}_*\n`} 
const smsBottem3 = () => { return `اراك قريبا 💖`} 

//_premium.js
const smsPremI = () => { return `*¡انتهى وقتك المميز!* 🎟️\n*للحصول على بطاقة بريميوم جديدة ، استخدم الأمر:*\n*#pass prem*`} 

//afk-_afk.js
const smsAfkM1 = () => { return `*لقد توقفت عن كونك غير نشط AFK*`} 
const smsAfkM2 = () => { return `\n*سبب عدم النشاط كان:*\n`} 
const smsAfkM3 = () => { return `⏳ *وقت الخمول:*`} 
const smsAfkM4 = () => { return `*لا تضع علامة على هذا المستخدم!! إنه غير نشط*\n`} 
const smsAfkM5 = () => { return `*سبب عدم نشاط AFK:*\n`} 
const smsAfkM6 = () => { return `*سبب عدم نشاط AFK:\nلم يحدد سبب عدم النشاط*`} 
const smsAfkTime = () => { return [['أيام'], ['ساعات'], ['دقائق'], ['ثواني']] }
const smsAfkResultTime = smsAfkTime()

//afk-afk.js
const smsAfkQ1 = (usedPrefix, command) => { return `${lenguajeGB['smsAvisoMG']()}*اكتب سبب عدم نشاطه (AFK)*\n\n*مثال:*\n*${usedPrefix + command}* انا ذاهب للقيام بالواجب المنزلي`} 
const smsAfkQ2 = () => { return `${lenguajeGB['smsAvisoMG']()}*يجب أن يكون هناك 10 أحرف على الأقل هي السبب*`} 
const smsAfkM1A = () => { return `*لا تضع علامة على*`} 
const smsAfkM1B = () => { return `*سيكون AFK غير نشط*\n\n*سبب عدم نشاط AFK:*`} 

//anonymous_chat.js
const smsChatAn1 = () => { return `${lenguajeGB['smsAvisoFG']()}*أنت لست في دردشة مجهولة*`} 
const smsChatAn2 = () => { return `*إذا كنت تريد بدء محادثة مجهولة ، فاستخدم الأمر #start أو استخدم الزر أدناه*\n`} 
const smsChatAn3 = () => { return `⚡ ابدأ محادثة مجهولة`} 
const smsChatAn4 = () => { return `${lenguajeGB['smsAvisoRG']()}🪐 *لقد تركت الدردشة المجهولة*`} 
const smsChatAn5 = () => { return `${lenguajeGB['smsAvisoAG']()}*ترك المستخدم الآخر الدردشة المجهولة*`}  
const smsChatAn6 = () => { return `*إذا كنت تريد الذهاب إلى دردشة أخرى مجهولة ، فاستخدم الأمر #start أو استخدم الزر أدناه*\n`} 
const smsChatAn7 = () => { return `${lenguajeGB['smsAvisoAG']()}*أنت لا تزال في دردشة مجهولة أو تنتظر أن ينضم شخص ما إلى الدردشة*`} 
const smsChatAn8 = () => { return `*إذا كنت تريد الخروج من الدردشة المجهولة ، فاستخدم الأمر #leave أو يمكنك استخدام الزر أدناه*\n`} 
const smsChatAn9 = () => { return `🍁 الخروج من الدردشة المجهولة`} 
const smsChatAn10 = () => { return `${lenguajeGB['smsAvisoEG']()}✨ *يمكنهم الدردشة الآن*`} 
const smsChatAn11 = () => { return `*شخص ما انضم إلى الدردشة المجهولة!!*`} 
const smsChatAn12 = () => { return `❇️ مستخدم آخر`} 
const smsChatAn13 = () => { return `${lenguajeGB['smsAvisoRG']()}🐈 *في انتظار انضمام شخص ما إلى الدردشة المجهولة ، يرجى التحلي بالصبر*`} 

//بوتونيس دي مينو
const smsBotonM1 = () => { return `⚡ قائمة البدأ ⚡`} 
const smsBotonM2 = () => { return `💫 قائمة كاملة 💫`} 
const smsBotonM3 = () => { return `🎒 المخزون 🎒`} 
const smsBotonM4 = () => { return `المستخدمون`}
const smsBotonM5 = () => { return `نطاق`}
const smsBotonM6 = () => { return `مستوى`}
const smsBotonM7 = () => { return `الممتازة`}
const smsTex1 = () => { return '*قائمة البحث*'}
const smsTex2 = () => { return '*معدل الصوت*'}
const smsTex3 = () => { return '*قائمة +18*'}
const smsTex4 = () => { return '*المحتوى الديناميكي*'}
const smsTex5 = () => { return '*البحث والتحميل*'}
const smsTex6 = () => { return '*القائمة +18 قسط*'}
const smsTex7 = () => { return '⠇ *صور +18 جودة وتنوع*\n⠇ *فيديوهات +18 فقط لأجلك*\n⠇ *ملصقات +18 متاح*'}
const smsTex8 = () => { return '*ومدة أكثر*'}
const smsTex9 = () => { return '*قائمة التنزيلات*'}
const smsTex10 = () => { return '*قائمة الألعاب الديناميكية*'}
const smsTex11 = () => { return '*قائمة المجموعات*'}
const smsTex12 = () => { return '*قائمة الأدوات*'}
const smsTex13 = () => { return '*قائمة المعلومات*'}
const smsTex14 = () => { return '*قائمة التأثيرات والشعارات*'}
const smsTex15 = () => { return '*قائمة الشعارات 2*'}
const smsTex16 = () => { return 'قائمة الصوت'}
const smsTex17 = () => { return '*ليس من الضروري استخدام PREFIX في AUDIOS*'}
const smsTex18 = () => { return 'قائمة الصوت'}
const smsTex19 = () => { return '*يمكنك اختيار الصوت!!*'}
const smsTex20 = () => { return '*قائمة المالك*'}
const smsTex21 = () => { return '*قائمة آر بي جي*'}
const smsTex22 = () => { return '*قائمة الملصقات والمرشحات*'}
const smsTex23 = () => { return '*MEMES العشوائية وقائمة الرسوم المتحركة*'}

//ad
const smsMalused = () => { return '⚡ *استخدم الأمر مثل هذا:*\n'}
const smsMalused2 = () => { return `${lenguajeGB['smsAvisoMG']()}🐈 *يجب عليك استخدام الأمر مثل هذا المثال:*\n`}
const smsMalused3 = () => { return `${lenguajeGB['smsAvisoMG']()}🐈 *يجب عليك استخدام الأمر أو الرد على رسالة شخص ما مثل هذا المثال:*\n`}

//gc-config_time.js
const smsGrupoTime1 = () => { return '🔓 *_مجموعة مفتوحة في ساعة واحدة_*'}
const smsGrupoTime2 = () => { return '🔒 *_إغلاق المجموعة في ساعة واحدة_*'}
const smsGrupoTime3 = () => { return '*مجموعة'}
const smsGrupoTime4 = () => { return 'مغلق'}
const smsGrupoTime5 = () => { return 'افتح'}
const smsGrupoTime6 = () => { return '*أثناء'}
const smsGrupoTime7 = () => { return '🔒 *المجموعة مغلقة ، يمكن للمسؤولين فقط إرسال الرسائل*'}
const smsGrupoTime8 = () => { return '🔓 *المجموعة مفتوحة ، يمكن للجميع إرسال الرسائل*'}
const smsGrupoTime9 = () => { return '🔓 مجموعة مفتوحة أثناء '}
const smsGrupoTime10 = () => { return '🔒 إغلاق المجموعة أثناء '}
const smsGrupoTime11 = () => { return ' ساعة'}
const smsGrupoTime12 = () => { return 'السماح للمجموعة بالحضور '}
const smsGrupoTime13 = () => { return 'السماح للمجموعة بالاغلاق '}

//grupo-add.js
const smsAddB1 = () => { return `${lenguajeGB['smsAvisoFG']()}*لا يمكن إضافة الرقم ، يرجى التحقق من صحته ، أو ربما خرج مؤخرًا أو تم تعيين خصوصيتك.*`}
const smsAddB2 = () => { return `${lenguajeGB['smsAvisoFG']()}*لا يمكن إضافة الرقم أو التحقق من صحته أو إضافته يدويًا.*`}

//grupo-admins.js
const smsAddB3 = () => { return `*إخطار للمسؤولين*`}
const smsAddB4 = () => { return `*حضور المشرف*`}
const smsAddB5 = () => { return `*رسالة:*`}
const smsAddB6 = () => { return `أطلب المدراء من فضلك.`}

//grupo-advertencia.js
const smsAdveu1 = () => { return `${lenguajeGB['smsAvisoAG']()}*يمكن استخدامه فقط في حالة تنشيط الوظيفة:*\n`}
const smsAdveu2 = () => { return 'سبب'}
const smsAdveu3 = () => { return `${lenguajeGB['smsAvisoMG']()}*تذكر أن تكتب سبب التحذير*\n`}
const smsAdveu4 = () => { return '*تلقيت تحذيرًا في هذه المجموعة !!*'}
const smsAdveu5 = () => { return 'تحذير'}
const smsAdveu6 = () => { return '🎒 المخزون'}
const smsAdveu7 = () => { return '*لقد حذرتك عدة مرات !!*'}
const smsAdveu8 = () => { return '*الآن سيتم حذفك* 🙄'}
const smsAdveu9 = () => { return '😇 شكرا لك'}
const smsAdveu10 = () => { return '*تمت إزالة تحذير في هذه المجموعة!!*'}
const smsAdveu11 = () => { return 'قبل:'}
const smsAdveu12 = () => { return 'حاليا:'}

//grupo-demote.js || grupo-promote.js 
const smsDemott = () => { return `*الرقم غير صالح ، حاول مرة أخرى الرد على رسالة شخص ما أو استخدمه مثل هذا المثال:*\n`}
const smsDemott2 = () => { return '*الآن لديه قوة في المجموعة !!*'}
const smsDemott3 = () => { return '*لم يعد لديه قوة في المجموعة!!*'}

//grupo-info.js
const smsGI1 = () => { return '*معلومات المجموعة*'}
const smsGI2 = () => { return '*معرف مجموعة*'}
const smsGI3 = () => { return '*أسم المجموعة*'}
const smsGI4 = () => { return '*وصف المجموعة*'}
const smsGI5 = () => { return '*بدون وصف*'}
const smsGI6 = () => { return '*عدد المستخدمين*'}
const smsGI7 = () => { return '*المستخدمون*'}
const smsGI8 = () => { return '*منشئ المجموعة*'}
const smsGI9 = () => { return '*المشرف مجموعة*'}
const smsGI10 = () => { return '⚙️ إعدادات المجموعة'}

//grupo-kick.js
const smskick1 = () => { return `${lenguajeGB['smsAvisoAG']()}*ضع علامة على الشخص أو رد على رسالة الشخص الذي تريد حذفه*\n\n*مثال: `}
const smskick2 = () => { return `إزالة 😼🫵`}
const smskick3 = () => { return `لا يمكنني حذف منشئ المجموعة 😆🫵`}
const smskick4 = () => { return `ليس في هذه المجموعة 👻`}

//grupo-tagall.js
const smstagaa = () => { return `⚡ اجتماع المجموعة ⚡`}

//grupo-setbye.js
const smsSetB = () => { return `${lenguajeGB['smsAvisoEG']()}*تم تكوين وداع المجموعة*`}
const smsSetB2 = () => { return `${lenguajeGB['smsAvisoIIG']()}🙌 *_اكتب رسالة الوداع_*\n*_اختياري يمكنك استخدام ما هو مع "@" لإضافة المزيد من المعلومات:_*\n\n*⚡ @user (أذكر للمستخدم)*\n\n*تذكر أن علامة "@" هي اختيارية*`}

//grupo-setwelcome.js
const smsSetW = () => { return `${lenguajeGB['smsAvisoEG']()}*تم إعداد ترحيب المجموعة*`}
const smsSetW2 = () => { return `${lenguajeGB['smsAvisoIIG']()}🙌 *_اكتب رسالة الترحيب_*\n*_اختياري يمكنك استخدام ما هو مع "@" لإضافة المزيد من المعلومات:_*\n\n*⚡ @user (أذكر للمستخدم)*\n*⚡ @subject (أسم المجموعة)*\n*⚡ @desc (وصف المجموعة)*\n\n*تذكر أن علامة "@" اختيارية*`}

//grupo-setdesc.js
const smsDest = () => { return `${lenguajeGB['smsAvisoEG']()}*تم تكوين وصف المجموعة*`}

//grupo-setname.js
const smsNam1 = () => { return `${lenguajeGB['smsAvisoEG']()}*تم تعيين اسم المجموعة*`}
const smsNam2 = () => { return `${lenguajeGB['smsAvisoMG']()}*🙌 اكتب اسم المجموعة الجديد*`}
const smsNam3 = () => { return `${lenguajeGB['smsAvisoFG']()}*يجب ألا يحتوي اسم المجموعة على أكثر من 25 حرفًا*`}

//grupo-restaurarEnlace.js
const smsRestGp = () => { return `${lenguajeGB['smsAvisoEG']()}*تمت إعادة تعيين ارتباط المجموعة*`}

//Button 
const smsSig = () => { return `➡️ التالي ➡️`}
const smsSigPrem = () => { return `❤️‍🔥 التالي ❤️‍🔥`}
const smsCont18Porn = () => { return `🔞 *محتويات* 🔞`} //texto
const smsCont18Porn2 = () => { return `🔞 محتويات 🔞`} //texto
const smsCont18PornP = () => { return `🌟 *محتويات ❤️‍🔥 الممتازة* 🌟`} //texto
const smsCont18PornP2 = () => { return `محتويات ❤️‍🔥 الممتازة`} //texto  

//propietario(a).js
const smsJoin = (user) => { return `${packname}\n𝙀𝙎 𝙐𝙉 𝘽𝙊𝙏 𝘿𝙀 𝙒𝙃𝘼𝙏𝙎𝘼𝙋𝙋 𝙌𝙐𝙀 𝙏𝙀 𝘼𝙔𝙐𝘿𝘼𝙍𝘼 𝙍𝙀𝘼𝙇𝙄𝙕𝘼𝙍 𝘿𝙄𝙁𝙀𝙍𝙀𝙉𝙏𝙀𝙎 𝘼𝘾𝙏𝙄𝙑𝙄𝘿𝘼𝘿𝙀𝙎 🪄 𝘼𝙇 𝙋𝙍𝙄𝙑𝘼𝘿𝙊 𝙊 𝙂𝙍𝙐𝙋𝙊 𝙔 𝙏𝘼𝙈𝘽𝙄𝙀𝙉 𝙏𝙀 𝙑𝘼𝙎 𝘼 𝘿𝙄𝙑𝙀𝙍𝙏𝙄𝙍 🎈 𝘾𝙊𝙉 𝙎𝙐𝙎 𝙈𝙐𝙇𝙏𝙄𝙋𝙇𝙀𝙎 𝙁𝙐𝙉𝘾𝙄𝙊𝙉𝙀𝙎, 𝘿𝙄𝙎𝙁𝙍𝙐𝙏𝘼 𝘿𝙀 𝙂𝘼𝙏𝘼𝘽𝙊𝙏!!! 😸\n\n💖 𝙂𝘼𝙏𝘼𝘽𝙊𝙏 𝙁𝙐𝙀 𝙄𝙉𝙑𝙄𝙏𝘼𝘿𝘼 𝙋𝙊𝙍:\n@${user}`}
const smsJoin1 = (usedPrefix, command) => { return lenguajeGB['smsAvisoMG']() + `*INGRESE EL ENLACE DE UN GRUPO*\n*EJEMPLO:*\n*${usedPrefix + command}* ${nna}`}
const smsJoin2 = () => { return lenguajeGB['smsAvisoEG']() + `${packname}\n*SE HA UNIDO AL GRUPO ✅*`}

//propietario(a).js
const smsBCMensaje = (usedPrefix, command) => { return `*الرد على الرسالة أو اكتب الرسالة المستخدمة ${usedPrefix + command}*`}
const smsBCMensaje2 = () => { return `*أرسل رسالة رسمية ، انتظر لحظة...*`}
const smsBCMensaje3 = (totalPri, time) => { return `✅  تم إرسال الرسالة إلى ${totalPri} الدردشات*\n\n*أوقات الشحن الخاصة الإجمالية: ${time}*\n${totalPri >= 3000 ? '\n*لم يتم إرسالهم إلى جميع الدردشات لتجنب التشبع*' : ''}`}

//propietario(a.js
const smsPropban1 = (usedPrefix, command, bot) => { return `${lenguajeGB['smsAvisoMG']()}*ضع علامة على أحد الأشخاص أو رد على رسالة المستخدم أو اكتب الرقم الذي تريد حظره من الأوامر*\n\n*مثال:*\n*${usedPrefix + command} @${bot}*`}
const smsPropban2 = (bot) => { return `${lenguajeGB['smsAvisoFG']()}*@${bot} لا يمكن حظره بهذا الأمر* 😹`}
const smsPropban3 = (ownerNumber) => { return `${lenguajeGB.smsAvisoIIG()}😳 *لا يمكنني منع المالك @${ownerNumber} من ${packname}*`}
const smsPropban4 = (number) => { return `${lenguajeGB.smsAvisoIIG()}*ليس من الضروري الحظر مرة أخرى @${number} نعم إنه موجود بالفعل* 😊`}
const smsPropban5 = () => { return `${lenguajeGB['smsAvisoEG']()}*المستخدم محظور بنجاح* 🙀`}
const smsPropban6 = (number, usr) => { return `${lenguajeGB.smsAvisoAG()}*@${number} أنت محظور من قبل @${usr} لا يمكنك استخدام الأوامر حتى يقوم أحدهم بعكس الحظر* 😿`}
const smsPropban7 = (usedPrefix, command, number) => { return `${lenguajeGB['smsAvisoFG']()}*ظهر خطأ ، ربما يكون المستخدم غير موجود في قاعدة بياناتي ، حاول الكتابة ${usedPrefix + command} ${number}*\n\`\`\`إذا استمر الخطأ في الإبلاغ عن هذا الأمر\`\`\``}

//propietario(a).js
const smsBCbot1 = () => { return `✅ *رسالة:*`}
const smsBCbot2 = () => { return `خاص`}
const smsBCbot3 = () => { return ` تَجَمَّع `}
const smsBCbot4 = () => { return `المجموع`}
const smsBCbot5 = () => { return `إجمالي وقت الشحن:`}
const smsBCbot6 = () => { return `لم يتم إرسالهم إلى جميع الدردشات لتجنب التشبع`}
const smsBCbot7 = () => { return `✅ *الخطاب الرسمي* ✅`}

//propietario(a).js
const smsChatGP1 = () => { return "*أرسل رسالة ، انتظر لحظة...*"}
const smsChatGP2 = (readMS, dia, mes, año, fecha, tiempo) => { return `✅ *الخطاب الرسمي* ✅\n${readMS}\n\`\`\`${dia}, ${mes} ${año}\`\`\`\n\`\`\`${fecha} || ${tiempo}\`\`\`\n\n`}
const smsChatGP3 = (totalGP) => { return `✅ * تم إرسال الرسالة إلى  ${totalGP} المجموعات*`}

//jadibot-serbot.js
const smsIniJadi = () => { return `*⊹ • • • ミ★ ${global.packname} ミ★• • • ⊹*\n\n*ღ إصدار ${global.packname} » _${global.vs}_*\n*ღ نسخة JadiBot » _${global.vsJB}_*\n\n🟢 *_الوظيفة تكون فرعية_* 🟢\n\n*➡️ باستخدام هاتف خلوي أو كمبيوتر شخصي آخر ، امسح رمز الاستجابة السريعة هذا ليصبح روبوتًا فرعيًا*\n\n*1️⃣ انتقل إلى النقاط الثلاث في الزاوية اليمنى العليا*\n*2️⃣ انتقل إلى خيار الأجهزة المقترنة*\n*3️⃣ امسح رمز الاستجابة السريعة هذا لتسجيل الدخول*\n\n📢 *¡تنتهي صلاحية رمز الاستجابة السريعة هذا في 45 ثانية!*`}
const smsIniJadi2 = () => { return `*⊹ • • • ミ★ ${global.packname} ミ★• • • ⊹*

*ღ إصدار ${global.packname} » _${global.vs}_*
ღ نسخة JadiBot » _${global.vsJB}_*

🟢 _وظيفة جديدة لتجعل من نفسك روبوتًا فرعيًا_ 🟢

*➡️ باستخدام هاتف خلوي أو كمبيوتر شخصي آخر ، امسح رمز الاستجابة السريعة هذا ليصبح روبوتًا فرعيًا*\n\n*1️⃣ انتقل إلى النقاط الثلاث في الزاوية اليمنى العليا*\n*2️⃣ انتقل إلى خيار الأجهزة المقترنة*\n*3️⃣ امسح رمز الاستجابة السريعة هذا لتسجيل الدخول*`}
const smsJBConexionClose2 = () => { return `${lenguajeGB['smsAvisoFG']()}🔴 *تم فصل الجهاز*\n\n*سيكون عليك الاتصال مرة أخرى للاستخدام:\n#deletesesion`}
const smsreenvia = () => { return `*🟢 أعد إرسال الأمر...*`}
const smsSoloOwnerJB = () => { return `${lenguajeGB['smsAvisoAG']()}*تم تعطيل هذا الأمر من قبل المالك*`}
const smsJBPrincipal = () => { return `${lenguajeGB['smsAvisoAG']()}🔵 *لكي تكون تابعًا ثانويًا ، انتقل إلى الرقم الرئيسي*\n*ღ أدخل الرابط التالي:*\n`}
const smsJBConexion = () => { return `${lenguajeGB['smsAvisoFG']()}🟡 *تم إغلاق الاتصال بطريقة غير متوقعة ، سنحاول إعادة الاتصال ...*`}
const smsJBConexionClose = () => { return `${lenguajeGB['smsAvisoFG']()}🔴 *تم إغلاق الاتصال ، يجب عليك الاتصال يدويًا باستخدام الأمر #jadibot وإعادة إنشاء رمز الاستجابة السريعة الجديد*`}
const smsJBConexionTrue = () => { return `${lenguajeGB['smsAvisoEG']()}🟢 *اتصال ناجح!!!*`}
const smsJBConexionTrue2 = () => { return `${lenguajeGB['smsAvisoEG']()}🟢 *اتصال ناجح!!! يمكنك الاتصال باستخدام:*`}
const smsJBCargando = () => { return `${lenguajeGB['smsAvisoIIG']()}⚪ *متصل!! يرجى الانتظار يتم تحميل الرسائل ...*\n\n♻️ *الخيارات المتاحة:*\n*» #stop _(ميزة Stop Sub Bot)_*\n*» #deletesesion _(احذف كل آثار Sub Bot)_*\n*» #jadibot _(احصل على رمز QR جديد ليكون Sub Bot)_*`}
const smsJBInfo1 = () => { return `💖 *رابط مفيد*`}
const smsJBInfo2 = () => { return `💖 *الوظيفة مستقرة ، إذا واجهت أي إزعاج ، فاتصل بالبريد: centergatabot@gmail.com*\n💝 *يمكنك تقديم تبرع طوعي عن طريق PayPal: ${global.paypal}*\n\n*شكرا جزيلا على الدعم ${global.packname}*`}

//jadibot-deleteSesion.js
const smsJBDel = () => { return `${lenguajeGB['smsAvisoAG']()}*استخدم هذا الأمر مع الروبوت الرئيسي*`}
const smsJBAdios = () => { return `${lenguajeGB['smsAvisoEG']()}*سأفتقدك ${global.packname} وداعا!! 🥹*`}
const smsJBCerrarS = () => { return `${lenguajeGB['smsAvisoEG']()}*لقد قمت بتسجيل الخروج وحذف جميع المسارات*`}
const smsJBErr = () => { return `*لقد قمت بتسجيل الخروج كبرنامج ثانوي* ♻️`}

//comandos+18-adult.js
const smsContAdult = () => { return `${lenguajeGB['smsAvisoAG']()}*الأوامر 🔞 إنهم معاقون ، إذا كنت منشئ المحتوى الخاص بي #on modohorny*`}

//comandos+18-menu.js
const smsList1 = () => { return `ليس لدي ما يكفي `}
const smsList2 = () => { return `\nانقر هنا للشراء `}
const smsList3 = () => { return `المحتوى المتاح 😸`}
const smsList4 = () => { return `المحتوى غير متوفر 😿\nانقر هنا للشراء `}
const smsList5 = () => { return `*حدد اختيارا*\n*من القائمة لمشاهدة*\n*محتويات* 😋`}
const smsList6 = () => { return `👀 انظر القائمة 👀`}

//descargas-consejos.js
const smsConj = () => { return `🍃 مجلس جديد`}
const smsFras = () => { return `🍃 جملة جديدة`}

//info-contacto.js
const smsContacto1 = () => { return ' أنا ' + packname + ' بوت WhatsApp مخصص للمساعدة في كل ما تطلبه 😎'}
const smsContacto2 = () => { return 'أنا مالك ' + packname + ' إذا كان لديك أي أسئلة يمكنك إخباري بها ✌️'}
const smsContacto3 = () => { return '👑 صاحب'}
const smsContacto4 = () => { return 'جهة اتصال GataBot الرسمية 🐈'}
const smsContacto5 = () => { return '🐣 كيف يمكنني مساعدك؟'}
const smsContacto6 = () => { return 'ليس لدي بريد 🙏'}
const smsContacto7 = () => { return '🌎 عالمي'}
const smsContacto8 = () => { return 'هذا الحساب هو بوت 👀'}


export default { lenguaje, smsConexioncerrar, smsConexionperdida, smsConexionreem, smsConexionreinicio, smsConexiontiem, smsConexiondescon, smsAvisoRG, smsJoin, smsJoin1, smsJoin2, smsPropban1, smsPropban2, smsPropban3, smsPropban4, smsPropban5, smsPropban6, smsPropban7, smsLisA, smsLisB, smsLisC, smsLisD, smsLisE, smsChatGP1, smsChatGP2, smsChatGP3, smsBCMensaje, smsBCMensaje2, smsBCMensaje3, smsAvisoAG, smsAvisoIIG, smsBCbot1, smsBCbot2, smsBCbot3, smsBCbot4, smsBCbot5, smsBCbot6, smsBCbot7, smsAvisoFG, smsAvisoMG, smsAvisoEEG, smsAvisoEG, smsRowner, smsOwner, smsMods, smsPremium, smsGroup, smsPrivate, smsAdmin, smsBotAdmin, smsUnreg, smsRestrict, smsTime, smsUptime, smsVersion, smsTotalUsers, smsMode, smsModePublic, smsModePrivate, smsBanChats, smsBanUsers, smsPareja, smsResultPareja, smsSaludo, smsDia, smsTarde, smsTarde2, smsNoche, smsListaMenu, smsLista1, smsLista2, smsLista3, smsLista4, smsLista5, smsLista6, smsLista7, smsLista8, smsLista9, smsLista10, smsLista11, smsLista12, smsLista13, smsLista14, smsLista15, smsLista16, smsLista17, smsLista18, smsLista19, smsLista20, smsLista21, smsLista22, smsLista23, smsLista24, smsLista25, smsLista26, smsLista27, smsLista28, smsLista29, smsLista30, smsLista31, smsLista32, smsLista33, smsLista34, smsLista35, smsWelcome, smsBye, smsSpromote, smsSdemote, smsSdesc, smsSsubject, smsSicon, smsSrevoke, smsConexion, smsClearTmp, smsCargando, smspurgeSession, smspurgeOldFiles, smspurgeSessionSB1, smspurgeSessionSB2, smspurgeSessionSB3, smspurgeOldFiles1, smspurgeOldFiles2, smspurgeOldFiles3, smspurgeOldFiles4, smsTextoYT, smsApagar, smsEncender, smsEnlaceTik, smsEnlaceYt, smsEnlaceTel, smsEnlaceFb, smsEnlaceIg, smsEnlaceTw, smsAllAdmin, smsSoloOwner, smsCont1, smsCont2, smsCont3, smsCont4, smsCont5, smsCont6, smsCont7, smsCont8, smsCont9, smsCont10, smsCont11, smsCont12, smsCont13, smsCont14, smsCont15, smsCont16, smsCont17, smsCont18, smsCont19, smsCont20, smsCont21, smsInt1, smsInt2, smsAdwa, smsEnlaceWat, smsEnlaceWatt, smsNoSpam, smsNoSpam2, smsConMenu, smsMalError, smsMalError2, smsMalError3, smsToxic1, smsToxic2, smsToxic3, smsToxic4, smsToxic5, smsToxic6, smsToxic7, eExp, eDiamante, eDiamantePlus, eToken, eEsmeralda, eJoya, eMagia, eOro, eGataCoins, eGataTickers, eEnergia, ePocion, eAgua, eBasura, eMadera, eRoca, ePiedra, eCuerda, eHierro, eCarbon, eBotella, eLata, eCarton, eEletric, eBarraOro, eOroComun, eZorroG, eBasuraG, eLoboG, eMaderaG, eEspada, eCarnada, eBillete, ePinata, eGancho, eCanaPescar, eCComun, ePComun, eCMistica, eCMascota, eCJardineria, eClegendaria, eUva, eManzana, eNaranja, eMango, ePlatano, eSUva, eSManzana, eSNaranja, eSMango, eSPlatano, eCentauro, eAve, eGato, eDragon, eZorro, eCaballo, eFenix, eLobo, ePerro, eAMascots, eCCentauro, eCAve, eCMagica, eCDragon, eACaballo, eCFenix, smsWel1, smsWel2, smsParaAdmins, smsDete1, smsDete2, smsANivel1, smsANivel2, smsParaAdYOw, smsParaOw, smsRestri1, smsRestri2, smsLlamar1, smsLlamar2, smsModP1, smsModP2, smsModAd1, smsModAd2, smsLect1, smsLect2, smsTempo1, smsTempo2, smsStik1, smsStik2, smsStickA1, smsStickA2, smsReacc1, smsReacc2, smsAudi1, smsAudi2, smsModHor1, smsModHor2, smsAntitoc1, smsAntitoc2, smsModOb1, smsModOb2,
smsAntiEli1, smsAntiEli2, smsAntiInt1, smsAntiInt2, smsAntiE1, smsAntiE2, smsAntiEE1, smsAntiEE2, smsAntiTT1, smsAntiTT2, smsAntiYT1, smsAntiYT2, smsAntiTEL1, smsAntiTEL2, smsAntiFB1, smsAntiFB2, smsAntiIG1, smsAntiIG2, smsAntiTW1, smsAntiTW2, smsSOLOP1, smsSOLOP2, smsSOLOG1, smsSOLOG2, smsNoGg, smsConfi1, smsConfi2, smsConfi3, smsConfi4, smsConfi5, smsConfi6, smsConfi7, smsConfi8, smsConfi9, smsConfi10, smsMens1, smsMens2, smsMens3, smsMens4, smsMens5, smsMensError1, smsMensError2, smsAntiView, smsAutoLv1, smsAutoLv2, smsAutoLv3, smsAutoLv4, smsAutoLv5, smsAutoLv6, smsAutoLv7, smsAntiSp1, smsAntiSp2, smsAutoStik, smsBottem1, smsBottem2, smsBottem3, smsPremI,
smsAfkM1, smsAfkM2, smsAfkM3, smsAfkM4, smsAfkM5, smsAfkM6, smsAfkM1A, smsAfkM1B, smsChatAn1, smsChatAn2, smsChatAn3, smsChatAn4, smsChatAn5, smsChatAn6, smsChatAn7, smsChatAn8, smsChatAn9, smsChatAn10, smsChatAn11, smsChatAn12, smsChatAn13, smsBotonM1, smsBotonM2, smsBotonM3, smsBotonM4, smsBotonM5, smsBotonM6, smsBotonM7, smsTex1, smsTex2, smsTex3, smsTex4, smsTex5, smsTex6, smsTex7, smsTex8, smsTex9, smsTex10, smsTex11, smsTex12, smsTex13, smsTex14, smsTex15, smsTex16, smsTex17, smsTex18, smsTex19, smsTex20, smsTex21, smsTex22, smsTex23, smsMalused, smsGrupoTime1, smsGrupoTime2, smsGrupoTime3, smsGrupoTime4, smsGrupoTime5, smsGrupoTime6, smsGrupoTime7, smsGrupoTime8, smsGrupoTime9, smsGrupoTime10, smsGrupoTime11, smsGrupoTime12, smsGrupoTime13, smsAddB1, smsAddB2, smsAddB3, smsAddB4, smsAddB5, smsAddB6, smsAdveu1, smsMalused2, smsAdveu2, smsAdveu3, smsAdveu4, smsAdveu5, smsAdveu6, smsAdveu7, smsAdveu8, smsAdveu9, smsMalused3, smsAdveu10, smsAdveu11, smsAdveu12, smsDemott, smsDemott2, smsDemott3,
smsGI1, smsGI2, smsGI3, smsGI4, smsGI5, smsGI6, smsGI7, smsGI8, smsGI9, smsGI10, smsLista22_1, smsCodigoQR, smsConexionOFF, smskick1, smskick2, smskick3, smskick4, smstagaa,
smsSetB, smsSetB2, smsSetW, smsSetW2, smsDest, smsNam1, smsNam2, smsNam3, smsRestGp, smsSig, smsSigPrem, smsCont18Porn, smsCont18Porn2, smsCont18PornP, smsCont18PornP2,
smsIniJadi, smsSoloOwnerJB, smsJBPrincipal, smsJBConexion, smsJBConexionClose, smsJBConexionTrue, smsJBConexionTrue2, smsJBCargando, smsJBInfo1, smsJBInfo2, smsJBDel, smsJBAdios, 
smsJBCerrarS, smsJBErr, smsContAdult, smsList1, smsList2, smsList3, smsList4, smsList5, smsList6, smsConj, smsFras, smsContacto1, smsContacto2, smsContacto3, smsContacto4,
smsContacto5, smsContacto6, smsContacto7, smsContacto8, smsAfkQ1, smsAfkQ2, smsAfkTime, smsAfkResultTime, smsMainBot, smsreenvia, smsJBConexionClose2, smsIniJadi2}
