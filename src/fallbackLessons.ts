export interface Vocabulary {
  spanish: string;
  dynamicLang: string;
  explanation: string;
}

export interface PracticeQuestion {
  type: string;
  question: string;
  options?: string[];
  correctIndex?: number;
  blankWord?: string;
  correctTranslation?: string;
  verb?: string;
  correctAnswer?: string;
}

export interface LessonData {
  title: string;
  explanation: string;
  vocabulary: Vocabulary[];
  practice: PracticeQuestion[];
}

const T: Record<string, Record<string, string>> = {
  ar: { rule: "القواعد:", pitfall: "أخطاء شائعة:", tip: "نصيحة للدراسة في إسبانيا:" },
  fr: { rule: "Règles grammaticales :", pitfall: "Erreurs fréquentes :", tip: "Conseil pour vos études en Espagne :" },
  en: { rule: "Grammar Rules:", pitfall: "Common Mistakes:", tip: "Study Tip for Spain:" }
};

function getLang(lang: string) {
  return lang === "ar" ? "ar" : lang === "fr" ? "fr" : "en";
}

const LESSONS: Record<string, (lang: string) => LessonData> = {

  "Alphabet & Pronunciation": (lang) => ({
    title: "El Alfabeto Español y Pronunciación",
    explanation: `### El Alfabeto Español — 27 letras oficiales

El español es un idioma **fonético**: se pronuncia exactamente como se escribe. Esta es la gran ventaja para los estudiantes árabes y francófonos.

| Letra | Nombre | Pronunciación | Ejemplo |
|:---:|:---|:---|:---|
| A | a | /a/ vocal abierta | **Amor** |
| B | be | /b/ igual que la V | **Banco** |
| C | ce | /θ/ ante E,I — /k/ ante A,O,U | **Casa / Cero** |
| D | de | /d/ dental suave | **Día** |
| E | e | /e/ vocal media | **Estrella** |
| F | efe | /f/ labiodental | **Flor** |
| G | ge | /x/ ante E,I — /g/ ante A,O,U | **Gato / Gente** |
| H | hache | **¡MUDA!** nunca se pronuncia | **Hola** |
| I | i | /i/ vocal cerrada | **Isla** |
| J | jota | /x/ gutural fuerte (como خ árabe) | **Jardín** |
| K | ka | /k/ | **Kilo** |
| L | ele | /l/ lateral | **Libro** |
| M | eme | /m/ bilabial | **Madre** |
| N | ene | /n/ nasal | **Noche** |
| Ñ | eñe | /ɲ/ palatal (como "gn" en francés) | **España** |
| O | o | /o/ vocal posterior | **Ojo** |
| P | pe | /p/ bilabial | **Padre** |
| Q | cu | /k/ siempre con U silenciosa | **Queso** |
| R | ere / erre | /r/ simple o /rr/ vibrante | **Rosa / Perro** |
| S | ese | /s/ alveolar | **Sol** |
| T | te | /t/ dental | **Tren** |
| U | u | /u/ vocal cerrada | **Uva** |
| V | uve | /b/ **igual que la B** | **Vida** |
| W | uve doble | /w/ solo en extranjerismos | **Web** |
| X | equis | /ks/ entre vocales | **Examen** |
| Y | i griega | /y/ palatal o vocal /i/ | **Ya** |
| Z | zeta | /θ/ lengua entre dientes | **Zapato** |

**Claves:**
- **H** = siempre silenciosa. "Hola" = /ola/
- **B y V** = suenan exactamente igual en España
- **LL y Y** = mismo sonido en el español moderno
- **C/Z** = /θ/ en España (como "th" en inglés "think")`,
    vocabulary: [
      { spanish: "el abecedario", dynamicLang: lang === "ar" ? "الأبجدية" : lang === "fr" ? "l'alphabet" : "the alphabet", explanation: "Las 27 letras del español" },
      { spanish: "la vocal", dynamicLang: lang === "ar" ? "الحرف المتحرك" : lang === "fr" ? "la voyelle" : "the vowel", explanation: "A, E, I, O, U — siempre claras" },
      { spanish: "la consonante", dynamicLang: lang === "ar" ? "الحرف الساكن" : lang === "fr" ? "la consonne" : "the consonant", explanation: "Todos los demás sonidos" },
      { spanish: "la pronunciación", dynamicLang: lang === "ar" ? "النطق" : lang === "fr" ? "la prononciation" : "pronunciation", explanation: "Cómo se dice cada letra" },
      { spanish: "la tilde", dynamicLang: lang === "ar" ? "علامة التشديد" : lang === "fr" ? "l'accent" : "the accent mark", explanation: "á, é, í, ó, ú — indica el acento" }
    ],
    practice: [
      { type: "mcq", question: "¿Cuántas letras tiene el alfabeto español?", options: ["25", "26", "27", "28"], correctIndex: 2 },
      { type: "mcq", question: "¿Cómo se pronuncia la letra H en español?", options: ["Como /h/ aspirada", "Como /j/ fuerte", "Es completamente muda", "Como /x/ gutural"], correctIndex: 2 },
      { type: "mcq", question: "¿Qué letra del español NO existe en el francés ni en el inglés?", options: ["B", "Ñ", "C", "V"], correctIndex: 1 },
      { type: "mcq", question: "En España, ¿cómo suena la letra Z?", options: ["/s/ como en 'sol'", "/z/ como en inglés 'zoo'", "/θ/ como en inglés 'think'", "/ts/ como en italiano"], correctIndex: 2 },
      { type: "mcq", question: "¿Qué tienen en común la B y la V en español?", options: ["Son letras diferentes con sonidos diferentes", "Suenan exactamente igual: /b/", "La V es más suave que la B", "Solo se diferencia en escritura formal"], correctIndex: 1 }
    ]
  }),

  "Greetings & Farewells": (lang) => ({
    title: "Saludos y Despedidas en Español",
    explanation: `### Saludos y Despedidas — Contexto Social Español

En España, los saludos son fundamentales. La cultura española valora mucho el contacto social. Los españoles suelen darse **dos besos en las mejillas** al saludarse (excepto en entornos profesionales formales).

#### Saludos según el momento del día:
| Expresión | Uso | Respuesta habitual |
|:---|:---|:---|
| **¡Hola!** | Siempre (informal) | ¡Hola! / ¡Buenas! |
| **Buenos días** | Hasta las 12:00 | Buenos días |
| **Buenas tardes** | 12:00 — 20:00 | Buenas tardes |
| **Buenas noches** | Después de las 20:00 | Buenas noches |
| **¿Qué tal?** | Informal: ¿cómo estás? | Bien, ¿y tú? / Muy bien |
| **¿Cómo estás?** | Informal (tuteo) | Bien, gracias |
| **¿Cómo está usted?** | Formal (respeto) | Muy bien, gracias |

#### Despedidas:
| Expresión | Nivel | Contexto |
|:---|:---|:---|
| **¡Adiós!** | Neutro | Siempre |
| **¡Hasta luego!** | Informal | "Hasta que nos veamos" |
| **¡Hasta mañana!** | Informal | Cuando te verás mañana |
| **¡Hasta pronto!** | Informal | "Nos vemos pronto" |
| **¡Que te vaya bien!** | Amable | Desear buena suerte |
| **¡Buenas noches!** | Formal/informal | Al despedirse de noche |

**Nota cultural:** En España, "¡Buenas!" solas es una forma muy común de saludar a cualquier hora.`,
    vocabulary: [
      { spanish: "¡Hola!", dynamicLang: lang === "ar" ? "مرحبا!" : lang === "fr" ? "Salut!" : "Hi!", explanation: "El saludo más universal en español" },
      { spanish: "Buenos días", dynamicLang: lang === "ar" ? "صباح الخير" : lang === "fr" ? "Bonjour" : "Good morning", explanation: "Se usa hasta el mediodía" },
      { spanish: "Buenas tardes", dynamicLang: lang === "ar" ? "مساء الخير" : lang === "fr" ? "Bon après-midi" : "Good afternoon", explanation: "De 12:00 a 20:00" },
      { spanish: "Buenas noches", dynamicLang: lang === "ar" ? "مساء النور / تصبح على خير" : lang === "fr" ? "Bonsoir / Bonne nuit" : "Good evening / Good night", explanation: "Saludo y despedida nocturna" },
      { spanish: "¿Qué tal?", dynamicLang: lang === "ar" ? "كيف حالك؟" : lang === "fr" ? "Comment ça va?" : "How are you?", explanation: "Informal, muy usado entre amigos" },
      { spanish: "¡Hasta luego!", dynamicLang: lang === "ar" ? "إلى اللقاء!" : lang === "fr" ? "À bientôt!" : "See you later!", explanation: "Despedida informal y frecuente" }
    ],
    practice: [
      { type: "mcq", question: "Son las 9 de la mañana. ¿Qué saludo usas?", options: ["Buenas tardes", "Buenas noches", "Buenos días", "Hasta luego"], correctIndex: 2 },
      { type: "mcq", question: "¿Cómo se dice 'See you tomorrow' en español?", options: ["¡Hasta luego!", "¡Hasta mañana!", "¡Adiós!", "¡Que te vaya bien!"], correctIndex: 1 },
      { type: "mcq", question: "Estás en una reunión formal con tu profesor universitario. ¿Cuál usas?", options: ["¿Qué tal, tío?", "¡Hola, buenas!", "¿Cómo está usted?", "¿Qué pasa?"], correctIndex: 2 },
      { type: "mcq", question: "Un compañero te dice '¿Qué tal?' ¿Cuál es la respuesta más natural?", options: ["Buenas noches", "Bien, ¿y tú?", "Hasta pronto", "Por favor"], correctIndex: 1 },
      { type: "mcq", question: "¿Cuál de estas es una despedida?", options: ["Buenos días", "¿Cómo estás?", "¡Hasta pronto!", "¿Qué tal?"], correctIndex: 2 }
    ]
  }),

  "Introducing Yourself & Age": (lang) => ({
    title: "Presentarse y Hablar de la Edad",
    explanation: `### Cómo Presentarse en Español

Al llegar a España como estudiante, te presentarás constantemente: en la universidad, en residencias, en oficinas. Dominar estas frases es esencial.

#### Fórmula básica de presentación:
\`\`\`
Me llamo [nombre]. / Mi nombre es [nombre].
Soy de [país/ciudad].
Tengo [número] años.
Estudio [carrera] en [universidad].
\`\`\`

#### Verbos clave:
| Verbo | Yo | Tú | Él/Ella |
|:---|:---|:---|:---|
| **llamarse** (to be called) | me llamo | te llamas | se llama |
| **ser** (to be) | soy | eres | es |
| **tener** (to have/age) | tengo | tienes | tiene |
| **vivir** (to live) | vivo | vives | vive |
| **estudiar** (to study) | estudio | estudias | estudia |

#### Expresar la edad en español:
⚠️ **Diferencia clave:** En español se usa **TENER** para la edad, no SER.
- ✅ **Tengo 22 años.** (I am 22 years old)
- ❌ ~~Soy 22 años.~~ (INCORRECTO)
- ❌ ~~Estoy 22 años.~~ (INCORRECTO)

#### Preguntas frecuentes:
- **¿Cómo te llamas?** — ¿Cuál es tu nombre?
- **¿De dónde eres?** — ¿Cuál es tu país/ciudad?
- **¿Cuántos años tienes?** — ¿Qué edad tienes?
- **¿A qué te dedicas?** — ¿Qué haces? ¿Trabajas o estudias?`,
    vocabulary: [
      { spanish: "Me llamo...", dynamicLang: lang === "ar" ? "اسمي..." : lang === "fr" ? "Je m'appelle..." : "My name is...", explanation: "La forma más natural de presentarse" },
      { spanish: "Soy de...", dynamicLang: lang === "ar" ? "أنا من..." : lang === "fr" ? "Je suis de..." : "I am from...", explanation: "Para indicar tu origen" },
      { spanish: "Tengo ... años", dynamicLang: lang === "ar" ? "عمري ... سنة" : lang === "fr" ? "J'ai ... ans" : "I am ... years old", explanation: "TENER, no SER, para la edad" },
      { spanish: "Estudio en...", dynamicLang: lang === "ar" ? "أدرس في..." : lang === "fr" ? "J'étudie à..." : "I study at...", explanation: "Para hablar de tu universidad" },
      { spanish: "Encantado/a", dynamicLang: lang === "ar" ? "تشرفت بمعرفتك" : lang === "fr" ? "Enchanté(e)" : "Nice to meet you", explanation: "Al conocer a alguien nuevo" }
    ],
    practice: [
      { type: "mcq", question: "¿Cuál es la forma correcta de decir tu edad?", options: ["Soy 20 años", "Estoy 20 años", "Tengo 20 años", "Hay 20 años"], correctIndex: 2 },
      { type: "mcq", question: "¿Cómo preguntas el nombre de alguien formalmente?", options: ["¿Cómo te llamas?", "¿Cómo se llama usted?", "¿Qué eres?", "¿Cómo estás?"], correctIndex: 1 },
      { type: "mcq", question: "Completa: 'Soy ___ Marruecos'", options: ["a", "de", "en", "por"], correctIndex: 1 },
      { type: "mcq", question: "¿Cuál significa 'Nice to meet you'?", options: ["Hasta luego", "Buenos días", "Encantado", "Perdona"], correctIndex: 2 },
      { type: "mcq", question: "¿Cuál es correcto para 'I study medicine'?", options: ["Estudio medicina", "Soy medicina", "Tengo medicina", "Hablo medicina"], correctIndex: 0 }
    ]
  }),

  "Numbers 1 to 100 & Telling Time": (lang) => ({
    title: "Los Números y la Hora en Español",
    explanation: `### Números del 1 al 100

#### Del 1 al 20 (memorizar):
1-uno, 2-dos, 3-tres, 4-cuatro, 5-cinco, 6-seis, 7-siete, 8-ocho, 9-nueve, 10-diez
11-once, 12-doce, 13-trece, 14-catorce, 15-quince, 16-dieciséis, 17-diecisiete, 18-dieciocho, 19-diecinueve, 20-veinte

#### Del 20 al 100 (reglas):
| Decena | Regla | Ejemplo |
|:---|:---|:---|
| 20 | veinte | — |
| 21-29 | veinti + uno/dos... | veintiuno, veintidós |
| 30 | treinta | treinta y uno (31) |
| 40 | cuarenta | cuarenta y cinco (45) |
| 50 | cincuenta | cincuenta y tres (53) |
| 60 | sesenta | sesenta y ocho (68) |
| 70 | setenta | setenta y dos (72) |
| 80 | ochenta | ochenta y nueve (89) |
| 90 | noventa | noventa y siete (97) |
| 100 | cien | — |

#### La Hora:
| Expresión | Ejemplo |
|:---|:---|
| **¿Qué hora es?** | What time is it? |
| **Son las + hora** | Son las tres (3:00) |
| **Es la una** | Solo para la 1:00 |
| **y cuarto** | + 15 minutos |
| **y media** | + 30 minutos |
| **menos cuarto** | — 15 minutos |

**Ejemplos:**
- 3:15 → Son las tres **y cuarto**
- 3:30 → Son las tres **y media**
- 3:45 → Son las cuatro **menos cuarto**
- 1:00 → **Es la** una`,
    vocabulary: [
      { spanish: "¿Qué hora es?", dynamicLang: lang === "ar" ? "كم الساعة؟" : lang === "fr" ? "Quelle heure est-il?" : "What time is it?", explanation: "Pregunta fundamental para el día a día" },
      { spanish: "Son las...", dynamicLang: lang === "ar" ? "الساعة..." : lang === "fr" ? "Il est..." : "It is...", explanation: "Para todas las horas excepto la 1:00" },
      { spanish: "y media", dynamicLang: lang === "ar" ? "والنصف" : lang === "fr" ? "et demie" : "and a half / thirty", explanation: "Para indicar los 30 minutos" },
      { spanish: "y cuarto", dynamicLang: lang === "ar" ? "والربع" : lang === "fr" ? "et quart" : "quarter past", explanation: "Para indicar los 15 minutos" },
      { spanish: "menos cuarto", dynamicLang: lang === "ar" ? "إلا ربع" : lang === "fr" ? "moins le quart" : "quarter to", explanation: "15 minutos antes de la hora" }
    ],
    practice: [
      { type: "mcq", question: "¿Cómo se dice '45' en español?", options: ["cuarenta y cuatro", "cuarenta y cinco", "cincuenta y cinco", "cuarenta y seis"], correctIndex: 1 },
      { type: "mcq", question: "Son las 3:30. ¿Cómo lo dices?", options: ["Son las tres menos media", "Son las tres y media", "Es la tres y media", "Son las tres y cuarto"], correctIndex: 1 },
      { type: "mcq", question: "¿Cuándo usas 'Es la...' en vez de 'Son las...'?", options: ["Para las 12:00", "Para la 1:00", "Para las 2:00", "Para las 10:00"], correctIndex: 1 },
      { type: "mcq", question: "¿Cómo se dice '100'?", options: ["ciento", "cien", "cientos", "un cien"], correctIndex: 1 },
      { type: "mcq", question: "Son las 4 menos cuarto. ¿Qué hora es?", options: ["4:45", "3:45", "4:15", "3:15"], correctIndex: 1 }
    ]
  }),

  "Family Members & Relationships": (lang) => ({
    title: "La Familia y las Relaciones",
    explanation: `### La Familia en Español

#### Vocabulario familiar esencial:
| Español | ${lang === "ar" ? "العربية" : lang === "fr" ? "Français" : "English"} | Plural |
|:---|:---|:---|
| el padre | ${lang === "ar" ? "الأب" : lang === "fr" ? "le père" : "father"} | los padres |
| la madre | ${lang === "ar" ? "الأم" : lang === "fr" ? "la mère" : "mother"} | las madres |
| el hijo | ${lang === "ar" ? "الابن" : lang === "fr" ? "le fils" : "son"} | los hijos |
| la hija | ${lang === "ar" ? "البنت" : lang === "fr" ? "la fille" : "daughter"} | las hijas |
| el hermano | ${lang === "ar" ? "الأخ" : lang === "fr" ? "le frère" : "brother"} | los hermanos |
| la hermana | ${lang === "ar" ? "الأخت" : lang === "fr" ? "la sœur" : "sister"} | las hermanas |
| el abuelo | ${lang === "ar" ? "الجد" : lang === "fr" ? "le grand-père" : "grandfather"} | los abuelos |
| la abuela | ${lang === "ar" ? "الجدة" : lang === "fr" ? "la grand-mère" : "grandmother"} | las abuelas |
| el tío | ${lang === "ar" ? "العم/الخال" : lang === "fr" ? "l'oncle" : "uncle"} | los tíos |
| la tía | ${lang === "ar" ? "العمة/الخالة" : lang === "fr" ? "la tante" : "aunt"} | las tías |
| el primo | ${lang === "ar" ? "ابن العم/الخال" : lang === "fr" ? "le cousin" : "cousin (m)"} | los primos |
| el marido / esposo | ${lang === "ar" ? "الزوج" : lang === "fr" ? "le mari" : "husband"} | — |
| la mujer / esposa | ${lang === "ar" ? "الزوجة" : lang === "fr" ? "la femme" : "wife"} | — |

#### Nota gramatical importante:
En español, el plural masculino incluye ambos géneros:
- **los padres** = el padre + la madre (padre Y madre)
- **los hermanos** = hermanos + hermanas (todos)
- **los abuelos** = abuelo + abuela`,
    vocabulary: [
      { spanish: "la familia", dynamicLang: lang === "ar" ? "العائلة" : lang === "fr" ? "la famille" : "the family", explanation: "Grupo familiar completo" },
      { spanish: "los padres", dynamicLang: lang === "ar" ? "الوالدان" : lang === "fr" ? "les parents" : "parents", explanation: "Padre + madre juntos" },
      { spanish: "el hermano mayor", dynamicLang: lang === "ar" ? "الأخ الأكبر" : lang === "fr" ? "le frère aîné" : "older brother", explanation: "Mayor = mayor en edad" },
      { spanish: "el hijo único", dynamicLang: lang === "ar" ? "الابن الوحيد" : lang === "fr" ? "l'enfant unique" : "only child", explanation: "Sin hermanos ni hermanas" },
      { spanish: "los suegros", dynamicLang: lang === "ar" ? "الحماة" : lang === "fr" ? "les beaux-parents" : "in-laws", explanation: "Padres del esposo/esposa" }
    ],
    practice: [
      { type: "mcq", question: "¿Cómo se llama el padre de tu madre?", options: ["el tío", "el abuelo", "el suegro", "el primo"], correctIndex: 1 },
      { type: "mcq", question: "'Los hermanos' en español significa:", options: ["Solo los hermanos varones", "Hermanos y hermanas juntos", "Solo las hermanas", "Los primos"], correctIndex: 1 },
      { type: "mcq", question: "¿Cómo se dice 'wife' en español?", options: ["la novia", "la madre", "la esposa", "la hermana"], correctIndex: 2 },
      { type: "mcq", question: "¿Qué es 'el primo'?", options: ["el hermano", "el tío", "el hijo del tío o la tía", "el suegro"], correctIndex: 2 },
      { type: "mcq", question: "'Los abuelos' significa:", options: ["Solo el abuelo", "El abuelo y la abuela", "Los padres", "Los tíos"], correctIndex: 1 }
    ]
  }),

  "Noun Gender & Articles": (lang) => ({
    title: "El Género y los Artículos en Español",
    explanation: `### Género de los Sustantivos y Artículos

En español, **todos los sustantivos tienen género** (masculino o femenino). Este es uno de los aspectos más importantes de la gramática española.

#### Artículos en español:
| | Masculino | Femenino |
|:---|:---:|:---:|
| **Definido singular** | el | la |
| **Definido plural** | los | las |
| **Indefinido singular** | un | una |
| **Indefinido plural** | unos | unas |

#### Reglas para identificar el género:
✅ **Generalmente MASCULINO si termina en:**
- **-o**: el libro, el chico, el año
- **-or**: el color, el profesor, el calor
- **-aje**: el viaje, el garaje, el mensaje

✅ **Generalmente FEMENINO si termina en:**
- **-a**: la casa, la chica, la mesa
- **-ión**: la canción, la nación, la situación
- **-dad/-tad**: la ciudad, la libertad, la universidad
- **-ez**: la vez, la vejez

⚠️ **Excepciones importantes:**
- el día (masculino, termina en -a)
- el mapa (masculino, termina en -a)
- la mano (femenino, termina en -o)
- el problema, el tema, el sistema (masculinos, -ma)

#### Contracción obligatoria:
- **a + el = AL**: Voy **al** supermercado
- **de + el = DEL**: Vengo **del** aeropuerto`,
    vocabulary: [
      { spanish: "el artículo", dynamicLang: lang === "ar" ? "أداة التعريف/التنكير" : lang === "fr" ? "l'article" : "the article", explanation: "el/la/los/las — un/una/unos/unas" },
      { spanish: "masculino", dynamicLang: lang === "ar" ? "مذكر" : lang === "fr" ? "masculin" : "masculine", explanation: "Género: el, un" },
      { spanish: "femenino", dynamicLang: lang === "ar" ? "مؤنث" : lang === "fr" ? "féminin" : "feminine", explanation: "Género: la, una" },
      { spanish: "la universidad", dynamicLang: lang === "ar" ? "الجامعة" : lang === "fr" ? "l'université" : "the university", explanation: "Termina en -dad → femenino" },
      { spanish: "el problema", dynamicLang: lang === "ar" ? "المشكلة" : lang === "fr" ? "le problème" : "the problem", explanation: "Excepción: -ma pero masculino" }
    ],
    practice: [
      { type: "mcq", question: "¿Cuál es el artículo correcto para 'ciudad'?", options: ["el", "la", "un", "los"], correctIndex: 1 },
      { type: "mcq", question: "Completa: 'Voy ___ supermercado'", options: ["a el", "al", "del", "a la"], correctIndex: 1 },
      { type: "mcq", question: "¿Cuál es MASCULINO?", options: ["la mano", "la flor", "el día", "la ciudad"], correctIndex: 2 },
      { type: "mcq", question: "'La situación' es femenino porque termina en:", options: ["-a", "-ión", "-dad", "-ez"], correctIndex: 1 },
      { type: "mcq", question: "¿Cuál es el plural de 'el estudiante'?", options: ["las estudiantes", "los estudiantes", "unos estudiante", "el estudiantes"], correctIndex: 1 }
    ]
  }),

  "SER vs ESTAR — To Be": (lang) => ({
    title: "SER vs ESTAR — Los Dos Verbos 'To Be'",
    explanation: `### SER vs ESTAR — La Distinción Fundamental

Este es el concepto más difícil para estudiantes árabes y francófonos, porque en árabe y en francés existe solo **un** verbo equivalente. En español hay **DOS**.

#### SER — Características permanentes o esenciales:
| Uso | Ejemplo |
|:---|:---|
| **Identidad/nombre** | Yo **soy** Ahmed |
| **Origen/nacionalidad** | **Soy** de Marruecos. **Soy** marroquí |
| **Profesión** | **Soy** estudiante / médico |
| **Características físicas permanentes** | **Es** alto. **Es** morena |
| **Material** | La mesa **es** de madera |
| **Tiempo/fecha** | **Son** las tres. **Es** lunes |
| **Con adjetivos de carácter** | **Es** inteligente, simpático |

#### ESTAR — Estados temporales o posiciones:
| Uso | Ejemplo |
|:---|:---|
| **Ubicación** | **Estoy** en Madrid |
| **Estado de salud** | **Estoy** bien / enfermo |
| **Estado emocional** | **Estoy** cansado, contento |
| **Estado temporal** | La ventana **está** abierta |
| **Acciones en progreso** | **Estoy** estudiando |

#### Tabla de conjugación (Presente):
| Pronombre | SER | ESTAR |
|:---:|:---:|:---:|
| yo | **soy** | **estoy** |
| tú | **eres** | **estás** |
| él/ella | **es** | **está** |
| nosotros | **somos** | **estamos** |
| vosotros | **sois** | **estáis** |
| ellos/ellas | **son** | **están** |

⚠️ **Adjetivos que cambian de significado:**
- **ser aburrido** = ser una persona aburrida (carácter)
- **estar aburrido** = sentirse aburrido ahora mismo (estado)`,
    vocabulary: [
      { spanish: "ser", dynamicLang: lang === "ar" ? "يكون (دائم)" : lang === "fr" ? "être (permanent)" : "to be (permanent)", explanation: "Para identidad, origen, esencia" },
      { spanish: "estar", dynamicLang: lang === "ar" ? "يكون (مؤقت/موضع)" : lang === "fr" ? "être (temporaire/lieu)" : "to be (temporary/location)", explanation: "Para estado, ubicación, emoción" },
      { spanish: "soy de Marruecos", dynamicLang: lang === "ar" ? "أنا من المغرب" : lang === "fr" ? "Je suis du Maroc" : "I am from Morocco", explanation: "SER para el origen" },
      { spanish: "estoy en Madrid", dynamicLang: lang === "ar" ? "أنا في مدريد" : lang === "fr" ? "Je suis à Madrid" : "I am in Madrid", explanation: "ESTAR para la ubicación" },
      { spanish: "estoy cansado", dynamicLang: lang === "ar" ? "أنا متعب" : lang === "fr" ? "Je suis fatigué" : "I am tired", explanation: "ESTAR para estado emocional/físico" }
    ],
    practice: [
      { type: "mcq", question: "Ahmed ___ estudiante de medicina.", options: ["está", "es", "son", "estás"], correctIndex: 1 },
      { type: "mcq", question: "La biblioteca ___ cerrada hoy.", options: ["es", "ser", "está", "somos"], correctIndex: 2 },
      { type: "mcq", question: "¿Dónde ___ la facultad de derecho?", options: ["es", "son", "está", "estoy"], correctIndex: 2 },
      { type: "mcq", question: "Mis padres ___ de Casablanca.", options: ["están", "estamos", "son", "eres"], correctIndex: 2 },
      { type: "mcq", question: "Hoy ___ lunes, 15 de octubre.", options: ["está", "estoy", "es", "somos"], correctIndex: 2 }
    ]
  }),

  "Regular -AR Verbs: Hablar, Estudiar": (lang) => ({
    title: "Los Verbos Regulares en -AR",
    explanation: `### Verbos Regulares en -AR — Presente de Indicativo

Los verbos en -AR son los más numerosos en español. Una vez que dominas este patrón, puedes conjugar cientos de verbos.

#### Regla: Quitar -AR y añadir las terminaciones:
| Pronombre | Terminación | HABLAR | ESTUDIAR | TRABAJAR |
|:---:|:---:|:---:|:---:|:---:|
| yo | **-o** | habl**o** | estudi**o** | trabaj**o** |
| tú | **-as** | habl**as** | estudi**as** | trabaj**as** |
| él/ella | **-a** | habl**a** | estudi**a** | trabaj**a** |
| nosotros | **-amos** | habl**amos** | estudi**amos** | trabaj**amos** |
| vosotros | **-áis** | habl**áis** | estudi**áis** | trabaj**áis** |
| ellos | **-an** | habl**an** | estudi**an** | trabaj**an** |

#### Verbos -AR esenciales para estudiantes:
- **estudiar** = estudiar
- **hablar** = hablar
- **trabajar** = trabajar
- **escuchar** = escuchar
- **preguntar** = preguntar
- **necesitar** = necesitar
- **llegar** = llegar (a la universidad)
- **buscar** = buscar (información)
- **llamar** = llamar (por teléfono)
- **mandar** = enviar (correos)

#### Frases prácticas:
- **Estudio** ingeniería en la UPM.
- **Necesito** matricularme este mes.
- **Busco** piso compartido en Madrid.
- **Llamo** a la secretaría para preguntar.`,
    vocabulary: [
      { spanish: "hablar", dynamicLang: lang === "ar" ? "يتحدث" : lang === "fr" ? "parler" : "to speak", explanation: "Verbo modelo de la conjugación -AR" },
      { spanish: "estudiar", dynamicLang: lang === "ar" ? "يدرس" : lang === "fr" ? "étudier" : "to study", explanation: "Verbo clave para universitarios" },
      { spanish: "necesitar", dynamicLang: lang === "ar" ? "يحتاج" : lang === "fr" ? "avoir besoin de" : "to need", explanation: "Necesito + infinitivo" },
      { spanish: "buscar", dynamicLang: lang === "ar" ? "يبحث" : lang === "fr" ? "chercher" : "to look for", explanation: "Busco piso / Busco trabajo" },
      { spanish: "llegar", dynamicLang: lang === "ar" ? "يصل" : lang === "fr" ? "arriver" : "to arrive", explanation: "¿A qué hora llegas a clase?" }
    ],
    practice: [
      { type: "mcq", question: "Yo ___ español todos los días.", options: ["estudias", "estudio", "estudia", "estudiamos"], correctIndex: 1 },
      { type: "mcq", question: "Ella ___ en una cafetería.", options: ["trabajo", "trabajas", "trabajamos", "trabaja"], correctIndex: 3 },
      { type: "mcq", question: "Nosotros ___ a la universidad a las 8.", options: ["llegan", "llego", "llegamos", "llegas"], correctIndex: 2 },
      { type: "mcq", question: "¿Tú ___ árabe?", options: ["habla", "hablo", "hablas", "hablan"], correctIndex: 2 },
      { type: "mcq", question: "Los estudiantes ___ información en internet.", options: ["busco", "buscas", "busca", "buscan"], correctIndex: 3 }
    ]
  }),

  "Daily Activities & Routines": (lang) => ({
    title: "Las Actividades Diarias y las Rutinas",
    explanation: `### La Rutina Diaria — Vocabulario y Expresiones

#### Verbos reflexivos de la rutina:
Los verbos reflexivos indican que la acción recae sobre uno mismo. Se conjugan con pronombres reflexivos.

| Infinitivo | Yo | Tú | Él/Ella |
|:---|:---:|:---:|:---:|
| **despertarse** (wake up) | me despierto | te despiertas | se despierta |
| **levantarse** (get up) | me levanto | te levantas | se levanta |
| **ducharse** (shower) | me ducho | te duchas | se ducha |
| **vestirse** (get dressed) | me visto | te vistes | se viste |
| **acostarse** (go to bed) | me acuesto | te acuestas | se acuesta |
| **dormirse** (fall asleep) | me duermo | te duermes | se duerme |

#### Expresiones de frecuencia:
- **siempre** = always
- **normalmente** = normally
- **a veces** = sometimes
- **nunca** = never
- **todos los días** = every day
- **los lunes** = on Mondays

#### Mi rutina de estudiante:
Me despierto a las 7:00. Me ducho y desayuno. Llego a la facultad a las 8:30. Estudio hasta las 14:00. Como en la cafetería. Por la tarde, voy a la biblioteca. Me acuesto a las 23:00.`,
    vocabulary: [
      { spanish: "despertarse", dynamicLang: lang === "ar" ? "يستيقظ" : lang === "fr" ? "se réveiller" : "to wake up", explanation: "Me despierto a las 7" },
      { spanish: "ducharse", dynamicLang: lang === "ar" ? "يستحم" : lang === "fr" ? "se doucher" : "to shower", explanation: "Me ducho por la mañana" },
      { spanish: "desayunar", dynamicLang: lang === "ar" ? "يتناول الفطور" : lang === "fr" ? "prendre le petit-déjeuner" : "to have breakfast", explanation: "La primera comida del día" },
      { spanish: "acostarse", dynamicLang: lang === "ar" ? "يذهب للنوم" : lang === "fr" ? "se coucher" : "to go to bed", explanation: "Me acuesto a medianoche" },
      { spanish: "todos los días", dynamicLang: lang === "ar" ? "كل يوم" : lang === "fr" ? "tous les jours" : "every day", explanation: "Expresión de frecuencia diaria" }
    ],
    practice: [
      { type: "mcq", question: "Yo ___ a las 7 de la mañana.", options: ["me despierta", "te despiertas", "me despierto", "se despierta"], correctIndex: 2 },
      { type: "mcq", question: "¿Qué significa 'a veces'?", options: ["always", "never", "sometimes", "every day"], correctIndex: 2 },
      { type: "mcq", question: "Ella ___ a las 11 de la noche.", options: ["me acuesto", "se acuesta", "te acuestas", "nos acostamos"], correctIndex: 1 },
      { type: "mcq", question: "¿Cuál viene primero en la mañana?", options: ["acostarse", "despertarse", "ducharse", "comer"], correctIndex: 1 },
      { type: "mcq", question: "Completa: 'Siempre ___  el desayuno a las 8'", options: ["como", "comes", "come", "comemos"], correctIndex: 0 }
    ]
  }),

  "Ordering Food & Cafe Vocabulary": (lang) => ({
    title: "Pedir en un Café o Restaurante",
    explanation: `### En el Café y el Restaurante — Vocabulario Esencial

En España, el café y el restaurante son espacios sociales fundamentales. Como estudiante, comerás frecuentemente fuera de casa.

#### Vocabulario de bebidas:
| Español | ${lang === "ar" ? "العربية" : lang === "fr" ? "Français" : "English"} |
|:---|:---|
| un café solo | ${lang === "ar" ? "قهوة سوداء" : lang === "fr" ? "un expresso" : "an espresso"} |
| un café con leche | ${lang === "ar" ? "قهوة بالحليب" : lang === "fr" ? "un café au lait" : "coffee with milk"} |
| un cortado | ${lang === "ar" ? "قهوة بقليل من الحليب" : lang === "fr" ? "un café noisette" : "espresso with a splash of milk"} |
| un zumo de naranja | ${lang === "ar" ? "عصير برتقال" : lang === "fr" ? "un jus d'orange" : "orange juice"} |
| una cerveza | ${lang === "ar" ? "بيرة" : lang === "fr" ? "une bière" : "a beer"} |
| el agua | ${lang === "ar" ? "الماء" : lang === "fr" ? "l'eau" : "water"} |

#### Frases para pedir:
- **¿Me pone...?** / **¿Me pones...?** = Can I have...?
- **Quiero/Quisiera...** = I'd like...
- **¿Qué recomienda?** = What do you recommend?
- **La cuenta, por favor** = The bill, please
- **¿Está incluido el servicio?** = Is service included?

#### El menú del día (muy español):
En España, muchos restaurantes ofrecen el **menú del día** al mediodía (aprox. 10-12€): primer plato + segundo plato + postre + bebida + pan. ¡Es la opción más económica para estudiantes!`,
    vocabulary: [
      { spanish: "¿Me pone un café?", dynamicLang: lang === "ar" ? "هل يمكنني قهوة؟" : lang === "fr" ? "Un café, s'il vous plaît?" : "Can I have a coffee?", explanation: "Forma más española de pedir" },
      { spanish: "la carta", dynamicLang: lang === "ar" ? "قائمة الطعام" : lang === "fr" ? "la carte" : "the menu", explanation: "¿Me trae la carta, por favor?" },
      { spanish: "el menú del día", dynamicLang: lang === "ar" ? "طبق اليوم" : lang === "fr" ? "le menu du jour" : "today's set menu", explanation: "La opción más económica: ~10-12€" },
      { spanish: "la cuenta", dynamicLang: lang === "ar" ? "الفاتورة" : lang === "fr" ? "l'addition" : "the bill", explanation: "La cuenta, por favor" },
      { spanish: "la propina", dynamicLang: lang === "ar" ? "الإكرامية" : lang === "fr" ? "le pourboire" : "the tip", explanation: "En España no es obligatoria" }
    ],
    practice: [
      { type: "mcq", question: "¿Cómo pides la cuenta en español?", options: ["¿Qué hay?", "La cuenta, por favor", "¿Me pone un café?", "¿Qué recomienda?"], correctIndex: 1 },
      { type: "mcq", question: "Un café solo en España es:", options: ["café con leche y azúcar", "un expresso sin leche", "café con mucha leche", "té negro"], correctIndex: 1 },
      { type: "mcq", question: "¿Qué incluye típicamente el menú del día?", options: ["Solo el primer plato", "Solo el postre", "Primer plato, segundo, postre y bebida", "Solo bebida y postre"], correctIndex: 2 },
      { type: "mcq", question: "¿Cómo se dice 'orange juice'?", options: ["zumo de manzana", "zumo de naranja", "agua con gas", "refresco"], correctIndex: 1 },
      { type: "mcq", question: "¿Cómo se pide formalmente algo en un restaurante?", options: ["Dame esto", "Quiero esto", "Quisiera el menú del día, por favor", "Ponme algo"], correctIndex: 2 }
    ]
  }),

  "Weather & Seasons": (lang) => ({
    title: "El Tiempo y las Estaciones",
    explanation: `### El Tiempo Atmosférico y las Estaciones

#### Las cuatro estaciones:
| Español | ${lang === "ar" ? "العربية" : lang === "fr" ? "Français" : "English"} | Meses |
|:---|:---|:---|
| la primavera | ${lang === "ar" ? "الربيع" : lang === "fr" ? "le printemps" : "spring"} | marzo-mayo |
| el verano | ${lang === "ar" ? "الصيف" : lang === "fr" ? "l'été" : "summer"} | junio-agosto |
| el otoño | ${lang === "ar" ? "الخريف" : lang === "fr" ? "l'automne" : "autumn"} | sept.-noviembre |
| el invierno | ${lang === "ar" ? "الشتاء" : lang === "fr" ? "l'hiver" : "winter"} | dic.-febrero |

#### ¿Qué tiempo hace? (Hacer es el verbo clave)
| Expresión | Significado |
|:---|:---|
| **Hace calor** | It's hot |
| **Hace frío** | It's cold |
| **Hace sol** | It's sunny |
| **Hace viento** | It's windy |
| **Hace buen tiempo** | The weather is nice |
| **Hace mal tiempo** | The weather is bad |
| **Llueve / Está lloviendo** | It rains / It's raining |
| **Nieva** | It snows |
| **Está nublado** | It's cloudy |

#### El tiempo en España:
- **Madrid**: veranos muy calientes (40°C+), inviernos fríos
- **Barcelona**: clima mediterráneo suave
- **Sevilla**: la ciudad más caliente de Europa en verano
- **Bilbao**: llueve mucho, verde todo el año`,
    vocabulary: [
      { spanish: "¿Qué tiempo hace?", dynamicLang: lang === "ar" ? "كيف الطقس؟" : lang === "fr" ? "Quel temps fait-il?" : "What's the weather like?", explanation: "La pregunta estándar sobre el tiempo" },
      { spanish: "hace calor", dynamicLang: lang === "ar" ? "الجو حار" : lang === "fr" ? "il fait chaud" : "it's hot", explanation: "HACER + temperatura o tiempo" },
      { spanish: "llueve", dynamicLang: lang === "ar" ? "تمطر" : lang === "fr" ? "il pleut" : "it rains", explanation: "Verbo llover — verbo impersonal" },
      { spanish: "el paraguas", dynamicLang: lang === "ar" ? "المظلة" : lang === "fr" ? "le parapluie" : "the umbrella", explanation: "Necesario en el norte de España" },
      { spanish: "la temperatura", dynamicLang: lang === "ar" ? "درجة الحرارة" : lang === "fr" ? "la température" : "the temperature", explanation: "La temperatura máxima hoy es 35°C" }
    ],
    practice: [
      { type: "mcq", question: "¿Cómo se dice 'It's sunny'?", options: ["Hace frío", "Hace sol", "Llueve", "Está nublado"], correctIndex: 1 },
      { type: "mcq", question: "¿Cuál es el verbo principal para hablar del tiempo?", options: ["ser", "estar", "hacer", "tener"], correctIndex: 2 },
      { type: "mcq", question: "¿Qué meses son el verano en España?", options: ["Dic-Feb", "Mar-May", "Jun-Ago", "Sep-Nov"], correctIndex: 2 },
      { type: "mcq", question: "En invierno en Madrid, ¿qué tiempo hace?", options: ["Hace mucho calor", "Hace frío", "Hace sol siempre", "Llueve todos los días"], correctIndex: 1 },
      { type: "mcq", question: "¿Cómo se dice 'it's raining' (ahora mismo)?", options: ["Llueve", "Está lloviendo", "Hizo lluvia", "Hay lluvia"], correctIndex: 1 }
    ]
  }),

  "Colors & Clothing": (lang) => ({
    title: "Los Colores y la Ropa",
    explanation: `### Los Colores y la Ropa en Español

#### Los colores — y concordancia:
En español, los adjetivos (incluidos los colores) **concuerdan** en género y número con el sustantivo.

| Color | Masculino | Femenino | Plural |
|:---|:---:|:---:|:---:|
| rojo (red) | el bolso rojo | la camisa roja | los zapatos rojos |
| azul (blue) | el pantalón azul | la chaqueta azul | los calcetines azules |
| verde (green) | el jersey verde | la falda verde | los pantalones verdes |
| negro (black) | el abrigo negro | la camiseta negra | las botas negras |
| blanco (white) | el polo blanco | la camiseta blanca | los guantes blancos |
| amarillo (yellow) | el impermeable amarillo | la bufanda amarilla | — |
| naranja (orange) | invariable | naranja | naranjas |

#### Vocabulario de ropa esencial:
| Ropa | ${lang === "ar" ? "العربية" : lang === "fr" ? "Français" : "English"} |
|:---|:---|
| la camiseta | ${lang === "ar" ? "التيشيرت" : lang === "fr" ? "le t-shirt" : "t-shirt"} |
| el pantalón | ${lang === "ar" ? "البنطلون" : lang === "fr" ? "le pantalon" : "trousers"} |
| los zapatos | ${lang === "ar" ? "الحذاء" : lang === "fr" ? "les chaussures" : "shoes"} |
| el abrigo | ${lang === "ar" ? "المعطف" : lang === "fr" ? "le manteau" : "coat"} |
| la chaqueta | ${lang === "ar" ? "الجاكيت" : lang === "fr" ? "la veste" : "jacket"} |
| las zapatillas | ${lang === "ar" ? "حذاء رياضي" : lang === "fr" ? "les baskets" : "sneakers"} |`,
    vocabulary: [
      { spanish: "rojo/roja", dynamicLang: lang === "ar" ? "أحمر/حمراء" : lang === "fr" ? "rouge" : "red", explanation: "Concuerda con el género del sustantivo" },
      { spanish: "los zapatos", dynamicLang: lang === "ar" ? "الأحذية" : lang === "fr" ? "les chaussures" : "shoes", explanation: "Siempre en plural en español" },
      { spanish: "llevar puesto", dynamicLang: lang === "ar" ? "يرتدي" : lang === "fr" ? "porter (vêtement)" : "to wear", explanation: "Llevo puesta una chaqueta azul" },
      { spanish: "la talla", dynamicLang: lang === "ar" ? "المقاس" : lang === "fr" ? "la taille" : "the size", explanation: "¿Qué talla usas? — S, M, L, XL" },
      { spanish: "la tienda de ropa", dynamicLang: lang === "ar" ? "محل الملابس" : lang === "fr" ? "le magasin de vêtements" : "clothing store", explanation: "Zara, H&M, Primark son populares en España" }
    ],
    practice: [
      { type: "mcq", question: "La camisa ___ (rojo)", options: ["rojo", "rojas", "roja", "rojos"], correctIndex: 2 },
      { type: "mcq", question: "¿Cómo se dice 'I'm wearing a blue jacket'?", options: ["Tengo una chaqueta azul", "Llevo puesta una chaqueta azul", "Soy una chaqueta azul", "Estoy una chaqueta azul"], correctIndex: 1 },
      { type: "mcq", question: "Los pantalones ___ (negro)", options: ["negros", "negra", "negro", "negras"], correctIndex: 0 },
      { type: "mcq", question: "¿Qué color es invariable (no cambia)?", options: ["rojo", "blanco", "naranja", "negro"], correctIndex: 2 },
      { type: "mcq", question: "¿Cómo preguntas la talla en una tienda?", options: ["¿Cuánto cuesta?", "¿Qué talla usas?", "¿De qué color?", "¿Dónde está?"], correctIndex: 1 }
    ]
  }),

  "Describing Places & Directions": (lang) => ({
    title: "Describir Lugares y Pedir Direcciones",
    explanation: `### Lugares y Direcciones en España

#### Vocabulario de lugares urbanos:
| Lugar | ${lang === "ar" ? "العربية" : lang === "fr" ? "Français" : "English"} |
|:---|:---|
| la facultad | ${lang === "ar" ? "الكلية" : lang === "fr" ? "la faculté" : "faculty/school"} |
| la biblioteca | ${lang === "ar" ? "المكتبة" : lang === "fr" ? "la bibliothèque" : "library"} |
| la residencia | ${lang === "ar" ? "المقيم الطلابي" : lang === "fr" ? "la résidence" : "student dorm"} |
| el ayuntamiento | ${lang === "ar" ? "البلدية" : lang === "fr" ? "la mairie" : "town hall"} |
| la comisaría | ${lang === "ar" ? "مركز الشرطة" : lang === "fr" ? "le commissariat" : "police station"} |
| la farmacia | ${lang === "ar" ? "الصيدلية" : lang === "fr" ? "la pharmacie" : "pharmacy"} |
| el metro | ${lang === "ar" ? "المترو" : lang === "fr" ? "le métro" : "subway"} |

#### Pedir y dar direcciones:
- **¿Dónde está...?** = Where is...?
- **¿Cómo llego a...?** = How do I get to...?
- **Todo recto** = Straight ahead
- **Gira a la derecha** = Turn right
- **Gira a la izquierda** = Turn left
- **Al final de la calle** = At the end of the street
- **Enfrente de** = In front of
- **Al lado de** = Next to
- **A dos minutos a pie** = Two minutes on foot`,
    vocabulary: [
      { spanish: "¿Dónde está...?", dynamicLang: lang === "ar" ? "أين يوجد...؟" : lang === "fr" ? "Où est...?" : "Where is...?", explanation: "La pregunta clave para orientarse" },
      { spanish: "todo recto", dynamicLang: lang === "ar" ? "على طول / مباشرة" : lang === "fr" ? "tout droit" : "straight ahead", explanation: "Sigue todo recto por esta calle" },
      { spanish: "a la derecha", dynamicLang: lang === "ar" ? "على اليمين" : lang === "fr" ? "à droite" : "on the right", explanation: "Gira a la derecha en el semáforo" },
      { spanish: "a la izquierda", dynamicLang: lang === "ar" ? "على اليسار" : lang === "fr" ? "à gauche" : "on the left", explanation: "La farmacia está a la izquierda" },
      { spanish: "cerca / lejos", dynamicLang: lang === "ar" ? "قريب / بعيد" : lang === "fr" ? "près / loin" : "near / far", explanation: "¿Está cerca de aquí?" }
    ],
    practice: [
      { type: "mcq", question: "¿Cómo preguntas cómo llegar a un sitio?", options: ["¿Qué hora es?", "¿Dónde está la estación?", "¿Cuánto cuesta?", "¿Hablas inglés?"], correctIndex: 1 },
      { type: "mcq", question: "'Todo recto' significa:", options: ["Turn left", "Turn right", "Go back", "Straight ahead"], correctIndex: 3 },
      { type: "mcq", question: "Enfrente de significa:", options: ["Next to", "Far from", "In front of / Opposite", "Behind"], correctIndex: 2 },
      { type: "mcq", question: "¿Dónde sacas dinero en España?", options: ["En la farmacia", "En el ayuntamiento", "En el cajero automático", "En la comisaría"], correctIndex: 2 },
      { type: "mcq", question: "¿Cómo se dice 'next to the library'?", options: ["delante de la biblioteca", "al lado de la biblioteca", "detrás de la biblioteca", "lejos de la biblioteca"], correctIndex: 1 }
    ]
  }),

  "My Academic Goals & University Life": (lang) => ({
    title: "Metas Académicas y Vida Universitaria",
    explanation: `### La Universidad en España — Vocabulario Esencial

#### Tipos de estudios:
| Nivel | Español | Duración |
|:---|:---|:---|
| FP Grado Medio | Ciclo Medio | 2 años |
| FP Grado Superior | Ciclo Superior | 2 años |
| Grado Universitario | Grado | 4 años |
| Máster | Máster | 1-2 años |
| Doctorado | Doctorado / PhD | 3-5 años |

#### Vocabulario universitario:
| Español | ${lang === "ar" ? "العربية" : lang === "fr" ? "Français" : "English"} |
|:---|:---|
| la matrícula | ${lang === "ar" ? "التسجيل" : lang === "fr" ? "l'inscription" : "enrollment"} |
| el expediente | ${lang === "ar" ? "الملف الأكاديمي" : lang === "fr" ? "le dossier académique" : "academic record"} |
| la beca | ${lang === "ar" ? "المنحة" : lang === "fr" ? "la bourse" : "scholarship"} |
| el TFG | ${lang === "ar" ? "مشروع التخرج" : lang === "fr" ? "le mémoire de licence" : "bachelor's thesis"} |
| el NIE | ${lang === "ar" ? "رقم هوية الأجانب" : lang === "fr" ? "numéro d'identification étranger" : "foreigner ID number"} |
| la homologación | ${lang === "ar" ? "معادلة الشهادة" : lang === "fr" ? "l'équivalence de diplôme" : "degree recognition"} |

#### Frases útiles:
- **Quiero estudiar** Enfermería en la UAM.
- **Mi meta es** conseguir el título de Grado.
- **Necesito homologar** mi Bachillerato marroquí.
- **Tengo que solicitar** el NIE en la comisaría.`,
    vocabulary: [
      { spanish: "la homologación", dynamicLang: lang === "ar" ? "معادلة الشهادة" : lang === "fr" ? "l'équivalence du diplôme" : "degree recognition", explanation: "Proceso obligatorio para estudiar en España" },
      { spanish: "el NIE", dynamicLang: lang === "ar" ? "رقم هوية الأجنبي" : lang === "fr" ? "le NIE (numéro étranger)" : "foreigner ID number", explanation: "Número de Identificación de Extranjero" },
      { spanish: "la beca", dynamicLang: lang === "ar" ? "المنحة الدراسية" : lang === "fr" ? "la bourse d'études" : "scholarship", explanation: "Becas Erasmus, MAEC, autonómicas..." },
      { spanish: "matricularse", dynamicLang: lang === "ar" ? "يسجل في الجامعة" : lang === "fr" ? "s'inscrire à l'université" : "to enroll", explanation: "Me matriculo en septiembre" },
      { spanish: "el expediente académico", dynamicLang: lang === "ar" ? "السجل الأكاديمي" : lang === "fr" ? "le relevé de notes" : "academic transcript", explanation: "Notas de todas las asignaturas" }
    ],
    practice: [
      { type: "mcq", question: "¿Qué es la homologación?", options: ["Un tipo de visa", "El reconocimiento oficial del título extranjero", "Un examen de español", "Una beca universitaria"], correctIndex: 1 },
      { type: "mcq", question: "¿Cuántos años dura generalmente un Grado universitario en España?", options: ["2 años", "3 años", "4 años", "5 años"], correctIndex: 2 },
      { type: "mcq", question: "¿Qué significa NIE?", options: ["Número de Inscripción Educativa", "Número de Identificación de Extranjero", "Nota de Ingreso Especial", "Nivel de Idioma en España"], correctIndex: 1 },
      { type: "mcq", question: "Para estudiar FP Grado Superior, ¿cuántos años dura?", options: ["1 año", "2 años", "3 años", "4 años"], correctIndex: 1 },
      { type: "mcq", question: "¿Qué necesitas para solicitar una beca?", options: ["Solo el pasaporte", "Un buen expediente académico", "Trabajar a tiempo completo", "Tener 30 años mínimo"], correctIndex: 1 }
    ]
  }),

  "GUSTAR & Preference Verbs": (lang) => ({
    title: "El Verbo GUSTAR y Verbos de Preferencia",
    explanation: `### GUSTAR — El Verbo más Especial del Español

GUSTAR funciona de manera diferente a todos los demás verbos. Es **"reversed"** comparado con el inglés, el árabe y el francés.

#### ¿Cómo funciona GUSTAR?
**El sujeto es la cosa que gusta, no la persona.**

| Español | Estructura | Traducción |
|:---|:---|:---|
| Me gusta el café. | A mí + me gusta + el café | I like coffee. |
| Te gusta Madrid. | A ti + te gusta + Madrid | You like Madrid. |
| Le gusta estudiar. | A él/ella + le gusta + estudiar | He/She likes studying. |
| Nos gusta la música. | A nosotros + nos gusta + la música | We like music. |
| Os gusta la paella. | A vosotros + os gusta + la paella | You all like paella. |
| Les gustan los libros. | A ellos + les gustan + los libros | They like books. |

#### Regla clave:
- **GUSTA** (singular) cuando el sujeto es singular o un infinitivo
  - Me **gusta** la tortilla. / Me **gusta** bailar.
- **GUSTAN** (plural) cuando el sujeto es plural
  - Me **gustan** los libros. / Me **gustan** las ciudades españolas.

#### Otros verbos como GUSTAR:
- **encantar** = to love (stronger than gustar)
- **molestar** = to bother
- **interesar** = to interest
- **parecer** = to seem
- **apetecer** = to feel like (food/drink)

#### Ejemplos:
- Me **encanta** España. (I love Spain)
- No me **gusta** el frío. (I don't like cold)
- ¿Te **apetece** un café? (Do you feel like a coffee?)`,
    vocabulary: [
      { spanish: "me gusta", dynamicLang: lang === "ar" ? "أنا أحب / يعجبني" : lang === "fr" ? "j'aime / ça me plaît" : "I like", explanation: "Me gusta el español (singular)" },
      { spanish: "me gustan", dynamicLang: lang === "ar" ? "أنا أحب (جمع)" : lang === "fr" ? "j'aime (pluriel)" : "I like (plural)", explanation: "Me gustan los libros (plural)" },
      { spanish: "me encanta", dynamicLang: lang === "ar" ? "أنا أحب كثيراً" : lang === "fr" ? "j'adore" : "I love", explanation: "Más fuerte que 'me gusta'" },
      { spanish: "no me gusta", dynamicLang: lang === "ar" ? "لا يعجبني" : lang === "fr" ? "je n'aime pas" : "I don't like", explanation: "La negación de gustar" },
      { spanish: "¿Te apetece?", dynamicLang: lang === "ar" ? "هل تشتهي؟" : lang === "fr" ? "Tu as envie de?" : "Do you feel like?", explanation: "Para proponer comida o bebida" }
    ],
    practice: [
      { type: "mcq", question: "Completa: 'Me ___ los exámenes' (I don't like)", options: ["gusta", "gustan", "gustas", "gustamos"], correctIndex: 1 },
      { type: "mcq", question: "¿Cuál es correcto? ('She likes music')", options: ["Ella gusta la música", "Le gusta la música", "Le gustan la música", "Gusta ella la música"], correctIndex: 1 },
      { type: "mcq", question: "¿Cuándo usas GUSTAN (plural)?", options: ["Siempre", "Cuando el sujeto es plural", "Con yo", "Con nosotros"], correctIndex: 1 },
      { type: "mcq", question: "'Me encanta Madrid' significa:", options: ["I'm in Madrid", "I need Madrid", "I love Madrid", "I'm from Madrid"], correctIndex: 2 },
      { type: "mcq", question: "¿Cuál es el pronombre para 'nosotros' con GUSTAR?", options: ["me", "te", "le", "nos"], correctIndex: 3 }
    ]
  }),

  "Preterite Tense: Regular Verbs": (lang) => ({
    title: "El Pretérito Indefinido — Verbos Regulares",
    explanation: `### El Pretérito Indefinido — Para Hablar del Pasado

El pretérito indefinido se usa para acciones **completadas** en el pasado. Es el tiempo narrativo del pasado.

#### Cuándo usarlo:
- Acciones terminadas en un tiempo definido: *ayer, el lunes, en 2022, hace un mes*
- Secuencias de eventos pasados: *primero hice X, luego Y*
- Interrupciones de una acción continua

#### Terminaciones regulares:
| Pronombre | -AR (estudiar) | -ER (comer) | -IR (vivir) |
|:---:|:---:|:---:|:---:|
| yo | estudi**é** | com**í** | viv**í** |
| tú | estudi**aste** | com**iste** | viv**iste** |
| él/ella | estudi**ó** | com**ió** | viv**ió** |
| nosotros | estudi**amos** | com**imos** | viv**imos** |
| vosotros | estudi**asteis** | com**isteis** | viv**isteis** |
| ellos | estudi**aron** | com**ieron** | viv**ieron** |

#### Marcadores temporales del indefinido:
- **ayer** = yesterday
- **anteayer** = the day before yesterday
- **el lunes pasado** = last Monday
- **la semana pasada** = last week
- **el año pasado** = last year
- **hace dos días/meses** = two days/months ago
- **en 2023** = in 2023`,
    vocabulary: [
      { spanish: "ayer", dynamicLang: lang === "ar" ? "أمس" : lang === "fr" ? "hier" : "yesterday", explanation: "Ayer llegué a Madrid" },
      { spanish: "la semana pasada", dynamicLang: lang === "ar" ? "الأسبوع الماضي" : lang === "fr" ? "la semaine dernière" : "last week", explanation: "La semana pasada estudié mucho" },
      { spanish: "hace + tiempo", dynamicLang: lang === "ar" ? "منذ..." : lang === "fr" ? "il y a + durée" : "... ago", explanation: "Hace tres meses llegué a España" },
      { spanish: "llegué", dynamicLang: lang === "ar" ? "وصلت" : lang === "fr" ? "je suis arrivé(e)" : "I arrived", explanation: "Llegar → yo llegué (preterito)" },
      { spanish: "viví", dynamicLang: lang === "ar" ? "عشت" : lang === "fr" ? "j'ai vécu" : "I lived", explanation: "Vivir → yo viví (preterito)" }
    ],
    practice: [
      { type: "mcq", question: "Ayer yo ___ (estudiar) cinco horas.", options: ["estudié", "estudiaba", "estudio", "estudiaste"], correctIndex: 0 },
      { type: "mcq", question: "Ella ___ (comer) en la cafetería ayer.", options: ["comía", "come", "comió", "comiste"], correctIndex: 2 },
      { type: "mcq", question: "¿Con qué marcador NO usarías el Indefinido?", options: ["ayer", "normalmente", "el lunes pasado", "hace dos días"], correctIndex: 1 },
      { type: "mcq", question: "Nosotros ___ (vivir) en Sevilla el año pasado.", options: ["vivimos", "vivíamos", "vivieron", "viví"], correctIndex: 0 },
      { type: "mcq", question: "¿Cuál es 'tú' del Indefinido de HABLAR?", options: ["hablé", "habló", "hablaste", "hablaron"], correctIndex: 2 }
    ]
  }),

  "Preterite Tense: Irregular Verbs": (lang) => ({
    title: "El Pretérito Indefinido — Verbos Irregulares",
    explanation: `### Verbos Irregulares en el Pretérito Indefinido

Estos verbos son los más usados en español. ¡Hay que memorizarlos!

#### Irregulares totales (raíz completamente nueva):
| Infinitivo | Raíz irregular | yo | tú | él |
|:---|:---|:---:|:---:|:---:|
| **ser / ir** | fue- | fui | fuiste | fue |
| **tener** | tuv- | tuve | tuviste | tuvo |
| **estar** | estuv- | estuve | estuviste | estuvo |
| **hacer** | hic- | hice | hiciste | hizo |
| **poder** | pud- | pude | pudiste | pudo |
| **saber** | sup- | supe | supiste | supo |
| **querer** | quis- | quise | quisiste | quiso |
| **venir** | vin- | vine | viniste | vino |
| **poner** | pus- | puse | pusiste | puso |
| **decir** | dij- | dije | dijiste | dijo |

⚠️ **SER e IR** tienen las mismas formas:
- Fui a Madrid = I went to Madrid
- Fui estudiante = I was a student
El contexto indica cuál es.

#### Terminaciones irregulares (iguales para todos):
yo: **-e**, tú: **-iste**, él: **-o**, nos: **-imos**, vos: **-isteis**, ellos: **-ieron/-eron**`,
    vocabulary: [
      { spanish: "fui", dynamicLang: lang === "ar" ? "ذهبت / كنت" : lang === "fr" ? "je suis allé(e) / j'étais" : "I went / I was", explanation: "SER e IR tienen las mismas formas" },
      { spanish: "hice", dynamicLang: lang === "ar" ? "فعلت / قمت بـ" : lang === "fr" ? "j'ai fait" : "I did / I made", explanation: "Hacer → hice, hiciste, hizo..." },
      { spanish: "tuve", dynamicLang: lang === "ar" ? "كان لدي" : lang === "fr" ? "j'ai eu / j'avais" : "I had", explanation: "Tener → tuve, tuviste, tuvo..." },
      { spanish: "vine", dynamicLang: lang === "ar" ? "جئت" : lang === "fr" ? "je suis venu(e)" : "I came", explanation: "Venir → vine, viniste, vino..." },
      { spanish: "dije", dynamicLang: lang === "ar" ? "قلت" : lang === "fr" ? "j'ai dit" : "I said", explanation: "Decir → dije, dijiste, dijo..." }
    ],
    practice: [
      { type: "mcq", question: "¿Cuál es 'yo' del Indefinido de HACER?", options: ["hacé", "hicé", "hice", "hizo"], correctIndex: 2 },
      { type: "mcq", question: "Ella ___ a España hace tres años.", options: ["fue", "iba", "va", "irá"], correctIndex: 0 },
      { type: "mcq", question: "¿Cuál es la forma de 'SER/IR' para 'nosotros'?", options: ["fuimos", "éramos", "fueron", "íbamos"], correctIndex: 0 },
      { type: "mcq", question: "Yo ___ que estudiar mucho ayer. (TENER)", options: ["tenía", "tengo", "tuve", "tendré"], correctIndex: 2 },
      { type: "mcq", question: "'Dijeron' es la forma de 'ellos' de:", options: ["dar", "decir", "deber", "dormir"], correctIndex: 1 }
    ]
  }),

  "Imperfect Tense: Uses & Formation": (lang) => ({
    title: "El Pretérito Imperfecto — Usos y Formación",
    explanation: `### El Pretérito Imperfecto — El Pasado Continuo

El imperfecto describe acciones **habituales, continuas o descriptivas** en el pasado. Contrasta con el indefinido.

#### Formación:
| Pronombre | -AR (hablar) | -ER/-IR (comer/vivir) |
|:---:|:---:|:---:|
| yo | habl**aba** | com**ía** / viv**ía** |
| tú | habl**abas** | com**ías** / viv**ías** |
| él/ella | habl**aba** | com**ía** / viv**ía** |
| nosotros | habl**ábamos** | com**íamos** |
| vosotros | habl**abais** | com**íais** |
| ellos | habl**aban** | com**ían** |

#### Solo 3 irregulares:
| Verbo | yo | tú | él |
|:---|:---:|:---:|:---:|
| **ser** | era | eras | era |
| **ir** | iba | ibas | iba |
| **ver** | veía | veías | veía |

#### ¿Cuándo usar el Imperfecto?
1. **Hábitos del pasado**: Cuando era niño, **comía** tajín todos los viernes.
2. **Descripción en el pasado**: La ciudad **era** muy tranquila.
3. **Acción interrumpida** (con Indefinido): **Estudiaba** cuando me **llamó** mi amigo.
4. **Hora en el pasado**: **Eran** las 3 cuando llegué.
5. **Cortesía**: **Quería** preguntarte algo.`,
    vocabulary: [
      { spanish: "cuando era niño/a", dynamicLang: lang === "ar" ? "عندما كنت صغيراً" : lang === "fr" ? "quand j'étais enfant" : "when I was a child", explanation: "Fórmula clásica del imperfecto" },
      { spanish: "solía + infinitivo", dynamicLang: lang === "ar" ? "كان يعتاد على" : lang === "fr" ? "j'avais l'habitude de" : "used to + verb", explanation: "Solía estudiar en la biblioteca" },
      { spanish: "antes", dynamicLang: lang === "ar" ? "قبل / في السابق" : lang === "fr" ? "avant / autrefois" : "before / used to", explanation: "Antes vivía en Casablanca" },
      { spanish: "siempre", dynamicLang: lang === "ar" ? "دائماً" : lang === "fr" ? "toujours" : "always", explanation: "Siempre desayunaba con mi familia" },
      { spanish: "era", dynamicLang: lang === "ar" ? "كان" : lang === "fr" ? "c'était / il était" : "it was / I was / he was", explanation: "SER en imperfecto — solo 3 irregulares" }
    ],
    practice: [
      { type: "mcq", question: "Cuando era pequeño, ___ (jugar) en la calle.", options: ["jugué", "jugaba", "jugaré", "juego"], correctIndex: 1 },
      { type: "mcq", question: "¿Cuándo NO usarías el imperfecto?", options: ["Hablar de hábitos pasados", "Describir el pasado", "Una acción terminada específica", "Acción interrumpida"], correctIndex: 2 },
      { type: "mcq", question: "¿Cuál es el imperfecto de 'ser' para 'yo'?", options: ["fui", "era", "sería", "seré"], correctIndex: 1 },
      { type: "mcq", question: "Completa: '___ las 8 cuando llegué a clase'", options: ["Fueron", "Eran", "Son", "Serán"], correctIndex: 1 },
      { type: "mcq", question: "Antes ___ (vivir) en Marruecos.", options: ["viví", "vivo", "vivía", "viviré"], correctIndex: 2 }
    ]
  }),

  "Reflexive Verbs & Daily Routines": (lang) => ({
    title: "Los Verbos Reflexivos y la Rutina Diaria",
    explanation: `### Verbos Reflexivos — Cuando la Acción Recae sobre Uno Mismo

Un verbo reflexivo indica que el sujeto realiza y recibe la acción. Se reconocen por el pronombre reflexivo.

#### Pronombres reflexivos:
| Pronombre | Reflexivo |
|:---:|:---:|
| yo | **me** |
| tú | **te** |
| él/ella/usted | **se** |
| nosotros | **nos** |
| vosotros | **os** |
| ellos/ustedes | **se** |

#### Verbos reflexivos de la rutina:
| Infinitivo | Significado | Ejemplo |
|:---|:---|:---|
| **levantarse** | to get up | Me levanto a las 7 |
| **ducharse** | to shower | Me ducho cada mañana |
| **afeitarse** | to shave | Mi padre se afeita |
| **peinarse** | to comb hair | Se peina antes de salir |
| **maquillarse** | to put on makeup | Se maquilla en 5 minutos |
| **vestirse** | to get dressed | Nos vestimos para la clase |
| **sentarse** | to sit down | Siéntate aquí |
| **acostarse** | to go to bed | Me acuesto a las 23h |
| **dormirse** | to fall asleep | Me duermo rápido |

#### ¿Reflexivo vs. No reflexivo?
- **Lavar** (to wash) vs. **lavarse** (to wash oneself)
  - Lavo los platos. (I wash the dishes)
  - Me lavo las manos. (I wash my hands)`,
    vocabulary: [
      { spanish: "levantarse", dynamicLang: lang === "ar" ? "يستيقظ ويقوم" : lang === "fr" ? "se lever" : "to get up", explanation: "Me levanto — te levantas — se levanta" },
      { spanish: "ducharse", dynamicLang: lang === "ar" ? "يستحم" : lang === "fr" ? "se doucher" : "to take a shower", explanation: "Me ducho todos los días" },
      { spanish: "vestirse", dynamicLang: lang === "ar" ? "يلبس ملابسه" : lang === "fr" ? "s'habiller" : "to get dressed", explanation: "Me visto para ir a la uni" },
      { spanish: "acostarse", dynamicLang: lang === "ar" ? "يذهب للنوم" : lang === "fr" ? "se coucher" : "to go to bed", explanation: "Me acuesto a medianoche" },
      { spanish: "me llamo", dynamicLang: lang === "ar" ? "اسمي" : lang === "fr" ? "je m'appelle" : "my name is", explanation: "Llamarse — verbo reflexivo para el nombre" }
    ],
    practice: [
      { type: "mcq", question: "¿Cuál es el pronombre reflexivo de 'nosotros'?", options: ["me", "te", "nos", "se"], correctIndex: 2 },
      { type: "mcq", question: "Ella ___ (ducharse) por la mañana.", options: ["se ducha", "me ducho", "te duchas", "ducha"], correctIndex: 0 },
      { type: "mcq", question: "'Me visto' significa:", options: ["I dress someone", "I get dressed", "He gets dressed", "We get dressed"], correctIndex: 1 },
      { type: "mcq", question: "¿Cuál es reflexivo?", options: ["lavar los platos", "lavarse las manos", "lavar la ropa", "lavar el coche"], correctIndex: 1 },
      { type: "mcq", question: "¿Cuál es el orden correcto de la mañana?", options: ["vestirse, levantarse, ducharse", "levantarse, ducharse, vestirse", "ducharse, vestirse, levantarse", "vestirse, ducharse, levantarse"], correctIndex: 1 }
    ]
  }),

  "Object Pronouns: Direct & Indirect": (lang) => ({
    title: "Los Pronombres de Objeto Directo e Indirecto",
    explanation: `### Pronombres de Complemento Directo e Indirecto

#### Pronombres de Objeto Directo (POD) — responde a ¿qué? / ¿quién?:
| Persona | POD |
|:---:|:---:|
| yo | **me** |
| tú | **te** |
| él | **lo** |
| ella | **la** |
| nosotros | **nos** |
| vosotros | **os** |
| ellos | **los** |
| ellas | **las** |

**Ejemplo:** ¿Tienes el libro? Sí, **lo** tengo.
¿Conoces a María? Sí, **la** conozco.

#### Pronombres de Objeto Indirecto (POI) — responde a ¿a quién? / ¿para quién?:
| Persona | POI |
|:---:|:---:|
| yo | **me** |
| tú | **te** |
| él/ella | **le** |
| nosotros | **nos** |
| vosotros | **os** |
| ellos/ellas | **les** |

**Ejemplo:** Doy el libro **a María** → Le doy el libro.

#### Cuando se combinan POI + POD:
Le/les + lo/la/los/las → **SE** + lo/la/los/las
- Le doy el libro → **Se** lo doy.

#### Posición del pronombre:
- Antes del verbo conjugado: **Lo** estudio.
- Después del infinitivo/gerundio: Voy a estudi**arlo** / Estoy estudi**ándolo**`,
    vocabulary: [
      { spanish: "lo / la", dynamicLang: lang === "ar" ? "إياه / إياها (مفعول مباشر)" : lang === "fr" ? "le / la (COD)" : "him/it / her/it (direct object)", explanation: "Para sustituir el objeto directo" },
      { spanish: "le / les", dynamicLang: lang === "ar" ? "له / لهم (مفعول غير مباشر)" : lang === "fr" ? "lui / leur (COI)" : "to him/her / to them (indirect)", explanation: "Para el objeto indirecto (a + persona)" },
      { spanish: "¿Lo tienes?", dynamicLang: lang === "ar" ? "هل عندك إياه؟" : lang === "fr" ? "Tu l'as?" : "Do you have it?", explanation: "Lo = el libro / el documento" },
      { spanish: "Se lo doy", dynamicLang: lang === "ar" ? "أعطيه إياه" : lang === "fr" ? "Je le lui donne" : "I give it to him/her", explanation: "Le + lo → Se lo (combinación)" },
      { spanish: "me lo explica", dynamicLang: lang === "ar" ? "يشرحه لي" : lang === "fr" ? "il me l'explique" : "he explains it to me", explanation: "POI (me) + POD (lo)" }
    ],
    practice: [
      { type: "mcq", question: "¿Tienes el pasaporte? Sí, ___ tengo.", options: ["la", "le", "lo", "les"], correctIndex: 2 },
      { type: "mcq", question: "Doy el documento a la profesora. → ___ doy el documento.", options: ["Lo", "La", "Le", "Les"], correctIndex: 2 },
      { type: "mcq", question: "Le doy el libro a ella. → ___ lo doy.", options: ["Le", "Les", "Lo", "Se"], correctIndex: 3 },
      { type: "mcq", question: "¿Dónde va el pronombre con un infinitivo?", options: ["Antes del infinitivo solo", "Después del infinitivo (adjunto)", "Ambas posiciones son correctas", "Nunca con infinitivo"], correctIndex: 2 },
      { type: "mcq", question: "¿Cuál es el POD femenino plural?", options: ["los", "les", "las", "le"], correctIndex: 2 }
    ]
  }),

  "Accommodation & Rental Vocabulary": (lang) => ({
    title: "El Alojamiento y el Contrato de Alquiler",
    explanation: `### Buscar Piso en España — Vocabulario Esencial

Como estudiante en España, necesitarás entender contratos de alquiler y comunicarte con propietarios y agencias.

#### Tipos de alojamiento:
| Tipo | Descripción | Precio aprox. |
|:---|:---|:---|
| **Piso compartido** | Habitación en piso con otros | 300-600€/mes |
| **Residencia universitaria** | Campus o gestionada | 500-900€/mes |
| **Estudio** | Piso pequeño individual | 600-1000€/mes |
| **Piso entero** | Apartamento completo | 800-1500€/mes |

#### Vocabulario del contrato de alquiler:
| Español | ${lang === "ar" ? "العربية" : lang === "fr" ? "Français" : "English"} |
|:---|:---|
| el alquiler | ${lang === "ar" ? "الإيجار" : lang === "fr" ? "le loyer" : "the rent"} |
| la fianza | ${lang === "ar" ? "ضمان الإيجار" : lang === "fr" ? "la caution" : "the deposit"} |
| el contrato | ${lang === "ar" ? "العقد" : lang === "fr" ? "le contrat" : "the contract"} |
| el propietario | ${lang === "ar" ? "المالك" : lang === "fr" ? "le propriétaire" : "the landlord"} |
| el inquilino | ${lang === "ar" ? "المستأجر" : lang === "fr" ? "le locataire" : "the tenant"} |
| los gastos incluidos | ${lang === "ar" ? "المصاريف مشمولة" : lang === "fr" ? "charges comprises" : "bills included"} |
| el empadronamiento | ${lang === "ar" ? "تسجيل السكن البلدي" : lang === "fr" ? "l'enregistrement municipal" : "municipal registration"} |

#### ¡OJO! El empadronamiento:
Es **obligatorio** registrarse en el padrón municipal de tu ciudad. Lo necesitas para muchos trámites: NIE, tarjeta sanitaria, becas...`,
    vocabulary: [
      { spanish: "el alquiler", dynamicLang: lang === "ar" ? "الإيجار" : lang === "fr" ? "le loyer" : "the rent", explanation: "El alquiler se paga mensualmente" },
      { spanish: "la fianza", dynamicLang: lang === "ar" ? "ضمان/كفالة" : lang === "fr" ? "la caution" : "the deposit", explanation: "Normalmente equivale a 1-2 meses de alquiler" },
      { spanish: "el empadronamiento", dynamicLang: lang === "ar" ? "التسجيل البلدي" : lang === "fr" ? "l'inscription en mairie" : "municipal registration", explanation: "Obligatorio para todos los residentes en España" },
      { spanish: "el piso compartido", dynamicLang: lang === "ar" ? "الشقة المشتركة" : lang === "fr" ? "la colocation" : "shared apartment", explanation: "La opción más económica para estudiantes" },
      { spanish: "los gastos incluidos", dynamicLang: lang === "ar" ? "المصاريف مشمولة" : lang === "fr" ? "charges comprises" : "bills included", explanation: "Agua, luz, internet incluidos en el precio" }
    ],
    practice: [
      { type: "mcq", question: "¿Qué es la fianza?", options: ["El alquiler mensual", "Un depósito de garantía al inicio", "Los gastos del mes", "El precio del contrato"], correctIndex: 1 },
      { type: "mcq", question: "¿Para qué necesitas el empadronamiento en España?", options: ["Solo para votar", "Para trámites como NIE, sanidad, becas", "Solo si trabajas", "Para abrir una empresa"], correctIndex: 1 },
      { type: "mcq", question: "¿Cuál es la opción más económica para un estudiante?", options: ["Piso entero", "Hotel", "Piso compartido", "Aparthotel"], correctIndex: 2 },
      { type: "mcq", question: "El inquilino es:", options: ["El propietario del piso", "La agencia inmobiliaria", "La persona que alquila el piso", "El vecino"], correctIndex: 2 },
      { type: "mcq", question: "'Gastos incluidos' significa:", options: ["Que pagas todos los gastos aparte", "Que el agua y la luz están incluidos en el precio", "Que no hay gastos", "Que pagas más"], correctIndex: 1 }
    ]
  }),

  "Introduction to Subjunctive Mood": (lang) => ({
    title: "Introducción al Modo Subjuntivo",
    explanation: `### El Subjuntivo — El Modo de la Subjetividad

El subjuntivo es uno de los temas más desafiantes del español, pero es esencial para el nivel B1-B2.

#### ¿Qué es el subjuntivo?
El subjuntivo expresa **subjetividad**: deseos, dudas, emociones, recomendaciones, hipótesis. Se usa siempre en oraciones subordinadas (con "que").

#### Formación del Presente de Subjuntivo:
**Regla:** Toma la forma "yo" del presente indicativo, quita la -o, y añade las terminaciones opuestas.

| | -AR → terminaciones -ER/-IR | -ER/-IR → terminaciones -AR |
|:---:|:---:|:---:|
| yo | habl**e** | com**a** |
| tú | habl**es** | com**as** |
| él | habl**e** | com**a** |
| nosotros | habl**emos** | com**amos** |
| vosotros | habl**éis** | com**áis** |
| ellos | habl**en** | com**an** |

#### Cuándo usar el subjuntivo (WEIRDO):
- **W**ishes (deseos): Quiero que **vengas**
- **E**motion (emociones): Me alegra que **estés** aquí
- **I**mpersonal expressions: Es importante que **estudies**
- **R**ecommendations: Te recomiendo que **vayas**
- **D**oubt/Denial: No creo que **sea** verdad
- **O**jalá: ¡Ojalá **apruebe** el examen!`,
    vocabulary: [
      { spanish: "quiero que...", dynamicLang: lang === "ar" ? "أريد أن..." : lang === "fr" ? "je veux que..." : "I want you to...", explanation: "Deseo + que + subjuntivo" },
      { spanish: "es importante que", dynamicLang: lang === "ar" ? "من المهم أن" : lang === "fr" ? "il est important que" : "it's important that", explanation: "Expresión impersonal + subjuntivo" },
      { spanish: "¡Ojalá!", dynamicLang: lang === "ar" ? "ليتني! / إن شاء الله!" : lang === "fr" ? "Pourvu que! / J'espère que!" : "Hopefully! / I wish!", explanation: "Del árabe: وَاللَّه. Siempre con subjuntivo" },
      { spanish: "no creo que", dynamicLang: lang === "ar" ? "لا أعتقد أن" : lang === "fr" ? "je ne crois pas que" : "I don't think that", explanation: "Duda + subjuntivo" },
      { spanish: "te recomiendo que", dynamicLang: lang === "ar" ? "أنصحك بأن" : lang === "fr" ? "je te recommande de" : "I recommend that you", explanation: "Recomendación + subjuntivo" }
    ],
    practice: [
      { type: "mcq", question: "Quiero que tú ___ (estudiar) más.", options: ["estudias", "estudies", "estudiás", "estudio"], correctIndex: 1 },
      { type: "mcq", question: "Es importante que ___ (llegar) a tiempo.", options: ["llegues", "llegas", "llegan", "llegara"], correctIndex: 0 },
      { type: "mcq", question: "¡Ojalá ___ (aprobar) el examen!", options: ["apruebo", "aprueba", "apruebe", "aprobé"], correctIndex: 2 },
      { type: "mcq", question: "No creo que ___ (ser) verdad.", options: ["es", "sea", "fue", "será"], correctIndex: 1 },
      { type: "mcq", question: "¿Con cuál de estas expresiones NO se usa el subjuntivo?", options: ["Quiero que", "Es importante que", "Sé que", "Ojalá"], correctIndex: 2 }
    ]
  }),

  "Por vs Para — Key Differences": (lang) => ({
    title: "POR vs PARA — Diferencias Clave",
    explanation: `### POR vs PARA — Una de las Distinciones Más Importantes

Ambas preposiciones pueden traducirse como "for", "by", "through" en inglés, pero tienen usos muy diferentes.

#### PARA — usos principales:
| Uso | Ejemplo |
|:---|:---|
| **Destino / Dirección** | Salgo **para** Madrid mañana |
| **Finalidad / Propósito** | Estudio **para** aprobar |
| **Destinatario** | Este libro es **para** ti |
| **Opinión personal** | **Para** mí, el español es fácil |
| **Fecha límite** | Necesito el trabajo **para** el lunes |
| **Comparación inesperada** | Hablas bien **para** ser principiante |

#### POR — usos principales:
| Uso | Ejemplo |
|:---|:---|
| **Causa / Motivo** | Lo hice **por** amor |
| **Duración** | Estudié **por** tres horas |
| **Intercambio** | Pagué 50€ **por** el libro |
| **Movimiento a través** | Paseé **por** el parque |
| **Medio de comunicación** | Te llamo **por** teléfono |
| **Agente en pasiva** | El libro fue escrito **por** Cervantes |
| **Aproximación** | Vivo **por** el centro |

#### Truco mnemotécnico:
- **PARA** = P.A.R.A → **P**ropósito, **A**destinatario, **R**esultado, **A**cceso al futuro
- **POR** = causa, duración, intercambio, movimiento`,
    vocabulary: [
      { spanish: "estudio para aprobar", dynamicLang: lang === "ar" ? "أدرس لكي أنجح" : lang === "fr" ? "j'étudie pour réussir" : "I study in order to pass", explanation: "PARA = finalidad/propósito" },
      { spanish: "por teléfono", dynamicLang: lang === "ar" ? "عبر الهاتف" : lang === "fr" ? "par téléphone" : "by phone", explanation: "POR = medio de comunicación" },
      { spanish: "gracias por", dynamicLang: lang === "ar" ? "شكراً على" : lang === "fr" ? "merci pour" : "thank you for", explanation: "POR = causa (por + razón)" },
      { spanish: "para mí", dynamicLang: lang === "ar" ? "بالنسبة لي" : lang === "fr" ? "pour moi" : "for me / in my opinion", explanation: "PARA = opinión personal" },
      { spanish: "por eso", dynamicLang: lang === "ar" ? "لهذا السبب" : lang === "fr" ? "c'est pourquoi" : "that's why / for that reason", explanation: "POR ESO = conector de causa" }
    ],
    practice: [
      { type: "mcq", question: "Salgo ___ Madrid a las 8.", options: ["por", "para", "de", "en"], correctIndex: 1 },
      { type: "mcq", question: "Estudié ___ cinco horas ayer.", options: ["para", "por", "en", "durante"], correctIndex: 1 },
      { type: "mcq", question: "Este regalo es ___ ti.", options: ["por", "para", "de", "en"], correctIndex: 1 },
      { type: "mcq", question: "Te llamo ___ teléfono esta noche.", options: ["para", "en", "por", "de"], correctIndex: 2 },
      { type: "mcq", question: "Gracias ___ tu ayuda.", options: ["para", "en", "por", "con"], correctIndex: 2 }
    ]
  }),

  "Visa & Enrollment Interview Vocabulary": (lang) => ({
    title: "Vocabulario para Visados y Entrevistas de Admisión",
    explanation: `### Trámites para Estudiar en España — Vocabulario Oficial

#### Documentos necesarios para el visado de estudiante:
| Documento | Descripción |
|:---|:---|
| **Pasaporte vigente** | Con mínimo 6 meses de validez |
| **Carta de aceptación** | De la universidad o escuela española |
| **Seguro médico** | Cobertura total en España |
| **Medios económicos** | Extracto bancario (~600€/mes mínimo) |
| **Certificado de antecedentes penales** | Apostillado y traducido |
| **Título académico apostillado** | Con traducción jurada |

#### Frases para la entrevista consular:
- **¿Cuáles son sus motivos para estudiar en España?**
  - "Quiero estudiar Enfermería porque..."
  - "He sido aceptado en la Universidad de..."
- **¿Tiene medios económicos suficientes?**
  - "Tengo una beca de / mis padres me financian..."
- **¿Dónde va a vivir en España?**
  - "He reservado plaza en la residencia universitaria..."

#### Vocabulario clave:
| Español | ${lang === "ar" ? "العربية" : lang === "fr" ? "Français" : "English"} |
|:---|:---|
| el consulado | ${lang === "ar" ? "القنصلية" : lang === "fr" ? "le consulat" : "consulate"} |
| la apostilla | ${lang === "ar" ? "الأبوستيل" : lang === "fr" ? "l'apostille" : "apostille"} |
| la traducción jurada | ${lang === "ar" ? "الترجمة المحلفة" : lang === "fr" ? "la traduction assermentée" : "certified translation"} |
| el seguro médico | ${lang === "ar" ? "التأمين الطبي" : lang === "fr" ? "l'assurance maladie" : "health insurance"} |`,
    vocabulary: [
      { spanish: "el consulado", dynamicLang: lang === "ar" ? "القنصلية" : lang === "fr" ? "le consulat" : "the consulate", explanation: "Donde solicitas el visado de estudiante" },
      { spanish: "la apostilla", dynamicLang: lang === "ar" ? "الأبوستيل (ختم رسمي)" : lang === "fr" ? "l'apostille (certification)" : "apostille (official certification)", explanation: "Sello internacional que certifica un documento oficial" },
      { spanish: "la traducción jurada", dynamicLang: lang === "ar" ? "الترجمة المحلفة" : lang === "fr" ? "la traduction certifiée" : "certified translation", explanation: "Traducción oficial reconocida legalmente" },
      { spanish: "la carta de aceptación", dynamicLang: lang === "ar" ? "رسالة القبول" : lang === "fr" ? "la lettre d'acceptation" : "acceptance letter", explanation: "Documento de la universidad que confirma tu plaza" },
      { spanish: "el seguro médico", dynamicLang: lang === "ar" ? "التأمين الصحي" : lang === "fr" ? "l'assurance maladie" : "health insurance", explanation: "Obligatorio para el visado de estudiante" }
    ],
    practice: [
      { type: "mcq", question: "¿Qué es la apostilla?", options: ["Un tipo de visa", "Una certificación internacional de documentos oficiales", "Un seguro médico", "Un número de estudiante"], correctIndex: 1 },
      { type: "mcq", question: "¿Dónde solicitas el visado de estudiante en tu país?", options: ["En el ayuntamiento español", "En la universidad", "En el consulado de España", "En la comisaría"], correctIndex: 2 },
      { type: "mcq", question: "¿Para qué sirve la carta de aceptación?", options: ["Para alquilar un piso", "Para demostrar que tienes plaza en una universidad española", "Para abrir una cuenta bancaria", "Para el empadronamiento"], correctIndex: 1 },
      { type: "mcq", question: "¿Cuál es el mínimo de medios económicos que suele pedir el consulado?", options: ["100€/mes", "300€/mes", "600€/mes", "2000€/mes"], correctIndex: 2 },
      { type: "mcq", question: "¿Qué necesitas antes de presentar el título extranjero en España?", options: ["Solo traducirlo", "Apostillarlo y traducirlo juradamente", "Escanearlo", "Nada, vale como está"], correctIndex: 1 }
    ]
  })

};

