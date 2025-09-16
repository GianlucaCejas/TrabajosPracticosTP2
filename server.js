const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Servir archivos estáticos
  if (pathname.startsWith('/public/')) {
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath);
    let contentType = 'text/plain';
    if (ext === '.js') contentType = 'application/javascript';
    else if (ext === '.css') contentType = 'text/css';
    else if (ext === '.html') contentType = 'text/html';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end('Archivo no encontrado.');
      }
      res.writeHead(200, { 'Content-Type': contentType + '; charset=utf-8' });
      res.end(data);
    });
    return;
  }

  // Ruta base: que muestre index.html
  if (req.method === 'GET' && pathname === '/') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end('Error cargando el index.');
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
    return;
  }

  // Ruta no encontrada: mostrar 404.html
  fs.readFile(path.join(__dirname, 'public', '404.html'), (err, data) => {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    if (err) {
      return res.end('Página no encontrada (404).');
    }
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});