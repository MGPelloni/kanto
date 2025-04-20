// Variables
const dotenv = require('dotenv');
const express = require('express');
const ejs = require('ejs');
const app = express();
const server = require('http').Server(app);
const path = require("path");
const bodyParser = require('body-parser');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Socket.io
const { Server } = require("socket.io");
const io = new Server(server);

// Postgres
const { Client } = require('pg');
const db = new Client({
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT || 5432,
	database: process.env.DB_NAME || 'kanto',
	user: process.env.DB_USER || 'postgres',
	password: process.env.DB_PASS || 'password',
});

// Get learnsets.json and set as global variable
global.LEARNSETS = JSON.parse(fs.readFileSync('src/server/data/learnsets.json', 'utf8'));

// Kanto
const lobbies = {};

// Configuration
app.set('view engine', 'ejs');
// app.use(requireHTTPS);
app.use(express.json({limit: '50mb'}));
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/dist', express.static(path.join(__dirname, 'dist')))

// Postgres
db.connect();

// Server
server.listen(process.env.PORT || 8000);
console.log('Server started on port ' + (process.env.PORT || 8000));