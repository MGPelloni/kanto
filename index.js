console.log('Starting server..');

// Express
const express = require('express');
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

kanto_server_initialize();

// Endpoints
app.get('/', (req, res) => { // Gallery View
    let requesting_ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	console.log('Connection attempt from ' + requesting_ip + " accepted.");
    res.sendFile(path.join(__dirname + '/src/views/home.html'));
});

app.get('/play', (req, res) => {  // Play View
    let requesting_ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	console.log('Connection attempt from ' + requesting_ip + " accepted.");
    res.sendFile(path.join(__dirname + '/src/views/play.html'));
});

app.get('/create', (req, res) => { // Create View
    let requesting_ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	console.log('Connection attempt from ' + requesting_ip + " accepted.");
    res.sendFile(path.join(__dirname + '/src/views/create.html'));
});

app.get('/reset', (req, res) => { // Create View
    kanto_server_drop();
    kanto_server_install();

    res.send('Success');
});


app.get('/templates', (req, res) => { // Create View
    let requesting_ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    db.query('SELECT * FROM templates;', function(err, result){
        if (err){
            console.log(err.toString());
            return;
        }

        res.json(result.rows);
    });
});

app.post('/game', (req, res) => { // Create View
    let game_id = req.body.game;

    if (game_id) {
        db.query('SELECT * FROM games WHERE game_id=$1;', [game_id], function(err, result){
            if (err){
                console.log(err.toString());
                return;
            }
    
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
                return;
            } else {
                db.query('SELECT * FROM templates WHERE name=$1;', ['Pallet Town'], function(err, result){
                    if (err) {
                        console.log(err.toString());
                    }
    
                    res.json(result.rows[0]);
                    return;
                });
            }
        });
    } else {
        db.query('SELECT * FROM templates WHERE name=$1;', ['Pallet Town'], function(err, result){
            if (err) {
                console.log(err.toString());
            }

            res.json(result.rows[0]);
            return;
        });
    }
   
});

app.post('/upload', (req, res) => { // Upload Endpoint
    let requesting_ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	console.log('Upload attempt from ' + requesting_ip + " accepted.");

    // console.log('Got body:', req.body);

    let game_id = null;
  
    if (req.body.meta.game_id) {
        game_id = req.body.meta.game_id;
    }

    console.log(game_id, req.body);

    if (game_id) {
        db.query('SELECT * FROM games WHERE game_id=$1;', [game_id], function(err, result) { // TODO: Add author check here
            if (err){
                console.log(err.toString());
                return;
            }
    
            if (result.rows.length > 0){
                db.query('UPDATE games SET game_data=$2 WHERE game_id=$1;', [game_id, req.body], function(err, result){
                    if (err){
                        console.log(err.toString());
                    }
                });
            }
        });
    } else {
        game_id = generate_game_id();
        db.query('INSERT INTO games (name, game_id, game_data) values ($1, $2, $3);', [req.body.meta.name, game_id, req.body], function(err, result){
            if (err){
                console.log(err.toString());
            }
        });
    }
   

    res.json({success: true, game_id: game_id});
});

// Functions

/**
 * Install the Kanto tables into the database.
 */
function kanto_server_install() {
    console.log('Running Kanto installation..');

    db.query('CREATE TABLE templates (id SERIAL PRIMARY KEY, name TEXT, game_data TEXT);', function(err, result){
        if (err){
            console.log(err.toString());
            return;
        }  
    
        // Add default templates
        fs.readdir('src/js/maps/', (err, files) => {
            files.forEach(file => {
                let game_data = JSON.parse(fs.readFileSync('src/js/maps/' + file, 'utf8'));

                db.query('INSERT INTO templates (name, game_data) values ($1, $2);', [game_data.meta.name, JSON.stringify(game_data)], function(err, result){
                    if (err){
                        console.log(err.toString());
                    }
                });

                console.log('Inserted template:', game_data.meta.name);
            });
        });
    });

    db.query('CREATE TABLE games (id SERIAL PRIMARY KEY, name TEXT, game_id TEXT, author_id BIGINT, game_data TEXT);', function(err, result){
        if (err){
            console.log(err.toString());
            return;
        }  
    });
    
    db.query('CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR ( 50 ) UNIQUE NOT NULL, password VARCHAR ( 50 ) NOT NULL, email VARCHAR ( 255 ) UNIQUE NOT NULL, created_on TIMESTAMP NOT NULL, last_login TIMESTAMP );', function(err, result){
        if (err){
            console.log(err.toString());
            return;
        }  
    });

    console.log('Successfully installed Kanto into the database.');
}

