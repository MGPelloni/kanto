class Player {
    constructor(name = '', position = {map: 0, x: 0, y: 0, f: 2}, spritesheet_id = 0) {
        this.name = name;
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

        this.pokemon = [];
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
        app.stage.addChild(this.sprite);
        app.stage.addChild(this.emote);
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
    }

    set_emote() {
        this.emote = new PIXI.Sprite.from(app.loader.resources['emote-shock'].url);
        this.emote.anchor.set(0.5);
        this.emote.x = app.view.width / 2;
        this.emote.y = (app.view.height / 2) - 4 - 16;
        this.emote.width = TILE_SIZE;
        this.emote.height = TILE_SIZE;
        this.emote.visible = false;
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
                        this.sprite.textures = this.spritesheet.walkNorth;
                        this.sprite.play();
                        this.facing = 'North';
                    }

                    this.position.f = 0;
                    next_position.y--;

                    if (collision_check(next_position.x, next_position.y) == false) {
                        this.direction = 'North';
                        this.moving = true;
                        this.position.y--;
                        multiplayer_update_position();
                    } else {
                        if (exit_check()) { // Check if the player is at an exit
                            this.place(this.current_map.atts[this.position.index].x, this.current_map.atts[this.position.index].y, this.current_map.atts[this.position.index].map);
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
                        this.sprite.textures = this.spritesheet.walkEast;
                        this.sprite.play();       
                        this.facing = 'East';      
                    }

                    next_position.x++;
                    this.position.f = 1;

                    if (collision_check(next_position.x, next_position.y) == false) {
                        this.direction = 'East';
                        this.moving = true;
                        this.position.x++;
                        multiplayer_update_position();
                    } else {
                        if (exit_check()) { // Check if the player is at an exit
                            this.place(this.current_map.atts[this.position.index].x, this.current_map.atts[this.position.index].y, this.current_map.atts[this.position.index].map);
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
                        this.sprite.textures = this.spritesheet.walkSouth;
                        this.sprite.play();
                        this.facing = 'South';
                    }

                    next_position.y++;
                    this.position.f = 2;

                    if (collision_check(next_position.x, next_position.y) == false) {
                        this.direction = 'South';
                        this.moving = true;
                        this.position.y++;
                        multiplayer_update_position();
                    } else {
                        if (exit_check()) { // Check if the player is at an exit
                            this.place(this.current_map.atts[this.position.index].x, this.current_map.atts[this.position.index].y, this.current_map.atts[this.position.index].map);
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
                        this.sprite.textures = this.spritesheet.walkWest;
                        this.sprite.play();
                        this.facing = 'West';
                    }

                    next_position.x--;
                    this.position.f = 3;

                    if (collision_check(next_position.x, next_position.y) == false) {
                        this.direction = 'West';
                        this.moving = true;
                        this.position.x--;
                        multiplayer_update_position();
                    } else {
                        if (exit_check()) { // Check if the player is at an exit
                            this.place(this.current_map.atts[this.position.index].x, this.current_map.atts[this.position.index].y, this.current_map.atts[this.position.index].map);
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

    move_to_trainer(direction, trainer) {
        switch (direction) {
            case 0: // North
                this.automove = setInterval(() => {
                    if (this.position.y - trainer.position.y > 1) {
                        this.move(0);
                    } else {
                        setTimeout(() => {
                            player.start_battle();
                        }, 5000);

                        clearInterval(this.automove);
                    }
                }, 16);
                break;
            case 1: // East
                this.automove = setInterval(() => {
                    if (trainer.position.x - this.position.x > 1) {
                        this.move(1);
                    } else {
                        setTimeout(() => {
                            player.start_battle();
                        }, 5000);

                        clearInterval(this.automove);
                    }
                }, 16);
                break;
            case 2: // South
                this.automove = setInterval(() => {
                    if (trainer.position.y - this.position.y > 1) {
                        this.move(2);
                    } else {
                        setTimeout(() => {
                            player.start_battle();
                        }, 5000);

                        clearInterval(this.automove);
                    }
                }, 16);
                break;
            case 3: // East
                this.automove = setInterval(() => {
                    if (this.position.x - trainer.position.x > 1) {
                        this.move(3);
                    } else {
                        setTimeout(() => {
                            player.start_battle();
                        }, 5000);
                        
                        clearInterval(this.automove);
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
        music.immediate_play(43);

        setTimeout(() => {
            this.emote.visible = false;
        }, 1500);
    }

    start_battle() {
        // music.immediate_play(23);

        music.immediate_play(map.music);
        this.frozen = false;

        // setTimeout(() => {

        // }, 5000);
    }

    encountered() {
        this.frozen = true;
        music.immediate_play(43);

        setTimeout(() => {
            this.frozen = false;
            music.immediate_play(map.music);
        }, 5000);
    }

    place(x, y, map_id = false) {
        if (map_id !== false && map_id !== this.current_map.id) {
            map = maps[map_id]
            this.current_map = maps[map_id];
            map.build();
            this.position.map = map_id;

            multiplayer.trainers.forEach((trainer, i) => {
                if (trainer.position.map == this.position.map) {
                    multiplayer.trainers[i].sprite.visible = true;
                    multiplayer.trainers[i].change_facing();
                } else {
                    multiplayer.trainers[i].sprite.visible = false;
                }
            });
        }

        background.x = background.origin.x + ((x * TILE_SIZE) * -1);
        background.y = background.origin.y + ((y * TILE_SIZE) * -1);

        atts_container.x = atts_container.origin.x + ((x * TILE_SIZE) * -1);
        atts_container.y = atts_container.origin.y + ((y * TILE_SIZE) * -1);

        npc_container.x = npc_container.origin.x + ((x * TILE_SIZE) * -1);
        npc_container.y = npc_container.origin.y + ((y * TILE_SIZE) * -1);

        multiplayer_container.x = multiplayer_container.origin.x + ((x * TILE_SIZE) * -1);
        multiplayer_container.y = multiplayer_container.origin.y + ((y * TILE_SIZE) * -1);

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
                if (!dialogue.active) {
                    check_sprite_tile_actions(map_tile);
                }
                break;
            case 3:
                if (!dialogue.active) {
                    dialogue.queue_messages(att_tile.dialogue);
                }
                break;
            case 7:
                let item = new Item(att_tile.name);
                dialogue.add_message(`Found; ${att_tile.name}!`);

                let found_sfx = new Sfx();
                found_sfx.enabled = true;
                found_sfx.play('item-found', 0.5);

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
                if (!dialogue.active) {
                    npc.frozen = true;
                    npc.face_player();
                    dialogue.queue_messages(npc.dialogue);
                }
            };
        });

        console.log(att_tile);
    }

    change_spritesheet(num = 0) {
        if (!num) {
            num = Math.floor(Math.random() * mobile_ss_amount);
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
            default:
                break;
        }

        if (editor.enabled) {
            editor.log();
        }

        // if (multiplayer.enabled) {
        //     multiplayer_update_position();
        // }
    }

    use_item(name) {
        this.items.forEach(item => {
            if (item.name == name) {
                item.use();
            }
        });
    }
}