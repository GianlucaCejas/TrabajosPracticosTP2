const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;

let listaConceptos = [];
let nextId = 1;

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

  //API Restful

  //Solicitud GET
  if (req.method === 'GET' && pathname === '/api/conceptos') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(listaConceptos));
  }

  //Solicitud GET mediante id
  if (req.method === 'GET' && pathname.startsWith('/api/conceptos/')) {
  const partes = pathname.split('/');
  const id = parseInt(partes[partes.length - 1]);

    if (!isNaN(id)) {
      const concepto = listaConceptos.find(item => item.id === id);
      if (concepto) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(concepto));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'Concepto no encontrado.' }));
      }
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'ID inválido.' }));
    }
  }

  //Solicitud POST para agregar un concepto a la lista
  if (req.method === 'POST' && pathname === '/api/conceptos') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
        const nuevoConcepto = JSON.parse(body);
        if (nuevoConcepto && nuevoConcepto.nombre && nuevoConcepto.descripcion) {
          //Acá le agrego un ID a cada concepto
          nuevoConcepto.id = nextId++;
          listaConceptos.push(nuevoConcepto);
          res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ mensaje: 'Concepto agregado.', concepto: nuevoConcepto }));
        } 
    });
    return;
  }

  // Solicitud DELETE para eliminar todos los conceptos
  if( req.method === 'DELETE' && pathname === '/api/delete/conceptos') {
    listaConceptos = [];
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ mensaje: 'Todos los conceptos han sido eliminados.' }));
  }

  // Solicitud DELETE para eliminar por id
  if (req.method === 'DELETE' && pathname.startsWith('/api/delete/conceptos/')) {
    const partes = pathname.split('/');
    const id = parseInt(partes[partes.length - 1]); 
    if (isNaN(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'ID inválido.' }));
    }

    const indiceConcepto = listaConceptos.findIndex(item => item.id === id);
    if (indiceConcepto === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ mensaje: 'Concepto no encontrado.' }));
    }
    listaConceptos.splice(indiceConcepto, 1);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ mensaje: 'Concepto eliminado.', lista: listaConceptos }));
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