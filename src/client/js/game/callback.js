function dialogue_sfx(args) {
    console.log('callback event: dialogue_sfx', args);

    if (args.name) {
        sfx.play(args.name);
    }
}

function dialogue_cry_sfx(args) {
    console.log('callback event: dialogue_cry_sfx', args);

    if (args.id) {
        sfx.cry(args.id);
    }
}

function dialogue_give_item(args) {
    console.log('callback event: dialogue_give_item', args);

    if (args.name) {
        music.stop();
        player.items.push(new Item(args.name));
        sfx.play('item-received');

        setTimeout(() => {
            music.play();
        }, 4000)
    }
}

function dialogue_wild_battle(args) {
    console.log('callback event: dialogue_wild_battle', args);
    socket.emit('dialogue_wild_battle', {lobby_id: meta.lobby_id, trainer: trainer});
}

function dialogue_trainer_battle(args) {
    console.log('callback event: dialogue_trainer_battle', args);
    socket.emit('dialogue_trainer_battle', {lobby_id: meta.lobby_id, trainer: trainer});
}

function dialogue_force_move_north(args) {
    if (args.spaces) {
        player.force_move(0, parseInt(args.spaces));
    }
}

function dialogue_force_move_east(args) {
    if (args.spaces) {
        player.force_move(1, parseInt(args.spaces));
    }
}

function dialogue_force_move_south(args) {
    if (args.spaces) {
        player.force_move(2, parseInt(args.spaces));
    }
}

function dialogue_force_move_west(args) {
    if (args.spaces) {
        player.force_move(3, parseInt(args.spaces));
    }
}