io.on("connection", (socket) => { 
    console.log('New socket: ', socket.id);

    socket.on("join_lobby", (data) => {
        let lobby_id = null;
        let game_id = data.game_id;

        let targeted_lobby_index = null;
        let new_game = false;

        // Check to see if the lobby exists
        if (data.lobby_id) {
            lobbies.forEach((lobby, i) => {
                if (data.lobby_id == lobby.id) {
                    lobby_id = lobby.id
                    targeted_lobby_index = i;
                }
            });
        }

        // They sent a game ID, but no lobby was found
        if (!lobby_id && game_id) {
            lobby_id = generate_game_id();
            io.to(socket.id).emit('set_lobby_id', {lobby_id: lobby_id});
        }

        // They sent no game ID or lobby ID
        if (!lobby_id && !game_id) {
            game_id = generate_game_id();
            lobby_id = generate_game_id();
            new_game = true;
            io.to(socket.id).emit('set_lobby_id', {lobby_id: lobby_id});
            io.to(socket.id).emit('set_game_id', {game_id: game_id});
        }

        let trainer = new Trainer(socket.id, lobby_id, data.trainer.name, data.trainer.position, data.trainer.spritesheet_id);
        socket.join(lobby_id);

        if (targeted_lobby_index === null) { // Creating a new lobby
            let new_lobby = new Lobby(lobby_id, game_id, [trainer], new_game);
            lobbies.push(new_lobby);
        } else { // Lobby ID exists, joining current lobby
            socket.emit('create_current_trainers', lobbies[targeted_lobby_index].trainers);
            lobbies[targeted_lobby_index].chat.direct_message(socket.id, `Welcome to Kanto. There are ${lobbies[targeted_lobby_index].trainers.length} other players in this game.`);
            lobbies[targeted_lobby_index].trainers.push(trainer);
            lobbies[targeted_lobby_index].chat.server_message(`${trainer.name} has connected.`);
        }

        // const clients = io.sockets.adapter.rooms.get(data.lobby_id);
        // Rooms
        
        socket.to(lobby_id).emit('trainer_joined', {
            name: trainer.name,
            position: trainer.position,
            spritesheet_id: data.trainer.spritesheet_id, 
            socket_id: socket.id
        });

        // console.log(lobbies[lobby_index].game.maps);
        // console.log(io.sockets.adapter.rooms);
    }); 

    socket.on("position_update", (data) => {
        let lobby_index = find_lobby_index(data.lobby_id),
            trainer_index = find_trainer_index(lobby_index, socket.id);

        if (lobby_index !== null && trainer_index !== null) {
            lobbies[lobby_index].trainers[trainer_index].position = data.trainer.position;
    
            lobbies[lobby_index].trainers[trainer_index].check_tile(lobby_index);

            socket.to(lobbies[lobby_index].id).emit('trainer_moved', {
                socket_id: lobbies[lobby_index].trainers[trainer_index].socket_id,
                position: lobbies[lobby_index].trainers[trainer_index].position,
                exiting: data.trainer.exiting
            });
        }
    });

    socket.on("facing_update", (data) => {
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

    socket.on("name_update", (data) => {
        let lobby_index = find_lobby_index(data.lobby_id),
            trainer_index = find_trainer_index(lobby_index, socket.id);

        if (lobby_index !== null) {
            lobbies[lobby_index].chat.server_message(`${lobbies[lobby_index].trainers[trainer_index].name} has changed their name to ${data.name}.`);
            lobbies[lobby_index].trainers[trainer_index].name = data.name;
    
            socket.to(lobbies[lobby_index].id).emit('trainer_name', {
                socket_id: lobbies[lobby_index].trainers[trainer_index].socket_id,
                name: lobbies[lobby_index].trainers[trainer_index].name,
            });
        }
    });


    socket.on("player_encounter", (data) => {
        console.log("player_encounter", data);
        
        let lobby_index = find_lobby_index(data.lobby_id),
            trainer_index = find_trainer_index(lobby_index, socket.id);

        if (lobby_index !== null) {
            let player = lobbies[lobby_index].trainers[trainer_index];
            let trainers_in_sight = [];

            switch (player.position.f) {
                case 0: // North
                    lobbies[lobby_index].trainers.forEach(trainer => {
                        if (trainer.in_battle) {
                            return;
                        }

                        if (trainer.position.map == player.position.map && trainer.position.x == player.position.x && trainer.position.y < player.position.y) {
                            if (player.position.y - trainer.position.y <= 5) {
                                trainers_in_sight.push(trainer);
                            }
                        }
                    });
                    break;
                case 1: // East
                    lobbies[lobby_index].trainers.forEach(trainer => {
                        if (trainer.in_battle) {
                            return;
                        }
                        
                        if (trainer.position.map == player.position.map && trainer.position.x > player.position.x && trainer.position.y == player.position.y) {
                            if (trainer.position.x - player.position.x <= 5) {
                                trainers_in_sight.push(trainer);
                            }
                        }
                    });
                    break;
                case 2: // South
                    lobbies[lobby_index].trainers.forEach(trainer => {
                        if (trainer.in_battle) {
                            return;
                        }

                        if (trainer.position.map == player.position.map && trainer.position.x == player.position.x && trainer.position.y > player.position.y) {
                            if (trainer.position.y - player.position.y <= 5) {
                                trainers_in_sight.push(trainer);
                            }
                        }
                    });
                    break;
                case 3: // West
                    lobbies[lobby_index].trainers.forEach(trainer => {
                        if (trainer.in_battle) {
                            return;
                        }
                        
                        if (trainer.position.map == player.position.map && trainer.position.x < player.position.x && trainer.position.y == player.position.y) {
                            if (player.position.x - trainer.position.x <= 5) {
                                trainers_in_sight.push(trainer);
                            }
                        }
                    });
                    break;
                default:
                    break;
            }

            if (trainers_in_sight.length > 0) {
                // socket.to(lobbies[lobby_index].id).emit('player_encounter', {
                //     player: player,
                //     trainer: trainers_in_sight[0]
                // });

                io.to(player.socket_id).emit('player_encounter', {
                    socket_id: trainers_in_sight[0].socket_id,
                });

                io.to(trainers_in_sight[0].socket_id).emit('player_encountered', {
                    socket_id: player.socket_id,
                });

                lobbies[lobby_index].chat.server_message(`${player.name} has challenged ${trainers_in_sight[0].name} to a BATTLE!`);
            }
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

            lobbies[lobby_index].chat.server_message(`${lobbies[lobby_index].trainers[trainer_index].name} has disconnected.`);
            lobbies[lobby_index].trainers.splice(trainer_index, 1);
        }

        io.to(targeted_room).emit('trainer_disconnected', socket.id); // broadcast to everyone in the room    
    });

    socket.on("chat_add_message", (data) => {
        let lobby_index = find_lobby_index(data.lobby_id),
            trainer_index = find_trainer_index(lobby_index, socket.id);
            
        if (lobby_index !== null && trainer_index !== null) {
            lobbies[lobby_index].chat.trainer_message(lobbies[lobby_index].trainers[trainer_index], data.message);
        }
    }); 

    socket.on("trainer_exiting_battle", (data) => {
        let lobby_index = find_lobby_index(data.lobby_id),
            trainer_index = find_trainer_index(lobby_index, socket.id);
            
        if (lobby_index !== null && trainer_index !== null) {
            lobbies[lobby_index].trainers[trainer_index].exiting_battle();
        }
    }); 

    // socket.on("create_mode_update_game", (data) => {
    //     let lobby_index = find_lobby_index(data.lobby_id);

    //     if (lobby_index !== null) {
    //         if (lobbies[lobby_index].game_id == data.game_id) {
    //             console.log('UPDATED', lobbies[lobby_index].game, data.game);
    //             lobbies[lobby_index].game = JSON.parse(data.game);
    //         }
    //     }
    // }); 

    socket.on("server_adjust_tile", (data) => {
        let lobby_index = find_lobby_index(data.lobby_id);

        if (lobby_index !== null) {
            if (lobbies[lobby_index].game_id == data.game_id) {
                lobbies[lobby_index].game.maps[data.map].tiles[data.index] = data.tile;
                console.log(lobbies[lobby_index].game.maps[data.map].tiles);

                socket.to(lobbies[lobby_index].id).emit('server_adjust_tile', {
                    map: data.map,
                    index: data.index,
                    tile: data.tile,
                });
            }
        }
    }); 

    socket.on("server_adjust_att", (data) => {
        let lobby_index = find_lobby_index(data.lobby_id);

        if (lobby_index !== null) {
            if (lobbies[lobby_index].game_id == data.game_id) {
                lobbies[lobby_index].game.maps[data.map].atts[data.index] = data.att;
                console.log(lobbies[lobby_index].game.maps[data.map].atts);
                
                socket.to(lobbies[lobby_index].id).emit('server_adjust_att', {
                    map: data.map,
                    index: data.index,
                    att: data.att,
                });
            }
        }
    }); 
        
    socket.on("server_expand_map", (data) => {
        let lobby_index = find_lobby_index(data.lobby_id);

        if (lobby_index !== null) {
            if (lobbies[lobby_index].game_id == data.game_id) {
                lobbies[lobby_index].game.maps[data.map] = expand_map(lobbies[lobby_index].game.maps[data.map], data.direction);

                socket.to(lobbies[lobby_index].id).emit('server_expand_map', {
                    map: data.map,
                    direction: data.direction,
                });
            }
        }
    });

    socket.on("server_condense_map", (data) => {
        let lobby_index = find_lobby_index(data.lobby_id);

        if (lobby_index !== null) {
            if (lobbies[lobby_index].game_id == data.game_id) {
                lobbies[lobby_index].game.maps[data.map] = condense_map(lobbies[lobby_index].game.maps[data.map], data.direction);

                socket.to(lobbies[lobby_index].id).emit('server_condense_map', {
                    map: data.map,
                    direction: data.direction,
                });
            }
        }
    });

    socket.on("server_create_map", (data) => {
        let lobby_index = find_lobby_index(data.lobby_id);

        if (lobby_index !== null) {
            if (lobbies[lobby_index].game_id == data.game_id) {
                lobbies[lobby_index].game.maps.push(data.map)

                socket.to(lobbies[lobby_index].id).emit('server_create_map', {
                    map: data.map,
                });
            }
        }
    });
});