// Default lesson for unmatched topics
function defaultLesson(topic: string, lang: string): LessonData {
  const tLang = getLang(lang);
  return {
    title: `Lección: ${topic}`,
    explanation: `### ${topic}\n\nEsta lección cubre vocabulario y gramática esencial para el tema seleccionado. Practica con los ejercicios a continuación para reforzar tu comprensión.\n\n**Objetivo:** Dominar las expresiones y estructuras de ${topic} para comunicarte con fluidez en contextos académicos y cotidianos en España.`,
    vocabulary: [
      { spanish: "practicar", dynamicLang: lang === "ar" ? "يتدرب" : lang === "fr" ? "pratiquer" : "to practice", explanation: "La clave del éxito en español" },
      { spanish: "aprender", dynamicLang: lang === "ar" ? "يتعلم" : lang === "fr" ? "apprendre" : "to learn", explanation: "Aprender español es invertir en tu futuro" },
      { spanish: "mejorar", dynamicLang: lang === "ar" ? "يتحسن" : lang === "fr" ? "améliorer" : "to improve", explanation: "Mejora tu nivel cada día" },
      { spanish: "entender", dynamicLang: lang === "ar" ? "يفهم" : lang === "fr" ? "comprendre" : "to understand", explanation: "¿Entiendes la lección?" },
      { spanish: "repetir", dynamicLang: lang === "ar" ? "يكرر" : lang === "fr" ? "répéter" : "to repeat", explanation: "Repite las frases en voz alta" }
    ],
    practice: [
      { type: "mcq", question: "¿Qué significa 'aprender'?", options: ["to forget", "to learn", "to teach", "to read"], correctIndex: 1 },
      { type: "mcq", question: "¿Cuál es sinónimo de 'mejorar'?", options: ["empeorar", "progresar", "olvidar", "repetir"], correctIndex: 1 },
      { type: "mcq", question: "Para hablar bien español necesitas:", options: ["Solo leer", "Solo escribir", "Practicar todos los días", "Memorizar el diccionario"], correctIndex: 2 },
      { type: "mcq", question: "¿Qué significa 'entender'?", options: ["to speak", "to write", "to understand", "to listen"], correctIndex: 2 },
      { type: "mcq", question: "La mejor forma de practicar español es:", options: ["Ver películas españolas", "Hablar con nativos", "Leer libros", "Todo lo anterior"], correctIndex: 3 }
    ]
  };
}

