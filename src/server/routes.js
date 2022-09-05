app.get('/', function (req, res) {
    db.query('SELECT * FROM games WHERE featured=true ORDER BY name ASC;', function(err, result){
        if (err){
            console.log(err.toString());
            return;
        }

        let featured_games = result.rows;
        
        db.query('SELECT * FROM games WHERE featured=false ORDER BY name ASC;', function(err, result){
            if (err){
                console.log(err.toString());
                return;
            }

            let user_games = result.rows;

            res.render('home', {
                // EJS variable and server-side variable
                featured_games: featured_games,
                user_games: user_games
            });
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

app.get('/templates/games', (req, res) => {
    fs.readdir('templates/games/', (err, files) => {
        let templates = [];

        files.forEach(file => {
            templates.push(JSON.parse(fs.readFileSync('templates/games/' + file, 'utf8')));
        });

        res.json(templates);
    });
});

app.get('/templates/maps', (req, res) => {
    fs.readdir('templates/maps/', (err, files) => {
        let templates = [];

        files.forEach(file => {
            templates.push(JSON.parse(fs.readFileSync('templates/maps/' + file, 'utf8')));
        });

        res.json(templates);
    });
});

app.get('/maps', (req, res) => {
    let requesting_ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    db.query('SELECT * FROM maps;', function(err, result){
        if (err){
            console.log(err.toString());
            return;
        }

        res.json(result.rows);
    });
});

app.post('/game', (req, res) => {
    let game_id = req.body.game;

    if (game_id) {
        db.query('SELECT * FROM games WHERE game_id=$1;', [game_id], function(err, result){
            if (err){
                console.log(err.toString());
                return;
            }
    
            if (result.rows.length > 0) {
                res.json(result.rows[0].game_data);
                return;
            } else {
                db.query('SELECT * FROM games WHERE name=$1;', ['Pallet Town'], function(err, result){
                    if (err) {
                        console.log(err.toString());
                    }
    
                    res.json(result.rows[0].game_data);
                    return;
                });
            }
        });
    } else {
        db.query('SELECT * FROM games WHERE name=$1;', ['Pallet Town'], function(err, result){
            if (err) {
                console.log(err.toString());
            }

            res.json(result.rows[0]);
            return;
        });
    }
   
});

app.post('/upload', (req, res) => {
    let requesting_ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	console.log('Upload attempt from ' + requesting_ip + " accepted.");

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