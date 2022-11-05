class Lobby {
    constructor(id = null, game_id = null, trainers = [], new_game = false) {
        this.id = id;
        this.game_id = game_id;
        this.trainers = trainers;
        this.game = false;
        this.loaded = false;

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
        this.game = JSON.parse('{ "meta": {}, "maps": [{ "name": "Untitled Map", "height": 5, "width": 5, "starting_position": { "x": 0, "y": 0 }, "tiles": [2, 2, 3, 2, 2, 3, 3, 1, 2, 1, 2, 3, 2, 1, 2, 1, 2, 1, 3, 3, 1, 2, 1, 3, 2], "atts": [{ "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }, { "type": 0 }], "music": 0 }] }');
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
        this.game = JSON.parse(res.game_data);
        this.npcs = [];
        this.items = [];
        this.chat = new Chat(this.id);
        
        this.game.maps.forEach((map, i) => {
            map.id = i;
            this.build_npcs(map);
        });

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

    // Closes the current lobby
    close() {

    }
}