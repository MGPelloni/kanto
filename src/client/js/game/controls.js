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
            case 'back':
                e.keyCode = 90;
                break;
            case 'start':
                e.keyCode = 77;
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
            case 'back':
                e.keyCode = 90;
                break;
            case 'start':
                e.keyCode = 77;
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
        if (paused) {
            return;
        }

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
            case 'battle':

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
        if (paused) {
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
        let input = document.querySelector('#chat-input');

        if (!chat.cooldown) {
            chat.cooldown = true;

            if (document.activeElement === input) {
                document.querySelector('#pkmn').focus();

                if (input.value) {
                    chat.emit_message(input.value);
                    input.value = '';
                }

                paused = false;
            } else {
                input.focus();
                paused = true;
            }

            setTimeout(() => {
                chat.cooldown = false;
            }, 300);
        }
    }

    if (keys["77"]) { // M
        if (!player.frozen && !paused) {
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
                socket.emit('server_expand_map', {lobby_id: lobby_id, game_id: game_id, map: map.id, direction: player.facing});
                editor.action_timeout = true;

                setTimeout(() => {
                    editor.action_timeout = false;
                }, 250)
            }        
        }

        if (keys["84"]) { // T
            if (!editor.action_timeout && !player.moving) {
                condense_map(player.facing);
                socket.emit('server_condense_map', {lobby_id: lobby_id, game_id: game_id, map: map.id, direction: player.facing});
                editor.action_timeout = true;
                
                setTimeout(() => {
                    editor.action_timeout = false;
                }, 250)
            }        
        }
    }
}