/**
 * Drop the Kanto tables from the database.
 */
function kanto_server_drop() {
    db.query('DROP TABLE templates, users, games;', function(err, result){
        if (err){
            console.log(err.toString());
        }

        console.log('Successfully uninstalled Kanto.');
    });
}

/**
 * Init function for the Kanto server.
 */
function kanto_server_initialize() {
    db.query('SELECT * FROM templates;', function(err, result){
        if (err) { // Tables aren't installed
            console.log(err.toString());
            kanto_server_install();
            return;
        }
        
        console.log('Server has been succesfully initialized, listening on port:', process.env.PORT);
    });
}

function generate_game_id(length = 11) {
    // Declare all characters
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';

    // Pick characers randomly
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;    
}

// Socket.io
io.on("connection", (socket) => { 
    console.log('New socket: ', socket.id);

    socket.on("join_lobby", (data) => {
        let trainer = new Trainer(socket.id, data.trainer.position, data.trainer.spritesheet_id);
        let targeted_lobby_index = null;
        
        lobbies.forEach((lobby, i) => {
            if (data.lobby_id == lobby.id) {
                targeted_lobby_index = i;
            }
        });

        if (targeted_lobby_index === null) {
            lobbies.push(new Lobby(data.lobby_id, [trainer]))
        } else {
            socket.emit('create_current_trainers', lobbies[targeted_lobby_index].trainers);
            lobbies[targeted_lobby_index].trainers.push(trainer);
        }

        // const clients = io.sockets.adapter.rooms.get(data.lobby_id);
        
        // Rooms
        socket.join(data.lobby_id);
        socket.to(data.lobby_id).emit('trainer_joined', {
            name: 'BLUE',
            position: trainer.position,
            facing: trainer.facing,
            spritesheet_id: data.trainer.spritesheet_id, 
            socket_id: socket.id
        });

        // console.log(io.sockets.adapter.rooms);
    });

    socket.on("position_update", (data) => {
        let lobby_index = find_lobby_index(data.lobby_id),
            trainer_index = find_trainer_index(lobby_index, socket.id);

        if (lobby_index !== null) {
            lobbies[lobby_index].trainers[trainer_index].position = data.trainer.position;
            lobbies[lobby_index].trainers[trainer_index].facing = data.trainer.facing;
    
            console.log(lobbies[lobby_index].trainers[trainer_index].position);
    
            socket.to(lobbies[lobby_index].id).emit('trainer_moved', {
                socket_id: lobbies[lobby_index].trainers[trainer_index].socket_id,
                position: lobbies[lobby_index].trainers[trainer_index].position,
                facing: lobbies[lobby_index].trainers[trainer_index].facing,
                exiting: data.trainer.exiting
            });
        }
    });

    socket.on("disconnecting", (reason) => {
        let targeted_room = null;

        socket.rooms.forEach(room => {
            if (room !== socket.id) {
                targeted_room = room;
            }
        });

        if (targeted_room) {
            let lobby_index = find_lobby_index(targeted_room),
                trainer_index = find_trainer_index(lobby_index, socket.id);

            lobbies[lobby_index].trainers.splice(trainer_index, 1);
        }

        io.to(targeted_room).emit('trainer_disconnected', socket.id); // broadcast to everyone in the room    
    });
});

class Lobby {
    constructor(id = null, trainers = []) {
        this.id = id;
        this.trainers = trainers
    }
}

class Trainer {
    constructor(socket_id = null, position = {map: 1, x: 5, y: 5}, spritesheet_id = 0) {
        this.socket_id = socket_id;
        this.position = position;
        this.spritesheet_id = spritesheet_id;
        this.facing = 'South';
    }
}

function find_lobby_index(id) {
    let targeted_lobby_index = null;
        
    lobbies.forEach((lobby, i) => {
        if (lobby.id == id) {
            targeted_lobby_index = i;
        }
    });

    return targeted_lobby_index;
}

function find_trainer_index(lobby_index, trainer_socket) {
    let targeted_trainer_index = null;
        
    if (lobbies[lobby_index]) {
        lobbies[lobby_index].trainers.forEach((trainer, i) => {
            if (trainer_socket == trainer.socket_id) {
                targeted_trainer_index = i;
            }
        });
    }

    return targeted_trainer_index;
}