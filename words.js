// Léxico navideño en español organizado por dificultad y tipos especiales
window.NAVIDAD_WORDS = {
  tier1: [
    "reno", "nieve", "bota", "pino", "oro", "paz", "luz", "vela",
    "mago", "belén", "copa", "uva", "trineo", "regalo", "dulce",
    "canto", "coro", "ángel", "estrella", "duende", "gorro", "lazo",
    "bola", "cena", "fuego", "hogar", "mesa", "noche", "carta", "caja",
    "miel", "nuez", "sidra", "cava", "rosca", "buey", "mula", "paje",
    "arpa", "campana", "copo", "trufa", "cinta", "papel", "saco", "búho"
  ],
  tier2: [
    "navidad", "turrón", "mazapán", "muérdago", "guirnalda", "cascabel",
    "chimenea", "polvorón", "carbón", "esfera", "abrigo", "bufanda",
    "invierno", "nevada", "pandereta", "jengibre", "pastorcito", "pesebre",
    "nochebuena", "nochevieja", "camello", "caramelo", "bombilla",
    "calcetín", "brindis", "familia", "alegría", "ilusión",
    "acebo", "bastón", "canela", "clavo", "estrella", "felicidad",
    "festivo", "glaseado", "zambomba", "juguete", "lentejuela", "manopla",
    "natividad", "muñeco", "espumillón", "paquete", "piñata", "ponche", "postre",
    "presente", "sueño", "tapiz", "ternura", "portal", "trineos", "velada"
  ],
  tier3: [
    "villancico", "papá noel", "reyes magos", "año nuevo", "feliz navidad",
    "roscón de reyes", "árbol navideño", "estrella polar", "taller secreto",
    "galleta de jengibre", "chocolate caliente", "espíritu navideño",
    "cabaña nevada", "campanadas", "polo norte", "carta a santa",
    "luces de colores", "fiesta invernal", "nieve fresca", "coro celestial",
    "trineo mágico", "bolsa de regalos", "estrella de belén", "dulce hogar",
    "manta calentita", "canción de cuna", "copo de nieve", "invierno blanco",
    "deseos de paz", "brillo dorado", "abrazos cálidos", "regalo sorpresa"
  ],
  powerups: [
    { word: "escarcha", type: "freeze", label: "CONGELAR", icon: "❄️" },
    { word: "ventisca", type: "freeze", label: "CONGELAR", icon: "❄️" },
    { word: "destello", type: "clear", label: "ESTALLIDO", icon: "🌟" },
    { word: "bengala", type: "clear", label: "ESTALLIDO", icon: "🌟" },
    { word: "chocolate", type: "heal", label: "+1 VIDA", icon: "☕" },
    { word: "abrazo", type: "heal", label: "+1 VIDA", icon: "❤️" }
  ]
};

