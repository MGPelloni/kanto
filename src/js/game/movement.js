/**
 * Check a tile to see if it is walled or if the player is escaping the boundary.
 * 
 * @param {Player} player The current player.
 * @param {number} x The x-axis value to check.
 * @param {number} y The y-axis value to check.
 */
function collision_check(player, x, y) {
    // x-axis boundary check   
    if (x < 0 || x >= map.width) {
        return true;
    }

    // y-axis boundary check
    if (y < 0 || y >= map.height) {
        return true;
    }

    // attribute check
    switch (player.current_map.atts[x + player.current_map.width * y].type) {
        case 1: // Wall
        case 3: // Action
            return true;
            break;
        default:
            break;
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
// document.addEventListener('click', e => {
//     let game_elem = document.querySelector('#pkmn');

//     if (document.activeElement === game_elem) {
//         paused = false;
//     } else {
//         paused = true;
//     }
// });