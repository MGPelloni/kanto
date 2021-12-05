socket.on('connect', function() {
    console.log('Socket.io [connect]');
});

socket.on('create_current_trainers', function(data){
    console.log('Socket.io [create_current_trainers]', data);
    
    data.forEach(trainer => {
        let new_trainer = new Trainer(trainer.name, trainer.position, trainer.facing, trainer.spritesheet_id, trainer.socket_id);
        multiplayer.trainers.push(new_trainer);
    });
});

socket.on('trainer_moved', function(data){
    // console.log('Socket.io [trainer_moved]', data.position, data.facing);

    multiplayer.trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data.socket_id) {
            multiplayer.trainers[i].move(data.facing);     
            multiplayer.trainers[i].next_position = data.position;

            if (data.exiting) {
                console.log('Exiting', data.position);
                if (data.position.map == player.position.map) {
                    multiplayer.trainers[i].sprite.visible = false;
                } else {
                    multiplayer.trainers[i].sprite.x = data.position.x * TILE_SIZE;
                    multiplayer.trainers[i].sprite.y = data.position.y * TILE_SIZE;
                    multiplayer.trainers[i].sprite.visible = true;
                }
            }
        }
    });
});

socket.on('trainer_joined', function(data){
    let new_trainer = new Trainer(data.name, data.position, data.facing, data.spritesheet_id, data.socket_id);
    console.log('Socket.io [trainer_joined]', new_trainer);
    multiplayer.trainers.push(new_trainer);
});

socket.on('trainer_disconnected', function(data){
    console.log('Socket.io [trainer_disconnected]');

    multiplayer.trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data) {
            multiplayer.trainers[i].remove();
            multiplayer.trainers.splice(i, 1);
        }
    });
});

socket.on('join_lobby_success', function(data){
    console.log('Socket.io [join_lobby_success', data);
});

function multiplayer_join_lobby() {
    let trainer = {
        position: {
            map: player.position.map,
            x: player.position.x,
            y: player.position.y
        },
        facing: player.facing,
        spritesheet_id: player.spritesheet_id,
    };

    socket.emit('join_lobby', {lobby_id: meta.lobby_id, trainer: trainer});
}

function multiplayer_update_position(is_exiting = false) {
    let index = player.position.x + player.current_map.width * player.position.y;
    let att = player.current_map.atts[index];

    let trainer = {
        position: {
            map: player.position.map,
            x: player.position.x,
            y: player.position.y
        },
        facing: player.facing
    };
    
    switch (att.type) {
        case 2: // Warp
            trainer.position = {
                map: att.map,
                x: att.x,
                y: att.y
            }
            break;
        default:
            break;
    }

    trainer.exiting = is_exiting;

    socket.emit('position_update', {lobby_id: meta.lobby_id, trainer: trainer});
}