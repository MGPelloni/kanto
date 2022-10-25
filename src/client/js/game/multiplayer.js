function multiplayer_join_lobby() {
    let trainer = {
        name: player.name,
        position: {
            map: player.position.map,
            x: player.position.x,
            y: player.position.y,
            f: 2
        },
        spritesheet_id: player.spritesheet_id,
    };

    socket.emit('join_lobby', {lobby_id: meta.lobby_id, game_id: GAME_ID, trainer: trainer});
}

function multiplayer_update_position(is_exiting = false) {
    let index = player.position.x + player.current_map.width * player.position.y;
    let att = player.current_map.atts[index];

    let trainer = {
        position: {
            map: player.position.map,
            x: player.position.x,
            y: player.position.y,
            f: player.position.f
        },
    };

    
    trainer.exiting = is_exiting;

    switch (att.type) {
        case 2: // Warp
            trainer.position = {
                map: att.map,
                x: att.x,
                y: att.y,
                f: player.position.f
            }

            trainer.exiting = true;
            break;
        default:
            break;
    }

    
    socket.emit('position_update', {lobby_id: meta.lobby_id, trainer: trainer});
}


function multiplayer_update_facing() {
    if (player.position.f !== player.last_position.f) {
        player.last_position.f = player.position.f;
        socket.emit('facing_update', {lobby_id: meta.lobby_id, f: player.position.f});
    }
}

function multiplayer_update_speed() {
    socket.emit('speed_update', {lobby_id: meta.lobby_id, s: player.speed});
}

function multiplayer_update_spritesheet() {
    socket.emit('spritesheet_update', {lobby_id: meta.lobby_id, spritesheet_id: player.spritesheet_id});
}

function multiplayer_update_name() {
    socket.emit('name_update', {lobby_id: meta.lobby_id, name: player.name});
}

function multiplayer_player_encounter() {
    socket.emit('player_encounter', {lobby_id: meta.lobby_id});
}