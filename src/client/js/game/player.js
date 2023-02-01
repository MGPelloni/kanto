class Player {
    constructor(position = {map: 0, x: 0, y: 0, f: 2}, spritesheet_id = 0) {
        this.name = retrieve_data('player_name') ?? 'RED';
        this.position = position;

        this.spritesheet_id = spritesheet_id;
        this.spritesheet = spritesheets[spritesheet_id];
 
        this.facing = 'South';
        this.can_check_action = true;
        this.frozen = false;
        this.moving = false;
        this.can_move = true;
        this.controls = 'walking' // walking, menu, battle
        this.current_move_ticker = 0;
        this.current_map = maps[0];
        this.last_position = {};
        this.speed = 1;
        this.in_battle = false;
        this.automove = {};

        this.pokemon = [
            POKEMON[Math.floor(Math.random() * 151)]
        ];

        this.pokedex = new Set();

        this.pokemon.forEach(pokemon => {
            this.pokedex.add(pokemon.id);
        });

        this.items = [];
        this.money = 0;
        this.history = {}; // Last spritesheet

        // Menu information
        this.menu = {
            active: false,
            cooldown: false,
            current: null,
            history: [],
        }

        this.set_sprite();
        this.set_emote();
        player_container.addChild(this.sprite);
        player_container.addChild(this.emote);
        this.place(position.x, position.y);
    }

    set_sprite() {
        this.sprite = new PIXI.AnimatedSprite(this.spritesheet.standSouth);
        this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.125;
        this.sprite.loop = false;
        this.sprite.x = app.view.width / 2;
        this.sprite.y = (app.view.height / 2) - 4;
        this.sprite.width = TILE_SIZE;
        this.sprite.height = TILE_SIZE;
        this.sprite.zIndex = 1;
    }

    set_emote() {
        this.emote = new PIXI.Sprite.from(app.loader.resources['emote-shock'].url);
        this.emote.anchor.set(0.5);
        this.emote.x = app.view.width / 2;
        this.emote.y = (app.view.height / 2) - 4 - 16;
        this.emote.width = TILE_SIZE;
        this.emote.height = TILE_SIZE;
        this.emote.visible = false;
        this.emote.zIndex = 2;
    }

    move(direction) {
        if (!player.moving && player.can_move && !paused) {
            this.last_position.f = this.position.f;

            let next_position = {
                x: this.position.x,
                y: this.position.y
            };

            switch (direction) {
                case 0: // North
                    if (!this.sprite.playing || this.sprite.textures !== this.spritesheet.walkNorth) {
                        if (!this.automove.spin) {
                            this.sprite.textures = this.spritesheet.walkNorth;
                            this.sprite.play();
                            this.facing = 'North';
                        }   
                    }

                    if (!this.automove.spin) {
                        this.position.f = 0;
                    }
                    
                    next_position.y--;

                    if (collision_check(next_position.x, next_position.y) == false) {
                        this.direction = 'North';
                        this.moving = true;
                        this.position.y--;
                        multiplayer_update_position();
                    } else {
                        if (this.automove.active) {
                            this.stop_forced_movement();
                        }

                        if (exit_check()) { // Check if the player is at an exit
                            let exit = this.current_map.atts[this.position.index];
                            this.place(exit.x, exit.y, exit.map);

                            if (collision_check(exit.x, exit.y - 1, exit.map) == false) {
                                this.direction = 'North';
                                this.moving = true;
                                this.position.y--;
                            }

                            multiplayer_update_position(true);
                            sfx.play('go-outside');
                        } else { // Collision into a barrier
                            sfx.play('collision');
                            multiplayer_update_facing();
                        }
                    }
                    break;
                case 1: // East
                    if (!this.sprite.playing || this.sprite.textures !== this.spritesheet.walkEast) {
                        if (!this.automove.spin) {
                            this.sprite.textures = this.spritesheet.walkEast;
                            this.sprite.play();       
                            this.facing = 'East';     
                        } 
                    }

                    if (!this.automove.spin) {
                        this.position.f = 1;
                    }

                    next_position.x++;

                    if (collision_check(next_position.x, next_position.y) == false) {
                        this.direction = 'East';
                        this.moving = true;
                        this.position.x++;
                        multiplayer_update_position();
                    } else {
                        if (this.automove.active) {
                            this.stop_forced_movement();
                        }

                        if (exit_check()) { // Check if the player is at an exit
                            let exit = this.current_map.atts[this.position.index];
                            this.place(exit.x, exit.y, exit.map);

                            if (collision_check(exit.x + 1, exit.y, exit.map) == false) {
                                this.direction = 'East';
                                this.moving = true;
                                this.position.x++;
                            }

                            sfx.play('go-outside');
                            multiplayer_update_position(true);
                        } else { // Collision into a barrier
                            sfx.play('collision');
                            multiplayer_update_facing();
                        }
                    }
                    break;
                case 2: // South
                    if (!this.sprite.playing || this.sprite.textures !== this.spritesheet.walkSouth) {
                        if (!this.automove.spin) {
                            this.sprite.textures = this.spritesheet.walkSouth;
                            this.sprite.play();
                            this.facing = 'South';
                        }
                    }

                    if (!this.automove.spin) {
                        this.position.f = 2;
                    }

                    next_position.y++;
                    
                    if (collision_check(next_position.x, next_position.y) == false) {
                        this.direction = 'South';
                        this.moving = true;
                        this.position.y++;
                        multiplayer_update_position();
                    } else {
                        if (this.automove.active) {
                            this.stop_forced_movement();
                        }

                        if (exit_check()) { // Check if the player is at an exit
                            let exit = this.current_map.atts[this.position.index];
                            this.place(exit.x, exit.y, exit.map);

                            if (collision_check(exit.x, exit.y + 1, exit.map) == false) {
                                this.position.y++;
                                this.direction = 'South';
                                this.moving = true;    
                            }

                            multiplayer_update_position(true);
                            sfx.play('go-outside');
                        } else { // Collision into a barrier
                            sfx.play('collision');
                            multiplayer_update_facing();
                        }
                    }
                    break;
                case 3: // West
                    if (!this.sprite.playing || this.sprite.textures !== this.spritesheet.walkWest) {
                        if (!this.automove.spin) {
                            this.sprite.textures = this.spritesheet.walkWest;
                            this.sprite.play();
                            this.facing = 'West';
                        }
                    }

                    if (!this.automove.spin) {
                        this.position.f = 3;
                    }

                    next_position.x--;

                    if (collision_check(next_position.x, next_position.y) == false) {
                        this.direction = 'West';
                        this.moving = true;
                        this.position.x--;
                        multiplayer_update_position();
                    } else {
                        if (this.automove.active) {
                            this.stop_forced_movement();
                        }

                        if (exit_check()) { // Check if the player is at an exit
                            let exit = this.current_map.atts[this.position.index];
                            this.place(exit.x, exit.y, exit.map);

                            if (collision_check(exit.x - 1, exit.y, exit.map) == false) {
                                this.direction = 'West';
                                this.moving = true;
                                this.position.x--;
                            }

                            multiplayer_update_position(true);
                            sfx.play('go-outside');
                        } else { // Collision into a barrier
                            sfx.play('collision');
                            multiplayer_update_facing();
                        }
                    }    
                    break;
                default:
                    break;
            }
        }
    }

    stop_forced_movement() {
        clearInterval(player.automove.interval);

        this.automove.active = false;
        this.automove.spin = false;
        this.frozen = false;
    }

    face(direction) {
        switch (direction) {
            case 0:
                this.position.f = 0;
                this.sprite.textures = this.spritesheet.standNorth;
                break;
            case 1:
                this.position.f = 1;
                this.sprite.textures = this.spritesheet.standEast;
                break;
            case 2:
                this.position.f = 2;
                this.sprite.textures = this.spritesheet.standSouth;
                break;
            case 3:
                this.position.f = 3;
                this.sprite.textures = this.spritesheet.standWest;
                break;
            default:
                break;
        }
    }

    force_move(direction, spaces, spin = false) {
        if (this.automove.active) {
            this.stop_forced_movement();
        }

        this.frozen = true;
        this.automove.active = true;
        this.automove.position = {...this.position};
        this.automove.spin = spin;

        switch (direction) {
            case 0: // North
                this.automove.position.y -= spaces;
                this.automove.interval = setInterval(() => {
                    this.move(direction);

                    if (player.position.y <= player.automove.position.y) {
                        this.stop_forced_movement();
                    }

                    if (this.automove.spin) {
                        if (!this.automove.spin_cooldown) {
                            this.automove.spin_cooldown = true;

                            let f = player.position.f + 1;

                            if (f > 3) {
                                f = 0;
                            }

                            this.face(f);
                            
                            setTimeout(() => {
                                player.automove.spin_cooldown = false;
                            }, 100)
                        }
                    }
                }, 16);
                break;
            case 1: // East
                this.automove.position.x += spaces;
                this.automove.interval = setInterval(() => {
                    this.move(direction);
        
                    if (player.position.x >= player.automove.position.x) {
                        this.stop_forced_movement();
                    }

                    if (this.automove.spin) {
                        if (!this.automove.spin_cooldown) {
                            this.automove.spin_cooldown = true;

                            let f = player.position.f + 1;

                            if (f > 3) {
                                f = 0;
                            }

                            this.face(f);
                            
                            setTimeout(() => {
                                player.automove.spin_cooldown = false;
                            }, 100)
                        }
                    }
                }, 16);
                break;
            case 2: // South
                this.automove.position.y += spaces;
                this.automove.interval = setInterval(() => {
                    this.move(direction);
        
                    if (player.position.y >= player.automove.position.y) {
                        this.stop_forced_movement();
                    }

                    if (this.automove.spin) {
                        if (!this.automove.spin_cooldown) {
                            this.automove.spin_cooldown = true;

                            let f = player.position.f + 1;

                            if (f > 3) {
                                f = 0;
                            }

                            this.face(f);
                            
                            setTimeout(() => {
                                player.automove.spin_cooldown = false;
                            }, 100)
                        }
                    }
                }, 16);
                break;
            case 3: // West
                this.automove.position.x -= spaces;
                this.automove.interval = setInterval(() => {
                    this.move(direction);
        
                    if (player.position.x <= player.automove.position.x) {
                        this.stop_forced_movement();
                    }

                    if (this.automove.spin) {
                        if (!this.automove.spin_cooldown) {
                            this.automove.spin_cooldown = true;

                            let f = player.position.f + 1;

                            if (f > 3) {
                                f = 0;
                            }

                            this.face(f);
                            
                            setTimeout(() => {
                                player.automove.spin_cooldown = false;
                            }, 100)
                        }
                    }
                }, 16);
                break;
        }

    }

    move_to_trainer(direction, trainer) {
        switch (direction) {
            case 0: // North
                this.automove.interval = setInterval(() => {
                    if (this.position.y - trainer.position.y > 1) {
                        this.move(0);
                    } else {
                        setTimeout(() => {
                            player.start_battle();
                        }, 5000);

                        clearInterval(this.automove.interval);
                    }
                }, 16);
                break;
            case 1: // East
                this.automove.interval = setInterval(() => {
                    if (trainer.position.x - this.position.x > 1) {
                        this.move(1);
                    } else {
                        setTimeout(() => {
                            player.start_battle();
                        }, 5000);

                        clearInterval(this.automove.interval);
                    }
                }, 16);
                break;
            case 2: // South
                this.automove.interval = setInterval(() => {
                    if (trainer.position.y - this.position.y > 1) {
                        this.move(2);
                    } else {
                        setTimeout(() => {
                            player.start_battle();
                        }, 5000);

                        clearInterval(this.automove.interval);
                    }
                }, 16);
                break;
            case 3: // East
                this.automove.interval = setInterval(() => {
                    if (this.position.x - trainer.position.x > 1) {
                        this.move(3);
                    } else {
                        setTimeout(() => {
                            player.start_battle();
                        }, 5000);
                        
                        clearInterval(this.automove.interval);
                    }
                }, 16);
                break;
        }
    }

    encounter(trainer) {
        switch (player.position.f) {
            case 0: // North
                setTimeout(() => {
                    player.move_to_trainer(0, trainer);
                }, (1500 - 16));
                break;
            case 1: // East
                setTimeout(() => {
                    player.move_to_trainer(1, trainer);
                }, (1500 - 16));
                break;
            case 2: // South
                setTimeout(() => {
                    player.move_to_trainer(2, trainer);
                }, (1500 - 16));
                break;
            case 3: // West
                setTimeout(() => {
                    player.move_to_trainer(3, trainer);
                }, (1500 - 16));
                break;
            default:
                break;
        }

        this.frozen = true;
        this.emote.visible = true;
        music.immediate_play(25);

        setTimeout(() => {
            this.emote.visible = false;
        }, 1500);
    }

    start_battle() {
        music.immediate_play(music.get_context());
        this.frozen = false;
    }

    wild_pokemon_battle(pokemon) {
        this.frozen = true;
        this.emote.visible = true;
        this.in_battle = true;
        this.controls = 'battle';
        battle.pokemon = pokemon;
        player.pokedex.add(pokemon.id);

        music.immediate_play(13);
        battle_prepare(pokemon.name, this.pokemon[0].name)
    }

    encountered() {
        this.frozen = true;
        music.immediate_play(25);

        setTimeout(() => {
            this.frozen = false;
            music.immediate_play(music.get_context());
        }, 5000);
    }

    place(x, y, map_id = false) {
        if (map_id !== false && map_id !== this.current_map.id) {
            map = maps[map_id]
            this.current_map = maps[map_id];
            map.build();
            this.position.map = map_id;

            trainers.forEach((trainer, i) => {
                if (trainer.position.map == this.position.map) {
                    trainers[i].sprite.visible = true;
                    trainers[i].change_facing();
                } else {
                    trainers[i].sprite.visible = false;
                }
            });
        }

        background.x = background.origin.x + ((x * TILE_SIZE) * -1);
        background.y = background.origin.y + ((y * TILE_SIZE) * -1);

        atts_container.x = atts_container.origin.x + ((x * TILE_SIZE) * -1);
        atts_container.y = atts_container.origin.y + ((y * TILE_SIZE) * -1);

        npc_container.x = npc_container.origin.x + ((x * TILE_SIZE) * -1);
        npc_container.y = npc_container.origin.y + ((y * TILE_SIZE) * -1);

        trainer_container.x = trainer_container.origin.x + ((x * TILE_SIZE) * -1);
        trainer_container.y = trainer_container.origin.y + ((y * TILE_SIZE) * -1);

        this.position.x = x;
        this.position.y = y;
        this.position.index = this.position.x + this.current_map.width * this.position.y;
        this.position.tile = this.current_map.atts[x + this.current_map.width * y];
        
        if (editor.enabled) {
            editor.prepare_tiles();
            editor.prepare_properties();

            if (editor.enabled) {
                editor.log();
            }
        }
    }

    freeze(ms = 250) {
        this.frozen = true;

        setTimeout(() => {
            this.frozen = false;
        }, ms)
    }

    check_action(direction) {
        let map_tile;
        let att_tile;
        let index;

        switch (direction) {
            case 0:
                index = this.position.x + this.current_map.width * (this.position.y - 1);
                break;
            case 1:
                index = (this.position.x + 1) + this.current_map.width * this.position.y
                break;
            case 2:
                index = this.position.x + this.current_map.width * (this.position.y + 1)
                break;
            case 3:
                index = (this.position.x - 1) + this.current_map.width * this.position.y;
                break;
            default:
                break;
        }

        map_tile = this.current_map.tiles[index];
        att_tile = this.current_map.atts[index];

        switch (att_tile.type) {
            case 1:
                if (!dialogue.active && !dialogue.cooldown) {
                    check_sprite_tile_actions(map_tile);
                }
                break;
            case 3:
                if (!dialogue.active && !dialogue.cooldown) {
                    dialogue.queue_messages(att_tile.dialogue);
                }
                break;
            case 7:
                let item = new Item(att_tile.name);
                dialogue.add_message(`Found; ${att_tile.name}!`);

                sfx.play('item-found');

                this.items.push(item);

                this.current_map.atts[index] = {type: 0};
                maps[this.current_map.id].atts[index] = {type: 0};

                map.items.forEach((item, i) => {
                    if (item.position.index == index) {
                        map.items[i].sprite.visible = false;
                        map.items[i].available = false;
                    }
                });
                
                map.build_tiles();
                map.build_atts();
                map.build_items();
                maps[map.id] = map;
                break;
            default:
                break;
        }

        npcs.forEach((npc, i) => {
            if (index == npc.position.index) {
                if (!dialogue.active && !dialogue.cooldown) {
                    npc.frozen = true;
                    npc.face_player();
                    dialogue.queue_messages(npc.dialogue);
                }
            };
        });

        trainers.forEach((trainer, i) => {
            if (trainer.position.map == this.position.map) {
                if (index == trainer.position.x + this.current_map.width * trainer.position.y) {
                    dialogue.queue_messages(`${trainer.name}`);
                };
            }
        });

        console.log(att_tile);
    }

    change_spritesheet(num = 0) {
        if (!num) {
            num = Math.floor(Math.random() * 40); // Mobile spritesheets
        }

        this.spritesheet_id = num;
        this.spritesheet = spritesheets[num];

        switch (this.facing) {
            case 'North':
                this.sprite.textures = this.spritesheet.standNorth;
                break;
            case 'South':
                this.sprite.textures = this.spritesheet.standSouth;
                break;
            case 'West':
                this.sprite.textures = this.spritesheet.standWest;
                break;
            case 'East':
                this.sprite.textures = this.spritesheet.standEast;
                break;
            default:
                break;
        }

        multiplayer_update_spritesheet();
    }

    position_update() {
        this.position.index = this.position.x + this.current_map.width * this.position.y;
        this.position.tile = this.current_map.tiles[this.position.index];
        this.position.att = this.current_map.atts[this.position.index];

        switch (this.position.att.type) {
            case 2: // Warp
                if (this.position.tile == 138) { // Tile is a door
                    sfx.play('go-inside');
                } else {
                    sfx.play('go-outside');
                }
                
                this.place(this.position.att.x, this.position.att.y, this.position.att.map);
                this.freeze();
                break;
            case 9: // Event
                dialogue.queue_messages(this.position.att.dialogue);
            default:
                break;
        }

        if (editor.enabled) {
            editor.log();
        }
    }

    use_item(name) {
        this.items.forEach(item => {
            if (item.name == name) {
                item.use();
            }
        });
    }
}