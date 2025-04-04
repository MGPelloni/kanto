class Trainer {
    constructor(socket_id = null, lobby_id = null, name = 'RED', position = {map: 1, x: 5, y: 5}, spritesheet_id = 0) {
        this.socket_id = socket_id;
        this.lobby_id = lobby_id;
        this.name = name;
        this.position = position;
        this.spritesheet_id = spritesheet_id;
        this.facing = 'South';
        this.color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        this.in_battle = false;

        this.battle = {};
    }

    check_tile(lobby_key) {
        let map = lobbies[lobby_key].game.maps[this.position.map],
            index = this.position.x + map.width * this.position.y,
            tile = map.atts[index];

        switch (tile.type) {
            case 8:
                let battle_roll = Math.floor(Math.random() * 16) + 1; // 6.25% chance
                
                if (battle_roll == 1) {
                    let pokemon_roll = Math.floor(Math.random() * tile.pokemon.length); // Selecting a PKMN from the list
                    this.wild_pokemon_battle(tile.pokemon[pokemon_roll].id, tile.pokemon[pokemon_roll].level);
                }
                break;
            default:
                break;
        }
    }

    wild_pokemon_battle(id = null, level = 5) {
        if (!id) {
            id = Math.floor(Math.random() * 151);
        }

        this.in_battle = true;
        this.battle.type = 'wild';
        this.battle.pokemon = new Pokemon(id, level);

        io.to(this.lobby_id).emit('trainer_entering_battle', {
            socket_id: this.socket_id
        });

        io.to(this.socket_id).emit('wild_pokemon_battle', {
            pokemon: this.battle.pokemon
        });
    }

    exiting_battle() {
        this.in_battle = false;

        io.to(this.lobby_id).emit('trainer_exiting_battle', {
            socket_id: this.socket_id
        });
    }
}