import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import http from 'http';
import { WebSocketServer } from 'ws';
// import { gramanerHandler } from '../pages/api/extract.js';
// import { gramanerSimilarity, gramanerSummarize } from '../pages/api/llm.js';
import gramanerHandler from '../pages/api/gramaner/extract.js';
import gramanerSimilarity from '../pages/api/gramaner/similarity.js';
import gramanerSummarize from '../pages/api/gramaner/summarize.js';
import klingAI_TextToImage from '../pages/api/klingAI/klingAI_TextToImg.js';
import klingAI_TextToVideo from '../pages/api/klingAI/klingAI_TextToVideo.js';
import klingAI_ImgToVideo from '../pages/api/klingAI/klingAI_ImgToVideo.js';
import klingAI_queryTask from '../pages/api/klingAI/klingAI_queryTask.js';
import deepbrain_doc2Vid from '../pages/api/deepbrain/doc2vid.js';
import deepbrain_url2Vid from '../pages/api/deepbrain/url2vid.js';

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
// app.post('/api/extract', handler);
// app.post('/api/generateImg', stabilityAI_generateImage);
app.post('/api/generateImg', klingAI_TextToImage);
app.post('/api/generateVid', klingAI_TextToVideo);
app.post('/api/generateImg2Vid', klingAI_ImgToVideo);
app.post('/api/queryTask', klingAI_queryTask);
app.post('/api/gramanerExtract', gramanerHandler);
app.post('/api/gramanerSimilarity', gramanerSimilarity);
app.post('/api/gramanerSummarize', gramanerSummarize);
app.post('/api/generateDoc2Vid', deepbrain_doc2Vid);
app.post('/api/generateURL2Vid', deepbrain_url2Vid)
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
