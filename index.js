console.log('Starting server..');

// Express
const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require("path");
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.json());

// Postgres
const { Client } = require('pg');
const db = new Client(process.env.DATABASE_URL);
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
    res.sendFile(path.join(__dirname + '/src/views/play.html'));
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
    db.query('SELECT * FROM games WHERE (name)=($1);', [req.body.game], function(err, result){
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
});

app.post('/upload', (req, res) => { // Upload Endpoint
    let requesting_ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	console.log('Upload attempt from ' + requesting_ip + " accepted.");

    console.log('Got body:', req.body);

    db.query('SELECT * FROM games where (name)=($1);', [req.body.game_name], function(err, result){
        if (err){
            console.log(err.toString());
            return;
        }

        if (result.rows.length > 0){
            db.query('UPDATE games SET game_data=$2 WHERE name=$1;', [req.body.game_name, req.body.game_data], function(err, result){
                if (err){
                    console.log(err.toString());
                }
            });
        } else {
            db.query('INSERT INTO games (name, game_data) values ($1, $2);', [req.body.game_name, req.body.game_data], function(err, result){
                if (err){
                    console.log(err.toString());
                }
            });
        }
    });

    res.json({success: true});
});

// Functions

/**
 * Install the Kanto tables into the database.
 */
function kanto_server_install() {
    console.log('Running Kanto installation..');

    db.query('CREATE TABLE templates (name text, game_data text);', function(err, result){
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

    db.query('CREATE TABLE games (game_id serial PRIMARY KEY, name text, author_id bigint, game_data text);', function(err, result){
        if (err){
            console.log(err.toString());
            return;
        }  
    });
    
    db.query('CREATE TABLE users ( user_id serial PRIMARY KEY, username VARCHAR ( 50 ) UNIQUE NOT NULL, password VARCHAR ( 50 ) NOT NULL, email VARCHAR ( 255 ) UNIQUE NOT NULL, created_on TIMESTAMP NOT NULL, last_login TIMESTAMP );', function(err, result){
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