// Phrasal Verbs navideños y esenciales en inglés con significado en español
window.PHRASAL_WORDS = {
  tier1: [
    { word: "wrap up", meaning: "Envolver (un regalo) / Terminar algo", example: "Let's wrap up the presents tonight." },
    { word: "put up", meaning: "Colocar o colgar adornos / el árbol", example: "We put up the Christmas tree early." },
    { word: "go out", meaning: "Salir de casa / Apagarse (luces)", example: "The fairy lights suddenly went out." },
    { word: "eat out", meaning: "Comer fuera de casa", example: "Many families eat out on New Year's Eve." },
    { word: "sit by", meaning: "Sentarse junto a algo (la chimenea)", example: "Sit by the warm fireplace and relax." },
    { word: "dig in", meaning: "Empezar a comer con entusiasmo", example: "Christmas dinner is ready, dig in!" },
    { word: "wake up", meaning: "Despertarse", example: "Kids wake up early to open gifts." },
    { word: "stay in", meaning: "Quedarse en casa", example: "Let's stay in while it snows outside." },
    { word: "stay up", meaning: "Quedarse despierto hasta tarde", example: "We stay up waiting for midnight." },
    { word: "turn on", meaning: "Encender (luces, música, aparato)", example: "Turn on the Christmas tree lights." },
    { word: "put on", meaning: "Ponerse (ropa, música)", example: "Put on your warmest wool scarf." },
    { word: "ask for", meaning: "Pedir algo (ej. en una carta)", example: "What did you ask for this Christmas?" },
    { word: "set up", meaning: "Montar / Instalar / Preparar", example: "Help me set up the nativity scene." },
    { word: "mix up", meaning: "Confundir / Mezclar por error", example: "Don't mix up the gift tags!" },
    { word: "add up", meaning: "Sumar / Tener sentido", example: "The elf inventory doesn't add up." },
    { word: "log in", meaning: "Iniciar sesión", example: "Log in to track Santa's sleigh." }
  ],
  tier2: [
    { word: "hang up", meaning: "Colgar (calcetines, guirnaldas)", example: "Hang up the stockings by the chimney." },
    { word: "give out", meaning: "Repartir / Distribuir algo", example: "Santa gives out toys around the world." },
    { word: "pick up", meaning: "Recoger / Comprar de paso", example: "Pick up the dessert on your way home." },
    { word: "warm up", meaning: "Entrar en calor / Calentar", example: "Warm up with a mug of hot cocoa." },
    { word: "open up", meaning: "Abrir (regalos o sincerarse)", example: "Open up your presents right now!" },
    { word: "light up", meaning: "Iluminar / Alegrar el lugar", example: "Candles light up the snowy cabin." },
    { word: "dress up", meaning: "Vestirse elegante o disfrazarse", example: "Everyone dressed up for the holiday dinner." },
    { word: "cheer up", meaning: "Animarse / Alegrar a alguien", example: "Holiday carols always cheer me up." },
    { word: "drop off", meaning: "Dejar o entregar algo de paso", example: "Drop off your letter at the postbox." },
    { word: "hand out", meaning: "Repartir en mano", example: "Elves hand out candy canes at the gate." },
    { word: "send out", meaning: "Enviar (postales, invitaciones)", example: "We send out holiday cards every December." },
    { word: "show up", meaning: "Aparecer / Presentarse", example: "All the cousins showed up for dinner." },
    { word: "tidy up", meaning: "Ordenar / Recoger un poco", example: "Tidy up the room before guests arrive." },
    { word: "clean up", meaning: "Limpiar a fondo", example: "Let's clean up all the wrapping paper." },
    { word: "fill up", meaning: "Llenar por completo", example: "Fill up the sleigh with gift boxes." },
    { word: "turn off", meaning: "Apagar (luces o aparatos)", example: "Turn off the lights before going to sleep." },
    { word: "take off", meaning: "Quitarse ropa / Despegar", example: "The reindeer are ready to take off." },
    { word: "find out", meaning: "Descubrir / Averiguar", example: "Did you find out what is inside the box?" },
    { word: "keep up", meaning: "Mantener el ritmo / Seguir así", example: "Keep up the great typing pace!" },
    { word: "join in", meaning: "Unirse o participar en algo", example: "Come join in singing the carols!" },
    { word: "make up", meaning: "Inventar / Reconciliarse", example: "Let's make up a cozy winter story." },
    { word: "call off", meaning: "Cancelar un evento o plan", example: "They didn't call off the winter parade." },
    { word: "snow in", meaning: "Quedar atrapado por la nieve", example: "We got snowed in at the mountain lodge." },
    { word: "chill out", meaning: "Relajarse / Descansar", example: "Time to chill out beside the tree." }
  ],
  tier3: [
    { word: "get together", meaning: "Reunirse / Juntarse en grupo", example: "Families get together on Christmas Eve." },
    { word: "look forward to", meaning: "Esperar algo con mucha ilusión", example: "I look forward to the holidays all year." },
    { word: "take down", meaning: "Quitar o desmontar adornos", example: "We take down the decorations in January." },
    { word: "count down", meaning: "Hacer la cuenta regresiva", example: "Count down the seconds to New Year!" },
    { word: "bring back", meaning: "Traer de vuelta / Evocar recuerdos", example: "Old carols bring back warm memories." },
    { word: "bundle up", meaning: "Abrigarse muy bien contra el frío", example: "Bundle up before walking in the snow." },
    { word: "run out of", meaning: "Quedarse sin existencias de algo", example: "Don't run out of ribbon in the workshop!" },
    { word: "stock up on", meaning: "Abastecerse de algo en cantidad", example: "Stock up on gingerbread cookies." },
    { word: "catch up with", meaning: "Ponerse al día con alguien", example: "Catch up with old friends this winter." },
    { word: "figure out", meaning: "Descifrar / Entender / Resolver", example: "Try to figure out what's in that box." },
    { word: "carry on with", meaning: "Continuar haciendo algo", example: "Carry on with the gift wrapping." },
    { word: "come over", meaning: "Venir de visita a casa", example: "Come over tonight for hot chocolate!" },
    { word: "come back", meaning: "Regresar / Volver a un lugar", example: "Come back home for the holidays." },
    { word: "break down", meaning: "Averiarse / Dejar de funcionar", example: "The toy conveyor belt won't break down." },
    { word: "cut down on", meaning: "Reducir el consumo de algo", example: "It's hard to cut down on sweets in December." },
    { word: "look after", meaning: "Cuidar de alguien o algo", example: "Elves look after Rudolph and the team." },
    { word: "pass down", meaning: "Transmitir (tradiciones o historias)", example: "Pass down cherished family recipes." },
    { word: "put aside", meaning: "Dejar de lado / Reservar", example: "Put aside worries and enjoy the night." }
  ],
  powerups: [
    { word: "snowstorm", type: "freeze", label: "FREEZE", icon: "❄️", meaning: "Tormenta de nieve · Congela la caída 4.5s", example: "Ralentiza todos los regalos en pantalla." },
    { word: "frostbite", type: "freeze", label: "FREEZE", icon: "❄️", meaning: "Helada polar · Congela la caída 4.5s", example: "Ralentiza todos los regalos en pantalla." },
    { word: "starlight", type: "clear", label: "STARBURST", icon: "🌟", meaning: "Luz estelar · Despeja la pantalla", example: "Completa todos los regalos activos." },
    { word: "fireworks", type: "clear", label: "STARBURST", icon: "🌟", meaning: "Fuegos artificiales · Despeja la pantalla", example: "Completa todos los regalos activos." },
    { word: "hot cocoa", type: "heal", label: "+1 LIFE", icon: "☕", meaning: "Chocolate caliente · Recupera +1 vida", example: "Restaura un corazón del taller." },
    { word: "warm hug", type: "heal", label: "+1 LIFE", icon: "❤️", meaning: "Abrazo cálido · Recupera +1 vida", example: "Restaura un corazón del taller." }
  ]
};
