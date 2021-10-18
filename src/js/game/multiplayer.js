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
    console.log('Socket.io [trainer_moved]', data.position);

    multiplayer.trainers.forEach((trainer, i) => {
        if (trainer.socket_id == data.socket_id) {
            multiplayer.trainers[i].position_update(data.position);
            multiplayer.trainers[i].move(data.facing);
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

function multiplayer_update_position() {
    let trainer = {
        position: {
            map: player.position.map,
            x: player.position.x,
            y: player.position.y
        },
        facing: player.facing
    };

    console.log(trainer);

    socket.emit('position_update', {lobby_id: meta.lobby_id, trainer: trainer});
}