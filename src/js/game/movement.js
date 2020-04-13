function collision_check(player, x, y) {
    let array_pos = x + player.current_map.width * y;
    return player.current_map.atts[array_pos];
}