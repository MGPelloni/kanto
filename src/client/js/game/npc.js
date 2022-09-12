class Npc {
    constructor(position = {map: 0, x: 0, y: 0, f: 0}, spritesheet_id = 0, message = '', facing = 'South', movement_state = 'Active', index = 0) {        
        // Setting position based on attribute
        this.position = position;
        
        switch (facing) {
            case 'North':
                this.position.f = 0;
                break;
            case 'East':
                this.position.f = 1;
                break;
            case 'South':
                this.position.f = 2;
                break;
            case 'West':
                this.position.f = 3;
                break;
            default:
                break;
        }

        // Log initial properties
        this.initial_properties = {
            position: position,
        };

        this.uid = `M${this.position.map}X${this.position.x}Y${this.position.y}`;
        this.message = message;
        this.spritesheet_id = spritesheet_id;
        this.spritesheet = spritesheets[spritesheet_id]; 
        this.frozen = false;
        this.moving = false;
        this.can_move = true;

        if (movement_state != 'Active') {
            this.can_move = false;
        }

        this.current_move_ticker = 0;
        this.pokemon = [];
        this.items = [];

        this.set_sprite();
        npc_container.addChild(this.sprite);
        this.place(position.x, position.y, position.f);

        // "Active" states are controlled by the server
        switch (movement_state) {
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
        switch (this.position.f) {
            case 0:
                this.sprite = new PIXI.AnimatedSprite(this.spritesheet.standNorth);
                break;
            case 1:
                this.sprite = new PIXI.AnimatedSprite(this.spritesheet.standEast);
                break; 
            case 2:
                this.sprite = new PIXI.AnimatedSprite(this.spritesheet.standSouth);
                break;
            case 3:
                this.sprite = new PIXI.AnimatedSprite(this.spritesheet.standWest);
                break;
            default:
                break;
        }
        
        // Hide sprite until synced with server
        if (this.can_move) {
            this.sprite.visible = false;
        }

        this.sprite.animationSpeed = 0.125;
        this.sprite.loop = false;
        this.sprite.x = this.position.x * TILE_SIZE;
        this.sprite.y = this.position.y * TILE_SIZE;
        this.sprite.width = TILE_SIZE;
        this.sprite.height = TILE_SIZE;
    }

    place(x, y, f) {
        this.position.x = x;
        this.position.y = y;
        this.position.f = f;
        this.position.index = x + map.width * y;
        this.position.tile = map.atts[x + map.width * y];
        this.sprite.x = x * TILE_SIZE;
        this.sprite.y = y * TILE_SIZE;
        this.face_sprite(f);
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

        switch (this.position.f) {
            case 0:
                this.sprite.textures = this.spritesheet.standNorth;
                break;
            case 1:
                this.sprite.textures = this.spritesheet.standEast;
                break;
            case 2:
                this.sprite.textures = this.spritesheet.standSouth;
                break;
            case 3:
                this.sprite.textures = this.spritesheet.standWest;
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
        this.moving = true;
        this.current_move_ticker = 0;
        
        switch (direction) {
            case 'North':
                this.sprite.textures = this.spritesheet.walkNorth;
                this.sprite.play();
                this.position.f = 0; 
                this.position.y--;   
                break;
            case 'East':
                this.sprite.textures = this.spritesheet.walkEast;
                this.sprite.play();
                this.position.f = 1; 
                this.position.x++;  
                break;
            case 'South':
                this.sprite.textures = this.spritesheet.walkSouth;
                this.sprite.play();
                this.position.f = 2; 
                this.position.y++;   
                break;
            case 'West':
                this.sprite.textures = this.spritesheet.walkWest;
                this.sprite.play();
                this.position.f = 3; 
                this.position.x--;   
                break;
            default:
                break;
        }
    }

    look_around(index) {
        if (npcs[index] && !npcs[index].frozen) {
            let movement_roll = Math.floor(Math.random() * 3) + 1, // 33% chance to move
                direction_roll = Math.floor(Math.random() * 3) + 1; // Random direction
            
            if (movement_roll == 1) {
                switch (direction_roll) {
                    case 0:
                        npcs[index].sprite.textures = npcs[index].spritesheet.standNorth;
                        break;
                    case 1:
                        npcs[index].sprite.textures = npcs[index].spritesheet.standEast;
                        break;
                    case 2:
                        npcs[index].sprite.textures = npcs[index].spritesheet.standSouth;
                        break;
                    case 3:
                        npcs[index].sprite.textures = npcs[index].spritesheet.standWest;
                        break;
                    default:
                        break;
                }
            }
        }
    }

    return_to_original_facing(index) {
        if (npcs[index] && !npcs[index].frozen) {
            switch (npcs[index].initial_properties.position.f) {
                case 0:
                    npcs[index].sprite.textures = npcs[index].spritesheet.standNorth;
                    break;
                case 1:
                    npcs[index].sprite.textures = npcs[index].spritesheet.standEast;
                    break;
                case 2:
                    npcs[index].sprite.textures = npcs[index].spritesheet.standSouth;
                    break;
                case 3:
                    npcs[index].sprite.textures = npcs[index].spritesheet.standWest;
                    break;
                default:
                    break;
            }
        }
    }

    face_sprite(direction) {
        switch (direction) {
            case 0:
                this.sprite.textures = this.spritesheet.standNorth;
                break;
            case 1:
                this.sprite.textures = this.spritesheet.standEast;
                break;
            case 2:
                this.sprite.textures = this.spritesheet.standSouth;
                break;
            case 3:
                this.sprite.textures = this.spritesheet.standWest;
                break;
            default:
                break;
        }
    }
}