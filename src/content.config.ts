import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: z.object({
    orden: z.number(),
    titulo: z.string(),
    subtitulo: z.string(),
    resumen: z.string(),
    etiqueta: z.string(),
    imagen: z.string().optional(),
    altImagen: z.string().optional(),
    dimensionesImagen: z
      .object({
        width: z.number(),
        height: z.number(),
      })
      .optional(),
    creditoImagen: z.string().optional(),
    esTextual: z.boolean().default(false),
    iconoTexto: z.string().optional(),
  }),
});

export const collections = {
  proyectos,
};
