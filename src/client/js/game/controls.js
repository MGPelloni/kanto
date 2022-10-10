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
        e.preventDefault();

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
        e.preventDefault();
        
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
    if (!player.moving && player.can_move && !paused) {
        if (keys["87"] || keys["38"]) { // Up, W
            switch (player.controls) {
                case 'menu':
                    menus[player.menu.current].move_cursor('North');
                    break;
                default: // Walking
                    if (!player.frozen) {
                        player.move(0);
                    }
                    break;
            }
        } else if (keys["83"] || keys["40"]) { // Down, S  
            switch (player.controls) {
                case 'menu':
                    menus[player.menu.current].move_cursor('South');
                    break;
                default: // Walking
                    if (!player.frozen) {
                        player.move(2);
                    }
                    break;
            }
        } else if (keys["65"] || keys["37"]) { // Left, A
            switch (player.controls) {
                case 'menu':
                    break;
                default:
                    if (!player.frozen) {
                        player.move(3);    
                    }
                    break;
            }
        } else if (keys["68"]|| keys["39"]) { // Right, D
            switch (player.controls) {
                case 'menu':
                    break;
                default: // Walking
                    if (!player.frozen) {
                        player.move(1);
                    }
                    break;
            }
        }
    }
    
    if (keys["88"]) { // A Button
        if (dialogue.active) {
            if (dialogue.option_prompt_active) { 
                let current_menu = menus[player.menu.current],
                    selected_option = current_menu.options[current_menu.cursor.index];               
                    
                dialogue.selected_option(selected_option.name);
            } else {
                dialogue.next();
            }
            
            return;
        }

        switch (player.controls) {
            case 'menu':
                if (!player.menu.cooldown) {
                    setTimeout(() => {
                        player.menu.cooldown = false;
                    }, 300);

                    player.menu.cooldown = true;
                    sfx.play('action');

                    let current_menu = menus[player.menu.current],
                        selected_option = current_menu.options[current_menu.cursor.index];

                    switch (selected_option.type) {
                        case 'Item':
                            player.use_item(selected_option.name);
                            break;
                    
                        default:
                            break;
                    }

                    if (selected_option.callback) {
                        selected_option.callback();
                    } else if (selected_option.open_menu) {
                        menus.forEach((menu, i) => {
                            if (menu.name == selected_option.open_menu) {
                                player.menu.current = i;
                                player.menu.history.push(i);
                                menu.open();
                            }
                        });
                    }
                }

                break;
            default: // Walking
                if (player.can_check_action) {
                    player.check_action(player.position.f);
                    player.can_check_action = false;

                    setTimeout(() => {
                        player.can_check_action = true;
                    }, 1000);
                }
        }
    }

    if (keys["90"]) { // B Button
        switch (player.controls) {
            case 'menu':
                if (!player.menu.cooldown) {
                    setTimeout(() => {
                        player.menu.cooldown = false;
                    }, 300);

                    player.menu.cooldown = true;
                    sfx.play('action');
                    menus[player.menu.current].close();
                }
                break;
            default: // Walking
                if (player.can_check_action && !player.frozen && !player.menu.cooldown) {
                    multiplayer_player_encounter();
                    player.can_check_action = false;

                    setTimeout(() => {
                        player.can_check_action = true;
                    }, 1000);
                }
                break;
        }
    }

    if (keys["13"]) { // Enter
        if (!player.frozen) {
            if (!player.menu.cooldown) {
                if (menu_container.visible) {
                    if (player.menu.history.length == 1) { // Viewing the start menu, can close with START
                        if (!player.menu.cooldown) {
                            setTimeout(() => {
                                player.menu.cooldown = false;
                            }, 300);
        
                            player.menu.cooldown = true;
                            sfx.play('action');
                            menus[player.menu.current].close();
                        }
                    }
                } else {
                    sfx.play('start-menu');
                    kanto_update_menus();

                    menu_container.visible = true;
                    menus[0].open();
                    
                    player.menu.history.push(0);
                    player.menu.current = 0;
                    player.menu.active = true;
                    player.controls = 'menu';
                }

                setTimeout(() => {
                    player.menu.cooldown = false;
                }, 300);

                player.menu.cooldown = true;
            }
        } 
    }

    if (keys["16"]) { // Shift
        player.speed = 2;
    }
}

// Main animation loop
function move_loop() {
    if (player.moving) {
        // Up
        if (player.direction == 'North') {
            background.y += player.speed;
            atts_container.y += player.speed;
            npc_container.y += player.speed;
            multiplayer_container.y += player.speed;
        }

        // Down
        if (player.direction == 'South') {
            background.y -= player.speed;
            atts_container.y -= player.speed;
            npc_container.y -= player.speed;
            multiplayer_container.y -= player.speed;
        }

        // Left
        if (player.direction == 'West') {
            background.x += player.speed;
            atts_container.x += player.speed;
            npc_container.x += player.speed;
            multiplayer_container.x += player.speed;
        }

        // Right
        if (player.direction == 'East') {
            background.x -= player.speed;
            atts_container.x -= player.speed;
            npc_container.x -= player.speed;
            multiplayer_container.x -= player.speed;
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

    multiplayer.trainers.forEach((trainer, i) => {
        if (trainer.moving && trainer.can_move) {
            if (!trainer.colliding) {
                switch (trainer.position.f) {
                    case 0:
                        trainer.sprite.y -= trainer.speed; 
                        break;
                    case 1:
                        trainer.sprite.x += trainer.speed;
                        break; 
                    case 2:
                        trainer.sprite.y += trainer.speed;
                        break;  
                    case 3:
                        trainer.sprite.x -= trainer.speed;
                        break;      
                    default:
                        break;
                }
            }

            if (trainer.current_move_ticker >= (16 / trainer.speed - 1)) {
                trainer.moving = false;
                trainer.can_move = false;

                setTimeout(() => {
                    multiplayer.trainers[i].can_move = true;
                    multiplayer.trainers[i].current_move_ticker = 0;
                    multiplayer.trainers[i].position_update(multiplayer.trainers[i].next_position, multiplayer.trainers[i].facing);
                }, (8 / trainer.speed))
            }

            trainer.current_move_ticker++;
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