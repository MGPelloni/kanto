/**
 * Check a tile to see if it is walled or if the next position is escaping the boundary.
 * 
 * @param {number} x The x-axis value to check.
 * @param {number} y The y-axis value to check.
 */
function collision_check(x, y) {
    // x-axis boundary check   
    if (x < 0 || x >= map.width) {
        return true;
    }

    // y-axis boundary check
    if (y < 0 || y >= map.height) {
        return true;
    }

    // attribute check
    switch (map.atts[x + map.width * y].type) {
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

    multiplayer.trainers.forEach(trainer => {
        if (player.position.map == trainer.position.map && x == trainer.position.x && y == trainer.position.y) {
            collision = true;
        }
    });

    if (collision) { 
        return true;
    }

    return false;
}

/**
 * Check a tile to see if it is walled or if the next position is escaping the boundary.
 * 
 * @param {number} x The x-axis value to check.
 * @param {number} y The y-axis value to check.
 */
 function trainer_collision_check(x, y) {
    // x-axis boundary check   
    if (x < 0 || x >= map.width) {
        return true;
    }

    // y-axis boundary check
    if (y < 0 || y >= map.height) {
        return true;
    }

    // attribute check
    switch (map.atts[x + map.width * y].type) {
        case 1: // Wall
        case 3: // Action
        case 7: // Item
            return true;
            break;
        default:
            break;
    }

    // npc check
    let npc_collision = false;
    npcs.forEach(npc => {
        if (x == npc.position.x && y == npc.position.y) {
            npc_collision = true;
        }
    });

    if (npc_collision) { 
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

// Disabling controls when element is clicked out of
if (game_mode == 'create') {
    document.addEventListener('click', e => {
        let game_elem = document.querySelector('#pkmn');

        if (document.activeElement === game_elem) {
            paused = false;
        } else {
            paused = true;
        }
    });
}