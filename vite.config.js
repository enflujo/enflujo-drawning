import { defineConfig, loadEnv } from 'vite';
import sitemap from 'vite-plugin-sitemap';

// El dominio se define al publicar; la revisión local no anuncia una URL ficticia.
export default defineConfig(({ mode }) => {
  const entorno = loadEnv(mode, process.cwd(), '');
  const dominio = entorno.SITIO_URL || (mode === 'production' ? 'https://drawning.enflujo.com' : undefined);

  return {
    base: entorno.BASE_SITIO || '/',
    publicDir: 'estaticos',
    build: { outDir: 'publico', assetsDir: 'estaticos', sourcemap: false },
    css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
    plugins: dominio
      ? [
          sitemap({
            hostname: dominio,
            outDir: 'publico',
            robots: [{ userAgent: '*', allow: '/' }],
            dynamicRoutes: ['/'],
          }),
        ]
      : [],
  };
});
