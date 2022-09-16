class Npc {
    constructor(position = {map: 0, x: 0, y: 0, f: 0}, facing = 'South', movement_state = 'Active', map = null, lobby_id = 0, index = 0) {
        this.position = position;
        this.facing = facing;
        this.map = map;
        this.movement_state = movement_state;
        this.index = index;
        this.lobby_id = lobby_id;

        this.initial_properties = {
            position: position,
            facing: facing
        };

        this.uid = `M${this.position.map}X${this.position.x}Y${this.position.y}`;

        if (this.movement_state == 'Active') {
            let that = this;
            this.wander_interval = setInterval(this.wander, 1000, that);
        }
    }
    
    place(x, y) {
        this.position.index = this.position.x + this.map.width * this.position.y;
        this.position.tile = map.atts[x + this.map.width * y];
    }

    position_update() {
        this.position.index = this.position.x + this.map.width * this.position.y;
        this.position.tile = this.map.tiles[this.position.index];
        this.position.att = this.map.atts[this.position.index];
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

        if (!this.collision_check(next_position.x, next_position.y)) {
            this.moving = true;
            this.current_move_ticker = 0;
            
            switch (direction) {
                case 'North':
                    this.facing = 'North'; 
                    this.position.y--;   
                    this.position.f = 0;
                    break;
                case 'East':
                    this.facing = 'East'; 
                    this.position.x++;  
                    this.position.f = 1;
                    break;
                case 'South':
                    this.facing = 'South'; 
                    this.position.y++;   
                    this.position.f = 2;
                    break;
                case 'West':
                    this.facing = 'West'; 
                    this.position.x--;   
                    this.position.f = 3;
                    break;
                default:
                    break;
            }
            // console.log(`Moving (NPC ${this.index}):`, direction, this.position);
            
            // broadcast NPC movement to everyone in the room    
            io.to(this.lobby_id).emit('npc_moved', {
                uid: this.uid,
                position: this.position,
                moving: direction,
            }); 
        } else {
            // console.log(`Collision (NPC ${this.index}):`, direction, this.position);
        }

    }

    wander(that) {
        let movement_roll = Math.floor(Math.random() * 5) + 1, // 20% chance to move
            direction_roll = Math.floor(Math.random() * 3) + 1, // Random direction
            directions = ['North', 'South', 'East', 'West'];
        
        if (movement_roll == 1) {
           that.move(directions[direction_roll]);
        }
    }

    collision_check(x, y) {
        let lobby_index = find_lobby_index(this.lobby_id);

        // x-axis boundary check   
        if (x < 0 || x >= this.map.width) {
            return true;
        }
    
        // y-axis boundary check
        if (y < 0 || y >= this.map.height) {
            return true;
        }
    
        // attribute check
        switch (this.map.atts[x + this.map.width * y].type) {
            case 1: // Wall
            case 3: // Action
            case 6: // NPC Wall
            case 7: // Item
                return true;
                break;
            default:
                break;
        }
    
        // Player checks
        lobbies[lobby_index].trainers.forEach(trainer => {
            if (x == trainer.position.x && y == trainer.position.y) {
                return true;
            }       
        });
    
        lobbies[lobby_index].npcs.forEach(npc => {
            if (this.position.map == npc.position.map && x == npc.position.x && y == npc.position.y) {
                return true;
            }
        });
    
        return false;
    }
}