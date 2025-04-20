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

function find_trainer_index(lobby_key, trainer_socket) {
    let targeted_trainer_index = null;
        
    if (lobbies[lobby_key]) {
        lobbies[lobby_key].trainers.forEach((trainer, i) => {
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

function get_pokemon(id, level = 5) {
    let pokemon = POKEMON[id - 1];

    console.log('Pokemon:', pokemon);

    if (!pokemon) {
        console.log('Error: Pokemon not found');
        return null;
    } else {
        pokemon = JSON.parse(JSON.stringify(pokemon)); // Deep copy
    }

    pokemon.level = level;

    if (pokemon) {
        // Find the pokemon
        pokemon.moves = [];

        let pkmn = LEARNSETS.find(learnset => learnset.id === pokemon.id);
        pkmn.learnset.forEach(learnset => {
            if (learnset.level <= level) {
                let move_obj = MOVES.find(m => m.name === learnset.name);
                if (move_obj) {
                    pokemon.moves.push(move_obj);
                }
            }
        });

        // Only keep the last 4 moves
        if (pokemon.moves.length > 4) {
            pokemon.moves = pokemon.moves.slice(-4);
        }

        console.log('Moves:', pokemon.moves);
    } else {
        console.log('Error: Pokemon not found');
        return null;
    }

    // Calculate the stats based on the level of the pokemon
    pokemon.stats = {};
    pokemon.stats.atk = Math.floor(((2 * pokemon.base.atk * level) / 100) + level + 5);
    pokemon.stats.def = Math.floor(((2 * pokemon.base.def * level) / 100) + level + 5);
    pokemon.stats.hp = Math.floor(((2 * pokemon.base.hp * level) / 100) + level + 10);
    pokemon.stats.sp_atk = Math.floor(((2 * pokemon.base.sp_atk * level) / 100) + level + 5);
    pokemon.stats.sp_def = Math.floor(((2 * pokemon.base.sp_def * level) / 100) + level + 5);
    pokemon.stats.speed = Math.floor(((2 * pokemon.base.speed * level) / 100) + level + 5);

    // Set the current HP to the max HP
    pokemon.currentHP = pokemon.stats.hp;
    pokemon.maxHP = pokemon.stats.hp;

    // Exp
    pokemon.exp = 0;
    pokemon.exp_needed = Math.floor((Math.pow(pokemon.level, 3) * 0.8) + (pokemon.level * 4));
    pokemon.exp_needed = Math.floor(pokemon.exp_needed * 1.25); // 1.25x EXP for now

    return pokemon;
}