// Variables
const express = require('express');
const ejs = require('ejs');
const app = express();
const server = require('http').Server(app);
const path = require("path");
const bodyParser = require('body-parser');
const fs = require('fs');

// Socket.io
const { Server } = require("socket.io");
const io = new Server(server);

// Postgres
const { Client } = require('pg');
const db = new Client({
    connectionString: process.env.DATABASE_URL,
});

// Kanto
const lobbies = [];

// Configuration
app.set('view engine', 'ejs');
app.use(requireHTTPS);
app.use(express.json({limit: '50mb'}));
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/dist', express.static(path.join(__dirname, 'dist')))

// Postgres
db.connect();

// Server
server.listen(process.env.PORT || 8000);