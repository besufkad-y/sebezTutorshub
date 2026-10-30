import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;
const DJANGO_PORT = 8000;

// Start Django backend process
let djangoProcess: any = null;

function startDjango() {
  console.log('[Server] Starting Django backend on port 8000...');
  djangoProcess = spawn('python3', ['manage.py', 'runserver', `127.0.0.1:${DJANGO_PORT}`, '--noreload'], {
    cwd: path.resolve(process.cwd(), 'backend'),
    stdio: 'inherit',
    env: { ...process.env, PYTHONUNBUFFERED: '1' },
  });

  djangoProcess.on('error', (err: any) => {
    console.error('[Server] Failed to start Django:', err);
  });

  djangoProcess.on('exit', (code: any, signal: any) => {
    console.log(`[Server] Django exited with code ${code} signal ${signal}`);
  });
}

startDjango();

process.on('exit', () => {
  if (djangoProcess) {
    djangoProcess.kill();
  }
});

// Proxy API requests to Django
app.use(
  '/api',
  createProxyMiddleware({
    target: `http://127.0.0.1:${DJANGO_PORT}`,
    changeOrigin: true,
  })
);

// Proxy Media requests to Django
app.use(
  '/media',
  createProxyMiddleware({
    target: `http://127.0.0.1:${DJANGO_PORT}`,
    changeOrigin: true,
  })
);

async function start() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] EduConnect full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

start();
