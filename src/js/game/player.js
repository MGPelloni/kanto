class Player {
    constructor(name = '', position = {map: 0, x: 0, y: 0}, spritesheet = false) {
        this.name = name;
        this.position = position;
        this.spritesheet = spritesheet;

        this.facing = 'South';
        this.can_check_action = true;
        this.frozen = false;
        this.moving = false;
        this.can_move = true;
        this.current_move_ticker = 0;
        this.current_map = maps[0];

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
        this.sprite.y = app.view.height / 2;
        this.sprite.width = TILE_SIZE;
        this.sprite.height = TILE_SIZE;
    }

    place(x, y, map_id = false) {
        if (map_id !== false && map_id !== this.current_map.id) {
            map = maps[map_id]
            this.current_map = maps[map_id];
            map.build();
            this.position.map = map_id;
        }

        background.x = background.origin.x + ((x * TILE_SIZE) * -1);
        background.y = background.origin.y + ((y * TILE_SIZE) * -1);

        atts_container.x = atts_container.origin.x + ((x * TILE_SIZE) * -1);
        atts_container.y = atts_container.origin.y + ((y * TILE_SIZE) * -1);

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
            case 'North':
                index = this.position.x + this.current_map.width * (this.position.y - 1);
                break;
            case 'South':
                index = this.position.x + this.current_map.width * (this.position.y + 1)
                break;
            case 'West':
                index = (this.position.x - 1) + this.current_map.width * this.position.y;
                break;
            case 'East':
                index = (this.position.x + 1) + this.current_map.width * this.position.y
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
            default:
                break;
        }

        console.log(att_tile);
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
    }
}