io.on("connection", (socket) => { 
    console.log('New socket: ', socket.id);

    socket.on("join_lobby", (data) => {
        let trainer = new Trainer(socket.id, data.trainer.position, data.trainer.spritesheet_id);
        let targeted_lobby_index = null;
        
        lobbies.forEach((lobby, i) => {
            if (data.lobby_id == lobby.id) {
                targeted_lobby_index = i;
            }
        });

        if (targeted_lobby_index === null) { // Creating a new lobby
            lobbies.push(new Lobby(data.lobby_id, data.game_id, [trainer]))
        } else { // Lobby ID exists, joining current lobby
            socket.emit('create_current_trainers', lobbies[targeted_lobby_index].trainers);
            lobbies[targeted_lobby_index].trainers.push(trainer);
        }

        // const clients = io.sockets.adapter.rooms.get(data.lobby_id);
        
        // Rooms
        socket.join(data.lobby_id);
        socket.to(data.lobby_id).emit('trainer_joined', {
            name: 'BLUE',
            position: trainer.position,
            facing: trainer.facing,
            spritesheet_id: data.trainer.spritesheet_id, 
            socket_id: socket.id
        });

        let lobby_index = find_lobby_index(data.lobby_id);
        // console.log(lobbies[lobby_index].game.maps);
        // console.log(io.sockets.adapter.rooms);
    }); 

    socket.on("position_update", (data) => {
        // console.log("position_update", data);

        let lobby_index = find_lobby_index(data.lobby_id),
            trainer_index = find_trainer_index(lobby_index, socket.id);

        if (lobby_index !== null) {
            lobbies[lobby_index].trainers[trainer_index].position = data.trainer.position;
    
            socket.to(lobbies[lobby_index].id).emit('trainer_moved', {
                socket_id: lobbies[lobby_index].trainers[trainer_index].socket_id,
                position: lobbies[lobby_index].trainers[trainer_index].position,
                exiting: data.trainer.exiting
            });
        }
    });

    socket.on("facing_update", (data) => {
        // console.log("facing_update", data);
        let lobby_index = find_lobby_index(data.lobby_id),
            trainer_index = find_trainer_index(lobby_index, socket.id);

        if (lobby_index !== null) {
            lobbies[lobby_index].trainers[trainer_index].position.f = data.f;
    
            socket.to(lobbies[lobby_index].id).emit('trainer_faced', {
                socket_id: lobbies[lobby_index].trainers[trainer_index].socket_id,
                f: lobbies[lobby_index].trainers[trainer_index].position.f,
            });
        }
    });

    socket.on("speed_update", (data) => {
        // console.log("speed_update", data);

        let lobby_index = find_lobby_index(data.lobby_id),
            trainer_index = find_trainer_index(lobby_index, socket.id);

        if (lobby_index !== null) {
            lobbies[lobby_index].trainers[trainer_index].speed = data.s;
    
            socket.to(lobbies[lobby_index].id).emit('trainer_speed', {
                socket_id: lobbies[lobby_index].trainers[trainer_index].socket_id,
                s: lobbies[lobby_index].trainers[trainer_index].speed,
            });
        }
    });

    socket.on("spritesheet_update", (data) => {
        console.log("spritesheet_update", data);
        
        let lobby_index = find_lobby_index(data.lobby_id),
            trainer_index = find_trainer_index(lobby_index, socket.id);

        if (lobby_index !== null) {
            lobbies[lobby_index].trainers[trainer_index].spritesheet_id = data.spritesheet_id;
    
            socket.to(lobbies[lobby_index].id).emit('trainer_sprite', {
                socket_id: lobbies[lobby_index].trainers[trainer_index].socket_id,
                spritesheet_id: lobbies[lobby_index].trainers[trainer_index].spritesheet_id,
            });
        }
    });

    socket.on("map_server_sync", (data) => {
        console.log("map_server_sync", data);
        
        let lobby_index = find_lobby_index(data.lobby_id);
        let targeted_npcs = [];

        if (lobbies[lobby_index]) {
            lobbies[lobby_index].npcs.forEach(npc => {
                if (npc.position.map == data.map) {
                    targeted_npcs.push({
                        uid: npc.uid,
                        position: npc.position,
                    });
                }
            });
            
            socket.emit('map_server_sync', {npcs: targeted_npcs});
        }
    });

    socket.on("disconnecting", (reason) => {
        let targeted_room = null;

        socket.rooms.forEach(room => {
            if (room !== socket.id) {
                targeted_room = room;
            }
        });

        if (targeted_room) {
            let lobby_index = find_lobby_index(targeted_room),
                trainer_index = find_trainer_index(lobby_index, socket.id);

            lobbies[lobby_index].trainers.splice(trainer_index, 1);
        }

        io.to(targeted_room).emit('trainer_disconnected', socket.id); // broadcast to everyone in the room    
    });
});