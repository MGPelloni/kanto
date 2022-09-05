/**
 * Install the Kanto tables into the database.
 */
 function kanto_server_install() {
    db.query('DROP TABLE games, maps, users;', function(err, result){
        if (err){
            console.log(err.toString());
        }

        console.log('Successfully uninstalled Kanto.');
        console.log('Running Kanto installation..');

        db.query("CREATE TABLE games (id SERIAL PRIMARY KEY, name TEXT, game_id TEXT, author_id BIGINT, game_data TEXT, featured BOOL DEFAULT 'f');", function(err, result){
            if (err){
                console.log(err.toString());
                return;
            }  

            // Add default templates
            fs.readdir('templates/games/', (err, files) => {
                files.forEach(file => {
                    let template = JSON.parse(fs.readFileSync('templates/games/' + file, 'utf8'));
                    let game_id = generate_game_id();

                    db.query('INSERT INTO games (name, game_id, game_data, featured) values ($1, $2, $3, $4);', [template.meta.name, game_id, JSON.stringify(template), 't'], function(err, result){
                        console.log('Inserted game:', template.meta.name);
                        if (err){
                            console.log(err.toString());
                        }
                    });
                });
            });
        });
        
        db.query('CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR ( 50 ) UNIQUE NOT NULL, password VARCHAR ( 50 ) NOT NULL, email VARCHAR ( 255 ) UNIQUE NOT NULL, created_on TIMESTAMP NOT NULL, last_login TIMESTAMP );', function(err, result){
            if (err){
                console.log(err.toString());
                return;
            }  
        });

        db.query('CREATE TABLE maps (id SERIAL PRIMARY KEY, name TEXT, data TEXT);', function(err, result){
            if (err){
                console.log(err.toString());
                return;
            }  
        
            // Add default templates
            fs.readdir('templates/maps/', (err, files) => {
                files.forEach(file => {
                    let data = JSON.parse(fs.readFileSync('templates/maps/' + file, 'utf8'));
    
                    db.query('INSERT INTO maps (name, data) values ($1, $2);', [data.name, JSON.stringify(data)], function(err, result){
                        if (err){
                            console.log(err.toString());
                        }
                    });
    
                    console.log('Inserted map:', data.name);
                });
            });
        }); 
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

function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
      return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}