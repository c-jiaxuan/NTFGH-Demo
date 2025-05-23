import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handler, gramanerHandler } from '../pages/api/extract.js'
import { gramanerSimilarity, gramanerSummarize } from '../pages/api/llm.js';
import crypto from 'crypto';
// import dotenv from 'dotenv';
// dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clients = [];

const server = http.createServer(async (req, res) => {
    if (req.url === '/test') {
      serveFile('test.html', 'text/html', res);
    } else if (req.url === '/hosPi') {
      serveFile('hosPi-body.html', 'text/html', res);
    } else if (req.url === '/api/extract') {
      return await handler(req, res);
    } else if (req.url === '/api/gramanerExtract') {
      return await gramanerHandler(req, res);
    } else if (req.url === '/api/gramanerSimilarity') {
      return await gramanerSimilarity(req, res);
    } else if (req.url === '/api/gramanerSummarize') {
      return await gramanerSummarize(req, res);
    } else if (req.url === '/api/gramanerClassify') {
      // Gramaner classify function call
    } else {
      serveStaticFile(req, res);
    }
});

server.on('upgrade', (req, socket) => {
  const key = req.headers['sec-websocket-key'];
  const accept = generateAcceptValue(key);

  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept}\r\n` +
    '\r\n'
  );

  clients.push(socket);

  socket.on('data', (buffer) => {
    const message = decodeWebSocketFrame(buffer);
    if (message) {
      clients.forEach(client => {
        if (client !== socket) {
          client.write(encodeWebSocketFrame(message));
        }
      });
    }
  });

  socket.on('close', () => removeClient(socket));
  socket.on('end', () => removeClient(socket));
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

function serveFile(filename, contentType, res) {
  const filePath = path.join(__dirname, filename);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading file');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function removeClient(socket) {
  const index = clients.indexOf(socket);
  if (index !== -1) clients.splice(index, 1);
}

function generateAcceptValue(key) {
  return crypto
    .createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
    .digest('base64');
}

function decodeWebSocketFrame(buffer) {
  const secondByte = buffer[1];
  const length = secondByte & 127;
  const mask = buffer.slice(2, 6);
  const data = buffer.slice(6, 6 + length);
  const unmasked = data.map((byte, i) => byte ^ mask[i % 4]);
  return Buffer.from(unmasked).toString();
}

function encodeWebSocketFrame(str) {
  const payload = Buffer.from(str);
  const frame = [0x81, payload.length];
  return Buffer.concat([Buffer.from(frame), payload]);
}

function serveStaticFile(req, res) {
    const safePath = path.normalize(decodeURIComponent(req.url)).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, safePath);
    const ext = path.extname(filePath).toLowerCase();
  
    const contentTypes = {
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.html': 'text/html',
    };
  
    const contentType = contentTypes[ext] || 'application/octet-stream';
  
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end('404 Not Found');
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
}
  
