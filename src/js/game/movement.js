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

    // atts collision check
    let array_pos = x + player.current_map.width * y;
    if (player.current_map.atts[array_pos].type == 1 || player.current_map.atts[array_pos].type == 3) {
        return true;
    }

    return false;
}