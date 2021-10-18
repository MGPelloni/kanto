class Trainer {
    constructor(name = '', position = {map: 0, x: 0, y: 0}, facing = 'South', spritesheet_id = 0, socket_id = 0) {
        this.name = name;
        this.position = position;
        this.socket_id = socket_id;

        this.spritesheet_id = spritesheet_id;
        this.spritesheet = spritesheets[spritesheet_id];
 
        this.facing = facing;
        this.can_check_action = true;
        this.frozen = false;
        this.moving = false;
        this.can_move = true;
        this.controls = 'walking' // walking, menu, battle
        this.current_move_ticker = 0;
        this.current_map = maps[0];

        this.pokemon = [];
        this.inventory = [];

        this.set_sprite();
        multiplayer_container.addChild(this.sprite);
        this.place(position.map, position.x, position.y);
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

    place(map, x, y) {
        this.position.map = map;
        this.position.x = x;
        this.position.y = y;
    }

    freeze(ms = 250) {
        this.frozen = true;

        setTimeout(() => {
            this.frozen = false;
        }, ms)
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

    position_update(position) {
        this.position = position;
        
        if (player.position.map == this.position.map) {
            this.sprite.visible = true;
        } else {
            this.sprite.visible = false;
        }

        console.log('trainer -> position_update', position);
        return;
    }

    remove() {
        multiplayer_container.removeChild(this.sprite);
    }
}