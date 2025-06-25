import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import http from 'http';
import { WebSocketServer } from 'ws';
import { handler, gramanerHandler } from '../pages/api/extract.js';
import { gramanerSimilarity, gramanerSummarize } from '../pages/api/llm.js';
import { generateImage } from '../pages/api/stability-ai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Set();

// ========== HTTP Routes ==========

// Serve HTML pages
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'test.html'));
});

app.get('/hosPi', (req, res) => {
  res.sendFile(path.join(__dirname, 'hosPi-body.html'));
});

// API routes
app.post('/api/extract', handler);
app.post('/api/generateImg', generateImage);
app.post('/api/gramanerExtract', gramanerHandler);
app.post('/api/gramanerSimilarity', gramanerSimilarity);
app.post('/api/gramanerSummarize', gramanerSummarize);
app.post('/api/gramanerClassify', (req, res) => {
  res.status(501).send('Not implemented');
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// ========== WebSocket Logic ==========
wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('message', (data) => {
    // Broadcast to other clients
    for (const client of clients) {
      if (client !== ws && client.readyState === 1) {
        client.send(data);
      }
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

// ========== Start Server ==========
server.listen(3000, () => {
  console.log('Express server running at http://localhost:3000');
});
