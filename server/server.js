const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

let appStatus = { state: 0 };
let orientationStatus = { state: 0 };

//GET: get app status
app.get('/data/appStatus', (req, res) => {
    res.json(appStatus);
});

// POST: update app status
app.post('/data/updateAppStatus', (req, res) => {
    appStatus = { ...appStatus, ...req.body };
    res.json({ success: true, newState: appStatus });
});