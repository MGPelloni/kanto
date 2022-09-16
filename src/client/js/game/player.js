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

        this.pokemon = [];
        this.items = [];

        // Menu information
        this.menu = {
            active: false,
            cooldown: false,
            current: null,
            history: [],
        }

        this.set_sprite();
        app.stage.addChild(this.sprite);
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
                    dialogue.queue_messages(att_tile.message);
                }
                break;
            case 7:
                let item = new Item(att_tile.name);
                dialogue.add_message(`Found; ${att_tile.name}!`);

                let found_sfx = new Sfx();
                found_sfx.enabled = true;
                found_sfx.play('item-found', 0.5);

                player.items.push(item);

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
                    dialogue.queue_messages(npc.message);
                }
            };
        });

        console.log(att_tile);
    }

    change_spritesheet(num = 0) {
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
}