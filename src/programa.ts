const nombre = document.querySelector<HTMLElement>('.nombre');
const cabecera = document.querySelector<HTMLElement>('.cabecera');
const navegacion = document.querySelector<HTMLElement>('.navegacion');
const herramientas = document.querySelector<HTMLElement>('.herramientas');
const indicador = document.querySelector<HTMLElement>('#valor-profundidad');
const apertura = document.querySelector<HTMLElement>('.apertura');
const cierre = document.querySelector<HTMLElement>('.cierre');
const preferenciaMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
const pantallaEstrecha = window.matchMedia('(max-width: 760px)');

if (nombre && cabecera && apertura && cierre && indicador) {
  let pausado = preferenciaMovimiento.matches;
  let fotograma = 0;
  let temporizador = 0;
  let paso = 0;
  let desplazamientoMaximo = 1;
  let anchoNombre = 1;
  let altoNombre = 1;
  let escalaFinal = 1;
  let centroInicial = 0;
  let centroFinal = 0;
  let centroRecorrido = 0;
  let inicioCabecera = 0;
  let tramoContraccion = 1;

  const limitar = (valor: number, minimo = 0, maximo = 1) => Math.min(maximo, Math.max(minimo, valor));

  /** Una posición normalizada: abrir textos o cambiar el tamaño conserva el recorrido completo. */
  const medirRecorrido = () => {
    if (!nombre || !cabecera) return;
    desplazamientoMaximo = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    anchoNombre = nombre.offsetWidth;
    altoNombre = nombre.offsetHeight;

    const practica = document.querySelector<HTMLElement>('.practica');
    const historia = document.querySelector<HTMLElement>('.historia');
    if (!practica || !historia) return;

    const rectPractica = practica.getBoundingClientRect();
    const rectHistoria = historia.getBoundingClientRect();
    const corredor = rectHistoria.left - rectPractica.right - 128;
    const estrecha = pantallaEstrecha.matches;

    // En móvil la palabra gira y utiliza el margen reservado, sin cubrir los párrafos.
    escalaFinal = estrecha ? Math.min(0.34, 25 / altoNombre) : limitar(corredor / anchoNombre, 0.12, 1);
    const umbral = document.querySelector<HTMLElement>('.umbral');
    const separacionNombre = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--separacion-nombre')
    );
    centroInicial = (umbral?.offsetTop ?? 0) + separacionNombre + altoNombre / 2;
    const altoNavegacion = navegacion?.offsetHeight ?? 0;
    const altoCabecera = altoNavegacion + cabecera.offsetHeight;
    inicioCabecera = (umbral?.offsetTop ?? 0) + (umbral?.offsetHeight ?? 0) - altoNavegacion;
    const altoFinal = (estrecha ? anchoNombre : altoNombre) * escalaFinal;
    centroRecorrido = Math.max(centroInicial, altoCabecera + altoFinal / 2 + 28);
    centroFinal = Math.max(centroRecorrido, window.innerHeight - 86 - altoFinal / 2);
    document.documentElement.style.setProperty('--alto-cabecera', `${altoCabecera}px`);
    document.documentElement.style.setProperty('--alto-navegacion', `${altoNavegacion}px`);
    tramoContraccion = umbral ? Math.max(180, Math.min(520, umbral.offsetHeight * 0.65)) : 200;
    solicitarFotograma();
  };

  const dibujarRecorrido = () => {
    fotograma = 0;
    if (!nombre || !indicador) return;
    const desplazamiento = Math.max(0, window.scrollY);
    const progreso = limitar(desplazamiento / desplazamientoMaximo);
    indicador.textContent = Math.round(progreso * 100)
      .toString()
      .padStart(3, '0');
    cabecera?.classList.toggle('cabecera-flotante', desplazamiento >= inicioCabecera);
    if (pausado) return;

    const contraccion = limitar(desplazamiento / tramoContraccion);
    const transicion = contraccion * contraccion * (3 - 2 * contraccion);
    const escala = 1 + (escalaFinal - 1) * transicion;
    const estrecha = pantallaEstrecha.matches;
    const centroX = window.innerWidth / 2;
    const posicionX = estrecha ? centroX + (window.innerWidth - 30 - centroX) * transicion : centroX;
    const posicionY =
      centroInicial + (centroRecorrido - centroInicial) * transicion + (centroFinal - centroRecorrido) * progreso;

    nombre.style.setProperty('--posicion-x', `${posicionX.toFixed(2)}px`);
    nombre.style.setProperty('--posicion-y', `${posicionY.toFixed(2)}px`);
    nombre.style.setProperty('--escala', escala.toFixed(4));
    nombre.style.setProperty('--giro', `${estrecha ? (90 * transicion).toFixed(2) : 0}deg`);
  };

  const solicitarFotograma = () => {
    if (!fotograma) fotograma = window.requestAnimationFrame(dibujarRecorrido);
  };

  /** Cambia la ortografía visual, conservando el nombre estable para lectores de pantalla. */
  const transformarNombre = () => {
    window.clearTimeout(temporizador);
    if (pausado || document.hidden || !nombre || !apertura || !cierre) return;

    const variantes = ['corchetes', 'parentesis', 'tachado', 'parentesis'];
    const variante = variantes[paso % variantes.length];
    nombre.dataset.variante = variante;
    apertura.textContent = variante === 'parentesis' ? '(' : '[';
    cierre.textContent = variante === 'parentesis' ? ')' : ']';
    paso += 1;
    temporizador = window.setTimeout(transformarNombre, 6800);
  };

  const aplicarMovimiento = () => {
    document.body.classList.toggle('con-deriva', !pausado);
    window.clearTimeout(temporizador);
    if (!pausado) temporizador = window.setTimeout(transformarNombre, 4500);
    medirRecorrido();
  };

  preferenciaMovimiento.addEventListener('change', (evento) => {
    pausado = evento.matches;
    aplicarMovimiento();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.clearTimeout(temporizador);
    } else if (!pausado) {
      temporizador = window.setTimeout(transformarNombre, 1500);
    }
  });

  const abrirDestino = (fragmento: string) => {
    if (!fragmento.startsWith('#')) return;
    let identificador: string;
    try {
      identificador = decodeURIComponent(fragmento.slice(1));
    } catch {
      return;
    }
    const destino = document.getElementById(identificador);
    if (destino instanceof HTMLDetailsElement) destino.open = true;
  };

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((enlace) => {
    enlace.addEventListener('click', () => abrirDestino(enlace.hash));
  });
  window.addEventListener('hashchange', () => abrirDestino(window.location.hash));
  abrirDestino(window.location.hash);

  window.addEventListener('scroll', solicitarFotograma, { passive: true });
  window.addEventListener('resize', medirRecorrido, { passive: true });
  window.visualViewport?.addEventListener('resize', medirRecorrido, { passive: true });
  document
    .querySelectorAll('details')
    .forEach((detalle) => detalle.addEventListener('toggle', () => window.requestAnimationFrame(medirRecorrido)));

  const observador = new ResizeObserver(medirRecorrido);
  observador.observe(document.body);

  const fuentes = (document as any).fonts;
  if (fuentes?.ready) {
    fuentes.ready.then(medirRecorrido);
  }

  if (herramientas) {
    herramientas.hidden = false;
  }

  aplicarMovimiento();
}

export {};
