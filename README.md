# Draw[n]ing

Sitio estático del colectivo de Anna Seiderer, Alexander Schellow y Juan Camilo González, construido sobre la plantilla de EnFlujo con Vite, TypeScript y SCSS. Código y documentación en español; contenido público en inglés.

## Desarrollo

```sh
yarn install --immutable
yarn dev
```

La plantilla usa el puerto 3000. Si está ocupado, se puede ejecutar `yarn dev --port 3001`. El servidor solo escucha en la interfaz local.

```sh
yarn build
yarn lint
```

La carpeta `publico/` contiene el resultado listo para servir en cualquier alojamiento estático. La web no necesita servidor de aplicación, base de datos ni servicios externos. Las fuentes y las imágenes se sirven localmente.

## Composición y movimiento

- `src/pages/index.astro` contiene la página principal y los textos paralelos. Los proyectos se cargan desde `src/content/proyectos/`. Se puede leer y navegar sin JavaScript.
- `src/scss/estilos.scss` define papel, tipografía, anotaciones, márgenes y adaptación a pantallas estrechas. En móvil, cada pareja se lee consecutivamente; la historia aparece sangrada.
- `src/programa.ts` mueve el nombre por el corredor central y cambia su escritura. El progreso se calcula como `scrollY / (scrollHeight - innerHeight)`. `ResizeObserver` y los eventos de los desplegables recalculan el recorrido cuando cambia la longitud de la página.
- Al inicio, el nombre ocupa la anchura de la página; durante el primer tramo de desplazamiento se contrae. En móvil gira 90 grados hacia el margen reservado. La animación no intercepta rueda, tacto, enlaces ni selección de texto.
- Se respeta `prefers-reduced-motion` desde la carga inicial; con esa preferencia el título permanece en su posición original.
- Debajo del título, la cabecera muestra los tres integrantes en una línea en escritorio y en tres filas en móvil. Los enlaces están centrados por encima del título y permanecen arriba. La cabecera de integrantes se fija debajo de esos enlaces al desplazarse, sin duplicar su contenido. Su altura determina el margen de navegación hacia secciones y el espacio reservado en el recorrido del título.
- El párrafo `.introduccion` contiene Lorem ipsum provisional para revisar la composición; reemplazarlo por el texto definitivo en `src/pages/index.astro`.
- Los enlaces a los detalles de proyectos los abren automáticamente. Sin JavaScript, los elementos `details` siguen siendo utilizables.

## Edición de contenido

El tono editorial es descriptivo. Los títulos nombran temas, proyectos o periodos; los controles describen acciones. No añadir eslóganes, invitaciones poéticas, frases motivacionales ni subtítulos publicitarios. Las ideas de los documentos se desarrollan en el cuerpo del texto, sin convertirlas en lemas o destacados.

Las secciones `.par` mantienen juntos los fragmentos de ambas voces. Los proyectos se editan en los artículos `.proyecto`; las imágenes viven en `estaticos/imagenes/`. Cada imagen incluye dimensiones y texto alternativo.

La historia consolida `Straightened version_project history_text.pdf` y `Project history sketch.pdf`: se suprimieron repeticiones y notas de edición, y se conservaron los antecedentes de GREYZONE ZEBRA y las colaboraciones. Los pasajes extensos están en desplegables. `what we do_.pdf` se mantiene con ajustes gramaticales menores. La sección sobre el nombre interpreta el concepto compartido en el encargo.

`Draw[n]ing images.pdf` aporta el cuarto proyecto. Su línea de fecha está incompleta: no se anuncia una fecha ni se afirma que sus tres talleres hayan ocurrido. La referencia a una publicación futura en el borrador histórico también está incompleta y no se convirtió en un proyecto publicado.

Las cuatro imágenes fueron extraídas de `Project history sketch.pdf` y optimizadas a WebP. Sus créditos y contextos se incluyen en el sitio. No se añadieron fotografías externas ni imágenes generadas.

La fuente Cormorant Garamond, de Christian Thalmann, se distribuye bajo la licencia SIL Open Font License incluida en `estaticos/fuentes/OFL.txt`. Archivos web obtenidos de Fontsource; licencia del repositorio de Google Fonts.

## Publicación posterior

La revisión actual es local. No hay despliegue ni dominio supuesto. Para generar sitemap y robots al publicar, definir `SITIO_URL` con el dominio real. `BASE_SITIO` permite configurar una subruta, por ejemplo `/drawning/`. Vite ajusta las referencias estáticas durante la compilación.

Antes de una publicación definitiva, se pueden completar los enlaces propios de los proyectos, la información del libro y los datos finales de Draw[n]ing images.