export function getFallbackLessonData(lvl: string, topic: string, lang: string): LessonData {
  // Try exact match first
  const exactLesson = LESSONS[topic];
  if (exactLesson) return exactLesson(lang);

  // Try partial match
  for (const key of Object.keys(LESSONS)) {
    if (topic.includes(key.split(" ")[0]) || key.includes(topic.split(" ")[0])) {
      return LESSONS[key](lang);
    }
  }

  // Try keyword matching
  const topicLower = topic.toLowerCase();
  if (topicLower.includes("alphabet") || topicLower.includes("pronunciation")) return LESSONS["Alphabet & Pronunciation"](lang);
  if (topicLower.includes("greet") || topicLower.includes("farewell")) return LESSONS["Greetings & Farewells"](lang);
  if (topicLower.includes("introduc") || topicLower.includes("yourself") || topicLower.includes("age")) return LESSONS["Introducing Yourself & Age"](lang);
  if (topicLower.includes("number") || topicLower.includes("time") || topicLower.includes("hora")) return LESSONS["Numbers 1 to 100 & Telling Time"](lang);
  if (topicLower.includes("family") || topicLower.includes("famil")) return LESSONS["Family Members & Relationships"](lang);
  if (topicLower.includes("gender") || topicLower.includes("article")) return LESSONS["Noun Gender & Articles"](lang);
  if (topicLower.includes("ser") || topicLower.includes("estar")) return LESSONS["SER vs ESTAR — To Be"](lang);
  if (topicLower.includes("-ar") || topicLower.includes("hablar") || topicLower.includes("regular")) return LESSONS["Regular -AR Verbs: Hablar, Estudiar"](lang);
  if (topicLower.includes("routine") || topicLower.includes("daily") || topicLower.includes("activit")) return LESSONS["Daily Activities & Routines"](lang);
  if (topicLower.includes("food") || topicLower.includes("cafe") || topicLower.includes("ordering")) return LESSONS["Ordering Food & Cafe Vocabulary"](lang);
  if (topicLower.includes("weather") || topicLower.includes("season")) return LESSONS["Weather & Seasons"](lang);
  if (topicLower.includes("color") || topicLower.includes("cloth")) return LESSONS["Colors & Clothing"](lang);
  if (topicLower.includes("place") || topicLower.includes("direction")) return LESSONS["Describing Places & Directions"](lang);
  if (topicLower.includes("academic") || topicLower.includes("university") || topicLower.includes("goal")) return LESSONS["My Academic Goals & University Life"](lang);
  if (topicLower.includes("gustar") || topicLower.includes("preference")) return LESSONS["GUSTAR & Preference Verbs"](lang);
  if (topicLower.includes("preterite") || topicLower.includes("indefinido")) {
    if (topicLower.includes("irregular")) return LESSONS["Preterite Tense: Irregular Verbs"](lang);
    return LESSONS["Preterite Tense: Regular Verbs"](lang);
  }
  if (topicLower.includes("imperfect") || topicLower.includes("imperfecto")) return LESSONS["Imperfect Tense: Uses & Formation"](lang);
  if (topicLower.includes("reflexive")) return LESSONS["Reflexive Verbs & Daily Routines"](lang);
  if (topicLower.includes("object pronoun") || topicLower.includes("direct") || topicLower.includes("indirect")) return LESSONS["Object Pronouns: Direct & Indirect"](lang);
  if (topicLower.includes("accommodation") || topicLower.includes("rental") || topicLower.includes("alquiler") || topicLower.includes("housing")) return LESSONS["Accommodation & Rental Vocabulary"](lang);
  if (topicLower.includes("subjunctive") || topicLower.includes("subjuntivo")) return LESSONS["Introduction to Subjunctive Mood"](lang);
  if (topicLower.includes("por") || topicLower.includes("para")) return LESSONS["Por vs Para — Key Differences"](lang);
  if (topicLower.includes("visa") || topicLower.includes("enrollment") || topicLower.includes("interview")) return LESSONS["Visa & Enrollment Interview Vocabulary"](lang);

  return defaultLesson(topic, lang);
}
