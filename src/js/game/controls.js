function keysDown(e) {
    if (e.keyCode == "37" || e.keyCode == "38" || e.keyCode == "39" || e.keyCode == "40") {
        e.preventDefault();
    }

    keys[e.keyCode] = true;
}

function keysUp(e) {
    keys[e.keyCode] = false;
}

function controls_loop() {
    if (!player.moving && player.can_move) {
        if (keys["87"] || keys["38"]) {
            if (!player.playing || player.textures !== playerSheet.walkNorth) {
                player.textures = playerSheet.walkNorth;
                player.play();
            }

            if (collision_check(player, player.game_pos.x, player.game_pos.y - 1) == false) {
                player.direction = 'North';
                player.moving = true;
                player.game_pos.y--;
            }
        } else if (keys["83"] || keys["40"]) {
            if (!player.playing || player.textures !== playerSheet.walkSouth) {
                player.textures = playerSheet.walkSouth;
                player.play();
            }

            if (collision_check(player, player.game_pos.x, player.game_pos.y + 1) == false) {
                player.direction = 'South';
                player.moving = true;
                player.game_pos.y++;
            }
        } else if (keys["65"] || keys["37"]) {
            if (!player.playing  || player.textures !== playerSheet.walkWest) {
                player.textures = playerSheet.walkWest;
                player.play();
            }

            if (collision_check(player, player.game_pos.x - 1, player.game_pos.y) == false) {
                player.direction = 'West';
                player.moving = true;
                player.game_pos.x--;
            }
        } else if (keys["68"]|| keys["39"]) {
            if (!player.playing || player.textures !== playerSheet.walkEast) {
                player.textures = playerSheet.walkEast;
                player.play();                
            }

            if (collision_check(player, player.game_pos.x + 1, player.game_pos.y) == false) {
                player.direction = 'East';
                player.moving = true;
                player.game_pos.x++;
            }
        }
        
        if (keys["88"]) {
            // A Button

            if (player.can_check_action) {
                console.log('A button');
                player.check_action(player.facing);
                player.can_check_action = false;

                setTimeout(() => {
                    player.can_check_action = true;
                }, 1000);
            }
        }

        if (keys["90"]) {
            // B Button

        }
    }
}


function move_loop() {
    if (player.moving) {
        // Up
        if (player.direction == 'North') {
            background.y++;
        }

        // Down
        if (player.direction == 'South') {
            background.y--;
        }

        // Left
        if (player.direction == 'West') {
            background.x++;
        }

        // Right
        if (player.direction == 'East') {
            background.x--;
        }

        if (player.current_move_ticker >= 15) {
            player.moving = false;
            player.facing = player.direction;
            player.direction = null;
            player.can_move = false;

            setTimeout(() => {
                console.log(player.game_pos);
                player.can_move = true;
                player.current_move_ticker = 0;
            }, 8)
        }
        
        player.current_move_ticker++;
    }
}
