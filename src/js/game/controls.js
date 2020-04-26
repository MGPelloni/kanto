window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);

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
            if (!player.sprite.playing || player.sprite.textures !== player.spritesheet.walkNorth) {
                player.sprite.textures = player.spritesheet.walkNorth;
                player.sprite.play();
                player.facing = 'North';
            }

            if (collision_check(player, player.position.x, player.position.y - 1) == false) {
                player.direction = 'North';
                player.moving = true;
                player.position.y--;
            }
        } else if (keys["83"] || keys["40"]) {
            if (!player.sprite.playing || player.sprite.textures !== player.spritesheet.walkSouth) {
                player.sprite.textures = player.spritesheet.walkSouth;
                player.sprite.play();
                player.facing = 'South';
            }

            if (collision_check(player, player.position.x, player.position.y + 1) == false) {
                player.direction = 'South';
                player.moving = true;
                player.position.y++;
            }
        } else if (keys["65"] || keys["37"]) {
            if (!player.sprite.playing || player.sprite.textures !== player.spritesheet.walkWest) {
                player.sprite.textures = player.spritesheet.walkWest;
                player.sprite.play();
                player.facing = 'West';
            }

            if (collision_check(player, player.position.x - 1, player.position.y) == false) {
                player.direction = 'West';
                player.moving = true;
                player.position.x--;
                
            }
        } else if (keys["68"]|| keys["39"]) {
            if (!player.sprite.playing || player.sprite.textures !== player.spritesheet.walkEast) {
                player.sprite.textures = player.spritesheet.walkEast;
                player.sprite.play();       
                player.facing = 'East';         
            }

            if (collision_check(player, player.position.x + 1, player.position.y) == false) {
                player.direction = 'East';
                player.moving = true;
                player.position.x++;
            }
        }
        
        if (keys["88"]) {
            // A Button
            if (player.can_check_action) {
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
            atts_container.y++;
        }

        // Down
        if (player.direction == 'South') {
            background.y--;
            atts_container.y--;
        }

        // Left
        if (player.direction == 'West') {
            background.x++;
            atts_container.x++;
        }

        // Right
        if (player.direction == 'East') {
            background.x--;
            atts_container.x--;
        }

        if (player.current_move_ticker >= 15) {
            player.moving = false;
            player.facing = player.direction;
            player.direction = null;
            player.can_move = false;


            setTimeout(() => {
                player.position_update();
                player.can_move = true;
                player.current_move_ticker = 0;

                console.log(player.position);
            }, 8)
        }
        
        player.current_move_ticker++;
    }
}


function editor_controls_loop() {
    if (editor.zoom_timeout == false && !player.moving && player.can_move) {
        if (keys["189"]) {
            app.renderer.resize(app.renderer.width + editor.zoom, app.renderer.height + editor.zoom);
            center_stage_assets();

            editor.zoom_timeout = true;
            setTimeout(() => {
                editor.zoom_timeout = false;
            }, 500)
        } 

        if (keys["187"]) {
            app.renderer.resize(app.renderer.width - editor.zoom, app.renderer.height - editor.zoom);
            center_stage_assets();

            editor.zoom_timeout = true;
            setTimeout(() => {
                editor.zoom_timeout = false;
            }, 500)
        } 
    }
}