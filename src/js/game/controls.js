window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);

window.addEventListener("pointerdown", keysDown);
window.addEventListener("pointerup", keysUp);

function keysDown(e) {
    if (e.keyCode == "37" || e.keyCode == "38" || e.keyCode == "39" || e.keyCode == "40") {
        if (!paused) {
            e.preventDefault();
        }
    }

    if (e.target.getAttribute('data-action')) { // On screen gamepad
        switch (e.target.getAttribute('data-action')) {
            case 'up':
                e.keyCode = 38;
                break;
            case 'down':
                e.keyCode = 40;
                break;
            case 'left':
                e.keyCode = 37;
                break;
            case 'right':
                e.keyCode = 39;
                break;
            case 'action':
                e.keyCode = 88;
                break;
            default:
                break;
        }
    }

    keys[e.keyCode] = true;
}

function keysUp(e) {
    if (e.target.getAttribute('data-action')) { // On screen gamepad
        switch (e.target.getAttribute('data-action')) {
            case 'up':
                e.keyCode = 38;
                break;
            case 'down':
                e.keyCode = 40;
                break;
            case 'left':
                e.keyCode = 37;
                break;
            case 'right':
                e.keyCode = 39;
                break;
            case 'action':
                e.keyCode = 88;
                break;
            default:
                break;
        }
    }

    keys[e.keyCode] = false;
}

function controls_loop() {
    // console.log(keys);
    if (!player.moving && player.can_move && !paused) {
        if (!player.frozen) {
            let next_position = {
                x: player.position.x,
                y: player.position.y
            };

            if (keys["87"] || keys["38"]) {
                if (!player.sprite.playing || player.sprite.textures !== player.spritesheet.walkNorth) {
                    player.sprite.textures = player.spritesheet.walkNorth;
                    player.sprite.play();
                    player.facing = 'North';
                }

                next_position.y--;

                if (collision_check(next_position.x, next_position.y) == false) {
                    player.direction = 'North';
                    player.moving = true;
                    player.position.y--;
                } else {
                    if (exit_check()) { // Check if the player is at an exit
                        player.place(player.current_map.atts[player.position.index].x, player.current_map.atts[player.position.index].y, player.current_map.atts[player.position.index].map);
                        sfx.play('go-outside');
                    } else { // Collision into a barrier
                        sfx.play('collision');
                    }
                }


            } else if (keys["83"] || keys["40"]) {
                if (!player.sprite.playing || player.sprite.textures !== player.spritesheet.walkSouth) {
                    player.sprite.textures = player.spritesheet.walkSouth;
                    player.sprite.play();
                    player.facing = 'South';
                }

                next_position.y++;

                if (collision_check(next_position.x, next_position.y) == false) {
                    player.direction = 'South';
                    player.moving = true;
                    player.position.y++;
                } else {
                    if (exit_check()) { // Check if the player is at an exit
                        player.place(player.current_map.atts[player.position.index].x, player.current_map.atts[player.position.index].y, player.current_map.atts[player.position.index].map);
                        sfx.play('go-outside');
                    } else { // Collision into a barrier
                        sfx.play('collision');
                    }
                }
            } else if (keys["65"] || keys["37"]) {
                if (!player.sprite.playing || player.sprite.textures !== player.spritesheet.walkWest) {
                    player.sprite.textures = player.spritesheet.walkWest;
                    player.sprite.play();
                    player.facing = 'West';
                }

                next_position.x--;

                if (collision_check(next_position.x, next_position.y) == false) {
                    player.direction = 'West';
                    player.moving = true;
                    player.position.x--;
                } else {
                    if (exit_check()) { // Check if the player is at an exit
                        player.place(player.current_map.atts[player.position.index].x, player.current_map.atts[player.position.index].y, player.current_map.atts[player.position.index].map);
                        sfx.play('go-outside');
                    } else { // Collision into a barrier
                        sfx.play('collision');
                    }
                }

            } else if (keys["68"]|| keys["39"]) {
                if (!player.sprite.playing || player.sprite.textures !== player.spritesheet.walkEast) {
                    player.sprite.textures = player.spritesheet.walkEast;
                    player.sprite.play();       
                    player.facing = 'East';         
                }

                next_position.x++;

                if (collision_check(next_position.x, next_position.y) == false) {
                    player.direction = 'East';
                    player.moving = true;
                    player.position.x++;
                } else {
                    if (exit_check()) { // Check if the player is at an exit
                        player.place(player.current_map.atts[player.position.index].x, player.current_map.atts[player.position.index].y, player.current_map.atts[player.position.index].map);
                        sfx.play('go-outside');
                    } else { // Collision into a barrier
                        sfx.play('collision');
                    }
                }
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

            if (dialogue.active) {
                dialogue.next();
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
            npc_container.y++;
        }

        // Down
        if (player.direction == 'South') {
            background.y--;
            atts_container.y--;
            npc_container.y--;
        }

        // Left
        if (player.direction == 'West') {
            background.x++;
            atts_container.x++;
            npc_container.x++;
        }

        // Right
        if (player.direction == 'East') {
            background.x--;
            atts_container.x--;
            npc_container.x--;
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
            }, 8)
        }
        
        player.current_move_ticker++;
    }

    npcs.forEach((npc, i) => {
        if (npc.moving) {
            switch (npc.facing) {
                case 'North':
                    npc.sprite.y--; 
                    break;
                case 'South':
                    npc.sprite.y++; 
                    break;  
                case 'West':
                    npc.sprite.x--; 
                    break;      
                case 'East':
                    npc.sprite.x++; 
                    break;        
                default:
                    break;
            }

            if (npc.current_move_ticker >= 15) {
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
}


function editor_controls_loop() {
    if (!paused) {
        if (!editor.action_timeout && !player.moving && player.can_move) {
            if (keys["189"]) {
                app.renderer.resize(app.renderer.width + editor.zoom, app.renderer.height + editor.zoom);
                center_stage_assets();

                editor.action_timeout = true;
                setTimeout(() => {
                    editor.action_timeout = false;
                }, 500)
            } 

            if (keys["187"]) {
                app.renderer.resize(app.renderer.width - editor.zoom, app.renderer.height - editor.zoom);
                center_stage_assets();

                editor.action_timeout  = true;
                setTimeout(() => {
                    editor.action_timeout  = false;
                }, 500)
            } 
        }

        if (keys["69"]) { // E
            if (!editor.action_timeout && !player.moving) {
                
                expand_map(player.facing);

                editor.action_timeout = true;
                setTimeout(() => {
                    editor.action_timeout = false;
                }, 250)
            }        
        }

        if (keys["84"]) { // T
            if (!editor.action_timeout && !player.moving) {
                
                condense_map(player.facing);

                editor.action_timeout = true;
                setTimeout(() => {
                    editor.action_timeout = false;
                }, 250)
            }        
        }
    }
}