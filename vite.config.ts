import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {spawn} from 'child_process';

const DJANGO_PORT = 8001;

function djangoDevServerPlugin(): Plugin {
  return {
    name: 'django-dev-server',
    configureServer() {
      console.log(`[Vite Plugin] Starting Django backend on 127.0.0.1:${DJANGO_PORT}...`);
      const django = spawn('python3', ['manage.py', 'runserver', `127.0.0.1:${DJANGO_PORT}`, '--noreload'], {
        cwd: path.resolve(__dirname, 'backend'),
        stdio: 'inherit',
        env: { ...process.env, PYTHONUNBUFFERED: '1' },
      });

      const cleanup = () => {
        try {
          django.kill();
        } catch {}
      };

      process.on('exit', cleanup);
      process.on('SIGINT', () => {
        cleanup();
        process.exit();
      });
      process.on('SIGTERM', () => {
        cleanup();
        process.exit();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), djangoDevServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${DJANGO_PORT}`,
          changeOrigin: true,
        },
        '/media': {
          target: `http://127.0.0.1:${DJANGO_PORT}`,
          changeOrigin: true,
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
