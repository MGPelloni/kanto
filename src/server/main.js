console.log('Starting server..');

// Express
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

// Multiplayer
let lobbies = [];

app.set('view engine', 'ejs');
app.use(requireHTTPS);
app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));  // TODO: body-parser deprecated undefined extended: provide extended option

// Postgres
const { Client } = require('pg');

const db = new Client({
    connectionString: process.env.DATABASE_URL,
    // ssl: { // TODO: Causes error "UnhandledPromiseRejectionWarning: Error: The server does not support SSL connections"
    //     rejectUnauthorized: false
    // }
});

db.connect();

// Static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/dist', express.static(path.join(__dirname, 'dist')))

// Server
server.listen(process.env.PORT || 8000);