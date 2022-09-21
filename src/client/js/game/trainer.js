class Trainer {
    constructor(name = '', position = {map: 0, x: 0, y: 0, f: 2}, spritesheet_id = 0, socket_id = 0) {
        this.name = name;
        this.position = position;

        switch (this.position.f) {
            case 0:
                this.facing = 'North';
                break;
            case 1:
                this.facing = 'East';
                break;
            case 2:
                this.facing = 'South';
                break;
            case 3:
                this.facing = 'West';
                break;
            default:
                break;
        }

        this.socket_id = socket_id;

        this.spritesheet_id = spritesheet_id;
        this.spritesheet = spritesheets[spritesheet_id];

        this.can_check_action = true;
        this.frozen = false;
        this.moving = false;
        this.can_move = true;
        this.controls = 'walking' // walking, menu, battle
        this.current_move_ticker = 0;
        this.current_map = maps[0];
        this.speed = 1;

        this.pokemon = [];
        this.items = [];

        this.set_sprite();
        this.set_emote();
        multiplayer_container.addChild(this.sprite);
        multiplayer_container.addChild(this.emote);
        this.position_update(position);
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
        
        // this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.125;
        this.sprite.loop = false;
        this.sprite.x = this.position.x * TILE_SIZE;
        this.sprite.y = this.position.y * TILE_SIZE;
        this.sprite.width = TILE_SIZE;
        this.sprite.height = TILE_SIZE;
    }

    set_emote() {
        this.emote = new PIXI.Sprite.from(app.loader.resources['emote-shock'].url);
        this.emote.x = this.position.x * TILE_SIZE;
        this.emote.y = this.position.y * TILE_SIZE - TILE_SIZE;
        this.emote.width = TILE_SIZE;
        this.emote.height = TILE_SIZE;
        this.emote.visible = false;
    }

    encounter() {
        this.frozen = true;
        this.emote.visible = true;

        setTimeout(() => {
            this.emote.visible = false;
        }, 1500);

        setTimeout(() => {
            this.frozen = false;
        }, 5000);
    }

    encountered() {
        this.frozen = true;

        setTimeout(() => {
            this.frozen = false;
        }, 5000);
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

    change_facing() {
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
            case 0:
                next_position.y--;   
                break;
            case 1:
                next_position.x++;  
                break;
            case 2:
                next_position.y++;   
                break;
            case 3:
                next_position.x--;   
                break;
            default:
                break;
        }

        if (this.moving == false) {
            this.moving = true;
            this.current_move_ticker = 0;
            this.colliding = trainer_collision_check(next_position.x, next_position.y);

            switch (direction) {
                case 0:
                    if (!this.sprite.playing || this.sprite.textures !== player.spritesheet.walkNorth) {
                        this.sprite.textures = this.spritesheet.walkNorth;
                        this.sprite.play();
                        this.facing = 'North';    
                    }

                    this.position.f = 0; 
                    break;
                case 1:
                    if (!this.sprite.playing || this.sprite.textures !== this.spritesheet.walkEast) {
                        this.sprite.textures = this.spritesheet.walkEast;
                        this.sprite.play();
                        this.facing = 'East'; 
                    }

                    this.position.f = 1; 
                    break;
                case 2:
                    if (!this.sprite.playing || this.sprite.textures !== this.spritesheet.walkSouth) {
                        this.sprite.textures = this.spritesheet.walkSouth;
                        this.sprite.play();
                        this.facing = 'South'; 
                    }

                    this.position.f = 2;
                    break;
                case 3:
                    if (!this.sprite.playing || this.sprite.textures !== this.spritesheet.walkWest) {
                        this.sprite.textures = this.spritesheet.walkWest;
                        this.sprite.play();
                        this.facing = 'West'; 
                    }

                    this.position.f = 3;
                    break;
                default:
                    break;
            }
        }
    }

    position_update(next_position, facing) {
        this.facing = facing;

        if (next_position.map !== player.position.map) { // Trainer is not on player\'s map
            // console.log('Trainer is not on player\'s map', next_position);
            this.sprite.visible = false;
        } else if (this.position.map !== player.position.map && next_position.map == player.position.map) { // Trainer is changing to player's map
            // console.log('Trainer is changing to player\'s map', next_position);
            this.sprite.visible = true;
        } else { // Trainer is on player's map
            // console.log('Trainer is on player\'s map', next_position);
            this.sprite.visible = true;
        }

        this.sprite.x = next_position.x * TILE_SIZE;
        this.sprite.y = next_position.y * TILE_SIZE;
        this.emote.x = next_position.x * TILE_SIZE;
        this.emote.y = next_position.y * TILE_SIZE - TILE_SIZE;

        this.place(next_position.map, next_position.x, next_position.y);
        // console.log('trainer -> position_update', next_position);
        return;
    }

    remove() {
        multiplayer_container.removeChild(this.sprite);
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