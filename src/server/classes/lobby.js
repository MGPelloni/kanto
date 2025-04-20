class Lobby {
    constructor(id = null, game_id = null, trainers = [], new_game = false) {
        this.id = id;
        this.game_id = game_id;
        this.trainers = trainers;
        this.battles = [];
        this.game = false;
        this.loaded = false;
        this.name = 'Untitled Lobby';
        this.public = true;
        this.timestamp = Date.now();
        this.monitor = setInterval(this.monitor_lobby, 10000, this);

        if (new_game) {
            this.new_game();
        } else {
            this.import_data = this.retrieve_game(game_id);
            this.import_data.then(
                result => this.generate_game(result), 
                error => console.log('Error importing game:', game_id)
            );
        }
    }

    async retrieve_game(game_id) {
        console.log('Retrieving game..', game_id);
        let res = await db.query('SELECT * FROM games WHERE game_id=$1;', [game_id]);
        return res.rows[0];
    }

    new_game() {
        this.game = JSON.parse('{ "meta": { "name": "Untitled Game" }, "maps": [{ "name": "Untitled Map", "height": 5, "width": 5, "starting_position": { "x": 0, "y": 0 }, "tiles": [2, 2, 3, 2, 2, 3, 3, 1, 2, 1, 2, 3, 2, 1, 2, 1, 2, 1, 3, 3, 1, 2, 1, 3, 2], "atts": [{ "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }], "music": 0 }] }');
        this.npcs = [];
        this.items = [];
        this.chat = new Chat(this.id);

        this.loaded = true;
        console.log('Lobby loaded:', this.id);
        io.to(this.id).emit('chat_server_message', {
            message: `Welcome to Kanto. There are 0 other players in this game.`
        });
    }

    /**
     * Generate NPCs, items, and other misc game data
     */
    generate_game(res) {
        if (!res) {
            console.log('Error: No game data found.');
            return;
        }

        this.game = JSON.parse(res.game_data);
        this.npcs = [];
        this.items = [];
        this.chat = new Chat(this.id);
        
        this.game.maps.forEach((map, i) => {
            map.id = i;
            this.build_npcs(map);
        });

        console.log('Game loaded:', this.game);

        this.loaded = true;
        console.log('Lobby loaded:', this.id);
        io.to(this.id).emit('lobby_loaded', true);

        this.chat.server_message(`Welcome to Kanto. There are 0 other players in this game.`);
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

    monitor_lobby(lobby) {
        if (lobby.trainers == 0) {
            lobby.shutdown();
        }
    }

    shutdown() {
        // Clear all intervals
        this.npcs.forEach(npc => {
            clearInterval(npc.wander_interval);
        });

        clearInterval(this.monitor);

        // Delete lobby from global lobbies object
        delete lobbies[this.id];
    }
}

function expand_map(map, direction) {
    if (!direction) {
        return;
    }

    let new_width,
        new_height,
        splice_index;

    if (map.width >= 400 || map.height >= 400) {
        console.log('Map size limit reached. Cannot expand map.');
        return;
    }
        
    switch (direction) {
        case 'North':
            new_width = map.width;
            new_height = map.height + 1;
            splice_index = 0;
            break;
        case 'South':
            new_width = map.width;
            new_height = map.height + 1;
            splice_index = new_height - 1;
            break;
        case 'West':
            new_width = map.width + 1;
            new_height = map.height;
            splice_index = 0;
            break;
        case 'East':
            new_width = map.width + 1;
            new_height = map.height;
            splice_index = new_width - 1;
            break;
        default:
            break;
    }

    if (direction == 'North' || direction == 'South') {
        for (let y = 0; y < new_height; y++) {
            for (let x = 0; x < new_width; x++) {
                let index = x + new_width * y;
                
                if (y == splice_index) {
                    map.tiles.splice(index, 0, 0);
                    map.atts.splice(index, 0, {type: 0});
                }
            }
        }
    } else {
        for (let y = 0; y < new_height; y++) {
            for (let x = 0; x < new_width; x++) {
                let index = x + new_width * y;
                
                if (x == splice_index) {
                    map.tiles.splice(index, 0, 0);
                    map.atts.splice(index, 0, {type: 0});
                }
            }
        }
    }

    map.width = new_width;
    map.height = new_height;
    return map;
}


function condense_map(map, direction) {
    if (!direction) {
        return;
    }

    let new_width,
        new_height,
        splice_index;
        
    switch (direction) {
        case 'North':
            new_width = map.width;
            new_height = map.height - 1;
            splice_index = 0;
            break;
        case 'South':
            new_width = map.width;
            new_height = map.height - 1;
            splice_index = new_height + 1;
            break;
        case 'West':
            new_width = map.width - 1;
            new_height = map.height;
            splice_index = 0;
            break;
        case 'East':
            new_width = map.width - 1;
            new_height = map.height;
            splice_index = new_width;
            break;
        default:
            break;
    }

    let offset = 0;

    if (direction == 'North' || direction == 'South') {
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                let index = x + map.width * y;
                
                if (y == splice_index) {
                    map.tiles.splice(index + offset, 1);
                    map.atts.splice(index + offset, 1);
                    offset--;
                }
            }
        }
    } else {
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                let index = x + map.width * y;
                
                if (x == splice_index) {
                    map.tiles.splice(index + offset, 1);
                    map.atts.splice(index + offset, 1);
                    offset--;
                }
            }
        }
    }

    map.width = new_width;
    map.height = new_height;
    return map;
}
