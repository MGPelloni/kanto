socket.on('npc_moved', function(data){
    npcs.forEach((npc) => { 
        if (npc.uid == data.uid) {
            npc.move(data.moving);
        }
    });
});

socket.on('map_server_sync', function(data){
    data.npcs.forEach(npc_server_data => {
        npcs.forEach(npc => {
            if (npc_server_data.uid == npc.uid) {
                npc.place(npc_server_data.position.x, npc_server_data.position.y, npc_server_data.position.f);
            }

            npc.sprite.visible = true;
        })
    });
});

socket.on('set_game_id', function(data){
    game_id = data.game_id;
    meta.game_id = data.game_id;
    meta.lobby_id = data.game_id;

    let url = new URL(window.location);
    url.searchParams.set('g', game_id);
    window.history.pushState({}, '', url);
});

socket.on('lobby_loaded', function(data){
    socket.emit('map_server_sync', {lobby_id: game_id, map: player.position.map});
});


socket.on('create_current_trainers', function(data){
    data.forEach(trainer => {
        let new_trainer = new Trainer(trainer.name, trainer.position, trainer.spritesheet_id, trainer.socket_id);
        trainers.push(new_trainer);
    });
});

socket.on('trainer_moved', function(data){
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

socket.on('trainer_joined', function(data){
    let new_trainer = new Trainer(data.name, data.position, data.spritesheet_id, data.socket_id);
    trainers.push(new_trainer);
});

socket.on('trainer_disconnected', function(data){
    trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data) {
            trainers[i].remove();
            trainers.splice(i, 1);
        }
    });
});

socket.on('trainer_faced', function(data){
    trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data.socket_id) {
            trainers[i].face_sprite(data.f)
        }
    });
});

socket.on('trainer_speed', function(data){
    trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data.socket_id) {
            trainers[i].speed = data.s
        }
    });
});

socket.on('trainer_sprite', function(data){
    trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data.socket_id) {
            trainers[i].change_spritesheet(data.spritesheet_id);
        }
    });
});

socket.on('trainer_name', function(data){
    trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data.socket_id) {
            trainers[i].name = data.name;
        }
    });
});

socket.on('trainer_entering_battle', function(data){
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

socket.on('trainer_exiting_battle', function(data){
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

socket.on('chat_trainer_message', function(data){
    chat.trainer_message(data.name, data.message, data.atts);
});

socket.on('chat_server_message', function(data){
    chat.server_message(data.message);
});

socket.on('wild_pokemon_battle', function(data){
    player.wild_pokemon_battle(data.pokemon);
});