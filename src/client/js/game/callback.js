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