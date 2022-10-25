/**
 * Check a tile to see if it is walled or if the next position is escaping the boundary.
 * 
 * @param {number} x The x-axis value to check.
 * @param {number} y The y-axis value to check.
 * @param {number} y The map id to check.
 */
function collision_check(x, y, map_id = null) {
    let tmap = map;

    if (map_id) {
        tmap = maps[map_id];    
    }

    // x-axis boundary check   
    if (x < 0 || x >= tmap.width) {
        return true;
    }

    // y-axis boundary check
    if (y < 0 || y >= tmap.height) {
        return true;
    }

    // attribute check
    switch (tmap.atts[x + tmap.width * y].type) {
        case 1: // Wall
        case 3: // Action
        case 7: // Item
            return true;
            break;
        default:
            break;
    }

    // player check
    if (x == player.position.x && y == player.position.y) {
        return true;
    }

    // npc + trainer check
    let collision = false;
    npcs.forEach(npc => {
        if (player.position.map == npc.position.map && x == npc.position.x && y == npc.position.y) {
            collision = true;
        }
    });

    trainers.forEach(trainer => {
        if (player.position.map == trainer.position.map && x == trainer.position.x && y == trainer.position.y) {
            collision = true;
        }
    });

    if (collision) { 
        return true;
    }

    return false;
}

function exit_check() {
    if (player.current_map.atts[player.position.index].type == 4) {  // Exiting the map
        return true;
    }

    return false;
}


// Main animation loop
function move_loop() {
    if (player.moving) {
        // Up
        if (player.direction == 'North') {
            background.y += player.speed;
            atts_container.y += player.speed;
            npc_container.y += player.speed;
            trainer_container.y += player.speed;
        }

        // Down
        if (player.direction == 'South') {
            background.y -= player.speed;
            atts_container.y -= player.speed;
            npc_container.y -= player.speed;
            trainer_container.y -= player.speed;
        }

        // Left
        if (player.direction == 'West') {
            background.x += player.speed;
            atts_container.x += player.speed;
            npc_container.x += player.speed;
            trainer_container.x += player.speed;
        }

        // Right
        if (player.direction == 'East') {
            background.x -= player.speed;
            atts_container.x -= player.speed;
            npc_container.x -= player.speed;
            trainer_container.x -= player.speed;
        }

        if (player.current_move_ticker >= (16 / player.speed - 1)) {
            player.moving = false;
            player.facing = player.direction;
            player.direction = null;
            player.can_move = false;


            setTimeout(() => {
                player.position_update();
                player.can_move = true;
                player.current_move_ticker = 0;
            }, (8 / player.speed))
        }
        
        player.current_move_ticker++;
    }

    npcs.forEach((npc, i) => {
        if (npc.moving && npc.can_move) {
            switch (npc.position.f) {
                case 0:
                    npc.sprite.y -= 0.5; 
                    break;    
                case 1:
                    npc.sprite.x += 0.5; 
                    break;   
                case 2:
                    npc.sprite.y += 0.5; 
                    break;
                case 3:
                    npc.sprite.x -= 0.5; 
                    break;  
                default:
                    break;
            }

            if (npc.current_move_ticker >= 31) {
                npc.moving = false;
                npc.can_move = false;

                setTimeout(() => {
                    npcs[i].position_update();
                    npcs[i].can_move = true;
                    npcs[i].current_move_ticker = 0;
                }, 8)
            }

            npc.current_move_ticker++;
        }        
    });

    trainers.forEach((trainer, i) => {
        if (trainer.moving) {
            switch (trainer.next_position.f) {
                case 0:
                    trainer.sprite.y -= trainer.speed;
                    trainer.emote.y -= trainer.speed; 
                    break;
                case 1:
                    trainer.sprite.x += trainer.speed;
                    trainer.emote.x += trainer.speed;
                    break; 
                case 2:
                    trainer.sprite.y += trainer.speed;
                    trainer.emote.y += trainer.speed;
                    break;  
                case 3:
                    trainer.sprite.x -= trainer.speed;
                    trainer.emote.x -= trainer.speed;
                    break;      
                default:
                    break;
            }

            if (trainer.current_move_ticker >= (16 / trainer.speed - 1)) {
                 trainer.moving = false;
                 trainer.position = trainer.next_position;
            }

            trainer.current_move_ticker++;
        }        
    });
}