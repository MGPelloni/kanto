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

function dialogue_found_item(args) {
    console.log('callback event: dialogue_found_item', args);

    if (args.name) {
        player.items.push(new Item(args.name));
        sfx.play('item-found');
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

function dialogue_take_item(args) {
    console.log('callback event: dialogue_take_item', args);

    if (args.name) {
        let item_removed = false;
        player.items.forEach((item, i) => {
            if (item.name == args.name && !item_removed) {
                delete_element_in_array(player.items, i);
                item_removed = true;
            }
        });
    }
}

function dialogue_wild_battle(args) {
    console.log('callback event: dialogue_wild_battle', args);
    socket.emit('dialogue_wild_battle', {lobby_id: lobby_id, trainer: trainer});
}

function dialogue_trainer_battle(args) {
    console.log('callback event: dialogue_trainer_battle', args);
    socket.emit('dialogue_trainer_battle', {lobby_id: lobby_id, trainer: trainer});
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

function dialogue_force_spin_north(args) {
    if (args.spaces) {
        player.force_move(0, parseInt(args.spaces), true);
    }
}

function dialogue_force_spin_east(args) {
    if (args.spaces) {
        player.force_move(1, parseInt(args.spaces), true);
    }
}

function dialogue_force_spin_south(args) {
    if (args.spaces) {
        player.force_move(2, parseInt(args.spaces), true);
    }
}

function dialogue_force_spin_west(args) {
    if (args.spaces) {
        player.force_move(3, parseInt(args.spaces), true);
    }
}
