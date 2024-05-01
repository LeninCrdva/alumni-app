import { Component, OnInit } from '@angular/core';
import { AdministradorService } from '../../../data/service/administrador.service';
import { Administrador2 } from '../../../data/model/administrador';
import { UserService } from '../../../data/service/UserService';
import { UsuarioFixed } from '../../../data/model/usuario';
import { Persona } from '../../../data/model/persona';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css', '../../../../assets/prefabs/PerfilUser.css']
})
export class PerfilUsuarioComponent implements OnInit {

  person: Persona = new Persona();
  admin: Administrador2 = new Administrador2();
  photoURL: any;
  public idUser: any = localStorage.getItem('user_id');
  aficiones: any[] = []
  aficionSeleccionada: any;
  userData: UsuarioFixed = new UsuarioFixed();

  ngOnInit() {
    this.loadDATAJson();
    this.seleccionarAficionAleatoria();
    this.getUserData();
  }

  constructor(private adminService: AdministradorService, private userService: UserService) { }

  getUserData() {
    this.userService.getUserById(this.idUser).subscribe(data => {
      this.userData = data;
      this.person = data.persona;
      this.getAdminByUserId();
    });
  }

  getAdminByUserId(): void {
    this.adminService.getAdministradorByUserId(this.idUser).subscribe(data => {
      this.admin = data;
      this.getPhotoUrl();
    });
  }

  getPhotoUrl() {
    const userIdStorage = localStorage.getItem('name');
    if (userIdStorage !== null) {
      this.userService.getUserByUsername(userIdStorage).subscribe(data => {
        this.photoURL = data.urlImagen;
      });
    }
  }

  seleccionarAficionAleatoria(): void {
    const indiceAleatorio = Math.floor(Math.random() * this.aficiones.length);
    this.aficionSeleccionada = this.aficiones[indiceAleatorio];
  }

