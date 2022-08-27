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

// Endpoints
app.get('/', function (req, res) {
    db.query('SELECT * FROM games;', function(err, result){
        if (err){
            console.log(err.toString());
            return;
        }
        
        res.render('home', {
            // EJS variable and server-side variable
            games: result.rows
        });
    });
});


app.get('/play', (req, res) => {  // Play View
    let requesting_ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	console.log('Connection attempt from ' + requesting_ip + " accepted.");
    res.sendFile(path.join(__dirname + '/views/play.html'));
});

app.get('/create', (req, res) => { // Create View
    let requesting_ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	console.log('Connection attempt from ' + requesting_ip + " accepted.");
    res.sendFile(path.join(__dirname + '/views/create.html'));
});


app.get('/reset', (req, res) => { // Create View
    kanto_server_install();
    res.send('Success');
});

app.get('/games', (req, res) => { // Create View
    let requesting_ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    db.query('SELECT * FROM games;', function(err, result){
        if (err){
            console.log(err.toString());
            return;
        }

        res.json(result.rows);
    });
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
        req.body.meta.game_id = game_id;

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
    db.query('DROP TABLE templates, users, games;', function(err, result){
        if (err){
            console.log(err.toString());
        }

        console.log('Successfully uninstalled Kanto.');
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
    
            db.query('CREATE TABLE games (id SERIAL PRIMARY KEY, name TEXT, game_id TEXT, author_id BIGINT, game_data TEXT);', function(err, result){
                if (err){
                    console.log(err.toString());
                    return;
                }  
    
                db.query('SELECT * FROM templates;', function(err, result){
                    if (err){
                        console.log(err.toString());
                        return;
                    }
            
                    let templates = result.rows;
                    console.log(templates);
            
                    templates.forEach(template => {
                        let game_id = generate_game_id();
                        db.query('INSERT INTO games (name, game_id, game_data) values ($1, $2, $3);', [template.name, game_id, template.game_data], function(err, result){
                            console.log('Inserted template into games:', template.name);
                            if (err){
                                console.log(err.toString());
                            }
                        });
                    });

                    console.log('Successfully installed Kanto into the database.');
                });
            });
            
            db.query('CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR ( 50 ) UNIQUE NOT NULL, password VARCHAR ( 50 ) NOT NULL, email VARCHAR ( 255 ) UNIQUE NOT NULL, created_on TIMESTAMP NOT NULL, last_login TIMESTAMP );', function(err, result){
                if (err){
                    console.log(err.toString());
                    return;
                }  
            });
        });
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

class Lobby {
    constructor(id = null, game_id = null, trainers = []) {
        this.id = id;
        this.game_id = game_id;
        this.trainers = trainers;
        
        this.game = false;
        this.import_data = this.retrieve_game(game_id);
        this.loaded = false;
        
        this.import_data.then(
            result => this.generate_game(result), 
            error => console.log('Error importing game:', game_id)
        );
    }

    async retrieve_game(game_id) {
        console.log('Retrieving game..', game_id);
        let res = await db.query('SELECT * FROM games WHERE game_id=$1;', [game_id]);
        return res.rows[0];
    }

    /**
     * Generate NPCs, items, and other misc game data
     */
    generate_game(res) {
        this.game = JSON.parse(res.game_data);
        this.npcs = [];
        this.items = [];
        
        this.game.maps.forEach((map, i) => {
            map.id = i;
            this.build_npcs(map);
        });

        this.loaded = true;
        // console.log(this.npcs);
    }

    build_npcs(map) {
        let npc_index = 0;

        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                let index = x + map.width * y;
                let att = map.atts[index];
                
                if (att.type == 5) {
                    this.npcs.push(new Npc({map: map.id, x: x, y: y}, att.facing, att.movement_state, map, this.id, npc_index));
                    npc_index++;           
                }
            }
        }
    }

    // Closes the current lobby
    close() {

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

class Npc {
    constructor(position = {map: 0, x: 0, y: 0, f: 0}, facing = 'South', movement_state = 'Active', map = null, lobby_id = 0, index = 0) {
        this.position = position;
        this.facing = facing;
        this.map = map;
        this.movement_state = movement_state;
        this.index = index;
        this.lobby_id = lobby_id;

        this.initial_properties = {
            position: position,
            facing: facing
        };

        this.uid = `M${this.position.map}X${this.position.x}Y${this.position.y}`;

        if (this.movement_state == 'Active') {
            let that = this;
            this.wander_interval = setInterval(this.wander, 1000, that);
        }
    }
    
    place(x, y) {
        this.position.index = this.position.x + this.map.width * this.position.y;
        this.position.tile = map.atts[x + this.map.width * y];
    }

    position_update() {
        this.position.index = this.position.x + this.map.width * this.position.y;
        this.position.tile = this.map.tiles[this.position.index];
        this.position.att = this.map.atts[this.position.index];
    }

    move(direction) {
        let next_position = {
            x: this.position.x,
            y: this.position.y
        };

        switch (direction) {
            case 'East':
                next_position.x++;  
                break;
            case 'West':
                next_position.x--;   
                break;
            case 'North':
                next_position.y--;   
                break;
            case 'South':
                next_position.y++;   
                break;
            default:
                break;
        }

        if (!this.collision_check(next_position.x, next_position.y)) {
            this.moving = true;
            this.current_move_ticker = 0;
            
            switch (direction) {
                case 'North':
                    this.facing = 'North'; 
                    this.position.y--;   
                    this.position.f = 0;
                    break;
                case 'East':
                    this.facing = 'East'; 
                    this.position.x++;  
                    this.position.f = 1;
                    break;
                case 'South':
                    this.facing = 'South'; 
                    this.position.y++;   
                    this.position.f = 2;
                    break;
                case 'West':
                    this.facing = 'West'; 
                    this.position.x--;   
                    this.position.f = 3;
                    break;
                default:
                    break;
            }
            // console.log(`Moving (NPC ${this.index}):`, direction, this.position);
            
            // broadcast NPC movement to everyone in the room    
            io.to(this.lobby_id).emit('npc_moved', {
                uid: this.uid,
                position: this.position,
                moving: direction,
            }); 
        } else {
            // console.log(`Collision (NPC ${this.index}):`, direction, this.position);
        }

    }

    wander(that) {
        let movement_roll = Math.floor(Math.random() * 5) + 1, // 20% chance to move
            direction_roll = Math.floor(Math.random() * 3) + 1, // Random direction
            directions = ['North', 'South', 'East', 'West'];
        
        if (movement_roll == 1) {
           that.move(directions[direction_roll]);
        }
    }

    collision_check(x, y) {
        let lobby_index = find_lobby_index(this.lobby_id);

        // x-axis boundary check   
        if (x < 0 || x >= this.map.width) {
            return true;
        }
    
        // y-axis boundary check
        if (y < 0 || y >= this.map.height) {
            return true;
        }
    
        // attribute check
        switch (this.map.atts[x + this.map.width * y].type) {
            case 1: // Wall
            case 3: // Action
                return true;
                break;
            default:
                break;
        }
    
        // Player checks
        lobbies[lobby_index].trainers.forEach(trainer => {
            if (x == trainer.position.x && y == trainer.position.y) {
                return true;
            }       
        });
    
        lobbies[lobby_index].npcs.forEach(npc => {
            if (this.position.map == npc.position.map && x == npc.position.x && y == npc.position.y) {
                return true;
            }
        });
    
        return false;
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

        if (targeted_lobby_index === null) { // Creating a new lobby
            lobbies.push(new Lobby(data.lobby_id, data.game_id, [trainer]))
        } else { // Lobby ID exists, joining current lobby
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

        let lobby_index = find_lobby_index(data.lobby_id);
        // console.log(lobbies[lobby_index].game.maps);
        // console.log(io.sockets.adapter.rooms);
    });

    socket.on("position_update", (data) => {
        let lobby_index = find_lobby_index(data.lobby_id),
            trainer_index = find_trainer_index(lobby_index, socket.id);

        if (lobby_index !== null) {
            lobbies[lobby_index].trainers[trainer_index].position = data.trainer.position;
    
            socket.to(lobbies[lobby_index].id).emit('trainer_moved', {
                socket_id: lobbies[lobby_index].trainers[trainer_index].socket_id,
                position: lobbies[lobby_index].trainers[trainer_index].position,
                exiting: data.trainer.exiting
            });
        }
    });

    socket.on("facing_update", (data) => {
        let lobby_index = find_lobby_index(data.lobby_id),
            trainer_index = find_trainer_index(lobby_index, socket.id);

        if (lobby_index !== null) {
            lobbies[lobby_index].trainers[trainer_index].position.f = data.f;
    
            socket.to(lobbies[lobby_index].id).emit('trainer_faced', {
                socket_id: lobbies[lobby_index].trainers[trainer_index].socket_id,
                f: lobbies[lobby_index].trainers[trainer_index].position.f,
            });
        }
    });

    socket.on("map_server_sync", (data) => {
        let lobby_index = find_lobby_index(data.lobby_id);
        let targeted_npcs = [];

        console.log('map_server_sync', data);

        if (lobbies[lobby_index]) {
            lobbies[lobby_index].npcs.forEach(npc => {
                if (npc.position.map == data.map) {
                    targeted_npcs.push({
                        uid: npc.uid,
                        position: npc.position,
                    });
                }
            });
            
            // console.log(targeted_npcs);
            socket.emit('map_server_sync', {npcs: targeted_npcs});
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

function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
      return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}