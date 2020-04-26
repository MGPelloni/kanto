class Player {
    constructor(name = '', position = {map: 0, x: 0, y: 0}, spritesheet = false) {
        this.name = name;
        this.position = position;
        this.spritesheet = spritesheet;

        this.facing = 'South';
        this.can_check_action = true;
        this.moving = false;
        this.current_move_ticker = 0;
        this.can_move = true;
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
        this.position.tile = this.current_map.atts[x + this.current_map.width * y];

        if (editor.enabled) {
            editor.prepare_tiles();
        }
    }

    check_action(direction) {
        switch (direction) {
            case 'North':
                console.log(this.current_map.atts[this.position.x + this.current_map.width * (this.position.y - 1)]);
                break;
            case 'South':
                console.log(this.current_map.atts[this.position.x + this.current_map.width * (this.position.y + 1)]);
                break;
            case 'West':
                console.log(this.current_map.atts[(this.position.x - 1) + this.current_map.width * this.position.y]);
                break;
            case 'East':
                console.log(this.current_map.atts[(this.position.x + 1) + this.current_map.width * this.position.y]);
                break;
            default:
                break;
        }
    }

    position_update() {
        let array_pos = this.position.x + this.current_map.width * this.position.y;
        this.position.tile = this.current_map.atts[array_pos];

        switch (this.position.tile.type) {
            case 2: // Warp
                player.place(this.position.tile.x, this.position.tile.y, this.position.tile.map);
                return;
                break;
            default:
                break;
        }
    }
}