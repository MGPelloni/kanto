// Express
const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require("path");
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Postgres
// const { Client } = require('pg');
// const db = new Client(process.env.DATABASE_URL);
// db.connect();

// Static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/dist', express.static(path.join(__dirname, 'dist')))


// Server
server.listen(process.env.PORT || 8000);

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

app.get('/game', (req, res) => { // Create View
    db.query('SELECT * FROM templates;', function(err, result){
        if (err){
            console.log(err.toString());
            return;
        }

        result.rows.forEach(row => {
            if (row.template_name == 'Pallet Town') {
                res.json(row);
                return;
            }
        });        
    });
});

app.post('/upload', (req, res) => { // Upload Endpoint
    let requesting_ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	console.log('Upload attempt from ' + requesting_ip + " accepted.");

    console.log('Got body:', req.body);

    db.query('SELECT * FROM templates where (template_name)=($1);', [req.body.template_name], function(err, result){
        if (err){
            console.log(err.toString());
            return;
        }

        if (result.rows.length > 0){
            db.query('UPDATE templates SET game_data=$2 WHERE template_name=$1;', [req.body.template_name, req.body.game_data], function(err, result){
                if (err){
                    console.log(err.toString());
                }
            });
        } else {
            db.query('INSERT INTO templates (template_name, game_data) values ($1, $2);', [req.body.template_name, req.body.game_data], function(err, result){
                if (err){
                    console.log(err.toString());
                }
            });
        }
    });

    res.json({success: true});
});