  loadDATAJson() {
    this.aficiones = [
      {
        "aficion": "🌿 Amante de la naturaleza",
        "descripcion": "Disfruta de sumergirse en la belleza natural del mundo, participando en actividades al aire libre como senderismo, acampar, observar aves y pasear por parques. Encuentra paz y conexión en entornos naturales, apreciando la flora y fauna que los rodea."
      },
      {
        "aficion": "💻 Desarrollo de software",
        "descripcion": "Se sumerge en el fascinante mundo del desarrollo de software, donde cada línea de código es una oportunidad para crear algo nuevo. Apasionado por resolver problemas con algoritmos elegantes, construir aplicaciones innovadoras y aprender constantemente sobre las últimas tecnologías."
      },
      {
        "aficion": "📚 Lectura",
        "descripcion": "Explora mundos infinitos a través de la lectura, abrazando libros de ficción, no ficción y poesía. Cada página es una puerta a la aventura, el conocimiento y la expansión de la imaginación. Devora historias con entusiasmo, siempre en busca de nuevas ideas y perspectivas."
      },
      {
        "aficion": "👩‍🍳 Cocina",
        "descripcion": "Transforma la cocina en un laboratorio creativo, experimentando con ingredientes y sabores. La pasión por la cocina va más allá de la preparación de alimentos; es un acto de amor y creatividad. Comparte creaciones culinarias con amigos y familiares, convirtiendo cada comida en una experiencia única."
      },
      {
        "aficion": "✈️ Viajar",
        "descripcion": "Explora el mundo con ojos curiosos, absorbiendo la riqueza de diversas culturas y paisajes. Cada viaje es una oportunidad para sumergirse en nuevas experiencias, probar sabores auténticos, y construir recuerdos inolvidables. La pasión por viajar es un constante deseo de aventura y descubrimiento."
      },
      {
        "aficion": "⚽ Deportes",
        "descripcion": "Abraza la vitalidad y la competitividad a través de la práctica de deportes. Ya sea en un campo de fútbol, una cancha de baloncesto o en el agua nadando, encuentra en el deporte una forma de mantenerse en forma, socializar y disfrutar del espíritu del juego en equipo."
      },
      {
        "aficion": "🎵 Música",
        "descripcion": "Vive en armonía con la música, ya sea escuchándola, tocando instrumentos o asistiendo a conciertos. La música es más que sonido; es una expresión profunda de emociones y creatividad. Cada nota resuena con sentimientos, creando conexiones emocionales y experiencias memorables."
      },
      {
        "aficion": "🎨 Arte",
        "descripcion": "Transforma la imaginación en obras visuales, ya sea pintando, dibujando o esculpiendo. El arte es una forma de expresión auténtica, donde cada trazo cuenta una historia y cada obra refleja la creatividad única. Encuentra en la creación artística una vía para comunicar emociones y perspectivas."
      },
      {
        "aficion": "🤝 Voluntariado",
        "descripcion": "Dedica tiempo y energía a causas solidarias, contribuyendo a comunidades y proyectos sociales. Ya sea en organizaciones sin fines de lucro o en iniciativas locales, el voluntariado es una expresión de empatía y compromiso con el bienestar de los demás."
      },
      {
        "aficion": "🎲 Juegos de mesa",
        "descripcion": "Convierte el tiempo de ocio en emocionantes partidas de juegos de mesa. Desde estrategias elaboradas hasta risas compartidas, cada juego es una oportunidad para fortalecer lazos con amigos y familiares, creando memorias duraderas en torno a una mesa llena de diversión."
      },
      {
        "aficion": "🌐 Aprender idiomas",
        "descripcion": "Abraza la diversidad lingüística, sumergiéndose en la fascinante tarea de aprender nuevos idiomas. Cada palabra es una puerta a una cultura diferente, permitiendo la conexión con personas de todo el mundo. La pasión por los idiomas es una aventura continua de descubrimiento y comprensión."
      },
      {
        "aficion": "🌷 Jardinería",
        "descripcion": "Cultiva la conexión con la naturaleza a través de la jardinería, cuidando plantas, flores y árboles. La tierra se convierte en un lienzo donde cada planta es una expresión de creatividad y paciencia. La jardinería es un acto de amor por la vida vegetal y un refugio de serenidad."
      },
      {
        "aficion": "📸 Fotografía",
        "descripcion": "Captura momentos efímeros con una cámara, inmortalizando experiencias y emociones. La fotografía va más allá de la técnica; es una forma de ver el mundo a través de una lente única. Cada imagen cuenta una historia, congelando el tiempo en una composición visualmente impactante."
      },
      {
        "aficion": "📝 Escritura",
        "descripcion": "Da vida a pensamientos, emociones e ideas a través de la escritura. Ya sea en forma de historias, poemas o artículos, cada palabra es una expresión de creatividad y autenticidad. La escritura es un medio para explorar el mundo interior y compartir perspectivas con el exterior."
      },
      {
        "aficion": "🧘 Meditación",
        "descripcion": "Encuentra paz interior y equilibrio a través de la meditación. En un mundo acelerado, la meditación es una pausa consciente, una práctica para reducir el estrés, aumentar la concentración y conectar con la tranquilidad interna. Cada sesión es un viaje hacia la serenidad."
      },
      {
        "aficion": "🧘‍♂️ Yoga",
        "descripcion": "Alinea mente, cuerpo y espíritu a través de la práctica del yoga. Cada postura es una celebración de fuerza, flexibilidad y bienestar general. El yoga no es solo un ejercicio físico, sino una filosofía de vida que nutre el cuerpo y la mente, creando armonía interior."
      },
      {
        "aficion": "💃 Baile",
        "descripcion": "Expresa alegría, emociones y vitalidad a través del baile. Ya sea en la intimidad del hogar o en la pista de baile, cada movimiento es una manifestación de energía positiva y autenticidad. El baile no solo es un ejercicio, sino una celebración de la vida en movimiento."
      },
      {
        "aficion": "🎬 Cine",
        "descripcion": "Explora mundos cinematográficos, disfrutando de películas de diversos géneros. El cine es una ventana a la imaginación, una experiencia que va más allá de la pantalla. Cada película es una oportunidad para sumergirse en historias cautivadoras y descubrir nuevas perspectivas."
      },
      {
        "aficion": "🎮 Videojuegos",
        "descripcion": "Sumérgete en mundos virtuales, disfrutando de la diversión y desafíos que ofrecen los videojuegos. Más que simples entretenimientos, los videojuegos son experiencias interactivas, narrativas envolventes y ocasiones para superar desafíos. Cada juego es una aventura única en el reino digital."
      },
      {
        "aficion": "🧵 Costura",
        "descripcion": "Crea prendas, accesorios y proyectos de decoración del hogar con tela e hilo. La costura es más que una habilidad; es una forma de expresar creatividad y estilo personal. Cada puntada es un acto de amor por la confección y la materialización de ideas en textiles."
      },
      {
        "aficion": "🔨 Carpintería",
        "descripcion": "Da forma a la madera con habilidad y creatividad, construyendo muebles, juguetes y objetos únicos. La carpintería es un arte funcional, donde cada pieza tallada cuenta una historia de destreza y dedicación. Cada proyecto es una manifestación tangible de habilidades y visión artística."
      },
      {
        "aficion": "🔭 Astronomía",
        "descripcion": "Explora el vasto cosmos, observando estrellas, planetas y otros objetos celestes. La astronomía es una conexión con el universo, una oportunidad para maravillarse ante la inmensidad del espacio. Cada observación es un recordatorio de la belleza y misterio que se extiende sobre nosotros."
      },
      {
        "aficion": "✒️ Caligrafía",
        "descripcion": "Disfruta del arte de escribir a mano con letras bellas y elegantes. Cada trazo es una expresión de estilo y gracia, convirtiendo las palabras en obras de arte visuales. La caligrafía no es solo escritura; es una forma de embellecer la comunicación con trazos cuidados y expresivos."
      },
      {
        "aficion": "♟️ Ajedrez",
        "descripcion": "Sumérgete en el fascinante juego del ajedrez, desafiando la mente y mejorando la estrategia. Cada movimiento es una decisión estratégica, una oportunidad para anticipar y superar al oponente. El ajedrez es más que un juego; es una danza mental llena de ingenio y planificación."
      },
      {
        "aficion": "👾 Coleccionismo",
        "descripcion": "Sumérgete en el mundo del coleccionismo, reuniendo objetos como sellos, monedas, cómics o figuras de acción. Cada pieza es más que un objeto; es un tesoro personal lleno de significado y nostalgia. El coleccionismo es una conexión tangible con la historia y los recuerdos."
      },
      {
        "aficion": "🍷 Degustación de vinos",
        "descripcion": "Explora el fascinante mundo del vino, aprendiendo sobre variedades, degustando sabores y maridándolos con exquisita comida. La degustación de vinos va más allá del paladar; es una experiencia sensorial que celebra la diversidad de aromas y notas en cada copa."
      },
      {
        "aficion": "🔍 Genealogía",
        "descripcion": "Investiga la historia de la familia, descubriendo ancestros y conectando con raíces. La genealogía es una búsqueda apasionante, un viaje en el tiempo que revela historias familiares y conexiones perdidas. Cada descubrimiento es un eslabón en la cadena de la historia personal."
      },
      {
        "aficion": "🌱 Huerto urbano",
        "descripcion": "Sumérgete en la agricultura urbana, cultivando frutas, verduras y hierbas aromáticas en casa. Cada planta es una conexión con la tierra y una oportunidad para disfrutar de productos frescos cultivados con cuidado propio. El huerto urbano es un rincón verde en la vida diaria."
      },
      {
        "aficion": "🎨 Origami",
        "descripcion": "Explora el arte japonés del origami, creando figuras de papel mediante técnicas de plegado. Cada doblez es un acto de precisión y paciencia, transformando una simple hoja en una obra tridimensional. El origami es más que una manualidad; es una expresión artística con papel como lienzo."
      },
      {
        "aficion": "🎣 Pesca",
        "descripcion": "Disfruta de la paz y relajación que ofrece la pesca, conectando con la naturaleza mientras esperas la captura perfecta. Cada día de pesca es una aventura en la que la paciencia se combina con la emoción de la posible captura. La pesca es un escape tranquilo a entornos naturales."
      },
      {
        "aficion": "🧵 Punto de cruz",
        "descripcion": "Embárcate en el mundo del bordado con aguja e hilo, creando diseños encantadores con cada puntada. Cada hilo es una expresión de creatividad y atención al detalle, transformando tela en una obra de arte con patrones cuidadosamente elaborados. El punto de cruz es una forma de arte textil."
      },
      {
        "aficion": "📻 Radioafición",
        "descripcion": "Explora el emocionante mundo de la radioafición, comunicándote con otras personas a través de ondas de radio. Cada transmisión es una conexión con personas de todo el mundo, compartiendo historias, conocimientos y amistades a través del éter. La radioafición es una ventana a la comunicación global."
      },
      {
        "aficion": "🎨 Tatuajes",
        "descripcion": "Decora el cuerpo con tatuajes que expresan personalidad, historias y emociones. Cada tatuaje es una obra de arte única, una manifestación de identidad y creatividad. Los tatuajes van más allá de la piel; son una forma de expresión visual y un lienzo personal en constante evolución."
      },
      {
        "aficion": "🐾 Voluntariado animal",
        "descripcion": "Dedica tiempo y esfuerzo a ayudar a animales en refugios o asociaciones protectoras. Cada acción es un acto de compasión y protección de los más vulnerables. El voluntariado animal es una conexión especial con seres que necesitan amor y cuidado en la comunidad."
      },
      {
        "aficion": "🦜 Observación de aves",
        "descripcion": "Disfruta de la belleza alada de la naturaleza, observando aves en su hábitat natural e identificando diferentes especies. Cada ave es una maravilla única, y cada observación es una oportunidad para conectarse con la biodiversidad y la libertad alada."
      },
      {
        "aficion": "🪂 Paracaidismo",
        "descripcion": "Experimenta la emoción pura de la caída libre y la adrenalina al saltar en paracaídas. Cada salto es una hazaña audaz, desafiando los límites del cielo y la gravedad. El paracaidismo es una aventura extrema que libera la mente y el espíritu en el aire."
      },
      {
        "aficion": "🤿 Buceo",
        "descripcion": "Sumérgete en las profundidades del mundo submarino, explorando la vida marina y los secretos del océano. Cada inmersión es una conexión con un ecosistema fascinante, lleno de colores, formas y criaturas asombrosas. El buceo es una aventura acuática que revela la belleza oculta del mar."
      },
      {
        "aficion": "📝 Escribir un blog",
        "descripcion": "Comparte ideas, experiencias y conocimientos con el mundo a través de un blog personal. Cada publicación es una ventana a tu perspectiva única, una oportunidad para conectar con una audiencia global. Escribir un blog es más que una actividad; es un diálogo continuo con el mundo."
      }
    ];
  }
}