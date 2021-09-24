class Npc {
    constructor(position = {x: 0, y: 0}, spritesheet_id = 0, message = '', index = 0) {
        this.position = position;
        this.message = message;

        this.spritesheet_id = spritesheet_id;
        this.spritesheet = spritesheets[spritesheet_id];
 
        this.facing = 'South';
        this.frozen = false;
        this.moving = false;
        this.can_move = true;
        this.current_move_ticker = 0;
        
        this.pokemon = [];
        this.inventory = [];

        this.set_sprite();
        npc_container.addChild(this.sprite);
        this.place(position.x, position.y);

        if (this.can_move) {
            this.wander_interval = setInterval(this.wander, 1000, index);
        }
    }

    set_sprite() {
        this.sprite = new PIXI.AnimatedSprite(this.spritesheet.standSouth);
        // this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.125;
        this.sprite.loop = false;
        this.sprite.x = this.position.x * TILE_SIZE;
        this.sprite.y = this.position.y * TILE_SIZE;
        this.sprite.width = TILE_SIZE;
        this.sprite.height = TILE_SIZE;
    }

    place(x, y) {
        this.position.index = this.position.x + map.width * this.position.y;
        this.position.tile = map.atts[x + map.width * y];
    }

    freeze(ms = 250) {
        this.frozen = true;

        setTimeout(() => {
            this.frozen = false;
        }, ms)
    }

    face_player() {
        this.frozen = true;

        switch (player.facing) {
            case 'North':
                this.sprite.textures = this.spritesheet.standSouth;
                break;
            case 'South':
                this.sprite.textures = this.spritesheet.standNorth;
                break;
            case 'West':
                this.sprite.textures = this.spritesheet.standEast;
                break;
            case 'East':
                this.sprite.textures = this.spritesheet.standWest;
                break;
        }
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
        this.position.index = this.position.x + map.width * this.position.y;
        this.position.tile = map.tiles[this.position.index];
        this.position.att = map.atts[this.position.index];

        if (editor.enabled) {
            editor.log();
        }
    }

    move(direction) {
        let next_position = {
            x: this.position.x,
            y: this.position.y
        };

        switch (direction) {
            case 'East':
                next_position.x++;  
                break;
            case 'West':
                next_position.x--;   
                break;
            case 'North':
                next_position.y--;   
                break;
            case 'South':
                next_position.y++;   
                break;
            default:
                break;
        }

        if (!collision_check(next_position.x, next_position.y)) {
            this.moving = true;
            this.current_move_ticker = 0;
            
            switch (direction) {
                case 'East':
                    this.sprite.textures = this.spritesheet.walkEast;
                    this.sprite.play();
                    this.facing = 'East'; 
                    this.position.x++;  
                    break;
                case 'West':
                    this.sprite.textures = this.spritesheet.walkWest;
                    this.sprite.play();
                    this.facing = 'West'; 
                    this.position.x--;   
                    break;
                case 'North':
                    this.sprite.textures = this.spritesheet.walkNorth;
                    this.sprite.play();
                    this.facing = 'North'; 
                    this.position.y--;   
                    break;
                case 'South':
                    this.sprite.textures = this.spritesheet.walkSouth;
                    this.sprite.play();
                    this.facing = 'South'; 
                    this.position.y++;   
                    break;
                default:
                    break;
            }
        }
    }

    wander(index) {
        let movement_roll = Math.floor(Math.random() * 2) + 1, // 20% chance to move
            direction_roll = Math.floor(Math.random() * 3) + 1, // Random direction
            directions = ['North', 'South', 'East', 'West'];
        
        if (movement_roll == 1) {
            if (npcs[index] && !npcs[index].frozen) {
                npcs[index].move(directions[direction_roll]);
            }
        }
    }
}