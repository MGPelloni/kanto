class Npc {
    constructor(position = {map: 0, x: 0, y: 0}, spritesheet_id = 0, message = '', facing = 'South', movement_state = 'Active', index = 0) {
        this.position = position;
        this.message = message;
        this.spritesheet_id = spritesheet_id;
        this.spritesheet = spritesheets[spritesheet_id];
 
        this.initial_properties = {
            position: position,
            facing: facing
        };

        this.uid = `M${this.position.map}X${this.position.x}Y${this.position.y}`;

        this.facing = facing;
        this.frozen = false;
        this.moving = false;
        this.can_move = true;

        if (movement_state != 'Active') {
            this.can_move = false;
        }

        this.current_move_ticker = 0;
        
        this.pokemon = [];
        this.inventory = [];

        this.set_sprite();
        npc_container.addChild(this.sprite);
        this.place(position.x, position.y);

        switch (movement_state) {
            // case 'Active':
            //     this.wander_interval = setInterval(this.wander, 1000, index);
            //     break;
            case 'Static':
                this.wander_interval = setInterval(this.look_around, 1000, index);
                break;
            case 'Frozen':
                this.wander_interval = setInterval(this.return_to_original_facing, 3000, index);
                break;
            default:
                break;
        }
    }

    set_sprite() {
        switch (this.facing) {
            case 'North':
                this.sprite = new PIXI.AnimatedSprite(this.spritesheet.standNorth);
                break;
            case 'West':
                this.sprite = new PIXI.AnimatedSprite(this.spritesheet.standWest);
                break;
            case 'South':
                this.sprite = new PIXI.AnimatedSprite(this.spritesheet.standSouth);
                break;
            case 'East':
                this.sprite = new PIXI.AnimatedSprite(this.spritesheet.standEast);
                break;       
            default:
                break;
        }
        
        // this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.125;
        this.sprite.loop = false;
        this.sprite.x = this.position.x * TILE_SIZE;
        this.sprite.y = this.position.y * TILE_SIZE;
        this.sprite.width = TILE_SIZE;
        this.sprite.height = TILE_SIZE;
    }

    place(x, y, facing) {
        this.position.x = x;
        this.position.y = y;
        this.position.index = x + map.width * y;
        this.position.tile = map.atts[x + map.width * y];
        this.sprite.x = x * TILE_SIZE;
        this.sprite.y = y * TILE_SIZE;
        this.face_sprite(facing);
    }

    freeze(ms = 250) {
        this.frozen = true;

        setTimeout(() => {
            this.frozen = false;
        }, ms)
    }

    face_player() {
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

        this.sprite.x = this.position.x * TILE_SIZE;
        this.sprite.y = this.position.y * TILE_SIZE;

        if (editor.enabled) {
            editor.log();
        }
    }

    move(direction) {
        // let next_position = {
        //     x: this.position.x,
        //     y: this.position.y
        // };

        // switch (direction) {
        //     case 'East':
        //         next_position.x++;  
        //         break;
        //     case 'West':
        //         next_position.x--;   
        //         break;
        //     case 'North':
        //         next_position.y--;   
        //         break;
        //     case 'South':
        //         next_position.y++;   
        //         break;
        //     default:
        //         break;
        // }

        // if (!collision_check(next_position.x, next_position.y)) {
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
        // }
    }

    wander(index) {
        if (npcs[index] && !npcs[index].frozen) {
            let movement_roll = Math.floor(Math.random() * 5) + 1, // 20% chance to move
                direction_roll = Math.floor(Math.random() * 3) + 1, // Random direction
                directions = ['North', 'South', 'East', 'West'];
            
            if (movement_roll == 1) {
                npcs[index].move(directions[direction_roll]);
            }
        }
    }

    look_around(index) {
        if (npcs[index] && !npcs[index].frozen) {
            let movement_roll = Math.floor(Math.random() * 3) + 1, // 33% chance to move
                direction_roll = Math.floor(Math.random() * 3) + 1, // Random direction
                directions = ['North', 'South', 'East', 'West'];
            
            if (movement_roll == 1) {
                switch (directions[direction_roll]) {
                    case 'North':
                        npcs[index].sprite.textures = npcs[index].spritesheet.standNorth;
                        break;
                    case 'South':
                        npcs[index].sprite.textures = npcs[index].spritesheet.standSouth;
                        break;
                    case 'West':
                        npcs[index].sprite.textures = npcs[index].spritesheet.standWest;
                        break;
                    case 'East':
                        npcs[index].sprite.textures = npcs[index].spritesheet.standEast;
                        break;
                    default:
                        break;
                }
            }
        }
    }

    return_to_original_facing(index) {
        if (npcs[index] && !npcs[index].frozen) {
            switch (npcs[index].initial_properties.facing) {
                case 'North':
                    npcs[index].sprite.textures = npcs[index].spritesheet.standNorth;
                    break;
                case 'South':
                    npcs[index].sprite.textures = npcs[index].spritesheet.standSouth;
                    break;
                case 'West':
                    npcs[index].sprite.textures = npcs[index].spritesheet.standWest;
                    break;
                case 'East':
                    npcs[index].sprite.textures = npcs[index].spritesheet.standEast;
                    break;
                default:
                    break;
            }
        }
    }

    face_sprite(direction) {
        switch (direction) {
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
}