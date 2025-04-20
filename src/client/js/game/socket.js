socket.on('npc_moved', (data) => {
    npcs.forEach((npc) => { 
        if (npc.uid == data.uid) {
            npc.move(data.moving);
        }
    });
});

socket.on('map_server_sync', (data) => {
    data.npcs.forEach(npc_server_data => {
        npcs.forEach(npc => {
            if (npc_server_data.uid == npc.uid) {
                npc.place(npc_server_data.position.x, npc_server_data.position.y, npc_server_data.position.f);
            }

            npc.sprite.visible = true;
        })
    });
});

socket.on('set_game_id', (data) => {
    game_id = data.game_id;

    let url = new URL(window.location);
    url.searchParams.set('g', game_id);
    window.history.pushState({}, '', url);
});

socket.on('set_lobby_id', (data) => {
    lobby_id = data.lobby_id

    let url = new URL(window.location);
    url.searchParams.set('l', lobby_id);
    window.history.pushState({}, '', url);
});

socket.on('lobby_loaded', (data) => {
    socket.emit('map_server_sync', {lobby_id: lobby_id, map: player.position.map});
});

socket.on('player_sync', (data) => {
    player.pokemon = data.pokemon;
    // player.items = data.items;

    player.pokemon.forEach(pokemon => {
        player.pokedex.add(pokemon.id);
    });

    if (data.position) {
        player.place(data.position.x, data.position.y, data.position.map);
    }

    console.log('[player_sync]', data.pokemon);
});


socket.on('create_current_trainers', (data) => {
    data.forEach(trainer => {
        let new_trainer = new Trainer(trainer.name, trainer.position, trainer.spritesheet_id, trainer.socket_id);
        trainers.push(new_trainer);
    });
});

socket.on('trainer_moved', (data) => {
    console.log('[trainer_moved]', data.position);

    trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data.socket_id) {
            if (data.exiting) {
                trainer.position = data.position;
                trainer.next_position = data.position;

                if (data.position.map !== player.position.map) {
                    trainer.sprite.visible = false;
                } else {
                    trainer.sprite.visible = true;
                }

                trainer.position_update(data.position);
            } else {
                if (trainer.moving) { // Received movement data before animation was finished
                    trainer.position_update(trainer.next_position);
                    trainer.position = trainer.next_position;
                }

                if (data.position.map !== player.position.map) {
                    trainer.sprite.visible = false;
                } else {
                    trainer.sprite.visible = true;
                }
    
                trainer.next_position = data.position;
                trainer.move(data.position.f);
            }
        }
    });
});

socket.on('trainer_joined', (data) => {
    let new_trainer = new Trainer(data.name, data.position, data.spritesheet_id, data.socket_id);
    trainers.push(new_trainer);
});

socket.on('trainer_disconnected', (data) => {
    trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data) {
            trainers[i].remove();
            trainers.splice(i, 1);
        }
    });
});

socket.on('trainer_faced', (data) => {
    trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data.socket_id) {
            trainers[i].face_sprite(data.f)
        }
    });
});

socket.on('trainer_speed', (data) => {
    trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data.socket_id) {
            trainers[i].speed = data.s
        }
    });
});

socket.on('trainer_sprite', (data) => {
    trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data.socket_id) {
            trainers[i].change_spritesheet(data.spritesheet_id);
        }
    });
});

socket.on('trainer_name', (data) => {
    trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data.socket_id) {
            trainers[i].name = data.name;
        }
    });
});

socket.on('trainer_entering_battle', (data) => {
    trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data.socket_id) {
            trainers[i].display_emote('shock');
            trainers[i].sprite.alpha = 0.75;
            
            trainers[i].battle_animation = setInterval(() => {
                if (trainers[i].sprite.alpha == 0.75) {
                    trainers[i].sprite.alpha = 0.55;
                } else {
                    trainers[i].sprite.alpha = 0.75;
                }
            }, 250);

            trainers[i].in_battle = true;
        }
    });
});

socket.on('trainer_exiting_battle', (data) => {
    trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data.socket_id) {
            trainers[i].emote.visible = false;
            trainers[i].sprite.alpha = 1;
            trainers[i].in_battle = false;
            clearInterval(trainers[i].battle_animation);
        }
    });
});

socket.on("player_encounter", (data) => {
    let targeted_trainer = null;

    trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data.socket_id) {
            targeted_trainer = trainer;
        }
    });

    if (targeted_trainer) {
        player.encounter(targeted_trainer); 
    }
});

socket.on("player_encountered", (data) => {
    player.encountered(); 

    trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data.socket_id) {
            trainer.encounter();
        }
    }); 
});

socket.on('chat_trainer_message', (data) => {
    chat.trainer_message(data.name, data.message, data.atts);
});

socket.on('chat_server_message', (data) => {
    chat.server_message(data.message);
});

socket.on('wild_pokemon_battle', (data) => {
    console.log('[wild_pokemon_battle]', data);
    battle = {
        pokemon: data.pokemon,
        wild: true,
    }
    player.wild_pokemon_battle(data.pokemon);
});

socket.on('server_adjust_tile', (data) => {
    maps[data.map].tiles[data.index] = data.tile;

    if (map.id == data.map) {
        map.tiles[data.index] = data.tile;        
        background.children[data.index].texture = tile_textures[data.tile];
    }
});

socket.on('server_adjust_att', (data) => {
    maps[data.map].atts[data.index] = data.att;

    if (map.id == data.map) {
        map.atts[data.index] = data.att;    
        console.log(data.att);
        atts_container.children[data.index].tint = editor.get_att_color(data.att.type);

        if (data.att.type == 0) {
            atts_container.children[data.index].alpha = 0;
        } else {
            atts_container.children[data.index].alpha = 1;
        }
        
        map.build_npcs(); // reset npcs
        map.server_sync();
    }
});

socket.on('server_adjust_property', (data) => {
    maps[data.map][data.property] = data.value;

    if (map.id == data.map) {
        map[data.property] = data.value;
    }
});

socket.on("server_expand_map", (data) => {
    if (map.id == data.map) {
        expand_map(data.direction);
    }
});

socket.on("server_condense_map", (data) => {
    if (map.id == data.map) {
        condense_map(data.direction);
    }
});

socket.on("server_create_map", (data) => {
    let kanto_map = new Kanto_Map(data.map.id, data.map.name, data.map.width, data.map.height, data.map.tiles, data.map.atts, data.map.music, data.map.starting_position);
    maps.push(kanto_map);
    editor.update();
});

// socket.on("battle_move", (data) => {
//     console.log('[battle_move]', data);
//     dialogue.add_message(`${data.attacker.toUpperCase()} used ${data.moveName}!`);
// });

socket.on("battle_result", (data) => {
    console.log('[battle_result]', data);
    dialogue.queue_messages(data.messages);
});